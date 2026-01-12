import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppWrapper } from "@/components/app-wrapper";
import { StructuredData } from "@/components/structured-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mohammed Huzaifa - Portfolio",
    template: "%s | Mohammed Huzaifa"
  },
  description: "Portfolio website of Mohammed Huzaifa - Graduate Student, D365 Customizer, Full Stack Developer, UI/UX Designer. Explore my projects, skills, and experience in web development.",
  keywords: ["Mohammed Huzaifa", "portfolio", "full stack developer", "D365 customizer", "UI/UX designer", "web developer", "graduate student", "React", "Next.js", "TypeScript"],
  authors: [{ name: "Mohammed Huzaifa" }],
  creator: "Mohammed Huzaifa",
  publisher: "Mohammed Huzaifa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://mohammedhuzaifa.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mohammedhuzaifa.vercel.app",
    title: "Mohammed Huzaifa - Portfolio",
    description: "Portfolio website of Mohammed Huzaifa - Graduate Student, D365 Customizer, Full Stack Developer, UI/UX Designer",
    siteName: "Mohammed Huzaifa Portfolio",
    images: [
      {
        url: "/picture.png",
        width: 1200,
        height: 630,
        alt: "Mohammed Huzaifa - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohammed Huzaifa - Portfolio",
    description: "Portfolio website of Mohammed Huzaifa - Graduate Student, D365 Customizer, Full Stack Developer, UI/UX Designer",
    creator: "@mohammedhuzaifa",
    images: ["/picture.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.jpg", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.jpg",
  },
  manifest: "/manifest.json",
  category: "portfolio",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  other: {
    "theme-color": "#000000",
    "color-scheme": "dark",
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Mohammed Huzaifa",
    "application-name": "Mohammed Huzaifa Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <StructuredData />
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-PH68LQ7BFX"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PH68LQ7BFX');
        `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
