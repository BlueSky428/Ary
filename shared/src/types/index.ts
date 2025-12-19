/**
 * Shared types for Ary application
 * These types ensure consistency between frontend and backend
 */

/**
 * Competence Tree Branches
 * The four core dimensions of professional competence
 */
export enum CompetenceBranch {
  COGNITIVE = 'cognitive',
  INTERPERSONAL = 'interpersonal',
  MOTIVATION = 'motivation',
  EXECUTION = 'execution',
}

/**
 * Derived Signal
 * Structured representation extracted from conversation
 * Never includes raw transcript data
 */
export interface DerivedSignal {
  id: string;
  branch: CompetenceBranch;
  trait: string; // e.g., "organizes complexity", "creates calm"
  confidence: number; // 0-1, internal only, never shown to user
  conversationContext?: string; // Optional reference to conversation segment
  timestamp: Date;
  userValidated?: boolean; // Whether user has confirmed this trait
}

/**
 * Competence Tree
 * Visual representation of user's strengths
 */
export interface CompetenceTree {
  userId: string;
  signals: DerivedSignal[];
  lastUpdated: Date;
  sessionCount: number;
}

/**
 * Conversation Message
 */
export interface Message {
  id: string;
  role: 'user' | 'ary';
  content: string;
  timestamp: Date;
  sessionId: string;
}

/**
 * Session
 */
export interface Session {
  id: string;
  userId: string;
  startedAt: Date;
  endedAt?: Date;
  duration?: number; // in minutes
  messageCount: number;
  isFollowUp: boolean;
}

/**
 * User Profile
 * Minimal user data - sovereignty principle
 */
export interface User {
  id: string;
  email: string;
  createdAt: Date;
  sessionCount: number;
  lastSessionAt?: Date;
  // No behavioral tracking, no analytics data
}

/**
 * Question Taxonomy
 * Permissible question types for psychological calibration
 */
export enum QuestionType {
  REFLECTIVE = 'reflective', // "What did that experience show you?"
  EXPLORATORY = 'exploratory', // "What feels important to you right now?"
  STRENGTH_ELICITING = 'strength_eliciting', // "When do you feel most capable?"
  GROWTH_INVITATION = 'growth_invitation', // "Would you like to explore this further?"
}

/**
 * Boundary Violation Types
 * What the system must prevent
 */
export enum BoundaryViolation {
  DIAGNOSTIC = 'diagnostic',
  EVALUATIVE = 'evaluative',
  PRESCRIPTIVE = 'prescriptive',
  CLINICAL = 'clinical',
  COERCIVE = 'coercive',
}

/**
 * Escalation Level
 * For distress detection
 */
export enum EscalationLevel {
  NONE = 'none',
  MILD = 'mild', // Pause certain interactions
  MODERATE = 'moderate', // Provide supportive disclaimers
  SEVERE = 'severe', // Encourage external human support
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

