"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";

const projects = [
  {
    id: "project-1",
    name: "E-Commerce Platform",
    description:
      "A full-stack e-commerce solution with payment integration and admin dashboard.",
    thumbnail: "/placeholder-project.jpg",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
  },
  {
    id: "project-2",
    name: "Task Management App",
    description:
      "Collaborative task management application with real-time updates.",
    thumbnail: "/placeholder-project.jpg",
    technologies: ["Angular", ".NET Core", "PostgreSQL"],
  },
  {
    id: "project-3",
    name: "Portfolio Website",
    description: "Modern portfolio website with smooth animations and responsive design.",
    thumbnail: "/placeholder-project.jpg",
    technologies: ["Next.js", "TypeScript", "Framer Motion"],
  },
  // Add more projects as needed
];

export default function ProjectsPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mx-auto max-w-6xl px-4 py-24"
    >
      <motion.h1
        variants={staggerItem}
        className="mb-12 text-4xl font-bold text-white md:text-5xl"
      >
        Projects
      </motion.h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <ProjectCard {...project} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

