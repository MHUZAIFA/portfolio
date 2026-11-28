"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Award,
  Zap,
  Rocket,
  ChevronDown,
  TrendingUp,
  Target,
  Code,
  Building2,
  Cloud,
  ExternalLink,
  GraduationCap,
  Heart,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { ExperienceRouteSection } from "@/components/flight-log/experience-globe";
import { clusterStops, type RouteStop } from "@/components/flight-log/route";
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
    id: "ac",
    company: "Air Canada",
    role: "Full Stack Developer",
    duration: "Aug 2026 - Present",
    location: "Montreal, Quebec, Canada",
    type: "full-time",
    logo: "/imgs/logos/air-canada.png",
    description:
      "Full Stack Developer at Air Canada, building and maintaining web applications across the front end and back end.",
    fullDescription:
      "Full Stack Developer at Air Canada in Montreal, Quebec, Canada, building and maintaining web applications across the full stack.",
    links: [
      {
        label: "Air Canada",
        href: "https://www.aircanada.com",
      },
    ],
  },
  {
    id: "0f",
    company: "Flexspring",
    role: "Full Stack Developer",
    duration: "May 2026 - 17 Aug 2026 (4 mos)",
    location: "Montreal, Quebec, Canada",
    type: "full-time",
    description: "Full Stack Developer at Flexspring, Montreal, after converting from the internship to a full-time role.",
    fullDescription:
      "Joined Flexspring full-time after my internship, continuing full-stack development work with the same team in Montreal, Quebec, Canada.",
    logo: "/imgs/logos/flexspring.jpeg",
    links: [
      {
        label: "Flexspring Website",
        href: "https://www.flexspring.com",
      },
    ],
  },
  {
    id: "0",
    company: "Flexspring",
    role: "Full-stack Development Intern",
    duration: "Sep 2024 - Apr 2026 (1 yr 8 mos)",
    location: "Montreal, Quebec, Canada",
    type: "internship",
    description:
      "Full-stack Development Intern at Flexspring, Montreal, Quebec, Canada. Worked with React.js, Java and other modern technologies.",
    fullDescription:
      "Worked as a Full-stack Development Intern at Flexspring, contributing to the development of modern web applications using React.js, Java, and other cutting-edge technologies. Based in Montreal, Quebec, Canada.",
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
    logo: "/imgs/logos/concordia-c.png",
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
    location: "Airoli, Navi Mumbai, Maharashtra, India",
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
    location: "Airoli, Navi Mumbai, Maharashtra, India",
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
    type: "volunteering",
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
    id: "7a",
    company: "HackConcordia",
    role: "Advisor",
    duration: "Apr 2026 - Present",
    location: "Montreal, Quebec, Canada",
    type: "volunteering",
    logo: "/imgs/logos/hackconcordia-bee.png",
    description:
      "Advisor at HackConcordia, guiding the technology team behind Concordia's hackathons.",
    fullDescription:
      "Advisor at HackConcordia, guiding the technology team behind Concordia's hackathons and supporting new tech leads. Also teaches beginner workshops, such as the bilingual Git 101 session for HackDécouverte 2026.",
    links: [
      {
        label: "HackConcordia",
        href: "https://hackconcordia.com",
      },
    ],
  },
  {
    id: "7",
    company: "HackConcordia",
    role: "Vice President of Technology",
    duration: "Apr 2025 - Mar 2026 (1 yr)",
    location: "Montreal, Quebec, Canada",
    type: "volunteering",
    logo: "/imgs/logos/hackconcordia-bee.png",
    description:
      "Vice President of Technology at HackConcordia.",
    fullDescription:
      "Vice President of Technology at HackConcordia, led the technology initiatives and oversaw technical operations for the organization.",
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
    logo: "/imgs/logos/hackconcordia-bee.png",
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
    logo: "/imgs/logos/university-of-mumbai.png",
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
    role: "Volunteer",
    duration: "Jan 2024 - Feb 2024 (1 mo)",
    location: "Montreal, Quebec, Canada",
    type: "volunteering",
    logo: "/imgs/logos/hackconcordia-bee.png",
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
    logo: "/imgs/logos/university-of-mumbai.png",
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
    logo: "/imgs/logos/university-of-mumbai.png",
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
// Ongoing legs first, then by start date (newest first). Stable for ties.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const startValue = (duration: string) => {
  const start = duration.split(" - ")[0];
  const y = start.match(/\d{4}/);
  const m = start.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/);
  return (y ? parseInt(y[0]) : 0) * 12 + (m ? MONTHS.indexOf(m[1]) : 0);
};
const sortedExperiences = [...experiences].sort((a, b) => {
  const pa = a.duration.includes("Present") ? 1 : 0;
  const pb = b.duration.includes("Present") ? 1 : 0;
  if (pa !== pb) return pb - pa;
  return startValue(b.duration) - startValue(a.duration);
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

/* ─────────────────────────────────────────────────────────
   Flight-log helpers: every role is a "leg" of the journey
   ───────────────────────────────────────────────────────── */

type Leg = {
  depart: string;
  arrive: string;
  departLong: string;
  arriveLong: string;
  length: string;
  enRoute: boolean;
};

const shortDate = (s: string) => {
  const m = s.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(\d{4})/);
  if (m) return `${m[1].toUpperCase()} '${m[2].slice(2)}`;
  const y = s.match(/\d{4}/);
  return y ? y[0] : s.toUpperCase();
};

const toLeg = (duration: string): Leg => {
  const formatted = formatDuration(duration);
  const paren = formatted.match(/\(([^)]+)\)\s*$/);
  const range = formatted.replace(/\s*\([^)]*\)\s*$/, "");
  const [startRaw, endRawMaybe] = range.split(/\s+-\s+/);
  const endRaw = endRawMaybe ?? startRaw;
  const enRoute = /Present/.test(endRaw);
  return {
    depart: shortDate(startRaw),
    arrive: enRoute ? "NOW" : shortDate(endRaw),
    departLong: startRaw.trim(),
    arriveLong: enRoute ? "Present" : endRaw.trim(),
    length: paren ? paren[1] : "",
    enRoute,
  };
};

