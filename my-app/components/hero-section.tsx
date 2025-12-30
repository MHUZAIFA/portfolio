"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Download } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerItem } from "@/components/providers/motion-provider";

const roles = [
  "Graduate Student",
  "Full Stack Developer",
  "D365 Customizer",
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
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

type HeroSectionProps = {
  gameActive?: boolean;
};

export function HeroSection({ gameActive = false }: HeroSectionProps = {}) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const scrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  
  // Use scroll opacity, text opacity will be controlled by animate prop
  const opacity = scrollOpacity;

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
      {/* Animated Gradient Mesh Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Animated gradient blobs */}
        <motion.div
          className="absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-[15%] top-[60%] h-[600px] w-[600px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
          animate={{
            x: [0, -120, 80, 0],
            y: [0, 100, -60, 0],
            scale: [1, 1.3, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute left-[50%] top-[40%] h-[400px] w-[400px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -100, 70, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        <motion.div
          className="absolute right-[25%] top-[10%] h-[350px] w-[350px] rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
            filter: "blur(70px)",
          }}
          animate={{
            x: [0, -80, 50, 0],
            y: [0, 120, -80, 0],
            scale: [1, 1.25, 1.05, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        {[
          { delay: 0, duration: 20, size: 80, x: "15%", y: "25%", color: "rgba(99, 102, 241, 0.1)" },
          { delay: 2, duration: 25, size: 60, x: "75%", y: "35%", color: "rgba(168, 85, 247, 0.1)" },
          { delay: 4, duration: 18, size: 100, x: "50%", y: "70%", color: "rgba(59, 130, 246, 0.08)" },
          { delay: 1, duration: 22, size: 70, x: "25%", y: "65%", color: "rgba(236, 72, 153, 0.1)" },
          { delay: 3, duration: 24, size: 55, x: "80%", y: "15%", color: "rgba(34, 197, 94, 0.08)" },
        ].map((shape, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{
              left: shape.x,
              top: shape.y,
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              border: `2px solid ${shape.color}`,
              borderRadius: index % 2 === 0 ? "50%" : "20%",
              rotate: 45,
            }}
            animate={{
              y: [0, -30, 30, 0],
              x: [0, 20, -20, 0],
              rotate: [45, 90, 45, 0, 45],
              scale: [1, 1.2, 0.8, 1],
              opacity: [0.1, 0.2, 0.15, 0.1],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: shape.delay,
            }}
          />
        ))}

        {/* Animated Connecting Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.08]" xmlns="http://www.w3.org/2000/svg">
          {[0, 1, 2, 3].map((i) => (
            <motion.line
              key={i}
              x1={`${20 + i * 25}%`}
              y1="0%"
              x2={`${30 + i * 15}%`}
              y2="100%"
              stroke="white"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: [0, 1, 0],
                opacity: [0, 0.15, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 1.5,
              }}
            />
          ))}
        </svg>

        {/* Pulsing Orbs */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-white/10"
            style={{
              left: `${30 + i * 25}%`,
              top: `${20 + i * 30}%`,
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}

        {/* Noise Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
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
            animate={{ opacity: gameActive ? 0.15 : 1, y: 0 }}
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
            animate={{ opacity: gameActive ? 0.15 : 1 }}
            transition={{ duration: 0.3 }}
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
            animate={{ opacity: gameActive ? 0.15 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatedRoles currentIndex={currentRoleIndex} roles={roles} />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={staggerItem}
            className="mb-12 max-w-3xl mx-auto text-base leading-relaxed text-white/75 md:text-lg lg:text-xl px-4"
            animate={{ opacity: gameActive ? 0.15 : 0.75 }}
            transition={{ duration: 0.3 }}
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
          <motion.button
            onClick={handleDownload}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-lg border border-white/20 bg-white/5 px-8 py-4 text-base font-medium text-white backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:bg-white/10 md:px-10 md:py-5 md:text-lg"
          >
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            
            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
              <motion.div
                animate={{ y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Download className="h-5 w-5 md:h-6 md:w-6" />
              </motion.div>
              <span>Download Resume</span>
            </span>
            
            {/* Bottom border accent */}
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] bg-white"
              initial={{ width: "0%" }}
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

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
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
              duration: 0.4,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-start"
          >
            <span className="text-4xl font-light text-white md:text-6xl lg:text-7xl xl:text-8xl whitespace-nowrap">
              {roles[currentIndex]}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

