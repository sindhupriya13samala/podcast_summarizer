// Convert seconds to MM:SS or HH:MM:SS format
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
};

// Convert MM:SS or HH:MM:SS format to seconds
export const parseTime = (timeString: string): number => {
  const parts = timeString.split(':').map(Number);
  
  if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  
  return 0;
};

// Format duration for display (e.g., "1h 23m", "45m", "2m 30s")
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const parts: string[] = [];
  
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  
  if (remainingSeconds > 0 && hours === 0) {
    parts.push(`${remainingSeconds}s`);
  }
  
  return parts.join(' ') || '0s';
};

// Get relative time (e.g., "2 hours ago", "3 days ago")
export const getRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, seconds] of Object.entries(intervals)) {
    const interval = Math.floor(diffInSeconds / seconds);
    
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

// Validate timestamp format
export const isValidTimestamp = (timestamp: string): boolean => {
  const timestampRegex = /^(\d{1,2}):([0-5]?\d):([0-5]?\d)$|^([0-5]?\d):([0-5]?\d)$/;
  return timestampRegex.test(timestamp);
};

// Calculate total duration from multiple timestamps
export const calculateTotalDuration = (timestamps: string[]): number => {
  const maxTime = timestamps.reduce((max, timestamp) => {
    const seconds = parseTime(timestamp);
    return Math.max(max, seconds);
  }, 0);
  
  return maxTime;
};