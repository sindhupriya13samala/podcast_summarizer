import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Share2, Copy, MessageCircle } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import TopicTimeline from '../components/TopicTimeline';
import TranscriptView from '../components/TranscriptView';
import toast from 'react-hot-toast';

interface SharedAnalysis {
  id: string;
  title: string;
  duration: string;
  transcript: string;
  summary: string;
  topics: Array<{
    title: string;
    timestamp: string;
    description: string;
  }>;
  sharedBy: string;
  sharedDate: string;
}

const SharePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<SharedAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data fetch - in real app, this would fetch from Firebase
    setTimeout(() => {
      setAnalysis({
        id: id || '',
        title: 'The Future of AI in Technology',
        duration: '28:45',
        sharedBy: 'John Doe',
        sharedDate: '2025-01-15',
        transcript: `Welcome to today's episode where we dive deep into the fascinating world of artificial intelligence and its transformative impact on modern technology.

[00:00:30] Our conversation begins with the fundamental question: what exactly is artificial intelligence? AI, in its simplest form, is the simulation of human intelligence in machines that are programmed to think and learn like humans.

[00:02:15] We're seeing remarkable advances in machine learning algorithms that can process vast amounts of data and identify patterns that would be impossible for humans to detect manually.

[00:05:45] The healthcare industry is experiencing a revolution thanks to AI-powered diagnostic tools that can analyze medical images with unprecedented accuracy.

[00:09:20] In the automotive sector, self-driving cars are no longer a distant dream but a rapidly approaching reality that will fundamentally change how we think about transportation.

[00:13:10] The ethical implications of AI development cannot be ignored. As we create more sophisticated systems, we must carefully consider issues of privacy, bias, and accountability.

[00:18:30] Looking toward the future, we can expect to see AI integration in virtually every aspect of our daily lives, from smart homes to personalized education.

[00:24:15] The key to successful AI implementation lies in finding the right balance between automation and human oversight, ensuring that technology serves humanity rather than replacing it.`,
        summary: `This episode explores the transformative impact of artificial intelligence on modern technology across multiple industries. The discussion covers AI fundamentals, highlighting how machine learning algorithms can process vast datasets and identify complex patterns beyond human capability. Key applications include revolutionary diagnostic tools in healthcare that analyze medical images with unprecedented accuracy, and the automotive industry's rapid progress toward self-driving vehicles. The conversation emphasizes the critical importance of addressing ethical considerations around privacy, bias, and accountability in AI development. Looking forward, the episode predicts AI integration across all aspects of daily life while stressing the need for balanced implementation that maintains human oversight and ensures technology serves humanity's best interests.`,
        topics: [
          {
            title: 'Introduction to AI',
            timestamp: '00:00:30',
            description: 'Fundamental concepts and definitions of artificial intelligence'
          },
          {
            title: 'Machine Learning Advances',
            timestamp: '00:02:15',
            description: 'Latest developments in ML algorithms and pattern recognition'
          },
          {
            title: 'AI in Healthcare',
            timestamp: '00:05:45',
            description: 'Revolutionary diagnostic tools and medical image analysis'
          },
          {
            title: 'Autonomous Vehicles',
            timestamp: '00:09:20',
            description: 'Self-driving cars and transportation transformation'
          },
          {
            title: 'AI Ethics',
            timestamp: '00:13:10',
            description: 'Privacy, bias, and accountability considerations'
          },
          {
            title: 'Future Integration',
            timestamp: '00:18:30',
            description: 'AI in smart homes and personalized education'
          },
          {
            title: 'Human-AI Balance',
            timestamp: '00:24:15',
            description: 'Maintaining human oversight in automated systems'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this podcast summary: "${analysis?.title}"`;
    
    switch (platform) {
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`);
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading shared analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Analysis not found
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            This shared analysis may have been removed or the link is invalid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {analysis.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-slate-600 dark:text-slate-400">
            <span>Duration: {analysis.duration}</span>
            <span>•</span>
            <span>Shared by {analysis.sharedBy}</span>
            <span>•</span>
            <span>{new Date(analysis.sharedDate).toLocaleDateString()}</span>
          </div>
        </motion.div>

        {/* Share Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center space-x-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Share:</span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('copy')}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Copy className="h-4 w-4" />
              <span>Copy Link</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('twitter')}
              className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Twitter</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShare('whatsapp')}
              className="flex items-center space-x-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          <SummaryCard summary={analysis.summary} />
          <TopicTimeline topics={analysis.topics} />
          <TranscriptView transcript={analysis.transcript} />
        </div>
      </div>
    </div>
  );
};

export default SharePage;