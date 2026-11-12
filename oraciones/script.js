'use strict';
const KEY = 'lengua6_oraciones_v1';
const $ = (s) => document.querySelector(s);
const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pickRnd = (a) => a[Math.random() * a.length | 0];
const NS = 'http://www.w3.org/2000/svg';
const GOOD = ['¡Excelente!', '¡Muy bien!', '¡Eso es!', '¡Genial, seguí así!', '¡Correcto, campeón/a!'];
const BAD = ['¡Casi! Con práctica sale.', 'No te desanimes: cada error enseña.', 'Ups, mirá la pista y seguí.'];

/* ---------- Datos de los niveles ---------- */
const LV = [
  { id: 1, icon: '🔍', name: 'Detective de oraciones', color: '#6c5ce7', type: 'classify',
    ask: '¿La oración es bimembre (sujeto + predicado) o unimembre (una sola unidad)?',
    items: [
      { t: 'Los chicos juegan en el patio.', a: 0, w: 'Tiene sujeto (Los chicos) y predicado (juegan en el patio): es bimembre.' },
      { t: '¡Qué hermoso día!', a: 1, w: 'Es una exclamación que no se divide en sujeto y predicado: unimembre.' },
      { t: 'Llueve.', a: 1, w: 'Los fenómenos de la naturaleza forman oraciones unimembres.' },
      { t: 'Mi abuela prepara empanadas.', a: 0, w: 'Sujeto: Mi abuela. Predicado: prepara empanadas.' },
      { t: '¡Auxilio!', a: 1, w: 'Una interjección es una oración unimembre.' },
      { t: 'Los alumnos de sexto leen cuentos.', a: 0, w: 'Sujeto: Los alumnos de sexto. Predicado: leen cuentos.' },
      { t: 'Hace mucho calor.', a: 1, w: 'Hace + fenómeno del clima: no tiene sujeto, es unimembre.' },
      { t: 'Ana canta.', a: 0, w: 'Aunque es corta, tiene sujeto (Ana) y predicado (canta).' }] },
  { id: 2, icon: '🧩', name: 'Completá la oración', color: '#00b894', type: 'fill',
    ask: 'Elegí la parte que completa la oración.',
    items: [
      { t: '___ pintó un mural enorme.', k: 'Falta el SUJETO', o: ['La artista', 'Pintó murales', 'Muy grande'], a: 0, w: 'Quien pintó es el sujeto: «La artista».' },
      { t: 'Mi perro ___.', k: 'Falta el PREDICADO', o: ['y mi gato', 'duerme en la cocina', 'El jardín'], a: 1, w: 'Lo que se dice del sujeto es el predicado: «duerme en la cocina».' },
      { t: '___ viajaron a Mendoza en vacaciones.', k: 'Falta el SUJETO', o: ['Mis primos', 'Viajar mucho', 'en el auto'], a: 0, w: 'El sujeto concuerda con «viajaron» (plural): «Mis primos».' },
      { t: 'La maestra ___.', k: 'Falta el PREDICADO', o: ['de Lengua', 'corrige las tareas', 'Los libros'], a: 1, w: 'Necesita un verbo conjugado: «corrige las tareas».' },
      { t: '___ florecieron en primavera.', k: 'Falta el SUJETO', o: ['Los almendros', 'Muy lindos', 'Florecer'], a: 0, w: 'El sujeto plural «Los almendros» concuerda con el verbo.' }] },
  { id: 3, icon: '🎯', name: 'Arrastrá y soltá', color: '#e17055', type: 'drag',
    ask: 'Llevá cada parte al SUJETO o al PREDICADO (arrastrá o tocá la parte y después la caja).',
    items: [
      { S: ['Mi hermana menor', 'Los bomberos valientes'], P: ['toca el piano', 'apagaron el incendio'] },
      { S: ['Las nubes oscuras', 'El tren de la mañana'], P: ['cubren el cielo', 'llegó puntual'] },
      { S: ['Mis primos de San Rafael', 'La maestra de Lengua'], P: ['visitan las bodegas', 'corrige las tareas'] }] },
  { id: 4, icon: '🔗', name: 'Uní con flechas', color: '#0984e3', type: 'match',
    ask: 'Tocá un concepto y después su pareja. Cuando unas todo, comprobá.',
    items: [
      { p: [['Oración bimembre', 'Tiene sujeto y predicado'], ['Oración unimembre', 'No se divide en sujeto y predicado'], ['Sujeto', 'De quién o de qué se dice algo'], ['Predicado', 'Lo que se dice del sujeto']] },
      { p: [['Núcleo del sujeto', 'Sustantivo o pronombre principal'], ['Núcleo del predicado', 'Verbo conjugado'], ['Ejemplo bimembre', 'Los niños leen.'], ['Ejemplo unimembre', '¡Qué frío!']] }] },
  { id: 5, icon: '💡', name: 'Cazador de núcleos', color: '#fd79a8', type: 'nucleus',
    ask: 'Tocá primero el núcleo del SUJETO y después el núcleo del PREDICADO.',
    items: [
      { t: 'Los niños pequeños juegan en el patio', s: 1, p: 3 },
      { t: 'La música suave relaja a todos', s: 1, p: 3 },
      { t: 'El gato negro duerme sobre el sofá', s: 1, p: 3 },
      { t: 'Las flores del jardín huelen muy bien', s: 1, p: 4 },
      { t: 'Mis amigos viajaron a Buenos Aires', s: 1, p: 2 }] },
  { id: 6, icon: '🏰', name: 'Gran desafío', color: '#d63031', type: 'mc',
    ask: 'Elegí la respuesta correcta.',
    items: [
      { t: '¿Cuál es una oración unimembre?', o: ['Los pájaros cantan.', '¡Qué lindo paisaje!', 'Mi mamá trabaja.'], a: 1, w: 'Las exclamaciones sin verbo y sujeto son unimembres.' },
      { t: 'El núcleo del sujeto es siempre un…', o: ['verbo', 'sustantivo o pronombre', 'adverbio'], a: 1, w: 'El núcleo del sujeto es un sustantivo (o pronombre).' },
      { t: 'En «Nieva en la cordillera», la oración es…', o: ['bimembre, porque tiene verbo', 'unimembre, porque no tiene sujeto', 'bimembre, porque tiene lugar'], a: 1, w: 'Los fenómenos naturales no tienen sujeto: unimembre.' },
      { t: 'El núcleo del predicado es…', o: ['el verbo conjugado', 'el sustantivo', 'el artículo'], a: 0, w: 'Es el verbo conjugado.' },
      { t: '¿Cuál oración es bimembre?', o: ['¡Feliz cumpleaños!', 'Hace frío.', 'Los alumnos estudian.'], a: 2, w: 'Sujeto: Los alumnos. Predicado: estudian.' },
      { t: 'En «La profesora corrige las pruebas», el sujeto es…', o: ['La profesora', 'corrige las pruebas', 'las pruebas'], a: 0, w: 'Es quien realiza la acción: «La profesora».' }] }
];
const MEDALS = {
  primer: ['🥇', 'Primer paso', 'Terminaste un nivel'],
  racha: ['🔥', 'Racha de fuego', '5 aciertos seguidos'],
  perfecto: ['💎', 'Nivel perfecto', 'Un nivel sin errores'],
  estrellas: ['⭐', 'Cazaestrellas', 'Juntá 10 estrellas'],
  maestro: ['👑', 'Maestro de oraciones', 'Completá los 6 niveles']
};

