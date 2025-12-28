"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { hapticManager } from "@/lib/haptic-manager";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/certificates", label: "Certificates" },
  { href: "/interests", label: "Interests" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="text-xl font-semibold text-white"
            onClick={() => hapticManager.light()}
          >
            MHuzaifa
          </Link>
        </motion.div>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                onClick={() => hapticManager.light()}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white",
                  pathname === item.href && "text-white"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 border-b-2 border-white"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="md:hidden"
        >
          <button
            onClick={() => hapticManager.light()}
            className="text-white"
            aria-label="Menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </motion.div>
      </div>
    </nav>
  );
}

