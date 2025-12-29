"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

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
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    hapticManager.medium();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Replace with your actual API endpoint
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

  const handleChange = (
    field: keyof FormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mx-auto max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div variants={staggerItem} className="space-y-2">
              <Label htmlFor="firstName" className="text-white/80">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                placeholder="John"
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-sm text-red-400">{errors.firstName}</p>
              )}
            </motion.div>

            <motion.div variants={staggerItem} className="space-y-2">
              <Label htmlFor="lastName" className="text-white/80">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                placeholder="Doe"
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="text-sm text-red-400">{errors.lastName}</p>
              )}
            </motion.div>
          </div>

          <motion.div variants={staggerItem} className="space-y-2">
            <Label htmlFor="email" className="text-white/80">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              placeholder="john.doe@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email}</p>
            )}
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-2">
            <Label htmlFor="subject" className="text-white/80">
              Subject
            </Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              placeholder="Project inquiry, collaboration, feedback..."
              disabled={isSubmitting}
            />
            {errors.subject && (
              <p className="text-sm text-red-400">{errors.subject}</p>
            )}
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-2">
            <Label htmlFor="message" className="text-white/80">
              Message
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              className="min-h-[150px] bg-white/5 border-white/10 text-white placeholder:text-white/40"
              placeholder="Your message here..."
              disabled={isSubmitting}
            />
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Share as much detail as you’d like.</span>
              <span>{formData.message.length}/1000</span>
            </div>
            {errors.message && (
              <p className="text-sm text-red-400">{errors.message}</p>
            )}
          </motion.div>

          <motion.div variants={staggerItem}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-white/90"
              onClick={() => hapticManager.medium()}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </motion.div>

        {submitStatus === "success" && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-green-400"
          >
            Message sent successfully!
          </motion.p>
        )}

        {submitStatus === "error" && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-red-400"
          >
            Failed to send message. Please try again.
          </motion.p>
        )}
      </form>
    </motion.div>
  );
}

