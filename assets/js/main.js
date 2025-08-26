// Purpose: Main JavaScript functionality for the hoteles project.
// Author: ChatGPT

let config = {};
let currentLang = 'es';
let galleryImages = [];
let currentGalleryIndex = 0;

const texts = {
  es: {
    heroRoomsBtn: 'Ver habitaciones',
    heroReserveBtn: 'Reservar',
    bookingCta: 'Reservar ahora',
    contact: {
      phone: 'Teléfono',
      whatsapp: 'WhatsApp',
      email: 'Email',
      address: 'Dirección',
      openMap: 'Abrir mapa',
      directions: 'Cómo llegar'
    },
    seo: {
      metaTitle: 'Hotel Paraíso',
      metaDescription: 'Descubre el mejor alojamiento.'
    }
  },
  en: {
    heroRoomsBtn: 'View rooms',
    heroReserveBtn: 'Book',
    bookingCta: 'Book now',
    contact: {
      phone: 'Phone',
      whatsapp: 'WhatsApp',
      email: 'Email',
      address: 'Address',
      openMap: 'Open map',
      directions: 'Directions'
    },
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

function toggleSection(id, condition) {
  const el = document.getElementById(id);
  if (!el) return;
  if (condition) {
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
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
  const baseUrl = (config.site && config.site.baseUrl) || '';
  document.getElementById('og-url').setAttribute('content', baseUrl);
  document.getElementById('twitter-url').setAttribute('content', baseUrl);
  document.getElementById('twitter-title').setAttribute('content', metaTitle);
  document.getElementById('twitter-description').setAttribute('content', metaDescription);
  document.getElementById('og-type').setAttribute('content', 'website');
  document.getElementById('twitter-card').setAttribute('content', 'summary_large_image');
  if (config.seo && config.seo.metaImageUrl) {
    document.getElementById('og-image').setAttribute('content', config.seo.metaImageUrl);
    document.getElementById('twitter-image').setAttribute('content', config.seo.metaImageUrl);
  }
}

function insertHotelSchema() {
  if (!config.site || !config.contact) return;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: config.site.name || '',
    url: config.site.baseUrl || '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: (config.contact && config.contact.address) || ''
    },
    telephone: (config.contact && config.contact.phone) || ''
  };
  if (config.booking && config.booking.checkinTime) {
    schema.checkinTime = config.booking.checkinTime;
  }
  if (config.booking && config.booking.checkoutTime) {
    schema.checkoutTime = config.booking.checkoutTime;
  }
  const el = document.getElementById('hotel-schema');
  if (el) {
    el.textContent = JSON.stringify(schema);
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

function renderLanguageSwitcher() {
  const selector = document.getElementById('langSwitcher');
  if (!selector || !config.site || !Array.isArray(config.site.languages)) return;
  selector.innerHTML = '';
  config.site.languages.forEach((lang) => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang.toUpperCase();
    selector.appendChild(option);
  });
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

function renderHero(lang) {
  const heroSection = document.getElementById('hero');
  if (!heroSection) return;
  const heading = document.getElementById('hero-heading');
  const tagline = document.getElementById('hero-tagline');
  const roomsBtn = document.getElementById('hero-rooms-btn');
  const reserveBtn = document.getElementById('hero-reserve-btn');
  const name = (config.site && (config.site.name || config.site.title)) || '';
  const tag =
    (config.site &&
      config.site.tagline &&
      (config.site.tagline[lang] || config.site.tagline)) || '';
  if (heading) heading.textContent = name;
  if (tagline) tagline.textContent = tag;
  const dict = texts[lang] || {};
  if (roomsBtn) roomsBtn.textContent = dict.heroRoomsBtn || 'Ver habitaciones';
  if (reserveBtn) reserveBtn.textContent = dict.heroReserveBtn || 'Reservar';
  if (config.site && config.site.heroImage) {
    heroSection.style.backgroundImage = `url(${config.site.heroImage})`;
    heroSection.classList.remove('hero-no-image');
  } else {
    heroSection.style.backgroundImage = '';
    heroSection.classList.add('hero-no-image');
  }
}

function openRoomModal(room, lang) {
  let modal = document.getElementById('room-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'room-modal';
    modal.className = 'modal';
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
    document.body.appendChild(modal);
  }
  modal.innerHTML = '';
  const content = document.createElement('div');
  content.className = 'modal-content';
  const close = document.createElement('button');
  close.className = 'btn btn-secondary';
  close.textContent = 'Cerrar';
  close.addEventListener('click', () => modal.classList.remove('active'));
  const details =
    typeof room.details === 'object' ? room.details[lang] || room.details : room.details;
  const detailsWrap = document.createElement('div');
  detailsWrap.innerHTML = details || '';
  content.appendChild(detailsWrap);
  content.appendChild(close);
  modal.appendChild(content);
  modal.classList.add('active');
}

function renderRooms(lang) {
  const section = document.getElementById('rooms');
  const hasRooms = Array.isArray(config.rooms) && config.rooms.length > 0;
  if (!section || !hasRooms) return;
  section.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'container';
  const grid = document.createElement('div');
  grid.className = 'grid rooms-grid';
  container.appendChild(grid);
  config.rooms.forEach((room) => {
    const article = document.createElement('article');
    article.className = 'card room-card';
    if (room.image) {
      const img = document.createElement('img');
      img.src = room.image;
      img.alt =
        (typeof room.name === 'object' ? room.name[lang] || room.name : room.name) || '';
      article.appendChild(img);
    }
    const title = document.createElement('h3');
    title.textContent =
      (typeof room.name === 'object' ? room.name[lang] || room.name : room.name) || '';
    article.appendChild(title);
    if (room.description) {
      const desc = document.createElement('p');
      desc.textContent =
        typeof room.description === 'object'
          ? room.description[lang] || room.description
          : room.description;
      article.appendChild(desc);
    }
    if (typeof room.price !== 'undefined' && config.booking && config.booking.currency) {
      const priceEl = document.createElement('p');
      const fmt = new Intl.NumberFormat(lang, {
        style: 'currency',
        currency: config.booking.currency
      });
      priceEl.textContent = `Desde ${fmt.format(room.price)}`;
      article.appendChild(priceEl);
    }
    if (room.details) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.textContent = 'Más info';
      btn.addEventListener('click', () => openRoomModal(room, lang));
      article.appendChild(btn);
    }
    grid.appendChild(article);
  });
  section.appendChild(container);
}

function renderAmenities(lang) {
  const section = document.getElementById('amenities');
  const hasAmenities = Array.isArray(config.amenities) && config.amenities.length > 0;
  if (!section || !hasAmenities) return;
  section.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'container';
  const grid = document.createElement('div');
  grid.className = 'grid amenities-grid';
  container.appendChild(grid);
  config.amenities.forEach((amenity) => {
    const item = document.createElement('div');
    item.className = 'card amenity-item';
    const iconSpan = document.createElement('span');
    iconSpan.className = 'amenity-icon';
    if (amenity.icon) {
      const isSvg = amenity.icon.trim().startsWith('<svg');
      if (isSvg) {
        iconSpan.innerHTML = amenity.icon;
        iconSpan.setAttribute('role', 'img');
        const label =
          (amenity.label && (amenity.label[lang] || amenity.label)) || '';
        iconSpan.setAttribute('aria-label', label);
      } else {
        iconSpan.textContent = amenity.icon;
      }
    }
    item.appendChild(iconSpan);
    const labelSpan = document.createElement('span');
    labelSpan.textContent =
      (amenity.label && (amenity.label[lang] || amenity.label)) || '';
    item.appendChild(labelSpan);
    grid.appendChild(item);
  });
  section.appendChild(container);
}

function updateGalleryModalImage() {
  const modal = document.getElementById('gallery-modal');
  if (!modal) return;
  const img = modal.querySelector('img');
  if (img) img.src = galleryImages[currentGalleryIndex];
}

function closeGalleryModal() {
  const modal = document.getElementById('gallery-modal');
  if (modal) modal.classList.remove('active');
}

function openGalleryModal(index) {
  currentGalleryIndex = index;
  let modal = document.getElementById('gallery-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.className = 'modal gallery-modal';
    const img = document.createElement('img');
    img.alt = '';
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', closeGalleryModal);
    modal.appendChild(img);
    modal.appendChild(closeBtn);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeGalleryModal();
    });
    document.body.appendChild(modal);
  }
  updateGalleryModalImage();
  modal.classList.add('active');
}

