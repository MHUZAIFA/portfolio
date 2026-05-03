"use client";

import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import {
  staggerContainer,
  staggerItem,
} from "@/components/providers/motion-provider";
import { AvailabilityBadge } from "@/components/contact/availability-badge";
import { LocalTimeClock } from "@/components/contact/local-time-clock";
import { QuickActions } from "@/components/contact/quick-actions";
import { SocialCards } from "@/components/contact/social-cards";
import { ContactFaq } from "@/components/contact/contact-faq";

export default function ContactPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="relative mx-auto max-w-7xl px-4 pt-24 pb-24 md:px-8 md:pb-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-12 -z-10 mx-auto h-96 max-w-5xl bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_60%),radial-gradient(circle_at_70%_40%,rgba(168,85,247,0.12),transparent_55%)] blur-2xl"
      />

      <motion.section
        variants={staggerItem}
        className="relative mt-8 mb-14 md:mt-12 md:mb-20"
      >
        <div className="flex flex-wrap items-center gap-3">
          <AvailabilityBadge status="available" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/70">
            <MapPin className="h-3 w-3 text-sky-300" /> Montréal · EST
          </span>
        </div>

        <motion.h1
          variants={staggerItem}
          className="mt-6 bg-gradient-to-br from-white via-white to-white/55 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Let&apos;s build something
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-sky-300 via-cyan-200 to-emerald-300 bg-clip-text text-transparent">
            worth shipping.
          </span>
        </motion.h1>

        <motion.p
          variants={staggerItem}
          className="mt-5 max-w-2xl text-base text-white/65 md:text-lg"
        >
          Got a project, a half-baked idea, or just want to chat? Drop me a
          line below and I&apos;ll get back to you within a day. The fastest
          path is the form — but pick whatever feels right.
        </motion.p>

        <motion.div variants={staggerItem} className="mt-10 md:mt-12">
          <QuickActions />
        </motion.div>
      </motion.section>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
        <motion.section variants={staggerItem} className="space-y-14">
          <div>
            <header className="mb-7">
              <p className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.2em] text-sky-300/80">
                <Sparkles className="h-3 w-3" />
                Send a message
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Tell me what you&apos;re working on
              </h2>
            </header>
            <ContactForm />
          </div>

          <div>
            <header className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-emerald-300/80">
                FAQ
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Things people usually ask
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
                Quick answers to the questions that come up most. Still
                curious? The form is right there — fire away.
              </p>
            </header>
            <ContactFaq />
          </div>
        </motion.section>

        <motion.aside variants={staggerItem} className="space-y-12">
          <section>
            <header className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/45">
                  Find me online
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  Same person, everywhere
                </h3>
              </div>
              <span className="font-mono text-[11px] tabular-nums text-white/35">
                07 / channels
              </span>
            </header>
            <SocialCards />
          </section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.25,
            }}
            className="overflow-hidden rounded-sm border border-white/10 bg-white/[0.025] backdrop-blur"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 bg-gradient-to-r from-sky-500/15 via-cyan-400/10 to-emerald-400/10 px-5 py-5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-sky-100/80">
                  Based in
                </p>
                <h3 className="mt-1.5 text-lg font-semibold text-white">
                  Montréal, Canada
                </h3>
                <p className="mt-1.5 text-xs text-white/60">
                  Remote-first · in-person around the GMA.
                </p>
              </div>
              <LocalTimeClock
                timezone="America/Toronto"
                label="Montréal"
                className="text-right"
                iconClassName="h-3.5 w-3.5 text-sky-300/80"
              />
            </div>

            <div className="relative h-[340px] w-full">
              <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.25),transparent_55%),radial-gradient(circle_at_bottom,rgba(94,234,212,0.18),transparent_55%)] mix-blend-screen" />
              <div className="relative z-10 h-full w-full overflow-hidden bg-black">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d178787.4312134501!2d-73.87668047886544!3d45.55930461097889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91a541c64b70d%3A0x654e3138211fefef!2sMontreal%2C%20QC!5e0!3m2!1sen!2sca!4v1767002508064!5m2!1sen!2sca"
                  width="100%"
                  height="100%"
                  style={{
                    border: 0,
                    filter:
                      "invert(1) hue-rotate(180deg) brightness(0.8) contrast(1.2)",
                  }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map showing Montréal, Canada"
                />
              </div>
            </div>
          </motion.section>
        </motion.aside>
      </div>
    </motion.div>
  );
}
