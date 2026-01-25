# Changelog

All notable changes to FixFX will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-25

### Added

#### Backend Integration
- **Go Backend API Integration** - Complete frontend migration to use Go backend services
  - Artifacts API endpoint integration (`/api/artifacts`)
  - Natives API endpoint integration (`/api/natives`)
  - Contributors API endpoint integration (`/api/contributors`)
  - Source API endpoint integration (`/api/source`)
  - Environment-aware API_URL configuration using `NEXT_PUBLIC_API_URL` env var
  - Production default URL: `https://core.fixfx.wiki`
  - Development override support for local backend

#### Analytics
- **Ackee Analytics Integration** - User tracking and analytics
  - Added Ackee tracker script to root layout
  - Server: `https://ackee.bytebrush.dev`
  - Domain ID: `cda143c2-45f9-4884-96b6-9e73ffecaf15`
  - Automatic page view and interaction tracking

#### Documentation
- **API Documentation Updates** - Complete rewrite for Go backend
  - `content/docs/core/api/artifacts.mdx` - Artifacts API documentation
  - `content/docs/core/api/natives.mdx` - Natives API documentation with usage examples
  - `content/docs/core/api/contributors.mdx` - Contributors API documentation
  - Includes endpoint specifications, query parameters, and response formats
  - JavaScript, Lua, and C# usage examples

### Changed

#### Components
- **FileSource Component** - Server component that reads and displays source code files directly in documentation
  - Located at `app/components/file-source.tsx`
  - Supports syntax highlighting via DynamicCodeBlock
  - Fetches file content through secure API route
  
- **ImageModal Component** - Click-to-expand image viewer for better mobile experience
  - Located at `app/components/image-modal.tsx`
  - Uses React Portal to render above all content
  - Features dark overlay, close button, and optional title caption
  - Prevents body scroll when open

- **SourceCode Component** - Client wrapper for DynamicCodeBlock with custom styling
  - Located at `packages/ui/src/components/source-code.tsx`
  - Supports multiple languages with proper syntax highlighting
  - Optional title bar display

#### API Routes
- **Source API** (`/api/source`) - Securely serves file contents for documentation
  - Whitelisted paths for security (`lib/artifacts/`, `packages/`)
  - Prevents path traversal attacks
  - Returns file contents as JSON

#### Documentation
- **txAdmin Windows Installation Guide** (`content/docs/txadmin/windows/install.mdx`)
  - Complete step-by-step installation process
  - PowerShell commands for artifact download
  - Screenshots with ImageModal for better viewing
  - CFX authorization and master account setup
  - Server deployment with recipes
  - License key generation guide

- **txAdmin Windows Overview** (`content/docs/txadmin/windows/index.mdx`)
  - System requirements (hardware and software)
  - Quick overview of installation process
  - Links to detailed installation guide

- **txAdmin Config Editor Guide** (`content/docs/txadmin/configuration.mdx`)
  - Complete explanation of all server.cfg options
  - Server identity settings (sv_hostname, sv_projectName, etc.)
  - Server configuration (sv_maxclients, endpoints, etc.)
  - Resource management section
  - Admin permissions and ACE rules
  - Common configuration scenarios
  - Troubleshooting guide

- **txAdmin Server Management Guide** (`content/docs/txadmin/server-management.mdx`)
  - Dashboard overview and metrics
  - Live Console usage and commands
  - Players management and search
  - Resources management
  - Server Log and filtering
  - History and audit trail
  - Player Drops analytics
  - Whitelist management
  - Admin account creation and permissions
  - Best practices (daily, weekly, monthly tasks)
  - Troubleshooting common issues

#### Animations
- **Indeterminate Progress Animation** - Added loading animation for Progress component
  - Added `indeterminate-progress` keyframes to `tailwind.config.ts`
  - Smooth left-to-right loading animation

### Changed

#### Components
- **Progress Component** (`packages/ui/src/components/progress.tsx`)
  - Added `indeterminate` prop support
  - Uses Tailwind animation class instead of inline CSS
  - Properly handles both determinate and indeterminate states

#### Documentation Cleanup
- **vMenu Documentation** - Removed fabricated information
  - Removed fake build numbers and version requirements
  - Removed incorrect convar names that don't exist
  - Corrected feature descriptions to match actual vMenu capabilities

- **txAdmin Documentation** - Removed fabricated information
  - Removed fake build numbers and minimum version requirements
  - Removed non-existent convars and configuration options
  - Corrected setup instructions to match actual txAdmin behavior

- **ESX Framework Documentation** - Removed fabricated information
  - Removed fake version numbers and compatibility matrices
  - Removed non-existent configuration options
  - Corrected database setup instructions

- **QBCore Framework Documentation** - Removed fabricated information
  - Removed fake version numbers and build requirements
  - Removed non-existent functions and exports
  - Corrected resource dependencies

- **CFX Documentation** - Removed fabricated information
  - Removed fake artifact build numbers
  - Removed non-existent server commands
  - Corrected performance optimization tips

### Fixed

- **Progress Component Loading Animation** - Animation was not working because CSS keyframes were missing
  - Added proper keyframes to Tailwind config
  - Component now animates correctly when `value={undefined}`

- **ImageModal Positioning** - Modal was appearing in wrong position due to CSS stacking context
  - Implemented React Portal to render directly to document.body
  - Uses inline styles with high z-index to ensure proper layering
  - Prevents body scroll when modal is open

- **FileSource Component** - Initial implementation failed due to `fs` module in client bundle
  - Moved file reading to API route
  - Client component fetches via `/api/source` endpoint
  - Proper error handling and loading states

### Removed

- Removed `file-source.tsx` from `packages/ui/src/components/` (moved to `app/components/`)
- Removed fabricated documentation content across multiple files

### Security

- **Source API** includes path whitelisting to prevent unauthorized file access
- **Source API** blocks path traversal attempts (rejects paths containing `..`)

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2026-01-25 | Initial rewrite with documentation cleanup, new components, and txAdmin guides |

---
