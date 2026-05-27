import { useScroll, useTransform } from 'framer-motion';

/**
 * Hook for scroll-based parallax effect
 */
export const useParallax = (offset = 100) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, offset]);
  return y;
};

/**
 * Hook for scroll-based opacity effect
 */
export const useScrollOpacity = (startScroll = 0, endScroll = 300) => {
  const { scrollY } = useScroll();
  const opacity = useTransform(
    scrollY,
    [startScroll, endScroll],
    [0, 1]
  );
  return opacity;
};

/**
 * Hook for scroll-based scale effect
 */
export const useScrollScale = (startScroll = 0, endScroll = 300) => {
  const { scrollY } = useScroll();
  const scale = useTransform(
    scrollY,
    [startScroll, endScroll],
    [0.5, 1]
  );
  return scale;
};

/**
 * Hook for scroll progress
 */
export const useScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
};

/**
 * Hook for staggered animation delays
 */
export const useStaggeredDelay = (index, baseDelay = 0.1) => {
  return baseDelay * index;
};
