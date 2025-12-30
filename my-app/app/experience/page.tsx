 "use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Calendar,
  Award,
  TrendingUp,
  Zap,
  Target,
  Code,
  Rocket,
  Building2,
  Cloud,
  ExternalLink,
  GraduationCap,
  Heart
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { SiReact, SiAngular, SiDotnet, SiJavascript, SiTypescript, SiMongodb, SiNodedotjs, SiDocker, SiKubernetes, SiExpress, SiApachecassandra } from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import type { IconType } from "react-icons";

interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string;
  fullDescription?: string;
  logo?: string;
  technologies?: string[];
  links?: Array<{
    label: string;
    href: string;
  }>;
  achievements?: Array<{
    icon: LucideIcon;
    label: string;
    value: string;
    color: string;
  }>;
  type: "full-time" | "internship" | "education" | "volunteering";
  field?: string; // For education entries
}

const experiences: Experience[] = [
  {
    id: "0",
    company: "Flexspring",
    role: "Full-stack Development Intern",
    duration: "Sep 2024 - Present",
    location: "Montreal, Quebec, Canada",
    type: "internship",
    description:
      "Full-stack Development Intern at Flexspring, Montreal, Quebec, Canada. Working with React.js, Java and other modern technologies.",
    fullDescription:
      "Currently working as a Full-stack Development Intern at Flexspring, contributing to the development of modern web applications using React.js, Java, and other cutting-edge technologies. Based in Montreal, Quebec, Canada.",
    logo: "/imgs/logos/flexspring.jpeg",
    technologies: ["React.js", "Java", "TypeScript", "Node.js"],
    links: [
      {
        label: "Flexspring Website",
        href: "https://www.flexspring.com",
      },
    ],
    achievements: [
      { icon: Code, label: "Technologies", value: "Modern Stack", color: "from-blue-500 to-cyan-500" },
    ],
  },
  {
    id: "1",
    company: "Concordia University",
    role: "Masters of Applied Computer Science",
    duration: "Sep 2023 - Aug 2025 (2 yrs)",
    location: "Montreal, Quebec, Canada",
    type: "education",
    description:
      "Pursuing a Master's degree in Applied Computer Science at Concordia University, focusing on advanced topics in computer science including distributed systems, database management, software engineering, and measurement methodologies.",
    fullDescription:
      "Pursuing a Master's degree in Applied Computer Science at Concordia University, focusing on advanced topics in computer science including distributed systems, database management, software engineering, and measurement methodologies. The program emphasizes practical application of theoretical concepts through hands-on projects and research.\n\nMy first semester in the master's program has provided me with practical experience in essential technologies, including containerization, Cassandra database management, software measurement methodologies, problem-solving, and Python and Java programming languages. Looking forward, I am excited about the upcoming coursework in areas such as Human-Computer Interaction (HCI), Data Structures, Machine Learning (ML), and Artificial Intelligence (AI). These studies will further augment my skill set and align seamlessly with my practical expertise developed as a Senior Software Developer.",
    logo: "/imgs/logos/concordia.png",
    technologies: ["Cassandra", "Software Measurement"],
    links: [
      {
        label: "Concordia MACS Program",
        href: "https://www.concordia.ca/academics/graduate/macs.html",
      },
    ],
  },
  {
    id: "2",
    company: "CitiusTech",
    role: "Senior Software Engineer",
    duration: "Apr 2023 - Aug 2023 (5 mos)",
    location: "Remote",
    type: "full-time",
    description:
      "Developed a viewer for IBM Health Watson (now Merative) using Angular, DotNet, SQL, ML, AI, DICOM, PACS, and other technologies to improve cancer detection and reduce tumour analysis time.",
    fullDescription:
      "Developed a viewer for IBM Health Watson (now Merative) using Angular, DotNet, SQL, ML, AI, DICOM, PACS, and other technologies to: a. Improve cancer detection, b. Reduce time taken in performing tumour analysis, and c. Assist in making informed decisions. Created reusable Angular components that reduced front-end development time by 30%. Achieved 95% unit test code coverage throughout the application. Improved application spin-up time from 3 to 1.5 seconds approx. Wrote clean optimized code applying software development principles like OOPS, SOLID, and DRY. Developed a successful POC which was demonstrated at RSNA 2023, leading to new customer acquisitions.",
    logo: "/imgs/logos/citiustech.jpeg",
    technologies: ["Angular", ".NET", "SQL", "ML", "AI", "DICOM", "PACS", "C#"],
    links: [
      {
        label: "CitiusTech Website",
        href: "https://www.citiustech.com",
      },
    ],
    achievements: [
      { icon: TrendingUp, label: "Frontend Dev Time", value: "30% Reduction", color: "from-green-500 to-emerald-500" },
      { icon: Target, label: "Test Coverage", value: "95%", color: "from-purple-500 to-pink-500" },
      { icon: Zap, label: "Spin-up Time", value: "1.5s (50% faster)", color: "from-yellow-500 to-orange-500" },
      { icon: Rocket, label: "POC Success", value: "RSNA 2023", color: "from-blue-500 to-indigo-500" },
    ],
  },
  {
    id: "3",
    company: "CitiusTech",
    role: "Software Engineer",
    duration: "Dec 2021 - Mar 2023 (1 yr 4 mos)",
    location: "Mumbai, Maharashtra, India",
    type: "full-time",
    description:
      "Software Engineer at CitiusTech, Mumbai, Maharashtra, India. Worked with Angular, Microsoft SQL Server and other technologies.",
    fullDescription:
      "Worked as a Software Engineer at CitiusTech, contributing to various healthcare technology projects. Utilized Angular, Microsoft SQL Server, and other modern technologies to deliver high-quality software solutions.",
    logo: "/imgs/logos/citiustech.jpeg",
    technologies: ["Angular", "SQL Server", ".NET", "TypeScript", "Azure"],
    links: [
      {
        label: "CitiusTech Website",
        href: "https://www.citiustech.com",
      },
    ],
    achievements: [
      { icon: Code, label: "Healthcare Tech", value: "Enterprise Solutions", color: "from-cyan-500 to-blue-500" },
    ],
  },
  {
    id: "3a",
    company: "Homesfy Realty Pvt Ltd",
    role: "UI/UX Consultant",
    duration: "10 Feb 2022 - 19 Feb 2022 (9 days)",
    location: "India",
    type: "full-time",
    description:
      "Provided UI/UX consultancy to Homesfy Realty Pvt Ltd. for their project mymagnet.io.",
    fullDescription:
      "Provided UI/UX consultancy to Homesfy Realty Pvt Ltd. for their project mymagnet.io, focusing on improving usability, visual design, and user flows to better support their business goals and user engagement.",
    logo: "/imgs/logos/homesify.jpeg",
    technologies: ["UI/UX", "Design Systems"],
    links: [
      {
        label: "Homesfy Website",
        href: "https://www.homesfy.in",
      },
      {
        label: "MyMagnet.io",
        href: "https://mymagnet.io",
      },
    ],
  },
  {
    id: "4",
    company: "Willis Towers Watson",
    role: "Full Stack Developer",
    duration: "Jul 2019 - Nov 2021 (2 yrs 5 mos)",
    location: "Thane, Maharashtra, India",
    type: "full-time",
    description:
      "Developed and delivered enterprise-grade applications in an agile environment using Angular, .Net, SQL, CosmosDB, and Azure.",
    logo: "/imgs/logos/wtw.png",
    fullDescription:
      "Developed and delivered enterprise-grade applications in an agile environment using Angular, .Net, SQL, CosmosDB, and Azure. Managed Angular libraries and expanded toolkit with reusable components for multiple projects. Applied software development principles (SOLID, ONION) and design patterns (Strategy, Repository) in MVC framework. By continually monitoring and optimizing azure resources and its metrics, saved more than 1000 pounds. Reduced data retrieval time from 5-10 seconds to 0.5-1 seconds, enhancing application performance. Achieved 90-95% unit test code coverage across applications and APIs. Defined branching, release strategies, and CI/CD pipelines in Azure DevOps for diverse environments.",
    technologies: ["Angular", ".NET", "SQL", "CosmosDB", "Azure", "Azure DevOps"],
    links: [
      {
        label: "WTW Website",
        href: "https://www.wtwco.com",
      },
    ],
    achievements: [
      { icon: Award, label: "Cost Savings", value: "£1000+", color: "from-green-500 to-teal-500" },
      { icon: Zap, label: "Data Retrieval", value: "0.5-1s (90% faster)", color: "from-yellow-500 to-amber-500" },
      { icon: Target, label: "Test Coverage", value: "90-95%", color: "from-purple-500 to-violet-500" },
      { icon: Rocket, label: "CI/CD", value: "Azure DevOps", color: "from-blue-500 to-cyan-500" },
    ],
  },
  {
    id: "5",
    company: "Reliance Industries Limited",
    role: "Full-stack Development Intern",
    duration: "Dec 2018 - Jan 2019 (2 mos)",
    location: "Mumbai, Maharashtra, India",
    type: "internship",
    description:
      "Developed MEAN stack project management application using Angular, Node.js, Express server, and MongoDB, increasing productivity of internal teams by 27%.",
    logo: "/imgs/logos/reliance.jpg",
    fullDescription:
      "Developed MEAN stack project management application using Angular, Node.js, Express server, and MongoDB (MEAN Stack), increasing the productivity of internal teams by 27% within the first quarter of launch.",
    technologies: ["Angular", "Node.js", "Express", "MongoDB", "MEAN Stack"],
    links: [
      {
        label: "Reliance Industries",
        href: "https://www.ril.com",
      },
    ],
    achievements: [
      { icon: TrendingUp, label: "Productivity", value: "27% Increase", color: "from-green-500 to-emerald-500" },
      { icon: Rocket, label: "Launch", value: "Q1 Success", color: "from-blue-500 to-indigo-500" },
    ],
  },
  {
    id: "6",
    company: "University of Mumbai",
    role: "Bachelor of Engineering - BE",
    field: "Information Technology",
    duration: "2015 - 2019 (4 yrs)",
    location: "Mumbai, Maharashtra, India",
    type: "education",
    description:
      "Completed Bachelor of Engineering in Information Technology from University of Mumbai. The program provided a strong foundation in computer science fundamentals, software engineering, database systems, networking, and web technologies.",
    logo: "/imgs/logos/university-of-mumbai.png",
    fullDescription:
      "Completed Bachelor of Engineering in Information Technology from University of Mumbai. The program provided a strong foundation in computer science fundamentals, software engineering, database systems, networking, and web technologies. Gained hands-on experience through various projects and coursework that prepared me for a career in software development.",
    links: [
      {
        label: "University of Mumbai",
        href: "https://mu.ac.in",
      },
    ],
  },
  {
    id: "7",
    company: "HackConcordia",
    role: "Vice President of Technology",
    duration: "Apr 2025 - Present",
    location: "Montreal, Quebec, Canada",
    type: "volunteering",
    description:
      "Vice President of Technology at HackConcordia.",
    fullDescription:
      "Vice President of Technology at HackConcordia, leading the technology initiatives and overseeing technical operations for the organization.",
    links: [
      {
        label: "HackConcordia",
        href: "https://hackconcordia.com",
      },
    ],
  },
  {
    id: "8",
    company: "HackConcordia",
    role: "Director of Technology",
    duration: "Apr 2024 - Mar 2025 (1 yr)",
    location: "Montreal, Quebec, Canada",
    type: "volunteering",
    description:
      "Technology Director at HackConcordia. Designing and developing tech solutions for ConUHacks IX (Quebec's largest hackathon).",
    fullDescription:
      "Technology Director at HackConcordia. Designed and developed tech solutions for ConUHacks IX, Quebec's largest hackathon. Led the technical team in creating innovative platforms and tools to enhance the hackathon experience for participants.",
    technologies: ["Web Development", "Event Management"],
    links: [
      {
        label: "HackConcordia",
        href: "https://hackconcordia.com",
      },
    ],
  },
  {
    id: "9",
    company: "CSI Computer FCRIT",
    role: "Mentor",
    duration: "Feb 2024 (1 mo)",
    location: "Mumbai, Maharashtra, India",
    type: "volunteering",
    field: "Science and Technology",
    description:
      "Provided guidance and mentorship to 15 teams throughout the intensive 36-hour Agnethon Hackathon. The projects utilized different technology stacks including but not limited to MEAN, MERN, Python, Java Spring, Django, and Flask.",
    fullDescription:
      "Provided guidance and mentorship to 15 teams throughout the intensive 36-hour Agnethon Hackathon. The projects utilized different technology stacks including but not limited to MEAN, MERN, Python, Java Spring, Django, and Flask. Helped teams overcome technical challenges and provided strategic guidance to bring their innovative ideas to life.",
    technologies: ["MEAN", "MERN", "Python", "Java Spring", "Django", "Flask"],
  },
  {
    id: "10",
    company: "HackConcordia",
    role: "Assistant - ConUHacks VIII",
    duration: "Jan 2024 - Feb 2024 (1 mo)",
    location: "Montreal, Quebec, Canada",
    type: "volunteering",
    field: "Science and Technology",
    description:
      "At ConuHack, I assist diverse teams in ensuring an engaging and inclusive hackathon, creating an environment in which participants can display their abilities and new ideas.",
    fullDescription:
      "At ConuHack, I assist diverse teams in ensuring an engaging and inclusive hackathon, creating an environment in which participants can display their abilities and new ideas. Worked closely with organizers to facilitate smooth event operations and provide support to participants throughout the hackathon.",
    links: [
      {
        label: "HackConcordia",
        href: "https://hackconcordia.com",
      },
    ],
  },
  {
    id: "11",
    company: "Fr. Conceicao Rodrigues Institute of Technology",
    role: "Public Relations",
    duration: "Feb 2018 - Jul 2018 (6 mos)",
    location: "Mumbai, Maharashtra, India",
    type: "volunteering",
    field: "Arts and Culture",
    description:
      "As a member of the public relations team, I had the exciting responsibility of asking musicians, dancers, and various artists to participate in the competitions organized as part of our college events (FACES and ETAMAX).",
    fullDescription:
      "As a member of the public relations team, I had the exciting responsibility of asking musicians, dancers, and various artists to participate in the competitions organized as part of our college events (FACES and ETAMAX). Coordinated with artists, managed communications, and contributed to the successful execution of cultural events.",
  },
  {
    id: "12",
    company: "Fr. Conceicao Rodrigues Institute of Technology",
    role: "Security Assistant",
    duration: "Feb 2017 - Mar 2017 (1 mo)",
    location: "Mumbai, Maharashtra, India",
    type: "volunteering",
    field: "Arts and Culture",
    description:
      "As part of the security team for the events FACES and ETAMAX, my role was to ensure a safe and enjoyable environment for everyone, contributing to the smooth execution of the events.",
    fullDescription:
      "As part of the security team for the events FACES and ETAMAX, my role was to ensure a safe and enjoyable environment for everyone, contributing to the smooth execution of the events. Managed crowd control, coordinated with security personnel, and ensured the safety of all participants and attendees.",
  },
];

