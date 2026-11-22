"use client";

import { CertificateGallery } from "@/components/certificate-gallery";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";

const certificates = [
  // Angular Certificates
  {
    id: "angular-cli",
    title: "Angular CLI Course",
    issuer: "Angular",
    date: "2024",
    image: "/imgs/certificates/angular/Angular-CLI-Course.png",
  },
  {
    id: "angular-forms",
    title: "Angular Forms Course",
    issuer: "Angular",
    date: "2024",
    image: "/imgs/certificates/angular/Angular-Forms-Course.png",
  },
  {
    id: "angular-getting-started",
    title: "Angular Getting Started Course",
    issuer: "Angular",
    date: "2024",
    image: "/imgs/certificates/angular/Angular-Getting-Started-Course.png",
  },
  {
    id: "angular-big-picture",
    title: "Angular: The Big Picture",
    issuer: "Angular",
    date: "2024",
    image: "/imgs/certificates/angular/Angular-The-Big-Picture.png",
  },
  {
    id: "angular-http",
    title: "Angular HTTP Communication",
    issuer: "Angular",
    date: "2024",
    image: "/imgs/certificates/angular/Angular-HTTP-Communication.png",
  },
  {
    id: "angular-security",
    title: "Securing Angular Apps with OpenID Connect and OAuth 2",
    issuer: "Angular",
    date: "2024",
    image: "/imgs/certificates/angular/Angular-Security-OpenID-OAuth2.png",
  },
  // AWS Certificates
  {
    id: "aws-ai-practitioner",
    title: "AWS AI Practitioner",
    issuer: "AWS",
    date: "2024",
    image: "/imgs/certificates/aws/AWS AI Practioner.png",
  },
  {
    id: "aws-ai-security",
    title: "AWS AI Security",
    issuer: "AWS",
    date: "2024",
    image: "/imgs/certificates/aws/AWS AI Security.png",
  },
  {
    id: "aws-ai-use-cases",
    title: "AWS AI Use Cases and Applications",
    issuer: "AWS",
    date: "2024",
    image: "/imgs/certificates/aws/AWS AI Use Cases and Applications.png",
  },
  {
    id: "aws-genai-solutions",
    title: "AWS Developing GenAI Solutions",
    issuer: "AWS",
    date: "2024",
    image: "/imgs/certificates/aws/AWS Developing GenAI Solutions.png",
  },
  {
    id: "aws-ml-solutions",
    title: "AWS Developing ML Solutions",
    issuer: "AWS",
    date: "2024",
    image: "/imgs/certificates/aws/AWS Developing ML Solutions.png",
  },
  {
    id: "aws-ml-ai-fundamentals",
    title: "AWS ML AI Fundamentals",
    issuer: "AWS",
    date: "2024",
    image: "/imgs/certificates/aws/AWS ML AI Fundamentals.png",
  },
  {
    id: "aws-optimizing-models",
    title: "AWS Optimizing Foundation Models",
    issuer: "AWS",
    date: "2024",
    image: "/imgs/certificates/aws/AWS Optimizing Foundation Models.png",
  },
  {
    id: "aws-prompt-engineering",
    title: "AWS Prompt Engineering",
    issuer: "AWS",
    date: "2024",
    image: "/imgs/certificates/aws/AWS Prompt engineering.png",
  },
  {
    id: "aws-responsible-ai",
    title: "AWS Responsible AI Practices",
    issuer: "AWS",
    date: "2024",
    image: "/imgs/certificates/aws/AWS Responsible AI Practices.png",
  },
  // Microsoft Certificates
  {
    id: "azure-fundamentals",
    title: "Microsoft Azure Fundamentals",
    issuer: "Microsoft",
    date: "2024",
    image: "/imgs/certificates/microsoft/Microsoft Azure Fundamentals.png",
  },
  {
    id: "d365-101",
    title: "Microsoft D365 101",
    issuer: "Microsoft",
    date: "2024",
    image: "/imgs/certificates/microsoft/Microsoft D365 101.png",
  },
  {
    id: "d365-customization",
    title: "Microsoft D365 Customization and Configuration",
    issuer: "Microsoft",
    date: "2024",
    image: "/imgs/certificates/microsoft/Microsoft D365 Customization and Configuration.png",
  },
  {
    id: "d365-getting-started",
    title: "Microsoft D365 Getting Started",
    issuer: "Microsoft",
    date: "2024",
    image: "/imgs/certificates/microsoft/Microsoft D365 Getting Started.png",
  },
  {
    id: "dotnet-core-ef",
    title: "Microsoft .NET Core and Entity Framework Core",
    issuer: "Microsoft",
    date: "2024",
    image: "/imgs/certificates/microsoft/Microsoft Dotnet core and entity framework core.png",
  },
  {
    id: "html5-css3-js",
    title: "Programming in HTML5, CSS3, and JavaScript",
    issuer: "Microsoft",
    date: "2024",
    image: "/imgs/certificates/microsoft/Microsoft Programming in HTML5 CSS3 JavaScript.png",
  },
  // Other Certificates
  {
    id: "azure-devops",
    title: "Continuous Delivery and DevOps with Azure DevOps",
    issuer: "Microsoft",
    date: "2024",
    image: "/imgs/certificates/others/Azure-DevOps-Continuous-Delivery.png",
  },
  {
    id: "prompt-engineering-chatgpt",
    title: "Prompt Engineering for ChatGPT",
    issuer: "Other",
    date: "2024",
    image: "/imgs/certificates/others/Prompt engineering for chatgpt.png",
  },
  {
    id: "sql",
    title: "SQL",
    issuer: "Other",
    date: "2024",
    image: "/imgs/certificates/others/sql.png",
  },
];

export default function CertificatesPage() {
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
              <pattern id="cert-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cert-grid)" />
          </svg>
        </div>
      </div>

      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 md:mt-12 md:px-8 md:pt-24"
      >
        <motion.p variants={staggerItem} className="mb-3 flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-red-400">
          <Plane className="h-3.5 w-3.5" /> LICENCE &amp; RATINGS
        </motion.p>
        <motion.h1 variants={staggerItem} className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          Certificates
        </motion.h1>
        <motion.p variants={staggerItem} className="mb-10 max-w-2xl text-sm text-white/75 md:text-base">
          Every course I&apos;ve completed, logged like type ratings on a pilot&apos;s licence. Open one to inspect the
          original.
        </motion.p>

        <motion.div variants={staggerItem}>
          <CertificateGallery certificates={certificates} />
        </motion.div>
      </motion.div>
    </div>
  );
}
