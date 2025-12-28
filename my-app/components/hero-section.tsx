"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, ChevronDown } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";

const roles = [
  "Graduate Student",
  "D365 Customizer",
  "Full Stack Developer",
  "UI/UX Designer",
];

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const letterVariants = {
  initial: { opacity: 0, y: 50, rotateX: -90 },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

export function HeroSection() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    hapticManager.medium();
    const link = document.createElement("a");
    link.href = "/resume.pdf";
    link.download = "Mohammed_Huzaifa_Resume.pdf";
    link.click();
  };

  const name = "MOHAMMED HUZAIFA";
  const nameArray = name.split("");

  return (
    <motion.section
      ref={sectionRef}
      initial="initial"
      animate="animate"
      variants={containerVariants}
      style={{ opacity, scale, y }}
      className="relative flex h-[calc(100vh-5rem)] flex-col items-center justify-center overflow-hidden px-4 text-center"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content - properly centered */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Greeting */}
          <motion.div
            variants={staggerItem}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 text-base font-light tracking-[0.4em] text-white/70 md:text-lg lg:text-xl"
          >
            HELLO, I&apos;M
          </motion.div>

          {/* Name with letter-by-letter animation */}
          <motion.h1
            variants={staggerItem}
            className="mb-8 flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-6xl font-bold leading-[0.95] text-white md:text-8xl"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {nameArray.map((letter, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                custom={index}
                whileHover={{
                  scale: 1.2,
                  y: -10,
                  transition: { duration: 0.2 },
                }}
                className="inline-block"
                style={{
                  color:
                    isHovered && index % 3 === 0
                      ? "rgba(255, 255, 255, 0.8)"
                      : "white",
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </motion.h1>

          {/* Animated roles - centered */}
          <motion.div
            variants={staggerItem}
            className="mb-10 flex items-center justify-center h-20 md:h-28 lg:h-32"
          >
            <AnimatedRoles currentIndex={currentRoleIndex} roles={roles} />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={staggerItem}
            className="mb-12 max-w-3xl mx-auto text-base leading-relaxed text-white/75 md:text-lg lg:text-xl px-4"
          >
            Fuelled by a passion for developing web applications and designing
            compelling products, I have deep desire to excel and continuously
            improve my craft.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={handleDownload}
              size="lg"
              className="group relative overflow-hidden bg-white px-10 py-7 text-lg font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/20 md:px-12 md:py-8 md:text-xl"
            >
              <Download className="mr-3 h-6 w-6 transition-transform group-hover:translate-y-[-2px] md:h-7 md:w-7" />
              Download Resume
            </Button>
          </motion.div>

        </motion.div>
        </div>
      </div>
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
    <div className="flex items-center justify-center gap-4 flex-wrap">
      <span className="text-4xl font-light text-white/60 md:text-6xl lg:text-7xl xl:text-8xl whitespace-nowrap">
        I&apos;m a
      </span>
      <div className="relative min-h-[3rem] md:min-h-[4.5rem] lg:min-h-[5.5rem] min-w-[280px] md:min-w-[450px] lg:min-w-[550px] xl:min-w-[650px] flex items-center justify-start">
        {roles.map((role, index) => (
          <motion.div
            key={role}
            initial={{ opacity: 0, y: 20, rotateX: -90 }}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              y: index === currentIndex ? 0 : 20,
              rotateX: index === currentIndex ? 0 : -90,
              display: index === currentIndex ? "flex" : "none",
            }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="absolute inset-0 flex items-center justify-start"
          >
            <span className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-4xl font-light text-transparent md:text-6xl lg:text-7xl xl:text-8xl whitespace-nowrap">
              {role}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

