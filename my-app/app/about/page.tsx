"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { staggerContainer, staggerItem } from "@/components/providers/motion-provider";
import { useState } from "react";
import {
  MessageCircle,
  Users,
  Lightbulb,
  Clock,
  Crown,
  RefreshCw,
  Brain,
  Eye,
  BarChart3,
  Tag,
  Sparkles,
  Play,
  Database,
  Cloud
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  SiReact,
  SiAngular,
  SiNextdotjs,
  SiHtml5,
  SiBootstrap,
  SiCss3,
  SiJavascript,
  SiSass,
  SiExpress,
  SiDotnet,
  SiPhp,
  SiApachecassandra,
  SiMongodb,
  SiFirebase,
  SiRedis,
  SiTypescript,
  SiSharp,
  SiPython,
  SiC,
  SiCplusplus,
  SiN8N,
  SiJenkins,
  SiVercel,
  SiDocker,
  SiKubernetes,
  SiGit,
  SiGithub,
  SiGitlab,
  SiBitbucket,
  SiOverleaf,
  SiOpenai,
  SiGooglegemini,
  SiGooglecloud,
  SiSpringboot,
  SiQuarkus,
  SiTailwindcss,
  SiShadcnui,
  SiMaterialdesign,
  SiMui
} from "react-icons/si";
import {
  FaJava,
  FaMicrosoft,
  FaFilePowerpoint,
  FaFileWord,
  FaFileExcel,
  FaAws
} from "react-icons/fa";
import type { IconType } from "react-icons";
import Link from "next/link";
import Image from "next/image";