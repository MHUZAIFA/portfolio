"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useState, useRef } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Calendar,
  Award,
  TrendingUp,
  Zap,
  Target,
  Code,
  Rocket,
  Building2,
  Cloud
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { SiReact, SiAngular, SiDotnet, SiJavascript, SiTypescript, SiMongodb, SiNodedotjs, SiDocker, SiKubernetes, SiExpress } from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import type { IconType } from "react-icons";

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string;
  fullDescription?: string;
  logo?: string;
  technologies?: string[];
  achievements?: Array<{
    icon: LucideIcon;
    label: string;
    value: string;
    color: string;
  }>;
  type: "full-time" | "internship";
}

const experiences: Experience[] = [
  {
    id: "1",
    company: "Flexspring",
    role: "Full-stack Development Intern",
    duration: "Sep 2024 - Present",
    location: "Montreal, Quebec, Canada",
    type: "internship",
    description:
      "Full-stack Development Intern at Flexspring, Montreal, Quebec, Canada. Working with React.js, Java and other modern technologies.",
    fullDescription:
      "Currently working as a Full-stack Development Intern at Flexspring, contributing to the development of modern web applications using React.js, Java, and other cutting-edge technologies. Based in Montreal, Quebec, Canada.",
    technologies: ["React.js", "Java", "TypeScript", "Node.js"],
    achievements: [
      { icon: Code, label: "Technologies", value: "Modern Stack", color: "from-blue-500 to-cyan-500" },
    ],
  },
  {
    id: "2",
    company: "CitiusTech",
    role: "Senior Software Engineer",
    duration: "Apr 2023 - Aug 2023",
    location: "Remote",
    type: "full-time",
    description:
      "Developed a viewer for IBM Health Watson (now Merative) using Angular, DotNet, SQL, ML, AI, DICOM, PACS, and other technologies to improve cancer detection and reduce tumour analysis time.",
    fullDescription:
      "Developed a viewer for IBM Health Watson (now Merative) using Angular, DotNet, SQL, ML, AI, DICOM, PACS, and other technologies to: a. Improve cancer detection, b. Reduce time taken in performing tumour analysis, and c. Assist in making informed decisions. Created reusable Angular components that reduced front-end development time by 30%. Achieved 95% unit test code coverage throughout the application. Improved application spin-up time from 3 to 1.5 seconds approx. Wrote clean optimized code applying software development principles like OOPS, SOLID, and DRY. Developed a successful POC which was demonstrated at RSNA 2023, leading to new customer acquisitions.",
    technologies: ["Angular", ".NET", "SQL", "ML", "AI", "DICOM", "PACS", "C#"],
    achievements: [
      { icon: TrendingUp, label: "Frontend Dev Time", value: "30% Reduction", color: "from-green-500 to-emerald-500" },
      { icon: Target, label: "Test Coverage", value: "95%", color: "from-purple-500 to-pink-500" },
      { icon: Zap, label: "Spin-up Time", value: "1.5s (50% faster)", color: "from-yellow-500 to-orange-500" },
      { icon: Rocket, label: "POC Success", value: "RSNA 2023", color: "from-blue-500 to-indigo-500" },
    ],
  },
  {
    id: "3",
    company: "CitiusTech",
    role: "Software Engineer",
    duration: "Dec 2021 - Mar 2023",
    location: "Mumbai, Maharashtra, India",
    type: "full-time",
    description:
      "Software Engineer at CitiusTech, Mumbai, Maharashtra, India. Worked with Angular, Microsoft SQL Server and other technologies.",
    fullDescription:
      "Worked as a Software Engineer at CitiusTech, contributing to various healthcare technology projects. Utilized Angular, Microsoft SQL Server, and other modern technologies to deliver high-quality software solutions.",
    technologies: ["Angular", "SQL Server", ".NET", "TypeScript", "Azure"],
    achievements: [
      { icon: Code, label: "Healthcare Tech", value: "Enterprise Solutions", color: "from-cyan-500 to-blue-500" },
    ],
  },
  {
    id: "4",
    company: "Willis Towers Watson",
    role: "Full Stack Developer",
    duration: "Jul 2019 - Nov 2021",
    location: "Thane, Maharashtra, India",
    type: "full-time",
    description:
      "Developed and delivered enterprise-grade applications in an agile environment using Angular, .Net, SQL, CosmosDB, and Azure.",
    fullDescription:
      "Developed and delivered enterprise-grade applications in an agile environment using Angular, .Net, SQL, CosmosDB, and Azure. Managed Angular libraries and expanded toolkit with reusable components for multiple projects. Applied software development principles (SOLID, ONION) and design patterns (Strategy, Repository) in MVC framework. By continually monitoring and optimizing azure resources and its metrics, saved more than 1000 pounds. Reduced data retrieval time from 5-10 seconds to 0.5-1 seconds, enhancing application performance. Achieved 90-95% unit test code coverage across applications and APIs. Defined branching, release strategies, and CI/CD pipelines in Azure DevOps for diverse environments.",
    technologies: ["Angular", ".NET", "SQL", "CosmosDB", "Azure", "Azure DevOps"],
    achievements: [
      { icon: Award, label: "Cost Savings", value: "£1000+", color: "from-green-500 to-teal-500" },
      { icon: Zap, label: "Data Retrieval", value: "0.5-1s (90% faster)", color: "from-yellow-500 to-amber-500" },
      { icon: Target, label: "Test Coverage", value: "90-95%", color: "from-purple-500 to-violet-500" },
      { icon: Rocket, label: "CI/CD", value: "Azure DevOps", color: "from-blue-500 to-cyan-500" },
    ],
  },
  {
    id: "5",
    company: "Reliance Industries Limited",
    role: "Full-stack Development Intern",
    duration: "Dec 2018 - Jan 2019",
    location: "Mumbai, Maharashtra, India",
    type: "internship",
    description:
      "Developed MEAN stack project management application using Angular, Node.js, Express server, and MongoDB, increasing productivity of internal teams by 27%.",
    fullDescription:
      "Developed MEAN stack project management application using Angular, Node.js, Express server, and MongoDB (MEAN Stack), increasing the productivity of internal teams by 27% within the first quarter of launch.",
    technologies: ["Angular", "Node.js", "Express", "MongoDB", "MEAN Stack"],
    achievements: [
      { icon: TrendingUp, label: "Productivity", value: "27% Increase", color: "from-green-500 to-emerald-500" },
      { icon: Rocket, label: "Launch", value: "Q1 Success", color: "from-blue-500 to-indigo-500" },
    ],
  },
];

