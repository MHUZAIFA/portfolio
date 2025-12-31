"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { hapticManager } from "@/lib/haptic-manager";
import { scaleIn } from "@/components/providers/motion-provider";
import { ArrowRight, ExternalLink } from "lucide-react";
import Image from "next/image";

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  thumbnail?: string;
  technologies?: string[];
  date?: string;
  category?: string;
  featured?: boolean;
  listView?: boolean;
}

export function ProjectCard({
  id,
  name,
  description,
  thumbnail,
  technologies,
  date,
  category,
  featured = false,
  listView = false,
}: ProjectCardProps) {
  if (listView) {
    return (
      <motion.div
        variants={scaleIn}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.99 }}
      >
        <Link href={`/projects/${id}`} onClick={() => hapticManager.light()}>
          <Card className="group relative cursor-pointer overflow-hidden border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/5">
            <div className="flex items-start gap-5">
              {thumbnail && (
                <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-white/5 border border-white/10">
                  <Image
                    src={thumbnail}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="112px"
                  />
                </div>
              )}

              <div className="flex flex-1 items-start justify-between gap-5 min-w-0">
                <div className="flex-1 min-w-0">
                  <div className="mb-3">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-white tracking-tight">
                        {name}
                      </h3>
                      {category && (
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 border border-white/10">
                          {category}
                        </span>
                      )}
                    </div>
                    {date && (
                      <p className="text-xs text-white/50 font-medium tracking-wide uppercase">
                        {date}
                      </p>
                    )}
                  </div>
                  
                  <p className="text-sm text-white/70 leading-6 mb-4 line-clamp-2 group-hover:text-white/80 transition-colors">
                    {description}
                  </p>

                  {technologies && technologies.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      {technologies.slice(0, 5).map((tech, index) => (
                        <span
                          key={tech}
                          className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-white/70 border border-white/10 hover:bg-white/10 hover:text-white/90 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                      {technologies.length > 5 && (
                        <span className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-white/50 border border-white/10">
                          +{technologies.length - 5} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 4 }}
                  className="flex-shrink-0 text-white/40 transition-colors group-hover:text-white/80 mt-1"
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      className={featured ? "md:col-span-2" : ""}
    >
      <Link href={`/projects/${id}`} onClick={() => hapticManager.light()}>
        <Card className="group relative h-full cursor-pointer overflow-hidden border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-0 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5">
          {/* Background gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/0 opacity-0 transition-opacity duration-300 group-hover:from-white/5 group-hover:via-white/2 group-hover:to-white/0 group-hover:opacity-100" />
          
          {thumbnail && (
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-white/10 to-white/5 md:h-56 lg:h-64">
              <Image
                src={thumbnail}
                alt={name}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Category badge */}
              {category && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute top-4 right-4"
                >
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                    {category}
                  </span>
                </motion.div>
              )}
              
              {/* Date badge */}
              {date && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-4 left-4"
                >
                  <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
                    {date.split(" - ")[0]}
                  </span>
                </motion.div>
              )}

              {/* Featured badge */}
              {featured && (
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-gradient-to-r from-yellow-500/90 to-orange-500/90 px-3 py-1 text-xs font-semibold text-black backdrop-blur-sm">
                    ⭐ Featured
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="relative p-6">
            <div className="mb-3 flex items-start justify-between">
              <h3 className="text-xl font-bold text-white transition-colors group-hover:text-white md:text-2xl">
                {name}
              </h3>
              <motion.div
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                className="ml-4 text-white/60 transition-colors group-hover:text-white"
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </div>
            
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-white/70 transition-colors group-hover:text-white/80">
              {description}
            </p>

            {technologies && technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {technologies.slice(0, 4).map((tech, index) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm transition-all hover:bg-white/20"
                  >
                    {tech}
                  </motion.span>
                ))}
                {technologies.length > 4 && (
                  <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
                    +{technologies.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Hover effect line */}
            <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-white/50 to-transparent transition-all duration-300 group-hover:w-full" />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

