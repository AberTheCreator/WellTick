import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AIRequest {
  messages: AIMessage[];
  type: 'chat' | 'speech-to-text' | 'text-to-speech' | 'emotion-analysis' | 'image-analysis';
  data?: string;
}


const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

router.post('/chat', async (req, res) => {
  try {
    const { messages, type = 'chat', data }: AIRequest = req.body;
    
    let systemPrompt = '';
    switch (type) {
      case 'emotion-analysis':
        systemPrompt = 'You are an emotional wellness AI assistant specializing in accessibility and mental health support. Analyze the emotional state and provide supportive, actionable guidance.';
        break;
      case 'image-analysis':
        systemPrompt = 'You are an accessibility AI assistant. Analyze images to describe visual content for users with visual impairments. Be detailed and helpful.';
        break;
      default:
        systemPrompt = 'You are Welltick AI, an accessibility and wellness assistant. Help users with disabilities navigate their daily lives with empathy and practical solutions.';
    }

    
    const geminiMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    
    geminiMessages.unshift({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });

    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      })
    });

    const aiResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(aiResponse.error?.message || 'AI service error');
    }

    const responseText = aiResponse.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not process your request.';

    res.json({
      message: responseText,
      usage: aiResponse.usageMetadata
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'AI service temporarily unavailable' });
  }
});

router.post('/analyze-emotion', async (req, res) => {
  try {
    const { text } = req.body;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${process.env.AI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{
            text: `Analyze the emotional tone of the following text and provide wellness recommendations. Return JSON with: emotion, confidence, recommendations, and supportive_message. Text: "${text}"`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 500,
        }
      })
    });

    const result = await response.json();
    const analysisText = result.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    try {
      const analysis = JSON.parse(analysisText);
      res.json(analysis);
    } catch (parseError) {
      
      res.json({
        emotion: 'neutral',
        confidence: 0.5,
        recommendations: ['Continue engaging with the community'],
        supportive_message: 'Thank you for sharing. How can I help you today?'
      });
    }
  } catch (error) {
    console.error('Emotion analysis error:', error);
    res.status(500).json({ error: 'Emotion analysis failed' });
  }
});

router.post('/speech-to-text', async (req, res) => {
  res.status(501).json({ 
    error: 'Speech-to-text not implemented yet. Use Google Cloud Speech API.' 
  });
});

router.post('/text-to-speech', async (req, res) => {
  res.status(501).json({ 
    error: 'Text-to-speech not implemented yet. Use Google Cloud Text-to-Speech API.' 
  });
});

export default router;