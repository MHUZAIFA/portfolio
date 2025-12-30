"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { 
  Calendar,
  Award,
  ExternalLink,
  Quote,
  User,
  Trophy,
  X,
  ZoomIn
} from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";

interface Honor {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  fullDescription?: string;
  logo?: string;
  image?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  connection: string;
  date: string;
  relationship: string;
  text: string;
}

const honors: Honor[] = [
  {
    id: "0",
    title: "Reward and Recognition",
    issuer: "CitiusTech",
    date: "Jul 2023",
    description:
      "Awarded for exceptional UI/UX and Front-End Development contributions to multiple projects.",
    fullDescription:
      "Awarded for exceptional UI/UX and Front-End Development contributions to multiple projects. This recognition highlights outstanding work in creating user-friendly interfaces and delivering high-quality front-end solutions that enhanced user experience across various healthcare technology platforms.",
    logo: "/imgs/logos/citiustech.jpeg",
    image: "/imgs/certificates/awards/CitiusTech_FullStack_Rnr.png",
    links: [
      {
        label: "CitiusTech Website",
        href: "https://www.citiustech.com",
      },
    ],
  },
  {
    id: "1",
    title: "Spot Award",
    issuer: "Willis Towers Watson",
    date: "Sep 2021",
    description:
      "Awarded for implementing out-of-the-box ideas and overall application performance of multiple projects.",
    fullDescription:
      "Awarded for implementing out-of-the-box ideas and overall application performance of multiple projects. Recognized for innovative problem-solving approaches and significant contributions to improving application performance, which resulted in enhanced user experience and system efficiency.",
    logo: "/imgs/logos/wtw.png",
    image: "/imgs/certificates/awards/WTW_FullStack_Rnr.jpeg",
    links: [
      {
        label: "WTW Website",
        href: "https://www.wtwco.com",
      },
    ],
  },
  {
    id: "2",
    title: "Spot Award",
    issuer: "Willis Towers Watson",
    date: "Jan 2020",
    description:
      "Awarded for adapting rapidly and delivering Microsoft Dynamics 365 project milestones.",
    fullDescription:
      "Awarded for adapting rapidly and delivering Microsoft Dynamics 365 project milestones. Recognized for quick adaptation to new technologies and consistent delivery of project deliverables, demonstrating strong technical skills and commitment to project success.",
    logo: "/imgs/logos/wtw.png",
    image: "/imgs/certificates/awards/WTW_Microsoft_Dynamics_365_Rnr.jpeg",
    links: [
      {
        label: "WTW Website",
        href: "https://www.wtwco.com",
      },
    ],
  },
];

const testimonials: Testimonial[] = [
  {
    id: "0",
    name: "Jithin Jain",
    title: "Solutions Architect",
    company: "CitiusTech",
    connection: "1st degree connection",
    date: "February 18, 2024",
    relationship: "Jithin managed Mohammed directly",
    text: "Huzaifa is very passionate about his work and very dedicated. He is a quick learner and a complete full stack developer. He is really good with his technical skills. Had it not been his higher education, I would have loved to see him continue and grow in my team. The client was also happy with his work. Wish you the best for your future endeavours!",
  },
  {
    id: "1",
    name: "Chris Bass",
    title: "Senior Product Owner",
    company: "DXC Technology",
    connection: "1st degree connection",
    date: "February 5, 2024",
    relationship: "Chris worked with Mohammed on the same team",
    text: "I worked in the same team as Huzaifa for just under 2 years as Product Owner when he was a Developer at WTW.\n\nHuzaifa was a great communicator. He was vocal in meetings, whilst allowing others to speak, he had great ideas and solutions and articulated them in a clear and concise way, he asked very sensible questions and took the answers on board and applied them to whatever was required.\n\nHuzaifa was a great developer and I always new that whatever he delivered would be done efficiently and according to the ACs & designs with, thoughts for future proofing, and this always gave me good confidence in the quality of the products that we delivered.\n\nOn a social aspect, I always got on well with Huzaifa and found him a really enjoyable character to work with and he was a good team player.\n\nI have no doubt the Huzaifa will be successful in whatever he puts his talents too and will continue to develop, grow and succeed",
  },
];

// Generate particle positions once
const generateParticles = () => {
  return Array.from({ length: 20 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2,
  }));
};

type TabType = "all" | "awards" | "recommendations";

