/* =========================================
   NAVIGATION
   Buttons tell screen readers whether they're open
   using aria-expanded="true" or "false".
   The CSS reads that same attribute to show or hide things,
   so JavaScript only has to change one attribute.
   ========================================= */

const menuToggle = document.querySelector('.menu-toggle');
const submenuToggles = document.querySelectorAll('.submenu-toggle');

function isOpen(button) {
  return button.getAttribute('aria-expanded') === 'true';
}

function closeAllSubmenus(except) {
  submenuToggles.forEach((button) => {
    if (button !== except) {
      button.setAttribute('aria-expanded', 'false');
    }
  });
}

const menuLabel = document.querySelector('.menu-toggle-label');

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuLabel.textContent = open ? 'Close' : 'Menu';
  document.body.classList.toggle('menu-open', open);
  if (!open) {
    closeAllSubmenus();
  }
}

// Dropdowns: clicking one opens it and closes any other
submenuToggles.forEach((button) => {
  button.addEventListener('click', () => {
    const wasOpen = isOpen(button);
    closeAllSubmenus(button);
    button.setAttribute('aria-expanded', String(!wasOpen));
  });
});

// Phone/tablet menu button
menuToggle.addEventListener('click', () => {
  setMenu(!isOpen(menuToggle));
});

// Clicking anywhere outside the header closes the dropdowns
document.addEventListener('click', (event) => {
  if (!event.target.closest('.site-header')) {
    closeAllSubmenus();
  }
});

// The Escape key closes whatever is open and puts focus back on its button
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  const openSubmenuButton = document.querySelector('.submenu-toggle[aria-expanded="true"]');

  if (openSubmenuButton) {
    closeAllSubmenus();
    openSubmenuButton.focus();
  } else if (isOpen(menuToggle)) {
    setMenu(false);
    menuToggle.focus();
  }
});

// If the screen is resized to desktop width while the menu is open, reset it
window.matchMedia('(min-width: 1025px)').addEventListener('change', (event) => {
  if (event.matches) {
    setMenu(false);
  }
});


/* =========================================
   HERO VIDEO
   Only load the video when it's a good idea:
   - not on small screens (saves mobile data)
   - not if the person has asked their device to reduce motion
   - not if their browser is in data-saver mode
   Otherwise, the poster image stays on screen.
   ========================================= */

const video = document.querySelector('.hero-video');
const sky = document.querySelector('.sky');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 720px)').matches;
const saveData = navigator.connection && navigator.connection.saveData;

if (video && !prefersReducedMotion && !isSmallScreen && !saveData) {

  // 1. Give the video its file and start it
  video.src = video.dataset.src;
  video.play().catch(() => {
    // If the browser blocks autoplay, nothing breaks: the poster stays visible
  });

  // 2. Pause automatically once the whole sky area (hero + impact numbers) is
  //    scrolled out of view (saves battery), and resume when it comes back
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });

  observer.observe(sky);
}


/* =========================================
   IMPACT NUMBERS
   The finished numbers live in index.html, so the page is
   correct without JavaScript. This reads them out of the
   HTML and counts up to them once, when the numbers
   themselves are properly on screen.
   ========================================= */

const statNumbers = document.querySelectorAll('.stat-number[data-count]');
const statsRow = document.querySelector('.stats');

if (statNumbers.length && statsRow && !prefersReducedMotion) {

  const COUNT_DURATION = 2000;   // milliseconds

  // Split the finished text into its parts, e.g. "€1.5M+" -> "€", 1.5, "M+".
  // The HTML stays the only place a number is written down.
  const stats = Array.from(statNumbers).map((element) => {
    const finalText = element.textContent.trim();
    const [, prefix, digits, suffix] = finalText.match(/^(\D*)([\d.]+)(.*)$/);

    return {
      element,
      finalText,
      prefix,
      suffix,
      target: parseFloat(digits),
      decimals: Number(element.dataset.decimals) || 0,   // decimals while counting
    };
  });

  function showValue(stat, value) {
    stat.element.textContent = stat.prefix + value.toFixed(stat.decimals) + stat.suffix;
  }

  // Set them to zero now, before the section has been seen
  stats.forEach((stat) => showValue(stat, 0));

  function countUp() {
    const startTime = performance.now();

    // The browser runs this once per frame, about 60 times a second
    function step(now) {
      const progress = Math.min((now - startTime) / COUNT_DURATION, 1);

      if (progress < 1) {
        // Ease-out: quick off the mark, slowing as it lands
        const eased = 1 - Math.pow(1 - progress, 3);
        stats.forEach((stat) => showValue(stat, stat.target * eased));
        requestAnimationFrame(step);
      } else {
        // Last frame: put the exact text from the HTML back ("2M+", not "2.0M+")
        stats.forEach((stat) => {
          stat.element.textContent = stat.finalText;
        });
      }
    }

    // One loop drives all four numbers, so they start and finish together
    requestAnimationFrame(step);
  }

  // Watch the numbers row, not the whole section. The -10% bottom margin means
  // the bottom 10% of the screen doesn't count as "in view", so counting starts
  // as soon as the numbers have come a little way up onto the screen.
  const statsObserver = new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    observer.disconnect();   // run once only
    countUp();
  }, { rootMargin: '0px 0px -10% 0px' });

  statsObserver.observe(statsRow);
}


/* =========================================
   NEWSLETTER CONCEPT
   This form is deliberately non-functional: it demonstrates the interaction
   without sending or collecting an email address.
   ========================================= */

const newsletterForm = document.querySelector('.newsletter-form');
const newsletterMessage = document.querySelector('.newsletter-message');

if (newsletterForm && newsletterMessage) {
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    newsletterMessage.innerHTML = 'This is a design concept. To subscribe, visit <a href="https://astro4dev.org/contactus/emaillists/">OAD\'s mailing list page.</a>';
  });
}

const siteFooter = document.querySelector('.site-footer');
const footerTop = document.querySelector('.footer-top');

if (siteFooter && footerTop) {
  function updateFooterArrow() {
    const footerBounds = siteFooter.getBoundingClientRect();
    const visibleTop = Math.max(0, footerBounds.top);
    const visibleBottom = Math.min(window.innerHeight, footerBounds.bottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);
    const isFortyPercentVisible = visibleHeight >= footerBounds.height * 0.4;

    footerTop.classList.toggle('is-visible', isFortyPercentVisible);
  }

  const footerObserver = new IntersectionObserver(updateFooterArrow, { threshold: [0, 0.4] });

  footerObserver.observe(siteFooter);
  window.addEventListener('scroll', updateFooterArrow, { passive: true });
  window.addEventListener('resize', updateFooterArrow);
  window.setInterval(updateFooterArrow, 100);
  updateFooterArrow();
}
