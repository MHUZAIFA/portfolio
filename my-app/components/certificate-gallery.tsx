"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { X, ChevronLeft, ChevronRight, ArrowLeft, Folder } from "lucide-react";
import { hapticManager } from "@/lib/haptic-manager";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
}

interface CertificateGalleryProps {
  certificates: Certificate[];
  viewMode: "gallery" | "folder";
}

export function CertificateGallery({ certificates, viewMode }: CertificateGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Group certificates by category
  const groupedCertificates = useMemo(() => {
    const groups: Record<string, Certificate[]> = {
      angular: [],
      aws: [],
      microsoft: [],
      others: [],
    };

    certificates.forEach((cert) => {
      const path = cert.image.toLowerCase();
      if (path.includes("/angular/")) {
        groups.angular.push(cert);
      } else if (path.includes("/aws/")) {
        groups.aws.push(cert);
      } else if (path.includes("/microsoft/")) {
        groups.microsoft.push(cert);
      } else {
        groups.others.push(cert);
      }
    });

    return groups;
  }, [certificates]);

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      angular: "Angular",
      aws: "AWS",
      microsoft: "Microsoft",
      others: "Others",
    };
    return names[category] || category;
  };

  const openFolder = (folder: string) => {
    setSelectedFolder(folder);
    hapticManager.medium();
  };

  const closeFolder = () => {
    setSelectedFolder(null);
    hapticManager.light();
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (selectedIndex !== null) {
      if (isLeftSwipe && selectedIndex < certificates.length - 1) {
        setSelectedIndex(selectedIndex + 1);
        hapticManager.light();
      }
      if (isRightSwipe && selectedIndex > 0) {
        setSelectedIndex(selectedIndex - 1);
        hapticManager.light();
      }
    }
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    hapticManager.medium();
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
    hapticManager.light();
  };

  const navigateNext = () => {
    if (selectedIndex !== null && selectedIndex < certificates.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      hapticManager.light();
    }
  };

  const navigatePrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      hapticManager.light();
    }
  };

  const renderGalleryView = () => (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {certificates.map((cert, index) => (
        <motion.div
          key={cert.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openLightbox(index)}
          className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-white/5"
        >
          <img
            src={cert.image}
            alt={cert.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex h-full items-center justify-center">
              <p className="text-center text-sm font-medium text-white">
                {cert.title}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderFolderView = () => {
    // If a folder is selected, show its contents
    if (selectedFolder) {
      const folderCerts = groupedCertificates[selectedFolder] || [];
      
      return (
        <div>
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={closeFolder}
            className="mb-6 flex items-center gap-2 text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Folders</span>
          </motion.button>
          
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-2xl font-bold text-white"
          >
            {getCategoryName(selectedFolder)} Certificates
          </motion.h2>
          
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {folderCerts.map((cert, index) => {
              const globalIndex = certificates.findIndex((c) => c.id === cert.id);
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openLightbox(globalIndex)}
                  className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg bg-white/5"
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-full items-center justify-center">
                      <p className="text-center text-sm font-medium text-white">
                        {cert.title}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      );
    }

    // Show folder cards
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Object.entries(groupedCertificates).map(([category, certs], index) => {
          if (certs.length === 0) return null;
          const firstCert = certs[0];
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openFolder(category)}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all hover:border-white/20 hover:bg-white/10"
            >
              <img
                src={firstCert.image}
                alt={getCategoryName(category)}
                className="h-full w-full object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="flex h-full flex-col items-center justify-end p-4 text-center">
                  <Folder className="mb-2 h-8 w-8 text-white" />
                  <h3 className="text-lg font-semibold text-white">
                    {getCategoryName(category)}
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    {certs.length} {certs.length === 1 ? "certificate" : "certificates"}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {viewMode === "gallery" ? renderGalleryView() : renderFolderView()}

      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={closeLightbox}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </motion.button>

            {selectedIndex > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePrev();
                }}
                className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Previous"
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>
            )}

            {selectedIndex < certificates.length - 1 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigateNext();
                }}
                className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Next"
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative mx-4 max-h-[90vh] max-w-4xl"
            >
              <img
                src={certificates[selectedIndex].image}
                alt={certificates[selectedIndex].title}
                className="max-h-[90vh] w-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h3 className="text-xl font-semibold">
                  {certificates[selectedIndex].title}
                </h3>
                <p className="text-sm text-white/80">
                  {certificates[selectedIndex].issuer} •{" "}
                  {certificates[selectedIndex].date}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

