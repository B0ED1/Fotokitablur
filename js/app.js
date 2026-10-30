// Logika UI & alur photobooth
const $ = id => document.getElementById(id);
const vid = $('vid'), cam = $('cam'), cv = $('cv'), out = $('out'), go = $('go'), msg = $('msg'), cnt = $('count'), flash = $('flash');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const S = Composer.S;

let frame = CONFIG.FRAMES[0][1], filter = CONFIG.FILTERS[0][1], stickers = [];
let shots = [], busy = false, done = false, camOk = false, audio;

function place(i) {
  cam.style.left = S.P / S.W * 100 + '%'; cam.style.width = S.pw / S.W * 100 + '%';
  cam.style.top = Composer.slotY(i) / S.H * 100 + '%'; cam.style.height = S.ph / S.H * 100 + '%';
}

function redraw() {
  Composer.draw(cv, shots, frame, filter, stickers);
  if (done) out.src = cv.toDataURL('image/png'), $('dl').href = out.src;
}

function pills(id, items, onPick, swatch) {
  items.forEach((it, i) => {
    const b = document.createElement('button');
    b.className = 'pill' + (i ? '' : ' on');
    if (swatch) b.innerHTML = '<i class="sw" style="background:' + it[1] + '"></i>';
    b.append(it[0]);
    b.onclick = () => { [...$(id).children].forEach(x => x.classList.remove('on')); b.classList.add('on'); onPick(it); redraw(); };
    $(id).append(b);
  });
}
pills('frames', CONFIG.FRAMES, f => frame = f[1], true);
pills('filters', CONFIG.FILTERS, f => { filter = f[1]; vid.style.filter = f[1]; });
pills('stickers', CONFIG.STICKERS, s => stickers = s[1]);

// Custom frame color
const cl = document.createElement('label');
cl.className = 'pill'; cl.innerHTML = 'Custom <input type="color" value="#ff8fb8">';
cl.querySelector('input').oninput = e => { [...$('frames').children].forEach(x => x.classList.remove('on')); cl.classList.add('on'); frame = e.target.value; redraw(); };
$('frames').append(cl);

function beep(freq, dur) {
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const o = audio.createOscillator(), g = audio.createGain();
    o.frequency.value = freq; g.gain.value = .08; o.connect(g); g.connect(audio.destination);
    o.start(); o.stop(audio.currentTime + dur);
  } catch (e) {}
}

function finish() {
  done = true; $('opts').hidden = false; cam.hidden = true; cv.hidden = true; out.hidden = false;
  redraw();
  go.hidden = true; $('upl').hidden = true; $('dl').hidden = false; $('again').hidden = false;
  msg.textContent = 'Foto sudah jadi! Sekarang atur frame, filter & stiker sesuai selera. Kalau tombol unduh tidak jalan, tekan lama / klik kanan gambar lalu simpan.';
}

async function run() {
  if (busy) return;
  busy = true; go.disabled = true; shots = []; redraw(); msg.textContent = 'Siap-siap, senyum! 😊';
  for (let i = 0; i < Composer.N; i++) {
    place(i); cam.hidden = false;
    for (let n = CONFIG.COUNTDOWN; n > 0; n--) { cnt.innerHTML = '<span>' + n + '</span>'; beep(660, .12); await sleep(900); }
    cnt.innerHTML = ''; flash.style.opacity = .9; beep(1100, .2);
    shots.push(Camera.grab(vid)); redraw();
    await sleep(150); flash.style.opacity = 0; await sleep(500);
  }
  busy = false; go.disabled = false; finish();
}

go.onclick = run;
$('up').onchange = async e => {
  if (!e.target.files.length) return;
  shots = await Composer.fromFiles(e.target.files); e.target.value = ''; finish();
};
$('again').onclick = () => {
  shots = []; done = false; $('opts').hidden = true; out.hidden = true; cv.hidden = false; redraw();
  $('dl').hidden = true; $('again').hidden = true; go.hidden = false; $('upl').hidden = false;
  place(0); cam.hidden = !camOk; msg.textContent = 'Tekan “Mulai foto!” kalau sudah siap.';
};

redraw(); place(0);
Camera.start(vid)
  .then(() => { camOk = true; cam.hidden = false; go.disabled = false; msg.textContent = 'Kamera siap. Tekan “Mulai foto!”'; })
  .catch(() => { msg.textContent = 'Kamera tidak bisa diakses. Izinkan akses kamera, atau pakai “Upload foto”.'; });