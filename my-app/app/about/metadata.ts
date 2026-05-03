import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me - Mohammed Huzaifa",
  description:
    "Mohammed Huzaifa — graduate student, full-stack AI developer, and Microsoft Dynamics 365 specialist. Builds with React, Next.js, Angular, .NET, and Azure; works spec-driven with Claude Code, n8n automations, and custom MCP servers for grounded AI tooling.",
  keywords: ["Mohammed Huzaifa", "about", "full stack AI developer", "D365 customizer", "UI/UX designer", "graduate student", "skills", "experience", "portfolio"],
  openGraph: {
    title: "About Me - Mohammed Huzaifa",
    description:
      "Full-stack AI developer — D365, React/Next.js, .NET, Azure; spec-driven delivery, n8n workflows, Claude Code, and MCP servers.",
    url: "https://mohammedhuzaifa.vercel.app/about",
    type: "profile",
    images: [
      {
        url: "/imgs/huzaifa.jpg",
        width: 1200,
        height: 630,
        alt: "Mohammed Huzaifa - Full Stack AI Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me - Mohammed Huzaifa",
    description:
      "Full-stack AI developer and D365 specialist — React, Next.js, .NET, Azure, and applied ML in production-minded software.",
    images: ["/imgs/huzaifa.jpg"],
  },
  alternates: {
    canonical: "/about",
  },
};