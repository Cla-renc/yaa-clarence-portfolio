import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SEOHead = ({ 
    title = 'Yaa Clarence | Discipline. Wisdom. Purpose.',
    description = 'Explore the portfolio of Yaa Clarence - IT student, author, and creator of the Bruce Lee Discipline Diaries brand.',
    image = 'https://yaaclarence.com/og-image.png',
    url = 'https://yaaclarence.com',
    type = 'website'
}) => {
    const location = useLocation();
    
    useEffect(() => {
        // Update document title
        document.title = title;

        // Meta tags
        const metaTags = [
            { name: 'description', content: description },
            { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
            { name: 'theme-color', content: '#4B2F9F' },
            { name: 'keywords', content: 'Yaa Clarence, portfolio, author, Bruce Lee, discipline, masculinity' },
            
            // Open Graph
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:image', content: image },
            { property: 'og:url', content: url + location.pathname },
            { property: 'og:type', content: type },
            { property: 'og:site_name', content: 'Yaa Clarence' },
            
            // Twitter Card
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: description },
            { name: 'twitter:image', content: image },
            
            // Additional SEO
            { name: 'author', content: 'Yaa Clarence' },
            { name: 'copyright', content: `© ${new Date().getFullYear()} Yaa Clarence. All rights reserved.` },
            { httpEquiv: 'X-UA-Compatible', content: 'ie=edge' }
        ];

        // Remove existing meta tags and add new ones
        metaTags.forEach(tag => {
            let selector = '';
            const prop = tag.property || tag.name || tag.httpEquiv;
            
            if (tag.property) selector = `meta[property="${prop}"]`;
            else if (tag.name) selector = `meta[name="${prop}"]`;
            else if (tag.httpEquiv) selector = `meta[http-equiv="${prop}"]`;

            // Remove existing tag if it exists
            if (selector) {
                const existing = document.querySelector(selector);
                if (existing) existing.remove();
            }

            // Create and append new tag
            const meta = document.createElement('meta');
            if (tag.property) meta.setAttribute('property', tag.property);
            if (tag.name) meta.setAttribute('name', tag.name);
            if (tag.httpEquiv) meta.setAttribute('http-equiv', tag.httpEquiv);
            if (tag.content) meta.setAttribute('content', tag.content);
            
            document.head.appendChild(meta);
        });

        // Add canonical URL
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = url + location.pathname;

        // Add structured data (JSON-LD)
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Yaa Clarence',
            url: url,
            image: image,
            description: description,
            jobTitle: 'IT Student & Author',
            sameAs: [
                'https://facebook.com/yaaclarence',
                'https://tiktok.com/@yaaclarence',
                'https://linkedin.com/in/yaaclarence',
                'https://github.com/yaaclarence'
            ]
        };

        let script = document.querySelector('script[type="application/ld+json"]');
        if (!script) {
            script = document.createElement('script');
            script.type = 'application/ld+json';
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(structuredData);

    }, [title, description, image, url, location.pathname, type]);

    return null; // This component doesn't render anything
};

export default SEOHead;
