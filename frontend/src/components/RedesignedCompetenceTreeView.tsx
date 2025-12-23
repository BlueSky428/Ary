'use client';

/**
 * Redesigned Competence Tree View
 * Single active pillar: Connection & Collaboration
 * Tab order: Competence Tree → Breakdown → Conversation
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Brain, Users, Zap, Heart, Sparkles,
  MessageSquare, ArrowRight, Target, TrendingUp
} from 'lucide-react';
import type { ConversationResult, ConversationHistory } from '@/lib/conversationResults';

// Connection & Collaboration competencies
const COLLABORATION_COMPETENCIES = [
  'Collaboration',
  'Empathy',
  'Teamwork',
  'Helpfulness',
  'Interpersonal skills',
  'Active listening',
  'Coordination',
];

interface CompetenceBubble {
  label: string;
  evidence?: string; // Optional one-line evidence phrase
}

export function RedesignedCompetenceTreeView() {
  const router = useRouter();
  const [conversationResult, setConversationResult] = useState<ConversationResult | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'tree' | 'breakdown' | 'conversation'>('tree');
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);
  const [showGPTResult, setShowGPTResult] = useState(false);
  const [gptResult, setGptResult] = useState<any>(null);

  useEffect(() => {
    // Only access sessionStorage in browser (not during SSR/build)
    if (typeof window === 'undefined') return;
    
    const storedResult = sessionStorage.getItem('conversationResult');
    const storedHistory = sessionStorage.getItem('conversationHistory');
    const storedGPTResult = sessionStorage.getItem('gptResult');
    
    if (storedResult) {
      try {
        setConversationResult(JSON.parse(storedResult));
      } catch (e) {
        console.error('Failed to parse conversation result', e);
      }
    }
    
    if (storedHistory) {
      try {
        setConversationHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.error('Failed to parse conversation history', e);
      }
    }
    
    // Load GPT result for display
    if (storedGPTResult) {
      try {
        setGptResult(JSON.parse(storedGPTResult));
      } catch (e) {
        console.error('Failed to parse GPT result', e);
      }
    }
  }, []);

  const result: ConversationResult = conversationResult || {
    id: 'default',
    title: 'Collaborative Professional',
    summary: "You demonstrate strong collaborative abilities and interpersonal skills. Your responses show a focus on working with others, understanding different perspectives, and supporting team goals. You value connection and effective communication in professional settings.",
    competencies: ['Collaboration', 'Teamwork', 'Empathy', 'Interpersonal skills'],
    detailedEvaluation: "Based on your conversation, you show a thoughtful and collaborative approach to working with others.",
    matchingPatterns: {
      questionIds: [],
      keywordPatterns: [],
      competencePatterns: [],
    },
  };

  // Extract Connection & Collaboration competencies from result
  const normalize = (str: string) => str.toLowerCase().replace(/[\s-]/g, '');
  
  // Check if result has GPT-provided competencies with evidence
  const hasGPTCompetencies = conversationResult && 
    conversationResult.matchingPatterns?.competencePatterns?.length > 0;
  
  let collaborationCompetencies: CompetenceBubble[] = [];
  
  // Use GPT-provided competencies from state (already loaded in useEffect)
  if (hasGPTCompetencies && conversationResult && gptResult) {
    // Use GPT-provided competencies from state (loaded in useEffect)
    try {
      if (gptResult.competencies && Array.isArray(gptResult.competencies)) {
        collaborationCompetencies = gptResult.competencies;
      }
    } catch (e) {
      console.error('Failed to parse GPT result:', e);
    }
  }
  
  // Fallback: Extract from result.competencies
  if (collaborationCompetencies.length === 0) {
    collaborationCompetencies = result.competencies
      .filter(comp => 
        COLLABORATION_COMPETENCIES.some(collabComp => 
          normalize(comp) === normalize(collabComp) ||
          normalize(comp).includes(normalize(collabComp)) ||
          normalize(collabComp).includes(normalize(comp))
        )
      )
      .map(comp => {
        // Try to find evidence from conversation history
        const evidenceEntry = conversationHistory.find(entry =>
          entry.competencies.some(c => normalize(c) === normalize(comp))
        );
        
        // Extract a short evidence phrase if available
        let evidence: string | undefined;
        if (evidenceEntry) {
          // Simple evidence extraction
          const answerLower = evidenceEntry.answer.toLowerCase();
          if (answerLower.includes('collaborat') || answerLower.includes('team')) {
            evidence = "You referenced working with others...";
          } else if (answerLower.includes('listen') || answerLower.includes('understand')) {
            evidence = "You mentioned listening and understanding...";
          } else if (answerLower.includes('help') || answerLower.includes('support')) {
            evidence = "You described helping others...";
          }
        }
        
        return {
          label: comp,
          evidence,
        };
      });
  }

  // Parse summary if it's a JSON string, then split into 3 sentences
  let summaryText = result.summary;
  if (typeof summaryText === 'string') {
    const trimmed = summaryText.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('"')) {
      try {
        // First try parsing as JSON
        const parsed = JSON.parse(trimmed);
        if (typeof parsed === 'object' && parsed.summary) {
          summaryText = parsed.summary;
        } else if (typeof parsed === 'string') {
          summaryText = parsed;
        }
      } catch {
        // If parsing fails, try to extract text between quotes or after "summary":
        const match = trimmed.match(/"summary"\s*:\s*"([^"]+(?:"[^"]*")*[^"]*)"/);
        if (match && match[1]) {
          summaryText = match[1].replace(/\\"/g, '"').replace(/\\n/g, '\n');
        } else {
          // Try to remove JSON structure manually
          summaryText = trimmed.replace(/^\{?\s*"summary"\s*:\s*"/, '').replace(/"\s*\}?$/, '').replace(/\\"/g, '"').replace(/\\n/g, '\n');
        }
      }
    }
  }
  
  const summarySentences = summaryText
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 0)
    .slice(0, 3)
    .map(s => s.trim() + '.');

  const normalizedCompetencies = result.competencies.map(c => normalize(c));

  const pillarCompetencies: Record<string, { label: string; icon: any; color: string; keywords: string[] }> = {
    execution: {
      label: 'Execution & Delivery',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      keywords: [
        // Core execution terms
        'execution', 'execute', 'executing', 'execution style', 'delivery', 'deliver', 'delivering',
        // Goal and results orientation
        'goal-driven', 'goal oriented', 'goal-orientation', 'goals', 'results-oriented', 'results driven', 'results-focused', 'outcome-focused', 'outcome driven',
        // Planning and organization
        'planning', 'plan', 'planned', 'organize', 'organization', 'organizing', 'organized', 'structure', 'structured', 'structuring',
        // Action and initiative
        'initiative', 'proactive', 'proactivity', 'action-oriented', 'action driven', 'drive', 'driven',
        // Completion and deadlines
        'complete', 'completion', 'finish', 'finished', 'deadline', 'deadlines', 'timeline', 'timelines',
        // Systematic approach
        'systematic', 'methodical', 'process', 'processes', 'efficiency', 'efficient', 'productivity', 'productive',
        // Resilience and follow-through
        'resilience', 'resilient', 'persistence', 'persistent', 'follow-through', 'follow through', 'commitment',
      ],
    },
    collaboration: {
      label: 'Connection & Collaboration',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
      keywords: [
        // Core collaboration terms
        'collaboration', 'collaborate', 'collaborating', 'collaborative', 'collaborator', 'cooperation', 'cooperate', 'cooperative',
        // Interpersonal skills
        'interpersonal', 'interpersonal skills', 'interpersonal communication', 'people skills',
        // Team and group work
        'teamwork', 'team work', 'team player', 'team-oriented', 'team collaboration', 'working together', 'work together',
        // Empathy and understanding
        'empathy', 'empathetic', 'understanding', 'understand others', 'emotional intelligence', 'eq', 'emotional awareness',
        // Communication
        'communication', 'communicate', 'communicating', 'communicative', 'active listening', 'listening', 'listen',
        // Support and helpfulness
        'helpfulness', 'helpful', 'help others', 'support', 'supportive', 'supporting', 'assist', 'assistance',
        // Leadership and influence
        'leadership', 'lead', 'leading', 'leadership skills', 'influence', 'influencing', 'coordination', 'coordinate', 'coordinating',
        // Client and stakeholder focus
        'client', 'clients', 'stakeholder', 'stakeholders', 'customer', 'customers', 'service-oriented', 'service orientation',
        // Building relationships
        'relationship', 'relationships', 'building relationships', 'networking', 'network', 'connection', 'connections', 'connecting',
      ],
    },
    thinking: {
      label: 'Thinking & Problem-Solving',
      icon: Brain,
      color: 'from-indigo-500 to-purple-500',
      keywords: [
        // Strategic thinking
        'strategic thinking', 'strategic', 'strategy', 'strategic planning', 'strategic approach', 'strategic mind', 'strategist',
        // Problem-solving
        'problem-solving', 'problem solving', 'solve problems', 'solving problems', 'problem solver', 'troubleshooting', 'troubleshoot',
        // Analytical thinking
        'analytical', 'analysis', 'analyze', 'analyzing', 'analytical thinking', 'critical thinking', 'critical analysis',
        // Pattern recognition
        'pattern recognition', 'pattern', 'patterns', 'identify patterns', 'recognize patterns', 'pattern analysis',
        // Innovation and creativity
        'innovation', 'innovative', 'innovate', 'innovating', 'creativity', 'creative', 'create', 'creating', 'original thinking',
        // Ideas and ideation
        'idea', 'ideas', 'ideation', 'conceptual thinking', 'concept', 'concepts', 'brainstorming', 'brainstorm',
        // Design thinking
        'design', 'design thinking', 'designing', 'architecture', 'architectural thinking',
        // Complex reasoning
        'reasoning', 'logical thinking', 'logic', 'systematic thinking', 'complex thinking', 'abstract thinking',
      ],
    },
    growth: {
      label: 'Self-Awareness & Growth',
      icon: TrendingUp,
      color: 'from-teal-500 to-green-500',
      keywords: [
        // Self-awareness
        'self-awareness', 'self awareness', 'self-aware', 'self understanding', 'know yourself', 'self-reflection', 'self reflection',
        // Reflection
        'reflection', 'reflect', 'reflecting', 'reflective', 'introspection', 'introspective', 'contemplative',
        // Learning
        'learning', 'learn', 'learner', 'continuous learning', 'lifelong learning', 'learning mindset', 'learning orientation',
        // Growth mindset
        'growth-mindset', 'growth mindset', 'growth', 'growing', 'personal growth', 'development', 'develop', 'developing', 'self-development',
        // Openness and curiosity
        'openness', 'open', 'open-minded', 'open minded', 'curiosity', 'curious', 'inquisitive', 'explore', 'exploring', 'exploration',
        // Adaptability
        'adaptability', 'adaptable', 'adapt', 'adapting', 'flexibility', 'flexible', 'adjust', 'adjusting', 'resilience to change',
        // Improvement
        'improve', 'improvement', 'improving', 'enhance', 'enhancing', 'practice', 'practicing', 'refine', 'refining',
        // Feedback and development
        'feedback', 'seek feedback', 'accept feedback', 'self-improvement', 'self improvement', 'skill development', 'skill building',
      ],
    },
    purpose: {
      label: 'Purpose & Impact',
      icon: Heart,
      color: 'from-orange-500 to-red-500',
      keywords: [
        // Purpose
        'purpose', 'purpose-driven', 'purpose driven', 'sense of purpose', 'meaning', 'meaningful', 'meaningful work',
        // Values
        'values-driven', 'values driven', 'values', 'value-driven', 'value driven', 'principles', 'principled', 'ethics', 'ethical',
        // Impact
        'impact', 'impact-driven', 'impact driven', 'make an impact', 'create impact', 'positive impact', 'contribute', 'contribution',
        // Mission and vision
        'mission', 'mission-driven', 'mission driven', 'vision', 'vision-driven', 'cause', 'advocacy',
        // Motivation
        'motivation', 'motivated', 'motivate', 'intrinsic motivation', 'drive', 'passion', 'passionate', 'inspiration', 'inspired',
        // Goal-driven (also relevant to purpose)
        'goal-driven', 'goal oriented', 'long-term goals', 'aspirations', 'aspire', 'ambition', 'ambitious',
        // Client and user focus
        'clients', 'client-focused', 'client focus', 'users', 'user-centered', 'customer focus', 'stakeholder impact',
        // Outcomes and results with meaning
        'outcome', 'outcomes', 'results with meaning', 'meaningful results', 'contribution to society', 'social impact',
      ],
    },
  };

  const mapPillar = (id: string) => {
    const conf = pillarCompetencies[id];
    if (!conf) return null;
    const comps = conf.keywords;
    const matched = result.competencies.filter(comp =>
      comps.some(pc => normalize(pc) === normalize(comp) || normalize(comp).includes(normalize(pc)) || normalize(pc).includes(normalize(comp)))
    );
    return {
      id,
      label: conf.label,
      icon: conf.icon,
      color: conf.color,
      isActive: matched.length > 0,
      isLocked: matched.length === 0,
      matched,
    };
  };

  const pillars = Object.keys(pillarCompetencies)
    .map(mapPillar)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Get GPT competencies with evidence (if available)
  const getGPTCompetencies = (): CompetenceBubble[] => {
    // Use state instead of directly accessing sessionStorage
    if (!gptResult) return [];
    
    try {
      if (gptResult.competencies && Array.isArray(gptResult.competencies)) {
        return gptResult.competencies.map((comp: any) => ({
          label: typeof comp === 'string' ? comp : comp.label || comp,
          evidence: typeof comp === 'object' && comp.evidence ? comp.evidence : undefined,
        }));
      }
    } catch (e) {
      console.error('Failed to parse GPT result:', e);
    }
    return [];
  };

  const getPillarCompetencies = (pillarId: string): CompetenceBubble[] => {
    // First, try to get GPT-provided competencies with evidence
    const gptCompetencies = getGPTCompetencies();
    
    // Get pillar keywords for matching
    const pillarKeywords = pillarCompetencies[pillarId]?.keywords || [];
    
    // Match GPT competencies to this pillar using improved matching
    const pillarMatches = gptCompetencies.filter(gptComp => {
      const normalizedLabel = normalize(gptComp.label);
      return pillarKeywords.some(keyword => {
        const normalizedKeyword = normalize(keyword);
        // Exact match
        if (normalizedLabel === normalizedKeyword) return true;
        // Check if label contains keyword or vice versa (but be more careful)
        // Split into words to avoid false positives (e.g., "plan" matching "explain")
        const labelWords = normalizedLabel.split(/\s+/);
        const keywordWords = normalizedKeyword.split(/\s+/);
        // If keyword is a single word, check if any label word contains it
        if (keywordWords.length === 1) {
          return labelWords.some(word => word.includes(normalizedKeyword) || normalizedKeyword.includes(word));
        }
        // For multi-word keywords, require at least one word match
        return keywordWords.some(kw => labelWords.some(lw => lw.includes(kw) || kw.includes(lw)));
      });
    });

    // If we have GPT matches with evidence, use them directly
    if (pillarMatches.length > 0) {
      return pillarMatches;
    }

    // Fallback: Match result.competencies to pillar keywords (for non-GPT results)
    const comps = pillarCompetencies[pillarId]?.keywords || [];
    const fallbackMatches = result.competencies.filter(comp => {
      const normalizedComp = normalize(comp);
      return comps.some(pc => {
        const normalizedKeyword = normalize(pc);
        if (normalizedComp === normalizedKeyword) return true;
        // Word-based matching for fallback too
        const compWords = normalizedComp.split(/\s+/);
        const keywordWords = normalizedKeyword.split(/\s+/);
        if (keywordWords.length === 1) {
          return compWords.some(word => word.includes(normalizedKeyword) || normalizedKeyword.includes(word));
        }
        return keywordWords.some(kw => compWords.some(cw => cw.includes(kw) || kw.includes(cw)));
      });
    });

    // If no matches, return empty
    if (fallbackMatches.length === 0) {
      return [];
    }

    // For fallback matches, try to find evidence from conversation history
    return fallbackMatches.map(comp => {
      // Try to find if GPT provided evidence for this competency
      const gptMatch = gptCompetencies.find(gc => normalize(gc.label) === normalize(comp));
      if (gptMatch && gptMatch.evidence) {
        return { label: comp, evidence: gptMatch.evidence };
      }

      // Fallback: Try to extract from conversation history (minimal, just to have something)
      const evidenceEntry = conversationHistory.find(entry =>
        entry.answer.toLowerCase().includes(comp.toLowerCase().split(/\s+/)[0])
      );
      
      return {
        label: comp,
        evidence: evidenceEntry ? undefined : undefined, // Don't generate generic evidence
      };
    });
  };

  const activePillars = pillars.filter(p => p.isActive && getPillarCompetencies(p.id).length > 0);
  
  // Fallback: If no pillars are active but we have competencies, activate the best matching pillar
  let defaultPillar = activePillars[0] || null;
  if (!defaultPillar && result.competencies.length > 0) {
    // Find pillar with most keyword matches in conversation text
    const allText = conversationHistory.map(h => `${h.question} ${h.answer}`).join(' ').toLowerCase();
    let bestMatch = { pillar: null as typeof pillars[0] | null, score: 0 };
    
    for (const pillar of pillars) {
      const keywords = pillarCompetencies[pillar.id]?.keywords || [];
      const score = keywords.filter(kw => allText.includes(normalize(kw))).length;
      if (score > bestMatch.score) {
        bestMatch = { pillar, score };
      }
    }
    
    if (bestMatch.pillar) {
      // Activate this pillar
      defaultPillar = { ...bestMatch.pillar, isActive: true, isLocked: false };
      // Update pillars array
      const pillarIndex = pillars.findIndex(p => p.id === bestMatch.pillar!.id);
      if (pillarIndex >= 0) {
        pillars[pillarIndex] = defaultPillar;
      }
    }
  }
  
  // Use selected pillar if available and valid, otherwise use default
  const selectedPillar = selectedPillarId 
    ? pillars.find(p => p.id === selectedPillarId && (p.isActive || p.id === defaultPillar?.id))
    : null;
  let primaryPillar = selectedPillar || defaultPillar;

  let activePillarCompetencies = primaryPillar ? getPillarCompetencies(primaryPillar.id) : [];
  
  // Final fallback: If still no competencies, extract from conversation text
  if (activePillarCompetencies.length === 0 && conversationHistory.length > 0) {
    const allText = conversationHistory.map(h => h.answer).join(' ').toLowerCase();
    const fallbackCompetencies: CompetenceBubble[] = [];
    
    // Simple keyword-based extraction
    if (allText.includes('plan') || allText.includes('organize') || allText.includes('goal')) {
      fallbackCompetencies.push({ label: 'Planning', evidence: 'You discussed planning and organization.' });
    }
    if (allText.includes('team') || allText.includes('collaborate') || allText.includes('work together')) {
      fallbackCompetencies.push({ label: 'Teamwork', evidence: 'You mentioned working with others.' });
    }
    if (allText.includes('learn') || allText.includes('improve') || allText.includes('grow')) {
      fallbackCompetencies.push({ label: 'Learning', evidence: 'You talked about learning and growth.' });
    }
    if (allText.includes('think') || allText.includes('solve') || allText.includes('problem')) {
      fallbackCompetencies.push({ label: 'Problem-Solving', evidence: 'You described your thinking process.' });
    }
    if (allText.includes('purpose') || allText.includes('impact') || allText.includes('meaning')) {
      fallbackCompetencies.push({ label: 'Purpose-Driven', evidence: 'You discussed purpose and impact.' });
    }
    
    // Ensure at least one
    if (fallbackCompetencies.length === 0) {
      fallbackCompetencies.push({ 
        label: 'Professional Engagement', 
        evidence: 'You engaged thoughtfully in professional reflection.' 
      });
    }
    
    // If we have fallback competencies but no active pillar, activate the best matching pillar
    if (fallbackCompetencies.length > 0 && !primaryPillar) {
      // Find best matching pillar based on fallback competencies
      let bestPillar = pillars[0];
      let bestScore = 0;
      for (const pillar of pillars) {
        const keywords = pillarCompetencies[pillar.id]?.keywords || [];
        const score = fallbackCompetencies.filter(fc => 
          keywords.some(kw => normalize(fc.label).includes(normalize(kw)) || normalize(kw).includes(normalize(fc.label)))
        ).length;
        if (score > bestScore) {
          bestScore = score;
          bestPillar = pillar;
        }
      }
      primaryPillar = { ...bestPillar, isActive: true, isLocked: false };
    }
    
    // Use fallback competencies
    if (fallbackCompetencies.length > 0) {
      activePillarCompetencies = fallbackCompetencies;
    }
  }
  
  const showNoData = !primaryPillar || activePillarCompetencies.length === 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Your Identity Core
            </h1>
            <p className="text-xl text-primary-600 dark:text-primary-400 font-semibold mb-4">
              {result.title}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Patterns revealed from your conversation with Ary
            </p>
            {gptResult && (
              <button
                onClick={() => setShowGPTResult(true)}
                className="mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                View GPT Result
              </button>
            )}
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
            {[
              { id: 'tree' as const, label: 'Competence Tree' },
              { id: 'breakdown' as const, label: 'Breakdown' },
              { id: 'conversation' as const, label: 'Conversation' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'tree' && (
              <motion.div
                key="tree"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Your Competence Tree
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Click on the active pillar to see your competence breakdown.
                  </p>
                </div>
                
                <div className="relative h-[500px] flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/30 dark:to-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                  {/* Central Core */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute z-20"
                  >
                    <div className="relative w-36 h-36 bg-gradient-to-br from-neutral-700 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 rounded-full shadow-2xl border-4 border-white/30 flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-xl animate-pulse" />
                      <div className="text-center relative z-10">
                        <p className="text-white text-base font-bold leading-tight">Identity</p>
                        <p className="text-white text-base font-bold leading-tight">Core</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Pillars */}
                  {pillars.map((pillar, idx) => {
                    const Icon = pillar.icon;
                    const angle = (idx / pillars.length) * Math.PI * 2 - Math.PI / 2;
                    const radius = 180;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <motion.div
                        key={pillar.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ 
                          scale: 1,
                          opacity: pillar.isLocked ? 0.4 : 1,
                          x,
                          y,
                        }}
                        transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
                        className={`absolute z-10 ${pillar.isActive && !pillar.isLocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        style={{ transform: 'translate(-50%, -50%)' }}
                        onClick={() => {
                          if (pillar.isActive && !pillar.isLocked) {
                            setSelectedPillarId(pillar.id);
                            setActiveTab('breakdown');
                          }
                        }}
                      >
                        <div className={`relative w-28 h-28 rounded-full shadow-2xl border-2 flex flex-col items-center justify-center p-3 transition-all ${
                          pillar.isActive && !pillar.isLocked
                            ? `bg-gradient-to-br ${pillar.color} border-white/90 shadow-lg hover:scale-110`
                            : pillar.isLocked
                            ? 'bg-gradient-to-br from-neutral-400 to-neutral-500 border-neutral-300/60 shadow-md opacity-60'
                            : `bg-gradient-to-br ${pillar.color} border-white/90 shadow-lg opacity-60`
                        }`}>
                          {pillar.isActive && !pillar.isLocked && (
                            <motion.div
                              className={`absolute inset-0 rounded-full bg-gradient-to-br ${pillar.color} opacity-60 blur-xl -z-10`}
                              animate={{
                                opacity: [0.4, 0.6, 0.4],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                          )}
                          
                          <Icon 
                            className={`w-7 h-7 mb-1.5 ${pillar.isActive && !pillar.isLocked ? 'text-white' : 'text-white/90'}`} 
                            strokeWidth={2} 
                          />
                          
                          <p className={`text-xs font-semibold text-center leading-tight ${
                            pillar.isActive && !pillar.isLocked ? 'text-white' : 'text-white drop-shadow-md'
                          }`}>
                            {pillar.label}
                          </p>
                          
                          {pillar.isLocked && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">🔒</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {activeTab === 'breakdown' && (
              <motion.div
                key="breakdown"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Visual: Active pillar bubble with competence bubbles */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-neutral-50 via-neutral-50/50 to-neutral-100 dark:from-neutral-900 dark:via-neutral-800/30 dark:to-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                      }} />
                    </div>

                    {/* Central: Active pillar */}
                  {primaryPillar && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                      className="absolute z-30"
                    >
                      <div className="relative group">
                        {/* Outer glow rings */}
                        <motion.div 
                          className={`absolute inset-0 rounded-full bg-gradient-to-br ${primaryPillar.color} opacity-40 blur-2xl -z-20`}
                          animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.4, 0.6, 0.4]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        />
                        <motion.div 
                          className={`absolute inset-0 rounded-full bg-gradient-to-br ${primaryPillar.color} opacity-30 blur-xl -z-10`}
                          animate={{ 
                            scale: [1, 1.15, 1],
                            opacity: [0.3, 0.5, 0.3]
                          }}
                          transition={{ 
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.5
                          }}
                        />

                        {/* Main circle */}
                        <div className={`relative w-40 h-40 rounded-full bg-gradient-to-br ${primaryPillar.color} shadow-2xl border-4 border-white/40 dark:border-white/20 flex flex-col items-center justify-center backdrop-blur-sm`}>
                          {/* Target icon */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 border-4 border-white/60 rounded-full flex items-center justify-center">
                              <div className="w-12 h-12 border-2 border-white/80 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Icon */}
                          <primaryPillar.icon className="w-7 h-7 text-white mb-8 relative z-10" strokeWidth={2.5} />
                          
                          {/* Label */}
                          <p className="text-white text-sm font-bold text-center leading-tight px-3 relative z-10 mt-auto mb-2 drop-shadow-lg">
                            {primaryPillar.label.split(' ').map((word, i) => (
                              <span key={i} className="block">
                                {word === '&' ? '&' : word}
                              </span>
                            ))}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                    {/* Connection lines from center to competency cards */}
                    {!showNoData && (() => {
                      // Calculate safe radius to prevent overlaps
                      // Central circle: w-40 = 160px diameter = 80px radius
                      // Card: max-w-[200px] = 200px max width = 100px radius from card center
                      // Minimum gap: 20px
                      // Base radius: center radius (80) + gap (30) + card half-width (100) = 210px
                      // For more cards, need larger radius to prevent card-to-card overlap
                      const centerRadius = 80; // Half of w-40 (160px)
                      const cardHalfWidth = 100; // Half of max card width (200px)
                      const minGap = 30;
                      const baseRadius = centerRadius + minGap + cardHalfWidth;
                      
                      // Adjust radius based on number of competencies to prevent card-to-card overlap
                      const numCompetencies = activePillarCompetencies.length;
                      const minAngle = (Math.PI * 2) / numCompetencies;
                      // For cards to not overlap, distance between card centers must be >= card width
                      // distance = 2 * radius * sin(minAngle/2) >= 200
                      // radius >= 200 / (2 * sin(minAngle/2))
                      const minRadiusForSpacing = numCompetencies > 1 
                        ? Math.max(baseRadius, 200 / (2 * Math.sin(minAngle / 2)) + 20)
                        : baseRadius;
                      
                      const radius = Math.max(minRadiusForSpacing, 220); // Minimum 220px for safety
                      
                      return activePillarCompetencies.map((comp, idx) => {
                        const angle = (idx / numCompetencies) * Math.PI * 2 - Math.PI / 2;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        const centerX = 0;
                        const centerY = 0;

                        return (
                          <svg
                            key={`line-${comp.label}`}
                            className="absolute inset-0 pointer-events-none z-0"
                            style={{ transform: 'translate(50%, 50%)' }}
                          >
                            <motion.line
                              x1={centerX}
                              y1={centerY}
                              x2={x}
                              y2={y}
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                              className="text-primary-300/30 dark:text-primary-600/20"
                              initial={{ pathLength: 0, opacity: 0 }}
                              animate={{ pathLength: 1, opacity: 1 }}
                              transition={{ delay: 0.5 + idx * 0.1, duration: 0.6 }}
                            />
                          </svg>
                        );
                      });
                    })()}

                    {/* Competence bubbles around center */}
                    {!showNoData && (() => {
                      // Use same radius calculation as connection lines
                      const centerRadius = 80;
                      const cardHalfWidth = 100;
                      const minGap = 30;
                      const baseRadius = centerRadius + minGap + cardHalfWidth;
                      const numCompetencies = activePillarCompetencies.length;
                      const minAngle = (Math.PI * 2) / numCompetencies;
                      const minRadiusForSpacing = numCompetencies > 1 
                        ? Math.max(baseRadius, 200 / (2 * Math.sin(minAngle / 2)) + 20)
                        : baseRadius;
                      const radius = Math.max(minRadiusForSpacing, 220);
                      
                      return activePillarCompetencies.map((comp, idx) => {
                        const angle = (idx / numCompetencies) * Math.PI * 2 - Math.PI / 2;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;

                      return (
                        <motion.div
                          key={comp.label}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: 1,
                            opacity: 1,
                            x,
                            y,
                          }}
                          transition={{ delay: 0.3 + idx * 0.12, type: "spring", stiffness: 180, damping: 15 }}
                          className="absolute z-20 group"
                          style={{ transform: 'translate(-50%, -50%)' }}
                          whileHover={{ scale: 1.05, z: 30 }}
                        >
                          {/* Glow effect on hover */}
                          <div className="absolute inset-0 rounded-xl bg-primary-400/0 dark:bg-primary-500/0 blur-xl group-hover:bg-primary-400/40 dark:group-hover:bg-primary-500/40 transition-all duration-300 -z-10" />
                          
                          <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-xl border-2 border-primary-300/50 dark:border-primary-600/50 group-hover:border-primary-400 dark:group-hover:border-primary-500 min-w-[160px] max-w-[200px] backdrop-blur-sm transition-all duration-300">
                            {/* Competency label */}
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 text-center mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {comp.label}
                            </p>
                            
                            {/* Evidence text */}
                            {comp.evidence && (
                              <p className="text-xs text-neutral-600 dark:text-neutral-400 text-center italic leading-relaxed line-clamp-3">
                                {comp.evidence.length > 80 
                                  ? `${comp.evidence.substring(0, 77)}...` 
                                  : comp.evidence}
                              </p>
                            )}
                            
                            {/* Decorative accent */}
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-primary-400 dark:via-primary-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        </motion.div>
                      );
                      });
                    })()}
                    {showNoData && (
                      <div className="absolute text-center text-sm text-neutral-600 dark:text-neutral-300 px-4">
                        No competencies detected for this pillar.
                      </div>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gradient-to-br from-white to-neutral-50/50 dark:from-neutral-900 dark:to-neutral-800/30 rounded-2xl p-8 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 relative overflow-hidden">
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-400/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  
                  <div className="relative">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" strokeWidth={2} />
                      Professional Reflection
                    </h2>
                    <div className="space-y-4">
                      {summarySentences.map((sentence, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.15, duration: 0.5 }}
                          className="relative pl-6"
                        >
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-primary-500 dark:from-primary-500 dark:to-primary-600 opacity-60 rounded-full" />
                          <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
                            {sentence}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'conversation' && (
              <motion.div
                key="conversation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6 flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    Your Conversation Journey
                  </h2>
                  
                  <div className="space-y-6">
                    {conversationHistory.map((entry, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative pl-8 border-l-2 border-primary-200 dark:border-primary-800"
                      >
                        <div className="absolute left-0 top-0 w-4 h-4 bg-primary-500 rounded-full -translate-x-[9px]" />
                        
                        <div className="space-y-3">
                          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
                            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">
                              Question {idx + 1}
                            </p>
                            <p className="text-neutral-800 dark:text-neutral-200">
                              {entry.question}
                            </p>
                          </div>
                          
                          <div className="bg-primary-50 dark:bg-primary-950/20 rounded-xl p-4">
                            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                              Your Answer
                            </p>
                            <p className="text-neutral-800 dark:text-neutral-200 italic">
                              "{entry.answer}"
                            </p>
                          </div>
                          
                          {entry.competencies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {entry.competencies.map((comp, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="text-xs px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full font-medium"
                                >
                                  {comp}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="mt-8 flex gap-4 justify-center">
            <motion.button
              onClick={() => router.push('/demo')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all font-medium shadow-sm"
            >
              Try Again
            </motion.button>
            <motion.button
              onClick={() => router.push('/waitlist')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-sm flex items-center gap-2"
            >
              Join Waitlist
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* GPT Result Modal */}
      {showGPTResult && gptResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowGPTResult(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-[90vw] max-w-4xl h-[80vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">GPT Result</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Final response from GPT</p>
              </div>
              <button
                onClick={() => setShowGPTResult(false)}
                className="px-3 py-1.5 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-auto px-4 py-3 space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-lg p-4">
                <p className="font-semibold mb-2 text-neutral-800 dark:text-neutral-100">Summary</p>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{gptResult.summary}</p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-lg p-4">
                <p className="font-semibold mb-2 text-neutral-800 dark:text-neutral-100">Competencies</p>
                <div className="space-y-2">
                  {gptResult.competencies && Array.isArray(gptResult.competencies) ? (
                    gptResult.competencies.map((comp: any, idx: number) => (
                      <div key={idx} className="bg-white dark:bg-neutral-900 rounded p-3 border border-neutral-200 dark:border-neutral-700">
                        <p className="font-medium text-neutral-900 dark:text-neutral-100">{typeof comp === 'string' ? comp : comp.label || comp}</p>
                        {typeof comp === 'object' && comp.evidence && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 italic">{comp.evidence}</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">No competencies found</p>
                  )}
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-800/60 rounded-lg p-4">
                <p className="font-semibold mb-2 text-neutral-800 dark:text-neutral-100">Raw JSON</p>
                <pre className="text-xs bg-neutral-100 dark:bg-neutral-900 rounded p-3 overflow-auto whitespace-pre-wrap break-words">
                  {JSON.stringify(gptResult, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
