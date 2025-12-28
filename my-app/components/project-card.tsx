"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { hapticManager } from "@/lib/haptic-manager";
import { scaleIn } from "@/components/providers/motion-provider";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  technologies?: string[];
}

export function ProjectCard({
  id,
  name,
  description,
  thumbnail,
  technologies,
}: ProjectCardProps) {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/projects/${id}`} onClick={() => hapticManager.light()}>
        <Card className="group h-full cursor-pointer border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10">
          {thumbnail && (
            <div className="mb-4 aspect-video w-full overflow-hidden rounded-lg bg-white/5">
              <img
                src={thumbnail}
                alt={name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
          )}
          <h3 className="mb-2 text-xl font-semibold text-white">{name}</h3>
          <p className="mb-4 text-sm text-white/70">{description}</p>
          {technologies && technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {technologies.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80"
                >
                  {tech}
                </span>
              ))}
              {technologies.length > 3 && (
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                  +{technologies.length - 3}
                </span>
              )}
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
}

