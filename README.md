# FixFX

[![Build](https://github.com/CodeMeAPixel/FixFX/actions/workflows/build-ci.yml/badge.svg)](https://github.com/CodeMeAPixel/FixFX/actions/workflows/build-ci.yml)
[![License: AGPL 3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](LICENSE)

A documentation platform for FiveM, RedM, and the CitizenFX ecosystem. Guides, tutorials, native references, and tools for server developers.

> [!CAUTION]
> FixFX is an independent community project. It is not affiliated with or endorsed by Cfx.re, Rockstar Games, txAdmin, Take-Two Interactive or any other entities referenced throughout the documentation.

## Features

- Documentation for FiveM, RedM, txAdmin, vMenu, and popular frameworks
- Native function reference with search and filtering
- Artifacts browser for server builds
- AI-powered chat assistant for troubleshooting
- Full-text search across all documentation
- Dark mode interface
- Mobile responsive design

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Documentation**: MDX with Fumadocs
- **Backend**: Go (separate repository)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18 or later
- Bun (recommended) or npm/pnpm

### Installation

```bash
git clone https://github.com/CodeMeAPixel/FixFX.git
cd FixFX/frontend
bun install
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
bun run build
bun start
```

## Project Structure

```
frontend/
├── app/                  # Next.js app router
├── content/              # MDX documentation files
├── lib/                  # Utility functions
├── packages/
│   ├── core/            # React hooks
│   ├── ui/              # UI components
│   └── utils/           # Shared utilities
├── public/              # Static assets
├── styles/              # Global styles
└── types/               # TypeScript definitions
```

## Documentation

Documentation content is located in `content/docs/` and organized by topic:

- `core/` - Core concepts and fundamentals
- `cfx/` - CitizenFX platform documentation
- `txadmin/` - txAdmin server management
- `vmenu/` - vMenu configuration
- `frameworks/` - ESX, QBCore, and other frameworks
- `guides/` - Tutorials and how-to guides

## Hosting Providers & Partnerships

This project includes a partnership program for hosting providers offering exclusive benefits to the FiveM and RedM communities.

### For Server Owners

Visit the [Hosting Partners page](https://fixfx.wiki/hosting) to browse verified hosting providers with exclusive FixFX discounts:

- **Affiliate Partners**: Providers with exclusive discount codes (e.g., ZAP-Hosting with 20% off)
- **Trusted Hosts**: Automatically curated list from [fivem.net/server-hosting](https://fivem.net/server-hosting)

### For Hosting Providers

We're always looking for quality hosting providers interested in partnerships. Here's what we offer:

✅ **Reach**: Exposure to thousands of FiveM/RedM server owners  
✅ **Trust**: Featured on our dedicated hosting page  
✅ **Tracking**: Affiliate links for conversion attribution  
✅ **Support**: Community visibility and marketing assistance

#### Partnership Requirements & Code of Conduct

Your hosting service should meet these criteria:

- Must host **FiveM** and/or **RedM** servers
- **99.6%+ uptime** with responsive 24/7 support
- Provide an **exclusive discount code** or special offer
- Supply **trackable affiliate/referral links**
- Maintain **quality standards** and community respect
- Adhere to our [Provider Guidelines & Code of Conduct](./packages/providers/GUIDELINES.md)

#### How to Apply

1. **Review** the [Provider Guidelines & Code of Conduct](./packages/providers/GUIDELINES.md)
2. **Read** the [Partnership Requirements & Process](./packages/providers/README.md)
3. **Create** your provider directory with `provider.json`
4. **Submit** a Pull Request to `frontend/packages/providers/`
5. **Review**: Our team responds within 3-5 business days

**Example JSON file** (in `your-hosting/provider.json`):

```json
{
  "$schema": "../schema.json",
  "id": "your-hosting",
  "name": "Your Hosting Company",
  "website": "https://your-hosting.com",
  "description": "Premium FiveM and RedM hosting with DDoS protection and 24/7 support.",
  "discount": {
    "percentage": 20,
    "code": "FIXFX20",
    "duration": "Lifetime"
  },
  "links": [
    {
      "label": "FiveM Servers",
      "url": "https://your-hosting.com/affiliate?campaign=fixfx",
      "description": "High-performance FiveM servers"
    }
  ],
  "features": [
    "99.9% Uptime SLA",
    "DDoS Protection",
    "Auto-backup & Restore",
    "24/7 Support",
    "1-Click Install"
  ],
  "priority": 10
}
```

#### System Features

- **Automated Validation**: GitHub Actions validates all provider JSON files
- **Schema Enforcement**: JSON Schema ensures consistent data quality
- **Trusted Hosts Scraper**: Weekly automation to maintain current FiveM provider list
- **CI/CD Integration**: Automatic PR creation for provider updates

For detailed information, see:

- [Provider Guidelines & Code of Conduct](./packages/providers/GUIDELINES.md) - Standards and expectations
- [Partnership Requirements & Process](./packages/providers/README.md) - Detailed how-to guide
- [Trusted Hosts Documentation](./packages/providers/TRUSTED_HOSTS_README.md) - Automation details

## Contributing

Contributions are welcome. Please read our [Contributing Guide](.github/CONTRIBUTING.md) before submitting a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'feat: add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## Community

- **GitHub Issues**: [Report bugs or request features](https://github.com/CodeMeAPixel/FixFX/issues)
- **Discord**: [discord.gg/cYauqJfnNK](https://discord.gg/cYauqJfnNK)
- **Email**: [hey@codemeapixel.dev](mailto:hey@codemeapixel.dev)

## License

This project is licensed under the AGPL 3.0 License. See the [LICENSE](LICENSE) file for details.
