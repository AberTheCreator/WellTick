const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  message: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  recommendations: string[];
  supportive_message: string;
}

export const chatWithAI = async (
  messages: AIMessage[],
  type: 'chat' | 'emotion-analysis' | 'image-analysis' = 'chat'
): Promise<ChatResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        type,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('AI Chat Error:', error);
    throw new Error('Failed to communicate with AI assistant');
  }
};

export const speechToText = async (audioBlob: Blob): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    const response = await fetch(`${API_BASE_URL}/ai/speech-to-text`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Speech to Text Error:', error);
    throw new Error('Failed to convert speech to text');
  }
};

export const textToSpeech = async (text: string, voice: string = 'alloy'): Promise<Blob> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/text-to-speech`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        voice,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Text to Speech Error:', error);
    throw new Error('Failed to convert text to speech');
  }
};

export const analyzeEmotion = async (text: string): Promise<EmotionAnalysis> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/analyze-emotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Emotion Analysis Error:', error);
    throw new Error('Failed to analyze emotion');
  }
};

export const analyzeImage = async (imageBase64: string, prompt: string = ''): Promise<string> => {
  try {
    const messages: AIMessage[] = [
      {
        role: 'user',
        content: `${prompt} [Image data: ${imageBase64}]`,
      },
    ];

    const response = await chatWithAI(messages, 'image-analysis');
    return response.message;
  } catch (error) {
    console.error('Image Analysis Error:', error);
    throw new Error('Failed to analyze image');
  }
};