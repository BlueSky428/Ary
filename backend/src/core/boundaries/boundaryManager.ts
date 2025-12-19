/**
 * Boundary Management Engine
 * Enforces ethical boundaries and prevents violations
 */

import {
  BoundaryViolation,
  EscalationLevel,
  BOUNDARY_RULES,
} from '@ary/shared';

export interface BoundaryCheck {
  violation: BoundaryViolation | null;
  escalationLevel: EscalationLevel;
  message?: string;
}

export class BoundaryManager {
  /**
   * Check user input for distress indicators
   */
  checkDistress(input: string): EscalationLevel {
    for (const pattern of BOUNDARY_RULES.DISTRESS_INDICATORS) {
      if (pattern.test(input)) {
        return EscalationLevel.SEVERE;
      }
    }

    // Additional distress patterns (less severe)
    const mildPatterns = [
      /(?:feel|feeling) (?:hopeless|worthless|empty)/i,
      /can't (?:cope|handle|deal)/i,
      /(?:always|never) (?:fail|screw up)/i,
    ];

    for (const pattern of mildPatterns) {
      if (pattern.test(input)) {
        return EscalationLevel.MILD;
      }
    }

    return EscalationLevel.NONE;
  }

  /**
   * Check response text for boundary violations
   */
  checkResponse(response: string): BoundaryCheck {
    // Check for prohibited patterns
    for (const pattern of BOUNDARY_RULES.PROHIBITED_PATTERNS) {
      if (pattern.test(response)) {
        return {
          violation: BoundaryViolation.PRESCRIPTIVE,
          escalationLevel: EscalationLevel.MILD,
          message: 'Response contains prohibited language',
        };
      }
    }

    // Check for diagnostic language
    if (this.containsDiagnosticLanguage(response)) {
      return {
        violation: BoundaryViolation.DIAGNOSTIC,
        escalationLevel: EscalationLevel.MODERATE,
        message: 'Response contains diagnostic language',
      };
    }

    // Check for evaluative language
    if (this.containsEvaluativeLanguage(response)) {
      return {
        violation: BoundaryViolation.EVALUATIVE,
        escalationLevel: EscalationLevel.MILD,
        message: 'Response contains evaluative language',
      };
    }

    return {
      violation: null,
      escalationLevel: EscalationLevel.NONE,
    };
  }

  /**
   * Get appropriate response for escalation level
   */
  getEscalationResponse(level: EscalationLevel): string | null {
    switch (level) {
      case EscalationLevel.SEVERE:
        return 'I\'m here to listen, but I\'m not a mental health professional. If you\'re experiencing thoughts of self-harm, please reach out to a crisis helpline or mental health professional immediately.';
      case EscalationLevel.MODERATE:
        return 'I want to make sure you have the support you need. Consider speaking with a trusted friend, family member, or professional counselor.';
      case EscalationLevel.MILD:
        return null; // No special response needed, just continue conversation
      default:
        return null;
    }
  }

  /**
   * Check for diagnostic language
   */
  private containsDiagnosticLanguage(text: string): boolean {
    const diagnosticPatterns = [
      /you (?:have|suffer from|are diagnosed with)/i,
      /(?:disorder|condition|syndrome|illness)/i,
      /you're (?:depressed|anxious|bipolar)/i,
    ];

    return diagnosticPatterns.some((pattern) => pattern.test(text));
  }

  /**
   * Check for evaluative language
   */
  private containsEvaluativeLanguage(text: string): boolean {
    const evaluativePatterns = [
      /you're (?:better|worse|good|bad) (?:at|than)/i,
      /your (?:score|rating|rank)/i,
      /you (?:excel|struggle|fail) (?:at|in)/i,
    ];

    return evaluativePatterns.some((pattern) => pattern.test(text));
  }
}

export const boundaryManager = new BoundaryManager();

