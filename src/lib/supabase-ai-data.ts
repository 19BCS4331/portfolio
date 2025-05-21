import { supabase } from './supabase';

export interface AIAssistantData {
  id: number;
  category: string;
  topic: string;
  content: string;
  priority: number;
  created_at: string;
}

/**
 * Fetch AI assistant data from Supabase
 * This data will be used to provide context to the AI assistant
 */
export async function fetchAIAssistantData(): Promise<AIAssistantData[]> {
  try {
    const { data, error } = await supabase
      .from('ai_assistant_data')
      .select('*')
      .order('priority', { ascending: false });
    
    if (error) {
      console.error('Error fetching AI assistant data:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in fetchAIAssistantData:', error);
    return [];
  }
}

/**
 * Format AI assistant data into a context string for the system prompt
 */
export function formatAIAssistantContext(data: AIAssistantData[]): string {
  if (!data || data.length === 0) {
    return '';
  }
  
  // Group data by category
  const categorizedData: Record<string, AIAssistantData[]> = {};
  
  data.forEach(item => {
    if (!categorizedData[item.category]) {
      categorizedData[item.category] = [];
    }
    categorizedData[item.category].push(item);
  });
  
  // Format the context string
  let contextString = '### KNOWLEDGE BASE ###\n\n';
  
  Object.entries(categorizedData).forEach(([category, items]) => {
    contextString += `## ${category.toUpperCase()}\n\n`;
    
    items.forEach(item => {
      contextString += `# ${item.topic}\n${item.content}\n\n`;
    });
  });
  
  return contextString;
}
