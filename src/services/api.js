/**
 * VocaMind API Service Layer
 * 
 * Communicates with the backend server via POST /api/chat.
 * The backend URL is configurable via the VITE_API_URL environment variable.
 * Does not hardcode backend URLs.
 * 
 * Contract:
 * Request:  { "text": string }
 * Response: { "recognized_text": string, "intent": string, "confidence": number, "response": string }
 */

// Retrieve backend URL from environment or default to current origin
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '';
  return envUrl.endsWith('/') ? envUrl.slice(0, -1) : envUrl;
};

/**
 * Sends recognized or typed user speech to the chatbot API
 * @param {string} text - User's recognized or typed input
 * @returns {Promise<{ recognized_text: string, intent: string, confidence: number, response: string }>}
 */
export async function sendChatMessage(text) {
  if (!text || !text.trim()) {
    throw new Error('Please provide input text or speak into the microphone.');
  }

  const baseUrl = getApiBaseUrl();
  const endpoint = `${baseUrl}/api/chat`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text.trim() }),
    });

    if (!response.ok) {
      let errorMsg = `Server error (${response.status} ${response.statusText})`;
      try {
        const errorData = await response.json();
        if (errorData?.detail || errorData?.error || errorData?.message) {
          errorMsg = errorData.detail || errorData.error || errorData.message;
        }
      } catch {
        // Fallback to status text
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();

    // Validate API response schema
    if (typeof data.response !== 'string') {
      throw new Error('Malformed API response: "response" field is missing or invalid.');
    }

    return {
      recognized_text: data.recognized_text || text,
      intent: data.intent || 'general_query',
      confidence: typeof data.confidence === 'number' ? data.confidence : 0.92,
      response: data.response,
    };
  } catch (error) {
    console.error('VocaMind API request failed:', error);
    
    // Provide explicit error description if server is unreachable
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const target = baseUrl ? baseUrl : window.location.origin;
      throw new Error(
        `Backend Connection Error: Could not reach VocaMind API at "${target}/api/chat". Please verify your backend server or VITE_API_URL setting.`
      );
    }

    throw error;
  }
}

/**
 * Helper to get the currently configured API base URL
 */
export function getCurrentApiUrl() {
  return getApiBaseUrl() || (typeof window !== 'undefined' ? window.location.origin : '');
}
