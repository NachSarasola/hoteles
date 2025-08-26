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

function renderLogo() {
  const logoEl = document.getElementById('logo');
  if (!logoEl) return;
  logoEl.innerHTML = '';
  if (config.site && config.site.logo) {
    const img = document.createElement('img');
    img.src = config.site.logo;
    img.alt = (config.site && config.site.title) || 'Logo';
    logoEl.appendChild(img);
  } else {
    const span = document.createElement('span');
    span.className = 'logo-text';
    span.textContent = (config.site && config.site.title) || '';
    logoEl.appendChild(span);
  }
}

function renderNav(lang) {
  const list = document.getElementById('nav-items');
  if (!list || !config.nav || !Array.isArray(config.nav.items)) return;
  list.innerHTML = '';
  config.nav.items.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${item.section}`;
    const label = (item.label && (item.label[lang] || item.label)) || '';
    a.textContent = label;
    a.setAttribute('tabindex', '0');
    li.appendChild(a);
    list.appendChild(li);
  });
}

function renderUI(lang) {
  const dict = texts[lang] || {};
  const heroEl = document.getElementById('hero-title');
  const bookingBtn = document.getElementById('booking-cta');
  if (heroEl) heroEl.textContent = dict.heroTitle || '';
  if (bookingBtn) bookingBtn.textContent = dict.bookingCta || '';
  renderNav(lang);
}

function setLanguage(lang) {
  currentLang = lang;
  renderUI(lang);
  applySEO(lang);
  localStorage.setItem('lang', lang);
  const selector = document.getElementById('langSwitcher');
  if (selector && selector.value !== lang) {
    selector.value = lang;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  config = await loadConfig();
  renderLogo();
  setColors();
  const stored = localStorage.getItem('lang');
  const defaultLang = (config.site && config.site.defaultLang) || 'es';
  setLanguage(stored || defaultLang);
  const selector = document.getElementById('langSwitcher');
  if (selector) {
    selector.addEventListener('change', (e) => setLanguage(e.target.value));
  }
  const reserveBtn = document.getElementById('reserve-btn');
  if (reserveBtn) {
    reserveBtn.addEventListener('click', () => {
      const widget = document.getElementById('booking');
      if (widget) widget.scrollIntoView({ behavior: 'smooth' });
    });
  }
});
