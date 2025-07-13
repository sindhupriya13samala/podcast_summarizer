import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface SummaryCardProps {
  summary: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      toast.success('Summary copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy summary');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            TL;DR Summary
          </h2>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="p-2 rounded-lg bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Copy className="h-5 w-5" />
        </motion.button>
      </div>
      
      <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        {summary}
      </p>
    </motion.div>
  );
};

export default SummaryCard;