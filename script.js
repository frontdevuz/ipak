const slides = [...document.querySelectorAll('.slide')];
const currentNumber = document.getElementById('currentNumber');
const chapterLabel = document.getElementById('chapterLabel');
const progressBar = document.getElementById('progressBar');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
let current = 0;
let isAnimating = false;

const slideContext = [
  'Ipak yo‘li miloddan avvalgi II asrdan boshlab Sharq va G‘arb o‘rtasidagi aloqalarni kuchaytirgan.',
  'Chjan Syan elchiligi Xitoyni Farg‘ona va Baqtriya yo‘llari bilan bog‘lagan dastlabki diplomatik qadamlardan biri edi.',
  'Movarounnahrning vohalari suv, yaylov va tog‘ dovonlari sabab karvonlar uchun tabiiy chorraha bo‘lgan.',
  'Lojuvard, feruza va oltin kabi boyliklar savdo bilan birga rang, bezak va hunarmandchilik usullarini ham yoygan.',
  'Samarqand Afrasiyob, Registon va Temuriylar davri ilmiy muhiti bilan bir necha tarixiy qatlamni saqlab qolgan.',
  'Karvonsaroylarda savdogarlar bilan birga tarjimonlar, hunarmandlar va yo‘l ko‘rsatuvchilar ham xizmat qilgan.',
  'Farg‘ona otlari qadimiy Xitoy manbalarida “samoviy otlar” sifatida tilga olingan.',
  'Savdo mahsulotlari bilan birga retseptlar, mato naqshlari, musiqa va hisoblash usullari ham ko‘chib yurgan.',
  'Samarqand qog‘ozi bilimni ko‘paytirish xarajatini kamaytirib, kutubxona va madrasalar rivojiga yordam bergan.',
  'Ipak yo‘li shaharlarida zardashtiylik, buddizm, nasroniylik va islom izlari turli davrlarda yonma-yon uchraydi.',
  'Al-Xorazmiy, Beruniy, Ibn Sino va Ulug‘bek asarlari mahalliy ilmni keng xalqaro ilmiy an’anaga bog‘lagan.',
  'Rabotlar, sardobalar va karvonsaroylar masofani emas, safarning xavfini kamaytirgan tarixiy infratuzilma edi.',
  'Dengiz yo‘llari kuchaygach, quruqlik savdosi qisqardi, ammo shaharlar va hunarlarning madaniy ta’siri saqlanib qoldi.',
  'Bugungi temir yo‘l va turizm yo‘nalishlari qadimiy savdo geografiyasining zamonaviy shakldagi davomidir.',
  'Ipak yo‘lining asosiy merosi mahsulot emas, xalqlar o‘rtasida bilim va tajriba almashinuvi tizimidir.'
];

slides.forEach((slide, index) => {
  const note = document.createElement('aside');
  note.className = 'context-note';
  note.innerHTML = `<b>Tarixiy dalil</b><span>${slideContext[index]}</span>`;
  slide.appendChild(note);
});

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
