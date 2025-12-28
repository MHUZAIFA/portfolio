"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { 
  Code, 
  Globe, 
  FileCode, 
  Layout, 
  Palette, 
  Server, 
  Database, 
  Cloud, 
  Flame, 
  BarChart3, 
  Tag, 
  Circle, 
  Coffee, 
  Hash, 
  Settings, 
  Sparkles, 
  Workflow, 
  Zap, 
  FileText, 
  Table,
  Building,
  GitBranch,
  ArrowRight,
  Play,
  MessageCircle,
  Users,
  Lightbulb,
  Clock,
  Crown,
  RefreshCw,
  Brain,
  Eye
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const technicalSkillsData: Array<{ name: string; icon: LucideIcon }> = [
  { name: "React JS", icon: Zap },
  { name: "Angular", icon: Globe },
  { name: "Next.js", icon: ArrowRight },
  { name: "HTML 5", icon: FileCode },
  { name: "Bootstrap 4", icon: Layout },
  { name: "CSS 3", icon: Palette },
  { name: "JavaScript", icon: Code },
  { name: "Sass", icon: Palette },
  { name: "Web Analytics", icon: BarChart3 },
  { name: "Tag Manager", icon: Tag },
  { name: "Express.js", icon: Server },
  { name: ".NET Core", icon: Circle },
  { name: "PHP", icon: Code },
  { name: "Java Play Framework", icon: Play },
  { name: "Apache Cassandra", icon: Database },
  { name: "Cosmos DB", icon: Database },
  { name: "SQL Server", icon: Database },
  { name: "MongoDB", icon: Database },
  { name: "Firebase", icon: Flame },
  { name: "Redis", icon: Database },
  { name: "Dynamics 365", icon: Building },
  { name: "ADO", icon: GitBranch },
  { name: "Azure", icon: Cloud },
  { name: "PowerPoint", icon: FileText },
  { name: "Word", icon: FileText },
  { name: "Excel", icon: Table },
  { name: "Java", icon: Coffee },
  { name: "TypeScript", icon: FileCode },
  { name: "C#", icon: Hash },
  { name: "Python 3", icon: Code },
  { name: "C", icon: Code },
  { name: "Crewdle AI", icon: Sparkles },
  { name: "n8n", icon: Workflow },
  { name: "Jenkins", icon: Settings },
  { name: "Vercel", icon: Zap },
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

export default function AboutPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mx-auto max-w-5xl px-4 py-24"
    >
      <motion.h1
        variants={staggerItem}
        className="mb-12 text-4xl font-bold text-white md:text-5xl"
      >
        About Me
      </motion.h1>

      <motion.section
        variants={staggerItem}
        className="mb-16 space-y-4 text-lg text-white/80"
      >
        <p>
          I am a passionate graduate student and full-stack developer with a
          deep interest in creating innovative web applications and designing
          compelling user experiences. My journey in technology has been driven
          by a continuous desire to learn, improve, and excel in my craft.
        </p>
        <p>
          With expertise spanning from frontend frameworks like React and
          Angular to backend technologies like .NET Core and Node.js, I bring a
          comprehensive approach to software development. I specialize in
          Microsoft Dynamics 365 customization, helping businesses optimize
          their operations through tailored solutions.
        </p>
        <p>
          Beyond technical skills, I believe in the power of collaboration,
          clear communication, and thoughtful problem-solving to deliver
          exceptional results.
        </p>
      </motion.section>

      <motion.section variants={staggerItem} className="mb-16">
        <h2 className="mb-8 text-3xl font-bold text-white">
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-3">
          {technicalSkillsData.map(({ name, icon: Icon }, index) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="cursor-pointer border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] px-4 py-2.5 text-sm font-medium text-white/90 shadow-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:shadow-md hover:shadow-white/5">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{name}</span>
                </div>
              </Card>
            </motion.div>
          ))}
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
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5" />
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

