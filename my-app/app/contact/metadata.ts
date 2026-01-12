import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Mohammed Huzaifa",
  description: "Get in touch with Mohammed Huzaifa - Full Stack Developer and D365 Customizer. Contact me for collaboration opportunities, project inquiries, or professional networking.",
  keywords: ["contact", "Mohammed Huzaifa", "hire", "collaboration", "full stack developer", "D365 customizer", "email", "social media"],
  openGraph: {
    title: "Contact - Mohammed Huzaifa",
    description: "Get in touch with Mohammed Huzaifa - Full Stack Developer and D365 Customizer. Contact me for collaboration opportunities and project inquiries.",
    url: "https://mohammedhuzaifa.vercel.app/contact",
    type: "website",
    images: [
      {
        url: "/imgs/picture.png",
        width: 1200,
        height: 630,
        alt: "Contact Mohammed Huzaifa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact - Mohammed Huzaifa",
    description: "Get in touch with Mohammed Huzaifa - Full Stack Developer and D365 Customizer",
    images: ["/imgs/picture.png"],
  },
  alternates: {
    canonical: "/contact",
  },
};