import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/app-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mohammed Huzaifa - Portfolio",
  description: "Portfolio website of Mohammed Huzaifa - Graduate Student, D365 Customizer, Full Stack Developer, UI/UX Designer",
  icons: {
    icon: "/icon.jpg", // or use "/favicon.ico" or any other path
    shortcut: "/favicon.ico",
    apple: "/icon.jpg", // For Apple devices
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
