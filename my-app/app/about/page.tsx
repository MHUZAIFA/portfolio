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
import Link from "next/link";

const technicalSkillsData: Array<{ name: string; icon: LucideIcon; url?: string }> = [
  { name: "React JS", icon: Zap, url: "https://react.dev" },
  { name: "Angular", icon: Globe, url: "https://angular.io" },
  { name: "Next.js", icon: ArrowRight, url: "https://nextjs.org" },
  { name: "HTML 5", icon: FileCode, url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { name: "Bootstrap 4", icon: Layout, url: "https://getbootstrap.com/docs/4.6" },
  { name: "CSS 3", icon: Palette, url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "JavaScript", icon: Code, url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { name: "Sass", icon: Palette, url: "https://sass-lang.com" },
  { name: "Web Analytics", icon: BarChart3 },
  { name: "Tag Manager", icon: Tag, url: "https://tagmanager.google.com" },
  { name: "Express.js", icon: Server, url: "https://expressjs.com" },
  { name: ".NET Core", icon: Circle, url: "https://dotnet.microsoft.com" },
  { name: "PHP", icon: Code, url: "https://www.php.net" },
  { name: "Java Play Framework", icon: Play, url: "https://www.playframework.com" },
  { name: "Apache Cassandra", icon: Database, url: "https://cassandra.apache.org" },
  { name: "Cosmos DB", icon: Database, url: "https://azure.microsoft.com/products/cosmos-db" },
  { name: "SQL Server", icon: Database, url: "https://www.microsoft.com/sql-server" },
  { name: "MongoDB", icon: Database, url: "https://www.mongodb.com" },
  { name: "Firebase", icon: Flame, url: "https://firebase.google.com" },
  { name: "Redis", icon: Database, url: "https://redis.io" },
  { name: "Dynamics 365", icon: Building, url: "https://dynamics.microsoft.com" },
  { name: "ADO", icon: GitBranch, url: "https://azure.microsoft.com/products/devops" },
  { name: "Azure", icon: Cloud, url: "https://azure.microsoft.com" },
  { name: "PowerPoint", icon: FileText, url: "https://www.microsoft.com/microsoft-365/powerpoint" },
  { name: "Word", icon: FileText, url: "https://www.microsoft.com/microsoft-365/word" },
  { name: "Excel", icon: Table, url: "https://www.microsoft.com/microsoft-365/excel" },
  { name: "Java", icon: Coffee, url: "https://www.java.com" },
  { name: "TypeScript", icon: FileCode, url: "https://www.typescriptlang.org" },
  { name: "C#", icon: Hash, url: "https://dotnet.microsoft.com/languages/csharp" },
  { name: "Python 3", icon: Code, url: "https://www.python.org" },
  { name: "C", icon: Code, url: "https://en.wikipedia.org/wiki/C_(programming_language)" },
  { name: "Crewdle AI", icon: Sparkles, url: "https://www.crewdle.com" },
  { name: "n8n", icon: Workflow, url: "https://n8n.io" },
  { name: "Jenkins", icon: Settings, url: "https://www.jenkins.io" },
  { name: "Vercel", icon: Zap, url: "https://vercel.com" },
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
      </motion.section>

      <motion.section variants={staggerItem} className="mb-16">
        <h2 className="mb-8 text-3xl font-bold text-white">
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {technicalSkillsData.map(({ name, icon: Icon, url }, index) => {
            const content = (
              <Card className="cursor-pointer border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] px-4 py-2.5 text-sm font-medium text-white/90 shadow-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:shadow-md hover:shadow-white/5">
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
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.05, y: -2 }}
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
                <div className="flex items-center justify-center gap-2">
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