// Function to calculate duration between two dates
const calculateDuration = (startDate: string, endDate: string | null): string => {
  const parseDate = (dateStr: string): Date => {
    // Handle formats like "Sep 2024", "10 Feb 2022", "Jan 2024 - Feb 2024", "2015 - 2019"
    const monthNames: Record<string, number> = {
      "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
      "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
    };
    
    // Try to parse day month year format first (e.g., "10 Feb 2022")
    const dayMonthYearMatch = dateStr.match(/(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/);
    if (dayMonthYearMatch) {
      return new Date(parseInt(dayMonthYearMatch[3]), monthNames[dayMonthYearMatch[2]], parseInt(dayMonthYearMatch[1]));
    }
    
    // Try to parse month name format (e.g., "Sep 2024")
    const monthMatch = dateStr.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/);
    if (monthMatch) {
      return new Date(parseInt(monthMatch[2]), monthNames[monthMatch[1]], 1);
    }
    
    // Try year-only format
    const yearMatch = dateStr.match(/(\d{4})/);
    if (yearMatch) {
      return new Date(parseInt(yearMatch[1]), 0, 1);
    }
    
    return new Date();
  };

  const start = parseDate(startDate);
  const end = endDate ? parseDate(endDate) : new Date();
  
  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();
  
  let totalMonths = years * 12 + months;
  
  // Adjust if end day is before start day
  if (end.getDate() < start.getDate()) {
    totalMonths--;
  }
  
  const calculatedYears = Math.floor(totalMonths / 12);
  const calculatedMonths = totalMonths % 12;
  
  if (calculatedYears > 0 && calculatedMonths > 0) {
    return `${calculatedYears} ${calculatedYears === 1 ? "year" : "years"} ${calculatedMonths} ${calculatedMonths === 1 ? "month" : "months"}`;
  } else if (calculatedYears > 0) {
    return `${calculatedYears} ${calculatedYears === 1 ? "year" : "years"}`;
  } else if (calculatedMonths > 0) {
    return `${calculatedMonths} ${calculatedMonths === 1 ? "month" : "months"}`;
  } else {
    return "1 month"; // Default to 1 month for very short durations
  }
};

