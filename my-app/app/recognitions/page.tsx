"use client";

import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { Award, ExternalLink, Plane, Quote, User, Trophy, X, ZoomIn } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";

interface Honor {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  fullDescription?: string;
  logo?: string;
  image?: string;
  links?: Array<{
    label: string;
    href: string;
  }>;
}

interface Testimonial {
  id: string;
  name: string;
  title: string;
  company: string;
  connection: string;
  date: string;
  relationship: string;
  text: string;
}

const honors: Honor[] = [
  {
    id: "concordia-president",
    title: "Letter of Appreciation",
    issuer: "Concordia University",
    date: "Mar 2025",
    description:
      "Personal letter from Concordia's President, Graham Carr, thanking me for helping make ConUHacks IX a record-breaking success.",
    fullDescription:
      "A letter from Graham Carr, President and Vice-Chancellor of Concordia University (c.c. Mourad Debbabi, Dean of the Gina Cody School of Engineering and Computer Science), thanking me on behalf of Concordia for my work on the organizing committee of the ninth edition of ConUHacks.\n\nThe 24-hour hackathon — the largest of its kind — drew a record-breaking 800 participants tackling general challenges and ones brought by industry sponsors. In his words: \u201cIt couldn\u2019t happen without you.\u201d",
    logo: "/imgs/logos/concordia-c.png",
    image: "/imgs/certificates/awards/Concordia_President_ConUHacks_Letter.jpg",
    links: [
      {
        label: "ConUHacks",
        href: "https://conuhacks.io",
      },
    ],
  },
  {
    id: "0",
    title: "Reward and Recognition",
    issuer: "CitiusTech",
    date: "Jul 2023",
    description:
      "Awarded for exceptional UI/UX and Front-End Development contributions to multiple projects.",
    fullDescription:
      "Awarded for exceptional UI/UX and Front-End Development contributions to multiple projects. This recognition highlights outstanding work in creating user-friendly interfaces and delivering high-quality front-end solutions that enhanced user experience across various healthcare technology platforms.",
    logo: "/imgs/logos/citiustech.jpeg",
    image: "/imgs/certificates/awards/CitiusTech_FullStack_Rnr.png",
    links: [
      {
        label: "CitiusTech Website",
        href: "https://www.citiustech.com",
      },
    ],
  },
  {
    id: "1",
    title: "Spot Award",
    issuer: "Willis Towers Watson",
    date: "Sep 2021",
    description:
      "Awarded for implementing out-of-the-box ideas and overall application performance of multiple projects.",
    fullDescription:
      "Awarded for implementing out-of-the-box ideas and overall application performance of multiple projects. Recognized for innovative problem-solving approaches and significant contributions to improving application performance, which resulted in enhanced user experience and system efficiency.",
    logo: "/imgs/logos/wtw.png",
    image: "/imgs/certificates/awards/WTW_FullStack_Rnr.jpeg",
    links: [
      {
        label: "WTW Website",
        href: "https://www.wtwco.com",
      },
    ],
  },
  {
    id: "2",
    title: "Spot Award",
    issuer: "Willis Towers Watson",
    date: "Jan 2020",
    description:
      "Awarded for adapting rapidly and delivering Microsoft Dynamics 365 project milestones.",
    fullDescription:
      "Awarded for adapting rapidly and delivering Microsoft Dynamics 365 project milestones. Recognized for quick adaptation to new technologies and consistent delivery of project deliverables, demonstrating strong technical skills and commitment to project success.",
    logo: "/imgs/logos/wtw.png",
    image: "/imgs/certificates/awards/WTW_Microsoft_Dynamics_365_Rnr.jpeg",
    links: [
      {
        label: "WTW Website",
        href: "https://www.wtwco.com",
      },
    ],
  },
];

