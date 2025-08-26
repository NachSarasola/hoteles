// Purpose: Main JavaScript functionality for the hoteles project.
// Author: ChatGPT

let config = {};
let currentLang = 'es';

const texts = {
  es: {
    headerTitle: 'Bienvenido a Hoteles',
    heroTitle: 'Disfruta tu estadía',
    bookingCta: 'Reservar ahora',
    seo: {
      metaTitle: 'Hotel Paraíso',
      metaDescription: 'Descubre el mejor alojamiento.'
    }
  },
  en: {
    headerTitle: 'Welcome to Hotels',
    heroTitle: 'Enjoy your stay',
    bookingCta: 'Book now',
    seo: {
      metaTitle: 'Paradise Hotel',
      metaDescription: 'Discover the best accommodation.'
    }
  }
};

async function loadConfig() {
  try {
    const res = await fetch('config.json');
    if (!res.ok) throw new Error('config.json not found');
    return await res.json();
  } catch (_) {
    const res = await fetch('config.example.json');
    return await res.json();
  }
}

function setColors() {
  if (!config.colors) return;
  Object.entries(config.colors).forEach(([key, value]) => {
    document.documentElement.style.setProperty(`--color-${key}`, value);
  });
}

function applySEO(lang) {
  const langSeo = (texts[lang] && texts[lang].seo) || {};
  const metaTitle = langSeo.metaTitle || (config.seo && config.seo.metaTitle) || '';
  const metaDescription =
    langSeo.metaDescription || (config.seo && config.seo.metaDescription) || '';
  document.title = metaTitle;
  document.getElementById('meta-description').setAttribute('content', metaDescription);
  document.getElementById('og-title').setAttribute('content', metaTitle);
  document.getElementById('og-description').setAttribute('content', metaDescription);
  if (config.seo && config.seo.metaImageUrl) {
    document.getElementById('og-image').setAttribute('content', config.seo.metaImageUrl);
  }
}

function renderUI(lang) {
  const dict = texts[lang] || {};
  const headerEl = document.getElementById('header-title');
  const heroEl = document.getElementById('hero-title');
  const bookingBtn = document.getElementById('booking-cta');
  if (headerEl) headerEl.textContent = dict.headerTitle || '';
  if (heroEl) heroEl.textContent = dict.heroTitle || '';
  if (bookingBtn) bookingBtn.textContent = dict.bookingCta || '';
}

function setLanguage(lang) {
  currentLang = lang;
  renderUI(lang);
  applySEO(lang);
  localStorage.setItem('lang', lang);
  const selector = document.getElementById('language-selector');
  if (selector && selector.value !== lang) {
    selector.value = lang;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  config = await loadConfig();
  setColors();
  const stored = localStorage.getItem('lang');
  const defaultLang = (config.site && config.site.defaultLang) || 'es';
  setLanguage(stored || defaultLang);
  const selector = document.getElementById('language-selector');
  if (selector) {
    selector.addEventListener('change', (e) => setLanguage(e.target.value));
  }
});
