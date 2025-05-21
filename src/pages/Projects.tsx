import { useState, useRef, useEffect } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaSearch,
  FaCode,
  FaLayerGroup,
  FaTags,
  FaShoppingCart,
  FaRobot,
  FaHeartbeat,
  FaUser,
  FaBrain,
  FaLock,
  FaBolt,
  FaMobile,
} from "react-icons/fa";
import {
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiExpress,
  SiTypescript,
  SiTailwindcss,
  SiPython,
  SiTensorflow,
  SiFirebase,
  SiRedux,
} from "react-icons/si";

import { useProjects } from "@/hooks/useSupabase";

// Define types for project data
interface Technology {
  frontend?: string[];
  backend?: string[];
  ai?: string[];
  payment?: string[];
  deployment?: string[];
  ml?: string[];
  mobile?: string[];
  apis?: string[];
  iot?: string[];
  [key: string]: string[] | undefined;
}

interface ProjectData {
  id: number;
  title: string;
  description: string;
  long_description: string; // Changed from longDescription
  image_url: string; // Changed from image
  tags: string[];
  category: string;
  github_url: string; // Changed from github
  demo_url: string; // Changed from demo
  color: string;
  features: string[];
  technologies: Technology;
  year: number;
  icon_name: string; // Changed from icon: ReactNode
}

interface Category {
  id: string;
  name: string;
  icon: ReactNode;
}

