"use client";

import { useMemo, useState, FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Handshake,
  Lightbulb,
  MessageCircle,
  Loader2,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { hapticManager } from "@/lib/haptic-manager";
import {
  staggerContainer,
  staggerItem,
} from "@/components/providers/motion-provider";
import { cn } from "@/lib/utils";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  intent: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const MESSAGE_LIMIT = 1000;

const intents = [
  {
    id: "project",
    label: "Project inquiry",
    icon: Briefcase,
    subjectSeed: "Project inquiry — ",
  },
  {
    id: "collab",
    label: "Collaboration",
    icon: Handshake,
    subjectSeed: "Collaboration on ",
  },
  {
    id: "idea",
    label: "Idea / feedback",
    icon: Lightbulb,
    subjectSeed: "Quick idea: ",
  },
  {
    id: "chat",
    label: "Just say hi",
    icon: MessageCircle,
    subjectSeed: "Saying hi — ",
  },
] as const;

const inputBase =
  "h-11 rounded-sm border-white/10 bg-white/[0.04] px-3.5 text-sm text-white placeholder:text-white/35 transition-all duration-200 hover:border-white/15 focus:bg-white/[0.06] focus-visible:border-sky-400/60 focus-visible:ring-2 focus-visible:ring-sky-400/15";

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
    intent: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const messageLength = formData.message.length;
  const messageOverLimit = messageLength > MESSAGE_LIMIT;
  const messageWarn = messageLength > MESSAGE_LIMIT * 0.85;

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject should be at least 5 characters";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 20) {
      newErrors.message = "Tell me a bit more — at least 20 characters";
    } else if (messageOverLimit) {
      newErrors.message = `Please keep it under ${MESSAGE_LIMIT} characters`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    hapticManager.medium();

    if (!validate()) {
      hapticManager.heavy();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
          intent: "",
        });
        hapticManager.pattern([10, 50, 10]);
      } else {
        setSubmitStatus("error");
        hapticManager.heavy();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      hapticManager.heavy();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field in errors && errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleIntentSelect = (intentId: string) => {
    hapticManager.light();
    const seed = intents.find((i) => i.id === intentId)?.subjectSeed ?? "";
    setFormData((prev) => ({
      ...prev,
      intent: prev.intent === intentId ? "" : intentId,
      subject:
        prev.intent === intentId
          ? prev.subject
          : prev.subject.length === 0
            ? seed
            : prev.subject,
    }));
  };

  const messageCounterColor = useMemo(() => {
    if (messageOverLimit) return "text-rose-400";
    if (messageWarn) return "text-amber-300";
    return "text-white/40";
  }, [messageOverLimit, messageWarn]);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="relative"
    >
      <AnimatePresence mode="wait">
          {submitStatus === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="relative flex flex-col items-center justify-center gap-3 py-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 18,
                  delay: 0.1,
                }}
                className="rounded-sm bg-emerald-500/15 p-3 ring-1 ring-emerald-400/40"
              >
                <CheckCircle2 className="h-8 w-8 text-emerald-300" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white">
                Message sent — thank you!
              </h3>
              <p className="max-w-sm text-sm text-white/60">
                I&apos;ll get back to you within 24 hours. In the meantime,
                feel free to explore my{" "}
                <Link
                  href="/projects"
                  className="text-sky-300 underline-offset-4 hover:underline"
                >
                  projects
                </Link>
                .
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSubmitStatus("idle")}
                className="mt-3 border-white/15 bg-white/5 text-white hover:bg-white/10"
              >
                Send another message
              </Button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="relative space-y-6"
              noValidate
            >
              <motion.div variants={staggerItem} className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
                  What&apos;s this about?
                </p>
                <div className="flex flex-wrap gap-2">
                  {intents.map((intent) => {
                    const Icon = intent.icon;
                    const active = formData.intent === intent.id;
                    return (
                      <button
                        key={intent.id}
                        type="button"
                        onClick={() => handleIntentSelect(intent.id)}
                        className={cn(
                          "group inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                          active
                            ? "border-sky-400/40 bg-sky-500/15 text-sky-100 shadow-sm shadow-sky-500/10"
                            : "border-white/10 bg-white/[0.04] text-white/70 hover:border-white/20 hover:bg-white/[0.07] hover:text-white",
                        )}
                        aria-pressed={active}
                      >
                        <Icon
                          className={cn(
                            "h-3.5 w-3.5 transition-colors",
                            active ? "text-sky-200" : "text-white/55",
                          )}
                        />
                        {intent.label}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <motion.div variants={staggerItem} className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs text-white/65">
                    First name
                  </Label>
                  <Input
                    id="firstName"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleChange("firstName", e.target.value)
                    }
                    className={cn(
                      inputBase,
                      errors.firstName && "border-rose-400/60",
                    )}
                    placeholder="Ada"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-rose-300">
                      {errors.firstName}
                    </p>
                  )}
                </motion.div>

                <motion.div variants={staggerItem} className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs text-white/65">
                    Last name
                  </Label>
                  <Input
                    id="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className={cn(
                      inputBase,
                      errors.lastName && "border-rose-400/60",
                    )}
                    placeholder="Lovelace"
                    disabled={isSubmitting}
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-rose-300">{errors.lastName}</p>
                  )}
                </motion.div>
              </div>

              <motion.div variants={staggerItem} className="space-y-2">
                <Label htmlFor="email" className="text-xs text-white/65">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={cn(
                    inputBase,
                    errors.email && "border-rose-400/60",
                  )}
                  placeholder="ada@example.com"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                />
                {errors.email && (
                  <p className="text-xs text-rose-300">{errors.email}</p>
                )}
              </motion.div>

              <motion.div variants={staggerItem} className="space-y-2">
                <Label htmlFor="subject" className="text-xs text-white/65">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className={cn(
                    inputBase,
                    errors.subject && "border-rose-400/60",
                  )}
                  placeholder="Tell me what you have in mind"
                  disabled={isSubmitting}
                  maxLength={120}
                  aria-invalid={!!errors.subject}
                />
                {errors.subject && (
                  <p className="text-xs text-rose-300">{errors.subject}</p>
                )}
              </motion.div>

              <motion.div variants={staggerItem} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="message" className="text-xs text-white/65">
                    Message
                  </Label>
                  <span
                    className={cn(
                      "text-[11px] font-mono tabular-nums",
                      messageCounterColor,
                    )}
                  >
                    {messageLength}/{MESSAGE_LIMIT}
                  </span>
                </div>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className={cn(
                    "min-h-[150px] resize-y rounded-sm border-white/10 bg-white/[0.04] px-3.5 py-3 text-sm text-white placeholder:text-white/35 transition-all duration-200 hover:border-white/15 focus:bg-white/[0.06] focus-visible:border-sky-400/60 focus-visible:ring-2 focus-visible:ring-sky-400/15",
                    errors.message && "border-rose-400/60",
                  )}
                  placeholder="A few sentences about what you're working on, timelines, links to anything relevant…"
                  disabled={isSubmitting}
                  aria-invalid={!!errors.message}
                />
                {errors.message ? (
                  <p className="text-xs text-rose-300">{errors.message}</p>
                ) : (
                  <p className="text-[11px] text-white/40">
                    The more context, the faster I can give you a useful reply.
                  </p>
                )}
              </motion.div>

              <motion.div
                variants={staggerItem}
                className="flex flex-col-reverse items-stretch gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="inline-flex items-center gap-1.5 text-[11px] text-white/45">
                  <ShieldCheck className="h-3.5 w-3.5 text-white/40" />
                  Your details stay private — never shared, never sold.
                </p>
                <Button
                  type="submit"
                  disabled={isSubmitting || messageOverLimit}
                  onClick={() => hapticManager.medium()}
                  className="group relative h-11 overflow-hidden rounded-sm bg-white px-5 text-sm font-semibold text-black shadow-lg shadow-white/10 transition-all hover:shadow-white/20 disabled:opacity-70"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative inline-flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        Send message
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </span>
                </Button>
              </motion.div>

              <AnimatePresence>
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-start gap-2 rounded-sm border border-rose-400/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200"
                  >
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>
                      Something went wrong sending your message. Please try
                      again, or email me directly at{" "}
                      <a
                        href="mailto:mhuzaifa.career@outlook.com"
                        className="underline underline-offset-2"
                      >
                        mhuzaifa.career@outlook.com
                      </a>
                      .
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.form>
          )}
      </AnimatePresence>
    </motion.div>
  );
}
