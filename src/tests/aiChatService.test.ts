/**
 * AI Chat Service Example Usage
 * 
 * This file demonstrates how to use the AI chat service in your components.
 * In Vite projects, you need to test this functionality directly in the browser
 * because import.meta.env is only available at runtime in the browser environment.
 */

// Import the sendMessage function and ChatMessage type
import { sendMessage, type ChatMessage } from '../services/aiChatService';

/**
 * Example function showing how to use the AI chat service
 */
async function exampleUsage() {
  // Create an array of messages representing the conversation
  const messages: ChatMessage[] = [
    // Optional system message to set the AI's behavior
    {
      role: 'system',
      content: 'You are a helpful assistant for a portfolio website.'
    },
    // User message
    {
      role: 'user',
      content: 'Hello, can you introduce yourself?'
    }
  ];

  try {
    // Send the messages to the AI service and get a response
    const response = await sendMessage(messages);
    
    // Handle the response (in a real component, you would update state)
    console.log('AI Response:', response);
    
    // You would typically add the response to your messages array
    messages.push({
      role: 'assistant',
      content: response
    });
  } catch (error) {
    // Handle any errors
    console.error('Error getting AI response:', error);
  }
}

// Note: This is just an example and won't run directly with ts-node
// Comment out the line below when using this as reference
// exampleUsage();
