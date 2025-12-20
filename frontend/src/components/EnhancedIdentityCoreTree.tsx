'use client';

/**
 * Enhanced Identity Core Tree Visualization
 * Shows clear connection between conversation and tree nodes
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Users, 
  Zap, 
  Target,
  Heart,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import type { ConversationHistory } from '@/lib/conversationResults';

interface CompetenceNode {
  id: string;
  label: string;
  icon: typeof Brain;
  color: string;
  competenceMatches: string[];
  position: { x: number; y: number };
}

interface EnhancedIdentityCoreTreeProps {
  competencies: string[];
  conversationHistory: ConversationHistory[];
}

// Map competencies to tree nodes - matching actual competency names from results
const competenceNodeMapping: Record<string, string[]> = {
  'values': [
    'values-driven', 'values driven', 'purpose', 'integrity', 'independence', 'autonomy',
    'Values-driven', 'Purpose', 'Integrity', 'Independence', 'Autonomy'
  ],
  'strengths': [
    'strategic-thinking', 'strategic thinking', 'Strategic Thinking', 'pattern-recognition', 'pattern recognition', 'Pattern Recognition',
    'analytical', 'Analytical', 'innovation', 'Innovation', 'problem-solving', 'problem solving', 'Problem-solving', 'Problem-solving',
    'creativity', 'Creativity', 'initiative', 'Initiative', 'leadership', 'Leadership'
  ],
  'social': [
    'collaboration', 'Collaboration', 'interpersonal', 'Interpersonal', 'empathy', 'Empathy',
    'teamwork', 'Teamwork', 'helpfulness', 'Helpfulness', 'emotional-intelligence', 'emotional intelligence',
    'Emotional Intelligence', 'support', 'Support'
  ],
  'cognitive': [
    'analytical', 'Analytical', 'strategic-thinking', 'strategic thinking', 'Strategic Thinking',
    'pattern-recognition', 'pattern recognition', 'Pattern Recognition', 'problem-solving', 'problem solving',
    'Problem-solving', 'planning', 'Planning', 'organization', 'Organization', 'structure', 'Structure'
  ],
  'motivations': [
    'goal-driven', 'goal driven', 'Goal-driven', 'impact-driven', 'impact driven', 'Impact-driven',
    'motivation', 'Motivation', 'purpose', 'Purpose', 'execution', 'Execution', 'execution style', 'Execution Style',
    'results-oriented', 'results oriented', 'Results-oriented', 'Results-oriented'
  ],
};

const competenceNodes: Omit<CompetenceNode, 'competenceMatches'>[] = [
  {
    id: 'values',
    label: 'Values',
    icon: Heart,
    color: 'from-yellow-400 to-orange-500',
    position: { x: 0, y: -140 },
  },
  {
    id: 'strengths',
    label: 'Strengths',
    icon: Sparkles,
    color: 'from-orange-500 to-red-500',
    position: { x: 120, y: -90 },
  },
  {
    id: 'social',
    label: 'Social Style',
    icon: Users,
    color: 'from-purple-500 to-blue-500',
    position: { x: 140, y: 80 },
  },
  {
    id: 'cognitive',
    label: 'Cognitive Style',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    position: { x: 0, y: 140 },
  },
  {
    id: 'motivations',
    label: 'Motivations',
    icon: Zap,
    color: 'from-teal-500 to-green-500',
    position: { x: -140, y: 80 },
  },
];

// Helper function to normalize strings for comparison
const normalizeCompetence = (str: string) => str.toLowerCase().replace(/[\s-]/g, '');

export function EnhancedIdentityCoreTree({ 
  competencies, 
  conversationHistory 
}: EnhancedIdentityCoreTreeProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Map competencies to nodes and find conversation evidence
  const activeNodes = competenceNodes.map(node => {
    const nodeCompetencies = competenceNodeMapping[node.id] || [];
    
    const matchedCompetencies = competencies.filter(comp => {
      const normalizedComp = normalizeCompetence(comp);
      return nodeCompetencies.some(match => {
        const normalizedMatch = normalizeCompetence(match);
        return normalizedComp === normalizedMatch || 
               normalizedComp.includes(normalizedMatch) ||
               normalizedMatch.includes(normalizedComp);
      });
    });
    const isActive = matchedCompetencies.length > 0;

    // Find conversation evidence for this node
    const evidence = conversationHistory
      .filter(entry => {
        return entry.competencies.some(comp => {
          const normalizedComp = normalizeCompetence(comp);
          return nodeCompetencies.some(match => {
            const normalizedMatch = normalizeCompetence(match);
            return normalizedComp === normalizedMatch ||
                   normalizedComp.includes(normalizedMatch) ||
                   normalizedMatch.includes(normalizedComp);
          });
        });
      })
      .map(entry => ({
        question: entry.question,
        answer: entry.answer,
        competencies: entry.competencies.filter(comp => {
          const normalizedComp = normalizeCompetence(comp);
          return nodeCompetencies.some(match => {
            const normalizedMatch = normalizeCompetence(match);
            return normalizedComp === normalizedMatch ||
                   normalizedComp.includes(normalizedMatch) ||
                   normalizedMatch.includes(normalizedComp);
          });
        }),
      }));

    return {
      ...node,
      isActive,
      matchedCompetencies,
      evidence,
    };
  });

  const selectedNodeData = activeNodes.find(n => n.id === selectedNode);

  return (
    <div className="relative w-full">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Tree Visualization */}
        <div className="flex-1 relative h-[600px] flex items-center justify-center bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
          {/* Background glow dots */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl">
            {[...Array(15)].map((_, i) => {
              const angle = (i / 15) * Math.PI * 2;
              const radius = 180 + Math.random() * 80;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;
              const colorClasses = ['bg-yellow-400', 'bg-orange-400', 'bg-blue-400', 'bg-teal-400'];
              const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
              
              return (
                <motion.div
                  key={i}
                  className={`absolute w-1 h-1 ${colorClass} rounded-full opacity-40`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                  animate={{
                    opacity: [0.2, 0.6, 0.2],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              );
            })}
          </div>

          {/* Central Identity Core */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute z-20"
          >
            <div className="relative w-36 h-36 md:w-40 md:h-40">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-400/40 via-accent-400/40 to-primary-400/40 rounded-full blur-xl animate-pulse" />
              
              {/* Main core */}
              <div className="relative w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 rounded-full shadow-2xl border-2 border-neutral-600/50 dark:border-neutral-700/50 flex items-center justify-center">
                <div className="text-center px-4">
                  <p className="text-white text-sm md:text-base font-semibold leading-tight">
                    Your Identity
                  </p>
                  <p className="text-white text-sm md:text-base font-semibold leading-tight">
                    Core
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Radiating Competence Nodes */}
          {activeNodes.map((node, index) => {
            const Icon = node.icon;
            const isActive = node.isActive;
            const isSelected = selectedNode === node.id;
            
            return (
              <motion.div
                key={node.id}
                initial={{ 
                  x: 0, 
                  y: 0, 
                  opacity: 0,
                  scale: 0 
                }}
                animate={{ 
                  x: node.position.x, 
                  y: node.position.y,
                  opacity: isActive ? 1 : 0.3,
                  scale: isActive ? (isSelected ? 1.1 : 1) : 0.7
                }}
                transition={{ 
                  delay: index * 0.1 + 0.3,
                  duration: 0.6,
                  ease: 'easeOut'
                }}
                className="absolute z-10 cursor-pointer"
                style={{
                  transform: `translate(-50%, -50%)`,
                }}
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
              >
                {/* Connection line */}
                <svg
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    width: Math.abs(node.position.x) + 70,
                    height: Math.abs(node.position.y) + 70,
                    transform: `translate(-50%, -50%) rotate(${Math.atan2(node.position.y, node.position.x) * (180 / Math.PI)}deg)`,
                    transformOrigin: 'center',
                  }}
                >
                  <line
                    x1="50%"
                    y1="50%"
                    x2={node.position.x > 0 ? '100%' : '0%'}
                    y2={node.position.y > 0 ? '100%' : '0%'}
                    stroke={isActive ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.2)'}
                    strokeWidth={isActive ? '2' : '1'}
                    strokeDasharray={isActive ? '0' : '4'}
                  />
                </svg>

                {/* Node */}
                <div className="relative w-28 h-28 md:w-32 md:h-32">
                  {/* Glow for active nodes */}
                  {isActive && (
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${node.color} rounded-full blur-xl opacity-60`}
                      animate={{
                        opacity: isSelected ? [0.6, 0.9, 0.6] : [0.4, 0.7, 0.4],
                        scale: isSelected ? [1, 1.2, 1] : [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  )}
                  
                  {/* Main node circle */}
                  <div className={`relative w-full h-full bg-gradient-to-br ${node.color} rounded-full shadow-lg border-2 ${isActive ? (isSelected ? 'border-white ring-4 ring-white/30' : 'border-white/60') : 'border-white/20'} flex flex-col items-center justify-center p-3 transition-all`}>
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-white mb-1.5" strokeWidth={2} />
                    <p className="text-white text-xs md:text-sm font-semibold text-center leading-tight">
                      {node.label}
                    </p>
                  </div>

                  {/* Competency badges for active nodes */}
                  {isActive && node.matchedCompetencies.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 + 0.6 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 flex flex-wrap gap-1 justify-center max-w-[140px]"
                    >
                      {node.matchedCompetencies.slice(0, 2).map((comp, idx) => (
                        <div
                          key={idx}
                          className="bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-md px-2 py-0.5 text-xs text-neutral-700 dark:text-neutral-300 whitespace-nowrap shadow-sm font-medium"
                        >
                          {comp}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Conversation Evidence Panel */}
        <div className="lg:w-96 flex-shrink-0">
          {selectedNodeData && selectedNodeData.isActive && selectedNodeData.evidence.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft border border-neutral-200/50 dark:border-neutral-700/50 h-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedNodeData.color}`}>
                  <selectedNodeData.icon className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {selectedNodeData.label}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    From your conversation
                  </p>
                </div>
              </div>

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {selectedNodeData.evidence.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200/50 dark:border-neutral-700/50"
                  >
                    <p className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-1">
                      Ary asked:
                    </p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 mb-3">
                      {item.question}
                    </p>
                    <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      You said:
                    </p>
                    <p className="text-sm text-neutral-800 dark:text-neutral-200 mb-3 italic">
                      "{item.answer}"
                    </p>
                    {item.competencies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.competencies.map((comp, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-xs px-2 py-0.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md"
                          >
                            {comp}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-soft border border-neutral-200/50 dark:border-neutral-700/50 h-full flex items-center justify-center"
            >
              <div className="text-center">
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                  Click on a node to see
                </p>
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  how your conversation revealed it
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Summary of connection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl"
      >
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <span className="font-semibold">How this works:</span> Each node represents patterns identified from your conversation. 
          Click any highlighted node to see the specific questions and answers that revealed those competencies.
        </p>
      </motion.div>
    </div>
  );
}

