"use strict";
/**
 * Shared types for Ary application
 * These types ensure consistency between frontend and backend
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.EscalationLevel = exports.BoundaryViolation = exports.QuestionType = exports.CompetenceBranch = void 0;
/**
 * Competence Tree Branches
 * The four core dimensions of professional competence
 */
var CompetenceBranch;
(function (CompetenceBranch) {
    CompetenceBranch["COGNITIVE"] = "cognitive";
    CompetenceBranch["INTERPERSONAL"] = "interpersonal";
    CompetenceBranch["MOTIVATION"] = "motivation";
    CompetenceBranch["EXECUTION"] = "execution";
})(CompetenceBranch || (exports.CompetenceBranch = CompetenceBranch = {}));
/**
 * Question Taxonomy
 * Permissible question types for psychological calibration
 */
var QuestionType;
(function (QuestionType) {
    QuestionType["REFLECTIVE"] = "reflective";
    QuestionType["EXPLORATORY"] = "exploratory";
    QuestionType["STRENGTH_ELICITING"] = "strength_eliciting";
    QuestionType["GROWTH_INVITATION"] = "growth_invitation";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
/**
 * Boundary Violation Types
 * What the system must prevent
 */
var BoundaryViolation;
(function (BoundaryViolation) {
    BoundaryViolation["DIAGNOSTIC"] = "diagnostic";
    BoundaryViolation["EVALUATIVE"] = "evaluative";
    BoundaryViolation["PRESCRIPTIVE"] = "prescriptive";
    BoundaryViolation["CLINICAL"] = "clinical";
    BoundaryViolation["COERCIVE"] = "coercive";
})(BoundaryViolation || (exports.BoundaryViolation = BoundaryViolation = {}));
/**
 * Escalation Level
 * For distress detection
 */
var EscalationLevel;
(function (EscalationLevel) {
    EscalationLevel["NONE"] = "none";
    EscalationLevel["MILD"] = "mild";
    EscalationLevel["MODERATE"] = "moderate";
    EscalationLevel["SEVERE"] = "severe";
})(EscalationLevel || (exports.EscalationLevel = EscalationLevel = {}));
