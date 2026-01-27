# Hosting Providers & Partnerships

This directory contains configurations for FixFX hosting partnerships and trusted host listings. We work with hosting providers to bring exclusive benefits to the FiveM and RedM communities.

**→ [Read the Provider Guidelines & Code of Conduct](./GUIDELINES.md)**

## Directory Structure

Each hosting provider has its own directory containing `provider.json`:

```
packages/providers/
├── zap-hosting/
│   └── provider.json          # ZAP-Hosting partner provider
├── schema.json                # JSON Schema for validating provider files
├── trusted-hosts.json         # Auto-maintained list of official FiveM-listed providers
├── trusted-hosts-schema.json  # Schema for trusted hosts
├── README.md                  # This file
├── GUIDELINES.md              # Provider guidelines & code of conduct
└── TRUSTED_HOSTS_README.md    # Documentation for automated trust list updates
```

## Types of Providers

### 1. Affiliate Partners

Hosting providers with whom we have established affiliate relationships and exclusive discount codes. These appear on the `/hosting` page with full partner cards.

**Examples:** ZAP-Hosting with 20% discount code

**How it works:**

- You receive exclusive discount codes for FixFX users
- We link to your affiliate/referral links
- Users get tracked discounts automatically
- Both parties benefit from the partnership

### 2. Trusted Hosts

