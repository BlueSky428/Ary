'use client';

/**
 * Redesigned Competence Tree View
 * Five pillars: Collaboration & Stakeholder Navigation, Decision Framing & Judgment,
 * Execution & Ownership, Learning & Adaptation, Initiative & Impact Orientation
 * Tab order: Compiled Artifact → Conversation
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Users, Target, Scale, BookOpen, Rocket,
  MessageSquare, ArrowRight, FileText, Layers
} from 'lucide-react';
import type { ConversationResult, ConversationHistory } from '@/lib/conversationResults';

// Legacy competency list (kept for backward compatibility)
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
  pillar?: string; // Which pillar this competency belongs to
  evidence?: string; // Optional one-line evidence phrase
}

export function RedesignedCompetenceTreeView() {
  const router = useRouter();
  const [conversationResult, setConversationResult] = useState<ConversationResult | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'conversation'>('breakdown');
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);
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
        // Failed to parse conversation result - will use default
      }
    }
    
    if (storedHistory) {
      try {
        setConversationHistory(JSON.parse(storedHistory));
      } catch (e) {
        // Failed to parse conversation history - will use empty array
      }
    }
    
    // Load GPT result for competency extraction (not displayed)
    if (storedGPTResult) {
      try {
        setGptResult(JSON.parse(storedGPTResult));
      } catch (e) {
        // Failed to parse GPT result - will use fallback extraction
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

  // Extract competencies from result
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
      // Failed to parse GPT result, using fallback
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


  const normalizedCompetencies = result.competencies.map(c => normalize(c));

  // All 5 pillars - Collaboration is active, others are locked for demo
  const pillarCompetencies: Record<string, { label: string; icon: any; color: string; keywords: string[] }> = {
    collaboration: {
      label: 'Collaboration & Stakeholder Navigation',
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
        // Stakeholder navigation
        'stakeholder', 'stakeholders', 'navigate stakeholders', 'stakeholder management', 'stakeholder engagement', 'stakeholder relations',
        'navigate', 'navigating', 'navigation', 'manage stakeholders', 'stakeholder communication',
      ],
    },
    execution: {
      label: 'Execution & Ownership',
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      keywords: ['execution', 'ownership', 'delivery', 'results'],
    },
    thinking: {
      label: 'Decision Framing & Judgment',
      icon: Scale,
      color: 'from-indigo-500 to-purple-500',
      keywords: ['decision', 'judgment', 'framing', 'thinking'],
    },
    growth: {
      label: 'Learning & Adaptation',
      icon: BookOpen,
      color: 'from-teal-500 to-green-500',
      keywords: ['learning', 'adaptation', 'growth', 'development'],
    },
    purpose: {
      label: 'Initiative & Impact Orientation',
      icon: Rocket,
      color: 'from-orange-500 to-red-500',
      keywords: ['initiative', 'impact', 'purpose', 'orientation'],
    },
  };

  const mapPillar = (id: string) => {
    const conf = pillarCompetencies[id];
    if (!conf) return null;
    const comps = conf.keywords;
    const matched = result.competencies.filter(comp =>
      comps.some(pc => normalize(pc) === normalize(comp) || normalize(comp).includes(normalize(pc)) || normalize(pc).includes(normalize(comp)))
    );
    // For demo: Only Collaboration is active, all others are locked
    // Collaboration should always be active (regardless of matches, as matching happens in getPillarCompetencies)
    const isActive = id === 'collaboration';
    const isLocked = id !== 'collaboration';
    return {
      id,
      label: conf.label,
      icon: conf.icon,
      color: conf.color,
      isActive,
      isLocked,
      matched,
    };
  };

  const pillars = Object.keys(pillarCompetencies)
    .map(mapPillar)
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  // Get GPT competencies with evidence (if available)
  const getGPTCompetencies = (): CompetenceBubble[] => {
    // Use state instead of directly accessing sessionStorage
    if (!gptResult) {
      console.log('[CompetenceTree] No gptResult found');
      return [];
    }
    
    try {
      if (gptResult.competencies && Array.isArray(gptResult.competencies)) {
        const mapped = gptResult.competencies.map((comp: { label: string; pillar?: string; evidence?: string } | string) => ({
          label: typeof comp === 'string' ? comp : comp.label || comp || '',
          pillar: typeof comp === 'object' && comp.pillar ? comp.pillar : undefined,
          evidence: typeof comp === 'object' && comp.evidence ? comp.evidence : undefined,
        }));
        console.log(`[CompetenceTree] Extracted ${mapped.length} competencies from GPT result:`, mapped.map((c: CompetenceBubble) => `${c.label} (pillar: ${c.pillar || 'none'})`));
        return mapped;
      } else {
        console.log('[CompetenceTree] gptResult.competencies is not an array:', gptResult.competencies);
      }
    } catch (e) {
      console.error('[CompetenceTree] Failed to parse GPT result:', e);
    }
    return [];
  };

  const getPillarCompetencies = (pillarId: string): CompetenceBubble[] => {
    // First, try to get GPT-provided competencies with evidence
    const gptCompetencies = getGPTCompetencies();
    
    // Filter competencies by pillar ID (GPT now includes pillar field in each competency)
    const pillarMatches = gptCompetencies.filter(comp => {
      // If competency has a pillar field, match by that
      if (comp.pillar) {
        return comp.pillar === pillarId;
      }
      // Fallback: if no pillar field, use keyword matching (backward compatibility)
      return false;
    });
    
    // If we have matches by pillar field, return them
    if (pillarMatches.length > 0) {
      console.log(`[CompetenceTree] Found ${pillarMatches.length} competencies for pillar '${pillarId}':`, pillarMatches.map(c => c.label));
      return pillarMatches;
    }
    
    // Fallback: Get pillar keywords for matching (for old format or backward compatibility)
    const pillarKeywords = pillarCompetencies[pillarId]?.keywords || [];
    
    // Match GPT competencies to this pillar using improved matching
    const pillarMatchesByKeywords = gptCompetencies.filter(gptComp => {
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
    if (pillarMatchesByKeywords.length > 0) {
      return pillarMatchesByKeywords;
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

  // Find the active pillar (should be Collaboration for demo)
  const primaryPillar = pillars.find(p => p.isActive && !p.isLocked) || pillars.find(p => p.id === 'collaboration') || null;
  let activePillarCompetencies = primaryPillar ? getPillarCompetencies(primaryPillar.id) : [];
  
  // Final fallback: If still no competencies, extract from conversation text (collaboration only)
  if (activePillarCompetencies.length === 0 && conversationHistory.length > 0) {
    const allText = conversationHistory.map(h => h.answer).join(' ').toLowerCase();
    const fallbackCompetencies: CompetenceBubble[] = [];
    
    // Simple keyword-based extraction for collaboration
    if (allText.includes('team') || allText.includes('collaborate') || allText.includes('work together')) {
      fallbackCompetencies.push({ label: 'Teamwork', evidence: 'You mentioned working with others.' });
    }
    if (allText.includes('communicate') || allText.includes('listening')) {
      fallbackCompetencies.push({ label: 'Communication', evidence: 'You discussed communication.' });
    }
    if (allText.includes('help') || allText.includes('support')) {
      fallbackCompetencies.push({ label: 'Helpfulness', evidence: 'You mentioned helping or supporting others.' });
    }
    if (allText.includes('stakeholder') || allText.includes('client')) {
      fallbackCompetencies.push({ label: 'Stakeholder Navigation', evidence: 'You discussed stakeholder or client work.' });
    }
    
    // Ensure at least one
    if (fallbackCompetencies.length === 0) {
      fallbackCompetencies.push({ 
        label: 'Collaboration', 
        evidence: 'You engaged thoughtfully in Compiled Summary.' 
      });
    }
    
    // Use fallback competencies
    if (fallbackCompetencies.length > 0) {
      activePillarCompetencies = fallbackCompetencies;
    }
  }
  
  const showNoData = !primaryPillar || activePillarCompetencies.length === 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Compiled Conversation Artifact
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
              Structured observations derived from a single conversation
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5 border-b border-neutral-200 dark:border-neutral-800">
            {[
              { id: 'breakdown' as const, label: 'Compiled Artifact' },
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
            {activeTab === 'breakdown' && (
              <motion.div
                key="breakdown"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-5"
              >
                {/* Visual: Active pillar bubble with competence bubbles */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 overflow-visible">
                  <div className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/30 dark:to-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700 overflow-visible">
                    {/* Subtle background pattern */}
                    <div className="absolute inset-0 opacity-5 dark:opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                      }} />
                    </div>

                    {/* Central: Compiled Artifact */}
                  {primaryPillar && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                      className="absolute z-20"
                    >
                      <div className="relative group">
                        {/* Outer glow rings - neutral/document color scheme */}
                        <motion.div 
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 opacity-40 blur-2xl -z-20"
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
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 opacity-30 blur-xl -z-10"
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

                        {/* Main circle - Compiled Artifact style */}
                        <div className="relative w-32 h-32 rounded-full shadow-2xl border-2 flex flex-col items-center justify-center p-3 transition-all bg-gradient-to-br from-slate-600 to-slate-800 border-white/90 shadow-lg">
                          <Layers 
                            className="w-7 h-7 mb-1.5 text-white" 
                            strokeWidth={2} 
                          />
                          
                          <p className="text-white text-base font-black text-center leading-tight px-1.5 drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)]">
                            Compiled
                              <span className="block text-sm font-extrabold leading-tight mt-1">
                              Artifact
                              </span>
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                    {/* Connection lines from center to competency badges */}
                    {!showNoData && (() => {
                      // Calculate safe radius to prevent overlaps - matching Competence Tree style
                      // Central circle: w-32 = 128px diameter = 64px radius
                      // Badge: w-32 h-32 = 128px diameter = 64px radius (larger for better text readability)
                      // Minimum gap: 25px
                      // Base radius: center radius (64) + gap (25) + badge half-width (64) = 153px
                      const centerRadius = 64; // Half of w-32 (128px)
                      const cardHalfWidth = 64; // Half of circular badge diameter (128px)
                      const minGap = 25;
                      const baseRadius = centerRadius + minGap + cardHalfWidth;
                      
                      // Adjust radius based on number of competencies to prevent badge-to-badge overlap
                      const numCompetencies = activePillarCompetencies.length;
                      const minAngle = (Math.PI * 2) / numCompetencies;
                      // For circular badges with 128px diameter, distance between badge centers must be >= 128px
                      // distance = 2 * radius * sin(minAngle/2) >= 128
                      // radius >= 128 / (2 * sin(minAngle/2))
                      const minRadiusForSpacing = numCompetencies > 1 
                        ? Math.max(baseRadius, 128 / (2 * Math.sin(minAngle / 2)) + 20)
                        : baseRadius;
                      
                      const radius = Math.max(minRadiusForSpacing, 175); // Minimum 175px for safety
                      
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

                    {/* Competence bubbles around center - matching Competence Tree style */}
                    {!showNoData && (() => {
                      // Use same radius calculation as connection lines
                      // Cards are circular badges: w-32 h-32 = 128px (64px radius) - larger for better text
                      const centerRadius = 80;
                      const cardHalfWidth = 64; // Half of circular badge diameter (128px)
                      const minGap = 25;
                      const baseRadius = centerRadius + minGap + cardHalfWidth;
                      const numCompetencies = activePillarCompetencies.length;
                      const minAngle = (Math.PI * 2) / numCompetencies;
                      // For circular badges with 128px diameter, need spacing >= 128px
                      const minRadiusForSpacing = numCompetencies > 1 
                        ? Math.max(baseRadius, 128 / (2 * Math.sin(minAngle / 2)) + 20)
                        : baseRadius;
                      const radius = Math.max(minRadiusForSpacing, 175);
                      
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
                          className="absolute z-40 group"
                          style={{ 
                            transform: 'translate(-50%, -50%)',
                            zIndex: 40
                          }}
                          whileHover={{ 
                            scale: 1.1,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.zIndex = '100';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.zIndex = '40';
                          }}
                        >
                          {/* Glow effect on hover - matching pillar style */}
                          {primaryPillar && (
                            <motion.div
                              className={`absolute inset-0 rounded-full bg-gradient-to-br ${primaryPillar.color} opacity-0 group-hover:opacity-60 blur-xl -z-10`}
                              animate={{}}
                              transition={{ duration: 0.3 }}
                            />
                          )}
                          
                          {/* Small circular badge matching pillar style - larger for better text readability */}
                          <div className={`relative w-32 h-32 rounded-full shadow-2xl border-2 flex flex-col items-center justify-center p-3 transition-all ${
                            primaryPillar 
                              ? `bg-gradient-to-br ${primaryPillar.color} border-white/90 shadow-lg group-hover:shadow-xl`
                              : 'bg-white dark:bg-neutral-800 border-primary-300/50 dark:border-primary-600/50'
                          }`}>
                            {/* Competency label - maximum readability with larger size */}
                            <p className="text-base font-black text-white text-center leading-tight drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] px-1">
                              {comp.label.split(' ').slice(0, 2).join(' ')}
                              {comp.label.split(' ').length > 2 && (
                                <span className="block text-sm font-extrabold leading-tight mt-1">
                                  {comp.label.split(' ').slice(2).join(' ')}
                                </span>
                              )}
                            </p>
                            
                            {/* Evidence text - shown as tooltip on hover above the badge */}
                            {comp.evidence && (
                              <div 
                                className="absolute opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-[99999]"
                                style={{ 
                                  bottom: 'calc(100% + 16px)',
                                  left: '50%',
                                  transform: 'translateX(-50%)',
                                  zIndex: 99999
                                }}
                              >
                                <div className="bg-neutral-950 dark:bg-neutral-950 text-white dark:text-white rounded-lg p-3 shadow-2xl border border-primary-400/60 w-56 max-w-[260px] pointer-events-auto relative">
                                  {/* Competency label in tooltip */}
                                  <p className="font-bold mb-1.5 text-sm text-primary-200 dark:text-primary-300 leading-tight break-words">
                                    {comp.label}
                                  </p>
                                  {/* Evidence text */}
                                  <p className="text-xs font-normal leading-relaxed text-neutral-200 dark:text-neutral-200 whitespace-normal break-words">
                                    {comp.evidence}
                                  </p>
                                  {/* Tooltip arrow pointing down to badge */}
                                  <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-neutral-950 dark:bg-neutral-950 border-b border-r border-primary-400/60 rotate-45"></div>
                                </div>
                              </div>
                            )}
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

              </motion.div>
            )}

            {activeTab === 'conversation' && (
              <motion.div
                key="conversation"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-5"
              >
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-5 flex items-center gap-3">
                    <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    Your Conversation Journey
                  </h2>
                  
                  <div className="space-y-4">
                    {conversationHistory.map((entry, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative pl-8 border-l-2 border-primary-200 dark:border-primary-800"
                      >
                        <div className="absolute left-0 top-0 w-4 h-4 bg-primary-500 rounded-full -translate-x-[9px]" />
                        
                        <div className="space-y-4">
                          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-6">
                            <p className="text-base font-extrabold text-primary-600 dark:text-primary-400 mb-3">
                              Question {idx + 1}
                            </p>
                            <p className="text-lg text-neutral-900 dark:text-neutral-100 leading-relaxed font-medium">
                              {entry.question}
                            </p>
                          </div>
                          
                          <div className="bg-primary-50 dark:bg-primary-950/20 rounded-xl p-6">
                            <p className="text-base font-extrabold text-neutral-800 dark:text-neutral-200 mb-3">
                              Your Answer
                            </p>
                            <p className="text-lg text-neutral-900 dark:text-neutral-100 italic leading-relaxed font-medium">
                              "{entry.answer}"
                            </p>
                          </div>
                          
                          {entry.competencies.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {entry.competencies.map((comp, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="text-base px-5 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full font-bold"
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
              aria-label="Start a new conversation"
            >
              Try Again
            </motion.button>
            <motion.button
              onClick={() => router.push('/waitlist')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all font-medium shadow-sm flex items-center gap-2"
              aria-label="Join the early access list for early access"
            >
              Join early access list
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>

    </div>
  );
}
