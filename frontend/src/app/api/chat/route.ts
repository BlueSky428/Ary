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
}

/**
 * Fallback: Extract competencies from conversation history when GPT returns empty
 */
function extractCompetenciesFromHistory(history: ConversationEntry[]): Array<{ label: string; evidence?: string }> {
  const allText = history.map(h => `${h.question} ${h.answer}`).join(' ').toLowerCase();
  const competencies: Array<{ label: string; evidence?: string }> = [];

  // Competence detection patterns
  const patterns = [
    // Execution & Delivery
    { keywords: ['plan', 'organize', 'execute', 'deliver', 'deadline', 'complete', 'finish', 'goal', 'achieve'], label: 'Planning', pillar: 'execution' },
    { keywords: ['structure', 'system', 'process', 'method'], label: 'Organization', pillar: 'execution' },
    { keywords: ['initiative', 'proactive', 'take action', 'start'], label: 'Initiative', pillar: 'execution' },
    
    // Connection & Collaboration
    { keywords: ['team', 'collaborate', 'work together', 'together'], label: 'Teamwork', pillar: 'collaboration' },
    { keywords: ['help', 'support', 'assist', 'others'], label: 'Helpfulness', pillar: 'collaboration' },
    { keywords: ['communicate', 'listen', 'understand others'], label: 'Communication', pillar: 'collaboration' },
    
    // Thinking & Problem-Solving
    { keywords: ['think', 'analyze', 'strategic', 'solve', 'problem'], label: 'Problem-Solving', pillar: 'thinking' },
    { keywords: ['idea', 'creative', 'innovate', 'design'], label: 'Innovation', pillar: 'thinking' },
    
    // Self-Awareness & Growth
    { keywords: ['learn', 'improve', 'grow', 'develop', 'practice'], label: 'Learning', pillar: 'growth' },
    { keywords: ['reflect', 'self-aware', 'understand myself'], label: 'Self-Awareness', pillar: 'growth' },
    { keywords: ['adapt', 'flexible', 'change', 'adjust'], label: 'Adaptability', pillar: 'growth' },
    
    // Purpose & Impact
    { keywords: ['purpose', 'meaning', 'impact', 'contribute', 'mission'], label: 'Purpose-Driven', pillar: 'purpose' },
    { keywords: ['motivate', 'passion', 'drive', 'aspire'], label: 'Motivation', pillar: 'purpose' },
  ];

  // Find matches
  for (const pattern of patterns) {
    if (pattern.keywords.some(kw => allText.includes(kw))) {
      // Find evidence from conversation
      const evidenceEntry = history.find(h => 
        pattern.keywords.some(kw => h.answer.toLowerCase().includes(kw))
      );
      competencies.push({
        label: pattern.label,
        evidence: evidenceEntry ? `You mentioned ${pattern.keywords.find(kw => evidenceEntry.answer.toLowerCase().includes(kw))}...` : undefined,
      });
      // Limit to 4-6 competencies
      if (competencies.length >= 6) break;
    }
  }

  // Ensure at least one competence
  if (competencies.length === 0) {
    competencies.push({
      label: 'Professional Engagement',
      evidence: 'You engaged thoughtfully in the conversation about your professional approach.',
    });
  }

  return competencies;
}

// Competence labels organized by pillar for GPT selection
const COMPETENCE_OPTIONS = {
  execution: ['Planning', 'Organization', 'Goal-Driven', 'Execution', 'Results-Oriented', 'Initiative', 'Structure', 'Deadline Management', 'Systematic Approach', 'Efficiency', 'Productivity', 'Resilience', 'Persistence', 'Commitment'],
  collaboration: ['Collaboration', 'Teamwork', 'Interpersonal Skills', 'Empathy', 'Communication', 'Active Listening', 'Helpfulness', 'Support', 'Leadership', 'Coordination', 'Client Focus', 'Relationship Building', 'Networking'],
  thinking: ['Strategic Thinking', 'Problem-Solving', 'Analytical', 'Critical Thinking', 'Pattern Recognition', 'Innovation', 'Creativity', 'Ideation', 'Design Thinking', 'Logical Reasoning', 'Complex Thinking'],
  growth: ['Self-Awareness', 'Reflection', 'Learning', 'Growth Mindset', 'Openness', 'Curiosity', 'Adaptability', 'Flexibility', 'Continuous Improvement', 'Self-Development', 'Feedback Seeking'],
  purpose: ['Purpose-Driven', 'Values-Driven', 'Impact-Driven', 'Mission', 'Vision', 'Motivation', 'Passion', 'Intrinsic Drive', 'Ambition', 'Contribution', 'Social Impact'],
};

