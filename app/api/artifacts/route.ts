import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: "OK",
        message: "Welcome to the FixFX Artifacts API. This API is used to get FXServer artifacts and information about them.",
        routes: [
            {
                name: "fetch",
                path: "/api/artifacts/fetch",
                description: "Fetch all artifacts from the database",
                parameters: [
                    {
                        name: "platform",
                        type: "string",
                        description: "Filter by platform (windows, linux)",
                        required: false
                    },
                    {
                        name: "version",
                        type: "string",
                        description: "Filter by specific version",
                        required: false
                    },
                    {
                        name: "status",
                        type: "string",
                        description: "Filter by support status (recommended, latest, active, deprecated, eol)",
                        required: false
                    },
                    {
                        name: "includeEol",
                        type: "boolean",
                        description: "Include end-of-life artifacts in results",
                        required: false,
                        default: false
                    },
                    {
                        name: "sortBy",
                        type: "string",
                        description: "Sort by field (version, date)",
                        required: false,
                        default: "version"
                    },
                    {
                        name: "sortOrder",
                        type: "string",
                        description: "Sort order (asc, desc)",
                        required: false,
                        default: "desc"
                    },
                    {
                        name: "limit",
                        type: "number",
                        description: "Maximum number of results to return",
                        required: false,
                        default: 100
                    },
                    {
                        name: "offset",
                        type: "number",
                        description: "Number of results to skip (for pagination)",
                        required: false,
                        default: 0
                    }
                ]
            },
            {
                name: "check",
                path: "/api/artifacts/check",
                description: "Check GitHub issues for artifact version references",
                parameters: [
                    {
                        name: "version",
                        type: "string",
                        description: "Filter by specific artifact version",
                        required: false
                    },
                    {
                        name: "state",
                        type: "string",
                        description: "Filter by issue state (open, closed)",
                        required: false
                    },
                    {
                        name: "page",
                        type: "number",
                        description: "Page number for pagination",
                        required: false,
                        default: 1
                    },
                    {
                        name: "perPage",
                        type: "number",
                        description: "Number of results per page",
                        required: false,
                        default: 20
                    }
                ]
            },
            {
                name: "changes",
                path: "/api/artifacts/changes",
                description: "Generate changelog for a specific artifact version",
                parameters: [
                    {
                        name: "version",
                        type: "string",
                        description: "The artifact version to generate changelog for",
                        required: true
                    },
                    {
                        name: "format",
                        type: "string",
                        description: "Output format (json, markdown, html)",
                        required: false,
                        default: "json"
                    }
                ]
            }
        ],
    });
}
