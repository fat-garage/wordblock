/* eslint-disable no-multi-assign */
/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
export function getUUID() {
  const s: any = [];
  const hexDigits = '0123456789abcdef';
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';

  const uuid = s.join('');
  return uuid.slice(0, 8);
}

export function getQueryString(name, url) {
  const res = (url || location.href).match(new RegExp(`[?&#]${name}=([^&#]+)`, 'i'));

  if (res == null || res.length < 1) {
    return null;
  }

  return decodeURIComponent(res[1]);
}

export function removeQueryString(url) {
  const res = (url || location.href).replace(
    /\/[?&]time=([^&#]+)[?&]author=([^&#]+)[?&]tags=([^&#]+)[?&]id=([^&#]+)/,
    '',
  );
  return res;
}
