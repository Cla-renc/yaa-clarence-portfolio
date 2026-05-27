/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState, useCallback } from 'react';

/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

// Skip to main content link component
export const SkipToMainContent = () => (
    <a
        href="#main-content"
        className="absolute top-0 left-0 z-50 px-4 py-2 bg-primary-accent text-primary-bg opacity-0 focus:opacity-100 transition-opacity"
    >
        Skip to main content
    </a>
);

// Enhanced focus visible styles
export const useAccessibilityFocus = () => {
    useEffect(() => {
        // Add visible focus styles for keyboard navigation
        const style = document.createElement('style');
        style.textContent = `
            *:focus-visible {
                outline: 2px solid var(--color-primary-accent);
                outline-offset: 2px;
            }

            button:focus-visible,
            a:focus-visible,
            input:focus-visible,
            textarea:focus-visible,
            select:focus-visible {
                outline: 2px solid var(--color-primary-accent);
                outline-offset: 2px;
            }

            /* Remove default outline for mouse users but keep for keyboard */
            :focus:not(:focus-visible) {
                outline: none;
            }
        `;
        document.head.appendChild(style);

        return () => style.remove();
    }, []);
};

// Announce screen reader messages
export const useScreenReaderAnnouncement = () => {
    return useCallback((message, priority = 'polite') => {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', priority);
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => announcement.remove(), 1000);
    }, []);
};

// Ensure images have alt text
export const validateImageAccessibility = () => {
    if (import.meta.env.MODE === 'development') {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.alt || img.alt.trim() === '') {
                console.warn('Image missing alt text:', img.src);
            }
        });
    }
};

// Check for sufficient color contrast
export const checkColorContrast = (backgroundColor, foregroundColor) => {
    const getLuminance = (hexColor) => {
        const rgb = parseInt(hexColor.slice(1), 16);
        const r = (rgb >> 16) & 255;
        const g = (rgb >> 8) & 255;
        const b = rgb & 255;

        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    };

    const bgLuminance = getLuminance(backgroundColor);
    const fgLuminance = getLuminance(foregroundColor);

    const lighter = Math.max(bgLuminance, fgLuminance);
    const darker = Math.min(bgLuminance, fgLuminance);

    const contrast = (lighter + 0.05) / (darker + 0.05);

    // WCAG AA requires 4.5:1 for normal text, 3:1 for large text
    return {
        ratio: contrast.toFixed(2),
        meetsAA: contrast >= 4.5,
        meetsLargeAA: contrast >= 3
    };
};

// Reduced motion preference hook
export const usePrefersReducedMotion = () => {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const handler = (e) => setPrefersReducedMotion(e.matches);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPrefersReducedMotion(mediaQuery.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    return prefersReducedMotion;
};

// Keyboard navigation helper
export const useKeyboardNavigation = (items = [], onSelect) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.key) {
                case 'ArrowDown':
                case 'ArrowRight':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev + 1) % items.length);
                    break;
                case 'ArrowUp':
                case 'ArrowLeft':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev - 1 + items.length) % items.length);
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (onSelect) onSelect(selectedIndex);
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [items.length, onSelect, selectedIndex]);

    return [selectedIndex, setSelectedIndex];
};

// Aria labels helper
export const AriaLabel = ({ children, label, ...props }) => (
    <div aria-label={label} {...props}>
        {children}
    </div>
);

export default {
    SkipToMainContent,
    useAccessibilityFocus,
    useScreenReaderAnnouncement,
    validateImageAccessibility,
    checkColorContrast,
    usePrefersReducedMotion,
    useKeyboardNavigation
};
