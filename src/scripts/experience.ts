export {};

const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector<HTMLButtonElement>('.motion-toggle');
const core = document.querySelector<HTMLButtonElement>('.core-stage');
const paletteButtons = document.querySelectorAll<HTMLButtonElement>('[data-palette-choice]');
const lightStatus = document.querySelector<HTMLElement>('.light-status');

function savePreference(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ }
}

function syncControls() {
  const paused = root.dataset.motion === 'paused';
  motionButton?.setAttribute('aria-pressed', String(paused));
  const label = motionButton?.querySelector('.motion-label');
  if (label) label.textContent = paused ? '继续动效' : '暂停动效';
  motionButton?.toggleAttribute('disabled', reducedMotion.matches);
  if (core) {
    core.disabled = paused;
    core.title = paused ? '动效已暂停，轨道核心保持静止' : '点击或按回车，释放光波';
  }
  if (motionButton) motionButton.title = reducedMotion.matches ? '已遵循系统的减少动态效果设置' : '';
  paletteButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.paletteChoice === root.dataset.palette)));
}

paletteButtons.forEach((button) => button.addEventListener('click', () => {
  root.dataset.palette = button.dataset.paletteChoice;
  savePreference('blog-palette', root.dataset.palette ?? 'aurora');
  syncControls();
  redrawField();
  if (lightStatus) lightStatus.textContent = `已切换到${root.dataset.palette === 'ember' ? '余烬' : '极光'}光场`;
}));

motionButton?.addEventListener('click', () => {
  root.dataset.motion = root.dataset.motion === 'paused' ? 'running' : 'paused';
  savePreference('blog-motion', root.dataset.motion);
  syncControls();
  scheduleField();
  if (root.dataset.motion === 'paused') resetPointer();
});

reducedMotion.addEventListener('change', () => {
  let paused = false;
  try { paused = localStorage.getItem('blog-motion') === 'paused'; } catch {}
  root.dataset.motion = reducedMotion.matches || paused ? 'paused' : 'running';
  syncControls();
  scheduleField();
  resetPointer();
});
syncControls();

// Native dialog provides modal focus containment and Escape behavior.
const dialog = document.querySelector<HTMLDialogElement>('#search-dialog');
const searchToggle = document.querySelector<HTMLButtonElement>('.search-toggle');
const searchInput = document.querySelector<HTMLInputElement>('#search-input');
const results = Array.from(document.querySelectorAll<HTMLAnchorElement>('.search-result'));
const searchCount = document.querySelector<HTMLElement>('.search-count');
const searchEmpty = document.querySelector<HTMLElement>('.search-empty');
function filterPosts() {
  const query = (searchInput?.value ?? '').normalize('NFKC').trim().toLocaleLowerCase();
  results.forEach((result) => {
    result.hidden = !(result.dataset.search ?? '').normalize('NFKC').toLocaleLowerCase().includes(query);
  });
  const count = results.filter((result) => !result.hidden).length;
  if (searchCount) searchCount.textContent = `${count} 篇文章`;
  if (searchEmpty) searchEmpty.hidden = count > 0;
}
function openSearch() {
  if (!dialog || dialog.open) return;
  filterPosts();
  dialog.showModal();
  root.classList.add('search-open');
  searchInput?.focus();
}
searchToggle?.addEventListener('click', openSearch);
document.querySelector('.search-close')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('close', () => {
  root.classList.remove('search-open');
  searchToggle?.focus();
});
dialog?.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
searchInput?.addEventListener('input', filterPosts);
searchInput?.addEventListener('keydown', (event) => {
  const first = results.find((result) => !result.hidden);
  if (event.key === 'Enter' && first) { event.preventDefault(); first.click(); }
  if (event.key === 'ArrowDown' && first) { event.preventDefault(); first.focus(); }
});
document.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (dialog?.open) dialog.close(); else openSearch();
  }
});

// Small page-wide feedback effects, independent of the hero canvas.
const progress = document.querySelector<HTMLElement>('.reading-progress');
let scrollFrame = 0;
function updateScroll() {
  const available = root.scrollHeight - innerHeight;
  progress?.style.setProperty('--progress', String(available > 0 ? scrollY / available : 0));
  scrollFrame = 0;
}
addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
}, { passive: true });
addEventListener('resize', updateScroll, { passive: true });
updateScroll();
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); revealObserver.unobserve(entry.target); }
    });
  }, { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));
}

const hero = document.querySelector<HTMLElement>('.hero');
const canvas = document.querySelector<HTMLCanvasElement>('.light-field');
const context = canvas?.getContext('2d');
type Particle = { x: number; y: number; radius: number; phase: number; speed: number };
type Pulse = { x: number; y: number; start: number };
let width = 0, height = 0, frame = 0, lastTime = 0, drift = 0, visible = true;
let particles: Particle[] = [];
let pulses: Pulse[] = [];
const pointer = { x: -1000, y: -1000 };

