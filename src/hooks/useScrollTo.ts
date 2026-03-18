const HEADER_HEIGHT = 80;

export function scrollToElement(selector: string) {
  const element = document.querySelector(selector);
  if (!element) return;

  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - HEADER_HEIGHT;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
}

export function handleAnchorClick(
  e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
  href: string,
  callback?: () => void
) {
  if (href.startsWith('#')) {
    e.preventDefault();
    scrollToElement(href);
    callback?.();
  }
}
