# Development Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Docker (optional, for containerized development)

## Setup

### 1. Clone and Install

```bash
# Install dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 2. Database Setup

```bash
# Create database
createdb ary_development

# Run migrations
cd backend
npm run migrate
```

### 3. Environment Variables

Copy `.env.example` files and configure:

**Backend** (`backend/.env.example`):
```
DATABASE_URL=postgresql://user:password@localhost:5432/ary_development
PORT=3001
NODE_ENV=development
ENCRYPTION_KEY=your-encryption-key-here
```

**Frontend** (`frontend/.env.example`):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## Project Structure

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed component descriptions.

## Code Style

- TypeScript strict mode
- ESLint + Prettier
- Conventional commits
- Test coverage for core logic

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