// Function to format duration string with dynamic calculation for Present
const formatDuration = (duration: string): string => {
  // If duration already has brackets, check if it needs updating
  if (duration.includes("Present")) {
    // Extract start date from duration string
    const match = duration.match(/(.+?)\s*-\s*Present/);
    if (match) {
      const startDate = match[1].trim();
      const calculatedDuration = calculateDuration(startDate, null);
      return `${startDate} - Present (${calculatedDuration})`;
    }
  }
  
  // If duration already has brackets, convert abbreviations to full words
  if (duration.includes("(")) {
    return duration
      .replace(/\b(\d+)\s*yrs?\b/g, (match, num) => `${num} ${parseInt(num) === 1 ? "year" : "years"}`)
      .replace(/\b(\d+)\s*mos?\b/g, (match, num) => `${num} ${parseInt(num) === 1 ? "month" : "months"}`)
      .replace(/\b(\d+)\s*mo\b/g, (match, num) => `${num} ${parseInt(num) === 1 ? "month" : "months"}`)
      .replace(/\bdays?\b/g, (match) => match === "day" ? "day" : "days");
  }
  
  // For entries without Present, try to calculate duration
  const dateRangeMatch = duration.match(/(.+?)\s*-\s*(.+)/);
  if (dateRangeMatch) {
    const startDate = dateRangeMatch[1].trim();
    const endDate = dateRangeMatch[2].trim();
    const calculatedDuration = calculateDuration(startDate, endDate);
    return `${startDate} - ${endDate} (${calculatedDuration})`;
  }
  
  // Single date or year range
  const yearRangeMatch = duration.match(/(\d{4})\s*-\s*(\d{4})/);
  if (yearRangeMatch) {
    const startYear = parseInt(yearRangeMatch[1]);
    const endYear = parseInt(yearRangeMatch[2]);
    const years = endYear - startYear + 1;
    return `${duration} (${years} ${years === 1 ? "year" : "years"})`;
  }
  
  return duration;
};

