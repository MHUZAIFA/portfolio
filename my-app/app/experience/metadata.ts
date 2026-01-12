import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Experience - Mohammed Huzaifa",
  description: "Explore Mohammed Huzaifa's professional experience including software engineering roles at CitiusTech, Willis Towers Watson, and Flexspring. View education background and volunteering activities.",
  keywords: ["experience", "work history", "Mohammed Huzaifa", "software engineer", "full stack developer", "CitiusTech", "Willis Towers Watson", "Flexspring", "education"],
  openGraph: {
    title: "Experience - Mohammed Huzaifa",
    description: "Explore Mohammed Huzaifa's professional experience including software engineering roles and education background.",
    url: "https://mohammedhuzaifa.vercel.app/experience",
    type: "website",
    images: [
      {
        url: "/imgs/logos/citiustech.jpeg",
        width: 1200,
        height: 630,
        alt: "Mohammed Huzaifa's Professional Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience - Mohammed Huzaifa",
    description: "Explore Mohammed Huzaifa's professional experience including software engineering roles and education background.",
    images: ["/imgs/logos/citiustech.jpeg"],
  },
  alternates: {
    canonical: "/experience",
  },
};