const testimonials: Testimonial[] = [
  {
    id: "alexei",
    name: "Alexei Prosvirine",
    title: "Chief Technology Officer",
    company: "Flexspring",
    connection: "1st degree connection",
    date: "September 14, 2026",
    relationship: "Alexei was Mohammed's mentor",
    text: "Watching Huzaifa grow at Flexspring has been one of the real pleasures of leading my team. He joined us as an intern, and I'd like to claim he was shipping meaningful work before most people finish figuring out where the good coffee is. Within a remarkably short time he was contributing directly to the products our clients depend on, helping us build the next generation of tools that keep Flexspring ahead of the curve in a challenging AI era.\n\nHis technical skills grew fast, and that alone would have made him a great hire. What makes him a rare one is everything around it: real drive, an almost suspicious eye for detail (he finds the solution in areas nobody else sometime to look for, and a positive attitude that holds steady even on deployment day, which is the engineering equivalent of staying cheerful in a thunderstorm.\n\nIf you're looking for someone who takes ownership, sweats the small things, and quietly makes the whole team better just by being on it, Huzaifa is that person. I recommend him without hesitation.",
  },
  {
    id: "evandro",
    name: "Evandro Franca",
    title: "Software Engineer · Architect · Tech Lead",
    company: "Flexspring",
    connection: "1st degree connection",
    date: "September 1, 2026",
    relationship: "Evandro managed Mohammed directly",
    text: "I had the chance to work alongside Huzaifa at Flexspring and follow his whole journey across several very different projects.\n\nHe started as a Software Developer Intern and ended up central to our AI initiatives, helping reshape our products in a space that was new to all of us. Huzaifa moved toward the hardest and least-defined problems available, and delivered on them.\n\nTwo things made that possible. First, his genuine curiosity: he learns quickly because he actually wants to understand how things work, not just how to make them work for now. Second, his reliability: he did what he said he'd do.\n\nI'd work with him again without hesitation.",
  },
  {
    id: "shafiq",
    name: "Shafiq Imtiaz",
    title: "Senior Software Engineer - Principal",
    company: "Flexspring",
    connection: "1st degree connection",
    date: "August 12, 2026",
    relationship: "Shafiq was senior to Mohammed but didn't manage Mohammed directly",
    text: "I've had the opportunity to work with Huzaifa on multiple projects, both at work and at university. He is an exceptional developer with deep knowledge of the SDLC and a disciplined approach to applying it. He is also a talented designer, pairing strong frontend skills with a knack for crafting excellent user experiences. With the rise of AI, he has shown great promise developing multi-turn agentic infrastructure at work, laying the foundation for what's ahead. Beyond that, he is a pleasure to work with, always curious, always pushing the boundaries of software engineering.",
  },
  {
    id: "wei",
    name: "Wei He",
    title: "AI Solutions Architect",
    company: "Major League Hacking",
    connection: "1st degree connection",
    date: "January 27, 2026",
    relationship: "Wei worked with Mohammed but they were at different companies",
    text: "At ConUHacks, I had the opportunity to work with Huzaifa on behalf of Major League Hacking, and he was a cornerstone of the event's success. As VP of Technology, Huzaifa created an environment where people can do their best work and made sure critical work stayed on track from start to finish.\n\nConUHacks X operated at significant scale, with 1000+ participants, 260+ projects, and many mentors and sponsors. Huzaifa's planning, problem-solving, and ability to coordinate effectively under pressure helped the event run smoothly. I would highly recommend him for technical leadership, event coordination, and team mentorship.",
  },
  {
    id: "0",
    name: "Jithin Jain",
    title: "Solutions Architect",
    company: "CitiusTech",
    connection: "1st degree connection",
    date: "February 18, 2024",
    relationship: "Jithin managed Mohammed directly",
    text: "Huzaifa is very passionate about his work and very dedicated. He is a quick learner and a complete full stack developer. He is really good with his technical skills. Had it not been his higher education, I would have loved to see him continue and grow in my team. The client was also happy with his work. Wish you the best for your future endeavours!",
  },
  {
    id: "1",
    name: "Chris Bass",
    title: "Senior Product Owner",
    company: "DXC Technology",
    connection: "1st degree connection",
    date: "February 5, 2024",
    relationship: "Chris worked with Mohammed on the same team",
    text: "I worked in the same team as Huzaifa for just under 2 years as Product Owner when he was a Developer at WTW.\n\nHuzaifa was a great communicator. He was vocal in meetings, whilst allowing others to speak, he had great ideas and solutions and articulated them in a clear and concise way, he asked very sensible questions and took the answers on board and applied them to whatever was required.\n\nHuzaifa was a great developer and I always new that whatever he delivered would be done efficiently and according to the ACs & designs with, thoughts for future proofing, and this always gave me good confidence in the quality of the products that we delivered.\n\nOn a social aspect, I always got on well with Huzaifa and found him a really enjoyable character to work with and he was a good team player.\n\nI have no doubt the Huzaifa will be successful in whatever he puts his talents too and will continue to develop, grow and succeed",
  },
];

