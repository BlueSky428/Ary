# Technical Requirements Document

## MVP Scope

### Core Features

1. **Landing Page with Interactive Demo**
   - Simple chat interface
   - Keyword-based inference (no AI)
   - Competence tree preview
   - Email waitlist collection

2. **User Authentication**
   - Email-based registration
   - JWT token authentication
   - Session management

3. **Conversation Sessions**
   - 20-minute warm session
   - User-initiated follow-ups (10 minutes each)
   - Message history (transient, not stored)

4. **Strength Inference Engine (MVP)**
   - Rule-based pattern matching
   - Extracts signals for 4 competence branches
   - No scoring or ranking
   - Extensible for future LLM integration

5. **Competence Tree**
   - Visual representation of 4 branches
   - Plain-language interpretations
   - User-editable traits
   - Optional conversation traceability

6. **Sovereign Vault**
   - Encrypted storage of derived signals
   - No raw transcript storage
   - User can view, modify, export, delete

### Technical Stack

**Frontend:**
- Next.js 14+ (React, TypeScript)
- Tailwind CSS
- Zustand (state management)
- Framer Motion (animations)

**Backend:**
- Node.js, TypeScript, Express
- PostgreSQL
- JWT authentication
- Encryption utilities

**Infrastructure:**
- Docker containers
- Cloud-ready deployment
- Environment-based configuration

### Data Model

**Users Table:**
- id (UUID)
- email (unique)
- password_hash
- created_at
- session_count
- last_session_at

**Sessions Table:**
- id (UUID)
- user_id
- started_at
- ended_at
- duration_minutes
- message_count
- is_follow_up

**Vault Table:**
- user_id (UUID, primary key)
- encrypted_data (text)
- last_updated
- session_count

**Waitlist Table:**
- id (UUID)
- email (unique)
- created_at

### API Endpoints

**Public:**
- `POST /api/demo/analyze` - Demo inference
- `POST /api/demo/waitlist` - Join early access list

**Authenticated:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/sessions` - Create session
- `GET /api/sessions/:id` - Get session
- `POST /api/sessions/:id/messages` - Send message
- `GET /api/sessions/:id/messages` - Get messages
- `POST /api/sessions/:id/end` - End session
- `GET /api/competence/tree` - Get competence tree
- `PUT /api/competence/tree/signals/:id` - Update signal
- `DELETE /api/competence/tree/signals/:id` - Delete signal
- `GET /api/vault/export` - Export user data
- `DELETE /api/vault` - Delete user data

### Security Requirements

- End-to-end encryption for vault data
- JWT token expiration (24 hours)
- Password hashing (bcrypt)
- CORS configuration
- Helmet.js security headers
- Input validation (Zod)
- SQL injection prevention (parameterized queries)

### Ethical Boundaries (Enforced)

1. No scoring or ranking
2. No diagnostic language
3. No therapeutic framing
4. No coercive prompts
5. No behavioral tracking
6. Complete user data sovereignty

### Future Extensions (Post-MVP)

- LLM integration (GPT-4 with strict prompts)
- Privacy-preserving verification (zero-knowledge proofs)
- External material analysis (job descriptions)
- Multi-tenant institutional deployment
- Advanced competence tree visualization
- Export formats (PDF, JSON)

