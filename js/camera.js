// Akses kamera & ambil frame dari video
const Camera = {
  async start(video) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
      audio: false
    });
    video.srcObject = stream;
    await video.play();
  },

  // Ambil satu foto 4:3 (800x600), di-mirror agar sama dengan preview
  grab(video) {
    const c = document.createElement('canvas');
    c.width = 800; c.height = 600;
    const x = c.getContext('2d');
    const vw = video.videoWidth, vh = video.videoHeight, r = 4 / 3;
    let sw = vw, sh = vw / r;
    if (sh > vh) { sh = vh; sw = vh * r; }
    x.translate(800, 0); x.scale(-1, 1);
    x.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, 800, 600);
    return c;
  }
};