const airportCode = (loc: string) =>
  /montreal|quebec|canada/i.test(loc) ? "YUL" : /mumbai|thane|maharashtra|india/i.test(loc) ? "BOM" : /remote/i.test(loc) ? "WFH" : loc.slice(0, 3).toUpperCase();

const cityName = (loc: string) => loc.split(",")[0];

const flightNumber = (duration: string) => {
  const v = startValue(duration);
  const yy = String(Math.floor(v / 12) % 100).padStart(2, "0");
  const mm = String((v % 12) + 1).padStart(2, "0");
  return `MH${yy}${mm}`;
};

const BOARD_NAMES: Record<string, string> = {
  "Concordia University": "CONCORDIA",
  "University of Mumbai": "MUMBAI UNIV",
  "Willis Towers Watson": "WTW",
  "Reliance Industries Limited": "RELIANCE",
  "Fr. Conceicao Rodrigues Institute of Technology": "FCRIT",
  "Homesfy Realty Pvt Ltd": "HOMESFY",
  "CSI Computer FCRIT": "CSI FCRIT",
};
const boardName = (company: string) => (BOARD_NAMES[company] ?? company).toUpperCase().slice(0, 13);

const TYPE_META: Record<Experience["type"], { label: string; gate: string; Icon: LucideIcon }> = {
  "full-time": { label: "Full-time", gate: "A", Icon: Building2 },
  internship: { label: "Internship", gate: "B", Icon: Building2 },
  education: { label: "Education", gate: "E", Icon: GraduationCap },
  volunteering: { label: "Volunteer", gate: "V", Icon: Heart },
};

/** Top-down airliner, nose pointing up. */
function AirlinerIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden="true">
      <path d="M12 1.5c.9 0 1.6.8 1.6 1.7V9l7.9 4.6v2.2l-7.9-2.4v5l2.6 2v1.7L12 21l-4.2 1.1v-1.7l2.6-2v-5l-7.9 2.4v-2.2L10.4 9V3.2c0-.9.7-1.7 1.6-1.7z" />
    </svg>
  );
}

function Barcode({ seed, className = "" }: { seed: string; className?: string }) {
  const bars = useMemo(() => {
    let h = 0;
    for (const c of seed) h = (Math.imul(h, 31) + c.charCodeAt(0)) >>> 0;
    const out: number[] = [];
    for (let i = 0; i < 36; i++) {
      h = (Math.imul(h, 1103515245) + 12345) >>> 0;
      out.push(1 + ((h >>> 16) % 3));
    }
    return out;
  }, [seed]);
  return (
    <div className={`flex h-10 items-stretch justify-between ${className}`} aria-hidden="true">
      {bars.map((w, i) => (
        <span key={i} className="bg-white/70" style={{ width: w }} />
      ))}
    </div>
  );
}

