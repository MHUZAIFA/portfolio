"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { useEffect, use } from "react";

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
}

const projects: Record<string, Project> = {
  metricstics: {
    id: "metricstics",
    name: "Metricstics",
    description: "Discover the Power of Metrics and Statistics",
    fullDescription:
      "METRICSTICS, a fusion of METRICS and STATISTICS, is your tool developed using purely python for calculating essential statistical values - m, M, o, d, μ, MAD, and σ. This system processes random data sets, enabling accurate descriptive statistics calculations. METRICSTICS streamlines complex statistical calculations for analysts, researchers, and data scientists, offering precise insights crucial for informed decision-making in diverse industries.",
    image: "/imgs/projects/metricstics.png",
    technologies: ["Python", "Statistics", "Data Analysis", "Descriptive Statistics"],
    category: "Productivity & Utilities",
    date: "November 2023",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/metricstics",
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
    image: "/imgs/projects/mockup_snkr_store.png",
    technologies: ["E-Commerce", "PWA", "Cross Platform", "Shopping Cart", "Order Tracking"],
    category: "E-Commerce",
    date: "May 2022",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/snkrs",
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

  useEffect(() => {
    if (!project) {
      router.push("/projects");
    }
  }, [project, router]);

  if (!project) {
    return null;
  }

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="min-h-screen"
    >
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
        <motion.div
          variants={staggerItem}
          className="flex flex-col justify-center bg-gradient-to-r from-black via-black/90 to-transparent px-8 py-24 lg:px-16 overflow-y-auto max-h-screen"
        >
          <motion.div
            variants={staggerItem}
            className="mb-6"
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

          {(project.category || project.date) && (
            <motion.div
              variants={staggerItem}
              className="mb-4 flex flex-wrap gap-4 text-sm text-white/60"
            >
              {project.category && (
                <span className="rounded-full bg-white/10 px-3 py-1">
                  {project.category}
                </span>
              )}
              {project.date && <span>{project.date}</span>}
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
            className="mb-8 text-lg text-white/80"
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
              <div className="space-y-4">
                {project.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 rounded-lg bg-white/5 border border-white/10"
                  >
                    <p className="text-white/90 leading-relaxed">{feature}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          variants={staggerItem}
          className="relative min-h-[400px] lg:min-h-screen"
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            src={project.image}
            alt={project.name}
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

