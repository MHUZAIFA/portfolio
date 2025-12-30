"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { hapticManager } from "@/lib/haptic-manager";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  Home,
  User,
  Briefcase,
  FolderOpen,
  Award,
  Heart,
  Mail,
  Search,
  Command,
  ArrowRight,
  Trophy,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home, keywords: ["home", "main", "landing"] },
  { href: "/about", label: "About", icon: User, keywords: ["about", "me", "info", "profile"] },
  { href: "/experience", label: "Experience", icon: Briefcase, keywords: ["experience", "work", "career", "jobs", "employment", "education", "university", "degree", "school", "academic", "studies"] },
  { href: "/projects", label: "Projects", icon: FolderOpen, keywords: ["projects", "portfolio", "work", "apps"] },
  { href: "/certificates", label: "Certificates", icon: Award, keywords: ["certificates", "certifications", "credentials"] },
  { href: "/recognitions", label: "Recognitions", icon: Trophy, keywords: ["honors", "awards", "recognition", "achievements", "rewards", "testimonials", "recommendations", "reviews", "feedback", "endorsements"] },
  { href: "/interests", label: "Interests", icon: Heart, keywords: ["interests", "hobbies", "passions"] },
  { href: "/contact", label: "Contact", icon: Mail, keywords: ["contact", "email", "reach", "connect", "message"] },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Filter items based on search query
  const filteredItems = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleNavigate = useCallback((href: string) => {
    router.push(href);
    setIsOpen(false);
    setSearchQuery("");
    setSelectedIndex(0);
    hapticManager.medium();
  }, [router]);

  // Keyboard shortcuts (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        hapticManager.light();
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchQuery("");
        setSelectedIndex(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Handle arrow key navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        hapticManager.light();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        hapticManager.light();
      } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
        e.preventDefault();
        handleNavigate(filteredItems[selectedIndex].href);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, handleNavigate]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset selected index when filtered items change
  useEffect(() => {
    setSelectedIndex(0);
    itemRefs.current = [];
  }, [searchQuery]);

  // Scroll selected item into view
  useEffect(() => {
    if (isOpen && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex, isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setSearchQuery("");
    setSelectedIndex(0);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Logo - Fixed top left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 left-6 z-50 md:left-8"
      >
        <Link
          href="/"
          className="group relative flex items-center gap-2"
          onClick={() => hapticManager.light()}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <div className="absolute inset-0 " />
            <div className="relative rounded-sm  px-4 py-2 backdrop-blur-sm transition-all">
              <span className="font-semibold text-xl">
                MHuzaifa
              </span>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Command Palette Trigger Button */}
      <motion.button
        onClick={() => {
          setIsOpen(true);
          hapticManager.light();
        }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border-2 border-white/60 bg-black/80 px-4 py-3 backdrop-blur-md transition-all hover:border-white/80 hover:bg-white/10 md:bottom-8 md:right-8"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open navigation"
      >
        <Search className="h-4 w-4 text-white/70" />
        <span className="text-sm text-white/70 md:inline">Quick Nav</span>
        <kbd className="hidden items-center gap-1 rounded border border-white/20 bg-white/5 px-2 py-1 text-xs text-white/50 md:flex">
          <Command className="h-3 w-3" />
          <span>K</span>
        </kbd>
      </motion.button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
              onClick={() => {
                setIsOpen(false);
                setSearchQuery("");
                setSelectedIndex(0);
              }}
            />

            {/* Command Palette */}
            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-black/95 p-2 shadow-2xl backdrop-blur-xl md:w-[600px]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                <Search className="h-5 w-5 text-white/50" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pages... (try 'work', 'projects', 'contact')"
                  className="flex-1 bg-transparent text-white placeholder:text-white/40 focus:outline-none"
                />
                <kbd className="hidden items-center gap-1 rounded border border-white/20 bg-white/5 px-2 py-1 text-xs text-white/50 md:flex">
                  <span>ESC</span>
                </kbd>
              </div>

              {/* Results List */}
              <div ref={scrollContainerRef} className="mt-2 max-h-96 overflow-y-auto">
                {filteredItems.length > 0 ? (
                  <div className="space-y-1 p-2">
                    {filteredItems.map((item, index) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      const isSelected = index === selectedIndex;

                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                        >
                          <button
                            ref={(el) => {
                              itemRefs.current[index] = el;
                            }}
                            onClick={() => handleNavigate(item.href)}
                            onMouseEnter={() => {
                              setSelectedIndex(index);
                              hapticManager.light();
                            }}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all",
                              isSelected
                                ? "bg-white/10"
                                : "hover:bg-white/5",
                              active && "bg-white/5"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-lg transition-all",
                                active
                                  ? "bg-white"
                                  : "bg-white/5"
                              )}
                            >
                              <Icon
                                className={cn(
                                  "h-5 w-5",
                                  active ? "text-black" : "text-white/70"
                                )}
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "font-medium",
                                    active || isSelected ? "text-white" : "text-white/70"
                                  )}
                                >
                                  {item.label}
                                </span>
                                {active && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="h-2 w-2 rounded-full bg-blue-500"
                                  />
                                )}
                              </div>
                            </div>
                            {isSelected && (
                              <ArrowRight className="h-4 w-4 text-white/50" />
                            )}
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-white/50">No results found</p>
                    <p className="mt-2 text-sm text-white/30">
                      Try searching for &quot;home&quot;, &quot;projects&quot;, or &quot;contact&quot;
                    </p>
                  </div>
                )}
              </div>

              {/* Footer Hint */}
              <div className="mt-2 flex items-center justify-between border-t border-white/10 px-4 py-2 text-xs text-white/40">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5">
                      ↑↓
                    </kbd>
                    <span>Navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5">
                      ↵
                    </kbd>
                    <span>Select</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="rounded border border-white/20 bg-white/5 px-1.5 py-0.5">
                    ESC
                  </kbd>
                  <span>Close</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}