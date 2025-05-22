import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCode, FaUserAlt, FaEnvelope, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Home', path: '/', icon: <FaHome /> },
    { title: 'Projects', path: '/projects', icon: <FaCode /> },
    { title: 'About', path: '/about', icon: <FaUserAlt /> },
  ];

  // Combined navigation links including Contact
  const allNavLinks = [
    ...navLinks,
    { title: 'Contact', path: '/contact', icon: <FaEnvelope /> }
  ];

  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <div className="fixed top-0 left-0 w-full hidden justify-center justify-items-center z-99999999 md:block">
        <motion.div 
          className={`nav-transition ${isScrolled ? 'w-1/2 mt-4' : 'w-full'}`}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <nav className={`nav-transition ${isScrolled 
            ? 'py-2 px-6 bg-black-100 bg-opacity-90 backdrop-blur-md nav-shadow-glow rounded-full' 
            : 'py-5 bg-transparent'}`}
          >
            <div className="mx-auto px-4 flex justify-between items-center">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent to-accent-light opacity-70 blur-sm rounded-lg group-hover:opacity-100 transition-opacity duration-300"></div>
                  <motion.div 
                    className={`${isScrolled ? 'px-3 py-2 bg-black-100 rounded-lg' : 'px-3 py-2 bg-black-100 rounded-full border border-gray-600'} relative`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl font-bold text-white-100">J<span className="text-accent">V</span></span>
                  </motion.div>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="flex items-center space-x-1">
                {navLinks.map((link, index) => (
                  <Link 
                    key={index} 
                    to={link.path}
                    className={`relative px-4 py-2 mx-1 text-sm font-medium transition-all group ${location.pathname === link.path ? 'text-purple-500' : 'text-white-100 hover:text-accent'}`}
                  >
                    <motion.div
                      className="flex items-center space-x-2"
                      whileHover={{ y: -2 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <span className={`${location.pathname === link.path ? 'text-purple-500' : 'text-accent opacity-80 group-hover:opacity-100'}`}>{link.icon}</span>
                      <span>{link.title}</span>
                    </motion.div>
                  </Link>
                ))}
                <Link to="/contact">
                <motion.button
                  className="btn-primary ml-4 shadow-glow-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={location.pathname === '/contact' ? { scale: 1.05 } : { scale: 1 }}
                >
                  <span className="flex items-center space-x-2 px-2">
                    <FaEnvelope size={14} />
                    <span>Contact Me</span>
                  </span>
                </motion.button>
                </Link>
              </div>
            </div>
          </nav>
        </motion.div>
      </div>

      {/* Mobile Navigation - Bottom Tab Bar */}
      <div className="md:hidden">
        {/* Small Logo for Mobile - Top Left */}
        <div className={isScrolled ? " hidden" : "fixed top-4 left-4 z-50"}>
          <Link to="/" className="flex items-center group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent to-accent-light opacity-70 blur-sm rounded-lg group-hover:opacity-100 transition-opacity duration-300"></div>
              <motion.div 
                className="px-2 py-1.5 bg-black-100 rounded-lg border border-gray-800 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg font-bold text-white-100">J<span className="text-accent">V</span></span>
              </motion.div>
            </div>
          </Link>
        </div>

        {/* Bottom Tab Navigation */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 w-[100%] mx-auto mb-0 rounded-full bg-black border-t border-gray-800 shadow-lg z-999999999"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-around items-center px-2 py-0">
            {allNavLinks.map((link, index) => (
              <Link 
                key={index} 
                to={link.path}
                className="relative py-2 px-3 flex flex-col items-center"
              >
                <motion.div
                  className="flex flex-col items-center"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Indicator dot for active link */}
                  {location.pathname === link.path && (
                    <motion.div 
                      className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-purple-500"
                      layoutId="activeIndicator"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Icon with background for active state */}
                  <div className={`p-2 rounded-full ${location.pathname === link.path ? 'bg-purple-500/20' : ''} transition-colors duration-300`}>
                    <span className={`text-xl ${location.pathname === link.path ? 'text-purple-500' : 'text-gray-400'}`}>
                      {link.icon}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <span className={`text-xs mt-1 font-medium ${location.pathname === link.path ? 'text-purple-500' : 'text-gray-400'}`}>
                    {link.title}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Navbar;
