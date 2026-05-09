"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type SectionRevealProps = {
  children: ReactNode;
  delay?: number;
};

export default function SectionReveal({
  children,
  delay = 0,
}: SectionRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
