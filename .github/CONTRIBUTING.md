# Contributing to FixFX

Thank you for your interest in contributing to FixFX. We welcome contributions from the community.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before participating. We expect all contributors to be respectful and constructive.

## How to Contribute

### Reporting Bugs

If you discover a bug, please create an issue on GitHub with the following information:

- **Title**: Clear, concise description of the bug
- **Description**: Detailed explanation of the problem
- **Steps to Reproduce**: How to reproduce the issue
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, Node version, browser (if applicable)
- **Screenshots**: If applicable, add screenshots or GIFs

### Suggesting Enhancements

Enhancement suggestions are welcome! Please create an issue with:

- **Title**: Clear description of the feature
- **Description**: Detailed explanation of the enhancement
- **Use Case**: Why this feature would be useful
- **Examples**: Examples of how it would work
- **Alternatives**: Any alternative approaches you've considered

### Submitting Pull Requests

1. **Fork the Repository**
   ```bash
   git clone https://github.com/CodeMeAPixel/FixFX.git
   cd FixFX/frontend
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes:
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Follow the coding standards (see below)
   - Write clear, descriptive commit messages
   - Keep commits focused and atomic

4. **Test Your Changes**
   ```bash
   # Install dependencies
   bun install

   # Run development server
   bun dev

   # Run tests (if applicable)
   bun test

   # Build for production
   bun run build
   ```

5. **Update Documentation**
   - Update relevant documentation files
   - Update CHANGELOG.md under the Unreleased section
   - Add comments for complex logic

6. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: Add your feature description"
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Use a clear, descriptive title
   - Reference any related issues (e.g., "Fixes #123")
   - Provide a clear description of your changes
   - Link to relevant documentation

## Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

### React Components

- Use functional components with hooks
- Use React best practices:
  - Memoize expensive computations with `useMemo`
  - Memoize callbacks with `useCallback`
  - Use proper dependency arrays
- Components should be in `packages/ui/src/core/` or `packages/ui/src/components/`
- Create separate files for each component
- Include TypeScript interfaces for props

### MDX Documentation

- Use clear, concise headings
- Include code examples with proper syntax highlighting
- Use callout blocks for important information
- Keep examples up-to-date with the latest API
- Use proper formatting and spacing

### Styling

- Use Tailwind CSS classes
- Follow the existing color scheme
- Ensure responsive design (mobile-first approach)
- Use CSS variables for theme-aware colors

### Git Commit Messages

Follow conventional commits format:

```
type(scope): subject

body (optional)

footer (optional)
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependencies, etc.

Examples:
```
feat(natives): Add search highlighting to results
fix(artifacts): Handle null metadata in pagination
docs(api): Update natives endpoint documentation
refactor(components): Simplify artifacts filter logic
```

## Project Structure

```
frontend/
├── app/                       # Next.js app directory
│   ├── (blog)/               # Blog routes
│   ├── (docs)/               # Documentation routes
│   ├── (landing)/            # Landing page
│   ├── api/                  # API routes (intentional: chat, search)
│   ├── artifacts/            # Artifacts page
│   ├── chat/                 # Chat page
│   ├── natives/              # Natives page
│   └── layout.tsx            # Root layout
├── content/                   # MDX documentation files
│   └── docs/                 # Documentation structure
├── lib/                       # Utility functions
├── packages/
│   ├── core/                 # Core React hooks
│   ├── ui/                   # UI components
│   └── utils/                # Utility functions
├── public/                    # Static assets
├── styles/                    # Global CSS
└── types/                     # TypeScript type definitions
```

## API Integration

The frontend integrates with the Go backend via REST API:

- **Production**: `https://core.fixfx.wiki`
- **Development**: `http://localhost:3001` (via `NEXT_PUBLIC_API_URL` env var)

Implemented services:
- Artifacts API (`/api/artifacts`)
- Natives API (`/api/natives`)
- Contributors API (`/api/contributors`)
- Source API (`/api/source`)

Always use the `API_URL` constant from `packages/utils/src/constants/link.ts` when making API calls.

## Development Setup

### Prerequisites

- Node.js 18+ (we use Bun for package management)
- Go 1.25+ (if running backend locally)

### Frontend Setup

```bash
# Clone and navigate
git clone https://github.com/CodeMeAPixel/FixFX.git
cd FixFX/frontend

# Install dependencies
bun install

# Start development server
bun dev
```

Visit `http://localhost:3000`

### Backend Setup (Optional)

For testing API changes locally:

```bash
cd FixFX/backend

# Start backend
go run cmd/server/main.go
```

Backend runs on `http://localhost:3001`

Set environment variable for local testing:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001 bun dev
```

## Testing Guidelines

- Write tests for new features
- Ensure existing tests pass: `bun test`
- Test across different browsers if UI changes
- Test responsive design on mobile devices
- Test with the actual backend API before submitting PR

## Documentation Guidelines

When adding new features:

1. Update relevant documentation in `content/docs/`
2. Add usage examples with proper code blocks
3. Include parameter descriptions
4. Link to related documentation
5. Update API documentation if backend changes

## Performance Considerations

- Minimize bundle size
- Lazy load components when appropriate
- Use pagination for large data sets
- Implement proper caching strategies
- Optimize images and assets

## Accessibility

- Ensure keyboard navigation works
- Add proper ARIA labels
- Test with screen readers
- Maintain sufficient color contrast
- Support reduced motion preferences

## Review Process

1. **Automated Checks**
   - ESLint passes
   - TypeScript compilation succeeds
   - Build completes without errors

2. **Code Review**
   - At least one maintainer review
   - Discussion of approach and implementation
   - Suggestions for improvement

3. **Merge**
   - All feedback addressed
   - All checks passing
   - Squash commits if requested

## Questions?

- Check existing [GitHub Issues](https://github.com/CodeMeAPixel/FixFX/issues)
- Join our [Discord](https://discord.gg/cYauqJfnNK)
- Email: [hey@codemeapixel.dev](mailto:hey@codemeapixel.dev)

## License

By contributing to FixFX, you agree that your contributions will be licensed under the AGPL 3.0 License.