function renderGallery() {
  const section = document.getElementById('gallery');
  const hasGallery = Array.isArray(config.gallery) && config.gallery.length > 0;
  if (!section || !hasGallery) return;
  section.innerHTML = '';
  galleryImages = config.gallery.slice();
  const container = document.createElement('div');
  container.className = 'container';
  const grid = document.createElement('div');
  grid.className = 'grid gallery-grid';
  container.appendChild(grid);
  galleryImages.forEach((url, idx) => {
    const img = document.createElement('img');
    img.src = url;
    img.loading = 'lazy';
    img.alt = `Imagen ${idx + 1}`;
    img.addEventListener('click', () => openGalleryModal(idx));
    grid.appendChild(img);
  });
  section.appendChild(container);
}

function renderLocation(lang) {
  const section = document.getElementById('location');
  if (!section || !config.contact) return;
  section.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'container';

  const labels = (texts[lang] && texts[lang].contact) || {};
  const list = document.createElement('ul');
  list.className = 'contact-list';

  if (config.contact.phone) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `tel:${config.contact.phone}`;
    a.textContent = `${labels.phone || 'Teléfono'}: ${config.contact.phone}`;
    li.appendChild(a);
    list.appendChild(li);
  }
  if (config.contact.whatsapp) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `https://wa.me/${config.contact.whatsapp}`;
    a.textContent = `${labels.whatsapp || 'WhatsApp'}: ${config.contact.whatsapp}`;
    a.target = '_blank';
    a.rel = 'noopener';
    li.appendChild(a);
    list.appendChild(li);
  }
  if (config.contact.email) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `mailto:${config.contact.email}`;
    a.textContent = `${labels.email || 'Email'}: ${config.contact.email}`;
    li.appendChild(a);
    list.appendChild(li);
  }
  if (config.contact.address) {
    const li = document.createElement('li');
    const encoded = encodeURIComponent(config.contact.address);
    const a = document.createElement('a');
    a.href = `https://www.google.com/maps?q=${encoded}`;
    a.textContent = `${labels.address || 'Dirección'}: ${config.contact.address}`;
    a.target = '_blank';
    a.rel = 'noopener';
    li.appendChild(a);
    list.appendChild(li);
  }

  container.appendChild(list);

  if (config.contact.mapEmbedUrl) {
    const iframe = document.createElement('iframe');
    iframe.src = config.contact.mapEmbedUrl;
    iframe.width = '100%';
    iframe.height = '300';
    iframe.style.border = '0';
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('title', 'Mapa');
    container.appendChild(iframe);
  } else if (config.contact.address) {
    const mapLink = document.createElement('a');
    mapLink.href = `https://www.google.com/maps?q=${encodeURIComponent(
      config.contact.address
    )}`;
    mapLink.textContent = labels.openMap || 'Abrir mapa';
    mapLink.className = 'btn btn-secondary';
    mapLink.target = '_blank';
    mapLink.rel = 'noopener';
    container.appendChild(mapLink);
  }

  if (config.contact.address) {
    const dirBtn = document.createElement('a');
    dirBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      config.contact.address
    )}`;
    dirBtn.textContent = labels.directions || 'Cómo llegar';
    dirBtn.className = 'btn btn-primary';
    dirBtn.target = '_blank';
    dirBtn.rel = 'noopener';
    container.appendChild(dirBtn);
  }

  section.appendChild(container);
}

function renderFooter(lang) {
  const labels = (texts[lang] && texts[lang].contact) || {};
  const phoneLink = document.getElementById('footer-phone');
  const emailLink = document.getElementById('footer-email');
  const policiesList = document.getElementById('footer-policies');
  const socialList = document.getElementById('footer-social');
  const yearEl = document.getElementById('year');
  const siteNameEl = document.getElementById('site-name');

  if (phoneLink && config.contact && config.contact.phone) {
    phoneLink.textContent = `${labels.phone || 'Teléfono'}: ${config.contact.phone}`;
    phoneLink.href = `tel:${config.contact.phone}`;
  }

  if (emailLink && config.contact && config.contact.email) {
    emailLink.textContent = config.contact.email;
    emailLink.href = `mailto:${config.contact.email}`;
  }

  if (policiesList) {
    policiesList.innerHTML = '';
    if (Array.isArray(config.policies)) {
      config.policies.forEach((item) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        const label = (item.label && (item.label[lang] || item.label)) || '';
        a.textContent = label;
        a.href = item.url || '#';
        li.appendChild(a);
        policiesList.appendChild(li);
      });
    }
  }

  if (socialList) {
    socialList.innerHTML = '';
    if (Array.isArray(config.social)) {
      config.social.forEach((item) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = item.url || '#';
        a.textContent = item.platform || item.name || '';
        a.target = '_blank';
        a.rel = 'noopener';
        li.appendChild(a);
        socialList.appendChild(li);
      });
    }
  }

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (siteNameEl && config.site && config.site.name) {
    siteNameEl.textContent = config.site.name;
  }
}

function handleGalleryKeys(e) {
  const modal = document.getElementById('gallery-modal');
  if (!modal || !modal.classList.contains('active')) return;
  if (e.key === 'Escape') {
    closeGalleryModal();
  } else if (e.key === 'ArrowRight' && galleryImages.length > 1) {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryImages.length;
    updateGalleryModalImage();
  } else if (e.key === 'ArrowLeft' && galleryImages.length > 1) {
    currentGalleryIndex =
      (currentGalleryIndex - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryModalImage();
  }
}

document.addEventListener('keydown', handleGalleryKeys);

function renderUI(lang) {
  const dict = texts[lang] || {};
  const bookingBtn = document.getElementById('booking-cta');
  if (bookingBtn) bookingBtn.textContent = dict.bookingCta || '';
  toggleSection('rooms', Array.isArray(config.rooms) && config.rooms.length > 0);
  toggleSection(
    'amenities',
    Array.isArray(config.amenities) && config.amenities.length > 0
  );
  toggleSection('gallery', Array.isArray(config.gallery) && config.gallery.length > 0);
  toggleSection(
    'testimonials',
    Array.isArray(config.testimonials) && config.testimonials.length > 0
  );
  toggleSection(
    'map',
    !!(config.contact && (config.contact.mapEmbedUrl || config.contact.address))
  );
  renderNav(lang);
  renderHero(lang);
  renderRooms(lang);
  renderAmenities(lang);
  renderGallery();
  renderLocation(lang);
  renderFooter(lang);
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

function setupBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;
  const checkin = document.getElementById('checkin');
  const checkout = document.getElementById('checkout');
  const guests = document.getElementById('guests');
  const errors = {
    checkin: document.getElementById('checkin-error'),
    checkout: document.getElementById('checkout-error'),
    guests: document.getElementById('guests-error')
  };

  function clearErrors() {
    Object.values(errors).forEach((el) => {
      if (el) el.textContent = '';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    let valid = true;
    const ci = checkin.value;
    const co = checkout.value;
    const g = parseInt(guests.value, 10);

    if (!ci) {
      if (errors.checkin) errors.checkin.textContent = 'Requerido';
      checkin.focus();
      valid = false;
    }
    if (!co) {
      if (errors.checkout) errors.checkout.textContent = 'Requerido';
      if (valid) checkout.focus();
      valid = false;
    }
    if (ci && co) {
      const ciDate = new Date(ci);
      const coDate = new Date(co);
      if (coDate <= ciDate) {
        if (errors.checkout) errors.checkout.textContent = 'Debe ser posterior al check-in';
        if (valid) checkout.focus();
        valid = false;
      }
    }
    if (!guests.value || g < 1) {
      if (errors.guests) errors.guests.textContent = 'Debe ser al menos 1';
      if (valid) guests.focus();
      valid = false;
    }
    if (!valid) return;

    if (config.booking && config.booking.mode === 'whatsapp' && config.contact && config.contact.whatsapp) {
      const msg = encodeURIComponent(`Reserva del ${ci} al ${co} para ${g} huésped${g > 1 ? 'es' : ''}`);
      const url = `https://wa.me/${config.contact.whatsapp}?text=${msg}`;
      window.open(url, '_blank');
    } else if (config.booking && config.booking.mode === 'external' && config.booking.externalUrl) {
      const url = `${config.booking.externalUrl}?checkin=${ci}&checkout=${co}&guests=${g}`;
      window.location.href = url;
    }

    form.reset();
    checkin.focus();
  });

  [checkin, checkout, guests].forEach((input) =>
    input.addEventListener('input', () => {
      const err = errors[input.id];
      if (err) err.textContent = '';
    })
  );
}

document.addEventListener('DOMContentLoaded', async () => {
  config = await loadConfig();
  renderLogo();
  setColors();
  renderLanguageSwitcher();
  insertHotelSchema();
  const stored = localStorage.getItem('lang');
  const defaultLang = (config.site && config.site.defaultLang) || (config.site && config.site.languages && config.site.languages[0]) || 'es';
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
  setupBookingForm();
});
