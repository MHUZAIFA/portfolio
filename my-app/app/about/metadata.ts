import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Me - Mohammed Huzaifa",
  description: "Learn about Mohammed Huzaifa - Graduate Student, Full Stack Developer, D365 Customizer, and UI/UX Designer. Explore my technical skills, experience, and passion for technology.",
  keywords: ["Mohammed Huzaifa", "about", "full stack developer", "D365 customizer", "UI/UX designer", "graduate student", "skills", "experience", "portfolio"],
  openGraph: {
    title: "About Me - Mohammed Huzaifa",
    description: "Learn about Mohammed Huzaifa - Graduate Student, Full Stack Developer, D365 Customizer, and UI/UX Designer. Explore my technical skills and experience.",
    url: "https://mohammedhuzaifa.vercel.app/about",
    type: "profile",
    images: [
      {
        url: "/imgs/picture.png",
        width: 1200,
        height: 630,
        alt: "Mohammed Huzaifa - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Me - Mohammed Huzaifa",
    description: "Learn about Mohammed Huzaifa - Graduate Student, Full Stack Developer, D365 Customizer, and UI/UX Designer",
    images: ["/imgs/picture.png"],
  },
  alternates: {
    canonical: "/about",
  },
};