const slides = [...document.querySelectorAll('.slide')];
const currentNumber = document.getElementById('currentNumber');
const chapterLabel = document.getElementById('chapterLabel');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
let current = 0;
let isAnimating = false;

function goToSlide(index, direction = 1) {
  if (isAnimating || index === current || index < 0 || index >= slides.length) return;
  isAnimating = true;
  const previous = slides[current];
  const next = slides[index];
  previous.classList.remove('active');
  next.style.transform = `translateX(${direction > 0 ? 18 : -18}px) scale(.985)`;
  next.classList.add('active');
  requestAnimationFrame(() => { next.style.transform = ''; });
  current = index;
  currentNumber.textContent = String(current + 1).padStart(2, '0');
  chapterLabel.textContent = next.dataset.title;
  progressBar.style.width = `${((current + 1) / slides.length) * 100}%`;
  window.setTimeout(() => { isAnimating = false; }, 720);
}
function nextSlide() { goToSlide(Math.min(current + 1, slides.length - 1), 1); }
function prevSlide() { goToSlide(Math.max(current - 1, 0), -1); }

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);
fullscreenBtn.addEventListener('click', async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.();
    else await document.exitFullscreen?.();
  } catch (error) {
    console.warn('To‘liq ekran rejimi mavjud emas:', error);
  }
});

document.addEventListener('keydown', (event) => {
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(event.key)) { event.preventDefault(); nextSlide(); }
  if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(event.key)) { event.preventDefault(); prevSlide(); }
  if (event.key === 'Home') goToSlide(0, -1);
  if (event.key === 'End') goToSlide(slides.length - 1, 1);
  if (event.key.toLowerCase() === 'f') fullscreenBtn.click();
});
let touchStart = 0;
document.addEventListener('touchstart', (event) => { touchStart = event.changedTouches[0].screenX; }, { passive: true });
document.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].screenX - touchStart;
  if (Math.abs(distance) > 50) distance < 0 ? nextSlide() : prevSlide();
}, { passive: true });

// Kursor yaqinlashganda kartalarga yengil fazoviy chuqurlik beradi.
document.querySelectorAll('.stat-card, .scholar-grid article, .duo-cards div').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    card.style.transform = `perspective(650px) rotateX(${y * -5}deg) rotateY(${x * 5}deg) translateY(-5px)`;
  });
  card.addEventListener('pointerleave', () => { card.style.transform = ''; });
});

progressBar.style.width = `${100 / slides.length}%`;
chapterLabel.textContent = slides[0].dataset.title;
