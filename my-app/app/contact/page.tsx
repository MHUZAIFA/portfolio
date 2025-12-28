"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/contact-form";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";

const socialLinks = [
  {
    name: "GitHub",
    icon: Github,
    url: "https://github.com",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    url: "https://linkedin.com",
  },
  {
    name: "Email",
    icon: Mail,
    url: "mailto:your.email@example.com",
  },
  {
    name: "Twitter",
    icon: Twitter,
    url: "https://twitter.com",
  },
];

export default function ContactPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mx-auto max-w-4xl px-4 py-24"
    >
      <motion.h1
        variants={staggerItem}
        className="mb-12 text-4xl font-bold text-white md:text-5xl"
      >
        Contact
      </motion.h1>

      <div className="mb-16">
        <ContactForm />
      </div>

      <motion.section
        variants={staggerItem}
        className="text-center"
      >
        <h2 className="mb-6 text-2xl font-semibold text-white">
          Connect with me
        </h2>
        <div className="flex justify-center gap-6">
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => hapticManager.light()}
                className="rounded-full bg-white/10 p-4 text-white transition-colors hover:bg-white/20"
                aria-label={social.name}
              >
                <Icon className="h-6 w-6" />
              </motion.a>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
}

