'use client';

/**
 * Redesigned Competence Tree View
 * Clear connection between conversation and tree with better UX
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Brain, Users, Zap, Heart, Sparkles,
  MessageSquare, ChevronRight, ArrowRight,
  Target, TrendingUp
} from 'lucide-react';
import type { ConversationResult, ConversationHistory } from '@/lib/conversationResults';

export function RedesignedCompetenceTreeView() {
  const router = useRouter();
  const [conversationResult, setConversationResult] = useState<ConversationResult | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'conversation' | 'tree'>('overview');

  useEffect(() => {
    const storedResult = sessionStorage.getItem('conversationResult');
    const storedHistory = sessionStorage.getItem('conversationHistory');
    
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
  }, []);

  const result: ConversationResult = conversationResult || {
    id: 'default',
    title: 'Reflective Thinker',
    summary: "You demonstrate thoughtful reflection and self-awareness.",
    competencies: ['Self-awareness', 'Reflection'],
    detailedEvaluation: "Based on your conversation, you show a thoughtful and reflective approach.",
    matchingPatterns: {
      questionIds: [],
      keywordPatterns: [],
      competencePatterns: [],
    },
  };

  // Map competencies to tree nodes - Based on actual conversation patterns
  const treeNodes = [
    { 
      id: 'execution', 
      label: 'Execution & Delivery', 
      icon: Target, 
      color: 'from-blue-500 to-cyan-500', 
      competencies: ['Execution', 'Execution Style', 'Goal-driven', 'Results-oriented', 'Planning', 'Organization', 'Structure', 'Initiative', 'Resilience'] 
    },
    { 
      id: 'collaboration', 
      label: 'Connection & Collaboration', 
      icon: Users, 
      color: 'from-purple-500 to-pink-500', 
      competencies: ['Collaboration', 'Interpersonal', 'Empathy', 'Teamwork', 'Helpfulness', 'Leadership', 'Support', 'Emotional Intelligence'] 
    },
    { 
      id: 'thinking', 
      label: 'Thinking & Problem-Solving', 
      icon: Brain, 
      color: 'from-indigo-500 to-purple-500', 
      competencies: ['Strategic Thinking', 'Pattern Recognition', 'Analytical', 'Problem-solving', 'Innovation', 'Creativity'] 
    },
    { 
      id: 'growth', 
      label: 'Self-Awareness & Growth', 
      icon: TrendingUp, 
      color: 'from-teal-500 to-green-500', 
      competencies: ['Self-awareness', 'Reflection', 'Learning', 'Growth-mindset', 'Emotional Intelligence', 'Openness', 'Curiosity', 'Adaptability'] 
    },
    { 
      id: 'purpose', 
      label: 'Purpose & Impact', 
      icon: Heart, 
      color: 'from-orange-500 to-red-500', 
      competencies: ['Purpose', 'Values-driven', 'Impact-driven', 'Motivation', 'Goal-driven'] 
    },
  ];

  const normalize = (str: string) => str.toLowerCase().replace(/[\s-]/g, '');
  
  const activeNodes = treeNodes.map(node => {
    const matched = result.competencies.filter(comp =>
      node.competencies.some(nodeComp => 
        normalize(comp) === normalize(nodeComp) ||
        normalize(comp).includes(normalize(nodeComp)) ||
        normalize(nodeComp).includes(normalize(comp))
      )
    );
    
    const evidence = conversationHistory.filter(entry =>
      entry.competencies.some(comp =>
        node.competencies.some(nodeComp =>
          normalize(comp) === normalize(nodeComp) ||
          normalize(comp).includes(normalize(nodeComp)) ||
          normalize(nodeComp).includes(normalize(comp))
        )
      )
    );

    return {
      ...node,
      isActive: matched.length > 0,
      matchedCompetencies: matched,
      evidence,
    };
  });

  const selectedNodeData = activeNodes.find(n => n.id === selectedNode);

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
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-neutral-200 dark:border-neutral-800">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'conversation', label: 'Your Conversation' },
              { id: 'tree', label: 'Competence Tree' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Summary Card */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    Summary
                  </h2>
                  <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
                    {result.summary}
                  </p>
                  
                  {result.detailedEvaluation && (
                    <div className="p-5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50">
                      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {result.detailedEvaluation}
                      </p>
                    </div>
                  )}
                </div>

                {/* Competencies Grid */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                    Your Competencies
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {result.competencies.map((comp, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/30 dark:to-primary-900/20 rounded-xl border border-primary-200/50 dark:border-primary-800/50"
                      >
                        <p className="font-semibold text-primary-700 dark:text-primary-300 text-center">
                          {comp}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {conversationHistory.length}
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400">
                      Questions Answered
                    </div>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {result.competencies.length}
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400">
                      Competencies Identified
                    </div>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 rounded-xl p-6 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                      {activeNodes.filter(n => n.isActive).length}
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-400">
                      Active Tree Nodes
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

            {activeTab === 'tree' && (
              <motion.div
                key="tree"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-3 gap-6"
              >
                {/* Tree Visualization */}
                <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      Your Competence Tree
                    </h2>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Click on any node to see evidence from your conversation. {activeNodes.filter(n => n.isActive).length} of {activeNodes.length} nodes are active.
                    </p>
                  </div>
                  
                  <div className="relative h-[550px] flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800/30 dark:to-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
                    {/* Background decorative dots - only for active nodes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {activeNodes
                        .filter(node => node.isActive)
                        .map((node, i) => {
                          const angle = (i / activeNodes.filter(n => n.isActive).length) * Math.PI * 2 - Math.PI / 2;
                          const radius = 180;
                          const x = Math.cos(angle) * radius;
                          const y = Math.sin(angle) * radius;
                          const colorMap: Record<string, string> = {
                            'execution': 'bg-blue-400/20',
                            'collaboration': 'bg-purple-400/20',
                            'thinking': 'bg-indigo-400/20',
                            'growth': 'bg-teal-400/20',
                            'purpose': 'bg-orange-400/20',
                          };
                          return (
                            <motion.div
                              key={node.id}
                              className={`absolute w-3 h-3 ${colorMap[node.id] || 'bg-neutral-400/20'} rounded-full blur-md`}
                              style={{
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                              }}
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.3,
                              }}
                            />
                          );
                        })}
                    </div>

                    {/* Central Core */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="absolute z-20"
                    >
                      <div className="relative w-36 h-36 bg-gradient-to-br from-neutral-700 to-neutral-800 dark:from-neutral-800 dark:to-neutral-900 rounded-full shadow-2xl border-4 border-white/30 flex items-center justify-center">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-xl animate-pulse" />
                        
                        <div className="text-center relative z-10">
                          <p className="text-white text-base font-bold leading-tight">Identity</p>
                          <p className="text-white text-base font-bold leading-tight">Core</p>
                        </div>
                      </div>
                    </motion.div>

                    {/* Nodes */}
                    {activeNodes.map((node, idx) => {
                      const Icon = node.icon;
                      const angle = (idx / activeNodes.length) * Math.PI * 2 - Math.PI / 2;
                      const radius = 180;
                      const x = Math.cos(angle) * radius;
                      const y = Math.sin(angle) * radius;

                      return (
                        <motion.div
                          key={node.id}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ 
                            scale: node.isActive ? (selectedNode === node.id ? 1.15 : 1) : 0.85,
                            opacity: 1,
                            x,
                            y,
                          }}
                          transition={{ delay: idx * 0.1, type: "spring", stiffness: 200 }}
                          className="absolute cursor-pointer z-10"
                          style={{ transform: 'translate(-50%, -50%)' }}
                          onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                        >
                          {/* Node with enhanced glow for active nodes */}
                          <div className={`relative w-28 h-28 rounded-full shadow-2xl border-2 flex flex-col items-center justify-center p-3 transition-all ${
                            node.isActive
                              ? `bg-gradient-to-br ${node.color} ${selectedNode === node.id ? 'border-white ring-4 ring-white/40 ring-offset-2 ring-offset-white/20 shadow-2xl' : 'border-white/90 shadow-lg'}`
                              : 'bg-gradient-to-br from-neutral-400 to-neutral-500 border-neutral-300/60 shadow-md opacity-60'
                          }`}>
                            {/* Glow effect for active nodes */}
                            {node.isActive && (
                              <motion.div
                                className={`absolute inset-0 rounded-full bg-gradient-to-br ${node.color} opacity-60 blur-xl -z-10`}
                                animate={{
                                  opacity: selectedNode === node.id ? [0.6, 0.8, 0.6] : [0.4, 0.6, 0.4],
                                  scale: [1, 1.2, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                  ease: "easeInOut",
                                }}
                              />
                            )}
                            
                            {/* Icon - always visible with good contrast */}
                            <Icon 
                              className={`w-7 h-7 mb-1.5 ${node.isActive ? 'text-white' : 'text-white/90'}`} 
                              strokeWidth={node.isActive ? 2 : 2.5} 
                            />
                            
                            {/* Label - always readable */}
                            <p className={`text-xs font-semibold text-center leading-tight ${
                              node.isActive ? 'text-white' : 'text-white drop-shadow-md'
                            }`}>
                              {node.label}
                            </p>
                            
                            {/* Badge showing matched competencies count */}
                            {node.isActive && node.matchedCompetencies.length > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-primary-200"
                              >
                                <span className="text-xs font-bold text-primary-600">
                                  {node.matchedCompetencies.length}
                                </span>
                              </motion.div>
                            )}
                            
                            {/* Tooltip indicator for inactive nodes */}
                            {!node.isActive && (
                              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-neutral-800/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Not detected in conversation
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Evidence Panel */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg border border-neutral-200/50 dark:border-neutral-700/50 sticky top-6">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                    Evidence
                  </h3>
                  
                  {selectedNodeData && selectedNodeData.isActive && selectedNodeData.evidence.length > 0 ? (
                    <>
                      <div className="flex items-center gap-3 mb-4 p-3 bg-gradient-to-r from-primary-50 to-primary-100/50 dark:from-primary-950/30 dark:to-primary-900/20 rounded-lg border border-primary-200/50 dark:border-primary-800/50">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedNodeData.color} shadow-md`}>
                          <selectedNodeData.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                            {selectedNodeData.label}
                          </h4>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {selectedNodeData.evidence.length} conversation{selectedNodeData.evidence.length !== 1 ? 's' : ''} • {selectedNodeData.matchedCompetencies.length} competenc{selectedNodeData.matchedCompetencies.length !== 1 ? 'ies' : 'y'}
                          </p>
                        </div>
                      </div>

                      {/* Matched Competencies */}
                      {selectedNodeData.matchedCompetencies.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wide">
                            Detected Competencies:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedNodeData.matchedCompetencies.map((comp, cIdx) => (
                              <span
                                key={cIdx}
                                className="text-xs px-2.5 py-1 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-md font-medium"
                              >
                                {comp}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {selectedNodeData.evidence.map((item, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-200/50 dark:border-neutral-700/50 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                          >
                            <div className="flex items-start gap-2 mb-2">
                              <span className="text-xs font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-2 py-0.5 rounded">
                                Q{idx + 1}
                              </span>
                              <p className="text-xs font-medium text-primary-600 dark:text-primary-400 flex-1">
                                {item.question}
                              </p>
                            </div>
                            <p className="text-xs text-neutral-700 dark:text-neutral-300 italic mb-3 pl-4 border-l-2 border-primary-200 dark:border-primary-800">
                              "{item.answer}"
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {item.competencies.map((comp, cIdx) => (
                                <span
                                  key={cIdx}
                                  className="text-xs px-2 py-0.5 bg-primary-50 dark:bg-primary-950/30 text-primary-700 dark:text-primary-300 rounded font-medium"
                                >
                                  {comp}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  ) : selectedNodeData && !selectedNodeData.isActive ? (
                    <div className="text-center py-12 px-4">
                      <div className={`inline-flex p-4 rounded-full bg-gradient-to-br ${selectedNodeData.color} opacity-50 mb-4`}>
                        <selectedNodeData.icon className="w-8 h-8 text-white/80" />
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">
                        {selectedNodeData.label}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        This aspect wasn't detected in your conversation. Try answering more questions about {selectedNodeData.label.toLowerCase()} in your next session.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4">
                      <div className="inline-flex p-4 rounded-full bg-neutral-200 dark:bg-neutral-700 mb-4">
                        <Brain className="w-8 h-8 text-neutral-400" />
                      </div>
                      <p className="text-neutral-700 dark:text-neutral-300 font-medium mb-2">
                        Select a node
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Click on any node in the tree to see evidence from your conversation and discover which answers revealed each competency.
                      </p>
                    </div>
                  )}
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
    </div>
  );
}

