package services

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

// GitHub API types
type GitHubTag struct {
	Name   string `json:"name"`
	Commit struct {
		SHA string `json:"sha"`
	} `json:"commit"`
}

type GitHubIssue struct {
	Number int    `json:"number"`
	Title  string `json:"title"`
	State  string `json:"state"`
	URL    string `json:"url"`
	Body   string `json:"body"`
	Labels []struct {
		Name string `json:"name"`
	} `json:"labels"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// API Response types
type SupportStatus string

const (
	Recommended SupportStatus = "recommended"
	Latest      SupportStatus = "latest"
	Active      SupportStatus = "active"
	Deprecated  SupportStatus = "deprecated"
	EOL         SupportStatus = "eol"
)

type PlatformType string

const (
	Windows PlatformType = "windows"
	Linux   PlatformType = "linux"
)

type Artifact struct {
	Version       string        `json:"version"`
	Hash          string        `json:"hash"`
	Platform      PlatformType  `json:"platform"`
	Date          string        `json:"date"`
	SupportStatus SupportStatus `json:"supportStatus"`
	URL           string        `json:"url"`
	Size          int64         `json:"size,omitempty"`
}

type ArtifactData struct {
	Windows map[string]Artifact `json:"windows"`
	Linux   map[string]Artifact `json:"linux"`
}

type ArtifactsQuery struct {
	Platform   string
	Version    string
	Status     SupportStatus
	SortBy     string
	SortOrder  string
	Limit      int
	Offset     int
	IncludeEOL bool
}

type ArtifactEntry struct {
	Version       string
	Hash          string
	Platform      PlatformType
	Date          string
	SupportStatus SupportStatus
	URL           string
	Size          int64
}

// Cache structures
type cacheEntry struct {
	data      interface{}
	timestamp int64
}

type ArtifactsService struct {
	githubToken string
	cache       map[string]*cacheEntry
	httpClient  *http.Client
}

const (
	cacheDuration       = 3600000 // 1 hour in milliseconds
	issuesCacheDuration = 1800000 // 30 minutes in milliseconds
	maxRetries          = 3
	retryDelay          = 1000 // 1 second in milliseconds
	rateLimitDelay      = 1000 // 1 second in milliseconds
)

var (
	artifactVersionRegex = regexp.MustCompile(`^v\d+\.\d+\.\d+\.\d+$`)
	versionNumberRegex   = regexp.MustCompile(`v\d+\.\d+\.\d+\.(\d+)$`)
)

func NewArtifactsService(githubToken string) *ArtifactsService {
	return &ArtifactsService{
		githubToken: githubToken,
		cache:       make(map[string]*cacheEntry),
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}
}

// FetchGitHubTags fetches all tags from the FiveM GitHub repository
func (s *ArtifactsService) FetchGitHubTags(useCache bool) ([]GitHubTag, error) {
	if useCache {
		if cached := s.getCache("tags"); cached != nil {
			if tags, ok := cached.([]GitHubTag); ok {
				return tags, nil
			}
		}
	}

	url := "https://api.github.com/repos/citizenfx/fivem/tags?per_page=100"
	tags, err := s.fetchFromGitHub(url)
	if err != nil {
		// Return cached data even if stale
		if cached := s.getCache("tags"); cached != nil {
			if tags, ok := cached.([]GitHubTag); ok {
				return tags, nil
			}
		}
		return nil, fmt.Errorf("failed to fetch GitHub tags: %w", err)
	}

	s.setCache("tags", tags, cacheDuration)
	return tags, nil
}

// FetchGitHubIssues fetches issues from the FiveM GitHub repository
func (s *ArtifactsService) FetchGitHubIssues(useCache bool) ([]GitHubIssue, error) {
	if useCache {
		if cached := s.getCache("issues"); cached != nil {
			if issues, ok := cached.([]GitHubIssue); ok {
				return issues, nil
			}
		}
	}

	allIssues := []GitHubIssue{}
	page := 1
	perPage := 100
	maxPages := 10

	for page <= maxPages {
		url := fmt.Sprintf(
			"https://api.github.com/repos/citizenfx/fivem/issues?state=all&per_page=%d&page=%d",
			perPage, page,
		)

		var pageIssues []GitHubIssue
		if err := s.fetchJSONFromGitHub(url, &pageIssues); err != nil {
			if page == 1 && len(allIssues) == 0 {
				// Return cached data even if stale
				if cached := s.getCache("issues"); cached != nil {
					if issues, ok := cached.([]GitHubIssue); ok {
						return issues, nil
					}
				}
				return nil, fmt.Errorf("failed to fetch GitHub issues: %w", err)
			}
			break
		}

		if len(pageIssues) == 0 {
			break
		}

		allIssues = append(allIssues, pageIssues...)

		if len(pageIssues) < perPage {
			break
		}

		page++

		// Rate limiting
		if page <= maxPages {
			time.Sleep(time.Duration(rateLimitDelay) * time.Millisecond)
		}
	}

	s.setCache("issues", allIssues, issuesCacheDuration)
	return allIssues, nil
}

// ProcessGitHubTags processes raw GitHub tags into artifact data
func (s *ArtifactsService) ProcessGitHubTags(tags []GitHubTag) ArtifactData {
	processedData := ArtifactData{
		Windows: make(map[string]Artifact),
		Linux:   make(map[string]Artifact),
	}

	// Filter and sort tags
	var artifactTags []GitHubTag
	for _, tag := range tags {
		if artifactVersionRegex.MatchString(tag.Name) {
			artifactTags = append(artifactTags, tag)
		}
	}

	// Sort by version number (descending)
	sort.Slice(artifactTags, func(i, j int) bool {
		versionA := s.extractVersionNumber(artifactTags[i].Name)
		versionB := s.extractVersionNumber(artifactTags[j].Name)
		return versionA > versionB
	})

	now := time.Now().UTC().Format(time.RFC3339)

	for _, tag := range artifactTags {
		versionNumber := s.extractVersionNumber(tag.Name)
		version := strconv.Itoa(versionNumber)

		baseEntry := Artifact{
			Version:       version,
			Hash:          tag.Commit.SHA,
			Date:          now,
			SupportStatus: s.determineSupportStatus(versionNumber),
		}

		// Windows artifact
		windowsArtifact := baseEntry
		windowsArtifact.Platform = Windows
		windowsArtifact.URL = fmt.Sprintf(
			"https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/%s-%s/server.zip",
			version, tag.Commit.SHA,
		)
		windowsArtifact.Size = s.estimateSize(version, "windows")
		processedData.Windows[version] = windowsArtifact

		// Linux artifact
		linuxArtifact := baseEntry
		linuxArtifact.Platform = Linux
		linuxArtifact.URL = fmt.Sprintf(
			"https://runtime.fivem.net/artifacts/fivem/build_proot_linux/master/%s-%s/fx.tar.xz",
			version, tag.Commit.SHA,
		)
		linuxArtifact.Size = s.estimateSize(version, "linux")
		processedData.Linux[version] = linuxArtifact
	}

	// If no artifacts, use fallback
	if len(processedData.Windows) == 0 {
		return s.generateFallbackData()
	}

	return processedData
}

// FilterArtifacts filters artifacts based on query parameters
func (s *ArtifactsService) FilterArtifacts(artifacts []ArtifactEntry, query ArtifactsQuery) []ArtifactEntry {
	filtered := artifacts

	// Platform filter
	if query.Platform != "" && query.Platform != "all" {
		filtered = filterSlice(filtered, func(a ArtifactEntry) bool {
			return string(a.Platform) == query.Platform
		})
	}

	// Version filter (exact match)
	if query.Version != "" {
		filtered = filterSlice(filtered, func(a ArtifactEntry) bool {
			return a.Version == query.Version
		})
	}

	// Support status filter
	if query.Status != "" {
		filtered = filterSlice(filtered, func(a ArtifactEntry) bool {
			return a.SupportStatus == query.Status
		})
	}

	// Include/exclude EOL artifacts
	if !query.IncludeEOL {
		filtered = filterSlice(filtered, func(a ArtifactEntry) bool {
			return a.SupportStatus != EOL
		})
	}

	return filtered
}

// SortArtifacts sorts artifacts by version or date
func (s *ArtifactsService) SortArtifacts(artifacts []ArtifactEntry, sortBy, sortOrder string) []ArtifactEntry {
	if sortBy == "" {
		sortBy = "version"
	}
	if sortOrder == "" {
		sortOrder = "desc"
	}

	sorted := make([]ArtifactEntry, len(artifacts))
	copy(sorted, artifacts)

	sort.Slice(sorted, func(i, j int) bool {
		var compareValue int

		switch sortBy {
		case "version":
			versionA := s.parseVersion(sorted[i].Version)
			versionB := s.parseVersion(sorted[j].Version)
			compareValue = versionA - versionB

		case "date":
			dateA, _ := time.Parse(time.RFC3339, sorted[i].Date)
			dateB, _ := time.Parse(time.RFC3339, sorted[j].Date)
			if dateA.Before(dateB) {
				compareValue = -1
			} else if dateA.After(dateB) {
				compareValue = 1
			}

		case "size":
			sizeA := sorted[i].Size
			sizeB := sorted[j].Size
			if sizeA < sizeB {
				compareValue = -1
			} else if sizeA > sizeB {
				compareValue = 1
			}

		default:
			compareValue = strings.Compare(sorted[i].Version, sorted[j].Version)
		}

		if sortOrder == "asc" {
			return compareValue < 0
		}
		return compareValue > 0
	})

	return sorted
}

// PaginateArtifacts applies pagination to artifacts
func (s *ArtifactsService) PaginateArtifacts(artifacts []ArtifactEntry, limit, offset int) []ArtifactEntry {
	if offset < 0 || offset >= len(artifacts) {
		return []ArtifactEntry{}
	}

	end := offset + limit
	if end > len(artifacts) {
		end = len(artifacts)
	}

	return artifacts[offset:end]
}

// GetArtifacts returns the full list of artifacts with filtering and pagination
func (s *ArtifactsService) GetArtifacts(query ArtifactsQuery) ([]ArtifactEntry, error) {
	tags, err := s.FetchGitHubTags(true)
	if err != nil {
		return nil, err
	}

	processedData := s.ProcessGitHubTags(tags)

	// Flatten to slice
	var artifacts []ArtifactEntry
	for version, artifact := range processedData.Windows {
		artifacts = append(artifacts, ArtifactEntry{
			Version:       version,
			Hash:          artifact.Hash,
			Platform:      Windows,
			Date:          artifact.Date,
			SupportStatus: artifact.SupportStatus,
			URL:           artifact.URL,
			Size:          artifact.Size,
		})
	}
	for version, artifact := range processedData.Linux {
		artifacts = append(artifacts, ArtifactEntry{
			Version:       version,
			Hash:          artifact.Hash,
			Platform:      Linux,
			Date:          artifact.Date,
			SupportStatus: artifact.SupportStatus,
			URL:           artifact.URL,
			Size:          artifact.Size,
		})
	}

	// Apply filtering
	filtered := s.FilterArtifacts(artifacts, query)

	// Apply sorting
	sorted := s.SortArtifacts(filtered, query.SortBy, query.SortOrder)

	// Apply pagination
	if query.Limit == 0 {
		query.Limit = 50
	}
	paginated := s.PaginateArtifacts(sorted, query.Limit, query.Offset)

	return paginated, nil
}

// Helper methods

func (s *ArtifactsService) extractVersionNumber(tagName string) int {
	matches := versionNumberRegex.FindStringSubmatch(tagName)
	if len(matches) > 1 {
		num, err := strconv.Atoi(matches[1])
		if err == nil {
			return num
		}
	}
	return 0
}

func (s *ArtifactsService) determineSupportStatus(version int) SupportStatus {
	switch {
	case version >= 24500:
		return Recommended
	case version >= 24000:
		return Latest
	case version >= 23000:
		return Active
	case version >= 20000:
		return Deprecated
	default:
		return EOL
	}
}

func (s *ArtifactsService) estimateSize(version string, platform string) int64 {
	// Rough estimates in MB
	if platform == "windows" {
		return 850 * 1024 * 1024 // 850 MB
	}
	return 400 * 1024 * 1024 // 400 MB
}

func (s *ArtifactsService) parseVersion(version string) int {
	// Extract numeric version
	vNum := ""
	for _, ch := range version {
		if ch >= '0' && ch <= '9' {
			vNum += string(ch)
		} else {
			break
		}
	}
	num, err := strconv.Atoi(vNum)
	if err != nil {
		return 0
	}
	return num
}

func (s *ArtifactsService) generateFallbackData() ArtifactData {
	fallbackArtifacts := []struct {
		version  string
		hash     string
		platform PlatformType
	}{
		{"24769", "ad6c90072e62cdb7ee0dcc943d7ded8a5107d542", Windows},
		{"24769", "ad6c90072e62cdb7ee0dcc943d7ded8a5107d542", Linux},
		{"24574", "779c1fa38ec01b33d79a5e994b7e0c1a0bbcg421", Windows},
		{"24574", "779c1fa38ec01b33d79a5e994b7e0c1a0bbcg421", Linux},
		{"24573", "b85db86b37fdcab942859d3ef31cc4bd43eee8f6", Windows},
		{"24573", "b85db86b37fdcab942859d3ef31cc4bd43eee8f6", Linux},
	}

	data := ArtifactData{
		Windows: make(map[string]Artifact),
		Linux:   make(map[string]Artifact),
	}

	now := time.Now().UTC().Format(time.RFC3339)

	for _, art := range fallbackArtifacts {
		vNum, _ := strconv.Atoi(art.version)
		artifact := Artifact{
			Version:       art.version,
			Hash:          art.hash,
			Platform:      art.platform,
			Date:          now,
			SupportStatus: s.determineSupportStatus(vNum),
		}

		if art.platform == Windows {
			artifact.URL = fmt.Sprintf(
				"https://runtime.fivem.net/artifacts/fivem/build_server_windows/master/%s-%s/server.zip",
				art.version, art.hash,
			)
			artifact.Size = s.estimateSize(art.version, "windows")
			data.Windows[art.version] = artifact
		} else {
			artifact.URL = fmt.Sprintf(
				"https://runtime.fivem.net/artifacts/fivem/build_proot_linux/master/%s-%s/fx.tar.xz",
				art.version, art.hash,
			)
			artifact.Size = s.estimateSize(art.version, "linux")
			data.Linux[art.version] = artifact
		}
	}

	return data
}

func (s *ArtifactsService) getCache(key string) interface{} {
	if entry, exists := s.cache[key]; exists {
		if time.Now().UnixMilli()-entry.timestamp < cacheDuration {
			return entry.data
		}
		delete(s.cache, key)
	}
	return nil
}

func (s *ArtifactsService) setCache(key string, data interface{}, duration int64) {
	s.cache[key] = &cacheEntry{
		data:      data,
		timestamp: time.Now().UnixMilli(),
	}
}

// GitHub API helpers

func (s *ArtifactsService) fetchFromGitHub(url string) ([]GitHubTag, error) {
	var tags []GitHubTag
	err := s.fetchJSONFromGitHub(url, &tags)
	return tags, err
}

func (s *ArtifactsService) fetchJSONFromGitHub(url string, result interface{}) error {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return err
	}

	if s.githubToken != "" {
		req.Header.Set("Authorization", fmt.Sprintf("token %s", s.githubToken))
	}

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("GitHub API error: %d - %s", resp.StatusCode, string(body))
	}

	return json.NewDecoder(resp.Body).Decode(result)
}

// Utility function for filtering slices
func filterSlice(slice []ArtifactEntry, predicate func(ArtifactEntry) bool) []ArtifactEntry {
	var filtered []ArtifactEntry
	for _, item := range slice {
		if predicate(item) {
			filtered = append(filtered, item)
		}
	}
	return filtered
}
