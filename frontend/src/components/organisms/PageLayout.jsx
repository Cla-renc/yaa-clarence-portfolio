import { motion } from 'framer-motion';
import { pageTransitionFade } from '../utils/animations';

/**
 * PageLayout Component
 * Wraps page content with transition animations
 */
export const PageLayout = ({ children, title = '', className = '' }) => (
  <motion.div
    key={title}
    {...pageTransitionFade}
    className={`w-full ${className}`}
  >
    {children}
  </motion.div>
);

export default PageLayout;
