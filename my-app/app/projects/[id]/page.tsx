"use client";

import { motion, AnimatePresence, useInView, useMotionValue, useTransform, animate, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { navigateWithTransition, projectHeroName, heroTransitionProps, isViewTransitionActive } from "@/lib/view-transition";
import {
  ExternalLink,
  Github,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  X,
  Gauge as Gauge2,
  ChevronDown,
  Maximize2,
} from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { useCallback, useEffect, use, useRef, useState } from "react";

interface Project {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  image: string;
  technologies: string[];
  category?: string;
  date?: string;
  liveUrl?: string;
  githubUrl?: string;
  otherLinks?: { label: string; url: string }[];
  features?: string[];
  additionalImages?: string[];
  /** Hidden from the portfolio (kept here so it can be brought back) */
  hidden?: boolean;
}

const projects: Record<string, Project> = {
  "flight-deck-theme": {
    id: "flight-deck-theme",
    name: "Air Canada Flight Deck",
    description: "A fan-made VS Code extension that turns your editor into a flight deck",
    fullDescription:
      "Air Canada Flight Deck is an independent, fan-made Visual Studio Code extension (not affiliated with or endorsed by Air Canada). It ships three colour themes in the 2017 livery and aviation-themed file icons, plus a Flight Deck panel in the activity bar. Focus sessions are framed as flights: pick a departure and arrival airport and a block length, and the plane flies the arc as the timer runs down. A per-workspace Flight Plan keeps a to-do list, and the Meetings panel delivers reminders five minutes before a meeting with an incoming card, a VS Code notification, and an airliner that tows the meeting across a night sky beside the editor. There is no calendar sync or sign-in, and nothing leaves your machine.",
    image: "/imgs/projects/flightdeck-hero.png",
    technologies: ["VS Code Extension API", "TypeScript", "Webviews", "Colour Themes", "File Icon Themes"],
    category: "Developer Tools",
    date: "November 2026",
    githubUrl: "https://github.com/MHUZAIFA/aircanada_vscode_theme",
    otherLinks: [
      { label: "VS Code Marketplace", url: "https://marketplace.visualstudio.com/items?itemName=MHuzaifa.air-canada-flight-deck-theme" },
    ],
    features: [
      "Three Colour Themes: Editor themes inspired by the 2017 livery.",
      "Aviation File Icons: A custom file icon theme with aviation-inspired icons.",
      "Focus Timer as a Flight: Choose departure and arrival airports and a 25, 50, 90 minute or custom block; the plane flies the route as time runs down, with distance flown, ETA, extend, pause and cancel.",
      "Status Bar Tracker: Your flight follows you in the status bar of every open VS Code window, with quick actions on hover.",
      "Flight Plan: A per-workspace to-do list kept in VS Code storage, never in your repository.",
      "Meetings by Plane: Meeting reminders with Join, Snooze and Dismiss, a notification, and an animated fly-by five minutes before start.",
      "Private by Design: No calendar sync, no sign-in, and nothing leaves your machine.",
    ],
    additionalImages: [
      "/imgs/projects/flightdeck-workspace.png",
      "/imgs/projects/flightdeck-panel-dark.png",
      "/imgs/projects/flightdeck-panel-light.png",
      "/imgs/projects/flightdeck-hero.png",
      "/imgs/projects/flightdeck-gate-card.png",
      "/imgs/projects/flightdeck-flight-plan.png",
    ],
  },
  "git101-hackdecouverte": {
    id: "git101-hackdecouverte",
    name: "Git 101 · HackDécouverte 2026",
    description: "A bilingual beginner workshop on Git, GitHub and VS Code",
    fullDescription:
      "Git 101 is a bilingual (English/French) workshop deck built for HackDécouverte 2026 participants at Concordia University. Across 20 slides it takes complete beginners from installing VS Code and Git, through creating a GitHub account and repository and inviting teammates, all the way to opening and merging their first pull request.",
    image: "/imgs/projects/git101-og.jpg",
    technologies: ["HTML", "CSS", "JavaScript", "Git", "GitHub", "VS Code"],
    category: "Education & Workshops",
    date: "November 2026",
    liveUrl: "https://git101-hackdecouverte2026.vercel.app/",
    githubUrl: "https://github.com/MHUZAIFA/git101_hackdecouverte_2026",
    features: [
      "Bilingual: Every slide is presented in both English and French.",
      "Zero to Pull Request: 20 slides covering VS Code, Git, GitHub accounts, repositories, collaboration and pull requests.",
      "Beginner-Friendly: Written for hackathon participants using Git for the first time.",
      "Web-Based Deck: Runs in the browser with no install, so participants can follow along on their own laptops.",
    ],
    additionalImages: [
      "/imgs/projects/git101-og.jpg",
      "/imgs/projects/git101-screenshot.jpg",
    ],
  },
  "nlmeans-denoising": {
    id: "nlmeans-denoising",
    name: "Non-Local Means Image Denoising",
    description: "Python implementation and evaluation of the NL-means denoising algorithm",
    fullDescription:
      "Course project for COMP 6771 Image Processing at Concordia University, built with Masoumeh Farokhpour. It implements the Non-Local Means algorithm from \"A non-local algorithm for image denoising\" (Buades, Coll & Morel, CVPR 2005), which exploits the self-similarity of natural images by averaging pixels weighted by the similarity of their surrounding patches. The project runs six experiments comparing NL-means against Gaussian, anisotropic diffusion (Perona-Malik), total variation (ROF) and Yaroslavsky neighborhood filters. On the Lena image with Gaussian noise (sigma = 20), NL-means reached 31.28 dB PSNR and 0.8006 SSIM, the best of all methods tested.",
    image: "/imgs/projects/nlmeans-high-noise.jpg",
    technologies: ["Python", "NumPy", "Image Processing", "Computer Vision", "PSNR / SSIM"],
    category: "Image Processing",
    date: "April 2026",
    githubUrl: "https://github.com/MHUZAIFA/COMP-6771-image-processing",
    features: [
      "NL-means Implementation: 7x7 similarity patches, 21x21 search window and a noise-adaptive filtering parameter.",
      "Method Comparison: Benchmarked against Gaussian, anisotropic diffusion, total variation and neighborhood filters.",
      "Method Noise Analysis: Visualizes what each filter removes from the image.",
      "Parameter Study: Tests sensitivity to the filtering parameter, patch size and window size.",
      "Noise Level Study: Measures performance across noise levels from sigma = 10 to 50.",
      "Best-in-Test Results: 31.28 dB PSNR and 0.8006 SSIM at sigma = 20, ahead of every baseline.",
    ],
    additionalImages: [
      "/imgs/projects/nlmeans-high-noise.jpg",
      "/imgs/projects/nlmeans-comparison.jpg",
      "/imgs/projects/nlmeans-parameters.png",
    ],
  },
  "pure-black-theme": {
    id: "pure-black-theme",
    name: "Pure Black Theme",
    description: "A borderless, pure black colour theme for Visual Studio Code",
    fullDescription:
      "MHuzaifa Pure Black Theme is a sleek, minimalist dark theme for Visual Studio Code, published on the Visual Studio Marketplace. It gives every panel and editor a pure black background with no borders, for a clean, distraction-free coding environment.",
    image: "/imgs/projects/pureblack.png",
    technologies: ["VS Code Extension", "Colour Theme", "JSON"],
    category: "Developer Tools",
    date: "April 2026",
    githubUrl: "https://github.com/MHUZAIFA/pure-black-theme",
    otherLinks: [
      { label: "VS Code Marketplace", url: "https://marketplace.visualstudio.com/items?itemName=MHuzaifa.mhuzaifa-pure-black-theme" },
    ],
    features: [
      "Pure Black Background: Complete black interface across all panels and editors.",
      "High Contrast: White text on black for optimal readability.",
      "Borderless Design: Transparent borders and outlines for a seamless look.",
      "Syntax Highlighting: A carefully chosen palette across programming languages.",
      "Minimal UI: Less visual clutter for focused coding sessions.",
    ],
    additionalImages: [
      "/imgs/projects/pureblack.png",
      "/imgs/projects/pureblack-icon.png",
    ],
  },
  "bpmn-studio": {
    id: "bpmn-studio",
    name: "BPMN Studio",
    description: "AI-powered tool that converts natural language prompts into BPMN diagrams",
    fullDescription:
      "BPMN Studio lets teams design, version and deploy BPMN 2.0 processes from plain language. An LLM served through the Groq API generates valid BPMN XML from a prompt, which users refine in a bpmn-js modeler. Processes get git-like branching and merging, a full version history, and a structural diff that shows added, removed and modified elements between versions. The app is multi-tenant with organization-scoped data, role-based access control (Owner, Admin, Editor, Viewer) enforced on the backend, AES-256-CBC encryption of all stored BPMN XML, audit logging, per-user and per-organization rate limits, and one-click deployment to the Flowable process engine.",
    image: "/imgs/projects/bpmn-studio.jpg",
    technologies: ["Next.js 15", "TypeScript", "Tailwind CSS", "Zustand", "bpmn-js", "MongoDB", "Mongoose", "JWT", "Groq API", "LLaMA", "Flowable", "Docker"],
    category: "AI & Automation",
    date: "March 2026",
    liveUrl: "https://bpmn-studio.vercel.app",
    githubUrl: "https://github.com/MHUZAIFA/bpmn-studio",
    features: [
      "AI BPMN Generation: Generates valid BPMN 2.0 XML from natural language prompts.",
      "Git-Like Branching: Create, switch and merge branches per process.",
      "Version Control & Diff: Full version history with structural comparison between versions.",
      "Multi-Tenant RBAC: Organization-scoped data with Owner, Admin, Editor and Viewer roles enforced on the backend.",
      "Encrypted Storage: AES-256-CBC encryption for all BPMN XML.",
      "Flowable Deployment: One-click deployment to the Flowable process engine.",
      "Audit Logging & Rate Limiting: Every action logged with context, with per-user and per-organization limits.",
    ],
  },
  doable: {
    hidden: true,
    id: "doable",
    name: "Doable",
    description: "AI-powered app that builds personalized activity itineraries",
    fullDescription:
      "Doable is an AI-powered app that builds personalized, activity-based itineraries using your location, weather, schedule, budget and transport mode. Just say what you're in the mood for (indoor, outdoor, food, or chill) and get real-time plans tailored to your vibe, along with nearby activities, restaurants and experiences.",
    image: "/imgs/projects/doable-banner.jpg",
    technologies: ["Next.js", "TypeScript", "React", "Tailwind CSS", "Radix UI", "AI"],
    category: "Lifestyle & Discovery",
    date: "April 2025",
    githubUrl: "https://github.com/MHUZAIFA/Doable",
    features: [
      "Personalized Itineraries: Plans built from your location, weather, schedule, budget and transport mode.",
      "Mood-Based Planning: Choose indoor, outdoor, food or chill and get matching suggestions.",
      "Nearby Discovery: Find activities, restaurants and experiences near you.",
      "Accounts & Settings: Sign-up, login, a dashboard and user preferences.",
    ],
    additionalImages: [
      "/imgs/projects/doable-banner.jpg",
      "/imgs/projects/doable-logo.png",
    ],
  },
  "ai-bots": {
    id: "ai-bots",
    name: "AI_Bots",
    description: "Applied AI project featuring comparative analysis of ML models and CNN-based image classification",
    fullDescription:
      "AI_Bots is a comprehensive Applied AI project (COMP-6721) developed by Team AI_Bots. This project consists of two main phases: Phase 1 focuses on a detailed comparative analysis of classical machine learning models (SVM, Decision Trees, and Random Forests) on benchmark datasets, including data preprocessing, hyperparameter tuning, and comprehensive evaluation across multiple metrics. Phase 2 involves the development and training of a custom Convolutional Neural Network (CNN) on the MNIST dataset, focusing on model design, training pipelines, and performance evaluation with visualizations including accuracy and loss curves. The project demonstrates expertise in both classical machine learning and deep learning approaches, with detailed Jupyter notebooks, comprehensive reports, and well-documented code.",
    image: "/imgs/projects/ai.png",
    technologies: ["Python", "Machine Learning", "Deep Learning", "CNN", "SVM", "Decision Trees", "Random Forests", "TensorFlow", "PyTorch", "scikit-learn", "Jupyter Notebook"],
    category: "Machine Learning & AI",
    date: "May 29, 2025 - Jun 22, 2025",
    githubUrl: "https://github.com/MHUZAIFA/COMP-6721-Applied-AI",
    features: [
      "Phase 1 - Comparative Analysis: Detailed evaluation of SVM, Decision Trees, and Random Forests on benchmark datasets with comprehensive metrics including accuracy, precision, and recall.",
      "Data Preprocessing: Advanced data preprocessing techniques including feature engineering, normalization, and handling missing values for optimal model performance.",
      "Hyperparameter Tuning: Systematic hyperparameter optimization to achieve best model performance across different algorithms.",
      "Phase 2 - CNN Image Classification: Development and training of a custom Convolutional Neural Network on the MNIST dataset for handwritten digit recognition.",
      "Model Design: Custom CNN architecture design with proper layer configurations, activation functions, and optimization strategies.",
      "Performance Visualization: Comprehensive visualizations including accuracy/loss curves, confusion matrices, and performance metrics for model evaluation.",
      "Jupyter Notebooks: Well-documented Jupyter notebooks with detailed explanations, code comments, and step-by-step analysis for both phases.",
      "Team Collaboration: Collaborative project with clear task distribution and contributions from team members Shurrab Mohammed, Oleksandr Yasinovskyy, and Huzaifa Mohammed.",
      "Comprehensive Reports: Detailed project reports (PDF) documenting methodology, results, analysis, and future work ideas for both phases.",
      "Future Work Extensions: Proposed extensions including XGBoost integration, SVM with RBF kernels, deeper CNN architectures, and data augmentation techniques.",
    ],
  },
  "ai-report-workflow": {
    id: "ai-report-workflow",
    name: "AI-Driven Report Generation Workflow",
    description: "An automated reporting system built using n8n that generates reports using natural language prompts",
    fullDescription:
      "The AI-Driven Report Generation Workflow is an automated reporting system built using n8n that allows users to generate reports using natural language prompts. Users can request reports on demand, preview the generated content, and send finalized reports via email. The workflow securely retrieves data from external APIs using Bearer token authentication and query parameters. The collected data is processed, analyzed, and summarized using AI to produce clear and structured reports. This solution reduces manual reporting effort while giving users full control over report generation and delivery.",
    image: "/imgs/projects/n8nReportWithAI.png",
    technologies: ["n8n", "Automation", "AI Prompt Processing", "REST APIs", "Bearer Token Authentication", "Query Parameters", "Workflow Orchestration", "Email Services", "Webhook Triggers"],
    category: "Automation / Reporting",
    date: "December 2024",
    githubUrl: "https://github.com/example/ai-report-workflow",
    features: [
      "Prompt-Based Report Generation: Users can generate reports by providing natural language prompts, making report creation intuitive and accessible.",
      "Secure API Data Retrieval: Fetches data from external APIs using Bearer token authentication and query parameters, ensuring secure and flexible data access.",
      "Data Processing: Processes and aggregates API responses before report creation, ensuring clean and organized data for analysis.",
      "AI-Powered Summarization: Uses AI to convert raw data into readable and meaningful reports, transforming complex data into actionable insights.",
      "Report Preview: Allows users to preview generated reports before sending them, ensuring quality and accuracy before delivery.",
      "User Approval Flow: Reports are only sent after user confirmation, giving users full control over the report generation and delivery process.",
      "Email Delivery: Sends finalized reports automatically via email, streamlining the distribution process and ensuring timely delivery.",
      "On-Demand Execution: Reports can be generated anytime through user input, providing flexibility and immediate access to insights.",
      "Error Handling: Handles API failures, invalid tokens, and missing parameters gracefully, ensuring robust and reliable operation.",
      "Scalable Design: Easily extendable to support additional APIs and report formats, allowing for future growth and customization.",
    ],
    additionalImages: [
      "/imgs/projects/n8nlogo.png",
      "/imgs/projects/n8nReportWithAI.png",
      "/imgs/projects/n8nReport.png"
    ],
  },
  metricstics: {
    id: "metricstics",
    name: "Metricstics",
    description: "Your Statistical Calculator - A Python-based statistical calculator with a sleek Tkinter GUI",
    fullDescription:
      "Welcome to METRICSTICS, a Python-based statistical calculator with a sleek Tkinter GUI. METRICSTICS not only computes standard statistical measures but also provides an intuitive interface for loading and storing session information. It features a beautiful dark theme, ensuring a pleasant user experience. METRICSTICS helps in calculating descriptive statistics. The purpose of descriptive statistics is to quantitatively describe a collection of data by measures of central tendency, measures of frequency, and measures of variability. The system calculates essential statistical values including minimum (m), maximum (M), mode (o), median (d), mean (μ), Mean Absolute Deviation (MAD), and Standard Deviation (σ).",
    image: "/imgs/projects/metricsticsBg.png",
    technologies: ["Python", "Tkinter", "Statistics", "Data Analysis", "MVC Pattern", "GUI"],
    category: "Productivity & Utilities",
    date: "November 2023",
    // liveUrl: "https://example.com",
    githubUrl: "https://github.com/MHUZAIFA/METRICSTICS",
    features: [
      "Calculate statistics: Calculate essential statistical measures including min, max, mean, median, mode, MAD, and standard deviation.",
      "User-friendly GUI: Built with Tkinter providing an intuitive and modern interface for statistical calculations.",
      "Sleek dark theme: Features a beautiful dark theme for a modern and comfortable user experience.",
      "Multiple input methods: Input data through keyboard, file upload, or the interactive randomizer button.",
      "Session management: Convenient store and load functionality for your statistical sessions effortlessly.",
      "MVC design pattern: Follows the Model-View-Controller design pattern for a clean and modular code structure.",
    ],
    additionalImages: [
      "/imgs/projects/metricsticsBg.png",
      "/imgs/projects/metricstics.png"
    ],
  },
  mytasks: {
    id: "mytasks",
    name: "MyTasks",
    description: "A user-friendly cross-platform to-do application for efficiently managing and tracking day-to-day activities",
    fullDescription:
      "MyTasks is a user-friendly to-do application designed to efficiently manage and track day-to-day activities. Whether you're on your smartphone, tablet, or computer, MyTasks provides a seamless experience with its cross-platform, cloud-based progressive web application. Built with Angular and Firebase, MyTasks offers a modern, intuitive interface for effortless task management. As a progressive web application, MyTasks doesn't require installation from an app store - simply visit the web app on your preferred browser to get started.",
    image: "/imgs/projects/todobg.png",
    technologies: ["Angular", "PWA", "Cross Platform", "Cloud-Based", "Firebase", "TypeScript", "Progressive Web App"],
    category: "Productivity & Tracking",
    date: "December 2022",
    liveUrl: "https://ha-todo.web.app",
    githubUrl: "https://github.com/MHUZAIFA/MyTasks",
    features: [
      "Cross-Platform Compatibility: Access MyTasks from any device - smartphone, tablet, or computer for a seamless experience across all your devices.",
      "Cloud-Based Storage: Store your tasks securely in the cloud for easy access and synchronization across all your devices in real-time.",
      "Intuitive Interface: User-friendly design with a clean and modern interface for effortless task management and navigation.",
      "Task Organization: Categorize tasks, set priorities, and track progress easily with powerful organizational features.",
      "Progressive Web App: No installation required - access MyTasks directly from your web browser with app-like functionality.",
      "Offline Support: Continue managing your tasks even when offline, with automatic synchronization when connection is restored.",
      "Real-Time Synchronization: Changes sync instantly across all your devices, ensuring your task list is always up to date.",
    ],
    additionalImages: [
      "/imgs/projects/todobg.png",
      "/imgs/projects/todomb.png",
      "/imgs/projects/todo.png"
    ],
  },
  snkrs: {
    id: "snkrs",
    name: "SNKRS",
    description: "An online e-commerce web application for browsing and buying sneakers",
    fullDescription:
      "SNKRS is an online e-commerce web application for browsing and buying sneakers. A cross platform progressive e-commerce web application for purchasing sneakers. Users can view, search and filter from a wide range of sneakers to find the sneaker of their choice. LoggedIn users can review, wishlist, buy and track their orders. From browsing to checkout this application delivers the best in class user experience.",
    image: "/imgs/projects/snkrsbg.png",
    technologies: ["E-Commerce", "PWA", "Cross Platform", "Shopping Cart", "Order Tracking", "User Authentication", "Responsive Design"],
    category: "E-Commerce",
    date: "May 2022",
    liveUrl: "https://mhuzaifa.github.io/snkrs/",
    githubUrl: "https://github.com/MHUZAIFA/snkrs",
    additionalImages: [
      "/imgs/projects/snkrsbg.png",
      "/imgs/projects/snkrsmb.png",
      "/imgs/projects/snkrs.png"
    ],
    features: [
      "Cross-Platform: Progressive web application (PWA) accessible across devices.",
      "Browsing and Shopping: Users can browse a diverse catalog of sneakers.",
      "Search and Filtering: Enables users to search for specific sneakers and apply filters.",
      "User Authentication: Secure login and registration functionality.",
      "User Interaction: Logged-in users can add reviews, wishlist items, purchase sneakers, and track their orders.",
      "Checkout Process: Smooth and intuitive checkout experience for completing purchases.",
      "Responsive Design: Ensures usability and functionality across various screen sizes.",
      "Performance: Optimized for speed and efficiency, providing a seamless user experience.",
      "Accessibility: Designed to be accessible to users with disabilities.",
      "Security: Implements best practices to safeguard user data and transactions.",
    ],
  },
  helpdesk: {
    hidden: true,
    id: "helpdesk",
    name: "Helpdesk",
    description: "A web application for requesting for an asset or raising an issue",
    fullDescription:
      "Helpdesk is a cross platform cloud-based progressive web application for fullfilling user requests and resolving issues raised by an user. It allows users to manage their requests/issues from a laptop, tablet and computer.",
    image: "/imgs/projects/crm.png",
    technologies: ["PWA", "Support", "Cloud-Based", "Issue Tracking", "Request Management"],
    category: "Support",
    date: "Feb 2022",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/helpdesk",
  },
  recyclevision: {
    id: "recyclevision",
    name: "RecycleVision",
    description: "A mobile application that simplifies waste sorting using ML/AI-powered object detection and classification",
    fullDescription:
      "RecycleVision is an application developed as part of the SOEN 6751 HCI course. This mobile application simplifies the process of waste sorting by leveraging machine learning and artificial intelligence technologies. The application integrates with the Hugging Face API to provide advanced object detection and classification capabilities, allowing users to identify different types of waste materials accurately. By combining ML/AI-powered image recognition with visual cues and gamification, RecycleVision engages users and increases their confidence in waste disposal practices. The application uses computer vision models from Hugging Face to detect and classify waste objects in real-time, providing instant feedback and guidance on proper waste sorting, thereby reducing confusion and increasing accuracy in waste disposal.",
    image: "/imgs/projects/RecycleVision.png",
    technologies: ["Mobile", "Machine Learning", "Artificial Intelligence", "Hugging Face API", "Object Detection", "Image Classification", "Computer Vision", "HCI", "Gamification", "React Native"],
    category: "Mobile Application",
    date: "Feb 18, 2024 - May 1, 2024",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com/example/recyclevision",
    features: [
      "ML/AI-Powered Object Detection: Leverages Hugging Face API's advanced machine learning models to detect waste objects in real-time from camera input, providing accurate identification of different waste materials.",
      "Intelligent Waste Classification: Uses AI classification models to categorize detected waste into appropriate recycling categories (recyclable, compostable, hazardous, etc.) with high accuracy.",
      "Hugging Face API Integration: Seamlessly integrates with Hugging Face's pre-trained computer vision models for robust and reliable object detection and classification without requiring local model training.",
      "Real-Time Image Processing: Processes camera images instantly to provide immediate feedback on waste classification, enabling users to make quick sorting decisions.",
      "Visual Cues for Waste Sorting: The application uses visual cues to enhance user confidence and engagement in waste-sorting practices. This feature helps users to identify and sort waste correctly.",
      "Emotional Satisfaction: The application is designed to impact the user's emotional response positively. It provides satisfaction to users by enabling them to dispose of waste effectively and correctly.",
      "Gamification of Waste Sorting: The application incorporates gamification elements to encourage habitual correct waste sorting. This feature makes the waste sorting process more engaging and fun for users.",
      "Environmental Awareness: The application aims to increase user's environmental awareness. It tracks the user's waste sorting practices before and after using the application, providing insights into their contribution to broader environmental practices.",
      "Confidence Building: By providing accurate AI-powered classifications, the application builds user confidence in waste sorting decisions, reducing uncertainty and improving sorting accuracy.",
    ],
  },
};

/** Visible projects in order, for previous / next (hidden ones are skipped). */
const PROJECT_ORDER = Object.keys(projects).filter((key) => !projects[key].hidden);

/** Placeholder URLs that should never be rendered as real links. */
const isRealUrl = (url?: string) => !!url && !/example\.com/i.test(url);

/** "Title: description" → { title, description } */
function splitFeature(feature: string) {
  const i = feature.indexOf(": ");
  return i === -1 ? { title: "", description: feature } : { title: feature.slice(0, i), description: feature.slice(i + 2) };
}

/* ─────────────────────────────────────────────────────────
   Cockpit primitives
   ───────────────────────────────────────────────────────── */

/** Engraved label plate. */
function Placard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={`inline-block rounded-sm border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50 ${className}`}
    >
      {children}
    </p>
  );
}

