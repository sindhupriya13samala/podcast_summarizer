// Parse transcript with timestamps into segments
export interface TranscriptSegment {
  timestamp: string;
  text: string;
  startTime: number;
  endTime?: number;
}

// Extract timestamps and text from transcript
export const parseTranscript = (transcript: string): TranscriptSegment[] => {
  const lines = transcript.split('\n').filter(line => line.trim());
  const segments: TranscriptSegment[] = [];
  
  // Regex to match timestamps like [00:02:15] or [2:15] or (00:02:15)
  const timestampRegex = /[\[\(](\d{1,2}):(\d{2}):(\d{2})[\]\)]|[\[\(](\d{1,2}):(\d{2})[\]\)]/g;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const matches = [...line.matchAll(timestampRegex)];
    
    if (matches.length > 0) {
      const match = matches[0];
      let timestamp: string;
      let startTime: number;
      
      if (match[1] && match[2] && match[3]) {
        // HH:MM:SS format
        timestamp = `${match[1].padStart(2, '0')}:${match[2]}:${match[3]}`;
        startTime = parseInt(match[1]) * 3600 + parseInt(match[2]) * 60 + parseInt(match[3]);
      } else if (match[4] && match[5]) {
        // MM:SS format
        timestamp = `${match[4].padStart(2, '0')}:${match[5]}`;
        startTime = parseInt(match[4]) * 60 + parseInt(match[5]);
      } else {
        continue;
      }
      
      const text = line.replace(timestampRegex, '').trim();
      
      segments.push({
        timestamp,
        text,
        startTime,
        endTime: segments.length > 0 ? startTime : undefined
      });
      
      // Set end time for previous segment
      if (segments.length > 1) {
        segments[segments.length - 2].endTime = startTime;
      }
    } else if (segments.length > 0) {
      // Add text to the last segment if no timestamp
      segments[segments.length - 1].text += ' ' + line;
    } else {
      // Create a segment without timestamp for intro text
      segments.push({
        timestamp: '00:00:00',
        text: line,
        startTime: 0
      });
    }
  }
  
  return segments;
};

// Find segment at specific time
export const findSegmentAtTime = (segments: TranscriptSegment[], timeInSeconds: number): TranscriptSegment | null => {
  for (const segment of segments) {
    if (segment.startTime <= timeInSeconds && (!segment.endTime || timeInSeconds < segment.endTime)) {
      return segment;
    }
  }
  return null;
};

// Extract key topics from transcript segments
export const extractTopics = (segments: TranscriptSegment[]): Array<{ title: string; timestamp: string; description: string }> => {
  // This is a simplified topic extraction - in production, you'd use NLP or AI
  const topics: Array<{ title: string; timestamp: string; description: string }> = [];
  
  // Look for segments with substantial content (more than 50 characters)
  const significantSegments = segments.filter(segment => segment.text.length > 50);
  
  significantSegments.forEach((segment, index) => {
    if (index % 3 === 0) { // Take every 3rd significant segment as a topic
      const words = segment.text.split(' ');
      const title = generateTopicTitle(words);
      
      topics.push({
        title,
        timestamp: segment.timestamp,
        description: segment.text.substring(0, 100) + (segment.text.length > 100 ? '...' : '')
      });
    }
  });
  
  return topics;
};

// Generate a topic title from words
const generateTopicTitle = (words: string[]): string => {
  // Simple topic title generation - extract meaningful words
  const meaningfulWords = words
    .filter(word => word.length > 3)
    .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'said'].includes(word.toLowerCase()))
    .slice(0, 3);
  
  if (meaningfulWords.length === 0) {
    return 'Discussion Topic';
  }
  
  return meaningfulWords
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Search transcript for keywords
export const searchTranscript = (segments: TranscriptSegment[], query: string): TranscriptSegment[] => {
  const lowerQuery = query.toLowerCase();
  
  return segments.filter(segment => 
    segment.text.toLowerCase().includes(lowerQuery)
  );
};

// Highlight search terms in text
export const highlightSearchTerms = (text: string, searchTerm: string): string => {
  if (!searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
};

// Clean transcript text for export
export const cleanTranscriptForExport = (transcript: string): string => {
  // Remove timestamp markers and clean up formatting
  return transcript
    .replace(/[\[\(]\d{1,2}:\d{2}(:\d{2})?[\]\)]/g, '') // Remove timestamps
    .replace(/\n\s*\n/g, '\n') // Remove extra line breaks
    .trim();
};

// Convert transcript to SRT subtitle format
export const convertToSRT = (segments: TranscriptSegment[]): string => {
  let srt = '';
  
  segments.forEach((segment, index) => {
    if (segment.text.trim()) {
      const startTime = formatSRTTime(segment.startTime);
      const endTime = formatSRTTime(segment.endTime || segment.startTime + 5);
      
      srt += `${index + 1}\n`;
      srt += `${startTime} --> ${endTime}\n`;
      srt += `${segment.text.trim()}\n\n`;
    }
  });
  
  return srt;
};

// Format time for SRT format (HH:MM:SS,mmm)
const formatSRTTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
};