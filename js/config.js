// Pengaturan photobooth — ubah di sini untuk kustomisasi
const CONFIG = {
  COUNTDOWN: 3,          // detik hitung mundur
  TITLE: 'photobooth',   // teks di bagian bawah strip
  FRAMES: [['White', '#ffffff'], ['Pink', '#ffc2d9'], ['Blue', '#b9dcff'], ['Purple', '#d4c2ff'], ['Burgundy', '#7a1020']],
  FILTERS: [
    ['Normal', 'none'],
    ['B&W', 'grayscale(1) contrast(1.1)'],
    ['Sepia', 'sepia(.8)'],
    ['Vintage', 'sepia(.35) contrast(1.1) saturate(1.3) hue-rotate(-12deg)'],
    ['Bright', 'saturate(1.4) brightness(1.08)']
  ],
  STICKERS: [['No Stickers', []], ['Cute', ['❤️', '🎀', '🌸', '✨']], ['Stars', ['⭐', '✨', '💫']], ['Cool', ['😎', '🔥', '💿']]]
};