/** iOS-style dark material: smoky translucent black, heavy blur, boosted saturation, hairline edge. */
const GLASS_SURFACE =
  "border border-white/10 bg-[rgba(22,22,24,0.55)] backdrop-blur-2xl backdrop-saturate-[1.8] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.12),0_24px_48px_-24px_rgba(0,0,0,0.9)]";
const GLASS = `rounded-2xl ${GLASS_SURFACE}`;
const THIN_SCROLL = "[scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.2)_transparent]";

/** Smooth open/close for accordions: height eases out, opacity follows slightly faster. */
const ACCORDION_TRANSITION = {
  height: { duration: 0.4, ease: [0.25, 1, 0.5, 1] as const },
  opacity: { duration: 0.25, ease: "easeOut" as const },
};

/* ── Arrival choreography ─────────────────────────────────────────────── */

const HUD_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Each HUD piece rises in and comes into focus. The filter is cleared to `none` at the end: any
 * leftover filter (even blur(0)) would stop the glass panels inside from blurring the image behind.
 */
const HUD_ITEM = {
  initial: { opacity: 0, y: 18, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.65, ease: HUD_EASE },
    transitionEnd: { filter: "none" },
  },
  // Leaving (reverse of arrival): sink and blur out
  exit: {
    opacity: 0,
    y: 14,
    filter: "blur(6px)",
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] as const },
  },
} satisfies Variants;

