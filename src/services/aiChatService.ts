import OpenAI from 'openai';
import { fetchAIAssistantData, formatAIAssistantContext } from '../lib/supabase-ai-data';

// Create OpenAI instance configured for OpenRouter
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  dangerouslyAllowBrowser: true, // Required for browser usage
  defaultHeaders: {
    "HTTP-Referer": window.location.origin, // Site URL for rankings on openrouter.ai
    "X-Title": "Jacob Varghese Portfolio", // Site title for rankings on openrouter.ai
  },
});

// Message type definition
export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Cache for AI assistant data to avoid repeated fetches
let aiAssistantDataCache: string | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get the system instruction with Supabase data
 * @returns System instruction string with Supabase data
 */
async function getSystemInstruction(): Promise<string> {
  const currentTime = Date.now();
  
  // If cache is expired or doesn't exist, fetch new data
  if (!aiAssistantDataCache || (currentTime - lastFetchTime > CACHE_DURATION)) {
    const aiData = await fetchAIAssistantData();
    aiAssistantDataCache = formatAIAssistantContext(aiData);
    lastFetchTime = currentTime;
  }
  
  // Base system instruction
  const baseInstruction = `You are an AI assistant for Jacob Varghese's portfolio website.
  
  ROLE AND PURPOSE:
  - You help visitors learn about Jacob's skills, experience, projects, and services
  - You represent Jacob professionally and should be friendly, helpful, and concise
  
  ALLOWED TOPICS:
  - Jacob's technical skills and expertise
  - Jacob's work experience and background
  - Jacob's projects and portfolio items
  - Jacob's services and how to work with him
  - How to contact Jacob (always suggest the contact form or email)
  
  PROHIBITED TOPICS:
  - Do NOT discuss topics unrelated to Jacob or his professional work
  - Do NOT generate code unless specifically asked about Jacob's coding skills
  - Do NOT make up information that isn't provided in your knowledge base
  - Do NOT discuss personal or political topics
  
  RESPONSE STYLE:
  - Be concise and to the point
  - Use markdown formatting for better readability
  - Use bullet points for lists
  - Keep responses under 150 words when possible
  - Be friendly but professional
  - Make the responses like pretty
  
  Current date: ${new Date().toLocaleDateString()}`;
  
  // Combine base instruction with data from Supabase
  return `${baseInstruction}

${aiAssistantDataCache || ''}`;
}

/**
 * Send a message to the AI and get a response
 * @param messages Array of messages in the conversation history
 * @returns The AI's response message
 */
export async function sendMessage(messages: ChatMessage[]): Promise<string> {
  try {
    // Add system message if not present
    if (!messages.some(msg => msg.role === 'system')) {
      const systemInstruction = await getSystemInstruction();
      
      messages = [
        {
          role: 'system',
          content: systemInstruction
        },
        ...messages
      ];
    }

    console.log('Sending messages to AI:', JSON.stringify(messages, null, 2));
    
    const completion = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENROUTER_MODEL_NAME || "deepseek/deepseek-chat-v3-0324:free",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    });
    
    console.log('AI response:', completion);
    
    if (!completion.choices || completion.choices.length === 0) {
      console.error('No choices in completion response:', completion);
      return "I'm sorry, I couldn't generate a response due to an API error. Please try again.";
    }
    
    const responseContent = completion.choices[0].message.content;
    
    if (!responseContent) {
      console.error('Empty response content from AI:', completion);
      return "I'm sorry, I couldn't generate a response. Please try a different question.";
    }
    
    return responseContent;
  } catch (error: any) {
    console.error("Error calling AI service:", error);
    
    // More detailed error logging
    if (error.response) {
      console.error('API response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    
    return `Sorry, I encountered an error: ${error.message || 'Unknown error'}. Please try again later.`;
  }
}
