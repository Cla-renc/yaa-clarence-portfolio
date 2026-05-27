import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const sendEvent = async (payload) => {
    try {
        await fetch((import.meta.env.VITE_API_URL || '') + '/api/social-metrics/collect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        // Swallow errors — analytics should not break UX
        console.debug('Analytics send failed', err);
    }
};

export default function useAnalytics() {
    const location = useLocation();
    const lastPath = useRef('');

    useEffect(() => {
        const path = location.pathname + location.search;
        if (lastPath.current === path) return;
        lastPath.current = path;

        const payload = {
            eventType: 'pageview',
            page: document.title || null,
            path,
            metadata: {
                width: window.innerWidth,
                height: window.innerHeight,
                referrer: document.referrer || null
            }
        };

        // fire-and-forget
        sendEvent(payload);
    }, [location.pathname, location.search]);
}
