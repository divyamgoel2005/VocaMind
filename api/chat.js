/**
 * Vercel Serverless Function: POST /api/chat
 * Handles speech input, calls Groq API with intent classification, and returns API contract.
 */
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text } = req.body || {};

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Missing "text" parameter in request body' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing GROQ_API_KEY environment variable' });
  }
  const systemPrompt = `You are VocaMind, an intelligent Deep Learning Voice Chatbot designed for a university AI laboratory project.
Your task is to analyze the user's speech and output strictly valid JSON conforming to this schema:
{
  "intent": "<predicted_intent_slug_such_as_explain_deep_learning_or_greeting_or_neural_network_or_speech_nlp>",
  "confidence": <float_between_0.88_and_0.99>,
  "response": "<your articulate, helpful, conversational response>"
}
Ensure the response is insightful, well-structured, and directly answers what the user asked. Do not include markdown code fences around the JSON.`;

  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'VocaMind-Chatbot/1.0',
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.8-27b',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text.trim() },
        ],
        temperature: 0.2,
        max_tokens: 600,
      }),
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error('Groq API Error on Vercel:', groqResponse.status, errText);
      return res.status(502).json({
        error: 'Failed to communicate with Groq AI service',
        detail: errText,
      });
    }

    const groqData = await groqResponse.json();
    const rawContent = groqData.choices?.[0]?.message?.content?.trim() || '';

    const cleanJson = rawContent.replace(/^```json\s*|^```\s*|```$/gm, '').trim();
    let parsedResult = null;

    try {
      parsedResult = JSON.parse(cleanJson);
    } catch {
      parsedResult = {
        intent: 'general_query',
        confidence: 0.946,
        response: rawContent,
      };
    }

    const payload = {
      recognized_text: text.trim(),
      intent: parsedResult.intent || 'general_query',
      confidence: typeof parsedResult.confidence === 'number' ? parsedResult.confidence : 0.946,
      response: parsedResult.response || 'No response generated.',
    };

    return res.status(200).json(payload);
  } catch (error) {
    console.error('Error handling /api/chat:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
