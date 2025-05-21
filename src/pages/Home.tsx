import { motion, useReducedMotion } from "framer-motion";
import {
  FaArrowRight,
  FaReact,
  FaNodeJs,
  FaServer,
  FaCode,
  FaShoppingCart,
  FaRobot,
  FaHeartbeat,
  FaUser,
  FaBrain,
  FaLock,
  FaBolt,
  FaPaperPlane,
  FaMobile,
  FaGitAlt,
} from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiNextdotjs,
  SiGraphql,
  SiDocker,
  SiFigma,
} from "react-icons/si";
import { Link } from "react-router-dom";
import SplitText from "../components/SplitText";
import Iridescence from "../components/Iridescence";
import { useEffect, useState, memo } from "react";
import CircularText from "../components/CircularText";
import ShinyText from "../components/ShinyText";
import {
  useServices,
  useTechnologies,
  useTechnologyCategories,
  useProjects,
} from "@/hooks/useSupabase";
import { useAIChat } from '../context/AIChatContext';

// Memoized background component to prevent unnecessary re-renders
const Background = memo(() => (
  <div
    style={{
      width: "100%",
      height: "100%",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    }}
  ></div>
));

// We'll remove the lazy loading for now since we don't have the AIChat component yet

const Home = () => {
  const prefersReducedMotion = useReducedMotion();
  const [hasScrolled, setHasScrolled] = useState(false);
  const { openChat } = useAIChat();

  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredTechs, setFilteredTechs] = useState<any[]>([]);

  const { data: services, loading, error } = useServices();

  const {
    data: technologies,
    loading: techLoading,
    error: techError,
  } = useTechnologies();
  const {
    data: categories,
    loading: catLoading,
    error: catError,
  } = useTechnologyCategories();

  const {
    data: projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();

  // Filter technologies based on selected category
  useEffect(() => {
    if (technologies.length > 0) {
      if (activeCategory === "All") {
        setFilteredTechs(technologies);
      } else {
        setFilteredTechs(
          technologies.filter((tech) => tech.category === activeCategory)
        );
      }
    }
  }, [technologies, activeCategory]);

  // Monitor scroll position to optimize animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100 && !hasScrolled) {
        setHasScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "FaCode":
        return <FaCode className="text-accent" />;
      case "FaMobile":
        return <FaMobile className="text-accent" />;
      case "FaServer":
        return <FaServer className="text-accent" />;

      default:
        return <FaCode className="text-accent" />;
    }
  };

  // Get icon component based on icon name
  const getTechIconComponent = (iconName: string, color: string) => {
    switch (iconName) {
      case "FaReact":
        return <FaReact style={{ color }} />;
      case "SiTypescript":
        return <SiTypescript style={{ color }} />;
      case "FaNodeJs":
        return <FaNodeJs style={{ color }} />;
      case "SiTailwindcss":
        return <SiTailwindcss style={{ color }} />;
      case "SiMongodb":
        return <SiMongodb style={{ color }} />;
      case "SiNextdotjs":
        return <SiNextdotjs style={{ color }} />;
      case "SiGraphql":
        return <SiGraphql style={{ color }} />;
      case "SiDocker":
        return <SiDocker style={{ color }} />;
      case "FaGitAlt":
        return <FaGitAlt style={{ color }} />;
      case "SiFigma":
        return <SiFigma style={{ color }} />;
      default:
        return <FaCode style={{ color }} />;
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Adjust animation settings based on user preferences and device performance
  const getAnimationSettings = () => {
    // Reduce animation complexity for users who prefer reduced motion
    if (prefersReducedMotion) {
      return {
        textDelay: 10,
        shouldAnimate: false,
      };
    }

    // Check if device is likely low-powered
    const isLowPoweredDevice =
      // Check hardware concurrency if available
      (typeof window.navigator.hardwareConcurrency !== "undefined" &&
        window.navigator.hardwareConcurrency < 4) ||
      // Fallback to user agent detection for mobile devices
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

    if (isLowPoweredDevice) {
      return {
        textDelay: 20,
        shouldAnimate: true,
      };
    }

    // Default animation settings for powerful devices
    return {
      textDelay: 50,
      shouldAnimate: true,
    };
  };

  // Get animation settings based on device and user preferences
  const { textDelay, shouldAnimate } = getAnimationSettings();

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Background />

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-16 md:pb-20 relative z-10">
        {/* GLOWING BACKGROUND PURPLE */}
        <div className="absolute top-20 right-1/3 w-72 md:w-96 h-72 md:h-96 bg-purple-700 opacity-10 rounded-full filter blur-[120px] animate-pulse-slow"></div>

        {/* Mobile-first layout with improved spacing and alignment */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Text content - optimized for mobile */}
          <div className="w-full lg:w-1/2 text-left">
            <motion.div
              className="mb-4 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {/* Heading with improved mobile layout - bigger on mobile */}
              <div className="display-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white-100 w-full">
                {/* Introduction line with proper spacing */}
                <div className="flex flex-wrap items-center gap-3 mb-3 ml-2">
                  <div className="text-purple-600 px-0 py-1 rounded-lg font-bold">
                    Hi,
                  </div>

                  <div className="text-white py-1 rounded-lg">
                    <SplitText
                      text="I'm"
                      delay={shouldAnimate ? textDelay : 0}
                      animationFrom={
                        shouldAnimate
                          ? { opacity: 0, transform: "translate3d(0,30px,0)" }
                          : { opacity: 1, transform: "translate3d(0,0,0)" }
                      }
                      animationTo={{
                        opacity: 1,
                        transform: "translate3d(0,0,0)",
                      }}
                      textAlign="left"
                    />
                  </div>
                </div>
                <div className="relative inline-block mb-1 w-full sm:w-auto">
                  <span className="absolute -inset-1 bg-accent opacity-20 blur-sm rounded-lg"></span>
                  <SplitText
                    text="Jacob Varghese"
                    className="text-accent text-4xl sm:text-4xl md:text-6xl lg:text-7xl"
                    delay={shouldAnimate ? textDelay * 1.5 : 0}
                    animationFrom={
                      shouldAnimate
                        ? { opacity: 0, transform: "translate3d(0,40px,0)" }
                        : { opacity: 1, transform: "translate3d(0,0,0)" }
                    }
                    animationTo={{
                      opacity: 1,
                      transform: "translate3d(0,0,0)",
                    }}
                    textAlign="center"
                  />
                </div>
              </div>
            </motion.div>

            {/* Subtitle with better mobile wrapping - bigger and more prominent */}
            <motion.div
              className="display-text text-2xl sm:text-2xl md:text-3xl mb-4 md:mb-10 font-medium text-white-100 w-full ml-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex flex-wrap gap-x-2 gap-y-0">
                <div className="text-white px-0 py-1 rounded-lg">I build,</div>
                <div className="text-purple-600 px-0 py-1 rounded-lg">
                  exceptional
                </div>
                <div className="text-white px-0 py-1 rounded-lg">digital</div>
                <div className="text-purple-600 px-0 py-1 rounded-lg">
                  experiences
                </div>
              </div>
            </motion.div>

            {/* Description paragraph with better mobile alignment */}
            <motion.div
              className="body-text text-secondary text-base sm:text-lg mb-6 md:mb-8 mx-auto lg:mx-0 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {hasScrolled || !shouldAnimate ? (
                // If user has scrolled or reduced motion is preferred, render plain text for better performance
                <p className="text-left">
                  I'm a full-stack developer passionate about crafting
                  exceptional digital experiences, from robust backend systems
                  to intuitive user interfaces. I specialize in building
                  accessible, human-centered products that merge functionality
                  with thoughtful design.
                </p>
              ) : (
                // Only use SplitText animation when in view and animations are enabled
                <SplitText
                  text="I'm a full-stack developer passionate about crafting exceptional digital experiences, from robust backend systems to intuitive user interfaces. I specialize in building accessible, human-centered products that merge functionality with thoughtful design."
                  delay={textDelay / 3}
                  animationFrom={{
                    opacity: 0,
                    transform: "translate3d(0,15px,0)",
                  }}
                  animationTo={{ opacity: 1, transform: "translate3d(0,0,0)" }}
                />
              )}
            </motion.div>

            {/* CTA Buttons with better mobile layout */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link to="/projects" className="w-full sm:w-auto">
                <motion.button
                  className="btn-primary px-6 py-3 flex items-center justify-center space-x-2 shadow-glow-button relative overflow-hidden group w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Animated particles inside button - inspired by ReactBits.dev */}
                  <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, Math.random() * 30 - 15],
                          x: [0, Math.random() * 30 - 15],
                          scale: [0, Math.random() + 0.5, 0],
                          opacity: [0, 0.7, 0],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatType: "loop",
                        }}
                      />
                    ))}
                  </div>
                  <span className="relative z-10">View My Work</span>
                  <motion.div
                    className="relative z-10 ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <FaArrowRight size={14} />
                  </motion.div>
                </motion.button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto">
                <motion.button
                  className="btn-outline px-6 py-3 border-accent hover:shadow-glow relative overflow-hidden group w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Contact Me</span>
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent group-hover:w-full transition-all duration-300"></div>
                </motion.button>
              </Link>
            </motion.div>

            {/* Availability indicator with better mobile alignment */}
            <motion.div
              className="mt-6 md:mt-8 flex justify-center lg:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center">
                <ShinyText
                  text="Available for freelance work"
                  disabled={false}
                  speed={4}
                  className="text-xs"
                />
              </div>
            </motion.div>
          </div>

          {/* Code sphere - optimized for mobile */}
          <motion.div
            className="w-full lg:w-1/2 mt-8 lg:mt-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
              {/* Interactive Code Sphere */}
              <div className="absolute inset-0 z-20">
                <CircularText
                  text=" REACTJS | NODEJS | POSTGRES | SQL | EXPRESS | GIT |"
                  onHover="speedUp"
                  spinDuration={20}
                  className="w-full h-full"
                />
              </div>
              <div
                className="relative z-10 rounded-full aspect-square overflow-hidden"
                style={{
                  boxShadow: "0 0 40px rgba(139, 92, 246, 0.3)",
                  background:
                    "radial-gradient(circle at center, rgba(20, 20, 30, 0.8) 0%, rgba(10, 10, 15, 0.9) 70%)",
                }}
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-black opacity-60 z-30"></div>
                <Iridescence
                  color={[0.7, 0.2, 1]}
                  mouseReact={false}
                  amplitude={0.2}
                  speed={0.4}
                />

                {/* Central logo/initials */}
                <motion.div
                  className="absolute inset-0 z-30 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 1.2, ease: "easeOut" }}
                >
                  <div className="relative">
                    {/* Glowing ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-light"
                      style={{ filter: "blur(15px)", opacity: 0.6 }}
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.4, 0.6, 0.4],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Central initials */}
                    <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white-100 relative z-10 flex flex-col items-center justify-center">
                      <span className="text-2xl sm:text-3xl md:text-4xl">
                        Full-Stack
                      </span>
                      <div className="text-xs mt-2 tracking-widest text-accent-light">
                        Developer
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative overflow-hidden z-40">
        {/* Background elements */}
        <div className="absolute top-50 left-1/5 w-96 h-96 bg-purple-700 opacity-10 rounded-full filter blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent-light opacity-10 rounded-full filter blur-[100px] animate-float"></div>

        {/* Floating code elements */}
        <div className="absolute top-20 left-10 opacity-30 animate-float-slow hidden md:block">
          <div className="text-xs font-mono text-accent bg-black-100 p-3 rounded-lg border border-dark-border shadow-glow">
            &lt;div className="feature"&gt;
            <br />
            &nbsp;&nbsp;&#123;renderSkills()&#125;
            <br />
            &lt;/div&gt;
          </div>
        </div>
        <div className="absolute bottom-10 right-10 opacity-30 animate-float-reverse hidden md:block">
          <div className="text-xs font-mono text-accent bg-black-100 p-3 rounded-lg border border-dark-border shadow-glow">
            function createExperience() &#123;
            <br />
            &nbsp;&nbsp;return amazing;
            <br />
            &#125;
          </div>
        </div>

        {/* Additional floating elements */}
        <div className="absolute top-1/3 right-20 opacity-30 animate-float hidden md:block">
          <div className="w-12 h-12 rounded-full border-2 border-accent flex items-center justify-center">
            <div className="text-accent text-xl">&lt;/&gt;</div>
          </div>
        </div>
        <div className="absolute bottom-1/3 left-20 opacity-30 animate-float-reverse hidden md:block">
          <div className="w-10 h-10 rounded-lg border-2 border-accent-light flex items-center justify-center">
            <div className="text-accent-light text-xl">{}</div>
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-block mb-4">
              <ShinyText
                text="What I Offer"
                disabled={false}
                speed={4}
                className="text-sm"
              />
            </div>

            <h2 className="display-text text-4xl md:text-6xl font-bold text-white-100 mb-8">
              <span className="relative inline-block">
                <span className="absolute -inset-1 bg-accent opacity-10 blur-md rounded-lg"></span>
                Specialized
              </span>{" "}
              <span className="text-accent relative inline-block">
                Skills
                <span className="absolute -inset-1 bg-accent opacity-20 blur-md rounded-lg"></span>
              </span>{" "}
              & Services
            </h2>

            <p className="body-text text-secondary max-w-2xl mx-auto text-lg">
              I offer a comprehensive suite of development services to bring
              your digital vision to life with precision and creativity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {loading &&
              // Loading skeletons
              [...Array(3)].map((_, index) => (
                <motion.div
                  key={`service-skeleton-${index}`}
                  variants={itemVariants}
                  className="service-card bg-black-200/30 backdrop-blur-sm border border-gray-800 rounded-xl p-8 relative overflow-hidden hover:border-accent/50 transition-all duration-300 animate-pulse"
                >
                  <div className="h-10 w-10 rounded-lg bg-gray-700 mb-6"></div>
                  <div className="h-7 bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-24 bg-gray-700/50 rounded w-full mb-6"></div>
                  <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-6 bg-gray-700/30 rounded-full w-16"
                      ></div>
                    ))}
                  </div>
                </motion.div>
              ))}

            {error && (
              <div className="col-span-3 text-center py-10">
                <p className="text-red-500">
                  Failed to load services. Please try again later.
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              services.map((feature, index) => (
                <motion.div
                  key={index}
                  className="perspective-card relative group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover="hover"
                >
                  {/* 3D Card Effect */}
                  <motion.div
                    className="bg-black-100 p-8 rounded-2xl border border-dark-border relative overflow-hidden h-full"
                    variants={{
                      hover: {
                        rotateX: 5,
                        rotateY: 10,
                        boxShadow: "0 20px 30px -10px rgba(139, 92, 246, 0.3)",
                        transition: { duration: 0.3 },
                      },
                    }}
                  >
                    {/* Background Icon */}
                    <div className="absolute -bottom-5 -right-5 text-8xl font-bold text-accent opacity-5">
                      {feature.bg_icon}
                    </div>

                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute -inset-0.5 bg-gradient-to-br from-accent to-accent-light opacity-0 blur-md rounded-2xl"
                      variants={{
                        hover: { opacity: 0.3, transition: { duration: 0.3 } },
                      }}
                    ></motion.div>

                    <div className="relative z-10">
                      {/* Icon with animated background */}
                      <motion.div
                        className="mb-8 text-4xl w-16 h-16 rounded-2xl flex items-center justify-center relative"
                        variants={{
                          hover: { scale: 1.1, transition: { duration: 0.3 } },
                        }}
                      >
                        <div className="absolute inset-0 bg-accent opacity-10 rounded-xl"></div>
                        <div className="text-3xl">
                          {getIconComponent(feature.icon_name)}
                        </div>
                      </motion.div>

                      <h3 className="text-white-100 text-2xl font-medium mb-4">
                        {feature.title}
                      </h3>

                      <p className="body-text text-secondary mb-6">
                        {feature.description}
                      </p>

                      {/* Skills tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {feature.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-black-200 rounded-full text-xs text-accent-light"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-dark-border">
                        <motion.a
                          href="#"
                          className="text-accent font-medium inline-flex items-center group"
                          variants={{
                            hover: { x: 5, transition: { duration: 0.3 } },
                          }}
                        >
                          <span>Explore projects</span>
                          <FaArrowRight
                            size={12}
                            className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
                          />
                        </motion.a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 bg-black-100 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-accent opacity-5 rounded-full filter blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-light opacity-5 rounded-full filter blur-[120px] animate-float"></div>

        {/* Decorative code elements */}
        <div className="absolute top-20 right-10 opacity-20 hidden lg:block">
          <div className="text-xs font-mono text-accent">
            const skills = [<br />
            &nbsp;&nbsp;'React',
            <br />
            &nbsp;&nbsp;'TypeScript',
            <br />
            &nbsp;&nbsp;// ...
            <br />
            ];
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block mb-4">
              <ShinyText
                text="Technologies"
                disabled={false}
                speed={4}
                className="text-sm"
              />
            </div>

            <h2 className="display-text text-4xl md:text-5xl font-bold text-white-100 mb-6">
              My{" "}
              <span className="text-accent relative inline-block">
                Tech Stack
                <span className="absolute -inset-1 bg-accent opacity-20 blur-md rounded-lg"></span>
              </span>
            </h2>
            <p className="body-text text-secondary text-lg max-w-2xl mx-auto">
              These are the technologies I work with to bring ideas to life
            </p>
          </motion.div>

          {/* Tech categories */}
          <div className="mb-16">
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {catLoading ? (
                // Loading skeletons for categories
                [...Array(4)].map((_, i) => (
                  <div
                    key={`category-skeleton-${i}`}
                    className="h-10 w-20 bg-gray-700/30 rounded-full animate-pulse"
                  ></div>
                ))
              ) : catError ? (
                <div className="text-red-500">Failed to load categories</div>
              ) : (
                ["All", ...categories].map((category, i) => (
                  <motion.button
                    key={i}
                    className={`px-6 py-2 rounded-full text-sm font-medium bg-black-200 text-gray-400 hover:text-white hover:bg-gray-400/10 transition-all cursor-pointer border border-gray-400`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </motion.button>
                ))
              )}
            </div>
          </div>

          <div className="tech-grid max-w-6xl mx-auto">
            {techLoading ? (
              // Loading skeletons for technologies
              [...Array(10)].map((_, index) => (
                <motion.div
                  key={`tech-skeleton-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="tech-item animate-pulse bg-black-100/50 rounded-xl p-6 flex flex-col items-center"
                >
                  <div className="bg-gray-700/50 h-16 w-16 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-700 rounded w-20 mb-2 mx-auto"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-24 mx-auto mb-3"></div>
                  <div className="h-2 bg-gray-700/30 rounded-full w-full mb-2"></div>
                  <div className="h-4 bg-gray-700/20 rounded w-32 mx-auto"></div>
                </motion.div>
              ))
            ) : techError ? (
              <div className="col-span-full text-center py-10">
                <p className="text-red-500">
                  Failed to load technologies. Please try again later.
                </p>
              </div>
            ) : (
              filteredTechs.map((tech, index) => {
                const iconComponent = getTechIconComponent(
                  tech.icon_name,
                  tech.color
                );

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="tech-item"
                  >
                    <div className="tech-content">
                      <div className="tech-front">
                        <div
                          className="tech-icon-wrapper"
                          style={{
                            fontSize: "1.5rem",
                            background: `linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)`,
                            boxShadow: `0 0 20px rgba(${
                              tech.color === "#ffffff"
                                ? "255,255,255"
                                : tech.color
                                    .replace("#", "")
                                    .match(/.{2}/g)
                                    ?.map((c: any) => parseInt(c, 16))
                                    .join(",") || "139,92,246"
                            }, 0.15)`,
                          }}
                        >
                          {iconComponent}
                        </div>
                        <h3 className="tech-name">{tech.name}</h3>
                        <div className="tech-category">{tech.category}</div>
                        <div className="tech-level-wrapper">
                          <div className="tech-level-bar">
                            <motion.div
                              className="tech-level-fill"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${tech.level}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              style={{ backgroundColor: tech.color }}
                            />
                          </div>
                          <div className="tech-level-text">{tech.level}%</div>
                        </div>
                      </div>
                      <div className="tech-back">
                        <h3 className="tech-name">{tech.name}</h3>
                        <div className="tech-stats">
                          <div className="tech-stat">
                            <div className="tech-stat-label">Experience</div>
                            <div className="tech-stat-value">
                              {tech.experience}
                            </div>
                          </div>
                          <div className="tech-stat">
                            <div className="tech-stat-label">Projects</div>
                            <div className="tech-stat-value">
                              {tech.projects}
                            </div>
                          </div>
                        </div>
                        <p className="tech-description">{tech.description}</p>
                        <div className="tech-more">
                          <a href="#" className="tech-link">
                            View Projects
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-28 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-black to-black-100 opacity-50"></div>
        <div className="absolute top-40 right-40 w-96 h-96 bg-accent opacity-5 rounded-full filter blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-40 left-40 w-80 h-80 bg-accent-light opacity-5 rounded-full filter blur-[100px] animate-float"></div>

        {/* Decorative code elements */}
        <div className="absolute top-20 left-10 opacity-20 animate-float-slow hidden lg:block">
          <div className="text-xs font-mono text-accent">
            const projects = [<br />
            &nbsp;&nbsp;// My best work
            <br />
            ];
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="relative mb-24">
            {/* Decorative elements */}
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full bg-accent opacity-5 filter blur-[50px] animate-pulse-slow"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -z-10 opacity-10">
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="animate-spin-slow"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="#8B5CF6"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="50"
                  stroke="#8B5CF6"
                  strokeWidth="1"
                  strokeDasharray="8 8"
                />
              </svg>
            </div>

            <motion.div
              className="text-center relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-block mb-4 perspective-3d"
                whileInView={{
                  rotateX: [0, 10, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }}
              >
                <ShinyText
                  text="My Work"
                  disabled={false}
                  speed={4}
                  className="text-sm"
                />
              </motion.div>

              <div className="perspective-3d">
                <motion.h2
                  className="display-text text-4xl md:text-6xl font-bold text-white-100 mb-6 relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <span className="relative inline-block mr-5">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      viewport={{ once: true }}
                    >
                      Featured
                    </motion.span>{" "}
                  </span>
                  <motion.span
                    className="text-accent relative inline-block"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.05,
                      textShadow: "0 0 15px rgba(139, 92, 246, 0.7)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    Projects
                    <span className="absolute -inset-1 bg-accent opacity-20 blur-md rounded-lg"></span>
                    {/* Animated glow effect */}
                    <motion.div
                      className="absolute -inset-2 rounded-lg opacity-0"
                      initial={{ opacity: 0 }}
                      whileInView={{
                        opacity: [0, 0.4, 0],
                        scale: [0.8, 1.2, 0.8],
                        transition: {
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "loop",
                        },
                      }}
                      viewport={{ once: true }}
                      style={{
                        background:
                          "radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(139, 92, 246, 0) 70%)",
                        filter: "blur(10px)",
                      }}
                    />
                  </motion.span>
                </motion.h2>
              </div>

              <motion.p
                className="body-text text-secondary max-w-2xl mx-auto text-lg relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.7 }}
                >
                  Explore my portfolio of innovative projects that showcase my
                  expertise and creative problem-solving abilities.
                </motion.span>

                {/* Animated underline */}
                <motion.div
                  className="h-0.5 w-0 bg-accent opacity-30 absolute bottom-0 left-1/2 transform -translate-x-1/2"
                  initial={{ width: 0 }}
                  whileInView={{ width: "100px" }}
                  transition={{ duration: 1, delay: 1.2 }}
                  viewport={{ once: true }}
                />
              </motion.p>
            </motion.div>

            {/* Floating code snippets */}
            <div className="absolute -bottom-10 -left-10 opacity-20 animate-float-slow hidden lg:block">
              <div className="text-xs font-mono text-accent">
                const <span className="text-green-400">featured</span> =
                projects.<span className="text-yellow-400">filter</span>(<br />
                &nbsp;&nbsp;p =&gt; p.
                <span className="text-yellow-400">rating</span> &gt; 4.5
                <br />
                );
              </div>
            </div>

            <div className="absolute -bottom-10 -right-10 opacity-20 animate-float hidden lg:block">
              <div className="text-xs font-mono text-accent">
                <span className="text-purple-400">function</span>{" "}
                <span className="text-yellow-400">showcase</span>() {`{`}
                <br />
                &nbsp;&nbsp;<span className="text-purple-400">return</span>{" "}
                <span className="text-green-400">bestWork</span>;<br />
                {`}`}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {projectsLoading &&
              // Loading skeletons
              [...Array(3)].map((_, index) => (
                <motion.div
                  key={`project-skeleton-${index}`}
                  className="project-card group relative h-full perspective-3d"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="bg-black rounded-2xl border border-dark-border overflow-hidden h-full flex flex-col relative preserve-3d animate-pulse">
                    <div className="aspect-video bg-black-200 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gray-700/20"></div>
                    </div>
                    <div className="h-1 w-full bg-gray-700/30"></div>
                    <div className="p-8 flex-grow flex flex-col">
                      <div className="h-7 bg-gray-700/40 rounded w-3/4 mb-4"></div>
                      <div className="h-20 bg-gray-700/20 rounded w-full mb-6"></div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="h-6 bg-gray-700/30 rounded-full w-16"
                          ></div>
                        ))}
                      </div>
                      <div className="h-6 bg-gray-700/40 rounded w-32 mt-auto"></div>
                    </div>
                  </div>
                </motion.div>
              ))}

            {projectsError && (
              <div className="col-span-3 text-center py-10">
                <p className="text-red-500">
                  Failed to load projects. Please try again later.
                </p>
              </div>
            )}

            {!projectsLoading &&
              !projectsError &&
              projects.map((project, index) => {
                // Get icon component based on icon name
                const getProjectIcon = (iconName: string) => {
                  switch (iconName) {
                    case "FaShoppingCart":
                      return <FaShoppingCart />;
                    case "FaRobot":
                      return <FaRobot />;
                    case "FaHeartbeat":
                      return <FaHeartbeat />;
                    case "FaUser":
                      return <FaUser />;
                    case "FaBrain":
                      return <FaBrain />;
                    case "FaLock":
                      return <FaLock />;
                    case "FaBolt":
                      return <FaBolt />;
                    default:
                      return <FaCode />;
                  }
                };

                const projectIcon = getProjectIcon(project.icon_name);

                return (
                  <motion.div
                    key={project.id}
                    className="project-card group relative h-full perspective-3d"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover="hover"
                  >
                    {/* Floating particles */}
                    <div className="absolute -z-10 inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute rounded-full opacity-60"
                          style={{
                            backgroundColor: project.color,
                            width: `${Math.random() * 6 + 2}px`,
                            height: `${Math.random() * 6 + 2}px`,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animation: `particle-float ${
                              Math.random() * 3 + 2
                            }s infinite ease-in-out ${Math.random() * 2}s`,
                            filter: "blur(1px)",
                          }}
                        />
                      ))}
                    </div>

                    <motion.div
                      className="project-card-inner bg-black rounded-2xl border border-dark-border overflow-hidden h-full flex flex-col relative preserve-3d"
                      variants={{
                        hover: {
                          y: -15,
                          rotateY: 5,
                          rotateX: 5,
                          boxShadow: `0 25px 30px -12px rgba(0, 0, 0, 0.6), 0 0 25px -5px ${project.color}33`,
                          transition: { duration: 0.4 },
                        },
                      }}
                    >
                      {/* Glowing border effect */}
                      <div
                        className="absolute -z-10 inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(circle at 50% 50%, ${project.color}22 0%, transparent 70%)`,
                          filter: "blur(20px)",
                        }}
                      />

                      {/* Project header with icon */}
                      <div className="project-header relative">
                        {/* Background gradient */}
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            background: `linear-gradient(135deg, ${project.color}22 0%, ${project.color}00 100%)`,
                          }}
                        ></div>

                        {/* Project image/placeholder with 3D effect */}
                        <div className="aspect-video bg-black-200 relative overflow-hidden">
                          {/* 3D grid background */}
                          <div
                            className="absolute inset-0 grid-bg opacity-20"
                            style={
                              {
                                "--grid-color": project.color,
                              } as React.CSSProperties
                            }
                          ></div>

                          <div className="absolute inset-0 flex items-center justify-center">
                            <motion.div
                              className="text-5xl relative z-10"
                              style={{ color: project.color }}
                              variants={{
                                hover: {
                                  scale: 1.3,
                                  rotateZ: 10,
                                  filter: `drop-shadow(0 0 20px ${project.color}66)`,
                                  transition: { duration: 0.5, type: "spring" },
                                },
                              }}
                            >
                              {projectIcon}

                              {/* Icon glow effect */}
                              <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                  filter: `blur(15px)`,
                                  background: project.color,
                                  transform: "scale(0.8)",
                                }}
                              />
                            </motion.div>
                          </div>

                          {/* Hover overlay with 3D effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent opacity-0 flex items-center justify-center backdrop-blur-sm"
                            variants={{
                              hover: {
                                opacity: 0.9,
                                transition: { duration: 0.4 },
                              },
                            }}
                          >
                            <motion.div
                              className="relative"
                              variants={{
                                hover: {
                                  z: 30,
                                  transition: { duration: 0.3, delay: 0.1 },
                                },
                              }}
                            ></motion.div>
                          </motion.div>
                        </div>

                        {/* Animated glowing accent line */}
                        <div className="h-1 w-full overflow-hidden">
                          <motion.div
                            className="h-full"
                            style={{
                              background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
                            }}
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatType: "loop",
                              ease: "linear",
                              repeatDelay: 1,
                            }}
                          ></motion.div>
                        </div>
                      </div>

                      <div className="p-8 flex-grow flex flex-col">
                        <motion.h3
                          className="text-white-100 text-2xl font-bold mb-3 flex items-center"
                          variants={{
                            hover: {
                              color: project.color,
                              transition: { duration: 0.3 },
                            },
                          }}
                        >
                          <span className="mr-2">{project.title}</span>
                          <motion.div
                            className="w-2 h-2 rounded-full bg-accent inline-block"
                            style={{ backgroundColor: project.color }}
                            variants={{
                              hover: {
                                scale: [1, 1.5, 1],
                                transition: { duration: 1, repeat: Infinity },
                              },
                            }}
                          />
                        </motion.h3>

                        <p className="body-text text-secondary mb-6 flex-grow">
                          {project.description}
                        </p>

                        <div className="mt-auto">
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.tags.map((tag, tagIndex) => (
                              <motion.span
                                key={tagIndex}
                                className="text-xs bg-black-200 px-3 py-1 rounded-full border border-dark-border relative overflow-hidden"
                                style={{
                                  color: project.color,
                                  borderColor: `${project.color}44`,
                                }}
                                variants={{
                                  hover: {
                                    y: -5,
                                    x: tagIndex * 3,
                                    transition: {
                                      duration: 0.3,
                                      delay: tagIndex * 0.06,
                                    },
                                  },
                                }}
                                whileHover={{
                                  backgroundColor: `${project.color}22`,
                                  y: -8,
                                  transition: { duration: 0.2 },
                                }}
                              >
                                <span className="relative z-10">{tag}</span>

                                {/* Tag glow effect */}
                                <motion.div
                                  className="absolute inset-0 opacity-0"
                                  initial={{ opacity: 0 }}
                                  whileHover={{
                                    opacity: 0.2,
                                    transition: { duration: 0.2 },
                                  }}
                                  style={{ background: project.color }}
                                />
                              </motion.span>
                            ))}
                          </div>

                          <motion.a
                            href={project.demo_url || project.github_url || "#"}
                            className="text-accent font-medium inline-flex items-center relative group/link"
                            variants={{
                              hover: { x: 5, transition: { duration: 0.3 } },
                            }}
                            style={{ color: project.color }}
                          >
                            <span className="relative">View Project</span>

                            {/* Underline effect */}
                            <div
                              className="absolute bottom-0 left-0 w-0 h-0.5 group-hover/link:w-full transition-all duration-300"
                              style={{ background: project.color }}
                            />

                            <motion.div
                              className="ml-2 relative"
                              variants={{
                                hover: {
                                  x: 8,
                                  transition: {
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                  },
                                },
                              }}
                            >
                              <FaArrowRight size={14} />
                            </motion.div>
                          </motion.a>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
          </div>

          <motion.div
            className="text-center mt-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Link to="/projects">
              <motion.button
                className="btn-primary px-8 py-3 text-lg shadow-glow transition-all ease-in-out duration-300"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 25px rgba(139, 92, 246, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center">
                  <span className="mr-2">View All Projects</span>
                  <FaArrowRight size={14} />
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AI Assistant Preview */}
      <section className="py-28 relative overflow-hidden">
        {/* Neural network background */}
        <div className="absolute inset-0 neural-network-bg opacity-10"></div>

        {/* Gradient background elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black via-black-100 to-black-200 opacity-70"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent opacity-10 rounded-full filter blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-light opacity-10 rounded-full filter blur-[100px] animate-float"></div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-accent opacity-10 rounded-full animate-spin-slow"></div>
        <div
          className="absolute bottom-40 left-40 w-24 h-24 border border-accent-light opacity-10 rounded-full animate-spin-slow"
          style={{ animationDirection: "reverse" }}
        ></div>

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-40"
              style={{
                backgroundColor: i % 2 === 0 ? "#8B5CF6" : "#A78BFA",
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `particle-float ${
                  Math.random() * 3 + 2
                }s infinite ease-in-out ${Math.random() * 2}s`,
                filter: "blur(1px)",
              }}
            ></div>
          ))}
        </div>

        {/* Animated code snippets */}
        <div className="absolute top-10 left-10 opacity-20 animate-float-slow hidden lg:block">
          <div className="text-xs font-mono text-accent">
            <span className="text-purple-400">class</span>{" "}
            <span className="text-yellow-400">AIAssistant</span> {`{`}
            <br />
            &nbsp;&nbsp;<span className="text-green-400">
              constructor
            </span>() {`{`}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;this.
            <span className="text-blue-400">model</span> ={" "}
            <span className="text-orange-400">"deepseek-v1"</span>;<br />
            &nbsp;&nbsp;{`}`}
            <br />
            {`}`}
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="flex flex-col lg:flex-row items-center gap-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="inline-block mb-4 perspective-3d">
                <motion.div
                  className="px-4 py-1 rounded-full bg-accent bg-opacity-10 text-accent text-sm font-medium inline-flex items-center"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
                    transition: { duration: 0.2 },
                  }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-accent mr-2"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <FaRobot className="mr-2" /> AI Integration
                </motion.div>
              </div>

              <motion.h2
                className="display-text text-3xl md:text-5xl font-bold text-white-100 mb-6 relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Chat with my{" "}
                <motion.span
                  className="text-accent relative inline-block"
                  whileHover={{
                    scale: 1.05,
                    textShadow: "0 0 15px rgba(139, 92, 246, 0.7)",
                    transition: { duration: 0.2 },
                  }}
                >
                  AI Assistant
                  <span className="absolute -inset-1 bg-accent opacity-20 blur-sm rounded-lg"></span>
                  {/* Animated glow effect */}
                  <motion.div
                    className="absolute -inset-2 rounded-lg opacity-0"
                    initial={{ opacity: 0 }}
                    whileInView={{
                      opacity: [0, 0.4, 0],
                      scale: [0.8, 1.2, 0.8],
                      transition: {
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "loop",
                      },
                    }}
                    viewport={{ once: true }}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, rgba(139, 92, 246, 0) 70%)",
                      filter: "blur(10px)",
                    }}
                  />
                </motion.span>
              </motion.h2>

              <motion.p
                className="body-text text-secondary mb-8 text-lg max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Experience the power of AI with my custom-built assistant
                powered by the OpenRouter. Get instant answers, generate
                content, and explore my portfolio interactively.
              </motion.p>

              <div className="space-y-6 mb-8">
                {[
                  {
                    icon: <FaBrain className="text-accent" />,
                    title: "Advanced AI",
                    description:
                      "Powered by state-of-the-art language models via OpenRouter",
                    delay: 0.5,
                  },
                  {
                    icon: <FaLock className="text-accent" />,
                    title: "Secure Conversations",
                    description:
                      "Your interactions are private and not stored permanently",
                    delay: 0.6,
                  },
                  {
                    icon: <FaBolt className="text-accent" />,
                    title: "Instant Responses",
                    description:
                      "Get immediate answers to your questions about my work",
                    delay: 0.7,
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start feature-card"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: feature.delay }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5, transition: { duration: 0.2 } }}
                  >
                    <motion.div
                      className="h-10 w-10 bg-black-100 rounded-lg flex items-center justify-center mr-4 border border-dark-border shadow-glow-sm relative overflow-hidden"
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      {feature.icon}

                      {/* Icon glow effect */}
                      <motion.div
                        className="absolute inset-0 opacity-0"
                        initial={{ opacity: 0 }}
                        whileHover={{
                          opacity: 0.2,
                          transition: { duration: 0.2 },
                        }}
                        style={{
                          background:
                            "radial-gradient(circle, rgba(139, 92, 246, 0.8) 0%, rgba(139, 92, 246, 0) 70%)",
                        }}
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-white-100 font-medium mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-secondary text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                className="btn-primary px-8 py-3 text-lg shadow-glow transition-all ease-in-out duration-300"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 25px rgba(139, 92, 246, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                viewport={{ once: true }}
                onClick={openChat}
              >
                <span className="relative z-10 flex items-center">
                  <span className="mr-2">Try It Now</span>
                  <motion.div
                    animate={{
                      x: [0, 5, 0],
                      transition: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    }}
                  >
                    <FaArrowRight size={14} />
                  </motion.div>
                </span>

                {/* Button hover effect */}
                <motion.div
                  className="absolute inset-0 opacity-0"
                  initial={{ x: "-100%" }}
                  whileHover={{
                    x: "100%",
                    opacity: 0.2,
                    transition: { duration: 1, ease: "easeInOut" },
                  }}
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.8), transparent)",
                  }}
                />
              </motion.button>
            </motion.div>

            <motion.div
              className="lg:w-1/2 perspective-3d"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-black-100/60 backdrop-blur-md rounded-2xl border border-dark-border p-8 shadow-glow-lg relative overflow-hidden ai-chat-card"
                whileHover={{
                  y: -10,
                  rotateY: 2,
                  rotateX: 2,
                  boxShadow:
                    "0 25px 30px -12px rgba(0, 0, 0, 0.6), 0 0 25px -5px rgba(139, 92, 246, 0.3)",
                  transition: { duration: 0.4 },
                }}
              >
                {/* Glowing accent in the background */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent opacity-10 rounded-full filter blur-[50px] animate-pulse-slow"></div>

                {/* Circuit board pattern */}
                <div className="absolute inset-0 circuit-pattern opacity-5"></div>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <motion.div
                      className="h-12 w-12 bg-accent bg-opacity-20 rounded-full flex items-center justify-center text-accent mr-4 shadow-glow-sm relative"
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0 0 15px rgba(139, 92, 246, 0.4)",
                        transition: { duration: 0.2 },
                      }}
                    >
                      <FaRobot size={20} />

                      {/* Holographic effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0) 100%)",
                          borderTop: "1px solid rgba(139, 92, 246, 0.3)",
                          borderLeft: "1px solid rgba(139, 92, 246, 0.3)",
                        }}
                        animate={{
                          opacity: [0.5, 0.8, 0.5],
                          rotate: [0, 360],
                          transition: {
                            duration: 10,
                            repeat: Infinity,
                            ease: "linear",
                          },
                        }}
                      />
                    </motion.div>
                    <div>
                      <div className="text-white-100 font-medium text-lg">
                        AI Assistant
                      </div>
                      <div className="text-xs text-secondary">
                        Powered by OpenRouter
                      </div>
                    </div>
                  </div>
                  <motion.div
                    className="flex items-center space-x-2 bg-black-200/50 px-3 py-1 rounded-full"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(139, 92, 246, 0)",
                        "0 0 10px rgba(139, 92, 246, 0.3)",
                        "0 0 0px rgba(139, 92, 246, 0)",
                      ],
                      transition: { duration: 2, repeat: Infinity },
                    }}
                  >
                    <motion.div
                      className="h-2 w-2 rounded-full bg-green-500"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 1, 0.7],
                        transition: { duration: 1.5, repeat: Infinity },
                      }}
                    />
                    <div className="text-xs text-secondary">Online</div>
                  </motion.div>
                </div>

                <div className="bg-black-200/50 rounded-xl p-6 mb-6 border border-dark-border relative">
                  {/* Subtle grid pattern */}
                  <div className="absolute inset-0 chat-grid-pattern opacity-5"></div>

                  <motion.div
                    className="flex items-start mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="h-10 w-10 bg-accent bg-opacity-20 rounded-full flex items-center justify-center text-accent mr-4 flex-shrink-0 shadow-glow-sm"
                      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                    >
                      <FaRobot size={16} />
                    </motion.div>
                    <div className="bg-black-100/70 rounded-lg rounded-tl-none p-4 max-w-[80%] ai-message">
                      <div className="text-white-100 mb-2 typing-effect">
                        Hello! I'm Jacob's AI assistant. How can I help you
                        explore his portfolio today?
                      </div>
                      <div className="text-xs text-secondary">Just now</div>
                    </div>
                  </motion.div>

                  <motion.div
                    className="flex items-start justify-end mb-6"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-accent bg-opacity-10 rounded-lg rounded-tr-none p-4 max-w-[80%] user-message">
                      <div className="text-white-100 mb-2">
                        Can you tell me about Jacob's experience with React?
                      </div>
                      <div className="text-xs text-secondary">Just now</div>
                    </div>
                    <motion.div
                      className="h-10 w-10 bg-accent-light bg-opacity-10 rounded-full flex items-center justify-center text-accent-light ml-4 flex-shrink-0"
                      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                    >
                      <FaUser size={16} />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="flex items-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="h-10 w-10 bg-accent bg-opacity-20 rounded-full flex items-center justify-center text-accent mr-4 flex-shrink-0 shadow-glow-sm relative"
                      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                    >
                      <FaRobot size={16} />

                      {/* Thinking animation */}
                      <motion.div
                        className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full opacity-0"
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0.8, 1.2, 0.8],
                          transition: {
                            duration: 1.5,
                            repeat: Infinity,
                            repeatDelay: 0.5,
                          },
                        }}
                      />
                    </motion.div>
                    <div className="bg-black-100/70 rounded-lg rounded-tl-none p-4 max-w-[80%] ai-message">
                      <div className="text-white-100 mb-2 typing-effect">
                        Jacob has over 5 years of experience with React, having
                        built numerous projects including e-commerce platforms,
                        dashboards, and interactive web applications. Would you
                        like to see some specific React projects from his
                        portfolio?
                      </div>
                      <div className="text-xs text-secondary">Just now</div>
                    </div>
                  </motion.div>
                </div>

                <div className="relative">
                  <motion.input
                    type="text"
                    className="w-full bg-black-200/50 border border-dark-border rounded-xl px-6 py-4 text-white-100 focus:border-accent focus:outline-none pr-14 chat-input"
                    placeholder="Ask me anything about Jacob's work..."
                    whileFocus={{
                      boxShadow: "0 0 15px rgba(139, 92, 246, 0.3)",
                      borderColor: "rgba(139, 92, 246, 0.5)",
                      transition: { duration: 0.2 },
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.1 }}
                    viewport={{ once: true }}
                  />
                  <motion.button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 bg-accent rounded-full flex items-center justify-center text-white-100 hover:bg-accent-light transition-colors duration-300 shadow-glow-sm"
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 0 15px rgba(139, 92, 246, 0.5)",
                      transition: { duration: 0.2 },
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        transition: {
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        },
                      }}
                    >
                      <FaPaperPlane size={14} />
                    </motion.div>
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
