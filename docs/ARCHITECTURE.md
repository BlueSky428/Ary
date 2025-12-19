# Ary Architecture Documentation

## System Overview

Ary is built on a foundation of psychological safety, user sovereignty, and institutional trust. The architecture enforces ethical boundaries at the system level.

## Core Components

### 1. Frontend (Next.js)

**Landing Page**
- Interactive demo with keyword-based inference
- Email collection for waitlist
- Minimal, calming UX

**Chat Interface**
- Natural conversation flow
- Real-time message rendering
- Session management

**Competence Tree Visualization**
- Visual representation of 4 branches (Cognitive, Interpersonal, Motivation, Execution)
- Plain-language interpretations
- User-editable traits
- Conversation traceability (optional)

### 2. Backend API

**Core Modules:**

#### Psychological Calibration Layer
- Question taxonomy enforcement
- Framing rules (strengths-based, autonomy-supportive)
- Pacing rules (conversational depth regulation)
- Emotional sensitivity filters

#### Boundary Management Engine
- Prevents therapeutic/diagnostic framing
- Blocks coercive language
- Escalation protocols for distress indicators
- Non-evaluative response generation

#### Strength Inference Engine (MVP: Rule-based)
- Pattern matching from user conversations
- Extracts signals for 4 competence branches
- No scoring or ranking
- Extensible for future LLM integration

#### Longitudinal Companionship Model
- Maintains continuity across sessions
- Stores derived signals (not raw transcripts)
- Temporal weighting
- Used only for reflection, not evaluation

#### Sovereign Identity Vault
- Encrypted storage of derived signals
- Exclusive user control
- No raw transcript retention
- User can view, modify, export, delete

### 3. Data Architecture

**User Data Model:**
- User profile (minimal: email, session count)
- Derived signals (encrypted, user-controlled)
- Competence tree state
- Session metadata (timestamps, duration)

**No Storage:**
- Raw conversation transcripts
- Surveillance-style logs
- Behavioral analytics
- Scoring or ranking data

## Security & Privacy

- End-to-end encryption for sensitive data
- Zero-knowledge architecture where possible
- GDPR/CCPA compliant by design
- Institutional deployment ready

## Future Extensions

- LLM integration (structured, bounded)
- Privacy-preserving verification (zero-knowledge proofs)
- External material analysis (job descriptions, etc.)
- Multi-tenant institutional deployment
- API for third-party integrations

## Ethical Boundaries (Enforced in Code)

1. **No Scoring**: System cannot generate numerical assessments
2. **No Diagnosis**: No clinical or therapeutic language
3. **No Coercion**: All interactions are voluntary
4. **No Surveillance**: No behavioral tracking or analytics
5. **User Control**: Complete data sovereignty

