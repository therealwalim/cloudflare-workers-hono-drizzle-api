# Cloudflare Workers Hono Drizzle R2 D1 Template

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/honojs/cloudflare-workers-hono-drizzle-r2-d1-template.git
```
```bash
cd cloudflare-workers-hono-drizzle-r2-d1-template
```

### 2. Install dependencies
```bash
bun install
```

### 3. Wrangler configuration
```toml
name = "<your-app-name>"
main = "src/index.ts"
compatibility_date = "2024-10-22"
compatibility_flags = [ "nodejs_compat" ]

[vars]
JWT_SECRET = "<your-jwt-secret>"
R2_PUBLIC_URL = "<your-r2-public-url>"

[[r2_buckets]]
binding = "R2"
bucket_name = "<your-r2-bucket-name>"

[[d1_databases]]
binding = "DB"
database_name = "<your-d1-database-name>"
database_id = "<your-d1-database-id>"
```

### 4.Migrate the database

```bash
bun run db:generate
bun run db:up
```

### 4. Execute D1 database

#### Local
```bash
bun run migrate:local --file=<your-migration-file>
```

#### Remote
```bash
bun run migrate:remote --file=<your-migration-file>
```

### 5. Run the app

```bash
bun run dev
```
