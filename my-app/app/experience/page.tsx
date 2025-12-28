"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  fullDescription?: string;
  logo?: string;
}

const experiences: Experience[] = [
  {
    id: "1",
    company: "Company Name",
    role: "Full Stack Developer",
    duration: "2023 - Present",
    description:
      "Developed and maintained web applications using React, Node.js, and .NET Core.",
    fullDescription:
      "Led development of multiple client projects, implemented RESTful APIs, optimized database queries, and collaborated with cross-functional teams to deliver high-quality software solutions. Mentored junior developers and contributed to code reviews.",
  },
  {
    id: "2",
    company: "Previous Company",
    role: "Frontend Developer",
    duration: "2021 - 2023",
    description:
      "Built responsive user interfaces using React and Angular frameworks.",
    fullDescription:
      "Created reusable component libraries, improved application performance, and worked closely with designers to implement pixel-perfect UI designs. Participated in agile development processes and sprint planning.",
  },
  // Add more experiences as needed
];

export default function ExperiencePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    hapticManager.light();
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mx-auto max-w-4xl px-4 py-24"
    >
      <motion.h1
        variants={staggerItem}
        className="mb-12 text-4xl font-bold text-white md:text-5xl"
      >
        Experience
      </motion.h1>

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <motion.div
            key={exp.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-4">
                    {exp.logo && (
                      <img
                        src={exp.logo}
                        alt={exp.company}
                        className="h-12 w-12 rounded"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {exp.role}
                      </h3>
                      <p className="text-white/70">{exp.company}</p>
                    </div>
                  </div>
                  <p className="mb-2 text-sm text-white/60">{exp.duration}</p>
                  <p className="text-white/80">{exp.description}</p>
                  {expandedId === exp.id && exp.fullDescription && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 text-white/80"
                    >
                      {exp.fullDescription}
                    </motion.p>
                  )}
                </div>
                {exp.fullDescription && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpand(exp.id)}
                    className="text-white hover:bg-white/10"
                  >
                    {expandedId === exp.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

