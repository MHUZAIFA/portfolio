"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";

const roles = [
  "Graduate Student",
  "D365 Customizer",
  "Full Stack Developer",
  "UI/UX Designer",
];

export function HeroSection() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    hapticManager.medium();
    // Add resume download logic here
    const link = document.createElement("a");
    link.href = "/resume.pdf"; // Update with actual resume path
    link.download = "Huzaifa_Anjum_Resume.pdf";
    link.click();
  };

  return (
    <motion.section
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="flex min-h-screen flex-col items-center justify-center px-4 py-32 text-center"
    >
      <motion.h1
        variants={staggerItem}
        className="mb-6 text-5xl font-bold text-white md:text-7xl lg:text-8xl"
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Huzaifa
        </motion.span>{" "}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Anjum
        </motion.span>
      </motion.h1>

      <motion.div
        variants={staggerItem}
        className="mb-8 h-12 md:h-16"
      >
        <AnimatedRoles currentIndex={currentRoleIndex} roles={roles} />
      </motion.div>

      <motion.p
        variants={staggerItem}
        className="mb-12 max-w-2xl text-lg text-white/80 md:text-xl"
      >
        Fuelled by a passion for developing web applications and designing
        compelling products, I have deep desire to excel and continuously
        improve my craft.
      </motion.p>

      <motion.div variants={staggerItem}>
        <Button
          onClick={handleDownload}
          size="lg"
          className="bg-white text-black hover:bg-white/90"
        >
          <Download className="mr-2 h-4 w-4" />
          Download Resume
        </Button>
      </motion.div>
    </motion.section>
  );
}

function AnimatedRoles({
  currentIndex,
  roles,
}: {
  currentIndex: number;
  roles: string[];
}) {
  return (
    <div className="relative h-full">
      {roles.map((role, index) => (
        <motion.div
          key={role}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: index === currentIndex ? 1 : 0,
            y: index === currentIndex ? 0 : 20,
          }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="text-2xl font-light text-white/90 md:text-4xl">
            {role}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