/*
 * Leaving timeline (reverse of arrival), in seconds:
 *   0.00  HUD pieces leave one after another, last one first
 *   0.22  iris opens back out, gradients lift, brackets fly away
 *   0.55  image collapses back into its bay (the view transition)
 */
const EXIT_HUD_STAGGER = 0.035;
const EXIT_OVERLAY_AT = 0.22;
const EXIT_NAVIGATE_AT = 0.55;

/**
 * Iris vignette: a perfect circle of darkness that starts beyond the screen corners and closes in
 * towards the centre, settling as a vignette around the image.
 */
function RadialOverlay({
  delay,
  strength = 0.85,
  leaving = false,
}: {
  delay: number;
  strength?: number;
  /** Reverse: the iris opens back out past the screen corners */
  leaving?: boolean;
}) {
  const ring = (clear: number, dark: number) =>
    `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) ${clear}%, rgba(0,0,0,${strength}) ${dark}%)`;
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      initial={{ background: ring(105, 140), opacity: 0 }}
      animate={leaving ? { background: ring(105, 140), opacity: 0 } : { background: ring(25, 80), opacity: 1 }}
      transition={
        leaving
          ? {
              background: { duration: 0.35, delay: EXIT_OVERLAY_AT, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.18, delay: EXIT_OVERLAY_AT + 0.15 },
            }
          : {
              background: { duration: 1.1, delay, ease: HUD_EASE },
              opacity: { duration: 0.3, delay },
            }
      }
    />
  );
}

const SCANLINES =
  "pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent_0_2px,rgba(0,0,0,0.28)_2px_3px)]";

/* Gauge geometry: 240° sweep from -120° (min) to +120° (max), 0° = straight up */
const SWEEP = 240;
const START = -120;
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) };
}
function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const a = polar(cx, cy, r, from);
  const b = polar(cx, cy, r, to);
  return `M ${a.x} ${a.y} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${b.x} ${b.y}`;
}

/** Arc fill and needle share one curve so the needle always sits on the arc's tip. */
const GAUGE_FILL = { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const };

/**
 * Round analogue gauge. When it's on screen (after `delay`), the arc fills from 0 to the value
 */
function Gauge({
  label,
  value,
  min = 0,
  max,
  unit,
  compact,
  delay = 0,
}: {
  label: string;
  value: number;
  min?: number;
  max: number;
  unit?: string;
  /** Smaller caption for tight rows (desktop HUD) */
  compact?: boolean;
  /** Seconds to wait after the gauge is visible (lets the HUD fade in first) */
  delay?: number;
}) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const angle = START + pct * SWEEP;
  const ticks = Array.from({ length: 13 }, (_, i) => START + (i * SWEEP) / 12);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const [started, setStarted] = useState(false);

  // Start once visible + delay
  useEffect(() => {
    if (!inView) return;
    const t = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(t);
  }, [inView, delay]);

  // Needle: an animated angle; its tip and tail are computed around the dial centre (60, 60), so every
  // gauge pivots exactly on the hub (a CSS rotate on SVG pivots on the element's own box instead)
  const needleAngle = useMotionValue(START);
  const tipX = useTransform(needleAngle, (a) => polar(60, 60, 38, a).x);
  const tipY = useTransform(needleAngle, (a) => polar(60, 60, 38, a).y);
  const tailX = useTransform(needleAngle, (a) => polar(60, 60, 6, a + 180).x);
  const tailY = useTransform(needleAngle, (a) => polar(60, 60, 6, a + 180).y);

  useEffect(() => {
    if (!started) return;
    const controls = animate(needleAngle, angle, GAUGE_FILL);
    return () => controls.stop();
  }, [started, angle, needleAngle]);

  return (
    <figure className="flex flex-col items-center">
      <div
        ref={ref}
        className={`relative aspect-square w-full max-w-[150px] rounded-full p-1.5 ${
          compact
            ? GLASS_SURFACE
            : "bg-linear-to-b from-[#1c1c1c] to-[#0a0a0a] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
        }`}
      >
        <svg
          viewBox="0 0 120 120"
          className={`h-full w-full rounded-full ${compact ? "bg-black/35" : "bg-[#050505]"}`}
          role="img"
          aria-label={`${label}: ${value}${unit ? ` ${unit}` : ""}`}
        >
          {/* Track + value arc */}
          <path d={arc(60, 60, 46, START, START + SWEEP)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" strokeLinecap="round" />
          {pct > 0 && (
            <motion.path
              d={arc(60, 60, 46, START, angle)}
              fill="none"
              stroke="rgb(248,113,113)"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: started ? 1 : 0 }}
              transition={GAUGE_FILL}
              style={{ filter: "drop-shadow(0 0 3px rgba(239,68,68,0.7))" }}
            />
          )}
          {/* Ticks */}
          {ticks.map((t, i) => {
            const a = polar(60, 60, 38, t);
            const b = polar(60, 60, i % 3 === 0 ? 32 : 35, t);
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={i % 3 === 0 ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)"}
                strokeWidth={i % 3 === 0 ? 1.5 : 1}
              />
            );
          })}
          {/* Needle follows the tip of the arc */}
          <motion.line x1={tailX} y1={tailY} x2={tipX} y2={tipY} stroke="white" strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="60" r="5" fill="#1a1a1a" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
          {/* Digital readout */}
          <text x="60" y="92" textAnchor="middle" className="fill-white font-mono" fontSize="13" fontWeight="700">
            {value}
          </text>
          {unit && (
            <text x="60" y="103" textAnchor="middle" className="fill-white/40 font-mono" fontSize="6.5" letterSpacing="1">
              {unit.toUpperCase()}
            </text>
          )}
        </svg>
      </div>
      <figcaption className={compact ? "mt-1.5" : "mt-3"}>
        {compact ? (
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55">{label}</span>
        ) : (
          <Placard>{label}</Placard>
        )}
      </figcaption>
    </figure>
  );
}

