import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ConversationEntry {
  question: string;
  answer: string;
}

interface ChatRequest {
  conversationHistory: ConversationEntry[];
  questionCount: number;
  isFinalTurn: boolean;
  isClarification?: boolean;
  isCompiler?: boolean;
  compiledNarrative?: string;
  customQuestionPrompt?: string;
  customFinalPrompt?: string;
  customCompilerPrompt?: string;
}

/**
 * Fallback: Extract competencies from conversation history when GPT returns empty
 */
function extractCompetenciesFromHistory(history: ConversationEntry[]): Array<{ label: string; evidence?: string }> {
  const allText = history.map(h => `${h.question} ${h.answer}`).join(' ').toLowerCase();
  const competencies: Array<{ label: string; evidence?: string }> = [];

  // Competence detection patterns - Collaboration & Stakeholder Navigation only
  const patterns = [
    // Collaboration & Stakeholder Navigation
    { keywords: ['team', 'collaborate', 'work together', 'together'], label: 'Teamwork', pillar: 'collaboration' },
    { keywords: ['help', 'support', 'assist', 'others'], label: 'Helpfulness', pillar: 'collaboration' },
    { keywords: ['communicate', 'listen', 'understand others'], label: 'Communication', pillar: 'collaboration' },
    { keywords: ['stakeholder', 'navigate stakeholders', 'stakeholder management'], label: 'Stakeholder Navigation', pillar: 'collaboration' },
    { keywords: ['collaboration', 'collaborate', 'collaborative'], label: 'Collaboration', pillar: 'collaboration' },
    { keywords: ['interpersonal', 'people skills', 'work with people'], label: 'Interpersonal Skills', pillar: 'collaboration' },
    { keywords: ['empathy', 'empathetic', 'understanding others'], label: 'Empathy', pillar: 'collaboration' },
    { keywords: ['leadership', 'lead', 'leading'], label: 'Leadership', pillar: 'collaboration' },
    { keywords: ['coordination', 'coordinate', 'coordinating'], label: 'Coordination', pillar: 'collaboration' },
    { keywords: ['relationship', 'relationships', 'building relationships'], label: 'Relationship Building', pillar: 'collaboration' },
    { keywords: ['networking', 'network', 'connection'], label: 'Networking', pillar: 'collaboration' },
  ];

  patterns.forEach(({ keywords, label }) => {
    if (keywords.some(keyword => allText.includes(keyword))) {
      // Try to find a sentence that contains the keyword as evidence
      const sentences = history.flatMap(h => h.answer.split(/[.!?]+/));
      const evidenceSentence = sentences.find(s => 
        keywords.some(k => s.toLowerCase().includes(k))
      );
      
      if (evidenceSentence) {
      competencies.push({
          label,
          evidence: evidenceSentence.trim().substring(0, 100), // Limit length
      });
      } else {
        competencies.push({ label });
    }
  }
  });

  // If no competencies found, add a default
  if (competencies.length === 0) {
    competencies.push({
      label: 'Collaboration',
      evidence: 'You engaged thoughtfully in the conversation about your professional approach.',
    });
  }

  return competencies;
}

// Competence labels for Collaboration & Stakeholder Navigation pillar only
const COMPETENCE_OPTIONS = {
  collaboration: ['Collaboration', 'Teamwork', 'Interpersonal Skills', 'Empathy', 'Communication', 'Active Listening', 'Helpfulness', 'Support', 'Leadership', 'Coordination', 'Client Focus', 'Relationship Building', 'Networking', 'Stakeholder Management', 'Stakeholder Engagement'],
};

const COMPETENCE_LIST = COMPETENCE_OPTIONS.collaboration.join(', ');

// System prompt for question-asking phase - Fixed Question Spine
const QUESTION_PROMPT = `ROLE
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

// System prompt for compilation phase - Articulation Pre-Processor
const COMPILER_PROMPT = `You are Ary's articulation compiler. Your task is to transform raw conversation transcripts into clean, neutral, domain-agnostic narratives.

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