/* ---------- Estado y almacenamiento ---------- */
const dflt = () => ({ name: '', pts: 0, stars: {}, medals: [], run: null });
let S = load();
function load() { try { return Object.assign(dflt(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { return dflt(); } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* sin almacenamiento */ } }
const totalStars = () => Object.values(S.stars).reduce((a, b) => a + b, 0);
const unlocked = (i) => i === 0 || (S.stars[LV[i - 1].id] || 0) >= 1;
const allDone = () => LV.every((l) => (S.stars[l.id] || 0) >= 1);

function show(id) {
  document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
  $('#hud').hidden = id === 's-welcome';
  $('#h-name').textContent = S.name; $('#h-stars').textContent = totalStars(); $('#h-pts').textContent = S.pts;
  window.scrollTo(0, 0);
}
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2800); }
function medal(k) { if (!S.medals.includes(k)) { S.medals.push(k); toast(MEDALS[k][0] + ' ¡Nueva medalla: ' + MEDALS[k][1] + '!'); } }
const starStr = (n) => '⭐'.repeat(n) + '☆'.repeat(3 - n);
function medalsHTML(box) { box.innerHTML = ''; Object.entries(MEDALS).forEach(([k, m]) => box.append(el('div', 'medal' + (S.medals.includes(k) ? '' : ' off'), `<span>${m[0]}</span><b>${m[1]}</b><br>${m[2]}`))); }