type TabType = "all" | "awards" | "recommendations";

const MONTHS: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
const monthValue = (d: string) => {
  const m = d.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(?:\d{1,2},\s+)?(\d{4})/);
  return m ? +m[2] * 12 + MONTHS[m[1]] : 0;
};
/** "Sep 2021" / "February 18, 2024" → "SEP '21" */
const shortDate = (d: string) => {
  const m = d.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\w*\s+(?:\d{1,2},\s+)?(\d{4})/);
  return m ? `${m[1].toUpperCase()} '${m[2].slice(2)}` : d.toUpperCase();
};

const sortedHonors = [...honors].sort((a, b) => monthValue(b.date) - monthValue(a.date));

const companyLogo = (company: string) =>
  company === "CitiusTech"
    ? "/imgs/logos/citiustech.jpeg"
    : company === "Flexspring"
      ? "/imgs/logos/flexspring.jpeg"
      : company === "Major League Hacking"
        ? "/imgs/logos/mlh.png"
      : company === "DXC Technology" || company.includes("WTW")
        ? "/imgs/logos/wtw.png"
        : null;

/** Short label for how the recommender knew me, from LinkedIn's relationship line. */
const relationLabel = (r: string) =>
  /managed .* directly/i.test(r) && !/didn.t manage/i.test(r)
    ? "Manager"
    : /mentor/i.test(r)
      ? "Mentor"
      : /senior to/i.test(r)
        ? "Senior colleague"
        : /different companies/i.test(r)
          ? "Collaborator"
          : "Teammate";

const sortedTestimonials = [...testimonials].sort((a, b) => monthValue(b.date) - monthValue(a.date));

const TABS: { id: TabType; label: string; count: number; Icon?: typeof Trophy }[] = [
  { id: "all", label: "All", count: honors.length + testimonials.length },
  { id: "awards", label: "Awards", count: honors.length, Icon: Trophy },
  { id: "recommendations", label: "Recommendations", count: testimonials.length, Icon: Quote },
];

/** Shared ticket surface: near-black gradient, 2px border, soft shadow (matches the experience page). */
const TICKET =
  "group relative overflow-hidden rounded-2xl bg-linear-to-br from-[#121212] to-[#050505] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_24px_48px_-24px_rgba(0,0,0,0.9),0_12px_40px_-16px_rgba(255,255,255,0.06)] transition-shadow duration-300";

/** Ticket edge drawn as an overlay (not a CSS border) so the notches can cut through it and the outline curves round them. */
function Edge() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-white/10 transition-colors duration-300 group-hover:border-white/20"
    />
  );
}

