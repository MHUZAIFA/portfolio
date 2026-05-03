"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";

type FaqItem = {
  q: string;
  a: string;
};

const faqs: FaqItem[] = [
  {
    q: "What kind of projects are you open to?",
    a: "Full-stack web apps, AI/ML integrations, Dynamics 365 customizations, and end-to-end product builds. I especially enjoy projects where design, performance, and AI meet.",
  },
  {
    q: "How fast do you usually reply?",
    a: "Within 24 hours on weekdays — often much sooner. If something's time-sensitive, mention it in the subject and I'll triage it.",
  },
  {
    q: "Do you work remotely or only in Montréal?",
    a: "Both. I'm based in Montréal (EST) and happy to work remotely with teams worldwide. For local clients, I can also meet in person around the Greater Montréal Area.",
  },
  {
    q: "Are you available for freelance or full-time roles?",
    a: "I take on a small number of freelance and contract engagements at any given time, and I'm open to full-time conversations for the right team. Drop a few details and we'll figure out the best fit.",
  },
  {
    q: "What should I include in my message?",
    a: "A short description of what you're building, the timeline, and any links (Figma, repo, brief). The more context you share, the faster I can give you a useful reply.",
  },
];

export function ContactFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <ul className="divide-y divide-white/5 border-y border-white/5">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <li key={faq.q}>
            <button
              type="button"
              onClick={() => {
                hapticManager.light();
                setOpenIndex(isOpen ? null : index);
              }}
              className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors focus-visible:outline-none"
              aria-expanded={isOpen}
            >
              <span
                className={`text-[15px] leading-snug transition-colors ${
                  isOpen
                    ? "text-white"
                    : "text-white/75 group-hover:text-white"
                }`}
              >
                {faq.q}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 22 }}
                className={`shrink-0 transition-colors ${
                  isOpen ? "text-sky-300" : "text-white/35 group-hover:text-white/70"
                }`}
              >
                <Plus className="h-4 w-4" strokeWidth={1.75} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-prose pr-10 pb-6 text-[14px] leading-relaxed text-white/55">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
