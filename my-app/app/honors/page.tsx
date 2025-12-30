"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Calendar,
  Award,
  Building2,
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedImage]);

  const toggleExpand = (id: string) => {
    hapticManager.light();
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredContent = {
    awards: sortedHonors,
    recommendations: testimonials,
    all: [...sortedHonors, ...testimonials.map(t => ({ ...t, type: "recommendation" as const }))],
  };

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

        {/* Statistics */}
        <motion.div
          variants={staggerItem}
          className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          <Card className="border-white/10 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20">
                <Trophy className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{honors.length}</p>
                <p className="text-sm text-white/60">Awards</p>
              </div>
            </div>
          </Card>
          <Card className="border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                <Quote className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{testimonials.length}</p>
                <p className="text-sm text-white/60">Recommendations</p>
              </div>
            </div>
          </Card>
          <Card className="border-white/10 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                <Award className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{honors.length + testimonials.length}</p>
                <p className="text-sm text-white/60">Total Recognition</p>
              </div>
            </div>
          </Card>
        </motion.div>

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
                                onClick={() => setSelectedImage(honor.image || null)}
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

                          {/* Expand Button */}
                          {honor.fullDescription && (
                            <motion.button
                              onClick={() => toggleExpand(honor.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-full rounded-lg bg-white/10 px-4 py-2 text-sm text-white transition-colors hover:bg-white/20"
                            >
                              {expandedId === honor.id ? (
                                <span className="flex items-center justify-center gap-2">
                                  <ChevronUp className="h-4 w-4" />
                                  Show Less
                                </span>
                              ) : (
                                <span className="flex items-center justify-center gap-2">
                                  <ChevronDown className="h-4 w-4" />
                                  Read More
                                </span>
                              )}
                            </motion.button>
                          )}

                          {/* Expanded Description */}
                          <AnimatePresence>
                            {expandedId === honor.id && honor.fullDescription && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-4 overflow-hidden"
                              >
                                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                                  <p className="text-sm whitespace-pre-line text-white/80">
                                    {honor.fullDescription}
                                  </p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
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

            {/* Recommendations Grid */}
            <div className="grid gap-8 md:grid-cols-2">
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
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                  className="relative"
                  onMouseEnter={() => {
                    setHoveredId(`testimonial-${testimonial.id}`);
                    hapticManager.light();
                  }}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Card className="group relative h-full overflow-hidden border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/[0.02] p-8 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 hover:shadow-xl hover:shadow-blue-500/10">
                    {/* Gradient Border Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 transition-opacity group-hover:opacity-100"
                      initial={false}
                    />

                    {/* Decorative Quote Icon - Top Left */}
                    <div className="absolute left-6 top-6 opacity-20">
                      <Quote className="h-12 w-12 text-blue-400" fill="currentColor" />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Opening Quote */}
                      <div className="mb-4">
                        <Quote className="h-8 w-8 text-blue-400/50" fill="currentColor" />
                      </div>

                      {/* Testimonial Text */}
                      <div className="mb-8">
                        <p className="text-lg leading-relaxed text-white/95 whitespace-pre-line font-light">
                          {testimonial.text}
                        </p>
                      </div>

                      {/* Closing Quote */}
                      <div className="mb-6 flex justify-end">
                        <Quote className="h-8 w-8 rotate-180 text-blue-400/50" fill="currentColor" />
                      </div>

                      {/* Author Info Card */}
                      <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-5 backdrop-blur-sm">
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="relative flex-shrink-0"
                          >
                            {companyLogo ? (
                              <div className="relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 blur-sm opacity-50" />
                                <Image
                                  src={companyLogo}
                                  alt={`${testimonial.company} logo`}
                                  width={64}
                                  height={64}
                                  className="relative h-16 w-16 rounded-full object-cover ring-2 ring-white/20"
                                />
                              </div>
                            ) : (
                              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 ring-2 ring-white/20">
                                <User className="h-8 w-8 text-white" />
                              </div>
                            )}
                          </motion.div>

                          {/* Author Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="mb-1 text-xl font-bold text-white">
                              {testimonial.name}
                            </h3>
                            <p className="mb-2 text-sm font-medium text-blue-300">
                              {testimonial.title}
                            </p>
                            
                            {/* Meta Info */}
                            <div className="space-y-1.5 text-xs text-white/60">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">{testimonial.company}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 shrink-0" />
                                <span>{testimonial.date}</span>
                              </div>
                              <div className="pt-1 text-xs text-white/50 italic">
                                {testimonial.relationship}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Animated Background Gradient */}
                    <motion.div
                      className="absolute inset-0 -z-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 transition-opacity group-hover:opacity-100"
                      animate={{
                        background: [
                          "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(236, 72, 153, 0.05) 100%)",
                          "linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(236, 72, 153, 0.05) 50%, rgba(59, 130, 246, 0.05) 100%)",
                          "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(236, 72, 153, 0.05) 100%)",
                        ],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />

                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{
                        x: hoveredId === `testimonial-${testimonial.id}` ? "100%" : "-100%",
                      }}
                      transition={{ duration: 0.6 }}
                    />
                  </Card>
            </motion.div>
                );
              })}
        </div>
        </motion.div>
        )}

        {/* Image Modal */}
        <AnimatePresence>
          {selectedImage && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                onClick={() => setSelectedImage(null)}
              >
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSelectedImage(null)}
                  className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </motion.button>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative max-h-[90vh] max-w-4xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Image
                    src={selectedImage}
                    alt="Award certificate"
                    width={1200}
                    height={900}
                    className="h-auto w-full rounded-lg object-contain"
                  />
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
