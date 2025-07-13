import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar, Clock, Tag, Eye, Trash2, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PodcastAnalysis {
  id: string;
  title: string;
  date: string;
  duration: string;
  tags: string[];
  summary: string;
}

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [analyses, setAnalyses] = useState<PodcastAnalysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');

  // Mock data - in real app, this would come from Firebase
  useEffect(() => {
    const mockAnalyses: PodcastAnalysis[] = [
      {
        id: '1',
        title: 'The Future of AI in Technology',
        date: '2025-01-15',
        duration: '28:45',
        tags: ['AI', 'Technology', 'Future'],
        summary: 'Deep dive into artificial intelligence and its impact on modern technology across healthcare, automotive, and ethics.'
      },
      {
        id: '2',
        title: 'Climate Change Solutions',
        date: '2025-01-12',
        duration: '45:20',
        tags: ['Environment', 'Climate', 'Solutions'],
        summary: 'Exploring innovative approaches to combat climate change through renewable energy and sustainable practices.'
      },
      {
        id: '3',
        title: 'Entrepreneurship Mindset',
        date: '2025-01-10',
        duration: '32:18',
        tags: ['Business', 'Entrepreneurship', 'Mindset'],
        summary: 'Essential strategies for developing an entrepreneurial mindset and building successful startups.'
      }
    ];
    setAnalyses(mockAnalyses);
  }, []);

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         analysis.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !filterTag || analysis.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  const allTags = [...new Set(analyses.flatMap(analysis => analysis.tags))];

  const handleDelete = (id: string) => {
    setAnalyses(analyses.filter(analysis => analysis.id !== id));
  };

  const handleShare = (id: string) => {
    // Implementation for sharing
    console.log('Sharing analysis:', id);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Please sign in to access your dashboard
          </h2>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
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
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Your Podcast Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Manage and explore your analyzed podcasts
              </p>
            </div>
            <Link
              to="/"
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>New Analysis</span>
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your podcasts..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>

            {/* Tag Filter */}
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Analyses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAnalyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2 line-clamp-2">
                  {analysis.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
                  {analysis.summary}
                </p>
              </div>

              {/* Metadata */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(analysis.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span>{analysis.duration}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                  >
                    <Tag className="h-3 w-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Link
                  to={`/share/${analysis.id}`}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </Link>

                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleShare(analysis.id)}
                    className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
                  >
                    <Share2 className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(analysis.id)}
                    className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAnalyses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-slate-400 dark:text-slate-500 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No podcasts found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {searchTerm || filterTag ? 'Try adjusting your search or filters' : 'Start by analyzing your first podcast'}
            </p>
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Analyze Podcast</span>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;