const Projects = () => {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  // Fetch projects from Supabase
  const { data: projectsData, loading, error } = useProjects();

  // References for scroll animations
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Parallax effect for header
  const headerY = useTransform(scrollY, [0, 200], [0, -40], { clamp: false });

  // Opacity effect on scroll
  const headerOpacity = useTransform(scrollY, [0, 150, 300], [1, 0.9, 0.8], {
    clamp: true,
  });

  // Scale effect on scroll
  const headerScale = useTransform(scrollY, [0, 300], [1, 0.98], {
    clamp: true,
  });

  // Get tag icon based on tag name
  const getTagIcon = (tag: string): ReactNode => {
    switch (tag.toLowerCase()) {
      case "react":
        return <SiReact />;
      case "node.js":
        return <SiNodedotjs />;
      case "mongodb":
        return <SiMongodb />;
      case "express":
        return <SiExpress />;
      case "typescript":
        return <SiTypescript />;
      case "tailwind css":
        return <SiTailwindcss />;
      case "python":
        return <SiPython />;
      case "tensorflow":
        return <SiTensorflow />;
      case "firebase":
        return <SiFirebase />;
      case "redux":
        return <SiRedux />;
      default:
        return <FaCode />;
    }
  };

  // Get project icon based on icon name
  const getProjectIcon = (iconName: string): ReactNode => {
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
      case "FaMobile":
        return <FaMobile />;
      default:
        return <FaCode />;
    }
  };

  // Filter and sort projects
  const filteredProjects = projectsData
    ? projectsData
        .filter((project) => {
          // Filter by category
          if (filter !== "all" && project.category !== filter) return false;

          // Filter by search query
          if (
            searchQuery &&
            !project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !project.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
            return false;

          // Filter by selected tags
          if (
            selectedTags.length > 0 &&
            !selectedTags.some((tag) => project.tags.includes(tag))
          )
            return false;

          return true;
        })
        .sort((a, b) => {
          // Sort by selected criteria
          if (sortBy === "newest") return b.year - a.year;
          if (sortBy === "oldest") return a.year - b.year;
          if (sortBy === "a-z") return a.title.localeCompare(b.title);
          if (sortBy === "z-a") return b.title.localeCompare(a.title);
          return 0;
        })
    : [];

  // Get all unique tags from projects
  const allTags = projectsData
    ? Array.from(new Set(projectsData.flatMap((project) => project.tags)))
    : [];

  // Get unique categories from project data
  const uniqueCategories = projectsData
    ? [
        "all",
        ...Array.from(new Set(projectsData.map((project) => project.category))),
      ]
    : ["all"];

  // Generate category objects with icons
  const categories: Category[] = uniqueCategories.map((categoryId) => {
    let name =
      categoryId === "all"
        ? "All Projects"
        : categoryId.charAt(0).toUpperCase() + categoryId.slice(1);

    switch (categoryId) {
      case "all":
        return { id: categoryId, name, icon: <FaLayerGroup /> };
      case "web":
        return { id: categoryId, name: "Web Applications", icon: <FaCode /> };
      case "mobile":
        return { id: categoryId, name: "Mobile Apps", icon: <FaMobile /> };
      case "ai":
        return { id: categoryId, name: "AI & ML", icon: <FaBrain /> };
      case "iot":
        return { id: categoryId, name: "IoT", icon: <FaLayerGroup /> };
      default:
        return { id: categoryId, name, icon: <FaCode /> };
    }
  });

  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setFilter("all");
    setSearchQuery("");
    setSelectedTags([]);
    setSortBy("newest");
  };

  // Handle project click to show details
  const handleProjectClick = (project: ProjectData) => {
    setActiveProject(project);
    document.body.style.overflow = "hidden";
  };

  // Close project details modal
  const closeProjectDetails = () => {
    setActiveProject(null);
    document.body.style.overflow = "auto";
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeProject) {
        closeProjectDetails();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [activeProject]);

  return (
    <div className="min-h-screen pt-24 pb-16 bg-black text-white overflow-x-hidden">
      {/* Header with parallax effect */}
      <motion.div
        ref={headerRef}
        style={{
          opacity: headerOpacity,
          y: headerY,
          scale: headerScale,
          transformOrigin: "top center",
        }}
        className="relative mb-12 transition-transform duration-300 ease-out"
      >
        <div className="container mx-auto px-4">
          <div className="flex gap-2">
            <h1 className="text-5xl font-bold mb-4 text-white">My</h1>
            <h1 className="text-5xl font-bold mb-4 text-purple-600">
              Projects
            </h1>
          </div>
          <p className="text-md text-gray-400 max-w-2xl">
            Explore my portfolio of projects spanning web development, mobile
            applications, artificial intelligence, and IoT solutions.
          </p>

          {/* Floating code snippets for visual effect */}
          <div className="absolute right-0 top-0 z-1 opacity-20 hidden lg:block select-none w-full max-w-[calc(100%-2rem)]">
            <div className="text-sm font-mono text-gray-400 rotate-6 w-full text-right pr-8">
              <pre className="inline-block text-left">{`function Project() {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="project-card">
      {/* Project content */}
    </div>
  );
}`}</pre>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Search and filter section */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-black border border-gray-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent transition-all duration-300 ease-in-out placeholder-gray-500"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>

          {/* Filter controls */}
          <div className="flex flex-wrap gap-3 items-center z-10">
            {/* Category filter */}
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setFilter(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all text-sm cursor-pointer duration-300 ease-in-out ${
                    filter === category.id
                      ? "bg-purple-600 text-white"
                      : "bg-black text-gray-300 hover:bg-gray-800 border border-gray-700"
                  }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Tag filter button */}
            <motion.button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm cursor-pointer duration-300 ease-in-out ${
                isFilterOpen || selectedTags.length > 0
                  ? "bg-purple-600 text-white"
                  : "bg-black text-gray-300 hover:bg-gray-800 border border-gray-700"
              }`}
            >
              <FaTags />
              <span>
                Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
              </span>
            </motion.button>

            {/* Sort button */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2 rounded-full text-sm cursor-pointer bg-black text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-400 pr-8 border border-gray-700 duration-300 ease-in-out"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">A-Z</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Reset filters */}
            {(filter !== "all" ||
              searchQuery ||
              selectedTags.length > 0 ||
              sortBy !== "newest") && (
              <motion.button
                onClick={resetFilters}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full text-sm cursor-pointer bg-red-600/80 text-white hover:bg-red-700 transition-colors duration-300 ease-in-out"
              >
                Reset
              </motion.button>
            )}
          </div>
        </div>

        {/* Tag filter panel */}
        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-4"
            >
              <div className="bg-black border border-gray-700 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="text-lg font-medium text-white mb-3">
                  Filter by Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((tag) => (
                    <motion.button
                      key={tag}
                      onClick={() => handleTagSelect(tag)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-sm cursor-pointer border border-gray-700 ${
                        selectedTags.includes(tag)
                          ? "bg-purple-600/80 text-white"
                          : "bg-black text-gray-300 hover:bg-gray-700/50"
                      }`}
                    >
                      <span className="text-xs">{getTagIcon(tag)}</span>
                      <span>{tag}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Project count */}
      <div className="container mx-auto px-4 mb-6">
        <p className="text-gray-400">
          Showing {filteredProjects.length} of {projectsData.length} projects
        </p>
      </div>

      {/* Projects grid */}
      <div className="container mx-auto px-4">
        {loading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-black-100 rounded-xl overflow-hidden border border-gray-800 shadow-lg animate-pulse h-96"
              >
                <div className="h-48 bg-gray-800"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-800 rounded w-5/6 mb-6"></div>
                  <div className="flex flex-wrap gap-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-6 bg-gray-800 rounded-full w-16"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-red-500 mb-2">
              Error Loading Projects
            </h3>
            <p className="text-gray-400">
              There was a problem fetching the projects. Please try again later.
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          // No results state
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold mb-2">No Projects Found</h3>
            <p className="text-gray-400 mb-6">
              No projects match your current filters. Try adjusting your search
              criteria.
            </p>
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                onClick={() => handleProjectClick(project)}
                className="bg-black backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden cursor-pointer group hover:border-purple-500/30 transition-colors duration-300"
              >
                {/* Project image with overlay */}
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.image_url})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />

                  {/* Project icon */}
                  <div className="absolute top-4 right-4 text-2xl opacity-80">
                    {getProjectIcon(project.icon_name)}
                  </div>

                  {/* Project category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-800/80 text-gray-300 border border-gray-700">
                      {categories.find((c) => c.id === project.category)?.name}
                    </span>
                  </div>
                </div>

                {/* Project content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-black border border-gray-700 rounded-full text-xs text-gray-300"
                      >
                        <span className="text-xs">{getTagIcon(tag)}</span>
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 bg-black border border-gray-700 rounded-full text-xs text-gray-300">
                        +{project.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* View details button */}
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="mt-4 px-4 py-2 rounded-full bg-black border border-gray-700 text-white hover:bg-purple-600/80 transition-colors duration-300 ease-in-out cursor-pointer text-sm"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>

                {/* Subtle glowing effect on hover */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-purple-600/0 via-purple-500/10 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Project details modal */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-9999999999 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeProjectDetails}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-black border border-gray-600 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header with image */}
              <div className="relative h-64 md:h-80">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${activeProject.image_url})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />

                {/* Close button */}
                <button
                  onClick={closeProjectDetails}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800/80 text-white flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  ✕
                </button>

                {/* Project title */}
                <div className="absolute bottom-0 left-0 p-6">
                  <h2 className="text-3xl font-bold text-white mb-2">
                    {activeProject.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800/80 rounded-full text-xs text-gray-300"
                      >
                        <span className="text-xs">{getTagIcon(tag)}</span>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal content */}
              <div className="p-6">
                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-white mb-3">
                    About this project
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {activeProject.long_description}
                  </p>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-white mb-3">
                    Key Features
                  </h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {activeProject.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-purple-600 mt-1">•</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-xl font-medium text-white mb-3">
                    Technologies Used
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(activeProject.technologies).map(
                      ([category, techs]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-gray-400 mb-1 capitalize">
                            {category}:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {techs &&
                              techs.map((tech, index) => (
                                <span
                                  key={index}
                                  className="px-4 py-1 bg-black border border-gray-600 rounded-full text-sm text-gray-300"
                                >
                                  {tech}
                                </span>
                              ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-3">
                  <a
                    href={activeProject.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors"
                  >
                    <FaGithub />
                    View Code
                  </a>
                  <a
                    href={activeProject.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
                  >
                    <FaExternalLinkAlt />
                    Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
