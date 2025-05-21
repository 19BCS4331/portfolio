import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { getIconComponent } from "@/utils/iconUtils";
import {
  FaDownload,
  FaEnvelope,
  FaGraduationCap,
  FaBriefcase,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaChevronRight,
  FaCode,
} from "react-icons/fa";
import {
  useAboutSkills,
  useExperiences,
  useEducation,
  usePersonalInfo,
  useSocialMedia,
} from "@/hooks/useSupabase";

const About = () => {
  const [activeTab, setActiveTab] = useState("skills");
  const heroRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const educationRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Fetch data from Supabase
  const {
    data: skillsData,
    loading: skillsLoading,
    error: skillsError,
  } = useAboutSkills();
  const {
    data: experiencesData,
    loading: experiencesLoading,
    error: experiencesError,
  } = useExperiences();
  const {
    data: educationData,
    loading: educationLoading,
    error: educationError,
  } = useEducation();
  const {
    data: personalInfo,
    loading: personalInfoLoading,
    error: personalInfoError,
  } = usePersonalInfo();
  const {
    data: socialMediaData,
    loading: socialMediaLoading,
    error: socialMediaError,
  } = useSocialMedia();

  const { scrollY } = useScroll();
  // Update these lines to improve the section detection
  // Replace the useInView hooks and the related useEffect with this:

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150; // Adjust this offset based on your navbar height

      // Get positions of each section
      const bioPosition = bioRef.current?.offsetTop || 0;
      const skillsPosition = skillsRef.current?.offsetTop || 0;
      const experiencePosition = experienceRef.current?.offsetTop || 0;
      const educationPosition = educationRef.current?.offsetTop || 0;

      // Determine which section is active based on scroll position
      if (scrollPosition >= educationPosition) {
        setActiveTab("education");
      } else if (scrollPosition >= experiencePosition) {
        setActiveTab("experience");
      } else if (scrollPosition >= skillsPosition) {
        setActiveTab("skills");
      } else if (scrollPosition >= bioPosition) {
        setActiveTab("bio");
      } else {
        setActiveTab("bio"); // Default to bio when at the top
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check
    handleScroll();

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Parallax effects
  const heroY = useTransform(scrollY, [0, 500], [0, -150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Scroll to section with offset for sticky navbar
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const navbarHeight = 100; // Approximate height of the sticky navbar
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Loading state
  if (
    skillsLoading ||
    experiencesLoading ||
    educationLoading ||
    personalInfoLoading ||
    socialMediaLoading
  ) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (
    skillsError ||
    experiencesError ||
    educationError ||
    personalInfoError ||
    socialMediaError
  ) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            Error Loading Data
          </h2>
          <p className="text-gray-400">
            There was a problem fetching the data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Hero section with parallax effect */}
      <motion.div
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative h-[70vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,40,200,0.15),transparent_65%)]"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
          >
            <span className="text-white">About</span>{" "}
            <span className="text-purple-600">Me</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-8"
          >
            {personalInfo?.bio_short ||
              "Passionate developer creating innovative solutions for the web and beyond."}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href={personalInfo?.resume_url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 shadow-lg hover:shadow-purple-500/30"
            >
              <FaDownload /> Download Resume
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Replace the sticky navigation with a floating side navigation */}
      <div className="hidden md:block fixed right-8 top-1/2 transform -translate-y-1/2 z-40">
        <div className="bg-black/80 backdrop-blur-md border border-gray-800 rounded-full py-4 px-2">
          <div className="flex flex-col gap-4">
            {[
              { id: "bio", label: "Bio", icon: <FaUser />, ref: bioRef },
              {
                id: "skills",
                label: "Skills",
                icon: <FaCode />,
                ref: skillsRef,
              },
              {
                id: "experience",
                label: "Experience",
                icon: <FaBriefcase />,
                ref: experienceRef,
              },
              {
                id: "education",
                label: "Education",
                icon: <FaGraduationCap />,
                ref: educationRef,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.ref)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group relative cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800"
                }`}
              >
                {tab.icon}
                <span className="absolute right-full ml-2 px-2 py-1 rounded bg-black/80 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile bottom navigation - visible only on small screens */}
      <div className="md:hidden fixed bottom-25 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black/80 backdrop-blur-md border border-gray-800 rounded-full py-2 px-4">
          <div className="flex gap-4">
            {[
              { id: "bio", label: "Bio", icon: <FaUser />, ref: bioRef },
              {
                id: "skills",
                label: "Skills",
                icon: <FaCode />,
                ref: skillsRef,
              },
              {
                id: "experience",
                label: "Experience",
                icon: <FaBriefcase />,
                ref: experienceRef,
              },
              {
                id: "education",
                label: "Education",
                icon: <FaGraduationCap />,
                ref: educationRef,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.ref)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-900/50 text-gray-400 hover:text-white border border-gray-800"
                }`}
              >
                {tab.icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16 space-y-24">
        {/* Bio section */}
        <motion.section
          ref={bioRef}
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        >
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-white">About</span>{" "}
              <span className="text-purple-600">Me</span>
            </h2>
            <p className="text-gray-300 leading-relaxed">
              {personalInfo?.bio_long || "Bio information not available."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-600">
                  <FaUser />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Name</p>
                  <p className="text-white">
                    {personalInfo?.full_name || "John Doe"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-600">
                  <FaBriefcase />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Job</p>
                  <p className="text-white">
                    {personalInfo?.job_title || "Full Stack Developer"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-600">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Location</p>
                  <p className="text-white">
                    {personalInfo?.location || "San Francisco, CA"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-600">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Email</p>
                  <p className="text-white">
                    {personalInfo?.email || "contact@example.com"}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
                  personalInfo?.availability_status
                    ? "bg-green-600/20 text-green-500"
                    : "bg-yellow-600/20 text-yellow-500"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>
                  {personalInfo?.availability_text ||
                    "Available for freelance work"}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="relative flex justify-center"
          >
            <div className="md:w-100 md:h-100 w-80 h-80 rounded-full overflow-hidden border-2 border-purple-500/30 shadow-xl shadow-purple-500/10">
              <img
                src="/src/assets/images/image1.PNG"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {/* <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border-4 border-black bg-purple-600 flex items-center justify-center text-2xl text-white">
              5+
              <span className="text-xs absolute bottom-5">
                Years
                <br />
                Experience
              </span>
            </div> */}
          </motion.div>
        </motion.section>

        {/* Skills section */}
        <motion.section
          ref={skillsRef}
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-white">My</span>{" "}
              <span className="text-purple-600">Skills</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Here are my technical skills and proficiency levels in various
              technologies and tools.
            </p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {skillsData.map((skill, index) => (
              <div
                key={index}
                className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 shadow-lg"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center text-purple-600 text-xl">
                    {getIconComponent(skill.icon_name)}
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {skill.category}
                  </h3>
                </div>
                <div className="space-y-4">
                  {skill.technologies.map((tech, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-300">{tech.name}</span>
                        <span className="text-gray-400">{tech.level}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tech.level}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* Experience section */}
        <motion.section
          ref={experienceRef}
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-white">Work</span>{" "}
              <span className="text-purple-600">Experience</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              My professional journey and roles in the tech industry.
            </p>
          </motion.div>

          {/* Horizontal timeline for desktop */}
          <div className="hidden md:block relative mb-8">
            {/* Horizontal line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-900 via-purple-600 to-purple-900"></div>

            <div className="flex justify-between relative">
              {experiencesData.map((_, index) => (
                <div key={index} className="relative">
                  {/* Timeline dots */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-purple-600 rounded-full border-4 border-black z-10"></div>

                  {/* Year markers */}
                  <div className="text-purple-500 font-medium mt-16 text-center">
                    {index === 0
                      ? "Start"
                      : index === experiencesData.length - 1
                      ? "Present"
                      : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience cards with connecting elements */}
          <div className="space-y-12">
            {experiencesData.map((experience, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="relative"
              >
                {/* Connector line for desktop */}
                {index < experiencesData.length - 1 && (
                  <div className="hidden md:block absolute top-full left-1/2 w-0.5 h-12 bg-gradient-to-b from-purple-500 to-transparent z-0"></div>
                )}

                <div className={`flex flex-col items-center`}>
                  {/* Company logo/icon placeholder */}
                  <div className="w-16 h-16 rounded-full bg-purple-600/20 border-2 border-purple-500/30 flex items-center justify-center text-2xl text-purple-500 mb-4">
                    <FaBriefcase />
                  </div>

                  {/* Period badge */}
                  <div className="bg-black border border-gray-800 rounded-full px-4 py-1 text-sm text-purple-500 mb-4">
                    {experience.period}
                  </div>

                  {/* Content card */}
                  <div className="w-full max-w-2xl bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-2">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          {experience.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="text-purple-500">
                            {experience.company}
                          </span>
                        </div>
                        <div className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                          <FaMapMarkerAlt className="flex-shrink-0" />{" "}
                          {experience.location}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-400 mb-4 text-sm md:text-base">
                      {experience.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {experience.achievements.map((achievement, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-gray-300 text-sm md:text-base bg-black/30 p-3 rounded-lg border border-gray-800"
                        >
                          <FaChevronRight className="text-purple-500 mt-1 flex-shrink-0" />
                          <span>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Education section */}
        <motion.section
          ref={educationRef}
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              <span className="text-white">My</span>{" "}
              <span className="text-purple-600">Education</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              My academic background and educational qualifications.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-purple-900 z-0"></div>

            <div className="space-y-12">
              {educationData.map((edu, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative z-10"
                >
                  <div
                    className={`flex flex-col ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    } gap-4 md:gap-8 items-start md:items-center`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-5 h-5 bg-purple-500 rounded-full border-4 border-black z-20"></div>

                    {/* Date */}
                    <div
                      className={`pl-12 md:pl-0 md:w-1/2 ${
                        index % 2 === 0 ? "md:text-right" : "md:text-left"
                      } mb-2 md:mb-0 w-full`}
                    >
                      <div className="inline-block bg-black border border-gray-800 rounded-full px-4 py-1 text-sm text-purple-500">
                        <span className="flex items-center gap-2">
                          <FaCalendarAlt className="flex-shrink-0" />
                          <span className="whitespace-nowrap">
                            {edu.period}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:w-1/2 w-full pl-12 md:pl-0">
                      <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-xl p-4 md:p-6 hover:border-purple-500/30 transition-all duration-300 shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {edu.degree}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                          <span className="text-purple-500">
                            {edu.institution}
                          </span>
                          <span className="text-gray-500 hidden md:inline">
                            •
                          </span>
                          <span className="text-gray-500 text-sm flex items-center gap-1">
                            <FaMapMarkerAlt className="flex-shrink-0" />{" "}
                            {edu.location}
                          </span>
                        </div>
                        <p className="text-gray-400 mb-4 text-sm md:text-base">
                          {edu.description}
                        </p>
                        <ul className="space-y-2">
                          {edu.achievements.map((achievement, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-gray-300 text-sm md:text-base"
                            >
                              <FaChevronRight className="text-purple-500 mt-1 flex-shrink-0" />
                              <span>{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          ref={contactRef}
          initial="hidden"
          whileInView="visible"
          variants={containerVariants}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/10 rounded-3xl -z-10"></div>

          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-600/5 rounded-full blur-3xl"></div>

          <div className="py-16 px-6 border border-gray-800/50 rounded-3xl backdrop-blur-sm">
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
                Let's Work Together
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Interested in collaborating or have a project in mind? Let's
                connect and create something amazing.
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center"
            >
              {/* Contact methods */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full max-w-4xl">
                {/* Email */}
                <a
                  href={`mailto:${
                    personalInfo?.email || "contact@example.com"
                  }`}
                  className="flex flex-col items-center p-6 bg-black/30 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-500 text-xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                    <FaEnvelope />
                  </div>
                  <h3 className="text-white font-medium mb-1">Email</h3>
                  <p className="text-gray-400 text-sm">
                    {personalInfo?.email || "contact@example.com"}
                  </p>
                </a>

                {/* Location */}
                <div className="flex flex-col items-center p-6 bg-black/30 rounded-xl border border-gray-800">
                  <div className="w-14 h-14 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-500 text-xl mb-4">
                    <FaMapMarkerAlt />
                  </div>
                  <h3 className="text-white font-medium mb-1">Location</h3>
                  <p className="text-gray-400 text-sm">
                    {personalInfo?.location || "San Francisco, CA"}
                  </p>
                </div>

                {/* Availability */}
                <div className="flex flex-col items-center p-6 bg-black/30 rounded-xl border border-gray-800">
                  <div className="w-14 h-14 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-500 text-xl mb-4">
                    <FaCalendarAlt />
                  </div>
                  <h3 className="text-white font-medium mb-1">Availability</h3>
                  <p className="text-gray-400 text-sm">
                    {personalInfo?.availability_text ||
                      "Available for freelance work"}
                  </p>
                </div>
              </div>

              {/* CTA Button */}
              <motion.a
                href={`mailto:${personalInfo?.email || "contact@example.com"}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 font-medium text-lg"
              >
                <FaEnvelope /> Get In Touch
              </motion.a>

              {/* Social Media */}
              <div className="mt-12 flex flex-wrap justify-center gap-6">
                {socialMediaData.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 5, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-12 h-12 rounded-full bg-black/50 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 transition-all duration-300 text-xl"
                  >
                    {getIconComponent(social.icon_name)}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
