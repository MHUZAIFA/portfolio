"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Music, Gamepad2, BookOpen, Dumbbell, Plane, Camera } from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";

const interests = [
  {
    name: "Music",
    icon: Music,
    description: "Exploring different genres and playing instruments",
  },
  {
    name: "Gaming",
    icon: Gamepad2,
    description: "Enjoying strategy games and indie titles",
  },
  {
    name: "Reading",
    icon: BookOpen,
    description: "Tech books, fiction, and continuous learning",
  },
  {
    name: "Sports",
    icon: Dumbbell,
    description: "Staying active and maintaining fitness",
  },
  {
    name: "Travel",
    icon: Plane,
    description: "Exploring new places and cultures",
  },
  {
    name: "Photography",
    icon: Camera,
    description: "Capturing moments and creative expression",
  },
];

export default function InterestsPage() {
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
        Interests
      </motion.h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {interests.map((interest, index) => {
          const Icon = interest.icon;
          return (
            <motion.div
              key={interest.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Card className="h-full border-white/10 bg-white/5 p-6 text-center transition-all hover:bg-white/10">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="mb-4 flex justify-center"
                >
                  <Icon className="h-12 w-12 text-white" />
                </motion.div>
                <h3 className="mb-2 text-xl font-semibold text-white">
                  {interest.name}
                </h3>
                <p className="text-sm text-white/70">{interest.description}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