function running() { return root.dataset.motion !== 'paused' && !reducedMotion.matches; }
function resizeField() {
  if (!hero || !canvas || !context) return;
  const box = hero.getBoundingClientRect();
  width = box.width; height = box.height;
  const dpr = Math.min(devicePixelRatio || 1, 1.75);
  canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = width < 700 ? 36 : 76;
  particles = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, radius: .6 + Math.random() * 1.2, phase: Math.random() * Math.PI * 2, speed: .3 + Math.random() * .7 }));
  redrawField();
}
function redrawField() {
  if (!context || !canvas) return;
  context.clearRect(0, 0, width, height);
  const ember = root.dataset.palette === 'ember';
  const rgb = ember ? '255, 171, 91' : '113, 245, 255';
  particles.forEach((particle) => {
    const x = (particle.x + drift * particle.speed * 3) % width;
    const y = particle.y + Math.sin(drift * .5 + particle.phase) * 7;
    const distance = Math.hypot(x - pointer.x, y - pointer.y);
    const alpha = .28 + (Math.sin(drift * 1.4 + particle.phase) + 1) * .18;
    context.beginPath(); context.arc(x, y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(${rgb}, ${alpha})`; context.fill();
    if (distance < 165 && running()) {
      context.beginPath(); context.moveTo(x, y); context.lineTo(pointer.x, pointer.y);
      context.strokeStyle = `rgba(${rgb}, ${(1 - distance / 165) * .26})`;
      context.lineWidth = .7; context.stroke();
    }
  });
  const now = performance.now();
  pulses = pulses.filter((pulse) => now - pulse.start < 1400);
  pulses.forEach((pulse) => {
    const life = (now - pulse.start) / 1400;
    const radius = 12 + life * Math.max(width, height) * .55;
    context.beginPath(); context.arc(pulse.x, pulse.y, radius, 0, Math.PI * 2);
    context.strokeStyle = `rgba(${rgb}, ${(1 - life) * .65})`; context.lineWidth = (1 - life) * 3 + .3; context.stroke();
  });
}
function tick(time: number) {
  frame = 0;
  if (!running() || !visible || document.hidden) { lastTime = 0; return; }
  if (!lastTime || time - lastTime > 30) {
    drift += Math.min((time - (lastTime || time)) / 1000, .08);
    lastTime = time; redrawField();
    if (hero) {
      const x = pointer.x < 0 ? 0 : (pointer.x / width - .5);
      const y = pointer.y < 0 ? 0 : (pointer.y / height - .5);
      hero.style.setProperty('--orbit-x', `${x * 18}px`);
      hero.style.setProperty('--orbit-y', `${y * 14}px`);
      hero.style.setProperty('--orbit-tilt', `${x * 2}deg`);
    }
  }
  frame = requestAnimationFrame(tick);
}
function scheduleField() {
  if (!hero || !context) return;
  if (frame) cancelAnimationFrame(frame);
  frame = 0; lastTime = 0;
  if (running() && visible && !document.hidden) frame = requestAnimationFrame(tick);
  else { pulses = []; redrawField(); }
}
function resetPointer() {
  pointer.x = -1000; pointer.y = -1000;
  hero?.style.setProperty('--pointer-opacity', '0');
  hero?.style.setProperty('--orbit-x', '0px');
  hero?.style.setProperty('--orbit-y', '0px');
  hero?.style.setProperty('--orbit-tilt', '0deg');
}
hero?.addEventListener('pointermove', (event) => {
  if (!running() || event.pointerType === 'touch') return;
  const box = hero.getBoundingClientRect();
  pointer.x = event.clientX - box.left; pointer.y = event.clientY - box.top;
  hero.style.setProperty('--pointer-x', `${pointer.x}px`);
  hero.style.setProperty('--pointer-y', `${pointer.y}px`);
  hero.style.setProperty('--pointer-opacity', '1');
}, { passive: true });
hero?.addEventListener('pointerleave', resetPointer);
core?.addEventListener('click', () => {
  if (!hero || !running()) return;
  const heroBox = hero.getBoundingClientRect(), box = core.getBoundingClientRect();
  pulses.push({ x: box.left - heroBox.left + box.width / 2, y: box.top - heroBox.top + box.height / 2, start: performance.now() });
  if (pulses.length > 4) pulses.shift();
  core.classList.remove('is-pulsing');
  // Flush the previous pulse so repeated deliberate clicks restart feedback.
  void core.offsetWidth;
  core.classList.add('is-pulsing');
  if (lightStatus) lightStatus.textContent = '轨道核心已释放光波';
});
core?.addEventListener('animationend', (event) => { if (event.animationName === 'core-pulse') core.classList.remove('is-pulsing'); });
if (hero) {
  new ResizeObserver(resizeField).observe(hero);
  const fieldObserver = new IntersectionObserver((entries) => {
    visible = entries[0]?.isIntersecting ?? false; scheduleField();
  });
  fieldObserver.observe(hero);
  document.addEventListener('visibilitychange', scheduleField);
  resizeField(); scheduleField();
}
