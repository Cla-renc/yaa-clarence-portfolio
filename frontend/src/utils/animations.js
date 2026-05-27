/**
 * Animation Specifications & Utilities
 * Based on Portfolio Animation and Interaction Specifications v1.0
 */

/* ─────────────────────────────────────────────────────────────────────────── */
/* SCROLL-TRIGGERED ANIMATIONS */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Card Appear Animation
 * Trigger: Scroll into view
 * Duration: 300ms
 * Easing: ease-in-out
 * Properties: Fade + Scale + Y offset
 */
export const cardAppear = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  whileInView: { opacity: 1, scale: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.3, ease: "easeInOut" },
};

/**
 * Card Stagger Animation
 * Trigger: Card enters staggered
 * Duration: ~150ms each stagger
 * Easing: ease-in-out
 * Properties: Staggered children animations
 */
export const cardStagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
};

export const staggeredChildren = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  },
};

/**
 * Fade Tab Animation
 * Trigger: Tab appears
 * Duration: 0.3s
 * Delay: 50ms each stagger
 * Properties: Fade in/out with Y offset
 */
export const fadeTabAnimation = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

/**
 * Tilt Animation
 * Trigger: Scroll parallax effect
 * Duration: 300ms
 * Easing: ease-out
 * Properties: Rotation based on scroll position
 */
export const tiltAnimation = (scrollProgress) => ({
  initial: { rotateX: 0, rotateY: 0 },
  animate: {
    rotateX: scrollProgress ? (scrollProgress - 0.5) * 10 : 0,
    rotateY: scrollProgress ? (scrollProgress - 0.5) * 15 : 0,
  },
  transition: { duration: 0.3, ease: "easeOut" },
});

/**
 * Scale on Scroll Animation
 * Trigger: Scroll position
 * Duration: 300ms
 * Easing: ease-out
 * Properties: Dynamic scale based on scroll
 */
export const scaleOnScroll = {
  style: {
    scale: (v) => Math.min(1, 0.5 + v * 1.5),
  },
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* PAGE TRANSITIONS */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Page Fade Animation
 * Used for smooth page transitions
 * Duration: 0.5s
 */
export const pageTransitionFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.5 },
};

/**
 * Page Slide Animation
 * Used for smooth slide-based page transitions
 * Duration: 0.5s
 */
export const pageTransitionSlide = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.5, ease: "easeInOut" },
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* MICRO-INTERACTIONS */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Button Hover Animation
 * Trigger: Hover
 * Duration: 300ms
 * Easing: ease-out
 * Properties: Subtle scale
 */
export const buttonHover = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.3, ease: "easeOut" },
};

/**
 * Button Scale Animation
 * Trigger: Click/Scroll
 * Duration: 150ms
 * Properties: Fade and scale
 */
export const buttonScale = {
  whileHover: { scale: 1.08 },
  whileTap: { scale: 0.92 },
  transition: { duration: 0.15 },
};

/**
 * Icon Hover Animation
 * Trigger: Hover
 * Duration: 300ms
 * Properties: Rotate and scale
 */
export const iconHover = {
  whileHover: { rotate: 5, scale: 1.1 },
  transition: { duration: 0.3 },
};

/**
 * Link Underline Animation
 * Trigger: Hover
 * Duration: 300ms
 * Properties: Width change
 */
export const linkUnderline = {
  whileHover: { textDecoration: "underline" },
  transition: { duration: 0.3 },
};

/**
 * Form Input Focus Animation
 * Trigger: Focus
 * Duration: 200ms
 * Properties: Border color and scale
 */
export const inputFocus = {
  initial: { borderColor: "#e5e7eb" },
  whileFocus: { borderColor: "#3b82f6", scale: 1.02 },
  transition: { duration: 0.2 },
};

/**
 * Toggle Animation
 * Trigger: Click
 * Duration: 300ms
 * Properties: Rotate and color change
 */
export const toggleAnimation = {
  initial: { rotate: 0 },
  animate: { rotate: 180 },
  transition: { duration: 0.3 },
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* SCROLL-LINKED ANIMATIONS */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Scroll Timeline Animation
 * Trigger: Scroll position
 * Duration: 300ms
 * Easing: ease-in-out
 * Properties: Dynamic positioning based on scroll
 */
export const scrollTimelineAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-50px" },
  transition: { duration: 0.3, ease: "easeInOut" },
};

/**
 * Parallax Animation
 * Trigger: Scroll position
 * Properties: Offset Y based on scroll
 */
export const parallaxEffect = (offset = 100) => ({
  initial: { y: 0 },
  animate: { y: offset * 0.5 },
});

/* ─────────────────────────────────────────────────────────────────────────── */
/* CONTAINER ANIMATIONS */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Grid Container Animation
 * Animates grid items with stagger effect
 */
export const gridContainerAnimation = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Grid Item Animation
 */
export const gridItemAnimation = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* LOADING & SKELETON ANIMATIONS */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Skeleton Loading Animation
 * Trigger: Auto-repeat
 * Duration: 2s
 * Properties: Opacity pulse
 */
export const skeletonLoading = {
  animate: { opacity: [0.5, 1, 0.5] },
  transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
};

/**
 * Pulse Animation
 */
export const pulseAnimation = {
  animate: { scale: [1, 1.05, 1] },
  transition: { duration: 2, repeat: Infinity },
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* TEXT ANIMATIONS */
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Character Stagger Animation
 * Animates text character by character
 */
export const characterStagger = {
  container: {
    hidden: { opacity: 0 },
    visible: (custom = 1) => ({
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.04 * custom,
      },
    }),
  },
  child: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  },
};

/**
 * Fade In Up Animation
 * Common text entrance animation
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* EASING FUNCTIONS */
/* ─────────────────────────────────────────────────────────────────────────── */

export const easings = {
  easeInOutQuad: "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
  easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  easeOutCubic: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  easeInQuad: "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
  easeOutQuad: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
};

/* ─────────────────────────────────────────────────────────────────────────── */
/* VIEWPORT CONFIGURATION */
/* ─────────────────────────────────────────────────────────────────────────── */

export const viewportConfig = {
  once: true,
  margin: "-100px",
  amount: "some",
};

export const viewportConfigRepeat = {
  once: false,
  margin: "-50px",
  amount: "some",
};