type FlapTone = "amber" | "sky" | "emerald" | "white";
const FLAP_TONE: Record<FlapTone, string> = {
  amber: "text-amber-300",
  sky: "text-sky-300",
  emerald: "text-emerald-300",
  white: "text-white/80",
};

function SplitFlap({ text, delay = 0, animate, tone = "amber" }: { text: string; delay?: number; animate: boolean; tone?: FlapTone }) {
  return (
    <span className="inline-flex gap-[2px]" aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={`${text}-${i}`}
          initial={animate ? { rotateX: -90, opacity: 0 } : false}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ delay: delay + i * 0.03, duration: 0.25, ease: "easeOut" }}
          aria-hidden="true"
          className={`relative inline-flex h-5 w-[0.8rem] md:h-6 md:w-[1rem] items-center justify-center rounded-[3px] bg-white/[0.07] font-mono text-[10px] md:text-[13px] font-semibold shadow-[inset_0_-1px_0_rgba(0,0,0,0.6)] ${
            FLAP_TONE[tone]
          }`}
        >
          {ch === " " ? " " : ch}
          <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-black/70" />
        </motion.span>
      ))}
    </span>
  );
}

function StatusPill({ enRoute }: { enRoute: boolean }) {
  return enRoute ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest text-red-300">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-400" />
      </span>
      EN ROUTE
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest text-white/60">
      LANDED
    </span>
  );
}

function Field({ label, value, className = "" }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>
      <div className="mt-1 text-sm font-medium text-white wrap-break-word">{value}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Boarding pass card
   ───────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────
   Trips: every role at one company folded into one ticket
   ───────────────────────────────────────────────────────── */

/** Same or related organisations share a key (e.g. CSI Computer FCRIT → FCRIT). */
const companyKey = (company: string) => (/fcrit|conceicao rodrigues/i.test(company) ? "FCRIT" : company.toLowerCase());

const isWork = (e: Experience) => e.type === "full-time" || e.type === "internship";
const category = (e: Experience) => (isWork(e) ? "work" : e.type);

/** Groups rows by company (within the same category), in order of each company's most recent role. */
function groupTrips(rows: Experience[]): Experience[][] {
  const groups = new Map<string, Experience[]>();
  for (const exp of rows) {
    const key = `${category(exp)}|${companyKey(exp.company)}`;
    groups.set(key, [...(groups.get(key) ?? []), exp]);
  }
  return Array.from(groups.values());
}

/** "1 year 4 months" → { months: 16, days: 0 } */
const parseLength = (s: string) => {
  const n = (re: RegExp) => +(s.match(re)?.[1] ?? 0);
  return { months: n(/(\d+)\s*(?:years?|yrs?)\b/i) * 12 + n(/(\d+)\s*(?:months?|mos?)\b/i), days: n(/(\d+)\s*days?\b/i) };
};

const formatMonths = (months: number, days: number) => {
  if (months === 0) return days ? `${days} ${days === 1 ? "day" : "days"}` : "";
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} ${y === 1 ? "year" : "years"}`, m && `${m} ${m === 1 ? "month" : "months"}`].filter(Boolean).join(" ");
};

/** "1 year 11 months" → "1Y 11M" */
const shortLength = (s: string) =>
  s.replace(/(\d+)\s*(years?|yrs?)/gi, "$1Y").replace(/(\d+)\s*(months?|mos?)/gi, "$1M").replace(/(\d+)\s*days?/gi, "$1D").toUpperCase();

type Trip = {
  lead: Experience; // most recent role
  first: Experience; // earliest role
  members: Experience[];
  title: string;
  leg: Leg; // whole span at the company, with summed time
};

function toTrip(members: Experience[]): Trip {
  const lead = members[0];
  const first = members.reduce((a, b) => (startValue(b.duration) < startValue(a.duration) ? b : a));
  const start = toLeg(first.duration);
  const end = toLeg(lead.duration);
  const total = members.map((e) => parseLength(toLeg(e.duration).length)).reduce((a, b) => ({ months: a.months + b.months, days: a.days + b.days }));
  const counts = new Map<string, number>();
  for (const e of members) counts.set(e.company, (counts.get(e.company) ?? 0) + 1);
  const title = [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
  return {
    lead,
    first,
    members,
    title,
    leg: {
      depart: start.depart,
      departLong: start.departLong,
      arrive: end.arrive,
      arriveLong: end.arriveLong,
      enRoute: end.enRoute,
      length: members.length === 1 ? end.length : formatMonths(total.months, total.days) || end.length,
    },
  };
}

const ALL_TRIPS = groupTrips(sortedExperiences).map(toTrip);

/* ─────────────────────────────────────────────────────────
   Route map: the globe flies between the places I've worked
   ───────────────────────────────────────────────────────── */

/** Where each role was based (first part of `location`). Entries without a specific city aren't mapped. */
const PLACES: Record<string, { city: string; lat: number; lon: number }> = {
  mumbai: { city: "Mumbai", lat: 19.076, lon: 72.8777 },
  thane: { city: "Thane", lat: 19.2183, lon: 72.9781 },
  airoli: { city: "Airoli", lat: 19.159, lon: 72.9986 },
  montreal: { city: "Montréal", lat: 45.5019, lon: -73.5674 },
};

/** Where a role's city isn't precise enough (both Montréal roles just say "Montreal"). */
const PLACE_BY_COMPANY: Record<string, { city: string; lat: number; lon: number }> = {
  Flexspring: { city: "Downtown Montréal", lat: 45.5017, lon: -73.5673 },
  "Air Canada": { city: "YUL Airport", lat: 45.4706, lon: -73.7408 }, // HQ at Montréal–Trudeau
};

const SHORT_NAMES: Record<string, string> = {
  "Reliance Industries Limited": "Reliance",
  "Willis Towers Watson": "WTW",
  "Homesfy Realty Pvt Ltd": "Homesfy",
};

/** Work roles oldest → newest, one stop per consecutive city. */
function buildRoute(rows: Experience[]): RouteStop[] {
  const work = rows.filter(isWork).sort((a, b) => startValue(a.duration) - startValue(b.duration));
  const stops: (RouteStop & { from: number; to: string })[] = [];
  for (const e of work) {
    const place = PLACE_BY_COMPANY[e.company] ?? PLACES[e.location.split(",")[0].trim().toLowerCase()];
    if (!place) continue; // e.g. "India" — no specific city to fly to
    const name = SHORT_NAMES[e.company] ?? e.company;
    const leg = toLeg(e.duration);
    const to = leg.enRoute ? "now" : `'${(leg.arriveLong.match(/\d{4}/)?.[0] ?? "").slice(2)}`;
    const last = stops[stops.length - 1];
    if (last && last.city === place.city) {
      if (!last.companies.includes(name)) last.companies.push(name);
      last.to = to;
    } else {
      stops.push({ code: place.city, ...place, companies: [name], years: "", from: Math.floor(startValue(e.duration) / 12) % 100, to });
    }
  }
  return stops.map(({ from, to, ...s }) => ({ ...s, years: `'${String(from).padStart(2, "0")}–${to}` }));
}

