import { apiRequest } from './api';

export async function getAgenda(from, to, { signal } = {}) {
  const query = new URLSearchParams({ from, to });
  const data = await apiRequest(`/learning/agenda?${query}`, { signal });
  return data.agenda;
}

export function agendaErrorMessage(error) {
  if (error?.status === 404) return 'Agenda belum tersedia pada layanan yang digunakan aplikasi ini.';
  if (error?.status === 401) return 'Sesi masuk berakhir. Silakan masuk kembali.';
  return error?.message || 'Agenda belum dapat dimuat. Coba lagi.';
}
