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
const toggleButton = document.querySelector('.video-toggle');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 720px)').matches;
const saveData = navigator.connection && navigator.connection.saveData;

if (video && !prefersReducedMotion && !isSmallScreen && !saveData) {

  // 1. Give the video its file and start it
  video.src = video.dataset.src;
  video.play().catch(() => {
    // If the browser blocks autoplay, nothing breaks: the poster stays visible
  });

  // 2. Show the pause button once the video is really playing
  video.addEventListener('playing', () => {
    toggleButton.hidden = false;
  }, { once: true });

  // 3. Pause / play when the button is clicked
  let pausedByUser = false;

  toggleButton.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      pausedByUser = false;
      toggleButton.setAttribute('aria-label', 'Pause background video');
    } else {
      video.pause();
      pausedByUser = true;
      toggleButton.setAttribute('aria-label', 'Play background video');
    }
    toggleButton.classList.toggle('is-paused', video.paused);
  });

  // 4. Pause automatically when the hero scrolls out of view (saves battery),
  //    and resume when it comes back, unless the person paused it themselves
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !pausedByUser) {
      video.play().catch(() => {});
    } else if (!entry.isIntersecting) {
      video.pause();
    }
  });

  observer.observe(video);
}
