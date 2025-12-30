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
    description: "A lucid to do application for managing and tracking day to day activities",
    fullDescription:
      "MyTasks is a cross platform cloud-based progressive web application for task management. It allows users to manage their tasks from a smartphone, tablet and computer. A lucid to do application for managing and tracking day to day activities.",
    image: "/imgs/projects/mockup_todo.png",
    technologies: ["PWA", "Cross Platform", "Cloud-Based", "Task Management"],
    category: "Productivity & Tracking",
    date: "December 2022",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/mytasks",
  },
  snkrs: {
    id: "snkrs",
    name: "SNKRS",
    description: "An online e-commerce web application for browsing and buying sneakers",
    fullDescription:
      "A cross platform progressive e-commerce web application for purchasing sneakers. Users can view, search and filter from a wide range of sneakers to find the sneaker of their choice. LoggedIn users can review, wishlist, buy and track their orders. From browsing to checkout this application delivers the best in class user experience.",
    image: "/imgs/projects/snkrsbg.png",
    technologies: ["E-Commerce", "PWA", "Cross Platform", "Shopping Cart", "Order Tracking"],
    category: "E-Commerce",
    date: "May 2022",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/snkrs",
    additionalImages: [
      "/imgs/projects/snkrsbg.png",
      "/imgs/projects/snkrsmb.png",
      "/imgs/projects/snkrs.png"
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
    description: "A mobile application that simplifies waste sorting using visual cues and image recognition",
    fullDescription:
      "RecycleVision is an application developed as part of the SOEN 6751 HCI course. In this project, we aim to develop a mobile application that simplifies the process of waste sorting. The application will use visual cues and gamification to engage users and increase their confidence in waste disposal practices. It will also leverage image recognition technology to classify different types of waste, thereby reducing confusion and increasing accuracy in waste disposal.",
    image: "/imgs/projects/RecycleVision.png",
    technologies: ["Mobile", "Image Recognition", "HCI", "Gamification", "React Native"],
    category: "Mobile Application",
    date: "Feb 18, 2024 - May 1, 2024",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/recyclevision",
    features: [
      "Visual Cues for Waste Sorting: The application uses visual cues to enhance user confidence and engagement in waste-sorting practices. This feature helps users to identify and sort waste correctly.",
      "Emotional Satisfaction: The application is designed to impact the user's emotional response positively. It provides satisfaction to users by enabling them to dispose of waste effectively and correctly.",
      "Gamification of Waste Sorting: The application incorporates gamification elements to encourage habitual correct waste sorting. This feature makes the waste sorting process more engaging and fun for users.",
      "Environmental Awareness: The application aims to increase user's environmental awareness. It tracks the user's waste sorting practices before and after using the application, providing insights into their contribution to broader environmental practices.",
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
        className="fixed inset-0 z-0"
      >
        <motion.img
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          src={project.image}
          alt={project.name}
          className="h-full w-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/80" />
      </motion.div>

      {/* Content Overlay */}
      <motion.div
        variants={staggerItem}
        className="relative z-10 flex min-h-screen overflow-y-auto"
        style={{
          backgroundColor: "black",
          willChange: "opacity",
          WebkitMaskImage: `
            linear-gradient(
              to right,
              black 0%,
              black 25%,
              rgba(0,0,0,0.9) 35%,
              rgba(0,0,0,0.3) 70%,
              rgba(0,0,0,0.15) 85%,
              rgba(0,0,0,0) 100%
            )
          `,
          maskImage: `
            linear-gradient(
              to right,
              black 0%,
              black 45%,
              rgba(0,0,0,0.9) 55%,
              rgba(0,0,0,0.6) 70%,
              rgba(0,0,0,0.3) 85%,
              transparent 100%
            )
          `
        }}
      >
        <div className="w-1/2 flex flex-col justify-center px-8 py-24 lg:px-16">
          <motion.div
            variants={staggerItem}
            className="mb-12 mt-16"
          >
            <Button
              onClick={() => {
                hapticManager.light();
                router.push("/projects");
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </motion.div>

          {project.date && (
            <motion.div
              variants={staggerItem}
              className="mb-4 flex flex-wrap gap-4 text-sm text-white/60"
            >
              {project.date && <span>{project.date}</span>}
            </motion.div>
          )}

          {project.category && (
            <motion.div
              variants={staggerItem}
              className="mb-4 flex flex-wrap gap-4 text-sm text-white/60"
            >
              {project.category && (
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {project.category}
                </span>
              )}
            </motion.div>
          )}

          <motion.h1
            variants={staggerItem}
            className="mb-6 text-4xl font-bold text-white md:text-5xl"
          >
            {project.name}
          </motion.h1>

          <motion.p
            variants={staggerItem}
            className="mb-8 text-lg text-white/80 text-justify"
          >
            {project.fullDescription}
          </motion.p>

          <motion.div variants={staggerItem} className="mb-8">
            <h3 className="mb-4 text-xl font-semibold text-white">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-white/10 px-4 py-2 text-sm text-white"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={staggerItem}
            className="flex flex-wrap gap-4 mb-8"
          >
            {project.liveUrl && (
              <Button
                onClick={() => hapticManager.medium()}
                className="bg-white text-black hover:bg-white/90"
                asChild
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Live Demo
                </a>
              </Button>
            )}
            {project.githubUrl && (
              <Button
                onClick={() => hapticManager.medium()}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </a>
              </Button>
            )}
            {project.otherLinks?.map((link) => (
              <Button
                key={link.url}
                onClick={() => hapticManager.medium()}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                asChild
              >
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </Button>
            ))}
          </motion.div>

          {project.features && project.features.length > 0 && (
            <motion.div
              variants={staggerItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
              className="mt-8 pt-8 border-t border-white/10"
            >
              <h3 className="mb-6 text-2xl font-semibold text-white">
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
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="text-white/90 leading-relaxed text-justify pl-0 flex items-start"
                    >
                      <span className="mr-4 h-2 w-2 rotate-45 bg-white/50 shrink-0 mt-2.5"></span>
                      <span className="flex-1">
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
              variants={staggerItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
              className="mt-8 pt-8 border-t border-white/10"
            >
              <h3 className="mb-6 text-2xl font-semibold text-white">
                Gallery
              </h3>
              <div className="flex gap-4">
                {imagesToShow.map((imageUrl, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative h-[170px] overflow-hidden rounded-sm bg-white/5 cursor-pointer flex items-center justify-center"
                    onClick={() => openLightbox(index)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${project.name} - Image ${index + 1}`}
                      width={1200}
                      height={800}
                      className="max-h-full max-w-full w-auto h-auto object-contain hover:scale-105 transition-transform duration-300"
                    />
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
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
              onClick={closeLightbox}
            >
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Close lightbox"
              >
                <X className="h-6 w-6 text-white" />
              </button>

              {/* Previous Button */}
              {imagesToShow.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-8 w-8 text-white" />
                </button>
              )}

              {/* Next Button */}
              {imagesToShow.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8 text-white" />
                </button>
              )}

              {/* Image Counter */}
              {imagesToShow.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 text-white text-sm">
                  {currentImageIndex + 1} / {imagesToShow.length}
                </div>
              )}

              {/* Main Image */}
              <div
                className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={imagesToShow[currentImageIndex]}
                    alt={`${project.name} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
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

