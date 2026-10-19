export function authErrorMessage(error, mode = 'login') {
  if (error.message?.includes('terdaftar sebagai')) return error.message;
  if (error.code === 'auth/unauthorized-domain') return 'Alamat situs ini belum diizinkan untuk login Google. Pengelola perlu menambahkannya di Firebase Authentication → Settings → Authorized domains.';
  if (error.code === 'auth/popup-blocked') return 'Popup Google diblokir browser. Izinkan popup untuk situs ini lalu coba lagi.';
  if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') return 'Login Google dibatalkan. Silakan coba lagi.';
  if (error.code === 'auth/email-already-in-use') return 'Email ini sudah terdaftar. Pilih Masuk untuk melanjutkan.';
  if (error.code === 'auth/invalid-email') return 'Format email belum tepat.';
  if (error.code === 'auth/weak-password') return 'Kata sandi terlalu lemah. Gunakan minimal 6 karakter.';
  if (error.code === 'auth/too-many-requests') return 'Terlalu banyak percobaan. Tunggu sebentar lalu coba lagi.';
  if (error.code === 'auth/network-request-failed') return 'Koneksi terputus. Periksa internet lalu coba lagi.';
  if (error.code === 'permission-denied' || error.code === 'unavailable') return 'Profil akun belum dapat dimuat. Coba lagi sebentar; jika berlanjut hubungi pengelola.';
  if (mode === 'google') return 'Login Google belum berhasil. Silakan coba lagi.';
  return mode === 'register' ? 'Pendaftaran belum berhasil. Coba lagi.' : 'Email atau kata sandi belum tepat.';
}
