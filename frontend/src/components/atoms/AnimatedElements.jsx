import { motion } from 'framer-motion';
import {
  cardAppear,
  staggeredChildren,
  buttonHover,
  fadeInUp,
  gridContainerAnimation,
  gridItemAnimation,
} from '../utils/animations';

/**
 * AnimatedCard Component
 * Wraps a card with scroll-triggered appearance animation
 */
export const AnimatedCard = ({ children, className = '', ...props }) => (
  <motion.div
    {...cardAppear}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * StaggeredContainer Component
 * Wraps children with staggered animation effect
 */
export const StaggeredContainer = ({ children, className = '', ...props }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={staggeredChildren.container}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * StaggeredItem Component
 * Individual item in a staggered container
 */
export const StaggeredItem = ({ children, className = '', ...props }) => (
  <motion.div
    variants={staggeredChildren.item}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * AnimatedButton Component
 * Button with hover and tap animations
 */
export const AnimatedButton = ({ children, className = '', ...props }) => (
  <motion.button
    {...buttonHover}
    className={className}
    {...props}
  >
    {children}
  </motion.button>
);

/**
 * FadeInUpText Component
 * Text that fades in and moves up on scroll
 */
export const FadeInUpText = ({ children, className = '', delay = 0, ...props }) => (
  <motion.div
    {...fadeInUp}
    transition={{ duration: 0.6, ease: "easeOut", delay }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * GridContainer Component
 * Container for grid animations
 */
export const GridContainer = ({ children, className = '', ...props }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={gridContainerAnimation}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * GridItem Component
 * Individual grid item
 */
export const GridItem = ({ children, className = '', ...props }) => (
  <motion.div
    variants={gridItemAnimation}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * AnimatedLink Component
 * Link with hover animation
 */
export const AnimatedLink = ({ children, className = '', ...props }) => (
  <motion.a
    whileHover={{ x: 5 }}
    transition={{ duration: 0.2 }}
    className={className}
    {...props}
  >
    {children}
  </motion.a>
);

/**
 * AnimatedSection Component
 * Section wrapper with fade-in animation
 */
export const AnimatedSection = ({ children, className = '', ...props }) => (
  <motion.section
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className={className}
    {...props}
  >
    {children}
  </motion.section>
);

/**
 * PulseElement Component
 * Element with continuous pulse animation
 */
export const PulseElement = ({ children, className = '', ...props }) => (
  <motion.div
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * RotateOnHover Component
 * Element that rotates on hover
 */
export const RotateOnHover = ({ children, className = '', ...props }) => (
  <motion.div
    whileHover={{ rotate: 5 }}
    transition={{ duration: 0.3 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/**
 * ScaleOnHover Component
 * Element that scales on hover
 */
export const ScaleOnHover = ({ children, className = '', scale = 1.1, ...props }) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.95 }}
    transition={{ duration: 0.2 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);
