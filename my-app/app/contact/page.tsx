"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact-form";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa6";
import { hapticManager } from "@/lib/haptic-manager";

const socialLinks = [
  {
    name: "GitHub",
    icon: FaGithub,
    url: "https://github.com",
  },
  {
    name: "LinkedIn",
    icon: FaLinkedin,
    url: "https://linkedin.com",
  },
  {
    name: "Email",
    icon: FaEnvelope,
    url: "mailto:your.email@example.com",
  },
  {
    name: "X (Twitter)",
    icon: FaXTwitter,
    url: "https://twitter.com",
  },
  {
    name: "Instagram",
    icon: FaInstagram,
    url: "https://instagram.com",
  },
  {
    name: "Facebook",
    icon: FaFacebook,
    url: "https://facebook.com",
  },
  {
    name: "YouTube",
    icon: FaYoutube,
    url: "https://youtube.com",
  },
];

export default function ContactPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mx-auto max-w-7xl px-4 md:px-8 pt-24"
    >

      <div className="mb-16 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <div>
        <motion.div
        variants={staggerItem}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15 
        }}
        className="mb-10 flex items-center justify-between gap-4"
      >
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            delay: 0.1
          }}
          className="text-4xl font-bold text-white md:text-5xl"
        >
          Contact
        </motion.h1>

        <div className="flex flex-wrap gap-3">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: 0.2 + index * 0.05
                }}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => hapticManager.light()}
                className="flex items-center justify-center text-white/70 transition-colors hover:text-white"
                aria-label={social.name}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            );
          })}
        </div>
      </motion.div>
          <ContactForm />
        </div>

        <motion.section
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 100,
            damping: 20,
            delay: 0.3
          }}
          className="overflow-hidden rounded-sm border border-white/10 bg-white/5 shadow-xl"
        >
          <div className="border-b border-white/10 bg-gradient-to-r from-sky-500/20 via-cyan-400/10 to-emerald-400/10 px-5 py-4">
            <h2 className="text-sm font-medium uppercase tracking-[0.22em] text-sky-100/90">
              Based in Montréal, Canada
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Happy to work remotely or in-person around the Greater Montréal Area.
            </p>
          </div>

          <div className="relative h-[calc(100vh-20rem)] w-full">
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(94,234,212,0.18),transparent_55%)] mix-blend-screen" />
            <div className="relative z-10 h-full w-full overflow-hidden bg-black">
              <iframe
                title="Map showing Montréal, Canada"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.995746324729!2d-73.56725668443858!3d45.501688979101995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a417de4c1c3%3A0x5bcd40ff0fb1921!2sMontr%C3%A9al%2C%20QC!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

