import React from 'react';
import { motion } from 'framer-motion';

const VIEWPORT_CONFIG = { once: true, margin: '0px' };
const TRANSITION_CONFIG = { duration: 0.6, ease: [0.22, 1, 0.36, 1] };

export const ScrollReveal = ({
  children,
  delay = 0,
  y = 20,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_CONFIG}
      transition={{ ...TRANSITION_CONFIG, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;