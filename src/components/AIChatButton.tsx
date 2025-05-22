import { motion } from 'framer-motion';
import { RiRobot2Line } from "react-icons/ri";
import { useAIChat } from '../context/AIChatContext';

const AIChatButton = () => {
  const { toggleChat } = useAIChat();

  return (
    <>
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-28 right-6 md:bottom-6 md:right-6 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-glow z-999999 cursor-pointer"
        whileHover={{ scale: 1.1, boxShadow: "0 0 25px rgba(145, 94, 255, 0.7)" }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        
      >
        <RiRobot2Line size={24} />
      </motion.button>
    </>
  );
};

export default AIChatButton;
