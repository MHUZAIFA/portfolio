"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaEnvelope,
  FaInstagram,
  FaFacebook,
  FaSpotify,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import { hapticManager } from "@/lib/haptic-manager";
import { staggerItem } from "@/components/providers/motion-provider";

type Social = {
  name: string;
  handle: string;
  url: string;
  icon: IconType;
  brand: string;
  iconColor: string;
};

const socials: Social[] = [
  {
    name: "GitHub",
    handle: "@mhuzaifa",
    url: "https://github.com/mhuzaifa",
    icon: FaGithub,
    brand: "bg-white/10 ring-white/15 group-hover:bg-white/20 group-hover:ring-white/30",
    iconColor: "text-white",
  },
  {
    name: "LinkedIn",
    handle: "huzaifa-anjum",
    url: "https://www.linkedin.com/in/huzaifa-anjum/",
    icon: FaLinkedin,
    brand:
      "bg-[#0a66c2]/15 ring-[#0a66c2]/30 group-hover:bg-[#0a66c2]/25 group-hover:ring-[#0a66c2]/50",
    iconColor: "text-[#4ea3ff]",
  },
  {
    name: "Email",
    handle: "mhuzaifa.career@outlook.com",
    url: "mailto:mhuzaifa.career@outlook.com",
    icon: FaEnvelope,
    brand:
      "bg-emerald-500/15 ring-emerald-400/25 group-hover:bg-emerald-500/25 group-hover:ring-emerald-400/40",
    iconColor: "text-emerald-300",
  },
  {
    name: "X / Twitter",
    handle: "@_huzaifaanjum_",
    url: "https://x.com/_huzaifaanjum_",
    icon: FaXTwitter,
    brand:
      "bg-white/8 ring-white/15 group-hover:bg-white/15 group-hover:ring-white/25",
    iconColor: "text-white",
  },
  {
    name: "Instagram",
    handle: "@_huzaifaanjum_",
    url: "https://www.instagram.com/_huzaifaanjum_",
    icon: FaInstagram,
    brand:
      "bg-gradient-to-br from-[#f58529]/25 via-[#dd2a7b]/25 to-[#8134af]/25 ring-pink-400/25 group-hover:ring-pink-400/40",
    iconColor: "text-pink-200",
  },
  {
    name: "Facebook",
    handle: "huzaifa.rock.75",
    url: "https://www.facebook.com/huzaifa.rock.75",
    icon: FaFacebook,
    brand:
      "bg-[#1877f2]/15 ring-[#1877f2]/30 group-hover:bg-[#1877f2]/25 group-hover:ring-[#1877f2]/50",
    iconColor: "text-[#5b9cff]",
  },
  {
    name: "Spotify",
    handle: "Listen along",
    url: "https://open.spotify.com/user/hfyhrwd4gyaut1lpozi6gwys4?si=AwsN2S3uTEeHWGsMDArZug&nd=1&dlsi=6287d75db3584a7d",
    icon: FaSpotify,
    brand:
      "bg-[#1db954]/15 ring-[#1db954]/30 group-hover:bg-[#1db954]/25 group-hover:ring-[#1db954]/50",
    iconColor: "text-[#1ed760]",
  },
];

export function SocialCards() {
  return (
    <ul className="divide-y divide-white/5 border-y border-white/5">
      {socials.map((social, index) => {
        const Icon = social.icon;
        const isMail = social.url.startsWith("mailto:");
        return (
          <motion.li
            key={social.name}
            variants={staggerItem}
            transition={{ delay: 0.03 * index }}
          >
            <a
              href={social.url}
              target={isMail ? undefined : "_blank"}
              rel={isMail ? undefined : "noopener noreferrer"}
              onClick={() => hapticManager.light()}
              aria-label={`Open ${social.name}`}
              className="group flex items-center gap-4 py-3 transition-colors focus-visible:outline-none"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ring-1 transition-all duration-300 ${social.brand}`}
              >
                <Icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${social.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/90 transition-colors group-hover:text-white">
                  {social.name}
                </p>
                <p className="truncate text-xs text-white/45">
                  {social.handle}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-white/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white/80" />
            </a>
          </motion.li>
        );
      })}
    </ul>
  );
}
