/**
 * Demo Inference Engine
 * Simple keyword-based inference for landing page demo
 * No AI/LLM - pure rule-based pattern matching
 */

import {
  CompetenceBranch,
  DerivedSignal,
  INFERENCE_KEYWORDS,
} from '@ary/shared';

export class DemoInferenceEngine {
  /**
   * Analyze conversation text and extract competence signals
   * @param text - Conversation text to analyze
   * @returns Array of derived signals
   */
  analyze(text: string): DerivedSignal[] {
    const signals: DerivedSignal[] = [];
    const lowerText = text.toLowerCase();

    // Check each competence branch
    for (const [branch, keywords] of Object.entries(INFERENCE_KEYWORDS)) {
      const matches = keywords.filter((keyword) =>
        lowerText.includes(keyword.toLowerCase())
      );

      if (matches.length > 0) {
        // Simple confidence based on keyword matches
        const confidence = Math.min(matches.length / keywords.length, 1);

        // Generate trait description based on branch and keywords
        const trait = this.generateTrait(
          branch as CompetenceBranch,
          matches
        );

        signals.push({
          id: `demo-${Date.now()}-${Math.random()}`,
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
   * Generate human-readable trait description
   */
  private generateTrait(
    branch: CompetenceBranch,
    matchedKeywords: string[]
  ): string {
    const traitMap: Record<CompetenceBranch, Record<string, string>> = {
      [CompetenceBranch.COGNITIVE]: {
        analyze: 'analyzes complex information',
        structure: 'organizes complexity',
        think: 'thinks systematically',
        solve: 'solves problems methodically',
      },
      [CompetenceBranch.INTERPERSONAL]: {
        help: 'supports others effectively',
        listen: 'listens with empathy',
        calm: 'creates calm and trust',
        connect: 'connects with people',
      },
      [CompetenceBranch.MOTIVATION]: {
        excited: 'energized by meaningful work',
        passionate: 'driven by purpose',
        motivated: 'self-motivated',
        inspired: 'finds inspiration in challenges',
      },
      [CompetenceBranch.EXECUTION]: {
        deliver: 'delivers on commitments',
        complete: 'sees tasks through',
        execute: 'executes with precision',
        achieve: 'achieves results',
      },
    };

    // Use first matched keyword to generate trait
    const firstKeyword = matchedKeywords[0];
    return (
      traitMap[branch]?.[firstKeyword] ||
      `demonstrates ${branch} competence`
    );
  }
}

export const demoInferenceEngine = new DemoInferenceEngine();

