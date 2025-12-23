"use strict";
/**
 * Shared constants for Ary application
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.INFERENCE_KEYWORDS = exports.BOUNDARY_RULES = exports.COMPETENCE_BRANCH_DESCRIPTIONS = exports.COMPETENCE_BRANCH_LABELS = exports.SESSION_CONFIG = void 0;
const types_1 = require("../types");
/**
 * Session Configuration
 */
exports.SESSION_CONFIG = {
    WARM_SESSION_DURATION_MINUTES: 20,
    FOLLOW_UP_DURATION_MINUTES: 10,
    MAX_FOLLOW_UPS: 2,
};
/**
 * Competence Branch Labels
 */
exports.COMPETENCE_BRANCH_LABELS = {
    [types_1.CompetenceBranch.COGNITIVE]: 'Cognitive',
    [types_1.CompetenceBranch.INTERPERSONAL]: 'Interpersonal',
    [types_1.CompetenceBranch.MOTIVATION]: 'Motivation',
    [types_1.CompetenceBranch.EXECUTION]: 'Execution',
};
/**
 * Competence Branch Descriptions
 */
exports.COMPETENCE_BRANCH_DESCRIPTIONS = {
    [types_1.CompetenceBranch.COGNITIVE]: 'How you think, analyze, and process information',
    [types_1.CompetenceBranch.INTERPERSONAL]: 'How you connect, communicate, and relate to others',
    [types_1.CompetenceBranch.MOTIVATION]: 'What energizes you and drives your actions',
    [types_1.CompetenceBranch.EXECUTION]: 'How you act, organize, and deliver results',
};
/**
 * Boundary Rules
 */
exports.BOUNDARY_RULES = {
    // Prohibited phrases/patterns
    PROHIBITED_PATTERNS: [
        /you should/i,
        /you need to/i,
        /you must/i,
        /you're (?:suffering from|diagnosed with|have)/i,
        /you have (?:a|an) (?:disorder|condition|problem)/i,
        /your score/i,
        /you rank/i,
        /you're (?:better|worse) than/i,
    ],
    // Distress indicators
    DISTRESS_INDICATORS: [
        /want to (?:die|kill myself|end it)/i,
        /suicide/i,
        /self harm/i,
        /can't go on/i,
    ],
};
/**
 * Inference Keywords (MVP - Rule-based)
 * These will be replaced with LLM-based inference in future
 */
exports.INFERENCE_KEYWORDS = {
    [types_1.CompetenceBranch.COGNITIVE]: [
        'analyze', 'structure', 'organize', 'think', 'understand', 'solve',
        'complexity', 'pattern', 'logic', 'reasoning', 'strategy', 'plan',
    ],
    [types_1.CompetenceBranch.INTERPERSONAL]: [
        'help', 'support', 'listen', 'understand', 'calm', 'trust', 'connect',
        'communicate', 'relate', 'empathy', 'collaborate', 'team',
    ],
    [types_1.CompetenceBranch.MOTIVATION]: [
        'excited', 'energized', 'passionate', 'driven', 'motivated', 'purpose',
        'meaning', 'fulfillment', 'satisfaction', 'inspired', 'engaged',
    ],
    [types_1.CompetenceBranch.EXECUTION]: [
        'deliver', 'complete', 'finish', 'execute', 'implement', 'action',
        'results', 'outcome', 'achieve', 'accomplish', 'produce', 'create',
    ],
};
