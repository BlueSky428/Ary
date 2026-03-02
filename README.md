# Ary — Strength-Spotting AI Companion

Ary is a strength-and-growth AI companion designed to help people see and articulate their professional capabilities through natural conversation and structured reflection.

## Philosophy

- **Non-evaluative** — No scoring, ranking, or judgment
- **Competence-focused** — Illuminates existing strengths, not gaps
- **User sovereignty** — Complete control over data and experience
- **Institutional trust** — Designed for safe deployment in universities and public agencies
- **Cognitive clarity** — Focus on reflection, not emotion or therapy

## Project Structure

```
ary/
├── frontend/     # Next.js 14 web application (deployed to Vercel)
├── backend/      # Node.js/TypeScript API server
├── shared/       # Shared types and constants
└── docs/         # Technical documentation
```

## Tech Stack

| Layer      | Technology                                    |
| ---------- | --------------------------------------------- |
| Frontend   | Next.js 14, React 18, TypeScript, Tailwind CSS |
| Animation  | Framer Motion                                 |
| Database   | Neon Postgres (serverless)                    |
| AI / LLM   | OpenAI GPT (demo conversation engine)         |
| Deployment | Vercel (frontend), Docker-ready (backend)     |

## Pages

| Route              | Description                                   |
| ------------------ | --------------------------------------------- |
| `/`                | Landing page                                  |
| `/applications`    | Use-case domains (Procurement, Legal, etc.)   |
| `/ledger`          | Decision artifact and accountability ledger   |
| `/design`          | Design principles                             |
| `/team`            | Team page                                     |
| `/request-pilot`   | Pilot request form (stored in Neon Postgres)  |
| `/pilot-requests`  | Admin dashboard for managing pilot requests   |
| `/demo-access`     | Access-code gate for the live demo            |
| `/demo`            | Interactive AI conversation demo              |

## Getting Started

```bash
# 1. Install dependencies (from repo root)
npm install

# 2. Create environment file
cp frontend/.env.example frontend/.env.local
# Then fill in DATABASE_URL and OPENAI_API_KEY

# 3. Run the development server
cd frontend && npm run dev
```

## Environment Variables

| Variable               | Required | Description                         |
| ---------------------- | -------- | ----------------------------------- |
| `DATABASE_URL`         | Yes      | Neon Postgres connection string     |
| `OPENAI_API_KEY`       | Yes      | OpenAI API key for demo chat        |
| `DEMO_ACCESS_CODE`     | No       | Access code for `/demo` (default: `ary2000`) |

## Deployment (Vercel)

1. Set **Root Directory** to `frontend`
2. Add environment variables (`DATABASE_URL`, `OPENAI_API_KEY`) in Vercel project settings
3. Deploy — Vercel auto-detects Next.js

## License

Proprietary — All rights reserved
