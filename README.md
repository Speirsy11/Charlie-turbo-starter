# Charlie Turbo Starter

A layered [Turborepo](https://turborepo.com) + [pnpm](https://pnpm.io) monorepo starter: Next.js, tRPC, Drizzle, Clerk, and a streaming AI chat feature built on the [Vercel AI SDK](https://sdk.vercel.ai). It enforces a strict 5-layer architecture with Turbo boundary tags and uses a **decentralized tRPC** model where each feature owns its own router, route handler and React provider.

## Architecture

Packages are organised into layers. **A package may only depend on packages in strictly lower layers** — the single exception is that foundations may depend on other foundations. `tooling/*` is orthogonal and may only depend on tooling. These rules are declared in [turbo.json](turbo.json) under `boundaries.tags` and enforced by `pnpm boundaries` (run in CI).

```
foundation → service → feature → composition → app      (+ tooling)
```

| Layer | May import | Packages |
| --- | --- | --- |
| **foundation** | foundation, tooling | `auth`, `db`, `trpc`, `ui`, `validators`, `query-client`, `env-schema` |
| **service** | foundation, tooling | `chat` |
| **feature** | foundation, service, tooling | `conversations` |
| **composition** | foundation, service, feature, tooling | `admin` |
| **app** | everything below | `apps/nextjs` |
| **tooling** | tooling | `eslint`, `prettier`, `tailwind`, `typescript`, `vitest`, `github` |

```
packages/
  foundations/   auth db trpc ui validators query-client env-schema
  services/      chat
  features/      conversations
  compositions/  admin
apps/
  nextjs
tooling/
  eslint prettier tailwind typescript vitest github
```

### Conventions

- **Barrel-only `index.ts`** — `index.ts` files only re-export; logic lives in sibling files. Packages split entrypoints into `.` (client-safe), `./server` (`import "server-only"`) and `./env`.
- **Decentralized tRPC** — there is no central API package. Each feature calls `createBasicTRPC({ db })` (from `@charlie/trpc/server`) to own its `createTRPCContext`, router and procedures. The app mounts each feature's router at `/api/trpc/<feature>` and wraps the feature's UI in its own provider (with a `keyPrefix`). This is what lets a feature own its page/UI without importing a higher layer. Compositions are UI shells that stitch feature components together.
- **Validated env everywhere** — every env-reading package has an `env.ts` using `@t3-oss/env` `createEnv`, composed from reusable blocks in `@charlie/env-schema`.

### The `conversations` feature

`packages/features/conversations` owns everything for the chat surface: the Drizzle schema (`Conversation` + `Message`), its tRPC router (persistence/CRUD), a `/api/conversations/chat` route handler that streams a Claude response via the `chat` service and persists turns, the React provider, and all UI — including the `ConversationsPage` component that the app simply mounts at `/conversations`. The `chat` service (`@charlie/chat`) exposes streaming + a small demo agent toolset only; it has no persistence or router.

The default model is `claude-sonnet-4-6` (override with `ANTHROPIC_MODEL`).

## Getting started

```bash
pnpm install
cp .env.example .env   # then fill in the values
```

Set in `.env`:

- `DB_HOST` / `DB_PORT` / `DB_USER` / `DB_PASSWORD` / `DB_NAME` — any plain Postgres (local Docker, Neon, RDS, …). The db foundation connects via [postgres.js](https://github.com/porsager/postgres) using these discrete params.
- `CLERK_SECRET_KEY` / `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — from your [Clerk](https://clerk.com) app.
- `ANTHROPIC_API_KEY` (and optional `ANTHROPIC_MODEL`) — for the AI chat.

Push the conversations schema and start the dev server:

```bash
pnpm db:push   # applies the conversations feature's Drizzle schema
pnpm dev       # runs the Next.js app
```

Open `/conversations`, create a conversation and send a message to see a streamed Claude response (try "what time is it?" to trigger a tool call). `/admin` shows the composition shell.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run the app in watch mode |
| `pnpm build` | Build all packages + the app |
| `pnpm test` | Run Vitest across packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm format` / `pnpm format:fix` | Prettier |
| `pnpm boundaries` | Enforce the layer rules (`turbo boundaries`) |
| `pnpm db:push` / `pnpm db:studio` | Drizzle Kit against the conversations schema |

## Testing

Tests use [Vitest](https://vitest.dev) with a shared base config in `@charlie/vitest-config`. Packages add a `vitest.config.ts` (or split `vitest.config.backend.ts` / `vitest.config.frontend.ts`) — backend tests run in `node`, frontend component tests in `jsdom` with `@vitejs/plugin-react`. See `packages/services/chat` and `packages/features/conversations` for examples.

## Dependency updates — `renovate.json`

[`.github/renovate.json`](.github/renovate.json) configures [Renovate](https://docs.renovatebot.com), an automated dependency-update bot. Once the Renovate GitHub app is enabled on the repo, it opens PRs that bump dependencies. The config:

- `extends: ["config:recommended"]` — sensible preset rules.
- disables updates for internal `@charlie/*` workspace packages (they're versioned via `workspace:*`).
- `rangeStrategy: "bump"` — raises the version range in `package.json`.
- auto-merges passing `minor`/`patch` update PRs (majors stay manual).

It keeps dependencies current without manual bumping.