export default function HonorsPage() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedHonor, setSelectedHonor] = useState<Honor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sort honors chronologically (most recent first)
  const sortedHonors = [...honors].sort((a, b) => {
    const parseDate = (dateStr: string): Date => {
      const monthNames: Record<string, number> = {
        "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
        "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
      };
      const match = dateStr.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/);
      if (match) {
        return new Date(parseInt(match[2]), monthNames[match[1]], 1);
      }
      return new Date();
    };
    return parseDate(b.date).getTime() - parseDate(a.date).getTime();
  });

  useEffect(() => {
    setMounted(true);
    setParticles(generateParticles());
  }, []);

  useEffect(() => {
    if (selectedHonor) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedHonor]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedHonor) {
        setSelectedHonor(null);
      }
    };

    if (selectedHonor) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [selectedHonor]);

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Gradient Blobs */}
        <motion.div
          className="absolute left-[10%] top-[10%] h-[600px] w-[600px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)",
            filter: "blur(100px)",
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
          className="absolute right-[15%] top-[50%] h-[500px] w-[500px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
            filter: "blur(90px)",
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
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
        className="relative mx-auto max-w-7xl px-4 py-24"
    >
        {/* Header */}
      <motion.h1
        variants={staggerItem}
        className="mb-6 text-4xl font-bold text-white md:text-5xl"
      >
        Honors & Awards
      </motion.h1>

        <motion.section
          variants={staggerItem}
          className="mb-8 space-y-4 text-lg text-white/80"
        >
          <p className="text-justify">
            Throughout my career, I&apos;ve been fortunate to receive recognition
            for my contributions to various projects and initiatives. These awards
            and recommendations reflect my commitment to excellence, innovation, and delivering
            exceptional results.
          </p>
        </motion.section>

        {/* Tabs */}
        <motion.div
          variants={staggerItem}
          className="mb-8 flex flex-wrap gap-3"
        >
          <motion.button
            onClick={() => {
              setActiveTab("all");
              hapticManager.light();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === "all"
                ? "bg-white text-black shadow-lg shadow-white/20"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            All ({honors.length + testimonials.length})
          </motion.button>
          <motion.button
            onClick={() => {
              setActiveTab("awards");
              hapticManager.light();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === "awards"
                ? "bg-yellow-500/90 text-white shadow-lg shadow-yellow-500/30"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <Trophy className="mr-2 inline h-4 w-4" />
            Awards ({honors.length})
          </motion.button>
          <motion.button
            onClick={() => {
              setActiveTab("recommendations");
              hapticManager.light();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              activeTab === "recommendations"
                ? "bg-blue-500/90 text-white shadow-lg shadow-blue-500/30"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            <Quote className="mr-2 inline h-4 w-4" />
            Recommendations ({testimonials.length})
          </motion.button>
        </motion.div>

        {/* Awards Section */}
        {(activeTab === "all" || activeTab === "awards") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-16"
          >
            {(activeTab === "all" || activeTab === "awards") && activeTab === "all" && (
              <motion.h2
                variants={staggerItem}
                className="mb-8 text-3xl font-bold text-white md:text-4xl"
              >
                Awards
              </motion.h2>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sortedHonors.map((honor, index) => (
              <motion.div
                key={honor.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="relative"
                >
                    <motion.div
                      onMouseEnter={() => {
                        setHoveredId(honor.id);
                        hapticManager.light();
                      }}
                      onMouseLeave={() => setHoveredId(null)}
                      whileHover={{ y: -5 }}
                      className="h-full"
                    >
                      <Card className="group relative h-full overflow-hidden border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
                        {/* Gradient Border Effect */}
                        <motion.div
                          className="absolute inset-0 rounded-lg bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 opacity-0 transition-opacity group-hover:opacity-100"
                          initial={false}
                        />

                        {/* Award Badge */}
                        <div className="absolute right-4 top-4 z-10">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                            <Trophy className="h-5 w-5 text-yellow-400" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                          {/* Header */}
                          <div className="mb-4">
                            <div className="mb-3 flex items-center gap-3">
                              {honor.logo ? (
                                <Image
                                  src={honor.logo}
                                  alt={`${honor.issuer} logo`}
                                  width={48}
                                  height={48}
                                  className="h-12 w-12 rounded-lg object-contain p-1"
                                />
                              ) : (
                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
                                  <Award className="h-6 w-6 text-white/80" />
                                </div>
                              )}
                              <div className="flex-1">
                                 <h3 className="text-lg font-bold text-white">
                                  {honor.title}
                                </h3>
                                 <div className="flex items-center gap-2">
                                   <p className="text-sm font-medium text-white/70">
                                     {honor.issuer}
                                   </p>
                                   {honor.links && honor.links.length > 0 && (
                                     <a
                                       href={honor.links[0].href}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="text-white/50 hover:text-white/80"
                                     >
                                       <ExternalLink className="h-3 w-3" />
                                     </a>
                                   )}
                                 </div>
                              </div>
                            </div>

                            {/* Meta Info */}
                            <div className="mb-3 flex items-center gap-2 text-sm text-white/60">
                              <Calendar className="h-4 w-4" />
                              <span>{honor.date}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="mb-4 text-sm text-white/80 line-clamp-3">{honor.description}</p>

                          {/* Award Image Preview */}
                          {honor.image && (
                            <div className="mb-4">
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                onClick={() => setSelectedHonor(honor)}
                                className="relative cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/5 group/image"
                              >
                                <Image
                                  src={honor.image}
                                  alt={`${honor.title} certificate`}
                                  width={400}
                                  height={300}
                                  className="h-auto w-full object-cover transition-transform group-hover/image:scale-105"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover/image:opacity-100">
                                  <ZoomIn className="h-8 w-8 text-white" />
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </div>

                        {/* Shine Effect */}
                        <motion.div
                          className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{
                            x: hoveredId === honor.id ? "100%" : "-100%",
                          }}
                          transition={{ duration: 0.6 }}
                        />
                      </Card>
                    </motion.div>
              </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {/* Recommendations Section */}
        {(activeTab === "all" || activeTab === "recommendations") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={activeTab === "all" ? "mt-16" : ""}
          >
            {(activeTab === "all" || activeTab === "recommendations") && activeTab === "all" && (
              <motion.h2
                variants={staggerItem}
                className="mb-8 text-3xl font-bold text-white md:text-4xl"
              >
                Recommendations
              </motion.h2>
            )}
            <motion.section
              variants={staggerItem}
              className={`mb-8 space-y-4 text-lg text-white/80 ${activeTab === "all" ? "" : "hidden"}`}
            >
              <p className="text-justify">
                I&apos;m grateful to have worked with exceptional colleagues and
                managers who have provided valuable feedback and recommendations.
                These testimonials reflect the collaborative relationships I&apos;ve
                built and the impact of my work across different projects and teams.
              </p>
            </motion.section>

            {/* Recommendations List */}
            <div className="space-y-12">
              {testimonials.map((testimonial, index) => {
                // Get company logo if available
                const companyLogo = testimonial.company === "CitiusTech" 
                  ? "/imgs/logos/citiustech.jpeg" 
                  : testimonial.company === "DXC Technology" || testimonial.company.includes("WTW")
                  ? "/imgs/logos/wtw.png"
                  : null;

                return (
              <motion.div
                key={testimonial.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative"
                >
                  <div className={index < testimonials.length - 1 ? 'pb-12 border-b border-white/10' : ''}>
                    {/* Testimonial Text */}
                    <div className="mb-8 flex gap-4">
                      <Quote className="h-5 w-5 shrink-0 text-white mt-0.5" />
                      <p className="text-base leading-relaxed text-white/90 whitespace-pre-line">
                        {testimonial.text}
                      </p>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center gap-4 pl-9">
                      {companyLogo ? (
                        <Image
                          src={companyLogo}
                          alt={`${testimonial.company} logo`}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-sm object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white/10">
                          <User className="h-5 w-5 text-white/60" />
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {testimonial.name}
                        </p>
                        <p className="text-xs text-white/60 mt-0.5">
                          {testimonial.title} · {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </div>
            </motion.div>
                );
              })}
        </div>
        </motion.div>
        )}

        {/* Honor Detail Modal - Instagram Style */}
        <AnimatePresence>
          {selectedHonor && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                onClick={() => setSelectedHonor(null)}
              >
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSelectedHonor(null)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </motion.button>
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="relative flex w-full max-w-7xl flex-col overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm md:flex-row md:items-stretch"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Image Section - Left */}
                  {selectedHonor.image && (
                    <div className="flex w-full items-center justify-center bg-black/20 p-1 md:w-2/3 md:flex-shrink-0">
                      <Image
                        src={selectedHonor.image}
                        alt={`${selectedHonor.title} certificate`}
                        width={1600}
                        height={2400}
                        className="h-auto max-h-[90vh] w-full object-contain"
                      />
                    </div>
                  )}
                  
                  {/* Details Section - Right */}
                  <div className="flex w-full flex-col overflow-y-auto p-6 md:h-auto md:w-1/3 md:p-8">
                    {/* Header */}
                    <div className="mb-6 border-b border-white/10 pb-6">
                      <div className="mb-4 flex items-center gap-3">
                        {selectedHonor.logo ? (
                          <Image
                            src={selectedHonor.logo}
                            alt={`${selectedHonor.issuer} logo`}
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-lg object-contain p-1"
                          />
                        ) : (
                          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-white/10">
                            <Award className="h-7 w-7 text-white/80" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white">
                            {selectedHonor.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-2">
                            <p className="text-base font-medium text-white/70">
                              {selectedHonor.issuer}
                            </p>
                            {selectedHonor.links && selectedHonor.links.length > 0 && (
                              <a
                                href={selectedHonor.links[0].href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/50 hover:text-white/80"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Meta Info */}
                      <div className="flex items-center gap-2 text-sm text-white/60">
                        <Calendar className="h-4 w-4" />
                        <span>{selectedHonor.date}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="flex-1">
                      <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-white/60">
                        Description
                      </h4>
                      <p className="text-base leading-relaxed text-white/90 whitespace-pre-line">
                        {selectedHonor.fullDescription || selectedHonor.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating Particles - Only render after hydration */}
        {mounted && particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
    </motion.div>
    </div>
  );
}