const COMPETENCE_LIST = Object.values(COMPETENCE_OPTIONS).flat().join(', ');

const SYSTEM_PROMPT = `You are Ary, an AI used for professional reflection. Ask short, neutral follow-up questions about work, study, tasks, goals, and professional approach.

Rules:
- Ask a total of five follow-up questions, one at a time.
- Keep each question under 18 words.
- Each question must relate to the user's previous answers and include a tiny contextual hook (1–2 nouns/verbs) from the last answer.
- Vary neutral openers (e.g., "Understood,", "Noted,", "Quick follow-up:", "One thing I'm curious about:") to avoid repetition.
- Avoid emotional or mental-health language; do not ask "How are you?" or anything about feelings or well-being.
- Do not give advice, guidance, or suggestions for improvement.

Conversational Flow:
- Briefly acknowledge then ask; keep it neutral (no praise or judgement).
- Avoid sounding like a questionnaire—make it feel like a natural follow-on.
- Avoid repeating the same topic. Over 5 questions, explore different aspects naturally based on what the user shares: their approach to work, how they handle tasks, their thinking process, their goals, their learning style, etc. Do not force any particular topic.
- If the user's answer is very short (e.g., under 8 words), ask a quick clarifier ("Could you share a quick example?") then proceed.
- Before the fifth and final question, preface with "One last question:".

Final Turn:
When FINAL_TURN is provided, do not ask more questions. Return ONLY a valid JSON object (no extra text, no markdown code blocks). Use this exact structure:
{
  "summary": "Three short sentences written in second person (you), reflecting what the user actually said about their work, study, or professional approach. Base this ONLY on what was explicitly mentioned in the conversation. Do not invent information. Never use 'the user', 'they', 'their', or third-person wording. The summary must be plain text, NOT a JSON string or object.",
  "competencies": [
    {
      "label": "One of the competence labels from the provided list below",
      "evidence": "Optional short evidence phrase (one line max) only if directly reflected in user's wording"
    }
  ]
}

CRITICAL - READ CAREFULLY:
- Return ONLY the JSON object, nothing else
- Do NOT wrap the JSON in markdown code blocks
- Do NOT put the entire object as a string in the summary field
- The summary field must contain plain text only (NOT JSON, NOT a stringified object)
- The competencies field must be a JSON array of objects (NOT a string)
- Do NOT nest the entire response object inside the summary field as a string
- Write the summary as plain readable text, not as JSON code

Available Competence Labels (select 4-6 that are MOST evidenced in the conversation):
${COMPETENCE_LIST}

Important:
- "summary" must be a plain text string (3 sentences), NOT a JSON object or JSON string
- "competencies" must be an array of 4-6 objects
- "label" MUST be one of the competence labels from the list above (use exact spelling)
- Only select competencies that you can point to specific evidence for in the user's actual words
- Evidence should refer to linguistic cues from the conversation, not personality traits
- Select competencies that best represent what the user demonstrated through their answers
- No scores, no percentages, no emotions`;

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { conversationHistory, questionCount, isFinalTurn } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Build messages array
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
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

    // For final turn, add special instruction
    if (isFinalTurn) {
      messages.push({
        role: 'user',
        content: `FINAL_TURN: Generate the final summary and competencies based on the conversation above. Select 4-6 competencies from this list that are most evidenced: ${COMPETENCE_LIST}`,
      });
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Cost-effective model
      messages,
      temperature: isFinalTurn ? 0.7 : 0.8, // Slightly more creative for questions
      max_tokens: isFinalTurn ? 2000 : 100, // Increased significantly to prevent JSON truncation
      response_format: isFinalTurn ? { type: 'json_object' } : undefined,
    });

    const response = completion.choices[0].message.content;

    if (!response) {
      throw new Error('No response from OpenAI');
    }

    if (isFinalTurn) {
      // Parse JSON response
      try {
        const parsed = JSON.parse(response);
        
        // Validate structure
        if (!parsed.summary || !parsed.competencies) {
          throw new Error('Invalid response structure');
        }

        // Handle case where GPT returns entire JSON as a string in summary field
        let summaryText = parsed.summary;
        let competencies = Array.isArray(parsed.competencies) ? parsed.competencies : [];
        
        if (typeof summaryText === 'string') {
          const trimmed = summaryText.trim();
          // Check if summary contains entire JSON object as string
          // This happens when GPT double-encodes the JSON response
          if (trimmed.startsWith('{') && (trimmed.includes('"summary"') || trimmed.includes('"competencies"'))) {
            try {
              // Try to parse the nested JSON string
              const nestedParsed = JSON.parse(trimmed);
              
              // If nested object has summary and competencies, use them (prioritize nested over outer)
              if (typeof nestedParsed === 'object' && nestedParsed !== null) {
                if (nestedParsed.summary && typeof nestedParsed.summary === 'string') {
                  summaryText = nestedParsed.summary;
                }
                if (Array.isArray(nestedParsed.competencies)) {
                  // Use nested competencies if they exist, even if empty array (means we successfully parsed)
                  // Only override if outer competencies is empty or nested has items
                  if (competencies.length === 0 || nestedParsed.competencies.length > 0) {
                    competencies = nestedParsed.competencies;
                  }
                }
              }
            } catch (parseError) {
              // JSON might be truncated or malformed, try to extract what we can using regex
              console.warn('Failed to parse nested JSON in summary (may be truncated), trying manual extraction', parseError);
              
              // Extract summary text using regex (handles escaped quotes and newlines)
              // Look for the innermost summary field (nested JSON contains the actual summary)
              // Use a more robust regex that finds the inner summary field value
              // This regex needs to handle multi-line strings and escaped characters
              const summaryRegex = /"summary"\s*:\s*"((?:[^"\\]|\\.|\\n)*?)"(?:\s*[,}])/gs;
              let summaryMatches: RegExpMatchArray[] = [];
              let match;
              
              // Reset regex
              summaryRegex.lastIndex = 0;
              while ((match = summaryRegex.exec(trimmed)) !== null) {
                summaryMatches.push(match);
              }
              
              if (summaryMatches.length > 0) {
                // Take the last match (innermost summary field in nested JSON)
                const selectedMatch = summaryMatches[summaryMatches.length - 1];
                if (selectedMatch && selectedMatch[1]) {
                  summaryText = selectedMatch[1]
                    .replace(/\\"/g, '"')
                    .replace(/\\n/g, '\n')
                    .replace(/\\t/g, '\t')
                    .replace(/\\\\/g, '\\')
                    .replace(/\\r/g, '\r');
                }
              } else {
                // Fallback: try to extract summary even if regex fails
                // Look for pattern: "summary": "..." and extract until closing quote
                const summaryStart = trimmed.indexOf('"summary"');
                if (summaryStart !== -1) {
                  const colonIdx = trimmed.indexOf(':', summaryStart);
                  if (colonIdx !== -1) {
                    const quoteStart = trimmed.indexOf('"', colonIdx);
                    if (quoteStart !== -1) {
                      // Find the matching closing quote (handling escaped quotes)
                      let quoteEnd = quoteStart + 1;
                      while (quoteEnd < trimmed.length) {
                        if (trimmed[quoteEnd] === '"' && trimmed[quoteEnd - 1] !== '\\') {
                          break;
                        }
                        quoteEnd++;
                      }
                      if (quoteEnd < trimmed.length) {
                        const extracted = trimmed.substring(quoteStart + 1, quoteEnd);
                        summaryText = extracted
                          .replace(/\\"/g, '"')
                          .replace(/\\n/g, '\n')
                          .replace(/\\t/g, '\t')
                          .replace(/\\\\/g, '\\')
                          .replace(/\\r/g, '\r');
                      }
                    }
                  }
                }
              }
              
              // Extract competencies - look for all competence objects anywhere in the string
              // Handle both complete and truncated JSON strings
              const extractedComps: Array<{ label: string; evidence?: string }> = [];
              
              // First, try to find the competencies array start
              const compArrayStart = trimmed.indexOf('"competencies"');
              if (compArrayStart !== -1) {
                // Find the array start bracket
                const arrayStartIdx = trimmed.indexOf('[', compArrayStart);
                if (arrayStartIdx !== -1) {
                  // Extract everything from the array start to the end (or to a reasonable limit)
                  // This handles truncated JSON by taking what we can get
                  const arrayContentStart = arrayStartIdx + 1;
                  const remainingText = trimmed.substring(arrayContentStart);
                  
                  // Extract all label-value pairs first (this handles truncated objects better)
                  // Strategy: Find all "label": "value" patterns, then find their corresponding evidence if it exists
                  const labelRegex = /"label"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
                  const foundLabels = new Map<number, string>(); // position -> label
                  let labelMatch;
                  
                  while ((labelMatch = labelRegex.exec(remainingText)) !== null) {
                    const label = labelMatch[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
                    foundLabels.set(labelMatch.index, label);
                  }
                  
                  // For each label, try to find its evidence
                  const labelPositions = Array.from(foundLabels.keys()).sort((a, b) => a - b);
                  
                  for (let i = 0; i < labelPositions.length; i++) {
                    const labelPos = labelPositions[i];
                    const label = foundLabels.get(labelPos)!;
                    const nextLabelPos = i + 1 < labelPositions.length ? labelPositions[i + 1] : remainingText.length;
                    
                    // Search for evidence between this label and the next label (or end)
                    const searchRange = remainingText.substring(labelPos, nextLabelPos);
                    let evidence: string | undefined = undefined;
                    
                    // Look for evidence pattern - handle both complete and truncated strings
                    const evidencePattern = /"evidence"\s*:\s*"/;
                    const evidencePatternMatch = searchRange.match(evidencePattern);
                    
                    if (evidencePatternMatch && evidencePatternMatch.index !== undefined) {
                      // Found evidence field start
                      const evidenceStartIdx = evidencePatternMatch.index + evidencePatternMatch[0].length;
                      
                      // Extract evidence value - handle truncated strings
                      // Find the closing quote (if it exists) or take until end of search range
                      let evidenceEndIdx = evidenceStartIdx;
                      let foundClosingQuote = false;
                      
                      // Look for closing quote, handling escaped quotes
                      while (evidenceEndIdx < searchRange.length) {
                        const char = searchRange[evidenceEndIdx];
                        if (char === '"') {
                          // Check if it's escaped
                          let escapeCount = 0;
                          let checkIdx = evidenceEndIdx - 1;
                          while (checkIdx >= evidenceStartIdx && searchRange[checkIdx] === '\\') {
                            escapeCount++;
                            checkIdx--;
                          }
                          // If even number of backslashes, this is a real closing quote
                          if (escapeCount % 2 === 0) {
                            foundClosingQuote = true;
                            break;
                          }
                        }
                        evidenceEndIdx++;
                      }
                      
                      if (!foundClosingQuote) {
                        // No closing quote found (truncated), take everything to end of search range
                        evidenceEndIdx = searchRange.length;
                      }
                      
                      const evidenceRaw = searchRange.substring(evidenceStartIdx, evidenceEndIdx);
                      if (evidenceRaw) {
                        evidence = evidenceRaw.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\r/g, '\r');
                      }
                    }
                    
                    extractedComps.push({ label, evidence });
                  }
                }
              }
              
              // Use extracted competencies if we found any (prioritize nested over outer empty array)
              if (extractedComps.length > 0) {
                competencies = extractedComps;
                console.log(`Extracted ${extractedComps.length} competencies from nested/truncated JSON string`);
              }
            }
          }
        }

        // Fallback: If GPT returns no competencies, extract from conversation history
        if (competencies.length === 0 && conversationHistory.length > 0) {
          console.warn('GPT returned empty competencies, falling back to history extraction');
          competencies = extractCompetenciesFromHistory(conversationHistory);
        }

        return NextResponse.json({
          type: 'final',
          summary: summaryText,
          competencies: competencies.map((comp: any) => ({
            label: typeof comp === 'string' ? comp : comp.label || comp,
            evidence: typeof comp === 'object' && comp.evidence ? comp.evidence : undefined,
          })),
        });
      } catch (parseError) {
        console.error('Failed to parse GPT response:', parseError);
        console.error('Response:', response);
        throw new Error('Failed to parse GPT response as JSON');
      }
    } else {
      // Return question
      return NextResponse.json({
        type: 'question',
        question: response.trim(),
      });
    }
  } catch (error: any) {
    console.error('GPT API error:', error);
    
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

    return NextResponse.json(
      {
        error: 'Failed to generate response',
        message: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}

