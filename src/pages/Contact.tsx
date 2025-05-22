import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FaEnvelope,
  FaPaperPlane,
  FaCheck,
  FaTimes,
  FaUser,
  FaComment,
  FaEdit,
} from "react-icons/fa";
import {
  useContactInfo,
  useSocialMedia,
  useFAQs,
  usePersonalInfo,
  useContactForm,
} from "@/hooks/useSupabase";
import { getIconComponent } from "@/utils/iconUtils";

const Contact = () => {
  // Fetch data from Supabase
  const { data: contactInfoData, loading: contactInfoLoading } =
    useContactInfo();
  const { data: socialMediaData, loading: socialMediaLoading } =
    useSocialMedia();
  const { data: faqsData, loading: faqsLoading } = useFAQs();
  const { data: personalInfo, loading: personalInfoLoading } =
    usePersonalInfo();

  // Contact form submission hook
  const {
    submitForm,
    loading: submitting,
    success,
    error: submitError,
  } = useContactForm();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [activeField, setActiveField] = useState<string | null>(null);
  const [formTouched, setFormTouched] = useState(false);

  // Animated gradient background effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (!formTouched) setFormTouched(true);
  };

  const handleFocus = (fieldName: string) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  // Then update your handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitForm(formData);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setFormTouched(false);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div
      className="min-h-screen pt-24 pb-16 relative overflow-hidden"
      style={{
        background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.15), transparent 30%)`,
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-900/10 rounded-full blur-3xl -z-10"></div>

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Have a question or want to work together? Feel free to contact me
            using the form below or through any of my social platforms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-black/40 backdrop-blur-lg border border-gray-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl -z-10"></div>

              <h2 className="text-2xl font-bold mb-6 text-white">
                Send a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="relative">
                    <div
                      className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                        activeField === "name"
                          ? "bg-purple-500/10 border border-purple-500/30"
                          : "bg-transparent"
                      }`}
                      style={{ zIndex: -1 }}
                    ></div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaUser />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => handleFocus("name")}
                        onBlur={handleBlur}
                        placeholder="Your Name"
                        required
                        className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="relative">
                    <div
                      className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                        activeField === "email"
                          ? "bg-purple-500/10 border border-purple-500/30"
                          : "bg-transparent"
                      }`}
                      style={{ zIndex: -1 }}
                    ></div>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaEnvelope />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => handleFocus("email")}
                        onBlur={handleBlur}
                        placeholder="Your Email"
                        required
                        className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject Field */}
                <div className="relative">
                  <div
                    className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                      activeField === "subject"
                        ? "bg-purple-500/10 border border-purple-500/30"
                        : "bg-transparent"
                    }`}
                    style={{ zIndex: -1 }}
                  ></div>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <FaEdit />
                    </div>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => handleFocus("subject")}
                      onBlur={handleBlur}
                      placeholder="Subject"
                      required
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div className="relative">
                  <div
                    className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                      activeField === "message"
                        ? "bg-purple-500/10 border border-purple-500/30"
                        : "bg-transparent"
                    }`}
                    style={{ zIndex: -1 }}
                  ></div>
                  <div className="relative">
                    <div className="absolute left-4 top-4 text-gray-400">
                      <FaComment />
                    </div>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => handleFocus("message")}
                      onBlur={handleBlur}
                      placeholder="Your Message"
                      required
                      rows={5}
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-lg py-3 px-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <div>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 px-6 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                      submitting
                        ? "bg-purple-700/50 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-purple-800 hover:shadow-lg hover:shadow-purple-500/20"
                    }`}
                  >
                    {submitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Form Status */}
                <AnimatePresence>
                  {(success || submitError) && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`p-4 rounded-lg flex items-center gap-2 ${
                        success
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {success ? (
                        <>
                          <FaCheck /> Your message has been sent successfully!
                        </>
                      ) : (
                        <>
                          <FaTimes />{" "}
                          {submitError ||
                            "There was an error sending your message. Please try again."}
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfoLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-24 bg-gray-800/50 rounded-xl"
                    ></div>
                  ))}
                </div>
              ) : (
                contactInfoData?.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link}
                    target={
                      info.title !== "Email" && info.title !== "Phone"
                        ? "_blank"
                        : undefined
                    }
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center gap-4 p-4 bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-purple-500/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-900/20 flex items-center justify-center text-purple-400">
                      {getIconComponent(info.icon_name)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{info.title}</h3>
                      <p className="text-gray-400 text-sm">{info.value}</p>
                      <p className="text-xs text-gray-500">
                        {info.description}
                      </p>
                    </div>
                  </motion.a>
                ))
              )}
            </div>

            {/* Social Media */}
            <div className="bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
              <h3 className="text-white font-medium mb-4">Connect With Me</h3>
              <div className="flex flex-wrap gap-3">
                {socialMediaLoading ? (
                  <div className="animate-pulse flex gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 bg-gray-800/50 rounded-full"
                      ></div>
                    ))}
                  </div>
                ) : (
                  socialMediaData?.map((platform, index) => (
                    <motion.a
                      key={index}
                      href={platform.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-full bg-gray-900/80 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 transition-all duration-300"
                    >
                      <span className="text-purple-400">
                        {getIconComponent(platform.icon_name)}
                      </span>
                    </motion.a>
                  ))
                )}
              </div>
            </div>

            {/* Availability Card */}
            <motion.div
              className="rounded-2xl p-8 bg-black border border-purple-900/30 shadow-xl backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-xl font-bold text-white mb-3">
                Let's Work Together
              </h3>
              <p className="text-gray-300">
                {personalInfoLoading ? (
                  <span className="animate-pulse">Loading availability...</span>
                ) : (
                  personalInfo?.availability_text ||
                  "Currently available for freelance projects and collaborations."
                )}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                <span className="text-green-400 text-sm">
                  {personalInfoLoading
                    ? "Checking availability..."
                    : personalInfo?.availability_status
                    ? "Available for new opportunities"
                    : "Limited availability"}
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* FAQs Section */}
        <motion.div
          // initial={{ opacity: 0, y: 30 }}
          // animate={{ opacity: 1, y: 0 }}
          // transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12"
        >
          <div className="rounded-2xl p-8 bg-black border border-gray-800 overflow-hidden relative">
            {/* <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-10"></div> */}
            <div className="relative z-20 flex flex-col md:flex-row md:items-start md:gap-8 w-full">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-gray-400">
                  Here are answers to some common questions. If you have other
                  questions, feel free to contact me directly.
                </p>
              </div>

              <div className="md:w-2/3">
                {faqsLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-800/50 rounded-xl"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {faqsData?.map((faq, index) => (
                      <div
                        className="mt-4 overflow-hidden rounded-xl bg-gray-600/30"
                        key={index}
                      >
                        <AccordionItem
                          value={faq.value}
                          className="border-none"
                        >
                          <AccordionTrigger className="text-md px-4 py-3 text-gray-300 hover:no-underline cursor-pointer">
                            {index + 1}. {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-0 pb-4 text-gray-400 text-sm">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      </div>
                    ))}
                  </Accordion>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;
