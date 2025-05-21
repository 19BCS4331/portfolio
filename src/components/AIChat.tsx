import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { FaPaperPlane, FaTimes, FaUser, FaRegLightbulb, FaExternalLinkAlt, FaCode, FaBriefcase, FaEnvelope } from 'react-icons/fa';
import { RiRobot2Line } from "react-icons/ri";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { sendMessage } from '../services/aiChatService';
import type { ChatMessage as AIMessage } from '../services/aiChatService';
import { useAIChat } from '../context/AIChatContext';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

const AIChat: React.FC = () => {
  const { isChatOpen: isOpen, closeChat: onClose, clearChat, isChatCleared } = useAIChat();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi there! I\'m Jacob\'s AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  // isTyping is used to show a typing indicator in the UI
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample quick questions with icons
  const quickQuestions = [
    { icon: <FaCode />, text: "What technologies do you work with?" },
    { icon: <FaBriefcase />, text: "Tell me about your experience" },
    { icon: <FaRegLightbulb />, text: "What projects have you worked on?" },
    { icon: <FaEnvelope />, text: "How can I contact you?" },
  ];

  // Animations
  const controls = useAnimation();
  const chatControls = useAnimation();

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);
  
  // Initialize with a welcome message and handle chat clearing
  useEffect(() => {
    // Reset messages when chat is cleared
    if (isChatCleared) {
      setMessages([{
        id: Date.now().toString(),
        content: "Hi there! I'm Jacob's AI assistant. How can I help you today?",
        role: 'assistant',
        timestamp: new Date()
      }]);
      setIsLoading(false);
      setIsTyping(false);
    }
  }, [isChatCleared]);

  // Animate chat window
  useEffect(() => {
    if (isOpen) {
      controls.start({
        opacity: 1,
        transition: { duration: 0.3 }
      });
      chatControls.start({
        y: 0,
        opacity: 1,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30
        }
      });
    } else {
      controls.start({
        opacity: 0,
        transition: { duration: 0.3 }
      });
      chatControls.start({
        y: 50,
        opacity: 0,
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30
        }
      });
    }
  }, [isOpen, controls, chatControls]);

  // Add a message to the chat
  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    const userMessage = messageText.trim();
    
    // Add user message
    addMessage({
      id: Date.now().toString(),
      content: userMessage,
      role: 'user',
      timestamp: new Date()
    });
    
    // Clear input
    setMessageText('');
    setIsLoading(true);
    
    // Get AI response
    getAIResponse(userMessage);
  };

  // Handle sending a quick question
  const handleQuickQuestion = (question: string) => {
    setMessageText(question);
    handleSendMessage();
    setIsSuggestionsOpen(false);
  };

  // Check if response is unexpected or error-like
  const isUnexpectedResponse = (response: string): boolean => {
    const errorPatterns = [
      /i('m| am) sorry, i couldn't generate/i,
      /\d+\.\d+\.\d+/,  // Matches version numbers like 1.0.0
      /features/i,
      /init:/i,
      /error/i,
      /\(\w+\)$/  // Matches things like (0c1a1e1) - commit hashes
    ];
    
    return errorPatterns.some(pattern => pattern.test(response));
  };
  
  // Get response from AI service
  const getAIResponse = async (userMessage: string) => {
    // Show typing indicator
    setIsTyping(true);
    setIsLoading(true);
    
    try {
      // Convert messages to format expected by AI service
      const aiMessages: AIMessage[] = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the latest user message
      aiMessages.push({
        role: 'user',
        content: userMessage
      });
      
      // Get response from AI service
      const response = await sendMessage(aiMessages);
      
      // Check if the response seems like an error or unexpected output
      if (isUnexpectedResponse(response)) {
        console.warn('Unexpected AI response detected:', response);
        
        // Add a more helpful response instead
        addMessage({
          id: Date.now().toString(),
          content: "I'm sorry, I seem to be having trouble generating a proper response. Could you try asking your question differently? You can also try clearing the chat using the clear button above.",
          role: 'assistant',
          timestamp: new Date()
        });
      } else {
        // Add normal AI response to messages
        addMessage({
          id: Date.now().toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      addMessage({
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error. Please try again later.",
        role: 'assistant',
        timestamp: new Date()
      });
    } finally {
      // Hide typing indicator and loading state
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  // Handle key press in the input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed bottom-4 right-4 w-full max-w-md h-[600px] z-999999 flex flex-col bg-black border border-gray-800 rounded-xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-900/80 to-black p-4 flex justify-between items-center border-b border-purple-500/30 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center mr-3 border border-purple-500/30">
                <RiRobot2Line size={16} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={clearChat}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors flex items-center gap-1 text-xs"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Clear conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span className="hidden sm:inline">Clear</span>
              </motion.button>
              <motion.button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes size={18} />
              </motion.button>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            className="flex-grow overflow-y-auto p-4 space-y-4 chat-messages-container"
          >
            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 mb-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-white">
                  <RiRobot2Line size={18} />
                </div>
                <div className="flex-grow">
                  <div className="px-4 py-3 rounded-lg bg-gray-900 text-white inline-block max-w-[85%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`mb-6 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center border border-purple-500/30">
                      <RiRobot2Line size={14} className="text-white" />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl p-4 shadow-lg ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-700 to-purple-900 text-white rounded-tr-none'
                      : 'bg-gray-900/70 border border-gray-800 text-gray-200 rounded-tl-none backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`font-medium ${message.role === 'user' ? 'text-white' : 'text-purple-400'}`}>
                      {message.role === 'user' ? 'You' : 'AI Assistant'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {message.role === 'assistant' ? (
                    <div className="markdown-content">
                      <ReactMarkdown 
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          p: ({node, ...props}) => <p className="mb-2" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-md font-bold mb-2" {...props} />,
                          a: ({node, ...props}) => <a className="text-purple-400 hover:text-purple-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                          code: ({node, ...props}: any) => {
                            const isInline = !(props.className?.includes('language-'));
                            return isInline 
                              ? <code className="bg-gray-800 px-1 rounded text-sm" {...props} />
                              : <code className="block bg-gray-800 p-2 rounded-md my-2 text-sm overflow-x-auto" {...props} />;
                          },
                          pre: ({node, ...props}) => <pre className="bg-gray-800 p-3 rounded-md my-3 overflow-x-auto" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-purple-300" {...props} />,
                          em: ({node, ...props}) => <em className="italic text-gray-300" {...props} />,
                          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-500 pl-3 italic my-2" {...props} />,
                          hr: ({node, ...props}) => <hr className="my-3 border-gray-700" {...props} />
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="text">{message.content}</div>
                  )}
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 ml-3 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-700">
                      <FaUser size={12} className="text-white" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            {isLoading && (
              <motion.div 
                className="flex justify-start mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex-shrink-0 mr-3 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center border border-purple-500/30">
                    <RiRobot2Line size={14} className="text-white" />
                  </div>
                </div>
                <div className="bg-gray-900/70 border border-gray-800 rounded-2xl p-4 rounded-tl-none max-w-[75%] shadow-lg backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-purple-400">AI Assistant</span>
                    <span className="text-xs text-gray-400">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-purple-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: "loop", times: [0, 0.5, 1], ease: "easeInOut" }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-purple-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: "loop", times: [0, 0.5, 1], ease: "easeInOut", delay: 0.3 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-purple-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, repeatType: "loop", times: [0, 0.5, 1], ease: "easeInOut", delay: 0.6 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Collapsible Quick Questions */}
          <div className="bg-gray-900/80 border-t border-gray-800">
            <motion.button 
              onClick={() => setIsSuggestionsOpen(!isSuggestionsOpen)}
              className="w-full p-3 flex items-center justify-between text-gray-400 hover:text-white transition-colors"
              whileHover={{ backgroundColor: 'rgba(31, 41, 55, 0.5)' }}
            >
              <div className="flex items-center gap-2">
                <FaRegLightbulb className="text-purple-500" /> 
                <span className="text-sm font-medium">Suggestions</span>
              </div>
              <motion.div
                animate={{ rotate: isSuggestionsOpen ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </motion.div>
            </motion.button>
            
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: isSuggestionsOpen ? 'auto' : 0,
                opacity: isSuggestionsOpen ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-3 pt-0 flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleQuickQuestion(question.text)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-black border border-purple-500/30 text-gray-300 text-sm hover:bg-gray-900 hover:border-purple-500/50 transition-all flex items-center gap-1.5"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-purple-500">{question.icon}</span>
                    {question.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Chat Input */}
          <div className="bg-black p-4 border-t border-gray-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-3 items-center"
            >
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-grow px-4 py-3 rounded-full bg-gray-900 text-white border border-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all placeholder-gray-500"
                disabled={isLoading}
              />
              <motion.button
                type="submit"
                disabled={isLoading || !messageText.trim()}
                className={`p-3 rounded-full ${messageText.trim() 
                  ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-700/20' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                whileHover={messageText.trim() ? { scale: 1.05, boxShadow: "0 0 15px rgba(168, 85, 247, 0.5)" } : {}}
                whileTap={messageText.trim() ? { scale: 0.95 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <FaPaperPlane size={16} />
              </motion.button>
            </form>
            <div className="mt-3 text-center">
              <span className="text-xs text-gray-500 flex items-center justify-center gap-1">
                Powered by <span className="text-purple-500 font-medium">OpenRouter</span>
                <motion.a 
                  href="https://openrouter.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-500 hover:text-purple-400 inline-flex items-center gap-0.5 ml-1"
                  whileHover={{ x: 2 }}
                >
                  Learn more <FaExternalLinkAlt size={8} />
                </motion.a>
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChat;