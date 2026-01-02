"use client";

import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface Commit {
  id: string;
  x: number;
  y: number;
  branch: number;
  isMerge?: boolean;
  isHead?: boolean;
  isHidden?: boolean; // For commits that should have line but no dot
}

interface Branch {
  id: number;
  color: string;
  commits: Commit[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  technologies?: string[];
  date?: string;
  category?: string;
  orderNumber?: number;
}

// Helper function to parse date string and return a sortable date
function parseProjectDate(dateString: string): Date {
  if (!dateString) return new Date(0);
  
  // Handle date ranges (take the start date)
  const date = dateString.split(" - ")[0];
  
  // Parse different date formats
  const monthNames: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
    jan: 0, feb: 1, mar: 2, apr: 3, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
  };

  // Try to parse "Month Day, Year" format (e.g., "May 29, 2025")
  const dateMatch = date.match(/(\w+)\s+(\d+),\s+(\d+)/i);
  if (dateMatch) {
    const month = monthNames[dateMatch[1].toLowerCase()];
    const day = parseInt(dateMatch[2]);
    const year = parseInt(dateMatch[3]);
    return new Date(year, month, day);
  }

  // Try to parse "Month Year" format (e.g., "December 2024")
  const monthYearMatch = date.match(/(\w+)\s+(\d+)/i);
  if (monthYearMatch) {
    const month = monthNames[monthYearMatch[1].toLowerCase()];
    const year = parseInt(monthYearMatch[2]);
    return new Date(year, month, 1);
  }

  // Fallback to current date if parsing fails
  return new Date();
}

// Project data - will be sorted from latest to oldest
const projects: Project[] = [
    {
        id: "ai-report-workflow",
        name: "AI-Driven Report Generation",
        description: "An automated reporting system built using n8n that generates reports using natural language prompts.",
        thumbnail: "/imgs/projects/n8nlogo.png",
        technologies: ["n8n", "Automation", "AI", "REST APIs", "Workflow"],
        date: "December 2024",
        category: "Automation / Reporting",
        orderNumber: 1,
    },
    {
    id: "ai-bots",
    name: "AI_Bots",
    description: "Applied AI project featuring comparative analysis of ML models and CNN-based image classification.",
    thumbnail: "/imgs/projects/ai.png",
    technologies: ["Machine Learning", "Deep Learning", "Python", "CNN", "SVM"],
    date: "May 29, 2025 - Jun 22, 2025",
    category: "Machine Learning & AI",
    orderNumber: 2,
  },
  {
    id: "recyclevision",
    name: "RecycleVision",
    description: "A mobile application that simplifies waste sorting using ML/AI-powered object detection and classification via Hugging Face API.",
    thumbnail: "/imgs/projects/RecycleVision.png",
    technologies: ["Mobile", "ML/AI", "Hugging Face API", "Image Recognition", "HCI"],
    date: "Feb 18, 2024 - May 1, 2024",
    category: "Mobile Application",
    orderNumber: 3,
  },
  {
    id: "metricstics",
    name: "Metricstics",
    description: "Discover the Power of Metrics and Statistics - A Python tool for calculating essential statistical values.",
    thumbnail: "/imgs/projects/metricstics.png",
    technologies: ["Python", "Statistics", "Data Analysis"],
    date: "November 2023",
    category: "Productivity & Utilities",
    orderNumber: 4,
  },
  {
    id: "mytasks",
    name: "MyTasks",
    description: "A user-friendly cross-platform to-do application for efficiently managing and tracking day-to-day activities.",
    thumbnail: "/imgs/projects/todobg.png",
    technologies: ["Angular", "PWA", "Cross Platform", "Cloud-Based", "Firebase"],
    date: "December 2022",
    category: "Productivity & Tracking",
    orderNumber: 5,
  },
  {
    id: "snkrs",
    name: "SNKRS",
    description: "An online e-commerce web application for browsing and buying sneakers.",
    thumbnail: "/imgs/projects/snkrsbg.png",
    technologies: ["E-Commerce", "PWA", "Cross Platform"],
    date: "May 2022",
    category: "E-Commerce",
    orderNumber: 6,
  },
  {
    id: "helpdesk",
    name: "Helpdesk",
    description: "A web application for requesting for an asset or raising an issue.",
    thumbnail: "/imgs/projects/crm.png",
    technologies: ["PWA", "Support", "Cloud-Based"],
    date: "Feb 2022",
    category: "Support",
    orderNumber: 7,
  },
];

// Generate mock git commit data
function generateGitGraph(): Branch[] {
  const branches: Branch[] = [
    { id: 0, color: "#3b82f6", commits: [] }, // main branch - blue
    { id: 1, color: "#10b981", commits: [] }, // feature branch - green
    { id: 2, color: "#f59e0b", commits: [] }, // hotfix branch - yellow/orange
  ];

  const commitSpacing = 140; // Spacing between commits (reduced to bring project cards closer)
  const branchHorizontalSpacing = 30; // 30px spacing between parallel branches
  
  // Calculate how many commits we need based on available projects
  // We need 7 commits with projects (1 HEAD + 6 others) to display all 7 projects
  // Plus 1 extra commit at bottom without project = 8 commits total
  const commitsWithProjects = 7; // HEAD + 6 others for all 7 projects
  const totalCommits = commitsWithProjects + 1; // Add one more commit at bottom without project
  const startY = 40;
  const blueX = 0; // Blue (main) branch
  const yellowX = blueX + branchHorizontalSpacing; // Yellow 30px to the right of blue
  const greenX = yellowX + branchHorizontalSpacing; // Green 30px to the right of yellow
  
  // Calculate bottom Y (highest value, since we're going bottom to top)
  const bottomY = startY + (totalCommits - 1) * commitSpacing;

  // All branches start at the bottom in parallel with horizontal spacing
  // Blue (main) branch - goes straight up
  // Create all commits including one extra at bottom without project
  for (let i = 0; i < totalCommits; i++) {
    branches[0].commits.push({
      id: `main-${i}`,
      x: blueX,
      y: bottomY - i * commitSpacing, // Start from bottom, go up
      branch: 0,
      isHead: i === totalCommits - 1, // HEAD is at the top (last commit)
    });
  }

  // Yellow (hotfix) branch - starts parallel to blue (30px to the right), then merges into blue
  // Yellow starts at bottom, goes up parallel to blue, then merges into blue
  const yellowMergeCommit = 4; // Merge at commit 4 (from bottom) - moved down by one position
  for (let i = 0; i < yellowMergeCommit; i++) {
    branches[2].commits.push({
      id: `yellow-${i}`,
      x: yellowX, // 30px to the right of blue
      y: bottomY - i * commitSpacing,
      branch: 2,
    });
  }
  // Yellow merges into blue at the next commit position
  branches[2].commits.push({
    id: "yellow-merge",
    x: blueX, // Merge into blue (back to blue's x position)
    y: bottomY - yellowMergeCommit * commitSpacing,
    branch: 0,
    isMerge: true,
  });

  // Green (feature) branch - starts parallel to yellow (30px to the right of yellow), then merges directly into yellow
  // Green starts at bottom, goes up parallel to yellow, then merges directly left into yellow
  const greenMergeCommit = 2; // Merge at commit 2 (from bottom)
  for (let i = 0; i < greenMergeCommit; i++) {
    branches[1].commits.push({
      id: `green-${i}`,
      x: greenX, // 30px to the right of yellow
      y: bottomY - i * commitSpacing,
      branch: 1,
    });
  }
  // Green merges directly into yellow (curved path going left, no branch out to the right)
  branches[1].commits.push({
    id: "green-merge",
    x: yellowX, // Merge into yellow (back to yellow's x position)
    y: bottomY - greenMergeCommit * commitSpacing,
    branch: 2,
    isMerge: true
  });

  // Move second-to-last commits down (increase Y value to move them lower)
  const moveDownAmount = 40; // Amount to move down in pixels
  
  // Blue branch: second-to-last commit (index 1, second from bottom)
  if (branches[0].commits.length > 1) {
    branches[0].commits[1].y += moveDownAmount;
  }
  
  // Yellow branch: second-to-last parallel commit (index 1, second from bottom)
  const yellowParallelCommits = branches[2].commits.filter(c => !c.isMerge);
  if (yellowParallelCommits.length > 1) {
    // Sort by y descending (bottom to top), then get index 1 (second from bottom)
    const sortedYellow = yellowParallelCommits.sort((a, b) => b.y - a.y);
    sortedYellow[1].y += moveDownAmount;
  }
  
  // Green branch: second-to-last parallel commit (index 0, since there are only 2 parallel commits)
  const greenParallelCommits = branches[1].commits.filter(c => !c.isMerge);
  if (greenParallelCommits.length > 1) {
    // Sort by y descending (bottom to top), then get index 1 (second from bottom)
    const sortedGreen = greenParallelCommits.sort((a, b) => b.y - a.y);
    sortedGreen[1].y += moveDownAmount;
  }

  return branches;
}

// Calculate cubic bezier curve path for connecting commits (for side branches)
// Increased curveness for more pronounced curves
function getCurvedPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  
  // Control points for more pronounced curves
  // Increased curve factor for more dramatic curves
  const curveFactor = 0.6; // Increased from 0.5 for more curvature
  const verticalFactor = 0.4; // Increased from 0.3 for more vertical curve
  
  const cp1x = x1 + dx * curveFactor;
  const cp1y = y1 + dy * verticalFactor;
  const cp2x = x2 - dx * curveFactor;
  const cp2y = y2 - dy * verticalFactor;

  return `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
}

// Get straight line path for main branch (vertical line)
function getStraightPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): string {
  return `M ${x1} ${y1} L ${x2} ${y2}`;
}

export function GitCommitGraph() {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const { branches, dimensions } = useMemo(() => {
    const graphData = generateGitGraph();

    // Calculate dimensions - main branch is at x=0, branches extend to the right
    const maxX = Math.max(
      ...graphData.flatMap((b) => b.commits.map((c) => c.x))
    );
    const minX = 0; // Main branch is always at x=0
    const maxY = Math.max(
      ...graphData.flatMap((b) => b.commits.map((c) => c.y))
    );
    const minY = Math.min(
      ...graphData.flatMap((b) => b.commits.map((c) => c.y))
    );

    const paddingX = 80; // Keep padding for overall SVG dimensions
    const paddingY = 40;
    const extensionHeight = 150; // Height for infinite extension lines at bottom
    return {
      branches: graphData,
      dimensions: {
        width: maxX - minX + paddingX * 2,
        height: maxY - minY + paddingY * 2 + extensionHeight, // Add extra height for extensions
      },
    };
  }, []);

  // Generate connections between commits
  const getConnections = () => {
    const connections: Array<{
      path: string;
      color: string;
      from: Commit;
      to: Commit;
    }> = [];

    const offsetX = 40; // Left padding to position main branch (reduced to move graph left)
    const offsetY = 20; // Top padding

    // Connect main branch commits (straight vertical line)
    // All commits now have projects, so connect them all sequentially
    const mainBranch = branches[0];
    for (let i = 0; i < mainBranch.commits.length - 1; i++) {
      const from = mainBranch.commits[i];
      const to = mainBranch.commits[i + 1];
      const path = getStraightPath(
        from.x + offsetX,
        from.y + offsetY,
        to.x + offsetX,
        to.y + offsetY
      );
      connections.push({ path, color: mainBranch.color, from, to });
    }

    // Connect yellow (hotfix) branch - parallel to blue, then merges into blue
    const yellowBranch = branches[2];
    if (yellowBranch.commits.length > 0) {
      // Find yellow parallel commits (excluding merge)
      const yellowParallelCommits = yellowBranch.commits.filter(c => !c.isMerge).sort((a, b) => b.y - a.y); // Sort by y descending
      const yellowMerge = yellowBranch.commits.find(c => c.isMerge);
      
      // Connect yellow parallel commits (straight lines)
      for (let i = 0; i < yellowParallelCommits.length - 1; i++) {
        const from = yellowParallelCommits[i];
        const to = yellowParallelCommits[i + 1];
        const path = getStraightPath(
          from.x + offsetX,
          from.y + offsetY,
          to.x + offsetX,
          to.y + offsetY
        );
        connections.push({ path, color: yellowBranch.color, from, to });
      }
      
      // Connect last yellow commit to merge into blue (curve)
      if (yellowParallelCommits.length > 0 && yellowMerge) {
        const lastYellow = yellowParallelCommits[yellowParallelCommits.length - 1];
        const mergePath = getCurvedPath(
          lastYellow.x + offsetX,
          lastYellow.y + offsetY,
          yellowMerge.x + offsetX,
          yellowMerge.y + offsetY
        );
        connections.push({
          path: mergePath,
          color: yellowBranch.color,
          from: lastYellow,
          to: yellowMerge,
        });
      }
    }

    // Connect green (feature) branch - parallel to yellow, then merges directly left into yellow
    const greenBranch = branches[1];
    if (greenBranch.commits.length > 0) {
      // Find commits in order
      const greenParallelCommits = greenBranch.commits.filter(c => c.id.startsWith("green-") && !c.id.includes("merge")).sort((a, b) => b.y - a.y); // Sort by y descending (bottom to top)
      const greenMerge = greenBranch.commits.find(c => c.id === "green-merge");
      
      // Connect green parallel commits (straight lines)
      for (let i = 0; i < greenParallelCommits.length - 1; i++) {
        const from = greenParallelCommits[i];
        const to = greenParallelCommits[i + 1];
        const path = getStraightPath(
          from.x + offsetX,
          from.y + offsetY,
          to.x + offsetX,
          to.y + offsetY
        );
        connections.push({ path, color: greenBranch.color, from, to });
      }
      
      // Connect last parallel commit directly to merge into yellow (curved path going left)
      if (greenParallelCommits.length > 0 && greenMerge) {
        const lastParallel = greenParallelCommits[greenParallelCommits.length - 1];
        const mergePath = getCurvedPath(
          lastParallel.x + offsetX,
          lastParallel.y + offsetY,
          greenMerge.x + offsetX,
          greenMerge.y + offsetY
        );
        connections.push({
          path: mergePath,
          color: greenBranch.color,
          from: lastParallel,
          to: greenMerge,
        });
      }
    }

    return connections;
  };

  const offsetX = 40; // Left padding to position main branch on the left (reduced to move graph left)
  const offsetY = 20; // Top padding

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full"
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <div className="relative w-full overflow-visible pt-22">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          >
            {/* Render connections */}
            {getConnections().map((connection, index) => (
              <motion.path
                key={`connection-${index}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                d={connection.path}
                fill="none"
                stroke={connection.color}
                strokeWidth="2.5"
                strokeLinecap="round"
                className="drop-shadow-sm"
              />
            ))}

            {/* Extension line at the top (after HEAD) */}
            {(() => {
              const extensionHeight = 80;
              const headCommit = branches[0].commits.find(c => c.isHead);
              if (headCommit) {
                const headXPos = headCommit.x + offsetX;
                const headYPos = headCommit.y + offsetY;
                return (
                  <>
                    <defs>
                      <linearGradient id="blueTopGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line
                      x1={headXPos}
                      y1={headYPos}
                      x2={headXPos}
                      y2={headYPos - extensionHeight}
                      stroke="url(#blueTopGradient)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                );
              }
              return null;
            })()}

            {/* Infinite extension lines at the bottom */}
            {(() => {
              const extensionHeight = 150;
              const bottomYValue = Math.max(...branches.flatMap(b => b.commits.map(c => c.y)));
              
              // Blue branch extension (from bottom commit)
              const blueBottomCommit = branches[0].commits.find(c => c.y === bottomYValue && !c.isHidden);
              if (blueBottomCommit) {
                const blueXPos = blueBottomCommit.x + offsetX;
                const blueYPos = blueBottomCommit.y + offsetY;
                return (
                  <>
                    <defs>
                      <linearGradient id="blueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Blue branch extension */}
                    <line
                      x1={blueXPos}
                      y1={blueYPos}
                      x2={blueXPos}
                      y2={blueYPos + extensionHeight}
                      stroke="url(#blueGradient)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Yellow branch extension */}
                    {branches[2].commits
                      .filter(c => c.branch === 2 && c.y === bottomYValue)
                      .map((yellowCommit) => {
                        const yellowXPos = yellowCommit.x + offsetX;
                        const yellowYPos = yellowCommit.y + offsetY;
                        return (
                          <line
                            key="yellow-extension"
                            x1={yellowXPos}
                            y1={yellowYPos}
                            x2={yellowXPos}
                            y2={yellowYPos + extensionHeight}
                            stroke="url(#yellowGradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        );
                      })}
                    {/* Green branch extension */}
                    {branches[1].commits
                      .filter(c => c.branch === 1 && c.y === bottomYValue)
                      .map((greenCommit) => {
                        const greenXPos = greenCommit.x + offsetX;
                        const greenYPos = greenCommit.y + offsetY;
                        return (
                          <line
                            key="green-extension"
                            x1={greenXPos}
                            y1={greenYPos}
                            x2={greenXPos}
                            y2={greenYPos + extensionHeight}
                            stroke="url(#greenGradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                        );
                      })}
                  </>
                );
              }
              return null;
            })()}

            {/* Render commits */}
            {(() => {
              // Calculate bottom Y value to identify bottom commits
              const bottomYValue = Math.max(...branches.flatMap(b => b.commits.map(c => c.y)));
              
              return branches.map((branch) =>
                branch.commits.map((commit, commitIndex) => {
                  const x = commit.x + offsetX;
                  const y = commit.y + offsetY;
                  const isMergeCommit = commit.isMerge;
                  const isHeadCommit = commit.isHead;
                  const isBottomCommit = commit.y === bottomYValue;

                  return (
                    <g key={commit.id}>
                      {/* Commit circle - skip rendering for bottom commits */}
                      {!isBottomCommit && (
                        <motion.circle
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            duration: 0.4,
                            delay: commitIndex * 0.1 + branch.id * 0.2,
                            ease: "easeOut",
                          }}
                          cx={x}
                          cy={y}
                          r={isMergeCommit ? 7 : isHeadCommit ? 8 : 6}
                          fill={isMergeCommit ? branch.color : commit.branch === branch.id ? branch.color : branches[0].color}
                          stroke={isHeadCommit ? "#fff" : "rgba(255, 255, 255, 0.3)"}
                          strokeWidth={isHeadCommit ? 2 : 1.5}
                          className="drop-shadow-lg"
                          style={{
                            filter: isHeadCommit ? "drop-shadow(0 0 8px rgba(255,255,255,0.5))" : undefined,
                          }}
                        />
                      )}
                    {/* Inner circle for merge commits */}
                    {isMergeCommit && (
                      <motion.circle
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: commitIndex * 0.1 + branch.id * 0.2 + 0.2,
                        }}
                        cx={x}
                        cy={y}
                        r={3}
                        fill="rgba(255, 255, 255, 0.9)"
                      />
                    )}
                    {/* HEAD indicator */}
                    {isHeadCommit && (
                      <motion.text
                        initial={{ opacity: 0, y: y - 15 }}
                        animate={{ opacity: 1, y: y - 12 }}
                        transition={{
                          duration: 0.4,
                          delay: commitIndex * 0.1 + branch.id * 0.2 + 0.3,
                        }}
                        x={x}
                        y={y - 70}
                        textAnchor="middle"
                        className="font-semibold fill-white/80"
                      >
                        HEAD
                      </motion.text>
                    )}
                  </g>
                );
              }))
            })()}
          </svg>

          {/* Project cards to the right of blue commits - starting with HEAD */}
          {(() => {
            // Get HEAD commit first
            const headCommit = branches[0].commits.find(c => c.isHead && c.branch === 0);
            // Get other visible commits (excluding HEAD, hidden, and bottom commit without project)
            // Bottom commit is at index 0 (lowest y value), so exclude it
            const bottomCommitY = Math.max(...branches[0].commits.map(c => c.y));
            const otherCommits = branches[0].commits
              .filter((commit) => 
                !commit.isHidden && 
                !commit.isHead && 
                commit.branch === 0 &&
                commit.y !== bottomCommitY // Exclude bottom commit (no project)
              )
              .slice(0, 6); // Get 6 more commits (7 total including HEAD, excluding bottom)
            
            // Combine: HEAD first, then others
            const allCommits = headCommit ? [headCommit, ...otherCommits] : otherCommits;
            
            // Sort projects by orderNumber to ensure correct order
            const sortedProjects = [...projects].sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0));
            
            return allCommits.map((commit, idx) => {
              // Select project based on orderNumber: HEAD gets 1, then reverse 2-7
              // So the order will be: 1, 7, 6, 5, 4, 3, 2
              let targetOrderNumber;
              if (idx === 0) {
                targetOrderNumber = 1; // HEAD gets orderNumber 1
              } else {
                // Reverse orderNumbers 2-7: idx 1→7, 2→6, 3→5, 4→4, 5→3, 6→2
                targetOrderNumber = 8 - idx;
              }
              const project = sortedProjects.find(p => p.orderNumber === targetOrderNumber);
              if (!project) return null;
              
              const x = commit.x + offsetX;
              const y = commit.y + offsetY;
              
              // Calculate percentage for responsive positioning
              const leftPercent = (x / dimensions.width) * 100;
              const topPercent = (y / dimensions.height) * 100;
              
              // Set top to 72% for the second project card
              const isSecondCard = idx === 1;
              const topValue = isSecondCard ? '74.5%' : `${topPercent}%`;
              
              return (
                <motion.div
                  key={`project-${commit.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.5 }}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `calc(${leftPercent}% + 20px)`,
                    right: '0',
                    top: topValue,
                    transform: 'translateY(-50%)',
                    width: 'auto',
                    zIndex: 10,
                  }}
                >
                  <Link href={`/projects/${project.id}`}>
                    <Card className="group cursor-pointer border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/5">
                      <div className="flex items-start gap-3">
                        {project.thumbnail && (
                          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/5 border border-white/10">
                            <Image
                              src={project.thumbnail}
                              alt={project.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="64px"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="mb-2">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold text-white/80 border border-white/10 flex-shrink-0">
                                {project.orderNumber || idx + 1}
                              </span>
                              <h4 className="text-sm font-semibold text-white group-hover:text-white transition-colors">
                                {project.name}
                              </h4>
                              {project.category && (
                                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white/80 border border-white/10">
                                  {project.category}
                                </span>
                              )}
                            </div>
                            {project.date && (
                              <p className="text-[10px] text-white/50 font-medium uppercase">
                                {project.date}
                              </p>
                            )}
                          </div>
                          <p className="text-xs text-white/70 leading-4 line-clamp-2 group-hover:text-white/80 transition-colors mb-2">
                            {project.description}
                          </p>
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.slice(0, 3).map((tech) => (
                                <span
                                  key={tech}
                                  className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/70 border border-white/10"
                                >
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > 3 && (
                                <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-white/50 border border-white/10">
                                  +{project.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/80 transition-colors flex-shrink-0 mt-1" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            });
          })()}
        </div>
      )}
    </motion.div>
  );
}

