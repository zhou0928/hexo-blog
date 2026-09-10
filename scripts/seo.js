/* global hexo */
'use strict';

// SEO injections Fluid's head partial does not cover on its own:
//   - og:image (+ width/height/alt)   -> Fluid only emits it when page.og_img/index_img is set
//   - twitter:title/description/image -> open_graph helper emits twitter:card only
//   - JSON-LD Blog (home) / Article (post)
// Hook `_after_html_render` (Hexo 8 core, createLoadThemeRoute) fires once per
// generated page with (html, locals); locals carries the full page/config/theme.

const SITE_URL = 'https://000902.icu';
const DEFAULT_IMAGE = '/img/bg.jpg';
const DEFAULT_WIDTH = '1920';
const DEFAULT_HEIGHT = '1080';
const AUTHOR_URL = 'https://github.com/zhou0928';

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const toIso = (v) => {
  try {
    if (v && typeof v.toISOString === 'function') return v.toISOString();
    return v ? new Date(v).toISOString() : undefined;
  } catch (e) {
    return undefined;
  }
};

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1] : '';
}

hexo.extend.filter.register('_after_html_render', (html, locals) => {
  try {
    if (typeof html !== 'string' || html.indexOf('</head>') === -1) return html;
    if (html.indexOf('data-seo-injected') !== -1) return html;

    const config = (locals && locals.config) || hexo.config || {};
    const page = (locals && locals.page) || {};
    const base = String(config.url || SITE_URL).replace(/\/+$/, '');
    const isPost = page.layout === 'post';
    const isHome = locals && locals.path === 'index.html';

    const abs = (p) => {
      if (!p) return '';
      if (/^https?:\/\//i.test(p)) return p;
      return base + (p.charAt(0) === '/' ? p : '/' + p);
    };

    // per-post prefer its own banner/cover; every page falls back to the site banner
    const image = abs(page.banner_img || page.og_img || page.index_img || page.cover || DEFAULT_IMAGE);
    const title = page.title ? `${page.title}${config.title_join_string || ' - '}${config.title}` : config.title;
    const desc = page.description || config.description || '';
    const pageUrl = (locals && locals.url) || abs('/' + ((locals && locals.path) || ''));

    let block = '\n<!-- seo:injected -->\n';

    if (!/property="og:image"/.test(html)) {
      block += `<meta property="og:image" content="${image}">\n`;
      block += `<meta property="og:image:width" content="${DEFAULT_WIDTH}">\n`;
      block += `<meta property="og:image:height" content="${DEFAULT_HEIGHT}">\n`;
      block += `<meta property="og:image:alt" content="${esc(title)}">\n`;
    }
    if (!/name="twitter:card"/.test(html)) {
      block += `<meta name="twitter:card" content="summary_large_image">\n`;
    }
    block += `<meta name="twitter:title" content="${esc(title)}">\n`;
    block += `<meta name="twitter:description" content="${esc(desc)}">\n`;
    block += `<meta name="twitter:image" content="${image}">\n`;
    block += `<meta name="twitter:image:alt" content="${esc(title)}">\n`;

    let schema;
    if (isHome) {
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: config.title,
        url: base + '/',
        description: config.description,
        author: { '@type': 'Person', name: config.author, url: AUTHOR_URL },
      };
    } else if (isPost) {
      schema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: page.title,
        description: desc,
        url: pageUrl,
        image: [image],
        mainEntityOfPage: pageUrl,
        author: { '@type': 'Person', name: config.author, url: AUTHOR_URL },
        publisher: { '@type': 'Organization', name: config.title, url: base },
        datePublished: toIso(page.date),
        dateModified: toIso(page.updated || page.date),
      };
    }
    if (schema) {
      block += `<script type="application/ld+json">${JSON.stringify(schema)}</script>\n`;
    }
    block += '<!-- seo:end -->\n';

    return html.replace('</head>', block + '</head>');
  } catch (e) {
    hexo.log.warn('seo.js injection skipped: %s', e && e.message);
    return html;
  }
});
