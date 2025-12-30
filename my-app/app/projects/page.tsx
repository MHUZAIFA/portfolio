"use client";

import { motion } from "framer-motion";
import { ProjectCard } from "@/components/project-card";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";

// Helper function to parse date string and return a sortable date
function parseDate(dateString: string): Date {
  // Handle date ranges (take the start date)
  const date = dateString.split(" - ")[0];
  
  // Parse different date formats
  const monthNames: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };

  // Try to parse "Month Day, Year" format (e.g., "Feb 18, 2024")
  const dateMatch = date.match(/(\w+)\s+(\d+),\s+(\d+)/i);
  if (dateMatch) {
    const month = monthNames[dateMatch[1].toLowerCase()];
    const day = parseInt(dateMatch[2]);
    const year = parseInt(dateMatch[3]);
    return new Date(year, month, day);
  }

  // Try to parse "Month Year" format (e.g., "November 2023")
  const monthYearMatch = date.match(/(\w+)\s+(\d+)/i);
  if (monthYearMatch) {
    const month = monthNames[monthYearMatch[1].toLowerCase()];
    const year = parseInt(monthYearMatch[2]);
    return new Date(year, month, 1);
  }

  // Fallback to current date if parsing fails
  return new Date();
}

const projects = [
  {
    id: "recyclevision",
    name: "RecycleVision",
    description:
      "A mobile application that simplifies waste sorting using visual cues and image recognition technology.",
    thumbnail: "/imgs/projects/RecycleVision.png",
    technologies: ["Mobile", "Image Recognition", "HCI", "Gamification"],
    sortDate: "Feb 18, 2024 - May 1, 2024",
  },
  {
    id: "metricstics",
    name: "Metricstics",
    description:
      "Discover the Power of Metrics and Statistics - A Python tool for calculating essential statistical values.",
    thumbnail: "/imgs/projects/metricstics.png",
    technologies: ["Python", "Statistics", "Data Analysis"],
    sortDate: "November 2023",
  },
  {
    id: "mytasks",
    name: "MyTasks",
    description:
      "A lucid to do application for managing and tracking day to day activities.",
    thumbnail: "/imgs/projects/mockup_todo.png",
    technologies: ["PWA", "Cross Platform", "Cloud-Based"],
    sortDate: "December 2022",
  },
  {
    id: "snkrs",
    name: "SNKRS",
    description:
      "An online e-commerce web application for browsing and buying sneakers.",
    thumbnail: "/imgs/projects/mockup_snkr_store.png",
    technologies: ["E-Commerce", "PWA", "Cross Platform"],
    sortDate: "May 2022",
  },
  {
    id: "helpdesk",
    name: "Helpdesk",
    description:
      "A web application for requesting for an asset or raising an issue.",
    thumbnail: "/imgs/projects/crm.png",
    technologies: ["PWA", "Support", "Cloud-Based"],
    sortDate: "Feb 2022",
  },
].sort((a, b) => {
  // Sort by date, most recent first
  const dateA = parseDate(a.sortDate);
  const dateB = parseDate(b.sortDate);
  return dateB.getTime() - dateA.getTime();
});

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

