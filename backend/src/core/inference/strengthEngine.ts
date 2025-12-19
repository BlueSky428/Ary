/**
 * Strength Inference Engine
 * MVP: Rule-based pattern matching
 * Future: LLM-based inference with strict boundaries
 */

import {
  CompetenceBranch,
  DerivedSignal,
  Message,
  INFERENCE_KEYWORDS,
} from '@ary/shared';

export class StrengthInferenceEngine {
  /**
   * Analyze conversation messages and extract competence signals
   * @param messages - Array of conversation messages
   * @returns Array of derived signals (never raw transcript)
   */
  analyze(messages: Message[]): DerivedSignal[] {
    // Extract user messages only (Ary responses are not analyzed)
    const userMessages = messages
      .filter((msg) => msg.role === 'user')
      .map((msg) => msg.content)
      .join(' ');

    return this.extractSignals(userMessages);
  }

  /**
   * Extract signals from conversation text
   * MVP: Keyword-based matching
   * Future: LLM-based with prompt engineering for safety
   */
  private extractSignals(text: string): DerivedSignal[] {
    const signals: DerivedSignal[] = [];
    const lowerText = text.toLowerCase();

    // Analyze each competence branch
    for (const [branch, keywords] of Object.entries(INFERENCE_KEYWORDS)) {
      const matches = this.findMatches(lowerText, keywords);

      if (matches.length > 0) {
        const confidence = this.calculateConfidence(matches, keywords.length);
        const trait = this.inferTrait(
          branch as CompetenceBranch,
          matches,
          text
        );

        signals.push({
          id: this.generateId(),
          branch: branch as CompetenceBranch,
          trait,
          confidence,
          timestamp: new Date(),
        });
      }
    }

    return signals;
  }

  /**
   * Find keyword matches in text
   */
  private findMatches(text: string, keywords: string[]): string[] {
    return keywords.filter((keyword) => text.includes(keyword.toLowerCase()));
  }

  /**
   * Calculate confidence score (internal only, never shown to user)
   */
  private calculateConfidence(
    matches: string[],
    totalKeywords: number
  ): number {
    // Simple ratio-based confidence
    return Math.min(matches.length / totalKeywords, 1);
  }

  /**
   * Infer human-readable trait from matches
   */
  private inferTrait(
    branch: CompetenceBranch,
    matches: string[],
    context: string
  ): string {
    // MVP: Simple trait generation
    // Future: LLM-based with safety constraints

    const traitTemplates: Record<CompetenceBranch, string[]> = {
      [CompetenceBranch.COGNITIVE]: [
        'organizes complexity',
        'thinks systematically',
        'analyzes information deeply',
        'solves problems methodically',
      ],
      [CompetenceBranch.INTERPERSONAL]: [
        'creates calm and trust',
        'listens with empathy',
        'supports others effectively',
        'connects with people',
      ],
      [CompetenceBranch.MOTIVATION]: [
        'energized by meaningful work',
        'driven by purpose',
        'finds inspiration in challenges',
        'self-motivated',
      ],
      [CompetenceBranch.EXECUTION]: [
        'delivers on commitments',
        'executes with precision',
        'sees tasks through',
        'achieves results',
      ],
    };

    // Select trait based on matched keywords
    const templates = traitTemplates[branch];
    const index = matches.length % templates.length;
    return templates[index];
  }

  /**
   * Generate unique ID for signal
   */
  private generateId(): string {
    return `signal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const strengthInferenceEngine = new StrengthInferenceEngine();