// System prompt for final turn (summary and competencies) - Professional articulation
const FINAL_TURN_PROMPT = `You are Ary, an AI system for professional articulation. Your task is to synthesize the user's experience into sophisticated professional competencies and a high-level summary that reveals strategic methodology and thinking.

CRITICAL: Generate competencies for ALL 5 PILLARS, with EXACTLY 4-5 competencies per pillar. Organize competencies by pillar. Each competency must be assigned to the appropriate pillar based on the demonstrated skill/approach revealed in the conversation.

The 5 pillars are:
1. "collaboration" - Collaboration & Stakeholder Navigation (collaboration, teamwork, stakeholder management, interpersonal skills, communication, support, coordination, relationship building, navigating people dynamics)
2. "execution" - Execution & Ownership (execution, ownership, delivery, results, implementation, accountability, follow-through, responsibility)
3. "thinking" - Decision Framing & Judgment (decision-making, judgment, framing, thinking, analysis, strategic thinking, problem-solving, reasoning)
4. "growth" - Learning & Adaptation (learning, adaptation, growth, development, continuous improvement, skill development, adaptability, resilience)
5. "purpose" - Initiative & Impact Orientation (initiative, impact, purpose, orientation, proactivity, driving change, goal-setting, vision)

Return ONLY a valid JSON object (no extra text, no markdown):

{
  "summary": "A professional summary written in impersonal, analytical language. The summary must describe an operating model, not a person. Articulate how capability is constructed, including how information is framed, translated, structured, sequenced, monitored, and validated. Focus on methodology and control logic, not actions, traits, or outcomes. Use structural language such as framed, translated, structured, sequenced, gated, validated, signals. Write exactly 3–5 sentences. Do not use second-person or first-person language. Do not mention success, results, or outcomes.",
  "competencies": [
    {
      "pillar": "collaboration",
      "label": "A structural, abstract competency label describing a single operating mechanism. The label must represent one method or control function only (e.g. engagement, coordination, translation, validation, monitoring). Labels must describe HOW capability operates, not skills, behaviors, or traits. Each label must be distinct and non-overlapping. Avoid generic skills (e.g. communication, leadership, teamwork). Use method-level phrasing (e.g. Checkpoint-Driven Coordination, Adaptive Stakeholder Engagement).",
      "evidence": "Evidence must describe observable structure or process, written impersonally. Describe what was set up, enforced, sequenced, repeated, or gated. Evidence must explain HOW the mechanism operated, not WHY it was good. No evaluation, no praise, no traits, no outcomes. Use 1–3 sentences only. Evidence may reference interaction or process but must not reference individuals directly."
    }
  ]
}

Rules:
- Return ONLY JSON object, nothing else
- Summary: Impersonal, analytical, structural language only. Describe an operating model, not a person. No second-person or first-person language. No reflection, traits, praise, or outcomes
- Competencies: Generate EXACTLY 4–5 competencies per pillar
* Each competency must isolate ONE dominant mechanism only
* Do not merge multiple mechanisms into one competency
* If mechanisms appear related, split them
* Each pillar must include multiple different mechanism types, such as:
    * engagement
    * coordination
    * structuring
    * translation
    * repetition
    * validation
    * monitoring
- Evidence: For each competency, provide 1-3 sentences describing observable structure, sequencing, or verification logic. No evaluative language. No second-person or first-person language. No domain, role, or individual references
- Language: Use sophisticated, analytical professional language. No (You). No evaluative language. Reveal methodology, strategic thinking, and operational principles. Use terms like 'framed', 'translated', 'structured', 'enforced', 'validated', 'converted', 'signal', 'asymmetry', 'boundary setting', 'readiness validation'.`;

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { conversationHistory, questionCount, isFinalTurn, isClarification, isCompiler, compiledNarrative, customQuestionPrompt, customFinalPrompt, customCompilerPrompt } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // COMPILER MODE: Transform raw conversation transcript to clean narrative
    if (isCompiler) {
      console.log('[GPT API] Compiler mode: converting raw transcript to clean narrative');
      
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: COMPILER_PROMPT },
      ];

      // Format conversation transcript as input
      const transcript = conversationHistory.map((entry, idx) => {
        return `Question ${idx + 1}\n${entry.question}\nYour Answer\n"${entry.answer}"`;
      }).join('\n\n');

      messages.push({
        role: 'user',
        content: `Convert this conversation transcript into a clean, neutral narrative:\n\n${transcript}`,
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      });

      const rawResponse = completion.choices[0]?.message?.content || '';
      
      try {
        const parsed = JSON.parse(rawResponse);
        const narrative = parsed.narrative || '';
        
        if (!narrative) {
          throw new Error('Compiler returned empty narrative');
        }

        return NextResponse.json({
          type: 'compiled',
          narrative: narrative,
          debug: {
            request: {
              messages: messages,
              model: 'gpt-4o-mini',
              temperature: 0.7,
              max_tokens: 1000,
            },
            rawResponse: rawResponse,
          },
        });
      } catch (parseError) {
        console.error('[GPT API] Compiler JSON parse error:', parseError);
        return NextResponse.json({
          error: 'Failed to parse compiler response',
          debug: {
            rawResponse: rawResponse.substring(0, 500),
          },
        }, { status: 500 });
      }
    }

    // CRITICAL: If we have 7+ main questions (Q0-Q6 completed), force final turn
    // Don't ask any more questions - go straight to final synthesis
    let shouldForceFinalTurn = false;
    if (!isFinalTurn && questionCount >= 7) {
      console.log('[GPT API] 7 main questions completed (questionCount=' + questionCount + '), forcing final turn instead of asking more questions');
      shouldForceFinalTurn = true;
    }

    const actuallyFinalTurn = isFinalTurn || shouldForceFinalTurn;

    // Build messages array with appropriate system prompt
    // Use custom prompts if provided (check for undefined, not truthy, to allow empty strings)
    // Use QUESTION_PROMPT for regular questions, FINAL_TURN_PROMPT for final step
    const systemPrompt = actuallyFinalTurn 
      ? (customFinalPrompt !== undefined ? customFinalPrompt : FINAL_TURN_PROMPT)
      : (customQuestionPrompt !== undefined ? customQuestionPrompt : QUESTION_PROMPT);
    
    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[GPT API] Using prompt:', {
        isFinalTurn,
        questionCount,
        shouldForceFinalTurn,
        actuallyFinalTurn,
        customQuestionPromptProvided: customQuestionPrompt !== undefined,
        customFinalPromptProvided: customFinalPrompt !== undefined,
        usingCustomPrompt: actuallyFinalTurn 
          ? (customFinalPrompt !== undefined)
          : (customQuestionPrompt !== undefined),
        promptLength: systemPrompt.length,
        promptPreview: systemPrompt.substring(0, 100) + '...',
      });
    }
    
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    // For final turn, use compiled narrative if provided, otherwise use conversation history
    if (actuallyFinalTurn) {
      if (compiledNarrative) {
        // Use compiled narrative (from compiler step) - send as single user message
        console.log('[GPT API] Final turn: Using compiled narrative for extraction');
        messages.push({
          role: 'user',
          content: `Extract competencies and generate a summary from this articulation narrative:\n\n${compiledNarrative}\n\nGenerate a professional summary and competencies for ALL 5 PILLARS. Create EXACTLY 4-5 competencies per pillar (20-25 total). Each competency must include a "pillar" field ("collaboration", "execution", "thinking", "growth", or "purpose"). Organize competencies by pillar based on the demonstrated skills/approaches. Focus on HOW they operate (framing, translation, structuring, validation) rather than just WHAT they did. Provide analytical, high-level language that reveals their operational principles.`,
        });
      } else {
        // Fallback: Use conversation history (backward compatibility)
        console.log('[GPT API] Final turn: Using raw conversation history (no compiled narrative provided)');
        conversationHistory.forEach((entry) => {
          if (entry.question) {
            messages.push({ role: 'assistant', content: entry.question });
          }
          if (entry.answer) {
            messages.push({ role: 'user', content: entry.answer });
          }
        });
        
        messages.push({
          role: 'user',
          content: `Generate a professional summary and competencies for ALL 5 PILLARS. Create EXACTLY 4-5 competencies per pillar (20-25 total). Each competency must include a "pillar" field ("collaboration", "execution", "thinking", "growth", or "purpose"). Organize competencies by pillar based on the demonstrated skills/approaches. Focus on HOW they operate (framing, translation, structuring, validation) rather than just WHAT they did. Provide analytical, high-level language that reveals their operational principles.`,
        });
      }
    } else {
      // Regular question-asking mode: Add conversation history as pairs
      conversationHistory.forEach((entry) => {
        if (entry.question) {
          messages.push({ role: 'assistant', content: entry.question });
        }
        if (entry.answer) {
          messages.push({ role: 'user', content: entry.answer });
        }
      });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: actuallyFinalTurn ? 0.8 : 0.9, // Slightly higher temp for more creative professional language
      max_tokens: actuallyFinalTurn ? 3000 : 200, // Increased max tokens for detailed professional summaries and evidence
      response_format: actuallyFinalTurn ? { type: 'json_object' } : undefined,
    });

    const rawResponse = completion.choices[0]?.message?.content || '';
    const response = rawResponse;

    if (actuallyFinalTurn) {
      // Parse JSON response
      try {
        let parsed = JSON.parse(response);

        // Handle nested JSON strings (double-encoded)
        if (typeof parsed.summary === 'string' && parsed.summary.includes('"summary"')) {
            try {
            const innerParsed = JSON.parse(parsed.summary);
            parsed = innerParsed;
          } catch (parseError) {
            // JSON might be truncated or malformed, try to extract what we can using regex
            // Extract summary text using regex (handles escaped quotes and newlines)
            // Look for the innermost summary field (nested JSON contains the actual summary)
            // This regex needs to handle multi-line strings and escaped characters
            const summaryRegex = /"summary"\s*:\s*"((?:[^"\\]|\\.|\\n)*?)"(?:\s*[,}])/gs;
            let summaryMatches: RegExpMatchArray[] = [];
            let match;
            
            while ((match = summaryRegex.exec(parsed.summary)) !== null) {
              summaryMatches.push(match);
            }
            
            // Use the last (innermost) summary if multiple found
            if (summaryMatches.length > 0) {
              const lastMatch = summaryMatches[summaryMatches.length - 1];
              parsed.summary = lastMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"');
              }
              
            // Extract competencies array using regex
            const compArrayRegex = /"competencies"\s*:\s*\[(.*?)\](?:\s*[,}])/s;
            const compArrayMatch = compArrayRegex.exec(parsed.summary);
            if (compArrayMatch) {
              const compArrayStr = compArrayMatch[1];
              // Extract individual competence objects
              const compObjRegex = /\{\s*"label"\s*:\s*"([^"]+)"\s*(?:,\s*"evidence"\s*:\s*"([^"]*)")?\s*\}/g;
                  const extractedComps: Array<{ label: string; evidence?: string }> = [];
              let compMatch;
                  
              while ((compMatch = compObjRegex.exec(compArrayStr)) !== null) {
                    extractedComps.push({
                  label: compMatch[1],
                  evidence: compMatch[2] || undefined,
                    });
                  }
                  
                  if (extractedComps.length > 0) {
                parsed.competencies = extractedComps;
                  }
                }
              }
            }

        let summaryText = parsed.summary || '';
        let competencies = parsed.competencies || [];

        // If competencies is a string, try to parse it
        if (typeof competencies === 'string') {
          try {
            competencies = JSON.parse(competencies);
          } catch (e) {
            competencies = [];
          }
        }

        // Ensure competencies is an array
        if (!Array.isArray(competencies)) {
          competencies = [];
        }

        // Clean up competencies - handle both string and object formats
        // Support both old format (label, evidence) and new format (pillar, label, evidence)
        competencies = competencies.map((comp: { label?: string; pillar?: string; evidence?: string } | string) => {
          if (typeof comp === 'string') {
            return { label: comp, pillar: undefined };
          }
          return {
            label: comp.label || '',
            pillar: comp.pillar || undefined,
            evidence: comp.evidence || undefined,
          };
        }).filter((comp: { label: string; pillar?: string; evidence?: string }) => comp.label);

        // Handle very long evidence strings (keep longer evidence but ensure it's reasonable)
        competencies = competencies.map((comp: { label: string; evidence?: string }) => {
          if (comp.evidence && comp.evidence.length > 500) {
            // Only truncate if extremely long (over 500 chars), preserving professional language
            const sentences = comp.evidence.match(/[^.!?]*[.!?]+/g);
            if (sentences && sentences.length > 0) {
              // Take up to 3 complete sentences (professional evidence should be 2-3 sentences)
              const maxSentences = Math.min(3, sentences.length);
              comp.evidence = sentences.slice(0, maxSentences).join(' ').trim();
            } else {
              // No complete sentences, truncate at word boundary but keep more content
              const truncated = comp.evidence.substring(0, 450);
              const lastSpace = truncated.lastIndexOf(' ');
              comp.evidence = lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
            }
          }
          return comp;
        });

        // Fallback: If GPT returns no competencies, extract from conversation history
        if (competencies.length === 0 && conversationHistory.length > 0) {
          competencies = extractCompetenciesFromHistory(conversationHistory);
        }
        
        return NextResponse.json({
          type: 'final',
          summary: summaryText,
          competencies: competencies.map((comp: { label: string; evidence?: string } | string) => ({
            label: typeof comp === 'string' ? comp : comp.label || comp,
            evidence: typeof comp === 'object' && comp.evidence ? comp.evidence : undefined,
          })),
          debug: {
            request: {
              messages: messages,
              model: 'gpt-4o-mini',
              temperature: actuallyFinalTurn ? 0.7 : 0.9,
              max_tokens: actuallyFinalTurn ? 2000 : 200,
            },
            rawResponse: rawResponse,
          },
        });
      } catch (parseError) {
        // Failed to parse response - return error with debug info
        return NextResponse.json({
          error: 'Failed to parse GPT response as JSON',
          debug: {
            request: {
              messages: messages,
              model: 'gpt-4o-mini',
              temperature: actuallyFinalTurn ? 0.7 : 0.9,
              max_tokens: actuallyFinalTurn ? 2000 : 200,
            },
            rawResponse: rawResponse,
          },
        }, { status: 500 });
      }
    } else {
      // Check if GPT returned "END_INTERVIEW" indicating all questions (Q1-Q6) are complete
      const trimmedResponse = response.trim();
      const upperResponse = trimmedResponse.toUpperCase();
      
      // Check for END_INTERVIEW signal - be flexible in detection (case-insensitive)
      const isEndInterview = upperResponse === 'END_INTERVIEW' || 
                            upperResponse.startsWith('END_INTERVIEW') ||
                            upperResponse.includes('END_INTERVIEW');
      
      if (isEndInterview) {
        // All 6 questions (Q1-Q6) are complete - trigger final synthesis
        // Note: This path should not be used with the compiler architecture
        // The compiler should be called before reaching final turn
        // This is kept for backward compatibility
        const finalSystemPrompt = customFinalPrompt !== undefined ? customFinalPrompt : FINAL_TURN_PROMPT;
        const finalMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
          { role: 'system', content: finalSystemPrompt },
        ];
        
        // Use compiled narrative if provided, otherwise use conversation history
        if (compiledNarrative) {
          finalMessages.push({
            role: 'user',
            content: `Extract competencies and generate a summary from this articulation narrative:\n\n${compiledNarrative}\n\nGenerate sophisticated competencies and summary for ALL 5 PILLARS. Create EXACTLY 4-5 competencies per pillar (20-25 total). Each competency must include a "pillar" field ("collaboration", "execution", "thinking", "growth", or "purpose"). Organize competencies by pillar based on the demonstrated skills/approaches. Focus on HOW they operate (framing, translation, structuring, validation) rather than just WHAT they did. Provide analytical, high-level language that reveals their operational principles.`,
          });
        } else {
          // Fallback: Use conversation history
          conversationHistory.forEach((entry) => {
            if (entry.question) {
              finalMessages.push({ role: 'assistant', content: entry.question });
            }
            if (entry.answer) {
              finalMessages.push({ role: 'user', content: entry.answer });
            }
          });
          
          finalMessages.push({
            role: 'user',
            content: `Generate sophisticated competencies and summary for ALL 5 PILLARS. Create EXACTLY 4-5 competencies per pillar (20-25 total). Each competency must include a "pillar" field ("collaboration", "execution", "thinking", "growth", or "purpose"). Organize competencies by pillar based on the demonstrated skills/approaches. Focus on HOW they operate (framing, translation, structuring, validation) rather than just WHAT they did. Provide analytical, high-level language that reveals their operational principles.`,
          });
        }
        
        const finalCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: finalMessages,
          temperature: 0.5, // Match main final turn temperature
          max_tokens: 3000, // Match main final turn max tokens
          response_format: { type: 'json_object' },
        });
        
        const finalResponseRaw = finalCompletion.choices[0]?.message?.content || '';
        let parsed = JSON.parse(finalResponseRaw);
        
        // Handle nested JSON (same logic as above)
        if (typeof parsed.summary === 'string' && parsed.summary.includes('"summary"')) {
          try {
            const innerParsed = JSON.parse(parsed.summary);
            parsed = innerParsed;
          } catch (parseError) {
            // Handle truncation same way as above
            const summaryRegex = /"summary"\s*:\s*"((?:[^"\\]|\\.|\\n)*?)"(?:\s*[,}])/gs;
            let summaryMatches: RegExpMatchArray[] = [];
            let match;
            while ((match = summaryRegex.exec(parsed.summary)) !== null) {
              summaryMatches.push(match);
            }
            if (summaryMatches.length > 0) {
              const lastMatch = summaryMatches[summaryMatches.length - 1];
              parsed.summary = lastMatch[1].replace(/\\n/g, ' ').replace(/\\"/g, '"');
              }
          }
        }
        
        let summaryText = parsed.summary || '';
        let competencies = parsed.competencies || [];
        
        if (typeof competencies === 'string') {
                try {
            competencies = JSON.parse(competencies);
          } catch (e) {
            competencies = [];
          }
        }
        
        if (!Array.isArray(competencies)) {
          competencies = [];
                  }
        
        competencies = competencies.map((comp: { label: string; evidence?: string } | string) => {
          if (typeof comp === 'string') {
            return { label: comp };
          }
          return {
            label: comp.label || comp,
            evidence: comp.evidence || undefined,
          };
        }).filter((comp: { label: string; evidence?: string }) => comp.label);

        // Fallback: If GPT returns no competencies, extract from conversation history
        if (competencies.length === 0 && conversationHistory.length > 0) {
          competencies = extractCompetenciesFromHistory(conversationHistory);
        }

        return NextResponse.json({
          type: 'final',
          summary: summaryText,
          competencies: competencies.map((comp: { label: string; evidence?: string } | string) => ({
            label: typeof comp === 'string' ? comp : comp.label || comp,
            evidence: typeof comp === 'object' && comp.evidence ? comp.evidence : undefined,
          })),
          debug: {
            request: {
              messages: finalMessages,
              model: 'gpt-4o-mini',
              temperature: 0.7,
              max_tokens: 2000,
            },
            rawResponse: finalResponseRaw,
          },
        });
      }
      
      // Return question
      return NextResponse.json({
        type: 'question',
        question: trimmedResponse,
        debug: {
          request: {
            messages: messages,
            model: 'gpt-4o-mini',
            temperature: actuallyFinalTurn ? 0.7 : 0.9,
            max_tokens: actuallyFinalTurn ? 2000 : 200,
          },
          rawResponse: rawResponse,
        },
      });
    }
  } catch (error) {
    // GPT API error - return error response
    
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        {
          error: 'OpenAI API error',
          message: error.message,
          status: error.status,
        },
        { status: error.status || 500 }
      );
    }
    
    // Handle generic errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        error: 'Failed to generate response',
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}
