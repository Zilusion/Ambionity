# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Ambionity is a SvelteKit 2 + Svelte 5 full-stack web application with session-based authentication and internationalization. Uses TypeScript strict mode, Drizzle ORM with SQLite, and Tailwind CSS v4.

## Commands

### Development

```bash
pnpm dev              # Start dev server (localhost:5173)
pnpm build            # Production build
pnpm preview          # Preview production build
```

### Code Quality

```bash
pnpm check            # Svelte type checking
pnpm lint             # ESLint check
pnpm lint:fix         # Fix linting issues
pnpm format           # Prettier check
pnpm format:fix       # Format code
```

### Testing

```bash
pnpm test             # Run all tests once
pnpm test:unit        # Vitest (can add --watch)
pnpm test:watch       # Watch mode
pnpm test:ui          # Vitest UI dashboard
```

### Database (Drizzle)

```bash
pnpm db:push          # Push schema to DB
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Drizzle Studio GUI
```

### Docker

The project is typically run and hosted via Docker.

```bash
# Development (with hot reload via Docker Compose watch)
docker compose --profile development up --watch

# Production (local build)
docker compose --profile production up --build

# Production (pre-built images from GHCR)
docker compose -f docker-compose.production.yml up
```

| Mode        | Dockerfile               | Port | Features                     |
| ----------- | ------------------------ | ---- | ---------------------------- |
| development | `Dockerfile.development` | 5173 | Hot reload, file sync        |
| production  | `Dockerfile.production`  | 3000 | Multi-stage build, optimized |

**Files:**

- `docker-compose.yml` — local development and build
- `docker-compose.production.yml` — deployment with images from `ghcr.io/zilusion/ambionity`

### Other

```bash
pnpm paraglide:generate  # Compile i18n messages
pnpm knip                # Find unused files/dependencies
pnpm release             # Bump version, changelog, tag, push
```

## Architecture

### Server Hooks (`src/hooks.server.ts`)

Uses `sequence()` to chain middleware:

1. **handleParaglide**: Detects locale from request, sets `%paraglide.lang%` in HTML
2. **handleAuth**: Validates session token from cookie, populates `event.locals.user` and `event.locals.session`

### Authentication (`src/lib/server/auth.ts`)

Custom token-based session auth:

- Sessions stored in SQLite, 30-day expiration
- Tokens hashed with SHA256 before storage
- Auto-renewal when <15 days remain
- HTTP-only cookie (`auth-session`)

### Database (`src/lib/server/db/`)

- Drizzle ORM with better-sqlite3 driver
- Schema in `schema.ts`: `user` and `session` tables
- Dev: `local.db`, Prod: `/app/.data/prod.db`
- Type inference via `$inferSelect`

### Internationalization

- Inlang + Paraglide JS for type-safe i18n
- Locales: Russian (base), English
- Messages: `messages/{locale}.json`
- Generated code: `src/lib/paraglide/`
- Use `localizeHref()` for localized URLs

### UI Components

- shadcn-svelte components in `src/lib/components/ui/`
- Tailwind CSS v4 with Vite plugin
- Icons: @lucide/svelte

## Code Style

- **Formatting**: Tabs, single quotes, 100 char width
- **Commits**: Conventional commits enforced (feat:, fix:, chore:, etc.)
- **Pre-commit**: lint-staged runs ESLint + Prettier
- **Pre-push**: Full test suite runs

## Environment Variables

```env
DATABASE_URL=local.db
ORIGIN=http://localhost:5173
```

## MCP Tools

You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available MCP Tools

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.
