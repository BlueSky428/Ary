# Project Structure Overview

## Directory Layout

```
ary/
├── frontend/                 # Next.js web application
│   ├── src/
│   │   ├── app/             # Next.js 13+ app router
│   │   │   ├── layout.tsx  # Root layout
│   │   │   ├── page.tsx    # Landing page
│   │   │   └── globals.css # Global styles
│   │   └── components/     # React components
│   │       ├── DemoSection.tsx      # Interactive demo
│   │       ├── ChatInterface.tsx    # Chat UI
│   │       ├── CompetencePreview.tsx # Tree preview
│   │       └── WaitlistForm.tsx      # Email collection
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── backend/                  # Node.js/TypeScript API
│   ├── src/
│   │   ├── api/            # API route handlers
│   │   │   ├── index.ts    # Main router
│   │   │   ├── auth.ts     # Authentication
│   │   │   ├── sessions.ts # Session management
│   │   │   ├── competence.ts # Competence tree
│   │   │   ├── vault.ts    # Data sovereignty
│   │   │   └── demo.ts     # Landing page demo
│   │   ├── core/           # Core business logic
│   │   │   ├── inference/  # Strength inference
│   │   │   │   ├── strengthEngine.ts # Main engine
│   │   │   │   └── demoEngine.ts     # Demo version
│   │   │   ├── calibration/ # Psychological calibration
│   │   │   │   └── questionTaxonomy.ts
│   │   │   ├── boundaries/  # Boundary management
│   │   │   │   └── boundaryManager.ts
│   │   │   ├── vault/      # Sovereign vault
│   │   │   │   └── vaultManager.ts
│   │   │   └── crypto/     # Encryption
│   │   │       └── encryption.ts
│   │   ├── db/             # Database
│   │   │   └── connection.ts
│   │   ├── middleware/     # Express middleware
│   │   │   ├── auth.ts     # JWT authentication
│   │   │   └── errorHandler.ts
│   │   ├── utils/          # Utilities
│   │   │   └── logger.ts
│   │   └── index.ts        # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── shared/                   # Shared types and utilities
│   ├── src/
│   │   ├── types/          # TypeScript types
│   │   │   └── index.ts
│   │   ├── constants/     # Shared constants
│   │   │   └── index.ts
│   │   └── index.ts       # Main exports
│   ├── package.json
│   └── tsconfig.json
│
├── infrastructure/          # Deployment configs
│   ├── docker-compose.yml
│   ├── backend.Dockerfile
│   └── frontend.Dockerfile
│
├── docs/                     # Documentation
│   ├── ARCHITECTURE.md
│   ├── DEVELOPMENT.md
│   ├── TECHNICAL_REQUIREMENTS.md
│   └── PROJECT_STRUCTURE.md
│
├── package.json              # Root workspace config
├── .gitignore
└── README.md
```

## Key Design Decisions

### 1. Monorepo Structure
- **Shared package**: Ensures type safety between frontend and backend
- **Workspace management**: Single source of truth for dependencies
- **Code reuse**: Common types and constants

### 2. Separation of Concerns

**Frontend:**
- Presentation layer only
- No business logic
- Communicates with backend via API

**Backend:**
- All business logic
- Ethical boundaries enforced at system level
- Data sovereignty built-in

**Shared:**
- Type definitions
- Constants
- Validation schemas (future)

### 3. Core Modules

**Inference Engine:**
- MVP: Rule-based (keyword matching)
- Extensible for LLM integration
- Never scores or ranks

**Boundary Manager:**
- Enforces ethical constraints
- Prevents diagnostic/therapeutic language
- Escalation protocols for distress

**Vault Manager:**
- Encrypted storage
- User-controlled data
- No raw transcripts

**Calibration Layer:**
- Question taxonomy
- Framing rules
- Pacing controls

### 4. Security & Privacy

- End-to-end encryption for vault
- JWT authentication
- No behavioral tracking
- GDPR-compliant by design
- User data sovereignty

### 5. Scalability Considerations

- Modular architecture
- Database abstraction ready
- LLM integration points defined
- Multi-tenant support structure
- Institutional deployment ready

## Next Steps

1. **Database Setup**: Create migration files for PostgreSQL
2. **Authentication**: Implement JWT-based auth endpoints
3. **Session Management**: Build conversation session logic
4. **Inference Refinement**: Enhance rule-based engine
5. **UI Polish**: Refine frontend components
6. **Testing**: Add unit and integration tests
7. **LLM Integration**: Prepare for future AI integration