const ROUTE_STOPS = buildRoute(experiences);
const ROUTE_CLUSTERS = clusterStops(ROUTE_STOPS, { Mumbai: "Mumbai region", "Downtown Montréal": "Montréal" });
/** Any role id → the id of the trip (ticket) it belongs to. */
const TRIP_OF = new Map(ALL_TRIPS.flatMap((t) => t.members.map((m) => [m.id, t.lead.id] as const)));

function RoleDetails({ exp }: { exp: Experience }) {
  return (
    <>
      <p className="whitespace-pre-line text-sm leading-relaxed text-white/75">{exp.fullDescription ?? exp.description}</p>

      {exp.technologies && exp.technologies.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {exp.technologies.map((tech) => {
              const Icon = techIcons[tech];
              return (
                <span key={tech} className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/80">
                  {Icon && <Icon className="h-3 w-3" />}
                  {tech}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {exp.achievements && exp.achievements.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Highlights</p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {exp.achievements.map((a) => (
              <div key={a.label} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-linear-to-br ${a.color}`}>
                  <a.icon className="h-4 w-4 text-white" />
                </span>
                <div className="min-w-0">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{a.label}</p>
                  <p className="text-sm font-semibold text-white">{a.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {exp.links && exp.links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {exp.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => hapticManager.light()}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              {l.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ))}
        </div>
      )}
    </>
  );
}

function BoardingPass({
  trip,
  expanded,
  onToggle,
  reduceMotion,
}: {
  trip: Trip;
  expanded: boolean;
  onToggle: () => void;
  reduceMotion: boolean;
}) {
  const { lead: exp, leg, members, title } = trip;
  const meta = TYPE_META[exp.type];
  const flight = flightNumber(trip.first.duration);
  const code = airportCode(exp.location);
  const multi = members.length > 1;
  const logo = members.find((m) => m.logo)?.logo;

  // Border colour shared by the ticket edge and the notch arcs, so the outline follows the cut-outs.
  const edge = leg.enRoute ? "border-red-500/30 group-hover:border-red-500/50" : "border-white/10 group-hover:border-white/20";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-linear-to-br from-[#121212] to-[#050505] transition-shadow duration-300 ease-out md:flex-row ${
        leg.enRoute
          ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_48px_-24px_rgba(0,0,0,0.9),0_12px_40px_-16px_rgba(239,68,68,0.28)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_32px_64px_-24px_rgba(0,0,0,0.95),0_16px_48px_-16px_rgba(239,68,68,0.4)]"
          : "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_48px_-24px_rgba(0,0,0,0.9),0_12px_40px_-16px_rgba(255,255,255,0.07)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_32px_64px_-24px_rgba(0,0,0,0.95),0_16px_48px_-16px_rgba(255,255,255,0.12)]"
      }`}
    >
      {/* Soft light sheen from the top-left corner */}
      <span
        className={`pointer-events-none absolute inset-0 ${
          leg.enRoute
            ? "bg-[radial-gradient(120%_90%_at_0%_0%,rgba(239,68,68,0.10),transparent_55%)]"
            : "bg-[radial-gradient(120%_90%_at_0%_0%,rgba(255,255,255,0.03),transparent_55%)]"
        }`}
        aria-hidden="true"
      />
      {/* Hairline highlight along the top edge */}
      <span
        className={`pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent to-transparent ${
          leg.enRoute ? "via-red-400/50" : "via-white/25"
        }`}
        aria-hidden="true"
      />
      {/* Edge drawn as an overlay (not a CSS border) so the notches below can cut through it */}
      <span className={`pointer-events-none absolute inset-0 rounded-2xl border-2 transition-colors ${edge}`} aria-hidden="true" />

      {/* Main ticket */}
      <div className="relative min-w-0 flex-1 p-5 md:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className={`flex h-10 w-10 md:h-11 md:w-11 shrink-0 items-center justify-center overflow-hidden rounded-md ${logo ? "" : "bg-white/10"}`}>
              {logo ? (
                <Image src={logo} alt={`${title} logo`} width={44} height={44} className="h-full w-full object-contain" />
              ) : (
                <meta.Icon className="h-5 w-5 text-white/80" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Boarding pass</p>
              <h2 className="truncate text-base md:text-lg font-semibold text-white">{title}</h2>
            </div>
          </div>
          <span className="shrink-0 rounded-md border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/70">
            {meta.label}
          </span>
        </div>

        {/* Route + fields: stacked, side by side on wide screens */}
        <div className="xl:grid xl:grid-cols-2 xl:items-center xl:gap-10">
        {/* Route */}
        <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              <PlaneTakeoff className="h-3 w-3" /> Depart
            </p>
            <p className="mt-1 whitespace-nowrap font-mono text-xl sm:text-2xl md:text-4xl xl:text-3xl font-bold tracking-tight text-white">{leg.depart}</p>
            <p className="mt-0.5 truncate text-xs text-white/50">{leg.departLong}</p>
          </div>
          <div className="flex flex-col items-center gap-1 px-1">
            <span className="font-mono text-[10px] text-white/50 whitespace-nowrap">{leg.length}</span>
            <div className="relative flex w-16 sm:w-24 md:w-36 xl:w-20 items-center">
              <span className="h-px flex-1 border-t border-dashed border-white/25" />
              <motion.span
                className={leg.enRoute ? "text-red-400" : "text-white/70"}
                animate={leg.enRoute && !reduceMotion ? { x: [-6, 6, -6] } : undefined}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <AirlinerIcon className="h-5 w-5 rotate-90" />
              </motion.span>
              <span className="h-px flex-1 border-t border-dashed border-white/25" />
            </div>
            <span className="font-mono text-[10px] tracking-widest text-white/40">{code}</span>
          </div>
          <div className="min-w-0 text-right">
            <p className="flex items-center justify-end gap-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Arrive <PlaneLanding className="h-3 w-3" />
            </p>
            <p className={`mt-1 whitespace-nowrap font-mono text-xl sm:text-2xl md:text-4xl xl:text-3xl font-bold tracking-tight ${leg.enRoute ? "text-red-400" : "text-white"}`}>
              {leg.arrive}
            </p>
            <p className="mt-0.5 truncate text-xs text-white/50">{leg.arriveLong}</p>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 sm:grid-cols-4 xl:my-6 xl:border-l xl:border-t-0 xl:pl-10 xl:pt-0">
          {multi ? (
            <div className="col-span-2 min-w-0 sm:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Positions · {members.length}</p>
              <ol className="mt-1.5 space-y-1.5">
                {members.map((m) => {
                  const ml = toLeg(m.duration);
                  return (
                    <li key={m.id} className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="min-w-0 truncate text-white">
                        {m.role}
                        {m.company !== title && <span className="text-white/50"> · {m.company}</span>}
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-white/45">
                        {ml.depart} – {ml.arrive}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ) : (
            <Field label="Role" value={exp.role} className="col-span-2 xl:col-span-4" />
          )}
          <Field label="From" value={<span className="whitespace-nowrap">{code} <span className="text-white/50">· {cityName(exp.location)}</span></span>} className="xl:col-span-2" />
          <Field label="Gate" value={`${meta.gate}${sortedExperiences.indexOf(exp) + 1}`} />
        </div>
        </div>

        {/* Itinerary (expanded): description → skills → highlights → links */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              id={`itinerary-${exp.id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-5 border-t border-dashed border-white/15 pt-4">
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Itinerary</p>
                {multi ? (
                  <div className="space-y-6">
                    {members.map((m) => {
                      const ml = toLeg(m.duration);
                      return (
                        <section key={m.id}>
                          <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3">
                            <h3 className="text-sm font-semibold text-white">{m.role}</h3>
                            <span className="font-mono text-[11px] text-white/45">
                              {ml.departLong} – {ml.arriveLong}
                              {ml.length && ` · ${ml.length}`}
                            </span>
                          </div>
                          <RoleDetails exp={m} />
                        </section>
                      );
                    })}
                  </div>
                ) : (
                  <RoleDetails exp={exp} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Perforation with notches */}
      <div className="relative h-0 md:h-auto md:w-0" aria-hidden="true">
        <span className="absolute inset-x-5 -top-px h-0.5 bg-[radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1.5px)] bg-size-[8px_2px] md:inset-x-auto md:inset-y-5 md:-left-px md:h-auto md:w-0.5 md:bg-size-[2px_8px]" />
        <span className={`absolute left-0 -top-3 h-6 w-3 rounded-tr-full rounded-br-full border-2 border-l-0 bg-black transition-colors md:-left-3 md:top-0 md:h-3 md:w-6 md:rounded-tr-none md:rounded-bl-full md:border-l-2 md:border-t-0 ${edge}`} />
        <span className={`absolute right-0 -top-3 h-6 w-3 rounded-tl-full rounded-bl-full border-2 border-r-0 bg-black transition-colors md:right-auto md:-left-3 md:top-auto md:bottom-0 md:h-3 md:w-6 md:rounded-bl-none md:rounded-tr-full md:border-r-2 md:border-b-0 ${edge}`} />
      </div>

      {/* Stub */}
      <div className="relative flex shrink-0 items-center justify-between gap-4 p-5 md:w-56 md:flex-col md:items-stretch md:justify-between md:p-6">
        <div className="space-y-3">
          <Field label="Flight" value={<span className="font-mono text-lg md:text-2xl font-bold tracking-tight">{flight}</span>} />
          <StatusPill enRoute={leg.enRoute} />
        </div>
        <Barcode seed={`${exp.id}${exp.company}`} className="hidden w-28 opacity-70 sm:flex md:w-full" />
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={`itinerary-${exp.id}`}
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/15 px-3 py-2 font-mono text-[11px] uppercase tracking-widest text-white/80 transition-colors hover:border-white/40 hover:text-white"
        >
          Itinerary
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} />
        </button>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────────────────────
   Departures board
   ───────────────────────────────────────────────────────── */

/** Airport-style board listing every company worked for — the current one on top. */
function DeparturesBoard({
  legs,
  animate,
  onSelect,
}: {
  legs: Experience[];
  animate: boolean;
  onSelect: (id: string) => void;
}) {
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    const fmt = () =>
      new Intl.DateTimeFormat("en-CA", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/Toronto" }).format(new Date());
    const first = setTimeout(() => setClock(fmt()), 0);
    const t = setInterval(() => setClock(fmt()), 30_000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, []);

  const destinations = groupTrips(legs.filter(isWork)).map(toTrip);
  const cols = "lg:grid-cols-[5.5rem_5.5rem_1fr_8rem_4rem_7rem]";

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c] shadow-2xl shadow-black/60">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <AirlinerIcon className="h-4 w-4 rotate-45 text-amber-300" />
          <span className="font-mono text-xs md:text-sm font-semibold tracking-[0.3em] text-amber-300">DEPARTURES</span>
        </div>
        <span className="font-mono text-xs tracking-widest text-white/50">YUL {clock ?? "--:--"}</span>
      </div>

      <div className={`hidden gap-3 px-6 pt-3 font-mono text-[10px] tracking-[0.2em] text-white/35 lg:grid ${cols}`}>
        <span>DEPART</span>
        <span>FLIGHT</span>
        <span>DESTINATION</span>
        <span>DURATION</span>
        <span>GATE</span>
        <span className="text-right">STATUS</span>
      </div>

      <ul className="divide-y divide-white/5 px-2 py-2 md:px-3">
        {destinations.map((trip, i) => (
          <li key={trip.lead.id}>
            <button
              type="button"
              onClick={() => onSelect(trip.lead.id)}
              className={`grid w-full grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-white/[0.04] md:px-3 ${cols}`}
            >
              <span className="hidden font-mono text-sm text-white/70 lg:block">{trip.leg.depart}</span>
              <span className="hidden font-mono text-sm font-semibold text-white lg:block">{flightNumber(trip.first.duration)}</span>
              <span className="min-w-0 overflow-hidden">
                <SplitFlap text={boardName(trip.lead.company)} delay={i * 0.08} animate={animate} />
              </span>
              <span className="hidden font-mono text-sm text-white/70 lg:block">{trip.leg.enRoute ? "—" : shortLength(trip.leg.length)}</span>
              <span className="hidden font-mono text-sm text-white/70 lg:block">
                {TYPE_META[trip.lead.type].gate}
                {sortedExperiences.indexOf(trip.lead) + 1}
              </span>
              <span className="text-right">
                <StatusPill enRoute={trip.leg.enRoute} />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────── */

type FilterType = "all" | "work" | "education" | "volunteering";

const FILTERS: { id: FilterType; label: string; match: (e: Experience) => boolean }[] = [
  { id: "all", label: "All flights", match: () => true },
  { id: "work", label: "Work", match: (e) => e.type === "full-time" || e.type === "internship" },
  { id: "education", label: "Education", match: (e) => e.type === "education" },
  { id: "volunteering", label: "Volunteer", match: (e) => e.type === "volunteering" },
];

export default function ExperiencePage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [passed, setPassed] = useState<string[]>([]);
  const reduceMotion = useReducedMotion() ?? false;
  const timelineRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const [headingUp, setHeadingUp] = useState(false);

  const activeFilter = FILTERS.find((f) => f.id === filter)!;
  const trips = groupTrips(sortedExperiences.filter(activeFilter.match)).map(toTrip);

  // Plane position along the route follows the viewport centre
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = timelineRef.current;
      if (!el) return;
      // Plane tracks the viewport centre, but the route must finish by the time the page can't scroll any further
      // (the last ticket's bottom never reaches the centre of the screen).
      const rect = el.getBoundingClientRect();
      const y = window.scrollY;
      // Plane faces the way you're scrolling (small threshold avoids jitter)
      const dy = y - lastScrollY.current;
      if (Math.abs(dy) > 3) {
        setHeadingUp(dy < 0);
        lastScrollY.current = y;
      }
      const half = window.innerHeight * 0.5;
      const top = rect.top + y;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const start = top - half;
      const end = Math.max(start + 1, Math.min(top + rect.height - half, maxScroll));
      const p = Math.min(1, Math.max(0, (y - start) / (end - start)));
      setProgress(p);
      // Stops the plane has reached turn solid red
      const planeY = rect.top + p * rect.height;
      const ids = Array.from(el.querySelectorAll<HTMLElement>("[data-stop]"))
        .filter((d) => {
          const r = d.getBoundingClientRect();
          return r.top + r.height / 2 <= planeY + 1;
        })
        .map((d) => d.dataset.stop ?? "");
      setPassed((prev) => (prev.length === ids.length && prev.every((v, i) => v === ids[i]) ? prev : ids));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [filter]);

  const selectLeg = (id: string) => {
    hapticManager.light();
    const target = sortedExperiences.find((e) => e.id === id);
    if (target && !activeFilter.match(target)) setFilter("all");
    const tripId = TRIP_OF.get(id) ?? id;
    setExpandedId(tripId);
    requestAnimationFrame(() =>
      document.getElementById(`leg-${tripId}`)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
    );
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background: faint grid + red horizon glow */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.35) 0%, transparent 70%)", filter: "blur(90px)" }}
        />
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="exp-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#exp-grid)" />
          </svg>
        </div>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 md:mt-12 md:px-8 md:pt-12 lg:mt-0 lg:pt-20"
      >
        {/* Route map (three.js) + header and intro: fills the first screen so the whole globe shows on landing */}
        <ExperienceRouteSection stops={ROUTE_STOPS} clusters={ROUTE_CLUSTERS}>
          <motion.p variants={staggerItem} className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-red-400">
            <AirlinerIcon className="h-3.5 w-3.5 rotate-90" /> FLIGHT LOG
          </motion.p>
          <motion.h1 variants={staggerItem} className="mb-5 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Experience
          </motion.h1>
          <motion.section variants={staggerItem} className="space-y-3 text-justify text-[12px] leading-relaxed text-white/75 hyphens-auto md:text-[14px]">
            <p>
              I&apos;m a Full Stack Developer at <span className="text-white">Air Canada</span> in Montréal. Before that I
              spent two years at Flexspring, starting as an intern and moving into a full-time role, after building
              enterprise healthcare software at CitiusTech and full-stack applications at Willis Towers Watson in Mumbai.
            </p>
            <p>
              Outside of work I&apos;m an Advisor at <span className="text-white">HackConcordia</span>, where I previously
              led technology as VP and Director, and I studied my Master of Applied Computer Science at Concordia
              University.
            </p>
          </motion.section>

        </ExperienceRouteSection>

        {/* Departures board */}
        <motion.div variants={staggerItem} className="mb-10">
          <DeparturesBoard legs={sortedExperiences} animate={!reduceMotion} onSelect={selectLeg} />
        </motion.div>

        {/* Filters */}
        <motion.div variants={staggerItem} className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter experience">
          {FILTERS.map((f) => {
            const count = sortedExperiences.filter(f.match).length;
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  hapticManager.light();
                  setFilter(f.id);
                }}
                className={`rounded-md border px-3 py-2 font-mono text-[11px] uppercase tracking-widest transition-colors md:px-4 ${
                  active ? "border-white bg-white text-black" : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                }`}
              >
                {f.label} <span className={active ? "text-black/50" : "text-white/40"}>{count}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Route timeline */}
        <div ref={timelineRef} className="relative">
          <span className="absolute bottom-0 left-3 top-0 border-l-2 border-dashed border-white/15 md:left-5" aria-hidden="true" />
          <span
            className="absolute left-3 top-0 w-0.5 bg-linear-to-b from-red-500/0 via-red-500/70 to-red-400 md:left-5"
            // Flying back, the nose points into the trail — stop the trail just short of it so the tip stays visible
            style={{ height: headingUp ? `max(0px, calc(${progress * 100}% - 16px))` : `${progress * 100}%` }}
            aria-hidden="true"
          />
          <span
            className="absolute left-3 z-10 -translate-x-1/2 -translate-y-1/2 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)] md:left-5"
            style={{ top: `${progress * 100}%`, marginLeft: 1 }}
            aria-hidden="true"
          >
            <AirlinerIcon
              className={`h-6 w-6 transition-transform ease-in-out ${reduceMotion ? "duration-0" : "duration-500"} ${
                headingUp ? "rotate-0" : "rotate-180"
              }`}
            />
          </span>

          {trips.map((trip, i) => (
            <motion.div
              key={trip.lead.id}
              id={`leg-${trip.lead.id}`}
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative mb-8 scroll-mt-28 pl-9 md:mb-10 md:pl-14"
            >
              <span
                data-stop={trip.lead.id}
                className={`absolute left-3 top-8 h-3 w-3 -translate-x-1/2 rounded-full border-2 transition-colors duration-300 md:left-5 ${
                  passed.includes(trip.lead.id)
                    ? "border-red-500 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                    : trip.leg.enRoute
                      ? "border-red-400 bg-black"
                      : "border-white/70 bg-black"
                }`}
                style={{ marginLeft: 1 }}
                aria-hidden="true"
              />
              <BoardingPass
                trip={trip}
                expanded={expandedId === trip.lead.id}
                onToggle={() => {
                  hapticManager.light();
                  setExpandedId(expandedId === trip.lead.id ? null : trip.lead.id);
                }}
                reduceMotion={reduceMotion}
              />
              {i === trips.length - 1 && <span className="sr-only">End of flight log</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
