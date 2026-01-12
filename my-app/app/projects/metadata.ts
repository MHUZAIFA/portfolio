import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Mohammed Huzaifa",
  description: "Explore Mohammed Huzaifa's portfolio of projects including AI applications, mobile apps, web development, and automation solutions. Full Stack Developer showcasing React, Next.js, Python, and more.",
  keywords: ["projects", "portfolio", "Mohammed Huzaifa", "AI", "machine learning", "mobile apps", "web development", "automation", "React", "Next.js", "Python"],
  openGraph: {
    title: "Projects - Mohammed Huzaifa",
    description: "Explore Mohammed Huzaifa's portfolio of projects including AI applications, mobile apps, web development, and automation solutions.",
    url: "https://mohammedhuzaifa.vercel.app/projects",
    type: "website",
    images: [
      {
        url: "/imgs/projects/ai.png",
        width: 1200,
        height: 630,
        alt: "Mohammed Huzaifa's Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects - Mohammed Huzaifa",
    description: "Explore Mohammed Huzaifa's portfolio of projects including AI applications, mobile apps, web development, and automation solutions.",
    images: ["/imgs/projects/ai.png"],
  },
  alternates: {
    canonical: "/projects",
  },
};