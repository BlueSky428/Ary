# Frontend Development Setup

## Quick Start

### 1. Install Dependencies

```bash
# From project root
cd frontend
npm install
```

### 2. Build Shared Package

The frontend depends on the shared package, so build it first:

```bash
# From project root
cd shared
npm install
npm run build
cd ../frontend
```

### 3. Set Up Environment Variables

Create `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
OPENAI_API_KEY=your_openai_api_key_here
```

**Important:** 
- Get your OpenAI API key from https://platform.openai.com/api-keys
- The API key is used server-side only (via Next.js API routes) and is never exposed to the client
- For production, use environment variables in your hosting platform (Vercel, etc.)

### 4. Run Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js 13+ app router
│   │   ├── layout.tsx   # Root layout
│   │   ├── page.tsx     # Landing page
│   │   └── globals.css  # Global styles
│   ├── components/       # React components
│   │   ├── DemoSection.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── CompetencePreview.tsx
│   │   └── WaitlistForm.tsx
│   ├── lib/             # Utilities
│   │   ├── api.ts       # API client
│   │   └── utils.ts     # Helper functions
│   └── store/           # State management
│       └── useAuthStore.ts
├── public/              # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Key Features

### API Client (`src/lib/api.ts`)

Centralized API communication with:
- Axios instance with interceptors
- Automatic token handling
- Error handling
- Type-safe responses

**Usage:**
```typescript
import { demoApi } from '@/lib/api';

const result = await demoApi.analyze(messages);
```

### State Management (`src/store/useAuthStore.ts`)

Zustand store for authentication:
- Persistent storage
- Token management
- User state

**Usage:**
```typescript
import { useAuthStore } from '@/store/useAuthStore';

const { isAuthenticated, setAuth, clearAuth } = useAuthStore();
```

### Components

All components are in `src/components/`:
- **DemoSection**: Interactive demo for landing page
- **ChatInterface**: Chat UI component
- **CompetencePreview**: Competence tree preview
- **WaitlistForm**: Email collection form

## Development Workflow

### 1. Create New Component

```typescript
// src/components/MyComponent.tsx
'use client'; // If using hooks

export function MyComponent() {
  return <div>Hello</div>;
}
```

### 2. Use in Page

```typescript
// src/app/page.tsx
import { MyComponent } from '@/components/MyComponent';

export default function Page() {
  return <MyComponent />;
}
```

### 3. Styling

Use Tailwind CSS classes:

```typescript
<div className="bg-white rounded-lg shadow-sm p-6">
  <h1 className="text-2xl font-light text-neutral-900">
    Title
  </h1>
</div>
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

## TypeScript Paths

The project uses path aliases:
- `@/*` → `src/*`
- `@ary/shared` → `../shared/src`

## Tailwind CSS

Tailwind is configured with a calming color palette:
- Primary colors (blue tones)
- Neutral colors (grays)
- Custom spacing and typography

See `tailwind.config.js` for full configuration.

## Next Steps

1. **Landing Page**: Already implemented with demo
2. **Chat Interface**: Connect to backend API
3. **Competence Tree**: Full visualization component
4. **Authentication**: Login/register pages
5. **Session Management**: Full conversation flow

## Troubleshooting

**Module not found errors:**
- Make sure shared package is built: `cd shared && npm run build`
- Reinstall dependencies: `npm install`

**TypeScript errors:**
- Run type check: `npm run type-check`
- Check that shared package types are exported correctly

**Styling not working:**
- Ensure Tailwind is configured in `tailwind.config.js`
- Check that `globals.css` imports Tailwind directives
- Restart dev server

## Design Principles

- **Calming UX**: Soft colors, gentle interactions
- **Minimal**: No unnecessary elements
- **Accessible**: Semantic HTML, proper ARIA labels
- **Responsive**: Mobile-first design
- **Type-safe**: Full TypeScript coverage

