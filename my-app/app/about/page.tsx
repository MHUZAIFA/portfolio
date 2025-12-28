"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";

const technicalSkills = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  ".NET Core",
  "C#",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "Git",
  "REST APIs",
  "GraphQL",
];

const softSkills = [
  "Communication",
  "Teamwork",
  "Problem Solving",
  "Time Management",
  "Leadership",
  "Adaptability",
  "Critical Thinking",
  "Attention to Detail",
];

export default function AboutPage() {
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
        <h2 className="mb-6 text-2xl font-semibold text-white">
          Technical Skills
        </h2>
        <div className="flex flex-wrap gap-3">
          {technicalSkills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="border-white/10 bg-white/5 px-4 py-2 text-white transition-colors hover:bg-white/10">
                {skill}
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section variants={staggerItem}>
        <h2 className="mb-6 text-2xl font-semibold text-white">Soft Skills</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {softSkills.map((skill, index) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
            >
              <Card className="border-white/10 bg-white/5 p-4 text-center text-white transition-colors hover:bg-white/10">
                {skill}
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}

