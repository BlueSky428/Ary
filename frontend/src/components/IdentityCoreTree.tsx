'use client';

/**
 * Identity Core Tree Visualization
 * Central node with radiating competence nodes matching client design
 */

import { motion } from 'framer-motion';
import { 
  Brain, 
  Users, 
  Zap, 
  Target,
  Heart,
  Sparkles
} from 'lucide-react';

interface CompetenceNode {
  id: string;
  label: string;
  icon: typeof Brain;
  color: string;
  keywords: string[];
  position: { x: number; y: number };
}

interface IdentityCoreTreeProps {
  competencies: string[];
  conversationPath?: any[];
}

const competenceNodes: CompetenceNode[] = [
  {
    id: 'values',
    label: 'Values',
    icon: Heart,
    color: 'from-yellow-400 to-orange-500',
    keywords: ['work-life balance', 'independence', 'integrity'],
    position: { x: 0, y: -120 }, // Top
  },
  {
    id: 'strengths',
    label: 'Strengths',
    icon: Sparkles,
    color: 'from-orange-500 to-red-500',
    keywords: ['impact', 'strategic thinking', 'pattern recognition'],
    position: { x: 100, y: -80 }, // Top right
  },
  {
    id: 'social',
    label: 'Social Style',
    icon: Users,
    color: 'from-purple-500 to-blue-500',
    keywords: ['teamwork', 'persuasion', 'empathy'],
    position: { x: 120, y: 60 }, // Bottom right
  },
  {
    id: 'cognitive',
    label: 'Cognitive Style',
    icon: Brain,
    color: 'from-blue-500 to-cyan-500',
    keywords: ['detail-oriented', 'learn through doing', 'analytical'],
    position: { x: 0, y: 120 }, // Bottom center
  },
  {
    id: 'motivations',
    label: 'Motivations',
    icon: Zap,
    color: 'from-teal-500 to-green-500',
    keywords: ['impact', 'planning', 'helping others'],
    position: { x: -120, y: 60 }, // Bottom left
  },
];

export function IdentityCoreTree({ competencies, conversationPath }: IdentityCoreTreeProps) {
  // Map competencies to nodes based on keywords
  const activeNodes = competenceNodes.map(node => {
    const isActive = node.keywords.some(keyword => 
      competencies.some(comp => 
        comp.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(comp.toLowerCase())
      )
    );
    return { ...node, isActive };
  });

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Background glow dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const radius = 200 + Math.random() * 100;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const colorClasses = ['bg-yellow-400', 'bg-orange-400', 'bg-blue-400', 'bg-teal-400'];
          const colorClass = colorClasses[Math.floor(Math.random() * colorClasses.length)];
          
          return (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 ${colorClass} rounded-full opacity-60`}
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
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
        <div className="relative w-32 h-32 md:w-40 md:h-40">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400/40 via-accent-400/40 to-primary-400/40 rounded-full blur-xl animate-pulse" />
          
          {/* Main core */}
          <div className="relative w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 rounded-full shadow-2xl border-2 border-neutral-600/50 dark:border-neutral-700/50 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="text-white text-xs md:text-sm font-semibold leading-tight">
                Your Identity
              </p>
              <p className="text-white text-xs md:text-sm font-semibold leading-tight">
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
              opacity: isActive ? 1 : 0.4,
              scale: isActive ? 1 : 0.8
            }}
            transition={{ 
              delay: index * 0.1 + 0.3,
              duration: 0.6,
              ease: 'easeOut'
            }}
            className="absolute z-10"
            style={{
              transform: `translate(-50%, -50%)`,
            }}
          >
            {/* Connection line */}
            <svg
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                width: Math.abs(node.position.x) + 60,
                height: Math.abs(node.position.y) + 60,
                transform: `translate(-50%, -50%) rotate(${Math.atan2(node.position.y, node.position.x) * (180 / Math.PI)}deg)`,
                transformOrigin: 'center',
              }}
            >
              <line
                x1="50%"
                y1="50%"
                x2={node.position.x > 0 ? '100%' : '0%'}
                y2={node.position.y > 0 ? '100%' : '0%'}
                stroke="rgba(255, 255, 255, 0.3)"
                strokeWidth="1"
                strokeDasharray={isActive ? '0' : '4'}
              />
            </svg>

            {/* Node */}
            <div className={`relative w-24 h-24 md:w-28 md:h-28 ${isActive ? 'cursor-pointer' : ''}`}>
              {/* Glow for active nodes */}
              {isActive && (
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${node.color} rounded-full blur-lg opacity-60`}
                  animate={{
                    opacity: [0.4, 0.7, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
              
              {/* Main node circle */}
              <div className={`relative w-full h-full bg-gradient-to-br ${node.color} rounded-full shadow-lg border-2 ${isActive ? 'border-white/50' : 'border-white/20'} flex flex-col items-center justify-center p-3`}>
                <Icon className="w-6 h-6 md:w-7 md:h-7 text-white mb-1" strokeWidth={2} />
                <p className="text-white text-xs font-semibold text-center leading-tight">
                  {node.label}
                </p>
              </div>

              {/* Keywords for active nodes */}
              {isActive && node.keywords.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 space-y-1"
                >
                  {node.keywords.slice(0, 2).map((keyword, idx) => (
                    <div
                      key={idx}
                      className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-neutral-700 dark:text-neutral-300 whitespace-nowrap shadow-sm"
                    >
                      {keyword}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

