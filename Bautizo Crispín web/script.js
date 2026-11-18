/* ===== CONFIG (EDITAR) ===== */
const CONFIG = {
  FECHA: '2027-01-23T12:00:00-06:00',                          // fecha y hora de la ceremonia
  FORM_URL: 'https://docs.google.com/forms/d/e/TU_ID_DEL_FORM/formResponse', // EDITAR: link de Google Forms (termina en /formResponse)
  ENTRY_NOMBRE: 'entry.0000000000',                            // EDITAR
  ENTRY_PASES:  'entry.1111111111',                            // EDITAR
  ENTRY_ASISTE: 'entry.2222222222',                            // EDITAR
  SI: 'Sí asistiré',                                           // debe coincidir con la opción del Form
  NO: 'No podré asistir',                                      // debe coincidir con la opción del Form
  MAX_PASES: 10                                                // tope de pases (el invitado no lo ve como límite)
};

const $ = s => document.querySelector(s), $$ = s => document.querySelectorAll(s);

// Marca imágenes que aún no existen
$$('img').forEach(i => { i.onerror = () => i.classList.add('falta'); });

// Nombre dorado letra por letra
const nom = $('.nombre-oro');
nom.innerHTML = [...nom.textContent].map((c, i) =>
  `<span style="animation-delay:${1.2 + i * .09}s">${c === ' ' ? '&nbsp;' : c}</span>`).join('');

// ===== Música =====
const audio = $('#musica'), pp = $('#pp'), mus = $('#mus');
audio.addEventListener('play',  () => pp.textContent = '❚❚');
audio.addEventListener('pause', () => pp.textContent = '▶');
pp.onclick = () => audio.paused ? audio.play() : audio.pause();
$('#lengua').onclick = () => mus.classList.toggle('on');


// Pausar la música al bloquear el celular o minimizar
let estabaSonando = false;
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    estabaSonando = !audio.paused;
    audio.pause();
  } else if (estabaSonando) {
    audio.play().catch(() => {});
    estabaSonando = false;
  }
});
window.addEventListener('pagehide', () => audio.pause());

// Separadores entre secciones
$$('#inv .sec').forEach((s, i) => {
  if (i === 0) return;
  const d = document.createElement('div');
  d.className = 'sep rv';
  d.innerHTML = '<span>❖</span>';
  s.before(d);
});

// ===== Abrir sobre =====
let abierto = false;
$('#sobre').addEventListener('click', () => {
  if (abierto) return;
  abierto = true;
  $('#intro').classList.add('open');
  audio.play().catch(() => {});
  setTimeout(() => {
    $('#intro').classList.add('fuera');
    document.body.classList.remove('bloq');
    document.body.classList.add('show');
    window.scrollTo(0, 0);
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('v'); io.unobserve(e.target); }
    }), { threshold: .15 });
    $$('.rv').forEach(el => io.observe(el));
  }, 1700);
});

// ===== Contador =====
const meta = new Date(CONFIG.FECHA);
function tick() {
  const s = Math.floor(Math.max(0, meta - Date.now()) / 1000);
  const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), s % 60];
  $$('.cont b').forEach((b, i) => b.textContent = String(v[i]).padStart(2, '0'));
}
tick(); setInterval(tick, 1000);

// ===== Confirmación (envío silencioso a Google Forms) =====
const sel = $('#pases'), f = $('#rsvp');
for (let i = 1; i <= CONFIG.MAX_PASES; i++) sel.add(new Option(i + (i === 1 ? ' pase' : ' pases'), i));
f.action = CONFIG.FORM_URL;
$('#nombre').name = CONFIG.ENTRY_NOMBRE;
sel.name = CONFIG.ENTRY_PASES;
$('#si').name = $('#no').name = CONFIG.ENTRY_ASISTE;
$('#si').value = CONFIG.SI;
$('#no').value = CONFIG.NO;

f.addEventListener('submit', () => {
  const va = $('#si').checked;
  setTimeout(() => {
    f.hidden = true;
    const g = $('#gracias');
    g.textContent = va ? '¡Gracias por confirmar! Nos hará muy felices contar contigo.' : 'Gracias por avisarnos. Te llevamos en el corazón.';
    g.hidden = false;
  }, 700);
});