function Perforation() {
  return (
    <div className="relative h-0" aria-hidden="true">
      <span className="absolute inset-x-5 -top-px h-0.5 bg-[radial-gradient(circle,rgba(255,255,255,0.22)_1px,transparent_1.5px)] bg-size-[8px_2px]" />
      <span className="absolute left-0 -top-3 h-6 w-3 rounded-tr-full rounded-br-full border-2 border-l-0 border-white/10 bg-black transition-colors duration-300 group-hover:border-white/20" />
      <span className="absolute right-0 -top-3 h-6 w-3 rounded-tl-full rounded-bl-full border-2 border-r-0 border-white/10 bg-black transition-colors duration-300 group-hover:border-white/20" />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="mb-2 font-mono text-xs uppercase tracking-[0.3em] text-red-400">{children}</p>;
}

export default function RecognitionPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedHonor, setSelectedHonor] = useState<Honor | null>(null);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    if (!selectedHonor) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelectedHonor(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedHonor]);

  const reveal = (i: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.5, ease: "easeOut" as const, delay: i * 0.08 },
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background: faint grid + red horizon glow */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.35) 0%, transparent 70%)", filter: "blur(90px)" }}
        />
        <div className="absolute inset-0 opacity-[0.04]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="recog-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#recog-grid)" />
          </svg>
        </div>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 md:mt-12 md:px-8 md:pt-12"
      >
        {/* Header */}
        <motion.p variants={staggerItem} className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-red-400">
          <Plane className="h-3.5 w-3.5" /> COMMENDATIONS
        </motion.p>
        <motion.h1 variants={staggerItem} className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          Recognitions
        </motion.h1>
        <motion.p variants={staggerItem} className="mb-8 text-sm text-white/75 md:text-base">
          Throughout my career, I&apos;ve been fortunate to receive recognition for my contributions to various projects and
          initiatives. These awards and recommendations reflect my commitment to excellence, innovation, and delivering
          exceptional results.
        </motion.p>

        {/* Tabs */}
        <motion.div
          variants={staggerItem}
          // Phones: one row that scrolls sideways (edge to edge); wider screens: wrap
          className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0 [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="Filter recognitions"
        >
          {TABS.map((t) => {
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  hapticManager.light();
                  setActiveTab(t.id);
                }}
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider transition-colors md:px-4 md:py-2 md:text-[11px] md:tracking-widest ${
                  active ? "border-white bg-white text-black" : "border-white/15 text-white/70 hover:border-white/40 hover:text-white"
                }`}
              >
                {t.Icon && <t.Icon className="h-3 w-3 md:h-3.5 md:w-3.5" />}
                {t.label} <span className={active ? "text-black/50" : "text-white/40"}>{t.count}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Awards */}
        {(activeTab === "all" || activeTab === "awards") && (
          <section className="mb-16" aria-labelledby="awards-heading">
            {activeTab === "all" && (
              <>
                <SectionLabel>Awards</SectionLabel>
                <h2 id="awards-heading" className="mb-8 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  Honours along the route
                </h2>
              </>
            )}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {sortedHonors.map((honor, i) => (
                <motion.article key={honor.id} {...reveal(i)} className={`flex flex-col ${TICKET}`}>
                  <Edge />
                  {honor.image && (
                    <button
                      type="button"
                      onClick={() => {
                        hapticManager.light();
                        setSelectedHonor(honor);
                      }}
                      className="relative m-3 mb-0 block overflow-hidden rounded-xl border border-white/10 bg-black"
                      aria-label={`View ${honor.title} certificate`}
                    >
                      <Image
                        src={honor.image}
                        alt={`${honor.title} certificate`}
                        width={400}
                        height={300}
                        loading={i < 2 ? "eager" : "lazy"}
                        className="aspect-4/3 h-auto w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                        <ZoomIn className="h-7 w-7 text-white" />
                      </span>
                    </button>
                  )}

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start gap-3">
                      {honor.logo ? (
                        <Image src={honor.logo} alt={`${honor.issuer} logo`} width={44} height={44} loading="lazy" className="h-11 w-11 shrink-0 rounded-md object-contain" />
                      ) : (
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-white/10">
                          <Award className="h-5 w-5 text-white/80" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Commendation</p>
                        <h3 className="text-lg font-semibold leading-snug text-white">{honor.title}</h3>
                      </div>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/15">
                        <Trophy className="h-4 w-4 text-red-300" />
                      </span>
                    </div>
                    <p className="mt-4 line-clamp-3 text-justify text-sm leading-relaxed text-white/70 hyphens-auto">{honor.description}</p>
                  </div>

                  <Perforation />
                  <div className="flex items-center justify-between gap-3 px-5 py-4">
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Issued by</p>
                      <p className="flex items-center gap-1.5 truncate text-sm text-white">
                        {honor.issuer}
                        {honor.links?.[0] && (
                          <a href={honor.links[0].href} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white" aria-label={honor.links[0].label}>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Date</p>
                      <p className="font-mono text-sm font-semibold text-white">{shortDate(honor.date)}</p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {(activeTab === "all" || activeTab === "recommendations") && (
          <section aria-labelledby="recs-heading">
            {activeTab === "all" && (
              <>
                <SectionLabel>Recommendations</SectionLabel>
                <h2 id="recs-heading" className="mb-3 text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  Words from the crew
                </h2>
                <p className="mb-8 text-sm text-white/70 md:text-base">
                  I&apos;m grateful to have worked with exceptional colleagues and managers who have provided valuable feedback
                  and recommendations. These testimonials reflect the collaborative relationships I&apos;ve built and the impact of
                  my work across different projects and teams.
                </p>
              </>
            )}
            <div className="columns-1 gap-6 lg:columns-2">
              {sortedTestimonials.map((t, i) => {
                const logo = companyLogo(t.company);
                return (
                  <motion.article key={t.id} {...reveal(i)} className={`mb-6 flex break-inside-avoid flex-col ${TICKET}`}>
                    <Edge />
                    <div className="flex flex-1 gap-4 p-5 md:p-7">
                      <Quote className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                      <p className="whitespace-pre-line text-justify text-sm leading-relaxed text-white/85 hyphens-auto md:text-base">{t.text}</p>
                    </div>
                    <Perforation />
                    <div className="flex items-center gap-4 px-5 py-4 md:px-7">
                      {logo ? (
                        <Image src={logo} alt={`${t.company} logo`} width={40} height={40} loading="lazy" className="h-10 w-10 shrink-0 rounded-md object-cover" />
                      ) : (
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/10">
                          <User className="h-5 w-5 text-white/60" />
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-white">{t.name}</p>
                        <p className="truncate text-xs text-white/55">
                          {t.title} · {t.company}
                        </p>
                      </div>
                      <div className="hidden shrink-0 text-right sm:block">
                        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">{relationLabel(t.relationship)}</p>
                        <p className="font-mono text-sm font-semibold text-white">{shortDate(t.date)}</p>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </section>
        )}
      </motion.div>

      {/* Certificate viewer */}
      <AnimatePresence>
        {selectedHonor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedHonor(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedHonor.title} certificate`}
          >
            <button
              type="button"
              onClick={() => setSelectedHonor(null)}
              className="absolute right-4 top-4 z-10 rounded-full border border-white/15 bg-black/60 p-3 text-white transition-colors hover:border-white/40"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              className="relative flex w-full max-w-6xl flex-col overflow-hidden rounded-2xl border-2 border-white/10 bg-linear-to-br from-[#121212] to-[#050505] md:flex-row md:items-stretch"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedHonor.image && (
                <div className="flex w-full items-center justify-center bg-black p-2 md:w-2/3 md:shrink-0">
                  <Image
                    src={selectedHonor.image}
                    alt={`${selectedHonor.title} certificate`}
                    width={1600}
                    height={2400}
                    loading="eager"
                    className="h-auto max-h-[85vh] w-full object-contain"
                  />
                </div>
              )}
              <div className="flex w-full flex-col overflow-y-auto p-6 md:w-1/3 md:p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-400">Commendation</p>
                <h3 className="mt-1 text-2xl font-bold text-white">{selectedHonor.title}</h3>
                <div className="mt-4 grid grid-cols-2 gap-4 border-y border-white/10 py-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Issued by</p>
                    <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-white">
                      {selectedHonor.issuer}
                      {selectedHonor.links?.[0] && (
                        <a href={selectedHonor.links[0].href} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white" aria-label={selectedHonor.links[0].label}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Date</p>
                    <p className="mt-1 font-mono text-sm font-semibold text-white">{shortDate(selectedHonor.date)}</p>
                  </div>
                </div>
                <p className="mt-5 whitespace-pre-line text-justify text-sm leading-relaxed text-white/80 hyphens-auto md:text-base">
                  {selectedHonor.fullDescription || selectedHonor.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
