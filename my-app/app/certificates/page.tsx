"use client";

import { CertificateGallery } from "@/components/certificate-gallery";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { motion } from "framer-motion";

const certificates = [
  {
    id: "cert-1",
    title: "Full Stack Web Development",
    issuer: "Example Institution",
    date: "2023",
    image: "/placeholder-cert.jpg",
  },
  {
    id: "cert-2",
    title: "Microsoft Dynamics 365",
    issuer: "Microsoft",
    date: "2023",
    image: "/placeholder-cert.jpg",
  },
  {
    id: "cert-3",
    title: "React Advanced Patterns",
    issuer: "Example Platform",
    date: "2022",
    image: "/placeholder-cert.jpg",
  },
  {
    id: "cert-4",
    title: "Node.js Backend Development",
    issuer: "Example Platform",
    date: "2022",
    image: "/placeholder-cert.jpg",
  },
  // Add more certificates as needed
];

export default function CertificatesPage() {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mx-auto max-w-7xl px-4 py-24"
    >
      <motion.h1
        variants={staggerItem}
        className="mb-12 text-4xl font-bold text-white md:text-5xl"
      >
        Certificates
      </motion.h1>

      <CertificateGallery certificates={certificates} />
    </motion.div>
  );
}

