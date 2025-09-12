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

    const aiMessages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await fetch(process.env.AI_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: aiMessages,
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    const aiResponse = await response.json();
    
    if (!response.ok) {
      throw new Error(aiResponse.error?.message || 'AI service error');
    }

    res.json({
      message: aiResponse.choices[0].message.content,
      usage: aiResponse.usage
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'AI service temporarily unavailable' });
  }
});

router.post('/speech-to-text', async (req, res) => {
  try {
    const { audioData } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AI_API_KEY}`
      },
      body: audioData
    });

    const result = await response.json();
    res.json({ text: result.text });
  } catch (error) {
    console.error('Speech-to-text error:', error);
    res.status(500).json({ error: 'Speech recognition failed' });
  }
});

router.post('/text-to-speech', async (req, res) => {
  try {
    const { text, voice = 'alloy' } = req.body;
    
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'tts-1',
        input: text,
        voice: voice
      })
    });

    const audioBuffer = await response.buffer();
    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length
    });
    res.send(audioBuffer);
  } catch (error) {
    console.error('Text-to-speech error:', error);
    res.status(500).json({ error: 'Text-to-speech failed' });
  }
});

router.post('/analyze-emotion', async (req, res) => {
  try {
    const { text } = req.body;
    
    const response = await fetch(process.env.AI_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Analyze the emotional tone of the following text and provide wellness recommendations. Return JSON with: emotion, confidence, recommendations, and supportive_message.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 500
      })
    });

    const result = await response.json();
    const analysis = JSON.parse(result.choices[0].message.content);
    
    res.json(analysis);
  } catch (error) {
    console.error('Emotion analysis error:', error);
    res.status(500).json({ error: 'Emotion analysis failed' });
  }
});

export default router;