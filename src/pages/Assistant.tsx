import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'audio' | 'image';
}

interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  recommendations: string[];
  supportive_message: string;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm your Welltick AI assistant. I'm here to help with accessibility needs, wellness guidance, and daily support. How can I assist you today?",
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [emotionAnalysis, setEmotionAnalysis] = useState<EmotionAnalysis | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (content: string, type: 'text' | 'audio' | 'image' = 'text') => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: content,
      timestamp: new Date(),
      type
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
     
      if (type === 'text') {
        analyzeEmotion(content);
      }

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content }
          ],
          type: type === 'image' ? 'image-analysis' : 'chat'
        })
      });

      const data = await response.json();
      
      if (data.message) {
        const assistantMessage: Message = {
          id: Date.now() + 1,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        speakText(data.message);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: 'assistant',
        content: "I'm sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeEmotion = async (text: string) => {
    try {
      const response = await fetch('/api/ai/analyze-emotion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const analysis = await response.json();
      setEmotionAnalysis(analysis);
    } catch (error) {
      console.error('Emotion analysis error:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');

      const response = await fetch('/api/ai/speech-to-text', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.text) {
        await sendMessage(data.text, 'audio');
      }
    } catch (error) {
      console.error('Speech-to-text error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    if (!isListening) return;
    
    try {
      const response = await fetch('/api/ai/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.play();
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      await sendMessage(`Image uploaded: ${imageData}`, 'image');
    };
    reader.readAsDataURL(file);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputText);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: '#f8f9fa',
      paddingBottom: '80px'
     }}>
      <div style={{
        padding: '16px',
        background: 'white',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #007ACC, #00BFA6)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            AI
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Welltick Assistant</h2>
            <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
              Always here to help with accessibility and wellness
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setIsListening(!isListening)}
          style={{
            padding: '8px 16px',
            background: isListening ? '#00BFA6' : '#f0f0f0',
            color: isListening ? 'white' : '#333',
            border: 'none',
            borderRadius: '20px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          {isListening ? '🔊 Audio On' : '🔇 Audio Off'}
        </button>
      </div>

      {/* Emotion Analysis Bar */}
      {emotionAnalysis && (
        <div style={{
          padding: '12px 16px',
          background: '#fff3cd',
          borderBottom: '1px solid #ffeaa7',
          fontSize: '14px'
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            Detected emotion: {emotionAnalysis.emotion} ({Math.round(emotionAnalysis.confidence * 100)}% confidence)
          </div>
          <div style={{ color: '#666' }}>
            {emotionAnalysis.supportive_message}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              display: 'flex',
              justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                maxWidth: '80%',
                padding: '12px 16px',
                borderRadius: '18px',
                background: message.role === 'user' 
                  ? 'linear-gradient(135deg, #007ACC, #0056b3)' 
                  : 'white',
                color: message.role === 'user' ? 'white' : '#333',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
                {message.content}
              </div>
              <div style={{
                fontSize: '11px',
                marginTop: '4px',
                opacity: 0.7,
                textAlign: message.role === 'user' ? 'right' : 'left'
              }}>
                {message.timestamp.toLocaleTimeString()}
                {message.type === 'audio' && ' 🎤'}
                {message.type === 'image' && ' 📷'}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
            <div style={{
              padding: '12px 16px',
              background: 'white',
              borderRadius: '18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      
      <div style={{
        background: 'white',
        borderTop: '1px solid #e0e0e0',
        padding: '16px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end'
      }}>
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '12px',
            background: '#f0f0f0',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Upload image"
        >
          📷
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />

        <div style={{ flex: 1, position: 'relative' }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message or use voice..."
            style={{
              width: '100%',
              minHeight: '44px',
              maxHeight: '120px',
              padding: '12px 50px 12px 16px',
              border: '1px solid #ddd',
              borderRadius: '22px',
              resize: 'none',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit'
            }}
            disabled={isLoading}
          />
        </div>

        <button
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            padding: '12px',
            background: isRecording ? '#e53935' : '#007ACC',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: isRecording ? 'pulse 1s infinite' : 'none'
          }}
          title={isRecording ? 'Stop recording' : 'Start voice recording'}
        >
          {isRecording ? '⏹️' : '🎤'}
        </button>

        <button
          onClick={() => sendMessage(inputText)}
          disabled={!inputText.trim() || isLoading}
          style={{
            padding: '12px',
            background: inputText.trim() && !isLoading ? '#00BFA6' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Send message"
        >
          ➤
        </button>
      </div>

      <style>{`
        .typing-dot {
          width: 8px;
          height: 8px;
          background: #007ACC;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default Assistant;