const techIcons: Record<string, IconType | LucideIcon> = {
  "React.js": SiReact,
  "React": SiReact,
  "Angular": SiAngular,
  ".NET": SiDotnet,
  "Java": FaJava,
  "TypeScript": SiTypescript,
  "JavaScript": SiJavascript,
  "Node.js": SiNodedotjs,
  "Express": SiExpress,
  "MongoDB": SiMongodb,
  "Azure": Cloud,
  "AWS": FaAws,
  "Docker": SiDocker,
  "Kubernetes": SiKubernetes,
  "C#": SiDotnet,
  "SQL": SiDotnet,
  "CosmosDB": Cloud,
  "ML": Cloud,
  "AI": Cloud,
  "DICOM": Cloud,
  "PACS": Cloud,
};

// Generate particle positions once
const generateParticles = () => {
  return Array.from({ length: 20 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2,
  }));
};

export default function ExperiencePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [particles] = useState(() => generateParticles());
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (id: string) => {
    hapticManager.light();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient Blobs */}
        <motion.div
          className="absolute left-[10%] top-[10%] h-[600px] w-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-[15%] top-[50%] h-[500px] w-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 100, -60, 0],
            scale: [1, 1.3, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
        className="relative mx-auto max-w-7xl px-4 py-24"
    >
        {/* Header */}
      <motion.h1
        variants={staggerItem}
        className="mb-12 text-4xl font-bold text-white md:text-5xl"
      >
        Experience
      </motion.h1>

        <motion.section
          variants={staggerItem}
          className="mb-16 space-y-4 text-lg text-white/80"
        >
          <p className="text-justify">
            My professional journey has been marked by continuous growth,
            innovation, and a commitment to delivering exceptional results. From
            developing enterprise-grade healthcare solutions to building modern
            web applications, I&apos;ve had the opportunity to work with
            cutting-edge technologies and contribute to meaningful projects.
          </p>
          <p className="text-justify">
            Each role has shaped my expertise in full-stack development,
            software engineering principles, and collaborative problem-solving.
            I take pride in writing clean, optimized code and achieving
            measurable improvements in performance, efficiency, and user
            experience.
          </p>
        </motion.section>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Timeline Line */}
          <motion.div
            className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 md:left-12"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{ transformOrigin: "top" }}
          />

          {/* Timeline Nodes */}
          {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative mb-12 flex flex-col md:flex-row md:items-center"
            >
              {/* Timeline Node */}
              <div className="absolute left-8 z-10 md:left-12 md:-translate-x-1/2">
                <motion.div
                  className="relative h-6 w-6 rounded-full border-4 border-white/20 bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-purple-500/50"
                  whileHover={{ scale: 1.5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>

              {/* Experience Card */}
              <div className="ml-20 flex-1 md:ml-24 md:pl-8">
                <motion.div
                  onMouseEnter={() => {
                    setHoveredId(exp.id);
                    hapticManager.light();
                  }}
                  onMouseLeave={() => setHoveredId(null)}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="group relative overflow-hidden border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 md:p-8">
                    {/* Gradient Border Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 transition-opacity group-hover:opacity-100"
                      initial={false}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <motion.div
                              className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20"
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.6 }}
                            >
                              <Building2 className="h-6 w-6 text-white/80" />
                            </motion.div>
                    <div>
                              <h3 className="text-xl font-bold text-white md:text-2xl">
                        {exp.role}
                      </h3>
                              <p className="text-lg font-medium text-white/70">
                                {exp.company}
                              </p>
                    </div>
                  </div>

                          {/* Meta Info */}
                          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{exp.duration}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{exp.location}</span>
                            </div>
                            <motion.span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                exp.type === "full-time"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-purple-500/20 text-purple-300"
                              }`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {exp.type === "full-time" ? "Full-time" : "Internship"}
                            </motion.span>
                          </div>
                </div>

                        {/* Expand Button */}
                {exp.fullDescription && (
                          <motion.button
                    onClick={() => toggleExpand(exp.id)}
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            className="ml-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  >
                    {expandedId === exp.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                          </motion.button>
                        )}
                      </div>

                      {/* Description */}
                      <p className="mb-4 text-white/80">{exp.description}</p>

                      {/* Technologies */}
                      {exp.technologies && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {exp.technologies.slice(0, 6).map((tech) => {
                            const Icon = techIcons[tech];
                            return (
                              <motion.div
                                key={tech}
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20"
                              >
                                {Icon && <Icon className="h-4 w-4" />}
                                <span>{tech}</span>
                              </motion.div>
                            );
                          })}
                          {exp.technologies.length > 6 && (
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className="flex items-center rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80"
                            >
                              +{exp.technologies.length - 6} more
                            </motion.span>
                          )}
                        </div>
                      )}

                      {/* Achievements */}
                      {exp.achievements && (
                        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                          {exp.achievements.map((achievement, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${achievement.color} p-3 backdrop-blur-sm`}
                            >
                              <div className="relative z-10">
                                <achievement.icon className="mb-1 h-5 w-5 text-white" />
                                <p className="text-xs font-medium text-white/90">
                                  {achievement.label}
                                </p>
                                <p className="text-sm font-bold text-white">
                                  {achievement.value}
                                </p>
                              </div>
                              <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 transition-opacity group-hover:opacity-20`}
                                animate={{
                                  scale: hoveredId === exp.id ? [1, 1.2, 1] : 1,
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Expanded Description */}
                      <AnimatePresence>
                        {expandedId === exp.id && exp.fullDescription && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                              <p className="whitespace-pre-line text-white/80">
                                {exp.fullDescription}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{
                        x: hoveredId === exp.id ? "100%" : "-100%",
                      }}
                      transition={{ duration: 0.6 }}
                    />
                  </Card>
                </motion.div>
              </div>
          </motion.div>
        ))}
      </div>

        {/* Floating Particles */}
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
    </motion.div>
    </div>
  );
}
