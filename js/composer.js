// Menggambar photo strip (4 foto vertikal)
const Composer = {
  S: (() => { const W = 600, P = 30, G = 20, F = 100, pw = W - 2 * P, ph = pw * 3 / 4; return { W, P, G, F, pw, ph, H: P + 4 * ph + 3 * G + F }; })(),
  N: 4,

  slotY(i) { return this.S.P + i * (this.S.ph + this.S.G); },

  draw(cv, shots, frame, filter, stickers) {
    const { W, P, F, pw, ph, H } = this.S;
    cv.width = W; cv.height = H;
    const x = cv.getContext('2d');
    x.fillStyle = frame; x.fillRect(0, 0, W, H);
    for (let i = 0; i < this.N; i++) {
      const y = this.slotY(i);
      x.fillStyle = 'rgba(0,0,0,.1)'; x.fillRect(P, y, pw, ph);
      if (!shots[i]) continue;
      x.save(); x.filter = filter; x.drawImage(shots[i], P, y, pw, ph); x.restore();
      if (stickers.length) {
        x.fillStyle = '#000'; x.globalAlpha = 1; x.font = Math.round(pw * .2) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
        const a = i % 2 ? [.9, .12, .1, .88] : [.1, .12, .9, .88];
        x.fillText(stickers[i % stickers.length], P + pw * a[0], y + ph * a[1]);
        x.fillText(stickers[(i + 1) % stickers.length], P + pw * a[2], y + ph * a[3]);
      }
    }
    const n = parseInt(frame.slice(1), 16), lum = ((n >> 16) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11);
    x.fillStyle = lum < 110 ? '#fff' : '#3a2a33'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.font = '800 32px ui-rounded,system-ui,sans-serif';
    x.fillText('♡ ' + CONFIG.TITLE + ' ♡', W / 2, H - F + 42);
    x.font = '400 20px ui-rounded,system-ui,sans-serif';
    x.fillText(new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), W / 2, H - F + 74);
  },

  async fromFiles(files) {
    const list = [...files].slice(0, this.N), shots = [];
    for (const f of list) {
      const img = await new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = URL.createObjectURL(f); });
      const c = document.createElement('canvas'); c.width = 800; c.height = 600;
      const s = Math.max(800 / img.width, 600 / img.height), w = img.width * s, h = img.height * s;
      c.getContext('2d').drawImage(img, (800 - w) / 2, (600 - h) / 2, w, h);
      shots.push(c);
    }
    while (shots.length < this.N) shots.push(shots[shots.length % list.length]);
    return shots;
  }
};