/* ---------- Pantallas ---------- */
function welcome() {
  $('#in-name').value = S.name;
  $('#b-start').textContent = S.name ? '▶ Continuar la aventura' : '¡Empezar la aventura!';
  $('#b-reset').hidden = !S.name; show('s-welcome');
}
$('#b-start').onclick = () => {
  const n = $('#in-name').value.trim();
  if (!n) { toast('Escribí tu nombre para empezar 😊'); $('#in-name').focus(); return; }
  S.name = n; save(); map();
};
$('#b-reset').onclick = () => { if (confirm('¿Seguro que querés borrar todo tu progreso?')) { S = dflt(); save(); welcome(); } };
$('#h-home').onclick = map;

function map() {
  const m = $('#map'); m.innerHTML = '';
  LV.forEach((l, i) => {
    const ok = unlocked(i), st = S.stars[l.id] || 0, going = S.run && S.run.lvl === i;
    const b = el('button', 'node', `<span class="ic">${ok ? l.icon : '🔒'}</span><span><b>Nivel ${l.id}</b><small>${l.name}</small><span class="st">${ok ? starStr(st) : 'Bloqueado'}</span>${going ? '<small>▶ Continuar</small>' : ''}</span>`);
    b.style.background = l.color; b.disabled = !ok; b.onclick = () => startLevel(i); m.append(b);
  });
  medalsHTML($('#medals')); show('s-map');
}

/* ---------- Motor del juego ---------- */
const act = $('#act'), fb = $('#fb'), bNext = $('#b-next'), bCheck = $('#b-check');
function startLevel(i, fresh) {
  if (fresh || !S.run || S.run.lvl !== i) S.run = { lvl: i, idx: 0, ok: 0, pts: 0, streak: 0, bad: 0 };
  save(); show('s-game'); play();
}
function play() {
  const r = S.run, L = LV[r.lvl], it = L.items[r.idx];
  $('#g-title').textContent = L.icon + ' ' + L.name; $('#g-count').textContent = `${r.idx + 1} / ${L.items.length}`;
  $('#g-prog').style.width = (r.idx / L.items.length * 100) + '%'; $('#g-ask').textContent = L.ask;
  fb.className = 'fb'; fb.textContent = ''; bNext.hidden = true; bCheck.hidden = true; bCheck.onclick = null; act.innerHTML = ''; window._rd = null;
  R[L.type](it, act);
}
function answer(ok, hint) {
  const r = S.run;
  if (ok) { r.ok++; r.streak++; r.pts += 10; S.pts += 10; if (r.streak >= 5) medal('racha'); } else { r.streak = 0; r.bad++; }
  fb.className = 'fb ' + (ok ? 'ok' : 'bad');
  fb.textContent = (ok ? pickRnd(GOOD) + ' +10 puntos. ' : pickRnd(BAD) + ' ') + (hint || '');
  bCheck.hidden = true; bNext.hidden = false; save(); $('#h-pts').textContent = S.pts; bNext.focus();
}
bNext.onclick = () => { S.run.idx++; if (S.run.idx >= LV[S.run.lvl].items.length) finish(); else { save(); play(); } };