// Sort experiences chronologically (most recent first)
const sortedExperiences = [...experiences].sort((a, b) => {
  // Extract year from duration string
  const getYear = (duration: string) => {
    // For "Present" or ongoing, use current year + 1 to put it first
    if (duration.includes("Present")) return new Date().getFullYear() + 1;
    // Extract year from strings like "Sep 2023 - Aug 2025" or "2015 - 2019"
    const yearMatch = duration.match(/\d{4}/);
    return yearMatch ? parseInt(yearMatch[0]) : 0;
  };
  return getYear(b.duration) - getYear(a.duration);
});

const techIcons: Record<string, IconType | LucideIcon> = {
  "React.js": SiReact,
  "React": SiReact,
  "Angular": SiAngular,
  ".NET": SiDotnet,
  "Java": FaJava,
  "TypeScript": SiTypescript,
  "JavaScript": SiJavascript,
  "Node.js": SiNodedotjs,
  "Express": SiExpress,
  "MongoDB": SiMongodb,
  "Azure": Cloud,
  "AWS": FaAws,
  "Docker": SiDocker,
  "Kubernetes": SiKubernetes,
  "C#": SiDotnet,
  "SQL": SiDotnet,
  "CosmosDB": Cloud,
  "ML": Cloud,
  "AI": Cloud,
  "DICOM": Cloud,
  "PACS": Cloud,
  "Cassandra": SiApachecassandra,
};

