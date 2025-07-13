import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Download, Save, Share2, Clock, FileText, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import TranscriptView from '../components/TranscriptView';
import TopicTimeline from '../components/TopicTimeline';
import SummaryCard from '../components/SummaryCard';

interface AnalysisData {
  transcript: string;
  summary: string;
  topics: Array<{
    title: string;
    timestamp: string;
    description: string;
  }>;
  title: string;
  duration: string;
}

const Analyze: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<'uploading' | 'transcribing' | 'summarizing' | 'complete'>('uploading');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  // Simulate the analysis process
  useEffect(() => {
    const simulateProgress = () => {
      // Uploading stage
      setTimeout(() => {
        setProgress(25);
        setStage('transcribing');
      }, 1000);

      // Transcribing stage
      setTimeout(() => {
        setProgress(70);
        setStage('summarizing');
      }, 3000);

      // Summarizing stage
      setTimeout(() => {
        setProgress(100);
        setStage('complete');
        
        // Mock analysis data
        setAnalysisData({
          title: 'The Future of AI in Technology',
          duration: '28:45',
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
      }, 5000);
    };

    simulateProgress();
  }, []);

  const getStageText = () => {
    switch (stage) {
      case 'uploading':
        return 'Uploading audio file...';
      case 'transcribing':
        return 'Transcribing audio with AI...';
      case 'summarizing':
        return 'Generating summary and topics...';
      case 'complete':
        return 'Analysis complete!';
      default:
        return 'Processing...';
    }
  };

  const handleSave = () => {
    // Implementation for saving analysis
    console.log('Saving analysis...');
  };

  const handleShare = () => {
    // Implementation for sharing analysis
    console.log('Sharing analysis...');
  };

  const handleExport = () => {
    // Implementation for exporting as PDF/Markdown
    console.log('Exporting analysis...');
  };

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>

          {analysisData && (
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </motion.button>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {stage !== 'complete' ? (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              {/* Progress Card */}
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4">
                    {stage === 'uploading' && <FileText className="h-8 w-8 text-white" />}
                    {stage === 'transcribing' && <Clock className="h-8 w-8 text-white animate-pulse" />}
                    {stage === 'summarizing' && <Sparkles className="h-8 w-8 text-white animate-pulse" />}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    {getStageText()}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    This may take a few minutes depending on the audio length
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{progress}%</span>
                  </div>
                  
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  </div>
                </div>

                {/* Stage Indicators */}
                <div className="flex justify-between mt-8 text-sm">
                  <div className={`flex items-center space-x-2 ${progress >= 25 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${progress >= 25 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                    <span>Upload</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${progress >= 70 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${progress >= 70 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                    <span>Transcribe</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${progress >= 100 ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-blue-600' : 'bg-slate-300'}`} />
                    <span>Summarize</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Title Section */}
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                  {analysisData?.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Duration: {analysisData?.duration}
                </p>
              </div>

              {/* Summary Card */}
              <SummaryCard summary={analysisData?.summary || ''} />

              {/* Topic Timeline */}
              <TopicTimeline topics={analysisData?.topics || []} />

              {/* Transcript */}
              <TranscriptView transcript={analysisData?.transcript || ''} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Analyze;