import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Copy, Search } from 'lucide-react';
import toast from 'react-hot-toast';

interface TranscriptViewProps {
  transcript: string;
}

const TranscriptView: React.FC<TranscriptViewProps> = ({ transcript }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      toast.success('Transcript copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy transcript');
    }
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const displayTranscript = isExpanded ? transcript : transcript.slice(0, 800) + '...';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Full Transcript
          </h2>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <Copy className="h-5 w-5" />
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search in transcript..."
          className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
        />
      </div>

      {/* Transcript Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-sm bg-slate-50 dark:bg-slate-900 rounded-lg p-4 max-h-96 overflow-y-auto">
          {highlightText(displayTranscript, searchTerm)}
        </div>
      </div>

      {transcript.length > 800 && (
        <div className="mt-4 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
          >
            {isExpanded ? 'Show Less' : 'Show Full Transcript'}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default TranscriptView;