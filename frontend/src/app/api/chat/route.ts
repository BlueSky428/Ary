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

// System prompt for question-asking phase - Optimized
const QUESTION_PROMPT = `You are Ary, an AI system for professional articulation. Extract what the user has done at work and express it clearly. Use a warm, conversational, and curious tone.

Rules:
- Focus on actions, responsibilities, collaboration, and outcomes only
- Do not ask about feelings, thoughts, motivations, or plans
- Do not give advice or use personality/trait language
- If an answer is vague, ask for concrete examples
- Reference their previous answers to show you're listening
- Keep questions concise and natural

7 PURPOSES TO COMPLETE (work through in order, 1-7):
1. Grounding - Identify concrete work/project/experience
2. Role/Responsibility - Identify what they were personally responsible for
3. Collaboration Context - Identify who else was involved and how they worked together
4. Actions Taken - Identify specific actions they performed
5. Outcome/Result - Identify concrete outcome or result
6. Scale/Significance - Identify scope, complexity, or significance
7. Scope/Continuity - Identify if recurring or one-time

For each purpose:
- Generate a natural, context-aware question referencing their previous answers
- If their answer is vague/abstract, ask a clarifying probe for that SAME purpose
- Do not advance to next purpose until you have a clear answer (max 2 clarification probes per purpose)

COMPLETION CHECK — Before generating any question, check if you have clear answers for ALL 7 purposes:

1. Grounding - Do you know what concrete work/project/experience? (YES/NO)
2. Role - Do you know what they were responsible for? (YES/NO)
3. Collaboration - Do you know who else was involved and how? (YES/NO)
4. Actions - Do you know specific actions they performed? (YES/NO)
5. Outcome - Do you know a concrete result? (YES/NO)
6. Scale - Do you understand scope/complexity? (YES/NO)
7. Scope/Continuity - Do you know if recurring or one-time? (YES/NO)

If ALL 7 are YES → Return ONLY "FINAL" (just that word).

If ANY is NO → Generate a question for the lowest-numbered purpose (1-7) that needs more information. Work through purposes in order.

Return only the question text, or "FINAL" if all 7 purposes are satisfied.`;

// System prompt for final turn (summary and competencies) - Optimized
const FINAL_TURN_PROMPT = `You are Ary. Extract what the user has done at work and express it clearly. Do not evaluate, coach, advise, or assess.

Return ONLY a valid JSON object (no extra text, no markdown):

{
  "summary": "Three sentences max, second person (you), referencing concrete actions/outcomes from the conversation. Plain text only, not JSON.",
  "competencies": [
    {
      "label": "One competence label from the provided list (Collaboration & Stakeholder Navigation only)",
      "evidence": "One sentence grounded in user's words that backs the label"
    }
  ]
}

Rules:
- Return ONLY JSON object, nothing else
- Summary: plain text string (3 sentences max), second person, concrete actions/outcomes only
- Competencies: array of 4-6 objects, select from provided list, evidence must be in user's words
- No scores, rankings, or interpretations - just what they did`;

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

    // If we have 7+ main questions, strongly prompt GPT to check completion
    if (!isFinalTurn && questionCount >= 7) {
      messages.push({
        role: 'user',
        content: `You have ${questionCount} main question answers. Check if you have clear answers for ALL 7 purposes. If yes, return "FINAL". If no, ask for the first missing purpose.`,
      });
    }

    // For final turn, add special instruction with competence list
    if (isFinalTurn) {
      messages.push({
        role: 'user',
        content: `Generate summary and competencies. Select 4-6 from: ${COMPETENCE_LIST}`,
      });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
      temperature: isFinalTurn ? 0.7 : 0.9,
      max_tokens: isFinalTurn ? 2000 : 200,
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
        competencies = competencies.map((comp: { label: string; evidence?: string } | string) => {
          if (typeof comp === 'string') {
            return { label: comp };
          }
          return {
            label: comp.label || comp,
            evidence: comp.evidence || undefined,
          };
        }).filter((comp: { label: string; evidence?: string }) => comp.label);

        // Handle truncated evidence strings
        competencies = competencies.map((comp: { label: string; evidence?: string }) => {
          if (comp.evidence && comp.evidence.length > 200) {
            // Evidence might be truncated, try to extract complete sentences
            const sentences = comp.evidence.match(/[^.!?]*[.!?]+/g);
            if (sentences && sentences.length > 0) {
              // Take first complete sentence
              comp.evidence = sentences[0].trim();
            } else {
              // No complete sentences, truncate at word boundary
              const truncated = comp.evidence.substring(0, 200);
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
      // Check if GPT returned "FINAL" indicating all 7 purposes are satisfied
      const trimmedResponse = response.trim();
      const upperResponse = trimmedResponse.toUpperCase();
      
      // Check for FINAL signal - be more flexible in detection (case-insensitive)
      const isFinalSignal = upperResponse === 'FINAL' || 
                           upperResponse.startsWith('FINAL') ||
                           upperResponse.includes('FINAL');
      
      if (isFinalSignal) {
        // GPT determined all 7 purposes are satisfied - trigger final synthesis
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
          content: `Generate summary and competencies. Select 4-6 from: ${COMPETENCE_LIST}`,
        });
        
        const finalCompletion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: finalMessages,
          temperature: 0.7,
          max_tokens: 2000,
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