function finish() {
  const r = S.run, L = LV[r.lvl], n = L.items.length, pct = r.ok / n;
  const st = pct >= 0.9 ? 3 : pct >= 0.7 ? 2 : pct >= 0.5 ? 1 : 0;
  const bonus = st * 5; S.pts += bonus; r.pts += bonus;
  S.stars[L.id] = Math.max(S.stars[L.id] || 0, st);
  if (st >= 1) medal('primer'); if (r.ok === n) medal('perfecto'); if (totalStars() >= 10) medal('estrellas');
  if (LV.every((l) => (S.stars[l.id] || 0) >= 2)) medal('maestro');
  const msgs = ['¡No pasa nada! Repasá y probá de nuevo 💪', '¡Buen intento! Ya desbloqueaste el siguiente nivel 🙂', '¡Muy bien! Dominás el tema 🎉', '¡Perfecto! Sos un/a genio/a de las oraciones 🌟'];
  $('#r-title').textContent = `Nivel ${L.id} · ${L.name}`; $('#r-stars').textContent = starStr(st);
  $('#r-msg').textContent = msgs[st]; $('#r-ok').textContent = `${r.ok} de ${n}`; $('#r-pts').textContent = r.pts;
  const next = LV[r.lvl + 1], lvl = r.lvl;
  $('#r-next').hidden = !(next && st >= 1); $('#r-final').hidden = !allDone();
  $('#r-retry').onclick = () => startLevel(lvl, true); $('#r-map').onclick = map;
  $('#r-next').onclick = () => startLevel(lvl + 1, true); $('#r-final').onclick = final;
  S.run = null; save(); show('s-result');
}
function final() {
  const t = totalStars();
  $('#f-title').textContent = `¡Felicitaciones, ${S.name}!`; $('#f-pts').textContent = S.pts; $('#f-stars').textContent = `${t} de ${LV.length * 3}`;
  const fl = $('#f-levels'); fl.innerHTML = '';
  LV.forEach((l) => fl.append(el('div', '', `${l.icon} Nivel ${l.id}<br>${starStr(S.stars[l.id] || 0)}`)));
  medalsHTML($('#f-medals')); $('#f-map').onclick = map; show('s-final');
}

