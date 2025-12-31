"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { ProjectCard } from "@/components/project-card";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { Input } from "@/components/ui/input";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hapticManager } from "@/lib/haptic-manager";

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
    id: "ai-bots",
    name: "AI_Bots",
    description:
      "Applied AI project featuring comparative analysis of ML models and CNN-based image classification.",
    thumbnail: "/imgs/projects/ai.png",
    technologies: ["Machine Learning", "Deep Learning", "Python", "CNN", "SVM"],
    sortDate: "May 29, 2025 - Jun 22, 2025",
    date: "May 29, 2025 - Jun 22, 2025",
    category: "Machine Learning & AI",
    featured: true,
  },
  {
    id: "recyclevision",
    name: "RecycleVision",
    description:
      "A mobile application that simplifies waste sorting using ML/AI-powered object detection and classification via Hugging Face API.",
    thumbnail: "/imgs/projects/RecycleVision.png",
    technologies: ["Mobile", "ML/AI", "Hugging Face API", "Image Recognition", "HCI", "Gamification"],
    sortDate: "Feb 18, 2024 - May 1, 2024",
    date: "Feb 18, 2024 - May 1, 2024",
    category: "Mobile Application",
    featured: true,
  },
  {
    id: "ai-report-workflow",
    name: "AI-Driven Report Generation",
    description:
      "An automated reporting system built using n8n that generates reports using natural language prompts.",
    thumbnail: "/imgs/projects/n8nlogo.png",
    technologies: ["n8n", "Automation", "AI", "REST APIs", "Workflow"],
    sortDate: "Dec 2025",
    date: "December 2024",
    category: "Automation / Reporting",
  },
  {
    id: "metricstics",
    name: "Metricstics",
    description:
      "Discover the Power of Metrics and Statistics - A Python tool for calculating essential statistical values.",
    thumbnail: "/imgs/projects/metricstics.png",
    technologies: ["Python", "Statistics", "Data Analysis"],
    sortDate: "November 2023",
    date: "November 2023",
    category: "Productivity & Utilities",
  },
  {
    id: "mytasks",
    name: "MyTasks",
    description:
      "A user-friendly cross-platform to-do application for efficiently managing and tracking day-to-day activities.",
    thumbnail: "/imgs/projects/todobg.png",
    technologies: ["Angular", "PWA", "Cross Platform", "Cloud-Based", "Firebase"],
    sortDate: "December 2022",
    date: "December 2022",
    category: "Productivity & Tracking",
  },
  {
    id: "snkrs",
    name: "SNKRS",
    description:
      "An online e-commerce web application for browsing and buying sneakers.",
    thumbnail: "/imgs/projects/snkrsbg.png",
    technologies: ["E-Commerce", "PWA", "Cross Platform"],
    sortDate: "May 2022",
    date: "May 2022",
    category: "E-Commerce",
  },
  {
    id: "helpdesk",
    name: "Helpdesk",
    description:
      "A web application for requesting for an asset or raising an issue.",
    thumbnail: "/imgs/projects/crm.png",
    technologies: ["PWA", "Support", "Cloud-Based"],
    sortDate: "Feb 2022",
    date: "Feb 2022",
    category: "Support",
  },
].sort((a, b) => {
  // Sort by date, most recent first
  const dateA = parseDate(a.sortDate);
  const dateB = parseDate(b.sortDate);
  return dateB.getTime() - dateA.getTime();
});

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get all unique technologies and categories
  const allTechnologies = useMemo(() => {
    const techs = new Set<string>();
    projects.forEach((project) => {
      project.technologies?.forEach((tech) => techs.add(tech));
    });
    return Array.from(techs).sort();
  }, []);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach((project) => {
      if (project.category) cats.add(project.category);
    });
    return Array.from(cats).sort();
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        searchQuery === "" ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.technologies?.some((tech) =>
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesTech =
        selectedTech === null ||
        project.technologies?.some((tech) => tech === selectedTech);

      const matchesCategory =
        selectedCategory === null || project.category === selectedCategory;

      return matchesSearch && matchesTech && matchesCategory;
    });
  }, [searchQuery, selectedTech, selectedCategory]);

  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTech(null);
    setSelectedCategory(null);
    hapticManager.light();
  };

  const hasActiveFilters = searchQuery !== "" || selectedTech !== null || selectedCategory !== null;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mx-auto max-w-7xl px-4 py-12 md:py-24"
    >
      {/* Header Section */}
      <motion.div variants={staggerItem} className="mb-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-gradient-to-r from-white to-white/70 bg-clip-text text-4xl font-bold text-transparent md:text-6xl"
        >
          My Projects
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-white/60 md:text-xl"
        >
          A collection of my work and creative endeavors
        </motion.p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div
        variants={staggerItem}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <Input
            type="text"
            placeholder="Search projects by name, description, or technology..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-12 border-white/20 bg-white/5 pl-12 pr-4 text-white placeholder:text-white/40 backdrop-blur-sm focus:border-white/40 focus:bg-white/10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/60"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>

          {/* Category Filter */}
          {allCategories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(selectedCategory === category ? null : category);
                hapticManager.light();
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-white text-black"
                  : "bg-white/10 text-white/80 hover:bg-white/20"
              }`}
            >
              {category}
            </button>
          ))}

          {/* Technology Filter */}
          {allTechnologies.slice(0, 8).map((tech) => (
            <button
              key={tech}
              onClick={() => {
                setSelectedTech(selectedTech === tech ? null : tech);
                hapticManager.light();
              }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                selectedTech === tech
                  ? "bg-white/20 text-white ring-2 ring-white/30"
                  : "bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {tech}
            </button>
          ))}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              variant="ghost"
              size="sm"
              className="ml-auto text-white/60 hover:text-white"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* Results Count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-white/50"
        >
          {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"} found
        </motion.p>
      </motion.div>

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <motion.div variants={staggerItem} className="mb-12">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-6 text-2xl font-semibold text-white md:text-3xl"
          >
            Featured Projects
          </motion.h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <AnimatePresence mode="wait">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard {...project} featured={true} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Regular Projects */}
      {regularProjects.length > 0 && (
        <motion.div variants={staggerItem}>
          {featuredProjects.length > 0 && (
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-6 text-2xl font-semibold text-white md:text-3xl"
            >
              All Projects
            </motion.h2>
          )}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="wait">
              {regularProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.08 }}
                >
                  <ProjectCard {...project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* No Results */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-20 text-center"
        >
          <p className="mb-4 text-xl text-white/60">No projects found</p>
          <p className="mb-6 text-white/40">
            Try adjusting your search or filters
          </p>
          <Button
            onClick={clearFilters}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            Clear Filters
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}