// Generate particle positions once
const generateParticles = () => {
  return Array.from({ length: 20 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2,
  }));
};

type FilterType = "all" | "work" | "education" | "volunteering";

export default function ExperiencePage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Array<{ left: number; top: number; duration: number; delay: number }>>([]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [filter, setFilter] = useState<FilterType>("all");
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lastCardRef = useRef<HTMLDivElement>(null);

  // Filter experiences based on selected filter
  const filteredExperiences = sortedExperiences.filter((exp) => {
    if (filter === "all") return true;
    if (filter === "education") return exp.type === "education";
    if (filter === "work") return exp.type === "full-time" || exp.type === "internship";
    if (filter === "volunteering") return exp.type === "volunteering";
    return true;
  });

  // Count items for each filter
  const workCount = sortedExperiences.filter((exp) => exp.type === "full-time" || exp.type === "internship").length;
  const educationCount = sortedExperiences.filter((exp) => exp.type === "education").length;
  const volunteeringCount = sortedExperiences.filter((exp) => exp.type === "volunteering").length;

  // Only generate and render particles after hydration to avoid mismatch
  // This is a standard Next.js pattern to prevent hydration errors with random values
  useEffect(() => {
    setMounted(true);
    setParticles(generateParticles());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleExpand = (id: string) => {
    hapticManager.light();
    setExpandedId(expandedId === id ? null : id);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current || !lastCardRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const timelineTop = timelineRect.top + window.scrollY;
      const timelineHeight = timelineRect.height;
      const scrollPosition = window.scrollY + window.innerHeight;
      const timelineStart = timelineTop;

      // Get last card position relative to viewport
      const lastCardRect = lastCardRef.current.getBoundingClientRect();
      const lastCardTop = lastCardRect.top + window.scrollY;

      // Check if last card is completely visible in viewport
      // Card is fully visible when its top is at or below viewport top (>= 0)
      // and its bottom is at or above viewport bottom (<= window.innerHeight)
      const isLastCardFullyVisible = 
        lastCardRect.top >= 0 && 
        lastCardRect.bottom <= window.innerHeight;

      // Calculate progress: 0 when timeline starts entering viewport, 1 when last card is fully visible
      let progress = 0;
      if (scrollPosition >= timelineStart) {
        // If last card is completely shown, complete the trail
        if (isLastCardFullyVisible) {
          progress = 1;
        } else {
          // Calculate scroll position needed to make last card fully visible
          // Scroll until card top reaches viewport top (scrollY = lastCardTop)
          const targetScrollPosition = lastCardTop;
          
          // Check if we've scrolled enough to show the card fully (or as much as possible)
          if (window.scrollY >= targetScrollPosition) {
            // Card top has reached viewport top - complete the trail
            progress = 1;
          } else if (scrollPosition >= lastCardTop - window.innerHeight) {
            // Approaching last card - calculate progress smoothly from current position to full visibility
            const scrolledToLastCard = scrollPosition - timelineStart;
            const distanceToFullVisibility = targetScrollPosition + window.innerHeight - timelineStart;
            progress = Math.min(0.98, scrolledToLastCard / distanceToFullVisibility);
          } else {
            // Normal progress calculation before reaching last card
            const scrolled = scrollPosition - timelineStart;
            progress = Math.min(0.85, scrolled / (timelineHeight + window.innerHeight * 0.5));
          }
        }
      }

      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

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
        className="relative mx-auto max-w-7xl px-4 py-24 mt-12"
    >
        {/* Header */}
      <motion.h1
        variants={staggerItem}
        className="mb-12 text-4xl font-bold text-white md:text-5xl"
      >
        Experience
      </motion.h1>

        <motion.section
          variants={staggerItem}
          className="mb-16 space-y-4 text-lg text-white/80"
        >
          <p className="text-justify">
            My journey has been marked by continuous growth, innovation, and a
            commitment to delivering exceptional results. From developing
            enterprise-grade healthcare solutions to building modern web
            applications, I&apos;ve had the opportunity to work with
            cutting-edge technologies and contribute to meaningful projects.
          </p>
          <p className="text-justify">
            Each role and educational milestone has shaped my expertise in
            full-stack development, software engineering principles, and
            collaborative problem-solving. I take pride in writing clean,
            optimized code and achieving measurable improvements in performance,
            efficiency, and user experience.
          </p>
        </motion.section>

        {/* Filter Buttons */}
        <motion.div
          variants={staggerItem}
          className="mb-8 flex flex-wrap gap-3"
        >
          <motion.button
            onClick={() => {
              setFilter("all");
              hapticManager.light();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-white text-black shadow-lg shadow-white/20"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            All ({sortedExperiences.length})
          </motion.button>
          <motion.button
            onClick={() => {
              setFilter("work");
              hapticManager.light();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              filter === "work"
                ? "bg-blue-500/90 text-white shadow-lg shadow-blue-500/30"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            Work Experience ({workCount})
          </motion.button>
          <motion.button
            onClick={() => {
              setFilter("education");
              hapticManager.light();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              filter === "education"
                ? "bg-green-500/90 text-white shadow-lg shadow-green-500/30"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            Education ({educationCount})
          </motion.button>
          <motion.button
            onClick={() => {
              setFilter("volunteering");
              hapticManager.light();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-6 py-2.5 text-sm font-medium transition-all ${
              filter === "volunteering"
                ? "bg-orange-500/90 text-white shadow-lg shadow-orange-500/30"
                : "bg-white/10 text-white/80 hover:bg-white/20"
            }`}
          >
            Volunteering ({volunteeringCount})
          </motion.button>
        </motion.div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Vertical Timeline Line Background */}
          <div className="absolute left-[calc(2rem-2px)] top-0 h-full w-1 bg-white/10 md:left-[calc(3rem-2px)]" />
          
          {/* Vertical Timeline Line Progress */}
          <motion.div
            className="absolute left-[calc(2rem-2px)] top-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 md:left-[calc(3rem-2px)]"
            style={{
              height: `${scrollProgress * 100}%`,
              boxShadow: scrollProgress > 0 ? "0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(99, 102, 241, 0.3)" : "none",
            }}
            transition={{ duration: 0.1, ease: "linear" }}
          />

          {/* Timeline Nodes */}
          {filteredExperiences.map((exp, index) => {
            const isLastCard = index === filteredExperiences.length - 1;
            return (
          <motion.div
            key={exp.id}
            ref={isLastCard ? lastCardRef : null}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative mb-12 flex flex-col md:flex-row md:items-start"
            >
              {/* Timeline Node */}
              <div className="absolute left-8 top-0 z-10 md:left-12 md:-translate-x-1/2">
                <motion.div
                  className="relative h-6 w-6 rounded-full border-4 border-white/20 bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg shadow-purple-500/50"
                  whileHover={{ scale: 1.5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-400"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </motion.div>
              </div>

              {/* Experience Card */}
              <div className="ml-20 flex-1 md:ml-24 md:pl-8">
                <motion.div
                  onMouseEnter={() => {
                    setHoveredId(exp.id);
                    hapticManager.light();
                  }}
                  onMouseLeave={() => setHoveredId(null)}
                  whileHover={{ y: -5 }}
                  className="h-full"
                >
                  <Card className="group relative overflow-hidden border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10 md:p-8">
                    {/* Gradient Border Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 transition-opacity group-hover:opacity-100"
                      initial={false}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <motion.div
                              className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-sm bg-white/5"
                            >
                              {exp.logo ? (
                                <Image
                                  src={exp.logo}
                                  alt={`${exp.company} logo`}
                                  width={48}
                                  height={48}
                                  className="h-full w-full object-contain p-1"
                                />
                              ) : (
                                exp.type === "education" ? (
                                  <GraduationCap className="h-6 w-6 text-white/80" />
                                ) : exp.type === "volunteering" ? (
                                  <Heart className="h-6 w-6 text-white/80" />
                              ) : (
                                <Building2 className="h-6 w-6 text-white/80" />
                                )
                              )}
                            </motion.div>
                            <div className="flex flex-col gap-1">
                               <h3 className="text-lg font-bold text-white md:text-2xl">
                                {exp.role}
                              </h3>
                               <div className="flex items-center gap-2">
                                 <p className="text-sm font-medium text-white/70">
                                   {exp.company}
                                 </p>
                                 {exp.links && exp.links.length > 0 && (
                                   <a
                                     href={exp.links[0].href}
                                     target="_blank"
                                     rel="noopener noreferrer"
                                   >
                                     <ExternalLink className="h-3 w-3" />
                                   </a>
                                 )}
                               </div>
                               {exp.field && (
                                 <p className="text-sm text-white/60">
                                   {exp.field}
                                 </p>
                               )}
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDuration(exp.duration)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{exp.location}</span>
                            </div>
                            <motion.span
                              className={`rounded-full px-3 py-1 text-xs font-medium ${
                                exp.type === "education"
                                  ? "bg-green-500/20 text-green-300"
                                  : exp.type === "volunteering"
                                  ? "bg-orange-500/20 text-orange-300"
                                  : exp.type === "full-time"
                                  ? "bg-blue-500/20 text-blue-300"
                                  : "bg-purple-500/20 text-purple-300"
                              }`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {exp.type === "education" 
                                ? "Education" 
                                : exp.type === "volunteering"
                                ? "Volunteering"
                                : exp.type === "full-time" 
                                ? "Full-time" 
                                : "Internship"}
                            </motion.span>
                          </div>
                </div>

                        {/* Expand Button */}
                {exp.fullDescription && (
                          <motion.button
                    onClick={() => toggleExpand(exp.id)}
                            whileHover={{ scale: 1.1, rotate: 180 }}
                            whileTap={{ scale: 0.9 }}
                            className="ml-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  >
                    {expandedId === exp.id ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                          </motion.button>
                        )}
                      </div>

                      {/* Description */}
                      <p className="mb-4 text-white/80">{exp.description}</p>

                      {/* Technologies */}
                      {exp.technologies && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {exp.technologies.slice(0, 6).map((tech) => {
                            const Icon = techIcons[tech];
                            return (
                              <motion.div
                                key={tech}
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20"
                              >
                                {Icon && <Icon className="h-4 w-4" />}
                                <span>{tech}</span>
                              </motion.div>
                            );
                          })}
                          {exp.technologies.length > 6 && (
                            <motion.span
                              whileHover={{ scale: 1.1 }}
                              className="flex items-center rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80"
                            >
                              +{exp.technologies.length - 6} more
                            </motion.span>
                          )}
                        </div>
                      )}

                      {/* Links are shown inline next to company name */}

                      {/* Achievements */}
                      {exp.achievements && (
                        <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                          {exp.achievements.map((achievement, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, scale: 0.8 }}
                              whileInView={{ opacity: 1, scale: 1 }}
                              viewport={{ once: true }}
                              transition={{ delay: idx * 0.1 }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className={`relative overflow-hidden rounded-lg bg-gradient-to-br ${achievement.color} p-3 backdrop-blur-sm`}
                            >
                              <div className="relative z-10">
                                <achievement.icon className="mb-1 h-5 w-5 text-white" />
                                <p className="text-xs font-medium text-white/90">
                                  {achievement.label}
                                </p>
                                <p className="text-sm font-bold text-white">
                                  {achievement.value}
                                </p>
                              </div>
                              <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 transition-opacity group-hover:opacity-20`}
                                animate={{
                                  scale: hoveredId === exp.id ? [1, 1.2, 1] : 1,
                                }}
                                transition={{ duration: 2, repeat: Infinity }}
                              />
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Expanded Description */}
                      <AnimatePresence>
                        {expandedId === exp.id && exp.fullDescription && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                              <p className="whitespace-pre-line text-white/80">
                                {exp.fullDescription}
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
                        x: hoveredId === exp.id ? "100%" : "-100%",
                      }}
                      transition={{ duration: 0.6 }}
                    />
                  </Card>
                </motion.div>
              </div>
          </motion.div>
            );
          })}
      </div>

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
