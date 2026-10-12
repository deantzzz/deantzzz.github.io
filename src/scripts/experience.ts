export {};

const root = document.documentElement;
const dialog = document.querySelector<HTMLDialogElement>('#search-dialog');
const searchToggle = document.querySelector<HTMLButtonElement>('.search-toggle');
const searchInput = document.querySelector<HTMLInputElement>('#search-input');
const results = Array.from(document.querySelectorAll<HTMLAnchorElement>('.search-result'));
const searchCount = document.querySelector<HTMLElement>('.search-count');
const searchEmpty = document.querySelector<HTMLElement>('.search-empty');
let searchOrigin: HTMLElement | null = null;

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
  searchOrigin = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  filterPosts();
  dialog.showModal();
  root.classList.add('search-open');
  searchInput?.focus();
}

if (dialog && searchToggle) {
  searchToggle.addEventListener('click', openSearch);
  searchToggle.hidden = false;
}
document.querySelector('.search-close')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('close', () => {
  root.classList.remove('search-open');
  (searchOrigin ?? searchToggle)?.focus({ preventScroll: true });
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
  if (event.key === 'Escape' && dialog?.open) {
    event.preventDefault();
    dialog.close();
    return;
  }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    if (dialog?.open) dialog.close(); else openSearch();
  }
});

// Only reading pages have progress; no animation loop runs while the page is idle.
const progress = document.querySelector<HTMLElement>('.reading-progress');
if (progress) {
  let scrollFrame = 0;
  function updateProgress() {
    const available = root.scrollHeight - innerHeight;
    progress?.style.setProperty('--progress', String(available > 0 ? Math.min(1, Math.max(0, scrollY / available)) : 0));
    scrollFrame = 0;
  }
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateProgress);
  }, { passive: true });
  addEventListener('resize', updateProgress, { passive: true });
  updateProgress();
}
