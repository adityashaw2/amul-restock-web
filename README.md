# Amul Restock Web 🔔

Frontend for [amul-restock](https://github.com/adityashaw2/amul-restock) — browse Amul products and subscribe to restock alerts for your pincode.

## Stack

- **React 19** + TypeScript
- **Vite 8**
- **Tailwind CSS 4** + **shadcn/ui** components
- **TanStack React Query** for data fetching
- **Lucide** icons

## Setup

```bash
bun install

# Development
bun dev

# Build
bun run build
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000/trpc` | Backend tRPC API URL |

## Deploy on Vercel

```bash
bunx vercel --prod
```

Set `VITE_API_URL` in Vercel env vars to your backend URL.

## License

MIT
