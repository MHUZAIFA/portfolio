"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { useState } from "react";
import { 
  MessageCircle,
  Users,
  Lightbulb,
  Clock,
  Crown,
  RefreshCw,
  Brain,
  Eye,
  BarChart3,
  Tag,
  Sparkles,
  Play,
  Database,
  Cloud
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { 
  SiReact,
  SiAngular,
  SiNextdotjs,
  SiHtml5,
  SiBootstrap,
  SiCss3,
  SiJavascript,
  SiSass,
  SiExpress,
  SiDotnet,
  SiPhp,
  SiApachecassandra,
  SiMongodb,
  SiFirebase,
  SiRedis,
  SiTypescript,
  SiSharp,
  SiPython,
  SiC,
  SiCplusplus,
  SiN8N,
  SiJenkins,
  SiVercel,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiOverleaf,
  SiOpenai,
  SiGooglegemini,
  SiGooglecloud,
  SiSpringboot,
  SiQuarkus,
  SiTailwindcss,
  SiShadcnui,
  SiMaterialdesign,
  SiMui
} from "react-icons/si";
import {
  FaJava,
  FaMicrosoft,
  FaFilePowerpoint,
  FaFileWord,
  FaFileExcel,
  FaAws
} from "react-icons/fa";
import type { IconType } from "react-icons";
import Link from "next/link";
import Image from "next/image";

// Category definitions
type CategoryName = "Frontend" | "Middleware" | "Database" | "Tools" | "Coding Languages" | "DevOps" | "Cloud" | "ML/AI";

const categories: Array<{
  name: CategoryName;
  color: string;
  skillNames: string[];
}> = [
  {
    name: "Frontend",
    color: "#3b82f6", // blue
    skillNames: ["Next JS", "React JS", "Angular", "HTML 5", "Bootstrap 4", "Tailwind CSS", "CSS 3", "JavaScript", "Sass", "shadcn/ui", "Angular Material", "Material-UI", "Google Analytics", "Tag Manager"],
  },
  {
    name: "Middleware",
    color: "#10b981", // green
    skillNames: ["Express.js", ".NET Core", "PHP", "Java Spring Boot", "Quarkus", "Java Play Framework"],
  },
  {
    name: "Database",
    color: "#f59e0b", // amber
    skillNames: ["Apache Cassandra", "Azure Cosmos DB", "SQL Server", "MongoDB", "Redis"],
  },
  {
    name: "Tools",
    color: "#8b5cf6", // violet
    skillNames: ["Dynamics 365", "PowerPoint", "Word", "Excel", "Overleaf - LaTeX"],
  },
  {
    name: "Coding Languages",
    color: "#ef4444", // red
    skillNames: ["Java", "TypeScript", "C#", "Python 3", "C++", "C"],
  },
  {
    name: "DevOps",
    color: "#06b6d4", // cyan
    skillNames: ["Azure DevOps", "Firebase", "Vercel", "Jenkins", "Docker", "Kubernetes", "Git", "GitHub", "GitLab", "Bitbucket"],
  },
  {
    name: "Cloud",
    color: "#06b6d4", // cyan
    skillNames: ["Azure", "AWS", "GCP", "Docker", "Kubernetes", "Git", "GitHub", "GitLab", "Bitbucket"],
  },
  {
    name: "ML/AI",
    color: "#ec4899", // pink
    skillNames: ["Crewdle AI", "n8n", "ChatGPT", "Gemini"],
  },
];

const technicalSkillsData: Array<{ name: string; icon: IconType | LucideIcon; url?: string }> = [
  // Frontend
  { name: "Next JS", icon: SiNextdotjs, url: "https://nextjs.org" },
  { name: "React JS", icon: SiReact, url: "https://react.dev" },
  { name: "Angular", icon: SiAngular, url: "https://angular.io" },
  { name: "HTML 5", icon: SiHtml5, url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { name: "Bootstrap 4", icon: SiBootstrap, url: "https://getbootstrap.com/docs/4.6" },
  { name: "Tailwind CSS", icon: SiTailwindcss, url: "https://tailwindcss.com" },
  { name: "CSS 3", icon: SiCss3, url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "JavaScript", icon: SiJavascript, url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "Sass", icon: SiSass, url: "https://sass-lang.com" },
  { name: "shadcn/ui", icon: SiShadcnui, url: "https://ui.shadcn.com" },
  { name: "Angular Material", icon: SiMaterialdesign, url: "https://material.angular.io" },
  { name: "Material-UI", icon: SiMui, url: "https://mui.com" },
  { name: "Google Analytics", icon: BarChart3 },
  { name: "Tag Manager", icon: Tag, url: "https://tagmanager.google.com" },
  // Middleware
  { name: "Express.js", icon: SiExpress, url: "https://expressjs.com" },
  { name: ".NET Core", icon: SiDotnet, url: "https://dotnet.microsoft.com" },
  { name: "PHP", icon: SiPhp, url: "https://www.php.net" },
  { name: "Java Spring Boot", icon: SiSpringboot, url: "https://spring.io/projects/spring-boot" },
  { name: "Quarkus", icon: SiQuarkus, url: "https://quarkus.io" },
  { name: "Java Play Framework", icon: Play, url: "https://www.playframework.com" },
  // Database
  { name: "Apache Cassandra", icon: SiApachecassandra, url: "https://cassandra.apache.org" },
  { name: "Azure Cosmos DB", icon: Database, url: "https://azure.microsoft.com/products/cosmos-db" },
  { name: "SQL Server", icon: Database, url: "https://www.microsoft.com/sql-server" },
  { name: "MongoDB", icon: SiMongodb, url: "https://www.mongodb.com" },
  { name: "Redis", icon: SiRedis, url: "https://redis.io" },
  // Tools
  { name: "Dynamics 365", icon: FaMicrosoft, url: "https://dynamics.microsoft.com" },
  { name: "PowerPoint", icon: FaFilePowerpoint, url: "https://www.microsoft.com/microsoft-365/powerpoint" },
  { name: "Word", icon: FaFileWord, url: "https://www.microsoft.com/microsoft-365/word" },
  { name: "Excel", icon: FaFileExcel, url: "https://www.microsoft.com/microsoft-365/excel" },
  { name: "Overleaf - LaTeX", icon: SiOverleaf, url: "https://www.overleaf.com" },
  // Coding Languages
  { name: "Java", icon: FaJava, url: "https://www.java.com" },
  { name: "TypeScript", icon: SiTypescript, url: "https://www.typescriptlang.org" },
  { name: "C#", icon: SiSharp, url: "https://dotnet.microsoft.com/languages/csharp" },
  { name: "Python 3", icon: SiPython, url: "https://www.python.org" },
  { name: "C++", icon: SiCplusplus, url: "https://isocpp.org" },
  { name: "C", icon: SiC, url: "https://en.wikipedia.org/wiki/C_(programming_language)" },
  // DevOps
  { name: "Azure DevOps", icon: Cloud, url: "https://azure.microsoft.com/products/devops" },
  { name: "Firebase", icon: SiFirebase, url: "https://firebase.google.com" },
  { name: "Vercel", icon: SiVercel, url: "https://vercel.com" },
  { name: "Jenkins", icon: SiJenkins, url: "https://www.jenkins.io" },
  { name: "Docker", icon: SiDocker, url: "https://www.docker.com" },
  { name: "Kubernetes", icon: SiKubernetes, url: "https://kubernetes.io" },
  { name: "Git", icon: SiGit, url: "https://git-scm.com" },
  { name: "GitHub", icon: SiGithub, url: "https://github.com" },
  { name: "GitLab", icon: SiGitlab, url: "https://gitlab.com" },
  { name: "Bitbucket", icon: SiBitbucket, url: "https://bitbucket.org" },
  // Cloud
  { name: "Azure", icon: Cloud, url: "https://azure.microsoft.com" },
  { name: "AWS", icon: FaAws, url: "https://aws.amazon.com" },
  { name: "GCP", icon: SiGooglecloud, url: "https://cloud.google.com" },
  // ML/AI
  { name: "Crewdle AI", icon: Sparkles, url: "https://www.crewdle.com" },
  { name: "n8n", icon: SiN8N, url: "https://n8n.io" },
  { name: "ChatGPT", icon: SiOpenai, url: "https://chat.openai.com" },
  { name: "Gemini", icon: SiGooglegemini, url: "https://gemini.google.com" },
];

const softSkillsData: Array<{ name: string; icon: LucideIcon }> = [
  { name: "Communication", icon: MessageCircle },
  { name: "Teamwork", icon: Users },
  { name: "Problem Solving", icon: Lightbulb },
  { name: "Time Management", icon: Clock },
  { name: "Leadership", icon: Crown },
  { name: "Adaptability", icon: RefreshCw },
  { name: "Critical Thinking", icon: Brain },
  { name: "Attention to Detail", icon: Eye },
];

// Donut Chart Component
function DonutChart({
  data,
  hoveredCategory,
  onCategoryHover,
  onCategoryLeave,
}: {
  data: Array<{ name: string; value: number; color: string }>;
  hoveredCategory: string | null;
  onCategoryHover: (name: string) => void;
  onCategoryLeave: () => void;
}) {
  const size = 300;
  const radius = size / 2;
  const innerRadius = radius * 0.6;
  const centerX = radius;
  const centerY = radius;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const createArc = (
    startAngle: number,
    endAngle: number,
    innerRadius: number,
    outerRadius: number
  ) => {
    const start = polarToCartesian(centerX, centerY, outerRadius, endAngle);
    const end = polarToCartesian(centerX, centerY, outerRadius, startAngle);
    const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle);
    const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M",
      start.x,
      start.y,
      "A",
      outerRadius,
      outerRadius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
      "L",
      innerEnd.x,
      innerEnd.y,
      "A",
      innerRadius,
      innerRadius,
      0,
      largeArcFlag,
      1,
      innerStart.x,
      innerStart.y,
      "Z",
    ].join(" ");
  };

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Calculate cumulative angles using reduce
  const paths = data.reduce((acc, item) => {
    const previousEndAngle = acc.length > 0 ? acc[acc.length - 1].endAngle : -90;
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = previousEndAngle;
    const endAngle = previousEndAngle + angle;

    const isHovered = hoveredCategory === item.name;
    const opacity = hoveredCategory === null || isHovered ? 1 : 0.3;

    acc.push({
      ...item,
      path: createArc(startAngle, endAngle, innerRadius, radius),
      startAngle,
      endAngle,
      isHovered,
      opacity,
    });

    return acc;
  }, [] as Array<{
    name: string;
    value: number;
    color: string;
    path: string;
    startAngle: number;
    endAngle: number;
    isHovered: boolean;
    opacity: number;
  }>);

  return (
    <div className="relative flex justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {paths.map((segment) => (
          <path
            key={segment.name}
            d={segment.path}
            fill={segment.color}
            opacity={segment.opacity}
            className="transition-opacity duration-200 cursor-pointer"
            onMouseEnter={() => onCategoryHover(segment.name)}
            onMouseLeave={onCategoryLeave}
            style={{
              filter: segment.isHovered ? "brightness(1.2) drop-shadow(0 0 8px currentColor)" : "none",
            }}
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{data.reduce((sum, item) => sum + item.value, 0) - 5}+</div>
          <div className="text-sm text-white/60">Skills</div>
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [hoveredCategory, setHoveredCategory] = useState<CategoryName | null>(null);

  // Create category data for chart
  const chartData = categories.map((cat) => ({
    name: cat.name,
    value: cat.skillNames.length,
    color: cat.color,
  }));

  // Get skills for a category
  const getCategoryForSkill = (skillName: string): CategoryName | null => {
    for (const category of categories) {
      if (category.skillNames.includes(skillName)) {
        return category.name;
      }
    }
    return null;
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mx-auto max-w-7xl px-4 md:px-6 py-24 mt-12"
    >
      <motion.h1
        variants={staggerItem}
        className="mb-12 text-4xl font-bold text-white md:text-5xl"
      >
        About Me
      </motion.h1>

      <motion.section
        variants={staggerItem}
        className="mb-28"
      >
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
          {/* Image on the left */}
          <div className="flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full"
            >
              <Image
                src="/imgs/picture.png"
                alt="About Me"
                width={220}
                height={900}
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Text content on the right */}
          <div className="flex-1 space-y-4 text-lg text-white/80">
            <h2 className="text-2xl font-bold text-white mb-4">About Me</h2>
            <p className="text-justify">
              I am a passionate graduate student and full-stack developer with a
              deep interest in creating innovative web applications and designing
              compelling user experiences. My journey in technology has been driven
              by a continuous desire to learn, improve, and excel in my craft.
            </p>
            <p className="text-justify">
              With expertise spanning from frontend frameworks like React and
              Angular to backend technologies like .NET Core and Node.js, I bring a
              comprehensive approach to software development. I specialize in
              Microsoft Dynamics 365 customization, helping businesses optimize
              their operations through tailored solutions.
            </p>
            <p className="text-justify">
              Beyond technical skills, I believe in the power of collaboration,
              clear communication, and thoughtful problem-solving to deliver
              exceptional results.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section variants={staggerItem} className="mb-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8 items-start">
          {/* Skills on the Left */}
          <div className="flex-1 w-full">
            <h2 className="mb-8 text-3xl font-bold text-white">
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-3">
              {technicalSkillsData.map(({ name, icon: Icon, url }, index) => {
                const skillCategory = getCategoryForSkill(name);
                const isHighlighted = hoveredCategory === null || hoveredCategory === skillCategory;
                const categoryColor = skillCategory
                  ? categories.find((c) => c.name === skillCategory)?.color
                  : undefined;

                const content = (
                  <Card
                    className={`cursor-pointer border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] px-4 py-2.5 text-xs lg:text-sm font-medium text-white/90 shadow-sm transition-all duration-200 ${
                      isHighlighted
                        ? "hover:border-white/20 hover:bg-white/10 hover:shadow-md hover:shadow-white/5"
                        : "opacity-30"
                    }`}
                    style={{
                      borderColor: isHighlighted && categoryColor && hoveredCategory === skillCategory
                        ? categoryColor
                        : undefined,
                      boxShadow:
                        isHighlighted && categoryColor && hoveredCategory === skillCategory
                          ? `0 0 12px ${categoryColor}40`
                          : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{name}</span>
                    </div>
                  </Card>
                );

                return (
            <motion.div
                    key={name}
              initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: isHighlighted ? 1 : 0.3,
                      scale: 1,
                    }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ scale: isHighlighted ? 1.05 : 1, y: isHighlighted ? -2 : 0 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {url ? (
                      <Link href={url} target="_blank" rel="noopener noreferrer" className="block">
                        {content}
                      </Link>
                    ) : (
                      content
                    )}
            </motion.div>
                );
              })}
            </div>
          </div>

          {/* Chart and Legend on the Right */}
          <div className="flex flex-col gap-3 justify-center">
                <div className="flex justify-center mt-16">
                <DonutChart
                  data={chartData}
                  hoveredCategory={hoveredCategory}
                  onCategoryHover={(name) => setHoveredCategory(name as CategoryName)}
                  onCategoryLeave={() => setHoveredCategory(null)}
                />
                </div>
                {/* Category Legend */}
              <div className="flex flex-wrap justify-center lg:justify-end gap-x-2 gap-y-3 max-w-sm mt-4">
                {categories.map((category) => {
                  const isHovered = hoveredCategory === category.name;
                  return (
                    <div
                      key={category.name}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-sm border transition-all duration-200 cursor-pointer"
                      style={{
                        borderColor: category.color,
                        backgroundColor: isHovered ? `${category.color}20` : "transparent",
                        opacity: hoveredCategory === null || isHovered ? 1 : 0.4,
                      }}
                      onMouseEnter={() => setHoveredCategory(category.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs font-medium text-white">{category.name}</span>
                      <span className="text-xs text-white/60">({category.skillNames.length})</span>
                    </div>
                  );
                })}
              </div>
              </div>
        </div>
      </motion.section>

      <motion.section variants={staggerItem}>
        <h2 className="mb-6 text-2xl font-semibold text-white">Soft Skills</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {softSkillsData.map(({ name, icon: Icon }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="border-white/10 bg-white/5 p-4 text-center text-white transition-colors hover:bg-white/10">
                <div className="flex items-center lg:justify-center gap-2 text-xs lg:text-sm">
                  <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
                  <span>{name}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}