/** Lit annunciator push-button used for external links. */
function Annunciator({
  href,
  label,
  sub,
  lit,
  icon: Icon,
  glass,
}: {
  href: string;
  label: string;
  sub: string;
  lit?: boolean;
  icon: typeof ExternalLink;
  /** Frosted-glass variant for use over the full-screen image */
  glass?: boolean;
}) {
  const look = glass
    ? lit
      ? "border border-red-400/30 bg-[rgba(60,16,16,0.55)] text-red-100 backdrop-blur-2xl backdrop-saturate-[1.8] shadow-[inset_0_0.5px_0_rgba(255,255,255,0.12),0_0_18px_-4px_rgba(239,68,68,0.55)] hover:bg-[rgba(80,20,20,0.6)]"
      : `${GLASS_SURFACE} text-white/75 hover:border-white/30 hover:text-white`
    : lit
      ? "border-2 border-red-500/50 bg-red-500/15 text-red-200 shadow-[inset_0_0_18px_rgba(239,68,68,0.35),0_0_18px_-4px_rgba(239,68,68,0.6)]"
      : "border-2 border-white/10 bg-black/50 text-white/60 shadow-[inset_0_2px_6px_rgba(0,0,0,0.8)] hover:border-white/25 hover:text-white";
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => hapticManager.medium()}
      className={`group flex min-w-36 flex-1 flex-col items-center justify-center gap-0.5 px-4 py-3 text-center font-mono uppercase transition-colors sm:flex-none ${
        glass ? "rounded-xl" : "rounded-lg"
      } ${look}`}
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.25em]">
        <Icon className="h-3.5 w-3.5" /> {label}
      </span>
      <span className={`text-[9px] tracking-[0.25em] ${lit ? "text-red-200/60" : "text-white/30"}`}>{sub}</span>
    </a>
  );
}


