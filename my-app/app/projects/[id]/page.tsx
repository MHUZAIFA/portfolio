"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { useEffect } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  otherLinks?: { label: string; url: string }[];
}

const projects: Record<string, Project> = {
  "project-1": {
    id: "project-1",
    name: "E-Commerce Platform",
    description: "A full-stack e-commerce solution",
    fullDescription:
      "A comprehensive e-commerce platform built with modern web technologies. Features include user authentication, product catalog, shopping cart, payment processing with Stripe, order management, and an admin dashboard for managing products and orders.",
    image: "/placeholder-project.jpg",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Express"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
  },
  "project-2": {
    id: "project-2",
    name: "Task Management App",
    description: "Collaborative task management application",
    fullDescription:
      "A real-time collaborative task management application. Built with Angular for the frontend and .NET Core for the backend. Features include team collaboration, task assignments, due dates, notifications, and project organization.",
    image: "/placeholder-project.jpg",
    technologies: ["Angular", ".NET Core", "PostgreSQL", "SignalR"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
  },
  "project-3": {
    id: "project-3",
    name: "Portfolio Website",
    description: "Modern portfolio website",
    fullDescription:
      "A modern, responsive portfolio website showcasing my work and skills. Built with Next.js, TypeScript, and Framer Motion for smooth animations. Features include dark theme, smooth page transitions, and fully responsive design.",
    image: "/placeholder-project.jpg",
    technologies: ["Next.js", "TypeScript", "Framer Motion", "Tailwind CSS"],
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example",
  },
};

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const project = projects[params.id];

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
          className="flex flex-col justify-center bg-gradient-to-br from-black via-black/80 to-transparent px-8 py-24 lg:px-16"
        >
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
            className="flex flex-wrap gap-4"
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

