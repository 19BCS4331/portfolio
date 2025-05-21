import React from 'react';
import { motion } from 'framer-motion';
import { useAIChat } from '../context/AIChatContext';

interface OpenAIChatButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

/**
 * A reusable button component that can be placed anywhere to open the AI chat
 */
const OpenAIChatButton: React.FC<OpenAIChatButtonProps> = ({
  className = '',
  children,
  variant = 'primary',
  size = 'md',
  icon
}) => {
  const { openChat } = useAIChat();

  // Base styles
  const baseStyles = "rounded-md font-medium transition-all flex items-center justify-center gap-2";
  
  // Variant styles
  const variantStyles = {
    primary: "bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:shadow-lg hover:shadow-purple-500/20",
    secondary: "bg-gray-900 text-white border border-purple-500/30 hover:border-purple-500/60",
    text: "text-purple-500 hover:text-purple-400 hover:underline"
  };
  
  // Size styles
  const sizeStyles = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-2",
    lg: "text-base px-4 py-2.5"
  };

  return (
    <motion.button
      onClick={openChat}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  );
};

export default OpenAIChatButton;
