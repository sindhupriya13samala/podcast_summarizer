import React from 'react';
import { motion } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';

interface Topic {
  title: string;
  timestamp: string;
  description: string;
}

interface TopicTimelineProps {
  topics: Topic[];
}

const TopicTimeline: React.FC<TopicTimelineProps> = ({ topics }) => {
  const handleTopicClick = (timestamp: string) => {
    // In a real implementation, this would seek to the timestamp in an audio player
    console.log('Seeking to timestamp:', timestamp);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
          <Clock className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Topic Timeline
        </h2>
      </div>

      <div className="space-y-4">
        {topics.map((topic, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleTopicClick(topic.timestamp)}
            className="group flex items-start space-x-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-all duration-200"
          >
            {/* Timeline Dot */}
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mt-2" />
              {index < topics.length - 1 && (
                <div className="w-0.5 h-16 bg-slate-200 dark:bg-slate-600 mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {topic.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">
                    {topic.timestamp}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {topic.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default TopicTimeline;