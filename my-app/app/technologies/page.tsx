"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";

const technologies = {
  frontend: [
    { name: "React", description: "UI library for building interfaces" },
    { name: "Angular", description: "Full-featured web framework" },
    { name: "Next.js", description: "React framework for production" },
    { name: "TypeScript", description: "Typed JavaScript" },
    { name: "Tailwind CSS", description: "Utility-first CSS framework" },
    { name: "HTML/CSS", description: "Web fundamentals" },
  ],
  backend: [
    { name: ".NET Core", description: "Cross-platform framework" },
    { name: "Node.js", description: "JavaScript runtime" },
    { name: "Express", description: "Web framework for Node.js" },
    { name: "C#", description: "Object-oriented programming" },
  ],
  databases: [
    { name: "MongoDB", description: "NoSQL database" },
    { name: "PostgreSQL", description: "Relational database" },
    { name: "MySQL", description: "Open-source database" },
  ],
  microsoft: [
    { name: "Dynamics 365", description: "Business applications" },
    { name: "Power Platform", description: "Low-code platform" },
    { name: "Azure", description: "Cloud services" },
  ],
  languages: [
    { name: "JavaScript", description: "Web programming" },
    { name: "TypeScript", description: "Typed JavaScript" },
    { name: "C#", description: ".NET development" },
    { name: "Python", description: "General purpose" },
  ],
};

export default function TechnologiesPage() {
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
        Technologies
      </motion.h1>

      <div className="space-y-16">
        {Object.entries(technologies).map(([category, items], categoryIndex) => (
          <motion.section
            key={category}
            variants={staggerItem}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <h2 className="mb-6 text-2xl font-semibold capitalize text-white">
              {category.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                >
                  <Card className="h-full border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10">
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      {tech.name}
                    </h3>
                    <p className="text-sm text-white/70">{tech.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </motion.div>
  );
}

