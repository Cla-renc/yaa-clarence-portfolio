const sanitizeHtml = require('sanitize-html');

const sanitizeText = (value = '', maxLength = 1000) => {
  if (typeof value !== 'string') return '';
  const clean = sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
    allowedSchemes: [],
    textFilter: (text) => text
  });
  return clean.trim().slice(0, maxLength);
};

const sanitizeHtmlContent = (value = '') => {
  if (typeof value !== 'string') return '';
  return sanitizeHtml(value, {
    allowedTags: [
      'b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li',
      'blockquote', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'img', 'figure', 'figcaption', 'span', 'div'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      '*': ['class', 'style']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
      img: ['http', 'https', 'data']
    },
    allowProtocolRelative: false,
    enforceHtmlBoundary: true,
    parser: {
      lowerCaseTags: true
    }
  });
};

const sanitizeUrl = (value = '') => {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.href;
  } catch {
    return '';
  }
};

const sanitizeStringArray = (items = [], maxItemLength = 100) => {
  if (!Array.isArray(items)) return [];
  return items
    .filter(item => typeof item === 'string')
    .map(item => sanitizeText(item, maxItemLength))
    .filter(Boolean);
};

module.exports = {
  sanitizeText,
  sanitizeHtmlContent,
  sanitizeUrl,
  sanitizeStringArray,
};