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
