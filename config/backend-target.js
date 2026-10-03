export function assertCloudflareApiTarget(apiUrl) {
  if (!apiUrl) return;
  let url;
  try { url = new URL(apiUrl); }
  catch { throw new Error('VITE_API_URL harus berupa alamat HTTPS API Cloudflare, bukan path relatif.'); }
  if (url.protocol !== 'https:' || /(?:^|\.)on\.aws$|(?:^|\.)amazonaws\.com$/.test(url.hostname)) {
    throw new Error('Build Nalaro membutuhkan VITE_API_URL HTTPS API Cloudflare. Endpoint AWS lama tidak menyediakan Learning Insights dan agenda Cloudflare.');
  }
}
