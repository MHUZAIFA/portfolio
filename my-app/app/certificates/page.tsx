"use client";

import { CertificateGallery } from "@/components/certificate-gallery";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { motion } from "framer-motion";
import { useState } from "react";
import { Grid, Folder } from "lucide-react";

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
  const [viewMode, setViewMode] = useState<"gallery" | "folder">("gallery");

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="mx-auto max-w-7xl px-4 py-24 mt-12"
    >
      <div className="mb-12 flex flex-col lg:flex-row gap-4 lg:gap-0 items-start lg:items-center lg:justify-between">
        <motion.h1
          variants={staggerItem}
          className="text-4xl font-bold text-white md:text-5xl"
        >
          Certificates
        </motion.h1>
        <motion.div
          variants={staggerItem}
          className="flex gap-1 rounded-lg border border-white/10 bg-white/5 p-1"
        >
          <button
            onClick={() => setViewMode("gallery")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              viewMode === "gallery"
                ? "bg-white text-black shadow-sm"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Grid className="h-4 w-4" />
            Gallery
          </button>
          <button
            onClick={() => setViewMode("folder")}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              viewMode === "folder"
                ? "bg-white text-black shadow-sm"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Folder className="h-4 w-4" />
            Folders
          </button>
        </motion.div>
      </div>

      <CertificateGallery certificates={certificates} viewMode={viewMode} />
    </motion.div>
  );
}

