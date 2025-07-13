import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, updateDoc, doc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { storage, db } from './firebase';

// Types
export interface TranscriptionResult {
  transcript: string;
  confidence: number;
  duration: number;
}

export interface SummaryResult {
  summary: string;
  topics: Array<{
    title: string;
    timestamp: string;
    description: string;
  }>;
}

export interface PodcastAnalysis {
  id?: string;
  title: string;
  duration: string;
  transcript: string;
  summary: string;
  topics: Array<{
    title: string;
    timestamp: string;
    description: string;
  }>;
  audioUrl?: string;
  userId: string;
  createdAt: Date;
  isPublic: boolean;
  shareId?: string;
}

// Audio file upload to Firebase Storage
export const uploadAudioFile = async (file: File, userId: string): Promise<string> => {
  try {
    const timestamp = Date.now();
    const filename = `${userId}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, `audio/${filename}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload audio file');
  }
};

// Mock transcription service (replace with actual API call)
export const transcribeAudio = async (audioUrl: string): Promise<TranscriptionResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock transcription result
  return {
    transcript: `Welcome to today's episode where we dive deep into the fascinating world of artificial intelligence and its transformative impact on modern technology.

[00:00:30] Our conversation begins with the fundamental question: what exactly is artificial intelligence? AI, in its simplest form, is the simulation of human intelligence in machines that are programmed to think and learn like humans.

[00:02:15] We're seeing remarkable advances in machine learning algorithms that can process vast amounts of data and identify patterns that would be impossible for humans to detect manually.

[00:05:45] The healthcare industry is experiencing a revolution thanks to AI-powered diagnostic tools that can analyze medical images with unprecedented accuracy.

[00:09:20] In the automotive sector, self-driving cars are no longer a distant dream but a rapidly approaching reality that will fundamentally change how we think about transportation.

[00:13:10] The ethical implications of AI development cannot be ignored. As we create more sophisticated systems, we must carefully consider issues of privacy, bias, and accountability.

[00:18:30] Looking toward the future, we can expect to see AI integration in virtually every aspect of our daily lives, from smart homes to personalized education.

[00:24:15] The key to successful AI implementation lies in finding the right balance between automation and human oversight, ensuring that technology serves humanity rather than replacing it.`,
    confidence: 0.95,
    duration: 1725 // 28:45 in seconds
  };
};

// Mock GPT-4 summarization (replace with actual OpenAI API call)
export const generateSummary = async (transcript: string): Promise<SummaryResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock summary result
  return {
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
  };
};

// Save analysis to Firestore
export const saveAnalysis = async (analysis: Omit<PodcastAnalysis, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'analyses'), {
      ...analysis,
      createdAt: new Date()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving analysis:', error);
    throw new Error('Failed to save analysis');
  }
};

// Get user's analyses
export const getUserAnalyses = async (userId: string): Promise<PodcastAnalysis[]> => {
  try {
    const q = query(collection(db, 'analyses'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as PodcastAnalysis[];
  } catch (error) {
    console.error('Error fetching analyses:', error);
    throw new Error('Failed to fetch analyses');
  }
};

// Delete analysis
export const deleteAnalysis = async (analysisId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'analyses', analysisId));
  } catch (error) {
    console.error('Error deleting analysis:', error);
    throw new Error('Failed to delete analysis');
  }
};

// Make analysis public and generate share ID
export const shareAnalysis = async (analysisId: string): Promise<string> => {
  try {
    const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const analysisRef = doc(db, 'analyses', analysisId);
    
    await updateDoc(analysisRef, {
      isPublic: true,
      shareId: shareId
    });
    
    return shareId;
  } catch (error) {
    console.error('Error sharing analysis:', error);
    throw new Error('Failed to share analysis');
  }
};

// Get shared analysis by share ID
export const getSharedAnalysis = async (shareId: string): Promise<PodcastAnalysis | null> => {
  try {
    const q = query(collection(db, 'analyses'), where('shareId', '==', shareId), where('isPublic', '==', true));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    } as PodcastAnalysis;
  } catch (error) {
    console.error('Error fetching shared analysis:', error);
    throw new Error('Failed to fetch shared analysis');
  }
};

// Extract metadata from RSS feed
export const extractRSSMetadata = async (rssUrl: string): Promise<{ title: string; audioUrl: string }> => {
  try {
    // This is a simplified mock - in production, you'd use a service like RSS2JSON
    // or implement server-side RSS parsing
    
    // For demo purposes, return mock data
    return {
      title: 'Podcast Episode from RSS Feed',
      audioUrl: rssUrl
    };
  } catch (error) {
    console.error('Error extracting RSS metadata:', error);
    throw new Error('Failed to extract RSS metadata');
  }
};