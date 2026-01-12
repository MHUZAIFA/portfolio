"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { useEffect, use, useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  image: string;
  technologies: string[];
  category?: string;
  date?: string;
  liveUrl?: string;
  githubUrl?: string;
  otherLinks?: { label: string; url: string }[];
  features?: string[];
  additionalImages?: string[];
}

const projects: Record<string, Project> = {
  "ai-bots": {
    id: "ai-bots",
    name: "AI_Bots",
    description: "Applied AI project featuring comparative analysis of ML models and CNN-based image classification",
    fullDescription:
      "AI_Bots is a comprehensive Applied AI project (COMP-6721) developed by Team AI_Bots. This project consists of two main phases: Phase 1 focuses on a detailed comparative analysis of classical machine learning models (SVM, Decision Trees, and Random Forests) on benchmark datasets, including data preprocessing, hyperparameter tuning, and comprehensive evaluation across multiple metrics. Phase 2 involves the development and training of a custom Convolutional Neural Network (CNN) on the MNIST dataset, focusing on model design, training pipelines, and performance evaluation with visualizations including accuracy and loss curves. The project demonstrates expertise in both classical machine learning and deep learning approaches, with detailed Jupyter notebooks, comprehensive reports, and well-documented code.",
    image: "/imgs/projects/ai.png",
    technologies: ["Python", "Machine Learning", "Deep Learning", "CNN", "SVM", "Decision Trees", "Random Forests", "TensorFlow", "PyTorch", "scikit-learn", "Jupyter Notebook"],
    category: "Machine Learning & AI",
    date: "May 29, 2025 - Jun 22, 2025",
    githubUrl: "https://github.com/MHUZAIFA/COMP-6721-Applied-AI",
    features: [
      "Phase 1 - Comparative Analysis: Detailed evaluation of SVM, Decision Trees, and Random Forests on benchmark datasets with comprehensive metrics including accuracy, precision, and recall.",
      "Data Preprocessing: Advanced data preprocessing techniques including feature engineering, normalization, and handling missing values for optimal model performance.",
      "Hyperparameter Tuning: Systematic hyperparameter optimization to achieve best model performance across different algorithms.",
      "Phase 2 - CNN Image Classification: Development and training of a custom Convolutional Neural Network on the MNIST dataset for handwritten digit recognition.",
      "Model Design: Custom CNN architecture design with proper layer configurations, activation functions, and optimization strategies.",
      "Performance Visualization: Comprehensive visualizations including accuracy/loss curves, confusion matrices, and performance metrics for model evaluation.",
      "Jupyter Notebooks: Well-documented Jupyter notebooks with detailed explanations, code comments, and step-by-step analysis for both phases.",
      "Team Collaboration: Collaborative project with clear task distribution and contributions from team members Shurrab Mohammed, Oleksandr Yasinovskyy, and Huzaifa Mohammed.",
      "Comprehensive Reports: Detailed project reports (PDF) documenting methodology, results, analysis, and future work ideas for both phases.",
      "Future Work Extensions: Proposed extensions including XGBoost integration, SVM with RBF kernels, deeper CNN architectures, and data augmentation techniques.",
    ],
  },
  "ai-report-workflow": {
    id: "ai-report-workflow",
    name: "AI-Driven Report Generation Workflow",
    description: "An automated reporting system built using n8n that generates reports using natural language prompts",
    fullDescription:
      "The AI-Driven Report Generation Workflow is an automated reporting system built using n8n that allows users to generate reports using natural language prompts. Users can request reports on demand, preview the generated content, and send finalized reports via email. The workflow securely retrieves data from external APIs using Bearer token authentication and query parameters. The collected data is processed, analyzed, and summarized using AI to produce clear and structured reports. This solution reduces manual reporting effort while giving users full control over report generation and delivery.",
    image: "/imgs/projects/n8nReportWithAI.png",
    technologies: ["n8n", "Automation", "AI Prompt Processing", "REST APIs", "Bearer Token Authentication", "Query Parameters", "Workflow Orchestration", "Email Services", "Webhook Triggers"],
    category: "Automation / Reporting",
    date: "December 2024",
    githubUrl: "https://github.com/example/ai-report-workflow",
    features: [
      "Prompt-Based Report Generation: Users can generate reports by providing natural language prompts, making report creation intuitive and accessible.",
      "Secure API Data Retrieval: Fetches data from external APIs using Bearer token authentication and query parameters, ensuring secure and flexible data access.",
      "Data Processing: Processes and aggregates API responses before report creation, ensuring clean and organized data for analysis.",
      "AI-Powered Summarization: Uses AI to convert raw data into readable and meaningful reports, transforming complex data into actionable insights.",
      "Report Preview: Allows users to preview generated reports before sending them, ensuring quality and accuracy before delivery.",
      "User Approval Flow: Reports are only sent after user confirmation, giving users full control over the report generation and delivery process.",
      "Email Delivery: Sends finalized reports automatically via email, streamlining the distribution process and ensuring timely delivery.",
      "On-Demand Execution: Reports can be generated anytime through user input, providing flexibility and immediate access to insights.",
      "Error Handling: Handles API failures, invalid tokens, and missing parameters gracefully, ensuring robust and reliable operation.",
      "Scalable Design: Easily extendable to support additional APIs and report formats, allowing for future growth and customization.",
    ],
    additionalImages: [
      "/imgs/projects/n8nlogo.png",
      "/imgs/projects/n8nReportWithAI.png",
      "/imgs/projects/n8nReport.png"
    ],
  },
  metricstics: {
    id: "metricstics",
    name: "Metricstics",
    description: "Your Statistical Calculator - A Python-based statistical calculator with a sleek Tkinter GUI",
    fullDescription:
      "Welcome to METRICSTICS, a Python-based statistical calculator with a sleek Tkinter GUI. METRICSTICS not only computes standard statistical measures but also provides an intuitive interface for loading and storing session information. It features a beautiful dark theme, ensuring a pleasant user experience. METRICSTICS helps in calculating descriptive statistics. The purpose of descriptive statistics is to quantitatively describe a collection of data by measures of central tendency, measures of frequency, and measures of variability. The system calculates essential statistical values including minimum (m), maximum (M), mode (o), median (d), mean (μ), Mean Absolute Deviation (MAD), and Standard Deviation (σ).",
    image: "/imgs/projects/metricsticsBg.png",
    technologies: ["Python", "Tkinter", "Statistics", "Data Analysis", "MVC Pattern", "GUI"],
    category: "Productivity & Utilities",
    date: "November 2023",
    // liveUrl: "https://example.com",
    githubUrl: "https://github.com/MHUZAIFA/METRICSTICS",
    features: [
      "Calculate statistics: Calculate essential statistical measures including min, max, mean, median, mode, MAD, and standard deviation.",
      "User-friendly GUI: Built with Tkinter providing an intuitive and modern interface for statistical calculations.",
      "Sleek dark theme: Features a beautiful dark theme for a modern and comfortable user experience.",
      "Multiple input methods: Input data through keyboard, file upload, or the interactive randomizer button.",
      "Session management: Convenient store and load functionality for your statistical sessions effortlessly.",
      "MVC design pattern: Follows the Model-View-Controller design pattern for a clean and modular code structure.",
    ],
    additionalImages: [
      "/imgs/projects/metricsticsBg.png",
      "/imgs/projects/metricstics.png"
    ],
  },
  mytasks: {
    id: "mytasks",
    name: "MyTasks",
    description: "A user-friendly cross-platform to-do application for efficiently managing and tracking day-to-day activities",
    fullDescription:
      "MyTasks is a user-friendly to-do application designed to efficiently manage and track day-to-day activities. Whether you're on your smartphone, tablet, or computer, MyTasks provides a seamless experience with its cross-platform, cloud-based progressive web application. Built with Angular and Firebase, MyTasks offers a modern, intuitive interface for effortless task management. As a progressive web application, MyTasks doesn't require installation from an app store - simply visit the web app on your preferred browser to get started.",
    image: "/imgs/projects/todobg.png",
    technologies: ["Angular", "PWA", "Cross Platform", "Cloud-Based", "Firebase", "TypeScript", "Progressive Web App"],
    category: "Productivity & Tracking",
    date: "December 2022",
    liveUrl: "https://ha-todo.web.app",
    githubUrl: "https://github.com/MHUZAIFA/MyTasks",
    features: [
      "Cross-Platform Compatibility: Access MyTasks from any device - smartphone, tablet, or computer for a seamless experience across all your devices.",
      "Cloud-Based Storage: Store your tasks securely in the cloud for easy access and synchronization across all your devices in real-time.",
      "Intuitive Interface: User-friendly design with a clean and modern interface for effortless task management and navigation.",
      "Task Organization: Categorize tasks, set priorities, and track progress easily with powerful organizational features.",
      "Progressive Web App: No installation required - access MyTasks directly from your web browser with app-like functionality.",
      "Offline Support: Continue managing your tasks even when offline, with automatic synchronization when connection is restored.",
      "Real-Time Synchronization: Changes sync instantly across all your devices, ensuring your task list is always up to date.",
    ],
    additionalImages: [
      "/imgs/projects/todobg.png",
      "/imgs/projects/todomb.png",
      "/imgs/projects/todo.png"
    ],
  },
  snkrs: {
    id: "snkrs",
    name: "SNKRS",
    description: "An online e-commerce web application for browsing and buying sneakers",
    fullDescription:
      "SNKRS is an online e-commerce web application for browsing and buying sneakers. A cross platform progressive e-commerce web application for purchasing sneakers. Users can view, search and filter from a wide range of sneakers to find the sneaker of their choice. LoggedIn users can review, wishlist, buy and track their orders. From browsing to checkout this application delivers the best in class user experience.",
    image: "/imgs/projects/snkrsbg.png",
    technologies: ["E-Commerce", "PWA", "Cross Platform", "Shopping Cart", "Order Tracking", "User Authentication", "Responsive Design"],
    category: "E-Commerce",
    date: "May 2022",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/snkrs",
    additionalImages: [
      "/imgs/projects/snkrsbg.png",
      "/imgs/projects/snkrsmb.png",
      "/imgs/projects/snkrs.png"
    ],
    features: [
      "Cross-Platform: Progressive web application (PWA) accessible across devices.",
      "Browsing and Shopping: Users can browse a diverse catalog of sneakers.",
      "Search and Filtering: Enables users to search for specific sneakers and apply filters.",
      "User Authentication: Secure login and registration functionality.",
      "User Interaction: Logged-in users can add reviews, wishlist items, purchase sneakers, and track their orders.",
      "Checkout Process: Smooth and intuitive checkout experience for completing purchases.",
      "Responsive Design: Ensures usability and functionality across various screen sizes.",
      "Performance: Optimized for speed and efficiency, providing a seamless user experience.",
      "Accessibility: Designed to be accessible to users with disabilities.",
      "Security: Implements best practices to safeguard user data and transactions.",
    ],
  },
  helpdesk: {
    id: "helpdesk",
    name: "Helpdesk",
    description: "A web application for requesting for an asset or raising an issue",
    fullDescription:
      "Helpdesk is a cross platform cloud-based progressive web application for fullfilling user requests and resolving issues raised by an user. It allows users to manage their requests/issues from a laptop, tablet and computer.",
    image: "/imgs/projects/crm.png",
    technologies: ["PWA", "Support", "Cloud-Based", "Issue Tracking", "Request Management"],
    category: "Support",
    date: "Feb 2022",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/helpdesk",
  },
  recyclevision: {
    id: "recyclevision",
    name: "RecycleVision",
    description: "A mobile application that simplifies waste sorting using ML/AI-powered object detection and classification",
    fullDescription:
      "RecycleVision is an application developed as part of the SOEN 6751 HCI course. This mobile application simplifies the process of waste sorting by leveraging machine learning and artificial intelligence technologies. The application integrates with the Hugging Face API to provide advanced object detection and classification capabilities, allowing users to identify different types of waste materials accurately. By combining ML/AI-powered image recognition with visual cues and gamification, RecycleVision engages users and increases their confidence in waste disposal practices. The application uses computer vision models from Hugging Face to detect and classify waste objects in real-time, providing instant feedback and guidance on proper waste sorting, thereby reducing confusion and increasing accuracy in waste disposal.",
    image: "/imgs/projects/RecycleVision.png",
    technologies: ["Mobile", "Machine Learning", "Artificial Intelligence", "Hugging Face API", "Object Detection", "Image Classification", "Computer Vision", "HCI", "Gamification", "React Native"],
    category: "Mobile Application",
    date: "Feb 18, 2024 - May 1, 2024",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/recyclevision",
    features: [
      "ML/AI-Powered Object Detection: Leverages Hugging Face API's advanced machine learning models to detect waste objects in real-time from camera input, providing accurate identification of different waste materials.",
      "Intelligent Waste Classification: Uses AI classification models to categorize detected waste into appropriate recycling categories (recyclable, compostable, hazardous, etc.) with high accuracy.",
      "Hugging Face API Integration: Seamlessly integrates with Hugging Face's pre-trained computer vision models for robust and reliable object detection and classification without requiring local model training.",
      "Real-Time Image Processing: Processes camera images instantly to provide immediate feedback on waste classification, enabling users to make quick sorting decisions.",
      "Visual Cues for Waste Sorting: The application uses visual cues to enhance user confidence and engagement in waste-sorting practices. This feature helps users to identify and sort waste correctly.",
      "Emotional Satisfaction: The application is designed to impact the user's emotional response positively. It provides satisfaction to users by enabling them to dispose of waste effectively and correctly.",
      "Gamification of Waste Sorting: The application incorporates gamification elements to encourage habitual correct waste sorting. This feature makes the waste sorting process more engaging and fun for users.",
      "Environmental Awareness: The application aims to increase user's environmental awareness. It tracks the user's waste sorting practices before and after using the application, providing insights into their contribution to broader environmental practices.",
      "Confidence Building: By providing accurate AI-powered classifications, the application builds user confidence in waste sorting decisions, reducing uncertainty and improving sorting accuracy.",
    ],
  },
};

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const project = projects[id];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imagesToShow = project?.additionalImages && project.additionalImages.length > 0
    ? project.additionalImages
    : project?.image ? [project.image] : [];

  useEffect(() => {
    if (!project) {
      router.push("/projects");
    }
  }, [project, router]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightboxOpen) {
          setLightboxOpen(false);
        } else {
          router.push("/projects");
        }
      }
    };

    const handleArrowKeys = (event: KeyboardEvent) => {
      if (lightboxOpen) {
        if (event.key === "ArrowLeft") {
          setCurrentImageIndex((prev) => 
            prev > 0 ? prev - 1 : imagesToShow.length - 1
          );
        } else if (event.key === "ArrowRight") {
          setCurrentImageIndex((prev) => 
            prev < imagesToShow.length - 1 ? prev + 1 : 0
          );
        }
      }
    };

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("keydown", handleArrowKeys);

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("keydown", handleArrowKeys);
    };
  }, [router, lightboxOpen, imagesToShow.length]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : imagesToShow.length - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => 
      prev < imagesToShow.length - 1 ? prev + 1 : 0
    );
  };

  if (!project) {
    return null;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="min-h-screen relative"
    >
      {/* Background Image */}
      <motion.div
        variants={staggerItem}
        className="fixed inset-0 z-0 overflow-hidden"
      >
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src={project.image}
          alt={project.name}
          className="absolute inset-0 h-full w-full object-cover object-center"
          style={{ minHeight: '100vh', minWidth: '100vw' }}
        />
        {/* Smooth gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black/90" />
      </motion.div>

      {/* Content Overlay */}
        <motion.div
          variants={staggerItem}
        className="relative z-10 flex min-h-screen overflow-y-auto project-overlay-mask"
        style={{
          backgroundColor: "black",
          willChange: "opacity",
        }}
      >
        <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-24 lg:px-16">
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-24 mb-8 sm:mb-8 md:mb-12 sm:mt-8 md:mt-16"
          >
            <Button
              onClick={() => {
                hapticManager.light();
                router.push("/projects");
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 text-sm sm:text-base"
            >
              <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Back to Projects
            </Button>
          </motion.div>

          {project.date && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mb-3 sm:mb-4 flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-white/60"
            >
              {project.date && <span>{project.date}</span>}
            </motion.div>
          )}

          {project.category && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mb-3 sm:mb-4 flex flex-wrap gap-3 sm:gap-4"
            >
              {project.category && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-full bg-white/10 px-2.5 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm text-white/80"
                >
                  {project.category}
                </motion.span>
              )}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 sm:mb-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
          >
            {project.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8 text-sm sm:text-base md:text-lg text-white/80 text-justify leading-relaxed"
          >
            {project.fullDescription}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6 sm:mb-8"
          >
            <h3 className="mb-3 sm:mb-4 text-lg sm:text-xl font-semibold text-white">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-full bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-white"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8"
          >
            {project.liveUrl && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
              <Button
                onClick={() => hapticManager.medium()}
                className="bg-white text-black hover:bg-white/90 text-sm sm:text-base"
                asChild
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Live Demo
                </a>
              </Button>
              </motion.div>
            )}
            {project.githubUrl && (
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
              <Button
                onClick={() => hapticManager.medium()}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-sm sm:text-base"
                asChild
              >
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  GitHub
                </a>
              </Button>
              </motion.div>
            )}
            {project.otherLinks?.map((link, index) => (
              <motion.div
                key={link.url}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <Button
                onClick={() => hapticManager.medium()}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 text-sm sm:text-base"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </Button>
              </motion.div>
            ))}
          </motion.div>

          {project.features && project.features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10"
            >
              <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold text-white">
                Features
              </h3>
              <ul className="space-y-3 list-none">
                {project.features.map((feature, index) => {
                  // Split feature into title and description
                  const colonIndex = feature.indexOf(": ");
                  const title = colonIndex !== -1 ? feature.substring(0, colonIndex) : "";
                  const description = colonIndex !== -1 ? feature.substring(colonIndex + 2) : feature;
                  
                  // Key phrases to highlight
                  const keyPhrases = [
                    "visual cues", "user confidence", "engagement", "waste-sorting",
                    "emotional satisfaction", "emotional response",
                    "gamification", "habitual", "engaging", "fun",
                    "environmental awareness", "tracks", "insights", "contribution",
                    "image recognition", "classify", "accuracy", "effectively", "correctly"
                  ];
                  
                  // Function to render text with highlights
                  const renderWithHighlights = (text: string) => {
                    const parts: (string | React.ReactElement)[] = [];
                    let lastIndex = 0;
                    let key = 0;
                    
                    // Find all matches
                    const matches: Array<{ start: number; end: number; text: string }> = [];
                    keyPhrases.forEach(phrase => {
                      const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, "gi");
                      let match;
                      while ((match = regex.exec(text)) !== null) {
                        matches.push({
                          start: match.index,
                          end: match.index + match[0].length,
                          text: match[0]
                        });
                      }
                    });
                    
                    // Sort matches by position
                    matches.sort((a, b) => a.start - b.start);
                    
                    // Remove overlapping matches
                    const nonOverlapping: typeof matches = [];
                    for (const match of matches) {
                      if (nonOverlapping.length === 0 || match.start >= nonOverlapping[nonOverlapping.length - 1].end) {
                        nonOverlapping.push(match);
                      }
                    }
                    
                    // Build parts array
                    nonOverlapping.forEach(match => {
                      if (match.start > lastIndex) {
                        parts.push(text.substring(lastIndex, match.start));
                      }
                      parts.push(
                        <span key={key++} className="font-semibold text-white">
                          {match.text}
                        </span>
                      );
                      lastIndex = match.end;
                    });
                    
                    if (lastIndex < text.length) {
                      parts.push(text.substring(lastIndex));
                    }
                    
                    return parts.length > 0 ? parts : text;
                  };
                  
                  return (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      className="text-white/90 leading-relaxed text-justify pl-0 flex items-start text-sm sm:text-base"
                    >
                      <span className="mr-3 sm:mr-4 h-2 w-2 rotate-45 bg-white/50 shrink-0 mt-2.5"></span>
                      <span className="flex-1 min-w-0">
                        {title && (
                          <>
                            <span className="font-semibold text-white">{title}:</span>{" "}
                          </>
                        )}
                        {renderWithHighlights(description)}
                      </span>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>
          )}

          {imagesToShow.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10"
            >
              <h3 className="mb-4 sm:mb-6 text-xl sm:text-2xl font-semibold text-white">
                Gallery
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {imagesToShow.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.08,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-white/5 cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-300"
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${project.name} - Image ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Image number indicator */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {index + 1}/{imagesToShow.length}
                    </div>
                  </motion.div>
                ))}
              </div>
        </motion.div>
          )}

          {/* Lightbox Modal */}
          {lightboxOpen && (
        <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 z-10"
                aria-label="Close lightbox"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </button>

              {/* Previous Button */}
              {imagesToShow.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 z-10 touch-manipulation"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </button>
              )}

              {/* Next Button */}
              {imagesToShow.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 z-10 touch-manipulation"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </button>
              )}

              {/* Image Counter */}
              {imagesToShow.length > 1 && (
                <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
                  {currentImageIndex + 1} / {imagesToShow.length}
                </div>
              )}

              {/* Main Image */}
              <div
                className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4 sm:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  key={currentImageIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-full max-w-full max-h-full"
                >
                  <Image
                    src={imagesToShow[currentImageIndex]}
                    alt={`${project.name} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                    sizes="100vw"
          />
        </motion.div>
      </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

