# Ary Frontend

Next.js frontend application for Ary - Strength-Spotting AI Companion.

## Quick Start

```bash
# Install dependencies
npm install

# Build shared package first
cd ../shared && npm install && npm run build && cd ../frontend

# Set up environment
cp .env.local.example .env.local
# Edit .env.local with your API URL

# Run development server
npm run dev
```

Visit http://localhost:3000

## Features

- ✅ Landing page with interactive demo
- ✅ Chat interface component
- ✅ Competence tree preview
- ✅ Waitlist form
- ✅ API client with authentication
- ✅ State management (Zustand)
- ✅ Type-safe with TypeScript
- ✅ Tailwind CSS styling

## Documentation

See [FRONTEND_SETUP.md](./FRONTEND_SETUP.md) for detailed setup and development guide.

## Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - React components
- `src/lib/` - Utilities and API client
- `src/store/` - Zustand state stores
- `public/` - Static assets

## Tech Stack

- Next.js 14+ (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios (API client)
- Framer Motion (animations)

