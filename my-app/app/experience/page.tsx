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
    company: "Flexspring",
    role: "Full-stack Development Intern",
    duration: "Sep 2024 - Present · 1 yr 4 mos",
    description:
      "Full-stack Development Intern at Flexspring, Montreal, Quebec, Canada. Working with React.js, Java and other modern technologies.",
    fullDescription:
      "Currently working as a Full-stack Development Intern at Flexspring, contributing to the development of modern web applications using React.js, Java, and other cutting-edge technologies. Based in Montreal, Quebec, Canada.",
  },
  {
    id: "2",
    company: "CitiusTech",
    role: "Senior Software Engineer",
    duration: "Apr 2023 - Aug 2023 · 5 mos",
    description:
      "Developed a viewer for IBM Health Watson (now Merative) using Angular, DotNet, SQL, ML, AI, DICOM, PACS, and other technologies to improve cancer detection and reduce tumour analysis time.",
    fullDescription:
      "Developed a viewer for IBM Health Watson (now Merative) using Angular, DotNet, SQL, ML, AI, DICOM, PACS, and other technologies to: a. Improve cancer detection, b. Reduce time taken in performing tumour analysis, and c. Assist in making informed decisions. Created reusable Angular components that reduced front-end development time by 30%. Achieved 95% unit test code coverage throughout the application. Improved application spin-up time from 3 to 1.5 seconds approx. Wrote clean optimized code applying software development principles like OOPS, SOLID, and DRY. Developed a successful POC which was demonstrated at RSNA 2023, leading to new customer acquisitions.",
  },
  {
    id: "3",
    company: "CitiusTech",
    role: "Software Engineer",
    duration: "Dec 2021 - Mar 2023 · 1 yr 4 mos",
    description:
      "Software Engineer at CitiusTech, Mumbai, Maharashtra, India. Worked with Angular, Microsoft SQL Server and other technologies.",
    fullDescription:
      "Worked as a Software Engineer at CitiusTech, contributing to various healthcare technology projects. Utilized Angular, Microsoft SQL Server, and other modern technologies to deliver high-quality software solutions.",
  },
  {
    id: "4",
    company: "Willis Towers Watson",
    role: "Full Stack Developer",
    duration: "Jul 2019 - Nov 2021 · 2 yrs 5 mos",
    description:
      "Developed and delivered enterprise-grade applications in an agile environment using Angular, .Net, SQL, CosmosDB, and Azure.",
    fullDescription:
      "Developed and delivered enterprise-grade applications in an agile environment using Angular, .Net, SQL, CosmosDB, and Azure. Managed Angular libraries and expanded toolkit with reusable components for multiple projects. Applied software development principles (SOLID, ONION) and design patterns (Strategy, Repository) in MVC framework. By continually monitoring and optimizing azure resources and its metrics, saved more than 1000 pounds. Reduced data retrieval time from 5-10 seconds to 0.5-1 seconds, enhancing application performance. Achieved 90-95% unit test code coverage across applications and APIs. Defined branching, release strategies, and CI/CD pipelines in Azure DevOps for diverse environments.",
  },
  {
    id: "5",
    company: "Reliance Industries Limited",
    role: "Full-stack Development Intern",
    duration: "Dec 2018 - Jan 2019 · 2 mos",
    description:
      "Developed MEAN stack project management application using Angular, Node.js, Express server, and MongoDB, increasing productivity of internal teams by 27%.",
    fullDescription:
      "Developed MEAN stack project management application using Angular, Node.js, Express server, and MongoDB (MEAN Stack), increasing the productivity of internal teams by 27% within the first quarter of launch.",
  },
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