/* ---------- Tipos de actividad ---------- */
function pick(a, opts, ai, hint, sh) {
  const row = el('div', 'choices'); let arr = opts.map((t, i) => ({ t, c: i === ai }));
  if (sh) arr = shuffle(arr);
  arr.forEach((o) => {
    const b = el('button', 'choice', o.t);
    b.onclick = () => {
      [...row.children].forEach((x) => (x.disabled = true)); b.classList.add(o.c ? 'right' : 'wrong');
      if (!o.c) [...row.children].forEach((x, i) => { if (arr[i].c) x.classList.add('right'); });
      answer(o.c, hint);
    };
    row.append(b);
  });
  a.append(row);
}
const R = {
  classify(it, a) { a.append(el('div', 'sentence', it.t)); pick(a, ['Bimembre', 'Unimembre'], it.a, it.w, false); },
  fill(it, a) { a.append(el('div', 'tag', it.k), el('div', 'sentence', it.t.replace('___', '<span class="blank">&nbsp;</span>'))); pick(a, it.o, it.a, it.w, true); },
  mc(it, a) { a.append(el('div', 'sentence', it.t)); pick(a, it.o, it.a, it.w, true); },

  drag(it, a) {
    const chips = shuffle([...it.S.map((t) => ({ t, k: 'S' })), ...it.P.map((t) => ({ t, k: 'P' }))]);
    const zs = el('div', 'zone', '<b>🟣 SUJETO</b>'), zp = el('div', 'zone', '<b>🟠 PREDICADO</b>'), pool = el('div', 'zone pool');
    zs.dataset.k = 'S'; zp.dataset.k = 'P';
    const wrap = el('div', 'zones'); wrap.append(zs, zp); a.append(pool, wrap);
    let sel = null, drag = null, done = false;
    const move = (c, z) => { z.append(c); c.classList.remove('sel'); sel = null; bCheck.hidden = pool.querySelectorAll('.dchip').length > 0; };
    const nodes = chips.map((o) => {
      const c = el('div', 'dchip', o.t); c.draggable = true; c.k = o.k;
      c.ondragstart = (e) => { drag = c; e.dataTransfer.setData('text', o.t); };
      c.onclick = (e) => {
        if (done) return; e.stopPropagation();
        if (c.parentNode === pool) { if (sel === c) { c.classList.remove('sel'); sel = null; } else { if (sel) sel.classList.remove('sel'); sel = c; c.classList.add('sel'); } }
        else if (sel) move(sel, c.parentNode); else move(c, pool);
      };
      pool.append(c); return c;
    });
    [zs, zp, pool].forEach((z) => {
      z.ondragover = (e) => e.preventDefault();
      z.ondrop = (e) => { e.preventDefault(); if (drag && !done) move(drag, z); drag = null; };
      z.onclick = () => { if (sel && !done) move(sel, z); };
    });
    bCheck.onclick = () => {
      done = true; let all = true;
      nodes.forEach((c) => { const good = c.parentNode.dataset.k === c.k; if (!good) all = false; c.classList.add(good ? 'right' : 'wrong'); c.draggable = false; });
      answer(all, all ? 'Todas las partes están bien ubicadas.' : 'Recordá: el sujeto dice de quién se habla; el predicado, lo que se dice de él.');
    };
  },

  match(it, a) {
    const Rr = shuffle(it.p.map((x, i) => ({ t: x[1], i })));
    const box = el('div', 'match'), lc = el('div', 'col'), rc = el('div', 'col'), svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'lines'); let sel = null, done = false; const links = {};
    function draw(res) {
      svg.innerHTML = ''; const bb = box.getBoundingClientRect();
      for (const k in links) {
        const A = lb[k].getBoundingClientRect(), B = rb[links[k]].getBoundingClientRect(), ln = document.createElementNS(NS, 'line');
        ln.setAttribute('x1', A.right - bb.left); ln.setAttribute('y1', A.top + A.height / 2 - bb.top);
        ln.setAttribute('x2', B.left - bb.left); ln.setAttribute('y2', B.top + B.height / 2 - bb.top);
        if (res) ln.setAttribute('class', Rr[links[k]].i === +k ? 'ok' : 'bad'); svg.append(ln);
      }
    }
    const lb = it.p.map((x, i) => {
      const b = el('button', 'm-item', x[0]);
      b.onclick = () => { if (done) return; sel = i; lb.forEach((y, j) => y.classList.toggle('sel', j === i)); };
      lc.append(b); return b;
    });
    const rb = Rr.map((o, j) => {
      const b = el('button', 'm-item r', o.t);
      b.onclick = () => {
        if (done || sel === null) return;
        for (const k in links) if (links[k] === j) delete links[k];
        links[sel] = j; sel = null; lb.forEach((y) => y.classList.remove('sel')); draw();
        bCheck.hidden = Object.keys(links).length < it.p.length;
      };
      rc.append(b); return b;
    });
    box.append(lc, svg, rc); a.append(box); window._rd = () => draw(done);
    bCheck.onclick = () => {
      done = true; draw(true); const all = Object.keys(links).every((k) => Rr[links[k]].i === +k);
      answer(all, all ? 'Todas las parejas son correctas.' : 'Las flechas rojas están mal: repasá las definiciones.');
    };
  },

  nucleus(it, a) {
    const ws = it.t.split(' '), step = el('div', 'tag', '1️⃣ Núcleo del SUJETO'), row = el('div', 'words'); let st = 0, gs = null;
    const bs = ws.map((w, i) => {
      const b = el('button', 'w', w);
      b.onclick = () => {
        if (st === 0) { gs = i; b.classList.add('s'); st = 1; step.textContent = '2️⃣ Núcleo del PREDICADO'; }
        else if (st === 1 && i !== gs) {
          st = 2; const gp = i, okS = gs === it.s, okP = gp === it.p;
          bs.forEach((x) => (x.disabled = true));
          bs[it.s].classList.add('s'); bs[it.p].classList.add('p'); if (!okS) bs[gs].classList.add('bad'); if (!okP) bs[gp].classList.add('bad');
          answer(okS && okP, `Núcleo del sujeto: «${ws[it.s]}». Núcleo del predicado: «${ws[it.p]}».`);
        }
      };
      row.append(b); return b;
    });
    a.append(step, row);
  }
};

$('#f-map').onclick = map;
window.addEventListener('resize', () => window._rd && window._rd());
welcome();
