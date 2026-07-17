'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0 
}: { 
  children: ReactNode, 
  className?: string, 
  delay?: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -25px 0px" }}
      transition={{ duration: 0.65, delay: delay * 0.055, ease: [0.2, 0.75, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}