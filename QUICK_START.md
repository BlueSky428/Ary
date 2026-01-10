# Quick Start Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+ (or Docker)
- Git

## Setup (5 minutes)

### 1. Install Dependencies

```bash
# Root level
npm install

# Frontend
cd frontend && npm install && cd ..

# Backend
cd backend && npm install && cd ..

# Shared
cd shared && npm install && cd ..
```

### 2. Database Setup

```bash
# Create database
createdb ary_development

# Or using Docker
docker run --name ary-postgres -e POSTGRES_PASSWORD=ary_dev_password -e POSTGRES_DB=ary_development -p 5432:5432 -d postgres:14-alpine
```

### 3. Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://postgres:ary_dev_password@localhost:5432/ary_development
PORT=3001
NODE_ENV=development
ENCRYPTION_KEY=your-32-character-encryption-key-here
JWT_SECRET=your-jwt-secret-key-here
ALLOWED_ORIGINS=http://localhost:3000
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Build Shared Package

```bash
cd shared && npm run build && cd ..
```

### 5. Run Development Servers

**Option A: Using npm workspaces (recommended)**
```bash
npm run dev
```

**Option B: Separate terminals**
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### 6. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/health

## Testing the Demo

1. Visit http://localhost:3000
2. Try the interactive demo:
   - Type: "I'm feeling a bit stuck in my career"
   - Continue the conversation
   - Click "See what I see" to view competence preview
3. Join the early access list with your email

## Project Structure

```
ary/
├── frontend/     # Next.js app (port 3000)
├── backend/      # Express API (port 3001)
├── shared/       # Shared types & constants
└── docs/         # Documentation
```

## Next Steps

1. **Read Documentation**:
   - [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - System design
   - [TECHNICAL_REQUIREMENTS.md](./docs/TECHNICAL_REQUIREMENTS.md) - MVP specs
   - [PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md) - Code organization

2. **Implement Core Features**:
   - Database migrations
   - Authentication endpoints
   - Session management
   - Full inference engine

3. **Development Workflow**:
   - Make changes
   - Test locally
   - Check linter: `npm run lint`
   - Type check: `npm run type-check`

## Common Issues

**Port already in use:**
- Change PORT in backend/.env
- Change port in frontend/.env.local

**Database connection error:**
- Check DATABASE_URL in backend/.env
- Ensure PostgreSQL is running
- Check credentials

**Module not found:**
- Rebuild shared package: `cd shared && npm run build`
- Reinstall dependencies: `npm install`

## Need Help?

- Check [DEVELOPMENT.md](./docs/DEVELOPMENT.md) for detailed setup
- Review [IMPLEMENTATION_ROADMAP.md](./docs/IMPLEMENTATION_ROADMAP.md) for next steps