Hosting providers officially listed on [fivem.net/server-hosting](https://fivem.net/server-hosting). These are scraped automatically once weekly to maintain currency. No affiliation required.

**How it works:**

- Automatically scraped from FiveM's official registry
- GitHub Action validates updates weekly
- Community can see official FiveM-approved providers
- Updated via PR if changes detected

## Becoming an Affiliate Partner

Want to partner with FixFX and offer exclusive discounts to our community? We'd love to hear from you!

**Before applying, please read the [Provider Guidelines & Code of Conduct](./GUIDELINES.md)** to understand our standards and expectations.

### Partnership Requirements

Your hosting service should meet these criteria:

- ✅ **Game Support:** Must host FiveM and/or RedM servers
- ✅ **Cloud Support:** Optionally for hosts who do not offer dedicated game servers we will still accept hosts who offer VPS or Dedicated Servers
- ✅ **Reliability:** 99.6%+ uptime with responsive 24/7 support
- ✅ **Community First:** Competitive pricing and genuine care for community needs
- ✅ **Exclusive Offer:** Provide a meaningful discount code or special offer for FixFX users
- ✅ **Affiliate Links:** Supply trackable affiliate/referral links for attribution
- ✅ **Communication:** Dedicated contact for ongoing partnership management
- ✅ **Code of Conduct:** Agreement to uphold quality, ethical, and community standards (see GUIDELINES.md)

### Application Process

#### Step 1: Review Guidelines

Read the [Provider Guidelines & Code of Conduct](./GUIDELINES.md) and ensure your service meets all core requirements.

#### Step 2: Prepare Your Information

Gather these details:

- Company name and website
- 2-3 sentence description of your hosting service
- Exclusive discount offer (percentage and code)
- Affiliate/referral link for each service type (FiveM, RedM, VPS, etc.)
- 3-5 key features of your service
- Logo or brand image URL (optional)
- Priority level (0 = normal, higher numbers display first)

#### Step 3: Create the Provider Directory

Create a directory for your provider, then add `provider.json` inside it:

```
packages/providers/my-hosting-company/
└── provider.json
```

The `provider.json` file format:

```json
{
  "$schema": "../schema.json",
  "id": "my-hosting-company",
  "name": "My Hosting Company",
  "website": "https://my-hosting.com",
  "description": "Premium FiveM and RedM hosting with DDoS protection, instant setup, and 24/7 support.",
  "discount": {
    "percentage": 20,
    "code": "FIXFX20",
    "duration": "Lifetime"
  },
  "links": [
    {
      "label": "FiveM Servers",
      "url": "https://my-hosting.com/affiliate?campaign=fixfx",
      "description": "High-performance FiveM servers with DDoS protection"
    },
    {
      "label": "RedM Servers",
      "url": "https://my-hosting.com/affiliate?campaign=fixfx&game=redm",
      "description": "Stable RedM hosting with instant deployment"
    }
  ],

  "features": [
    "99.9% Uptime SLA",
    "DDoS Protection",
    "Auto-backup & Restore",
    "24/7 Support",
    "1-Click Install"
  ],
  "highlight": "Best for Large Communities",
  "priority": 10
}
```

#### Step 4: Submit Your Application

1. **Fork** the repository: [CodeMeAPixel/FixFX](https://github.com/CodeMeAPixel/FixFX)
2. **Create a directory** in `frontend/packages/providers/your-company-id/`
3. **Add `provider.json`** to your directory
4. **Commit** with message: `chore: add partnership with [Your Company Name]`
5. **Push** and **Create a Pull Request** titled: `[Partnership] Your Company Name`

#### Step 5: Review & Testing

Our team will:

1. Verify compliance with [Provider Guidelines & Code of Conduct](./GUIDELINES.md)
2. Validate your JSON against the schema
3. Test discount codes and affiliate links
4. Review your service reputation and community standing
5. Contact you if we need clarification

Approval typically takes 5-7 business days.

#### Step 6: Go Live!

Once approved, your provider will automatically appear on the FixFX `/hosting` page and be featured across our documentation.

#### Step 5: PR Description Template

Include this information in your PR:

```markdown
## Partnership Application

**Company:** [Your Company Name]
**Website:** [URL]
**Contact Email:** [email]

### About Your Company

[2-3 sentences about your hosting company and why you're a good fit for FixFX]

### Offer Details

- **Discount:** [percentage]% off with code `[CODE]`
- **Duration:** [how long the discount lasts]
- **Affiliate Link:** [your affiliate/referral link]

### Why Partner with FixFX?

[Explain your motivation and what you hope to achieve]

### Community Focus

[How will this partnership benefit the FiveM/RedM community?]
```

### Field Reference

| Field                 | Required | Type   | Constraints        | Example                          |
| --------------------- | -------- | ------ | ------------------ | -------------------------------- |
| `id`                  | ✅       | string | Kebab-case, unique | `zap-hosting`                    |
| `name`                | ✅       | string | 1-100 chars        | `ZAP-Hosting`                    |
| `website`             | ❌       | string | Valid URL          | `https://zap-hosting.com`        |
| `description`         | ✅       | string | 1-300 chars        | `Premium game server hosting...` |
| `discount.percentage` | ✅       | number | 1-100              | `20`                             |
| `discount.code`       | ✅       | string | 3-50 chars         | `FIXFX-a-8909`                   |
| `discount.duration`   | ✅       | string | 1-50 chars         | `Lifetime`                       |
| `links`               | ✅       | array  | 1-10 items         | `[{...}]`                        |
| `links[].label`       | ✅       | string | 1-50 chars         | `FiveM Servers`                  |
| `links[].url`         | ✅       | string | Valid URL          | `https://zap-hosting.com/...`    |
| `links[].description` | ✅       | string | 1-150 chars        | `High-performance servers`       |
| `features`            | ✅       | array  | 3-8 strings        | `["DDoS", "Backup"]`             |
| `highlight`           | ❌       | string | 1-30 chars         | `Best Value`                     |
| `priority`            | ❌       | number | 0-100              | `10`                             |

### Validation & Review

**Automatic Checks:**

- Schema validation (JSON structure)
- ID uniqueness (no duplicates)
- URL accessibility
- Discount percentage validity
- Field length constraints

**Manual Review (within 3-5 business days):**

1. Partnership alignment with community values
2. Provider reputation and reliability research
3. Affiliate link verification
4. Discount genuineness

### Questions & Support

**Need help?**

- 📖 Review the [JSON Schema](./schema.json) for technical specs
- 💬 Ask on our [Discord](https://discord.gg/cYauqJfnNK)
- 🐛 [Open an issue](https://github.com/CodeMeAPixel/FixFX/issues) for technical problems

**Partnership inquiries:**

- Email: partnerships@fixfx.dev (when available)
- Or reach out via Discord

---

## Important Notes

- FixFX reserves the right to accept or decline partnership requests at our discretion
- We prioritize providers that genuinely serve and respect our community
- Misleading claims, fake reviews, or suspicious practices will result in immediate rejection
- Established partners must maintain quality standards or face removal
- Annual review recommended to ensure continued partnership fit

## Related Documentation

- [Schema Reference](./schema.json) - JSON Schema for partner validation
- [Trusted Hosts Guide](./TRUSTED_HOSTS_README.md) - Auto-updated FiveM provider list
- [Validation Workflow](./.github/workflows/validate-providers.yml) - CI/CD pipeline
