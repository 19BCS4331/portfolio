import { Link } from 'react-router-dom';
import { FaEnvelope, FaHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSocialMedia, usePersonalInfo } from '@/hooks/useSupabase';
import { getIconComponent } from '@/utils/iconUtils';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Fetch data from Supabase
  const { data: socialMediaData, loading: socialMediaLoading } = useSocialMedia();
  const { data: personalInfo, loading: personalInfoLoading } = usePersonalInfo();

  const footerLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/about' },
    { title: 'Projects', path: '/projects' },
    { title: 'Contact', path: '/contact' },
  ];

  return (
    <footer className="relative bg-black text-white-100 pt-20 pb-10 z-50 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-tertiary to-black opacity-80 z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-gray-700 via-accent to-gray-700"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gray-700/10 blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gray-700/10 blur-3xl"></div>
      

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Logo and Description */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent to-accent-light opacity-70 blur-sm rounded-lg group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative px-3 py-2 bg-black-100 rounded-lg border border-gray-800">
                  <span className="text-2xl font-bold text-white-100">J<span className="text-accent">V</span></span>
                </div>
              </div>
              <span className="text-2xl font-bold ml-3 bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-300">Jacob Varghese</span>
            </Link>
            <p className="text-gray-400 max-w-md leading-relaxed">
              A modern portfolio showcasing exceptional digital experiences through innovative web development, thoughtful design, and cutting-edge technology integration.
            </p>
            
            {/* Social Links */}
            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4 text-white-100">Connect With Me</h3>
              <div className="flex space-x-4">
                {socialMediaLoading ? (
                  <div className="animate-pulse flex gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 bg-gray-800/50 rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  socialMediaData?.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="bg-black-200 hover:bg-accent p-3 rounded-lg text-white transition-all duration-300"
                      whileHover={{ y: -5, backgroundColor: '#7c3aed' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {getIconComponent(social.icon_name, { size: 20 })}
                    </motion.a>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-6">
            <h3 className="text-xl font-semibold relative inline-block">
              <span className="relative z-10">Navigation</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-accent opacity-50"></span>
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-accent flex items-center transition-colors duration-300"
                  >
                    <span className="mr-2 text-xs opacity-0 group-hover:opacity-100">→</span>
                    {link.title}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="text-xl font-semibold relative inline-block">
              <span className="relative z-10">Get In Touch</span>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-accent opacity-50"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 border border-gray-800 p-4 rounded-xl hover:border-purple-700/40 transition-colors duration-300">
                <FaEnvelope className="text-accent mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white-100">Email</p>
                  {personalInfoLoading ? (
                    <div className="animate-pulse h-4 w-32 bg-gray-800/50 rounded"></div>
                  ) : (
                    <a 
                      href={`mailto:${personalInfo?.email || 'contact@example.com'}`} 
                      className="text-gray-400 hover:text-accent transition-colors duration-300"
                    >
                      {personalInfo?.email || 'contact@example.com'}
                    </a>
                  )}
                </div>
              </div>
              <div className="p-4 bg-black-200/50 rounded-xl border border-gray-800">
                {personalInfoLoading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-3 w-full bg-gray-800/50 rounded"></div>
                    <div className="h-3 w-3/4 bg-gray-800/50 rounded"></div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">
                    {personalInfo?.availability_text || 'Interested in working together? Feel free to reach out for collaborations or just a friendly hello!'}
                  </p>
                )}
                <Link to="/contact" className="inline-block mt-3 text-accent hover:text-accent-light font-medium transition-colors duration-300">Contact Me →</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800/50 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
          <p>© {currentYear} Jacob Varghese. All rights reserved.</p>
          <p className="mt-2 md:mt-0 flex items-center">
            Made with <FaHeart className="text-accent mx-1" size={14} /> using React
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
