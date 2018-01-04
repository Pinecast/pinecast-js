export function gettext(text) {
  return text;
}
export function ngettext(text, plural, n) {
  return (n === 1 ? text : plural).replace(/%d/, n);
}

export function interpolate(...args) {
  if (typeof window.interpolate !== 'function') {
    throw new Error('Django interpolate not loaded');
  }
  return window.interpolate(...args);
}
