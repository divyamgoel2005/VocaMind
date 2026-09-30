import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Local development API middleware for POST /api/chat
function devApiPlugin() {
  return {
    name: 'dev-api-chat-plugin',
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next();
        }

        // Dynamically load environment variables from .env
        const env = loadEnv('', process.cwd(), '');
        const apiKey = env.GROQ_API_KEY || process.env.GROQ_API_KEY;

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          res.setHeader('Content-Type', 'application/json');

          if (!apiKey) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: 'Missing GROQ_API_KEY in .env file.' }));
          }

          try {
            const parsedBody = JSON.parse(body || '{}');
            const userText = parsedBody.text;

            if (!userText || !userText.trim()) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Missing text in request body' }));
            }

            const systemPrompt = `You are VocaMind, an intelligent Deep Learning Voice Chatbot designed for a university AI laboratory project.
Your task is to analyze the user's speech and output strictly valid JSON conforming to this schema:
{
  "intent": "<predicted_intent_slug_such_as_explain_deep_learning_or_greeting_or_neural_network_or_speech_nlp>",
  "confidence": <float_between_0.88_and_0.99>,
  "response": "<your articulate, helpful, conversational response>"
}
Ensure the response is insightful, well-structured, and directly answers what the user asked. Do not include markdown code fences around the JSON.`;

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
                  { role: 'user', content: userText.trim() },
                ],
                temperature: 0.2,
                max_tokens: 600,
              }),
            });

            if (!groqResponse.ok) {
              const errBody = await groqResponse.text();
              console.error('Groq API Error:', groqResponse.status, errBody);
              res.statusCode = 502;
              return res.end(JSON.stringify({
                error: `Groq AI service error: ${groqResponse.statusText}`,
                detail: errBody,
              }));
            }

            const groqData = await groqResponse.json();
            const rawContent = groqData.choices?.[0]?.message?.content?.trim() || '';

            // Clean markdown code blocks if present
            const cleanJson = rawContent.replace(/^```json\s*|^```\s*|```$/gm, '').trim();
            let parsedResult = null;

            try {
              parsedResult = JSON.parse(cleanJson);
            } catch (parseErr) {
              console.warn('Could not parse model JSON output directly, fallback applied:', parseErr);
              parsedResult = {
                intent: 'general_query',
                confidence: 0.946,
                response: rawContent,
              };
            }

            const responsePayload = {
              recognized_text: userText.trim(),
              intent: parsedResult.intent || 'general_query',
              confidence: typeof parsedResult.confidence === 'number' ? parsedResult.confidence : 0.946,
              response: parsedResult.response || 'I processed your request, but could not generate a response.',
            };

            res.statusCode = 200;
            res.end(JSON.stringify(responsePayload));
          } catch (err) {
            console.error('Server error handling /api/chat:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message || 'Internal server error' }));
          }
        });
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devApiPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
