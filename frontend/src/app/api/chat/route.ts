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
  customQuestionPrompt?: string;
  customFinalPrompt?: string;
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

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { conversationHistory, questionCount, isFinalTurn, isClarification, customQuestionPrompt, customFinalPrompt } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Build messages array with appropriate system prompt
    // Use custom prompts if provided (check for undefined, not truthy, to allow empty strings)
    // Use QUESTION_PROMPT for regular questions, FINAL_TURN_PROMPT for final step
    const systemPrompt = isFinalTurn 
      ? (customFinalPrompt !== undefined ? customFinalPrompt : FINAL_TURN_PROMPT)
      : (customQuestionPrompt !== undefined ? customQuestionPrompt : QUESTION_PROMPT);
    
    // Log for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('[GPT API] Using prompt:', {
        isFinalTurn,
        customQuestionPromptProvided: customQuestionPrompt !== undefined,
        customFinalPromptProvided: customFinalPrompt !== undefined,
        usingCustomPrompt: isFinalTurn 
          ? (customFinalPrompt !== undefined)
          : (customQuestionPrompt !== undefined),
        promptLength: systemPrompt.length,
        promptPreview: systemPrompt.substring(0, 100) + '...',
      });
    }
    
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history as pairs: assistant question, user answer
    conversationHistory.forEach((entry) => {
      if (entry.question) {
        messages.push({ role: 'assistant', content: entry.question });
      }
      if (entry.answer) {
        messages.push({ role: 'user', content: entry.answer });
      }
    });

    // If we have 6+ main questions (Q1-Q6 completed), GPT should return END_INTERVIEW
    // No need to prompt GPT - it knows from the prompt structure when to return END_INTERVIEW

    // For final turn, provide guidance for professional articulation
    if (isFinalTurn) {
      messages.push({
        role: 'user',
        content: `Generate a professional summary and competencies for ALL 5 PILLARS. Create EXACTLY 4-5 competencies per pillar (20-25 total). Each competency must include a "pillar" field ("collaboration", "execution", "thinking", "growth", or "purpose"). Organize competencies by pillar based on the demonstrated skills/approaches. Focus on HOW they operate (framing, translation, structuring, validation) rather than just WHAT they did. Provide analytical, high-level language that reveals their operational principles.`,
      });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: isFinalTurn ? 0.8 : 0.9, // Slightly higher temp for more creative professional language
      max_tokens: isFinalTurn ? 3000 : 200, // Increased max tokens for detailed professional summaries and evidence
      response_format: isFinalTurn ? { type: 'json_object' } : undefined,
    });

    const rawResponse = completion.choices[0]?.message?.content || '';
    const response = rawResponse;

    if (isFinalTurn) {
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
              temperature: isFinalTurn ? 0.7 : 0.9,
              max_tokens: isFinalTurn ? 2000 : 200,
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
              temperature: isFinalTurn ? 0.7 : 0.9,
              max_tokens: isFinalTurn ? 2000 : 200,
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
        // Make a recursive call with isFinalTurn=true to get the final summary
        // Use custom final prompt if provided, otherwise use default
        const finalSystemPrompt = customFinalPrompt !== undefined ? customFinalPrompt : FINAL_TURN_PROMPT;
        const finalMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
          { role: 'system', content: finalSystemPrompt },
        ];
        
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
            temperature: isFinalTurn ? 0.7 : 0.9,
            max_tokens: isFinalTurn ? 2000 : 200,
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