/* ─────────────────────────────────────────────────────────
   Page
   ───────────────────────────────────────────────────────── */

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  // Hidden projects behave like missing ones (redirect to the list)
  const project = projects[id]?.hidden ? undefined : projects[id];
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // Desktop HUD: which image fills the screen, and which feature is expanded
  const [displayIndex, setDisplayIndex] = useState(0);
  // Indices of expanded features in the Systems panel (all collapsed by default)
  const [openFeatures, setOpenFeatures] = useState<Set<number>>(() => new Set());
  const toggleFeature = (i: number) =>
    setOpenFeatures((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  const [briefingOpen, setBriefingOpen] = useState(false);

  // Arrival choreography: image (morph) → overlay from the corners → HUD pieces one after another.
  // Arriving through the cinematic transition, wait for the image morph to finish first.
  const [viaTransition] = useState(isViewTransitionActive);
  const overlayDelay = viaTransition ? 0.7 : 0.1;
  const hudContainer = {
    initial: {},
    animate: { transition: { delayChildren: overlayDelay + 0.55, staggerChildren: 0.11 } },
    // Leaving: pieces go in reverse order (last in, first out)
    exit: { transition: { staggerChildren: EXIT_HUD_STAGGER, staggerDirection: -1 } },
  };

  // Going back plays the arrival in reverse, then hands over to the collapse transition
  const [leaving, setLeaving] = useState(false);
  const leave = useCallback(() => {
    if (leaving) return;
    const back = () => navigateWithTransition(router, "/projects", "back", projectHeroName(id));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      back();
      return;
    }
    setLeaving(true);
    window.setTimeout(back, EXIT_NAVIGATE_AT * 1000);
  }, [leaving, router, id]);

  const imagesToShow =
    project?.additionalImages && project.additionalImages.length > 0
      ? project.additionalImages
      : project?.image
        ? [project.image]
        : [];
  const index = PROJECT_ORDER.indexOf(id);
  const prevProject = index > 0 ? projects[PROJECT_ORDER[index - 1]] : null;
  const nextProject = index >= 0 && index < PROJECT_ORDER.length - 1 ? projects[PROJECT_ORDER[index + 1]] : null;

  useEffect(() => {
    if (!project) router.push("/projects");
  }, [project, router]);

  // Preload the list so going back can collapse straight away instead of waiting for it to load
  useEffect(() => {
    router.prefetch("/projects");
  }, [router]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false);
        else leave();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const t = event.target as HTMLElement;
        if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
        if (imagesToShow.length < 2) return;
        event.preventDefault();
        const step = event.key === "ArrowLeft" ? -1 : 1;
        const wrap = (i: number) => (i + step + imagesToShow.length) % imagesToShow.length;
        // In the viewer, arrows page through it; otherwise they switch the full-screen camera feed
        if (lightboxOpen) setCurrentImageIndex(wrap);
        else setDisplayIndex(wrap);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, lightboxOpen, imagesToShow.length, id, leave]);

  const openImage = (src: string) => {
    const i = imagesToShow.indexOf(src);
    setCurrentImageIndex(i === -1 ? 0 : i);
    setLightboxOpen(true);
    hapticManager.light();
  };
  const closeLightbox = () => setLightboxOpen(false);
  const goToPrevious = () => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : imagesToShow.length - 1));
  const goToNext = () => setCurrentImageIndex((prev) => (prev < imagesToShow.length - 1 ? prev + 1 : 0));

  if (!project) return null;

  const links = [
    isRealUrl(project.liveUrl) && { label: "Live", sub: "Open demo", url: project.liveUrl!, icon: ExternalLink, lit: true },
    isRealUrl(project.githubUrl) && { label: "Source", sub: "GitHub", url: project.githubUrl!, icon: Github },
    ...(project.otherLinks ?? [])
      .filter((l) => isRealUrl(l.url))
      .map((l) => ({ label: l.label.split(" ").slice(-1)[0], sub: l.label, url: l.url, icon: ArrowUpRight })),
  ].filter(Boolean) as { label: string; sub: string; url: string; icon: typeof ExternalLink; lit?: boolean }[];
  // With no live demo, light the first available link instead
  if (links.length > 0 && !links.some((l) => l.lit)) links[0].lit = true;

  const features = (project.features ?? []).map(splitFeature);
  const allFeaturesOpen = features.length > 0 && features.every((_, i) => openFeatures.has(i));
  const year = Number(project.date?.match(/\d{4}/)?.[0] ?? new Date().getFullYear());

  // Gauges self-test once the HUD has faded in, one after another
  const gaugeStart = overlayDelay + 1.1;
  const gaugesCompact = (
    <>
      <Gauge compact delay={gaugeStart} label="Systems" value={features.length} max={10} unit="features" />
      <Gauge compact delay={gaugeStart + 0.15} label="Stack" value={project.technologies.length} max={8} unit="tools" />
      <Gauge compact delay={gaugeStart + 0.3} label="Feeds" value={imagesToShow.length} max={6} unit="images" />
      <Gauge compact delay={gaugeStart + 0.45} label="Year" value={year} min={2020} max={2027} unit="delivered" />
    </>
  );

  // Start the full-screen display on the hero image
  const displaySrc = imagesToShow[displayIndex] ?? project.image;

  const corner = "pointer-events-none absolute h-8 w-8 border-white/40";

  /**
   * Cinematic navigation. The full-screen image shares a name with this project's bay on the list;
   * `heroId` is the project whose image the destination shows (waited on before animating).
   */
  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string, direction: "forward" | "back", heroId: string) => {
    hapticManager.light();
    // Let cmd/ctrl/shift/middle-click open a new tab as usual
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (direction === "back") leave();
    else navigateWithTransition(router, href, direction, projectHeroName(heroId));
  };

  /* Shared between the desktop HUD and the mobile layout */
  const toggleBriefing = () => {
    setBriefingOpen((v) => !v);
    hapticManager.light();
  };

  const briefingPill = (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/35 hover:text-white">
      Briefing
      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${briefingOpen ? "rotate-180" : ""}`} />
    </span>
  );

  /** Full description that slides open under the briefing header; `scroll` caps its height (desktop). */
  const renderBriefingBody = (id: string, scroll: boolean) => (
    <AnimatePresence initial={false}>
      {briefingOpen && (
        <motion.div
          id={id}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={ACCORDION_TRANSITION}
          className="overflow-hidden"
        >
          <div
            className={scroll ? `mt-3 min-h-0 overflow-y-auto pr-2 ${THIN_SCROLL}` : "mt-3"}
            style={scroll ? { maxHeight: "24vh" } : undefined}
          >
            <p className="text-justify text-sm leading-relaxed text-white/80 hyphens-auto">{project.fullDescription}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const stackChips = (
    <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
      {project.technologies.map((t) => (
        <li
          key={t}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-white/70"
        >
          <span className="h-1 w-1 rounded-full bg-red-400 shadow-[0_0_4px_rgba(239,68,68,0.8)]" />
          {t}
        </li>
      ))}
    </ul>
  );

  const expandAllButton = features.some((f) => f.title) && (
    <button
      type="button"
      onClick={() => {
        setOpenFeatures(allFeaturesOpen ? new Set() : new Set(features.map((_, i) => i)));
        hapticManager.light();
      }}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/35 hover:text-white"
    >
      {allFeaturesOpen ? "Collapse all" : "Expand all"}
      <ChevronDown className={`h-3 w-3 transition-transform ${allFeaturesOpen ? "rotate-180" : ""}`} />
    </button>
  );

  const featureItems = features.map(({ title, description }, i) => {
    const open = openFeatures.has(i);
    return (
      <li key={i} className="border-b border-white/10 last:border-b-0">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => toggleFeature(i)}
          className="flex min-h-14 w-full items-center gap-3 py-4 text-left"
        >
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[9px] font-bold transition-colors ${
              open ? "border-red-300 bg-red-500 text-white" : "border-red-400/60 text-red-200"
            }`}
          >
            {i + 1}
          </span>
          <span className={`flex-1 text-sm font-medium transition-colors ${open ? "text-white" : "text-white/75"}`}>
            {title || description}
          </span>
          {title && (
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-white/40 transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
            />
          )}
        </button>
        <AnimatePresence initial={false}>
          {title && open && (
            <motion.div
              key="desc"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={ACCORDION_TRANSITION}
              className="overflow-hidden"
            >
              <p className="pb-4 pl-8 text-xs leading-relaxed text-white/60">{description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </li>
    );
  });

  /** Thumbnail strip; selecting one swaps the full-screen background. */
  const renderFeeds = (desktop: boolean) =>
    imagesToShow.length > 1 && (
      <ul className={`flex gap-2 overflow-x-auto [scrollbar-width:none] ${desktop ? "" : "-mx-4 px-4 sm:mx-0 sm:px-0"}`}>
        {imagesToShow.map((src, i) => {
          const active = i === displayIndex;
          return (
            <li key={src} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  setDisplayIndex(i);
                  hapticManager.light();
                }}
                onDoubleClick={desktop ? () => openImage(src) : undefined}
                title={desktop ? "Double-click to view full size" : undefined}
                aria-label={`Show image ${i + 1} of ${imagesToShow.length}`}
                aria-pressed={active}
                className={`relative block h-14 w-24 overflow-hidden rounded-md border-2 transition-colors ${
                  active ? "border-red-400 shadow-[0_0_12px_-2px_rgba(239,68,68,0.8)]" : "border-white/15 hover:border-white/40"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="96px"
                  className={`object-cover transition-[filter] ${active ? "" : "brightness-50 hover:brightness-90"}`}
                />
                <span className="absolute bottom-0.5 left-1 font-mono text-[8px] font-bold text-white/80">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    );

  return (
    <div className="relative bg-black">
      {/* Desktop: full-screen main display with the whole project spread across it as a HUD */}
      <section
        aria-label={project.name}
        className="relative hidden h-dvh w-full overflow-hidden lg:block"
        onDoubleClick={(e) => {
          // Double-click on the open image (not on HUD text/panels) opens it in the viewer
          if ((e.target as HTMLElement).closest("[data-hud-ui]")) return;
          openImage(displaySrc);
        }}
      >
        {/* Background: the selected camera feed */}
        {/* Shares a view-transition name with the project's bay image on the list, so it morphs between them */}
        <div className="absolute inset-0" {...heroTransitionProps(project.id)}>
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={displaySrc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <Image src={displaySrc} alt="" fill priority sizes="100vw" className="object-cover" />
          </motion.div>
        </AnimatePresence>
        </div>
        {/* Arrival, step 2: a radial iris of darkness closes in, then the readability gradients settle */}
        <RadialOverlay delay={overlayDelay} leaving={leaving} />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: leaving ? 0 : 1 }}
          transition={leaving ? { duration: 0.28, delay: EXIT_OVERLAY_AT } : { duration: 0.8, delay: overlayDelay + 0.2, ease: "easeOut" }}
        >
          <span className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-black/60" />
          <span className="absolute inset-y-0 left-0 w-2/3 bg-linear-to-r from-black/85 via-black/40 to-transparent" />
          <span className="absolute inset-y-0 right-0 w-[560px] bg-linear-to-l from-black/85 via-black/50 to-transparent" />
          <span className={`${SCANLINES} opacity-60`} />
        </motion.div>

        {/* HUD frame: brackets fly in from the screen corners */}
        {(
          [
            ["left-8 top-24 border-l-2 border-t-2", -1, -1],
            ["right-8 top-24 border-r-2 border-t-2", 1, -1],
            ["bottom-[6px] left-8 border-b-2 border-l-2", -1, 1],
            ["bottom-[6px] right-8 border-b-2 border-r-2", 1, 1],
          ] as const
        ).map(([pos, dx, dy]) => (
          <motion.span
            key={pos}
            aria-hidden="true"
            className={`${corner} ${pos}`}
            initial={{ opacity: 0, x: dx * 60, y: dy * 60 }}
            animate={leaving ? { opacity: 0, x: dx * 60, y: dy * 60 } : { opacity: 1, x: 0, y: 0 }}
            transition={leaving ? { duration: 0.32, delay: EXIT_OVERLAY_AT, ease: [0.4, 0, 1, 1] } : { duration: 0.8, delay: overlayDelay + 0.15, ease: HUD_EASE }}
          />
        ))}

        {/* Arrival, step 3: the interface comes in piece by piece */}
        <motion.div
          initial="initial"
          animate={leaving ? "exit" : "animate"}
          variants={hudContainer}
          className="relative mx-auto flex h-full max-w-[1600px] flex-col px-16 pb-14 pt-28"
        >
          {/* Top row */}
          <motion.div data-hud-ui variants={HUD_ITEM} className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link
                href="/projects"
                onClick={(e) => go(e, "/projects", "back", project.id)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white/85 transition-colors hover:border-white/35 hover:text-white ${GLASS_SURFACE}`}
              >
                <ArrowLeft className="h-3.5 w-3.5" /> All projects
              </Link>
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-red-400">
                <Gauge2 className="h-3.5 w-3.5" /> Flight deck
                {project.category && <span className="text-white/50">· {project.category}</span>}
              </p>
            </div>
            <div className="flex items-start gap-6">
              <div className="text-right font-mono text-[10px] uppercase tracking-[0.3em]">
                <p className="font-semibold text-red-300/90 [text-shadow:0_0_8px_rgba(239,68,68,0.6)]">
                  Main display{imagesToShow.length > 1 && ` · Cam ${String(displayIndex + 1).padStart(2, "0")}`}
                </p>
                {project.date && <p className="mt-1 text-white/60">{project.date}</p>}
              </div>
              {/* Previous / next flight */}
              {(prevProject || nextProject) && (
                <nav aria-label="More projects" className="flex items-center gap-2">
                  {prevProject && (
                    <Link
                      href={`/projects/${prevProject.id}`}
                      onClick={(e) => go(e, `/projects/${prevProject.id}`, "forward", prevProject.id)}
                      title={prevProject.name}
                      className={`inline-flex max-w-52 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white ${GLASS_SURFACE}`}
                    >
                      <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{prevProject.name}</span>
                    </Link>
                  )}
                  {nextProject && (
                    <Link
                      href={`/projects/${nextProject.id}`}
                      onClick={(e) => go(e, `/projects/${nextProject.id}`, "forward", nextProject.id)}
                      title={nextProject.name}
                      className={`inline-flex max-w-52 items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-white/80 transition-colors hover:border-white/30 hover:text-white ${GLASS_SURFACE}`}
                    >
                      <span className="truncate">{nextProject.name}</span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                  )}
                </nav>
              )}
            </div>
          </motion.div>

          {/* Middle: story on the left, instruments + systems on the right */}
          <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_400px] gap-12 pt-6 xl:grid-cols-[minmax(0,1fr)_440px]">
            {/* Left: title, description, briefing, links */}
            <div className="flex min-h-0 flex-col justify-end">
              <motion.h1 data-hud-ui variants={HUD_ITEM} className="text-5xl font-bold leading-tight text-white xl:text-6xl">
                {project.name}
              </motion.h1>
              <motion.div data-hud-ui variants={HUD_ITEM} className={`mt-6 flex min-h-0 max-w-2xl flex-col p-5 ${GLASS}`}>
                {/* Briefing accordion */}
                <button
                  type="button"
                  aria-expanded={briefingOpen}
                  aria-controls="briefing-body"
                  onClick={toggleBriefing}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <span className="text-sm text-white/85">{project.description}</span>
                  {briefingPill}
                </button>
                {renderBriefingBody("briefing-body", true)}
                {stackChips}
              </motion.div>

              {links.length > 0 && (
                <motion.div data-hud-ui variants={HUD_ITEM} className="mt-5 flex flex-wrap gap-3">
                  {links.map((l) => (
                    <Annunciator key={l.url} href={l.url} label={l.label} sub={l.sub} lit={l.lit} icon={l.icon} glass />
                  ))}
                </motion.div>
              )}

              {/* Camera feeds filmstrip switches the main display */}
              {imagesToShow.length > 1 && (
            <motion.div data-hud-ui variants={HUD_ITEM} className="mt-6 flex flex-col gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Camera feeds</span>
              {renderFeeds(true)}
            </motion.div>
          )}
            </div>

            {/* Right: gauges + systems (bottom padding clears the fixed ⌘K button) */}
            <div className="flex min-h-0 flex-col gap-4 pb-14">
              <motion.div data-hud-ui variants={HUD_ITEM} className="grid grid-cols-4 gap-3">
                {gaugesCompact}
              </motion.div>

              {features.length > 0 && (
                <motion.div
                  data-hud-ui
                  variants={HUD_ITEM}
                  className={`flex min-h-0 flex-1 flex-col overflow-hidden pl-5 pt-5 ${GLASS}`}
                >
                  <div className="mb-3 flex items-center justify-between pr-5">
                    <Placard>Systems · {features.length}</Placard>
                    {expandAllButton}
                  </div>
                  {/* Scroll area runs to the card's right and bottom edges so the scrollbar sits in the corner */}
                  <ol className={`min-h-0 flex-1 overflow-y-auto pb-2 pr-5 ${THIN_SCROLL}`}>{featureItems}</ol>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Mobile / tablet: the image stays fixed behind, iOS-style glass cards scroll over it */}
      <div className="lg:hidden">
        <div aria-hidden="true" className="fixed inset-0 z-0">
          <div className="absolute inset-0" {...heroTransitionProps(project.id)}>
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={displaySrc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <Image src={displaySrc} alt="" fill priority sizes="100vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
          </div>
          <RadialOverlay delay={overlayDelay} strength={0.7} leaving={leaving} />
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: leaving ? 0 : 1 }}
            transition={leaving ? { duration: 0.28, delay: EXIT_OVERLAY_AT } : { duration: 0.8, delay: overlayDelay + 0.2, ease: "easeOut" }}
          >
            <span className="absolute inset-0 bg-black/55" />
            <span className="absolute inset-0 bg-linear-to-b from-black/50 via-black/20 to-black/80" />
            <span className={`${SCANLINES} opacity-50`} />
          </motion.div>
        </div>

        <motion.div
          initial="initial"
          animate={leaving ? "exit" : "animate"}
          variants={hudContainer}
          className="relative z-10 mx-auto max-w-2xl px-4 pb-24 pt-24 sm:px-6"
        >
          {/* Top bar */}
          <motion.div variants={HUD_ITEM} className="flex items-center justify-between gap-3">
            <Link
              href="/projects"
              onClick={(e) => go(e, "/projects", "back", project.id)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white/85 ${GLASS_SURFACE}`}
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All projects
            </Link>
            {/* Opens the current background image full size */}
            <button
              type="button"
              onClick={() => openImage(displaySrc)}
              aria-label={`View ${project.name} image full size`}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-red-300/90 ${GLASS_SURFACE}`}
            >
              <Maximize2 className="h-3 w-3" />
              {imagesToShow.length > 1 ? `Cam ${String(displayIndex + 1).padStart(2, "0")}` : "View"}
            </button>
          </motion.div>

          {/* Title */}
          <motion.div variants={HUD_ITEM} className="mt-10">
            <p className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-red-400">
              <Gauge2 className="h-3.5 w-3.5" /> Flight deck
              {project.category && <span className="text-white/60">· {project.category}</span>}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl">{project.name}</h1>
            {project.date && (
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white/55">{project.date}</p>
            )}
          </motion.div>

          {/* Camera feeds */}
          {imagesToShow.length > 1 && (
            <motion.div variants={HUD_ITEM} className="mt-8">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/45">Camera feeds</p>
              {renderFeeds(false)}
            </motion.div>
          )}

          <div className="mt-8 space-y-6">
            {/* Briefing */}
            <motion.div variants={HUD_ITEM} className={`p-5 ${GLASS}`}>
              <button
                type="button"
                aria-expanded={briefingOpen}
                aria-controls="briefing-body-mobile"
                onClick={toggleBriefing}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <span className="text-sm text-white/85">{project.description}</span>
                {/* Icon-only toggle on mobile */}
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/60">
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${briefingOpen ? "rotate-180" : ""}`} />
                </span>
              </button>
              {renderBriefingBody("briefing-body-mobile", false)}
              {stackChips}
            </motion.div>

            {/* Links */}
            {links.length > 0 && (
              <motion.div variants={HUD_ITEM} className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                {links.map((l) => (
                  <Annunciator key={l.url} href={l.url} label={l.label} sub={l.sub} lit={l.lit} icon={l.icon} glass />
                ))}
              </motion.div>
            )}

            {/* Gauges */}
            <motion.div variants={HUD_ITEM} className="grid grid-cols-4 gap-4 px-1 sm:gap-6">
              {gaugesCompact}
            </motion.div>

            {/* Systems */}
            {features.length > 0 && (
              <motion.div variants={HUD_ITEM} className={`px-5 pb-2 pt-5 ${GLASS}`}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <Placard>Systems · {features.length}</Placard>
                  {expandAllButton}
                </div>
                <ol>{featureItems}</ol>
              </motion.div>
            )}

            {/* Previous / next */}
            {(prevProject || nextProject) && (
              <motion.nav variants={HUD_ITEM} aria-label="More projects" className="grid grid-cols-2 gap-3 pt-4">
                {prevProject ? (
                  <Link
                    href={`/projects/${prevProject.id}`}
                    onClick={(e) => go(e, `/projects/${prevProject.id}`, "forward", prevProject.id)}
                    className={`flex min-w-0 flex-col gap-1 p-4 ${nextProject ? "" : "col-span-2"} ${GLASS}`}
                  >
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                      <ArrowLeft className="h-3 w-3" /> Previous
                    </span>
                    <span className="truncate text-sm font-semibold text-white">{prevProject.name}</span>
                  </Link>
                ) : null}
                {nextProject && (
                  <Link
                    href={`/projects/${nextProject.id}`}
                    onClick={(e) => go(e, `/projects/${nextProject.id}`, "forward", nextProject.id)}
                    className={`flex min-w-0 flex-col items-end gap-1 p-4 text-right ${prevProject ? "" : "col-span-2"} ${GLASS}`}
                  >
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">
                      Next <ArrowRight className="h-3 w-3" />
                    </span>
                    <span className="max-w-full truncate text-sm font-semibold text-white">{nextProject.name}</span>
                  </Link>
                )}
              </motion.nav>
            )}
          </div>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 z-10"
            aria-label="Close lightbox"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </button>

          {/* Previous Button */}
          {imagesToShow.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 z-10 touch-manipulation"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </button>
          )}

          {/* Next Button */}
          {imagesToShow.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-all duration-200 z-10 touch-manipulation"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </button>
          )}

          {/* Image Counter */}
          {imagesToShow.length > 1 && (
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium">
              {currentImageIndex + 1} / {imagesToShow.length}
            </div>
          )}

          {/* Main Image */}
          <div
            className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-full max-w-full max-h-full"
            >
              <Image
                src={imagesToShow[currentImageIndex]}
                alt={`${project.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                priority
                sizes="100vw"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
