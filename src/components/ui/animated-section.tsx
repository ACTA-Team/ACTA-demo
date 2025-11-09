'use client';

import { motion } from 'motion/react';

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedSection({ children, className, delay = 0.15 }: AnimatedSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.35, delay, ease: 'linear' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
