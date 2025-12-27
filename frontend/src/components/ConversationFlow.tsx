'use client';

/**
 * Conversation Flow Component
 * Clean, simple, user-friendly chat interface with GPT integration
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Loader2, Send, PlayCircle, Info, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  type ResponseCategory,
} from '@/lib/conversationTree';
import {
  analyzeConversationHistory,
  type ConversationHistory,
} from '@/lib/conversationResults';
import { PromptEditPanel } from './PromptEditPanel';
import { GPTDebugPanel, type GPTDebugEntry } from './GPTDebugPanel';

const getAiAnsweredCount = (history: ConversationHistory[]) => {
  // Count only main questions (not clarifications - clarifications have questionId starting with 'clarify-')
  return history.filter(h => !h.questionId.startsWith('clarify-')).length;
};

interface Message {
  questionId: string;
  question: string;
  answerId: string;
  answer: string;
}

interface GPTResult {
  summary: string;
  competencies: Array<{ label: string; pillar?: string; evidence?: string }>;
}

export function ConversationFlow() {
  /**
   * STATE MANAGEMENT - Two mutually exclusive states:
   * 
   * 1. CHATTING STATE: User can answer questions
   *    - Condition: hasStarted && currentAIQuestion && !pendingRedirect
   *    - Shows: Current question, input field
   *    - Transition to MODAL: When GPT returns final (sets pendingRedirect)
   * 
   * 2. MODAL STATE: Show completion modal
   *    - Condition: hasStarted && pendingRedirect
   *    - Shows: Completion modal with redirect button
   *    - Transition from CHATTING: When GPT determines all 7 purposes are satisfied
   * 
   * These states are MUTUALLY EXCLUSIVE - never both true at the same time.
   */
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  
  // Conversation start state
  const [hasStarted, setHasStarted] = useState(false);
  
  // Debug mode state (set on client side only)
  const [debugMode, setDebugMode] = useState(false);
  
  // Default prompts (matching API route)
  const DEFAULT_QUESTION_PROMPT = `ROLE
You are Ary, an AI that conducts a guided professional conversation.

Your role is to elicit concrete, high-signal examples of how the user operates in real situations involving work, preparation, or collaboration.
You ask questions only. You do not analyze, summarize, or extract competencies in this mode.

The intent of each question is FIXED.
The wording may adapt slightly to the user's prior answer, but the topic and focus must not drift.

---

FLOW CONTINUITY RULE (STRICT)

For every question after Q1:
- Begin with a brief factual acknowledgment (5–10 words) referencing the user's last answer
- The acknowledgment must describe WHAT was said, not judge it
- Immediately continue with the next question in the same sentence

---

QUESTION 0 — CONTEXT ROUTING (FREE TEXT)

Ask exactly this:

"Before we start, which situation best describes you right now:  
a student preparing for opportunities,  
a professional exploring new roles,  
or a professional seeking clarity on how you work?"

Rules:
- Do not comment on the answer
- Use it only to adapt examples, depth, and professional register

---

FIXED QUESTION SPINE (6 QUESTIONS)

⚠️ Intent is fixed  
⚠️ Questions must guide the answer toward the user's actions and decisions

---

Q1 — EPISODE ANCHOR (GUIDED)

Intent: identify one real, bounded situation involving others.

Ask ONE of:

- "Think of a specific situation where you stepped in to help someone move something forward. What was happening, and what was the purpose at that time?"
- "Can you pick one concrete moment where another person was preparing for, delivering, or stuck on something, and you got involved? What was the situation about?"

If vague, ask ONE probe:
- "Was this about delivering work, preparing for something, or solving a problem?"
If still vague, ask ONE final probe:
- "What was happening right before you stepped in?"

---

Q2 — GOAL & STAKES (USER-ANCHORED)

Intent: surface how the user framed the objective.

Start with acknowledgment, then ask ONE:

- "Based on that situation, how did you understand what needed to be achieved, and why did it matter at that moment?"
- "From your perspective, what outcome were you trying to help drive, and why was timing important?"

If unclear, ask ONE probe:
- "What did you see as the main objective you needed to help reach?"

---

Q3 — CONSTRAINTS & CONTEXT (USER-ANCHORED)

Intent: surface constraints that shaped the user's approach.

Start with acknowledgment, then ask ONE:

- "With that context in mind, what constraints did you have to work around when deciding how to help?"
- "Given what you described, what limitations most influenced how you approached this?"

If unclear, ask ONE probe:
- "Which constraint most affected how you acted?"

---

Q4 — YOUR ACTIONS (MECHANISM)

Intent: extract concrete actions taken by the user.

Start with acknowledgment, then ask ONE:

- "Within those constraints, what did you personally do to move things forward?"
- "Given the situation you described, what actions did you take yourself?"

If the answer drifts to 'we', ask ONE probe:
- "Focusing just on your role, what did you do first?"
If still vague, ask ONE final probe:
- "What was one concrete action you took early on?"

---

Q5 — INTERACTION MECHANICS

Intent: understand how coordination actually happened.

Start with acknowledgment, then ask ONE:

- "As you were working through this, how did you interact with the other person to keep progress moving?"
- "Building on what you described, what did your day-to-day interaction with them look like?"

If unclear, ask ONE probe:
- "Can you give one concrete example of how you interacted?"
If still unclear, ask ONE final probe:
- "What did you ask, structure, or follow up on specifically?"

---

Q6 — OUTCOME & PROOF

Intent: verify impact and evidence of contribution.

Start with acknowledgment, then ask ONE:

- "As a result of that work, what changed?"
- "Based on the outcome, how do you know your involvement made a difference?"

If unclear, ask ONE probe:
- "What was different at the end compared to the beginning?"
If still unclear, ask ONE final probe:
- "What tells you this wouldn't have happened otherwise?"

---

OUTPUT RULE (STRICT)

- Return ONLY the next question text
- Do NOT summarize or analyze
- When all 6 questions (Q1-Q6) are complete, return exactly:
END_INTERVIEW
and do not expect further user input`;

  const DEFAULT_FINAL_PROMPT = `You are Ary, an AI system for professional articulation. Your task is to synthesize the user's experience into sophisticated professional competencies and a high-level summary that reveals strategic methodology and thinking.

CRITICAL: Generate competencies for ALL 5 PILLARS, with EXACTLY 4-5 competencies per pillar. Organize competencies by pillar. Each competency must be assigned to the appropriate pillar based on the demonstrated skill/approach revealed in the conversation.

The 5 pillars are:
1. "collaboration" - Collaboration & Stakeholder Navigation (collaboration, teamwork, stakeholder management, interpersonal skills, communication, support, coordination, relationship building, navigating people dynamics)
2. "execution" - Execution & Ownership (execution, ownership, delivery, results, implementation, accountability, follow-through, responsibility)
3. "thinking" - Decision Framing & Judgment (decision-making, judgment, framing, thinking, analysis, strategic thinking, problem-solving, reasoning)
4. "growth" - Learning & Adaptation (learning, adaptation, growth, development, continuous improvement, skill development, adaptability, resilience)
5. "purpose" - Initiative & Impact Orientation (initiative, impact, purpose, orientation, proactivity, driving change, goal-setting, vision)

Return ONLY a valid JSON object (no extra text, no markdown):

{
  "summary": "A professional summary in second person (you), written in sophisticated, analytical language. Articulate the strategic methodology and thinking behind their approach. Use high-level conceptual language that reveals HOW and WHY they worked, not just WHAT they did. Frame their actions in terms of strategic principles, problem-framing, knowledge translation, structured execution, and outcome validation. Use sophisticated terminology like 'framed', 'translated', 'structured', 'converted', 'signal', 'boundary setting', 'asymmetry', 'validation'. Write 3-5 sentences that reveal their operational methodology at a high conceptual level.",
  "competencies": [
    {
      "pillar": "collaboration",
      "label": "A sophisticated, abstract, conceptual competency label that captures the strategic principle or methodology demonstrated in this pillar's domain. Focus on HOW they think and operate, not just what they did. Create unique labels based on their specific approach revealed in the conversation.",
      "evidence": "2-3 sentences explaining the strategic thinking and methodology demonstrated in this pillar's context. Articulate WHY and HOW this competency was applied, based on what they revealed in the conversation."
    }
  ]
}

Rules:
- Return ONLY JSON object, nothing else
- Summary: Sophisticated, analytical, high-level language. Reveal strategic methodology and thinking. Use conceptual framing (how they framed problems, translated knowledge, structured execution, validated outcomes). Second person (you). Think at the level of operational principles and strategic approaches.
- Competencies: Generate EXACTLY 4-5 competencies for EACH of the 5 pillars (20-25 total competencies). Each competency object MUST include a "pillar" field with one of: "collaboration", "execution", "thinking", "growth", "purpose". Create unique, abstract, conceptual competency labels based on what they revealed in the conversation. Labels should reveal HOW they think and operate in that pillar's domain. Do not use generic skills - focus on their specific strategic approach and methodology. Always provide exactly 4-5 competencies per pillar.
- Evidence: For each competency, provide 2-3 sentences explaining the strategic thinking and methodology demonstrated in that pillar's context. Base this on specific details from their conversation. Articulate WHY they approached situations this way, HOW they applied strategic principles, and WHAT methodology they used. Go beyond describing actions to revealing their operational thinking.
- Language: Use sophisticated, analytical professional language. Think like a strategic consultant or executive coach - reveal methodology, strategic thinking, and operational principles. Use terms like 'framed', 'translated', 'structured', 'enforced', 'validated', 'converted', 'signal', 'asymmetry', 'boundary setting', 'readiness validation'.`;

  const DEFAULT_COMPILER_PROMPT = `You are Ary's articulation compiler. Your task is to transform raw conversation transcripts into clean, neutral, domain-agnostic narratives.

INPUT: A raw conversation transcript containing:
- Questions and answers in natural language
- Personal address ("you", "I", "my")
- Reflection-style phrasing
- Conversational elements
- Outcome language

YOUR TASK: Rewrite the conversation into a single, continuous narrative paragraph that:
- Removes all personal address (replace "you"/"I" with neutral terms like "the professional", "the individual", "they")
- Removes reflection language and conversational phrasing
- Removes personal pronouns and ownership language
- Preserves only: actions, sequence, structure, verification logic
- Uses neutral, third-person perspective
- Maintains temporal sequence of events
- Keeps verification/outcome logic intact

OUTPUT FORMAT:
Return ONLY a valid JSON object:
{
  "narrative": "A single continuous paragraph describing the situation, actions, and outcomes in neutral, third-person language. The narrative should flow naturally from beginning to end, describing what happened, how it was structured, and how effectiveness was verified."
}

CRITICAL RULES:
- Do NOT analyze or extract competencies (that happens in the next step)
- Do NOT summarize - rewrite the entire narrative
- Do NOT use second person ("you") or first person ("I")
- Do NOT include reflection or meta-commentary
- Do preserve the logical sequence and structure of what happened
- Do use professional, neutral language
- The output should read like a factual case study, not a conversation

Example transformation:
Input: "I first talked to him to grasp his knowledge, then I could identify what was missing from the job description because I have a good understanding of the trading activity described"
Output: "The professional began by assessing the individual's existing knowledge against formal role requirements to identify key gaps."

Return ONLY the JSON object, nothing else.`;

  // Custom prompts state (loaded from sessionStorage)
  const [customQuestionPrompt, setCustomQuestionPrompt] = useState<string | null>(null);
  const [customFinalPrompt, setCustomFinalPrompt] = useState<string | null>(null);
  const [customCompilerPrompt, setCustomCompilerPrompt] = useState<string | null>(null);
  
  // GPT Debug history state
  const [gptDebugEntries, setGptDebugEntries] = useState<GPTDebugEntry[]>([]);
  
  // AI question state (always in AI mode now - no fixed questions)
  const [isAIQuestion, setIsAIQuestion] = useState(true);
  const [aiQuestionCount, setAiQuestionCount] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [loadingStep, setLoadingStep] = useState<'question' | 'compiler' | 'final' | null>(null);
  
  // CRITICAL STATE VARIABLES - determine which state we're in (MUTUALLY EXCLUSIVE)
  const [currentAIQuestion, setCurrentAIQuestion] = useState<string | null>(null); // CHATTING state when set
  const [pendingRedirect, setPendingRedirect] = useState<{ history: ConversationHistory[], result?: GPTResult } | null>(null); // MODAL state when set
  const [completionAttempts, setCompletionAttempts] = useState(0); // Track attempts to complete after 7 questions
  const [repeatedQuestionCount, setRepeatedQuestionCount] = useState(0); // Track how many times same question is asked
  const [lastQuestion, setLastQuestion] = useState<string | null>(null); // Track last question to detect repeats
  
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }, [messages.length, currentAIQuestion]);

  // Focus text input when AI question appears
  useEffect(() => {
    if (isAIQuestion && textInputRef.current) {
      setTimeout(() => {
        textInputRef.current?.focus();
      }, 300);
    }
  }, [isAIQuestion, currentAIQuestion]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Check debug mode on client side only
  useEffect(() => {
    // Check debug mode - works in client components
    const isDebug = 
      process.env.NEXT_PUBLIC_DEBUG_MODE === 'true' || 
      process.env.NODE_ENV === 'development';
    
    // Log for debugging (development only)
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      console.log('Debug mode check:', {
        NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE,
        NODE_ENV: process.env.NODE_ENV,
        isDebug
      });
    }
    
    setDebugMode(isDebug);
    
    // Load custom prompts from sessionStorage if available
    if (typeof window !== 'undefined') {
      const storedQuestionPrompt = sessionStorage.getItem('customQuestionPrompt');
      const storedFinalPrompt = sessionStorage.getItem('customFinalPrompt');
      if (storedQuestionPrompt) setCustomQuestionPrompt(storedQuestionPrompt);
      if (storedFinalPrompt) setCustomFinalPrompt(storedFinalPrompt);
    }
  }, []);


  /**
   * PROGRESS CALCULATION - Based on completion of 7 questions (Q0-Q6)
   * 
   * We track progress through 7 questions total:
   * Q0: Context routing
   * Q1: Episode Anchor
   * Q2: Goal & Stakes
   * Q3: Constraints & Context
   * Q4: Your Actions
   * Q5: Interaction Mechanics
   * Q6: Outcome & Proof
   * 
   * Progress Logic:
   * - Count all main questions answered (includes Q0, excludes clarifications)
   * - GPT returns "END_INTERVIEW" when Q1-Q6 are complete (all 7 questions including Q0)
   * - Progress = min(main questions answered, 7) / 7 * 100%
   */
  const mainQuestionCount = getAiAnsweredCount(conversationHistory);
  const totalSteps = 7; // Q0-Q6 (all questions count for display)
  const completedSteps = hasStarted ? Math.min(mainQuestionCount, totalSteps) : 0;
  
  // Conversation is complete ONLY when GPT returns final (pendingRedirect is set) - not based on count alone
  const isComplete = pendingRedirect !== null && !currentAIQuestion;
  const canShowFinishButton = false; // Don't show finish button - let GPT determine completion
  
  // Progress percentage: completed purposes / total purposes (0-100%)
  const progressPercentage = isComplete ? 100 : hasStarted ? (completedSteps / totalSteps) * 100 : 0;

  // Helper: Navigate to results page (with optional delay)
  const navigateToResults = useCallback((history: ConversationHistory[], gptResult?: GPTResult, immediate: boolean = false) => {
    let result;
    if (gptResult) {
      // Use GPT-provided competencies as-is, no forced defaults
      const competencies = gptResult.competencies && gptResult.competencies.length > 0
        ? gptResult.competencies
        : [];
      
      // Use GPT-provided result
      // Store all competencies (with pillar info) for filtering by pillar later
      result = {
        id: 'gpt-result',
        title: 'Professional Profile',
        summary: gptResult.summary,
        competencies: competencies.map(c => c.label),
        detailedEvaluation: gptResult.summary,
        matchingPatterns: {
          questionIds: history.map(h => h.questionId),
          keywordPatterns: [],
          competencePatterns: competencies.map(c => c.label),
        },
      };
      // Store GPT result separately for evidence extraction (includes pillar info)
      sessionStorage.setItem('gptResult', JSON.stringify({ ...gptResult, competencies }));
    } else {
      // Fallback to pattern matching
      result = analyzeConversationHistory(history);
    }
    
    // Add a brief lead-in message to chat history for UI (not sent to GPT)
    const leadInMessage: Message = {
      questionId: 'final-leadin',
      question: ' ',
      answerId: 'final-leadin',
      answer: "Thanks. I'll summarize what I heard and show your reflection.",
    };
    setMessages(prev => [...prev, leadInMessage]);

    sessionStorage.setItem('conversationHistory', JSON.stringify(history));
    sessionStorage.setItem('conversationResult', JSON.stringify(result));
    router.push('/competence-tree');
  }, [router]);

  // Call compiler API to convert raw conversation to clean narrative
  const callCompiler = async (
    historySnapshot: ConversationHistory[]
  ): Promise<{ type: 'compiled'; narrative: string } | null> => {
    try {
      const requestBody: any = {
        conversationHistory: historySnapshot.map(h => ({
          question: h.question,
          answer: h.answer,
        })),
        questionCount: getAiAnsweredCount(historySnapshot),
        isFinalTurn: false,
        isCompiler: true,
      };

      // Include custom compiler prompt if it exists
      if (customCompilerPrompt !== null) {
        requestBody.customCompilerPrompt = customCompilerPrompt;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`Compiler API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Capture debug information for compiler
      if (data.debug) {
        const debugEntry: GPTDebugEntry = {
          id: `compiler-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          type: 'compiler',
          request: data.debug.request || {
            messages: [],
            model: 'gpt-4o-mini',
            temperature: 0.7,
            max_tokens: 1000,
          },
          response: {
            type: 'compiled',
            content: data.narrative || '',
            raw: data.debug.rawResponse,
          },
        };
        setGptDebugEntries(prev => [...prev, debugEntry]);
      }
      
      if (data.type === 'compiled' && data.narrative) {
        return { type: 'compiled', narrative: data.narrative };
      } else {
        console.error('[callCompiler] Unexpected response format:', data);
        return null;
      }
    } catch (error) {
      console.error('[callCompiler] Error calling compiler:', error);
      return null;
    }
  };

  // Call GPT API for next question or final synthesis
  const callGPT = async (
    isFinal: boolean,
    historySnapshot: ConversationHistory[],
    isClarification: boolean = false,
    compiledNarrative?: string
  ): Promise<{ type: 'question' | 'final'; question?: string; result?: GPTResult }> => {
    try {
      // Always include custom prompts if they exist (even if empty string, pass them)
      const requestBody: any = {
        conversationHistory: historySnapshot.map(h => ({
          question: h.question,
          answer: h.answer,
        })),
        questionCount: getAiAnsweredCount(historySnapshot), // Count only main questions (excludes clarifications)
        isFinalTurn: isFinal,
        isClarification: isClarification,
      };

      // Include compiled narrative if provided
      if (compiledNarrative) {
        requestBody.compiledNarrative = compiledNarrative;
      }

      // Include custom prompts if they exist
      if (customQuestionPrompt !== null) {
        requestBody.customQuestionPrompt = customQuestionPrompt;
      }
      if (customFinalPrompt !== null) {
        requestBody.customFinalPrompt = customFinalPrompt;
      }
      
      // Log custom prompts usage (useful for debugging)
      if (customQuestionPrompt !== null || customFinalPrompt !== null) {
        console.log('[callGPT] Sending request with custom prompts:', {
          isFinal,
          hasCustomQuestionPrompt: customQuestionPrompt !== null,
          hasCustomFinalPrompt: customFinalPrompt !== null,
          customQuestionPromptLength: customQuestionPrompt?.length || 0,
          customFinalPromptLength: customFinalPrompt?.length || 0,
        });
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Capture debug information if available
      // Always capture debug information (not just in debug mode)
      if (data.debug) {
        const debugEntry: GPTDebugEntry = {
          id: `gpt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          type: isFinal ? 'final' : 'question',
          request: data.debug.request,
          response: {
            type: data.type === 'final' ? 'final' : 'question',
            content: data.type === 'final' 
              ? { summary: data.summary, competencies: data.competencies }
              : data.question,
            raw: data.debug.rawResponse,
          },
          isClarification: isClarification,
        };
        setGptDebugEntries(prev => [...prev, debugEntry]);
      }

      // Fallback: if API mislabels but returns JSON-like final content, coerce to final
      const maybeFinal =
        data &&
        data.question &&
        typeof data.question === 'string' &&
        data.question.includes('"summary"') &&
        data.question.includes('"competencies"');

      if (data.type === 'final') {
        return {
          type: 'final',
          result: {
            summary: data.summary,
            competencies: data.competencies,
          },
        };
      } else if (maybeFinal) {
        // Attempt to parse the JSON-like string
        try {
          const parsed = JSON.parse(data.question);
          return {
            type: 'final',
            result: {
              summary: parsed.summary || '',
              competencies: parsed.competencies || [],
            },
          };
        } catch {
          return {
            type: 'final',
            result: {
              summary: data.question,
              competencies: [],
            },
          };
        }
      } else {
        return {
          type: 'question',
          question: data.question,
        };
      }
    } catch (error) {
      // Error handled by caller
      throw error;
    }
  };

  // Start conversation handler
  const handleStartConversation = () => {
    setHasStarted(true);
    
    // Add initial greeting message
    const greetingMessage: Message = {
      questionId: 'greeting',
      question: "Hi! I'm Ary.",
      answerId: '',
      answer: '',
    };
    setMessages([greetingMessage]);
    
    // Load first AI question after a brief delay
    setTimeout(() => {
      loadNextAIQuestion([], false);
    }, 500);
  };

  // Handle prompt save
  const handleSavePrompts = (questionPrompt: string, finalPrompt: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('customQuestionPrompt', questionPrompt);
      sessionStorage.setItem('customFinalPrompt', finalPrompt);
      setCustomQuestionPrompt(questionPrompt);
      setCustomFinalPrompt(finalPrompt);
      console.log('[Prompt Edit] Saved custom prompts:', {
        questionPromptLength: questionPrompt.length,
        finalPromptLength: finalPrompt.length,
      });
    }
  };

  // Handle prompt reset
  const handleResetPrompts = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('customQuestionPrompt');
      sessionStorage.removeItem('customFinalPrompt');
      setCustomQuestionPrompt(null);
      setCustomFinalPrompt(null);
    }
  };

  // Debug: Skip to completion (for testing only)
  const handleDebugSkipToCompletion = async () => {
    setHasStarted(true);
    // Create mock conversation history
    const mockHistory: ConversationHistory[] = [
      { questionId: 'ai-q1', question: 'Debug: Question 1', answerId: 'ai-a1', answer: 'Debug answer 1', keywords: [], competencies: [] },
      { questionId: 'ai-q2', question: 'Debug: Question 2', answerId: 'ai-a2', answer: 'Debug answer 2', keywords: [], competencies: [] },
      { questionId: 'ai-q3', question: 'Debug: Question 3', answerId: 'ai-a3', answer: 'Debug answer 3', keywords: [], competencies: [] },
      { questionId: 'ai-q4', question: 'Debug: Question 4', answerId: 'ai-a4', answer: 'Debug answer 4', keywords: [], competencies: [] },
      { questionId: 'ai-q5', question: 'Debug: Question 5', answerId: 'ai-a5', answer: 'Debug answer 5', keywords: [], competencies: [] },
      { questionId: 'ai-q6', question: 'Debug: Question 6', answerId: 'ai-a6', answer: 'Debug answer 6', keywords: [], competencies: [] },
      { questionId: 'ai-q7', question: 'Debug: Question 7', answerId: 'ai-a7', answer: 'Debug answer 7', keywords: [], competencies: [] },
    ];
    setConversationHistory(mockHistory);
    setMessages(mockHistory.map((h, idx) => ({
      questionId: h.questionId,
      question: h.question,
      answerId: h.answerId,
      answer: h.answer,
    })));
    
    // Create mock GPT result
    const mockResult: GPTResult = {
      summary: 'You worked on a collaborative project where you coordinated with team members, communicated effectively with stakeholders, and delivered results that had a positive impact on the organization.',
      competencies: [
        { label: 'Collaboration', evidence: 'You coordinated with team members on the project.' },
        { label: 'Communication', evidence: 'You communicated effectively with stakeholders.' },
        { label: 'Teamwork', evidence: 'You worked together with others to achieve goals.' },
        { label: 'Stakeholder Management', evidence: 'You managed relationships with stakeholders effectively.' },
      ],
    };
    
    setPendingRedirect({ history: mockHistory, result: mockResult });
    setIsLoadingAI(false);
    setCurrentAIQuestion(null);
  };

  // Load next AI question (or clarification probe)
  // GPT will return END_INTERVIEW when all 6 questions (Q1-Q6) are complete, then trigger final synthesis
  // Helper: Force completion by calling final synthesis (safety mechanism)
  // Two-step process: 1) Compile raw transcript to clean narrative, 2) Extract competencies from compiled narrative
  const forceCompletion = async (history: ConversationHistory[]) => {
    try {
      // Step 1: Call compiler to convert raw conversation to clean narrative
      console.log('[forceCompletion] Step 1: Calling compiler to convert raw transcript to clean narrative');
      setLoadingStep('compiler');
      const compilerResult = await callCompiler(history);
      
      let compiledNarrative: string | undefined;
      
      if (compilerResult && compilerResult.type === 'compiled' && compilerResult.narrative) {
        compiledNarrative = compilerResult.narrative;
        console.log('[forceCompletion] Compiler successful, compiled narrative length:', compiledNarrative.length);
      } else {
        // Compiler failed - fall back to direct final extraction (backward compatibility)
        console.warn('[forceCompletion] Compiler failed, falling back to direct final extraction');
      }
      
      // Step 2: Call final extraction with compiled narrative (or raw history if compiler failed)
      console.log('[forceCompletion] Step 2: Calling final extraction with', compiledNarrative ? 'compiled narrative' : 'raw conversation history');
      setLoadingStep('final');
      const finalResponse = await callGPT(true, history, false, compiledNarrative);
      
      if (finalResponse.type === 'final' && finalResponse.result) {
        setCompletionAttempts(0);
        setRepeatedQuestionCount(0);
        setLastQuestion(null);
        setCurrentAIQuestion(null);
        setIsAIQuestion(false);
        setPendingRedirect({ history, result: finalResponse.result });
        setIsLoadingAI(false);
        setLoadingStep(null);
        return true;
      }
    } catch (error) {
      console.error('[forceCompletion] Error in completion process:', error);
      // Try fallback: direct extraction without compiler
      try {
        console.log('[forceCompletion] Attempting fallback: direct extraction without compiler');
        setLoadingStep('final');
        const fallbackResponse = await callGPT(true, history, false);
        if (fallbackResponse.type === 'final' && fallbackResponse.result) {
          setCompletionAttempts(0);
          setRepeatedQuestionCount(0);
          setLastQuestion(null);
          setCurrentAIQuestion(null);
          setIsAIQuestion(false);
          setPendingRedirect({ history, result: fallbackResponse.result });
          setIsLoadingAI(false);
          setLoadingStep(null);
          return true;
        }
      } catch (fallbackError) {
        console.error('[forceCompletion] Fallback also failed:', fallbackError);
        setLoadingStep(null);
      }
    }
    setLoadingStep(null);
    return false;
  };

  // Helper: Detect user frustration/negative sentiment
  const detectFrustration = (answer: string): boolean => {
    const lowerAnswer = answer.toLowerCase().trim();
    const frustrationKeywords = [
      'go away', 'stop', 'enough', 'kidding', 'seriously', 'annoying',
      'frustrated', 'done', 'no more', "don't like", 'hate this',
      'boring', 'stupid', 'ridiculous', 'sick of', 'tired of'
    ];
    return frustrationKeywords.some(keyword => lowerAnswer.includes(keyword));
  };

  const loadNextAIQuestion = async (history: ConversationHistory[], isClarification: boolean = false) => {
    const answeredAI = getAiAnsweredCount(history);
    
    setIsLoadingAI(true);
    setLoadingStep('question');
    try {
      setAiQuestionCount(answeredAI);
      
      // If 7 questions (Q0-Q6) are completed, GPT should have returned END_INTERVIEW
      // Force completion as safety mechanism if GPT doesn't return END_INTERVIEW
      if (answeredAI >= 7) {
        console.log('[ConversationFlow] loadNextAIQuestion: 7 questions completed, forcing final synthesis');
        const completed = await forceCompletion(history);
        if (completed) {
          console.log('[ConversationFlow] loadNextAIQuestion: Final synthesis completed successfully');
          return; // Success
        } else {
          // Retry once
          console.error('[ConversationFlow] loadNextAIQuestion: Completion failed, retrying...');
          const retryCompleted = await forceCompletion(history);
          if (retryCompleted) {
            console.log('[ConversationFlow] loadNextAIQuestion: Retry successful');
            return;
          } else {
            console.error('[ConversationFlow] loadNextAIQuestion: Both attempts failed. Stopping.');
            setIsLoadingAI(false);
            setLoadingStep(null);
            return; // CRITICAL: Don't continue to ask more questions
          }
        }
      }
      
      // Let GPT decide when to return END_INTERVIEW (after Q1-Q6 are complete, which is 7 questions total including Q0)
      const isFinal = false;
      const response = await callGPT(isFinal, history, isClarification);

        if (response.type === 'final' && response.result) {
          // GPT returned END_INTERVIEW, final synthesis complete - TRANSITION TO MODAL STATE
        setCompletionAttempts(0);
        setRepeatedQuestionCount(0);
        setLastQuestion(null);
        setCurrentAIQuestion(null); // Clear question → exit CHATTING state
        setIsAIQuestion(false);
        setPendingRedirect({ history, result: response.result }); // Set redirect → enter MODAL state
        setIsLoadingAI(false);
        setLoadingStep(null);
        return; // Conversation complete
      } 
      
      if (response.type === 'question' && response.question) {
        // CRITICAL: Detect repeated questions (same question asked 3+ times)
        const questionText = response.question.toLowerCase().trim();
        if (lastQuestion && questionText === lastQuestion.toLowerCase().trim()) {
          const repeatCount = repeatedQuestionCount + 1;
          setRepeatedQuestionCount(repeatCount);
          
          // If same question asked 3+ times, force completion immediately
          if (repeatCount >= 3) {
            const completed = await forceCompletion(history);
            if (completed) return;
            // If force completion failed, still set the question but user can skip
          }
        } else {
          // Different question - reset repeat counter and update last question
          setRepeatedQuestionCount(0);
          setLastQuestion(response.question);
        }
        
        setCurrentAIQuestion(response.question); // Set question → stay in CHATTING state
        setIsLoadingAI(false);
        return;
      }
      
      // Unexpected response - log and try to continue
      console.warn('Unexpected GPT response:', response);
      setIsLoadingAI(false);
      setLoadingStep(null);
    } catch (error) {
      console.error('Error loading next question:', error);
      setIsLoadingAI(false);
      setLoadingStep(null);
      // On error, if we have 7+ questions, assume completion and try to finish
      if (answeredAI >= 7) {
        try {
          setLoadingStep('final');
          const finalResponse = await callGPT(true, history, false);
          if (finalResponse.type === 'final' && finalResponse.result) {
            setCurrentAIQuestion(null);
            setIsAIQuestion(false);
            setPendingRedirect({ history, result: finalResponse.result });
            setIsLoadingAI(false);
            setLoadingStep(null);
          }
        } catch (finalError) {
          // If final synthesis fails, redirect anyway
          setIsLoadingAI(false);
          setLoadingStep(null);
          setTimeout(() => navigateToResults(history), 1500);
        }
      }
    }
  };

  // Handle text answer submission for AI questions
  const handleTextAnswerSubmit = async () => {
    if (!textAnswer.trim() || !currentAIQuestion || isLoadingAI) return;

    const answerText = textAnswer.trim();
    
    // CRITICAL: Detect user frustration and force completion immediately
    if (detectFrustration(answerText)) {
      const historyEntry: ConversationHistory = {
        questionId: `ai-q${mainQuestionCount + 1}`,
        question: currentAIQuestion,
        answerId: `ai-a${mainQuestionCount + 1}`,
        answer: answerText,
        keywords: [],
        competencies: [],
      };
      const updatedHistory = [...conversationHistory, historyEntry];
      setConversationHistory(updatedHistory);
      
      const newMessage: Message = {
        questionId: `ai-q${mainQuestionCount + 1}`,
        question: currentAIQuestion,
        answerId: `ai-a${mainQuestionCount + 1}`,
        answer: answerText,
      };
      setMessages([...messages, newMessage]);
      
      setTextAnswer('');
      setCurrentAIQuestion(null);
      setIsLoadingAI(true);
      
      // Force completion immediately due to user frustration
      await forceCompletion(updatedHistory);
      return;
    }
    
    // Determine if this was a clarification probe by checking if current question contains clarification language
    // Clarifications don't count toward the 7 main questions (Q0-Q6) - they help complete the current question
    const isClarification = currentAIQuestion.toLowerCase().includes('concrete example') || 
                            currentAIQuestion.toLowerCase().includes('concrete') ||
                            currentAIQuestion.toLowerCase().includes('can you share') ||
                            currentAIQuestion.toLowerCase().includes('can you give') ||
                            currentAIQuestion.toLowerCase().includes('what did you actually') ||
                            currentAIQuestion.toLowerCase().includes('what did that look like') ||
                            currentAIQuestion.toLowerCase().includes('help me understand') ||
                            currentAIQuestion.toLowerCase().includes('what was the specific') ||
                            currentAIQuestion.toLowerCase().includes('tell me more about') ||
                            (currentAIQuestion.toLowerCase().includes('what') && currentAIQuestion.toLowerCase().includes('specifically'));

    // Add AI question and answer to messages
    // For main questions, use ai-q{number}, for clarifications use clarify-q{sequential}
    const questionNum = isClarification ? conversationHistory.length + 1 : mainQuestionCount + 1;
    const questionIdPrefix = isClarification ? 'clarify-q' : 'ai-q';
    const answerIdPrefix = isClarification ? 'clarify-a' : 'ai-a';
    
    const newMessage: Message = {
      questionId: `${questionIdPrefix}${questionNum}`,
      question: currentAIQuestion,
      answerId: `${answerIdPrefix}${questionNum}`,
      answer: answerText,
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);

    const historyEntry: ConversationHistory = {
      questionId: `${questionIdPrefix}${questionNum}`,
      question: currentAIQuestion,
      answerId: `${answerIdPrefix}${questionNum}`,
      answer: answerText,
      keywords: [], // Will be extracted by GPT
      competencies: [], // Will be extracted by GPT
    };

    const updatedHistory = [...conversationHistory, historyEntry];
    setConversationHistory(updatedHistory);
    setTextAnswer('');
    setCurrentAIQuestion(null);

    // Check how many main AI answers we have now (exclude clarifications)
    const answeredAI = getAiAnsweredCount(updatedHistory);
    setAiQuestionCount(answeredAI);

    // Reset counters only when a new main answer is submitted (not clarifications)
    if (!isClarification) {
      setCompletionAttempts(0);
      setRepeatedQuestionCount(0); // Reset repeat counter for new question
    }
    
    // CRITICAL: If 7 questions (Q0-Q6) reached, force completion immediately (don't ask more questions)
    const newMainCount = getAiAnsweredCount(updatedHistory);
    if (newMainCount >= 7) {
      console.log('[ConversationFlow] handleTextAnswerSubmit: 7 questions reached, forcing completion');
      setIsLoadingAI(true);
      const completed = await forceCompletion(updatedHistory);
      if (completed) {
        console.log('[ConversationFlow] handleTextAnswerSubmit: Completion successful');
        return; // Success - stop here
      } else {
        // Retry once in case of transient failure
        console.error('[ConversationFlow] handleTextAnswerSubmit: Completion failed, retrying once...');
        const retryCompleted = await forceCompletion(updatedHistory);
        if (retryCompleted) {
          console.log('[ConversationFlow] handleTextAnswerSubmit: Retry successful');
          return; // Retry successful
        } else {
          console.error('[ConversationFlow] handleTextAnswerSubmit: Retry also failed. Stopping to prevent infinite loop.');
          setIsLoadingAI(false);
          setLoadingStep(null);
          return; // CRITICAL: Stop here - don't continue to loadNextAIQuestion
        }
      }
    }

    // Load next question - ONLY if we haven't reached 7 questions
    setTimeout(() => {
      loadNextAIQuestion(updatedHistory, isClarification);
    }, 800);
  };

  const handleFinish = () => {
    if (isAIQuestion && currentAIQuestion) {
      // If there's a pending AI question, submit it first
      handleTextAnswerSubmit();
    } else {
      navigateToResults(conversationHistory);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
      <div className="container mx-auto h-full px-4 sm:px-6 lg:px-8 py-4 max-w-4xl">
        <div className="w-full mx-auto h-full flex flex-col bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200/50 dark:border-neutral-800/50 overflow-hidden relative">
          
        {/* Header */}
          <div className="flex-shrink-0 px-6 py-3.5 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-sm flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-none">
                    Ary
                  </h1>
                  <p className="text-xs text-neutral-600 dark:text-neutral-500 leading-tight mt-1">
                    {!hasStarted ? 'Ready to start' : isComplete ? 'Complete' : `${completedSteps}/${totalSteps} completed`}
                  </p>
              </div>
            </div>
              
              {/* Progress Bar - Only show after conversation starts */}
              {hasStarted && (
                <div className="flex-1 max-w-[180px] ml-auto">
                <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary-600 to-primary-700 rounded-full"
                  />
                </div>
        </div>
              )}

              {/* Finish Button */}
              {canShowFinishButton && !isComplete && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFinish}
                  className="ml-4 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg"
                >
                  Finish
                </motion.button>
              )}
            </div>
          </div>

          {/* Intro Screen - Show before conversation starts */}
          {!hasStarted && (
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-5">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-sm">
                    <MessageCircle className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Welcome to Ary
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    A conversation to surface execution patterns in real situations
                  </p>
                </div>

                <div className="bg-gradient-to-br from-primary-50 to-accent-50/30 dark:from-primary-950/20 dark:to-accent-950/10 rounded-2xl p-5 mb-5 border border-primary-200/50 dark:border-primary-800/50">
                  <div className="flex items-start gap-3 mb-4">
                    <Info className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                        How This Works
                      </h3>
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        Ary will ask 7 questions about a real situation involving work, preparation, or collaboration.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleStartConversation}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-6 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all"
                  aria-label="Start conversation with Ary"
                >
                  <PlayCircle className="w-5 h-5" aria-hidden="true" />
                  <span>Start Conversation</span>
                </motion.button>
              </motion.div>
            </div>
          )}

          {/* Debug Button - Hidden */}
          {false && debugMode && hasStarted && (
            <div className="absolute top-4 right-4 z-50">
              <button
                onClick={handleDebugSkipToCompletion}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg shadow-lg transition-colors"
              >
                🐛 Debug: Skip to Completion
              </button>
            </div>
          )}

          {/* Completion Modal - Show in MODAL state: when final synthesis is ready (MODAL state) */}
          {hasStarted && pendingRedirect && !isLoadingAI && (
            <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-10 h-10 text-white" strokeWidth={3} />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    Conversation Complete!
                  </h2>
                  
                  <div className="bg-gradient-to-br from-primary-50 to-accent-50/30 dark:from-primary-950/20 dark:to-accent-950/10 rounded-2xl p-8 mb-6 border border-primary-200/50 dark:border-primary-800/50 space-y-4 text-left">
                    <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    The conversation phase is finished.
                    </p>
                    
                    <div className="pt-4 border-t border-primary-200/50 dark:border-primary-700/50">
                      <p className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                      What happens next:
                      </p>
                      <ul className="space-y-2 text-neutral-700 dark:text-neutral-300">
                        <li className="flex items-start gap-2">
                          <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                          <span>An articulation is generated from the conversation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                          <span>The result is presented as a clear, structured projection</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary-600 dark:text-primary-400 mt-1">•</span>
                          <span>No additional input is required</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => {
                      if (pendingRedirect) {
                        navigateToResults(pendingRedirect.history, pendingRedirect.result, true);
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 transition-all"
                    aria-label="View your competence tree and conversation results"
                  >
                    <ArrowRight className="w-5 h-5" aria-hidden="true" />
                    <span>View My Results</span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Messages Container - Show only after conversation starts */}
          {hasStarted && (
            <div 
              className="flex-1 overflow-y-auto overflow-x-hidden px-6 py-4 space-y-4"
            style={{ 
              willChange: 'scroll-position',
              contain: 'layout style paint'
            }}
        >
            {/* All Messages */}
          {messages.map((msg, index) => (
              <div key={`${msg.questionId}-${index}`} className="space-y-2">
              {/* Question */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MessageCircle className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-md px-4 py-3 inline-block max-w-[85%]">
                      <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed break-words">
                  {msg.question}
                </p>
                    </div>
                  </div>
              </div>

              {/* Answer - Only show if there's an answer */}
              {msg.answer && (
                <div className="flex items-start gap-3 justify-end">
                  <div className="flex-1 min-w-0 flex justify-end">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 rounded-2xl rounded-tr-md px-4 py-3 relative group inline-block max-w-[85%]">
                      <p className="text-white text-[15px] leading-relaxed break-words">
                  {msg.answer}
                </p>
              </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-neutral-600 dark:text-neutral-300 text-xs font-semibold">Y</span>
                  </div>
                </div>
              )}
              </div>
          ))}

            {/* Current AI Question - Show whenever there's a question (CHATTING state) */}
            {currentAIQuestion && !isLoadingAI && !pendingRedirect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <MessageCircle className="w-4 h-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-md px-4 py-3 inline-block max-w-[85%]">
                      <p className="text-neutral-900 dark:text-neutral-100 text-[15px] leading-relaxed break-words">
                        {currentAIQuestion}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Loading States - Show specific message for each step */}
            {hasStarted && isLoadingAI && !pendingRedirect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="flex-shrink-0">
                  <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-tl-md px-4 py-3 inline-block">
                    <p className="text-neutral-500 dark:text-neutral-400 text-[15px]">
                      {loadingStep === 'compiler' 
                        ? 'Compiling narrative...' 
                        : loadingStep === 'final' 
                        ? 'Extracting competencies...' 
                        : 'Thinking...'}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
        </div>
          )}

          {/* Text Input - Show in CHATTING state: when there's a question to answer and we're not showing the modal */}
          {hasStarted && !isLoadingAI && currentAIQuestion && !pendingRedirect && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0 px-6 pt-3 pb-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30"
            >
              <div className="flex gap-3">
                <textarea
                  ref={textInputRef}
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleTextAnswerSubmit();
                    }
                  }}
                  placeholder="Type your answer..."
                  disabled={isLoadingAI}
                  rows={3}
                  aria-label="Type your answer to the question"
                  className="flex-1 px-4 py-3 bg-white dark:bg-neutral-800 border-2 border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:focus:ring-primary-400/20 focus:border-primary-400 dark:focus:border-primary-500 disabled:opacity-50 transition-all placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100 text-[15px] resize-none"
                />
              <motion.button
                  onClick={handleTextAnswerSubmit}
                  disabled={!textAnswer.trim() || isLoadingAI}
                  whileHover={{ scale: textAnswer.trim() && !isLoadingAI ? 1.05 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg font-semibold flex items-center gap-2"
                  aria-label={isLoadingAI ? "Sending answer..." : "Send your answer"}
              >
                  {isLoadingAI ? (
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <>
                      <span>Send</span>
                      <Send className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
              </motion.button>
            </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Prompt Edit Panel - Always Available */}
      <PromptEditPanel
        questionPrompt={customQuestionPrompt || DEFAULT_QUESTION_PROMPT}
        finalPrompt={customFinalPrompt || DEFAULT_FINAL_PROMPT}
        compilerPrompt={customCompilerPrompt || DEFAULT_COMPILER_PROMPT}
        onSave={handleSavePrompts}
        onReset={handleResetPrompts}
      />

      {/* GPT Debug Panel - Always Available */}
      <GPTDebugPanel
        entries={gptDebugEntries}
        onClear={() => setGptDebugEntries([])}
      />
    </div>
  );
}
