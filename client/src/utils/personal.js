export function normalizeLinkedin(val) {
  const raw = (val && String(val).trim()) || '';
  if (!raw) return 'https://www.linkedin.com/in/your-handle';
  if (/^https?:\/\//i.test(raw)) return raw;
  if (/linkedin\.com/i.test(raw)) return 'https://' + raw.replace(/^https?:\/\//i, '');
  return `https://www.linkedin.com/in/${raw}`;
}

export function displayUrl(url) {
  return String(url).replace(/^https?:\/\/(www\.)?/, '');
}

export function mailto(email) {
  return `mailto:${email}`;
}

export function tel(phone) {
  return `tel:${phone}`;
}

