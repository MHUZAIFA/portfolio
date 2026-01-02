"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Music, Gamepad2, BookOpen, Dumbbell, Plane, Camera } from "lucide-react";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { hapticManager } from "@/lib/haptic-manager";

const interests = [
  {
    name: "Music",
    icon: Music,
    description: "Exploring different genres and playing instruments",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    name: "Gaming",
    icon: Gamepad2,
    description: "Enjoying strategy games and indie titles",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    name: "Reading",
    icon: BookOpen,
    description: "Tech books, fiction, and continuous learning",
    color: "from-amber-500/20 to-orange-500/20",
  },
  {
    name: "Sports",
    icon: Dumbbell,
    description: "Staying active and maintaining fitness",
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    name: "Travel",
    icon: Plane,
    description: "Exploring new places and cultures",
    color: "from-sky-500/20 to-blue-500/20",
  },
  {
    name: "Photography",
    icon: Camera,
    description: "Capturing moments and creative expression",
    color: "from-rose-500/20 to-red-500/20",
  },
];

export default function InterestsPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mx-auto max-w-7xl px-4 md:px-6 md:py-12 py-24 mt-12"
    >
      <motion.h1
        variants={staggerItem}
        className="mb-8 md:mb-12 bg-gradient-to-r from-white to-white/70 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl lg:text-6xl"
      >
        Interests
      </motion.h1>

      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
        {interests.map((interest, index) => {
          const Icon = interest.icon;
          return (
            <motion.div
              key={interest.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              whileHover={{ scale: 1.03, y: -6 }}
              onHoverStart={() => hapticManager.light()}
            >
              <Card className="group relative h-full overflow-hidden border-white/10 bg-white/5 p-4 md:p-6 text-center transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-white/5">
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${interest.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
                
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="relative mb-3 md:mb-4 flex justify-center"
                >
                  <div className="rounded-full bg-white/5 p-2.5 md:p-4 group-hover:bg-white/10 transition-colors duration-300">
                    <Icon className="h-6 w-6 md:h-10 md:w-10 text-white" />
                  </div>
                </motion.div>
                
                <div className="relative">
                  <h3 className="mb-2 text-base md:text-xl font-semibold text-white">
                    {interest.name}
                  </h3>
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed">
                    {interest.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

