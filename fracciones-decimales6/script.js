/* =========================================================
   CUADERNO DE FRACCIONES Y DECIMALES
   Motor genérico de actividades interactivas — 6° grado
   ========================================================= */

/* ---------- Helpers generales ---------- */

function fmt(value) {
  // Muestra números con coma decimal (convención Argentina)
  return String(value).replace('.', ',');
}

function parseValue(v) {
  if (typeof v === 'number') return v;
  if (v && typeof v === 'object' && 'n' in v && 'd' in v) return v.n / v.d;
  if (typeof v === 'string') {
    if (v.includes('/')) {
      const [n, d] = v.split('/').map(Number);
      return n / d;
    }
    return parseFloat(v.replace(',', '.'));
  }
  return NaN;
}

function el(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.innerHTML = content;
  return node;
}

function fracHTML(n, d) {
  return `<span class="frac-display"><span class="num">${n}</span><span class="den">${d}</span></span>`;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- Datos: 10 actividades de FRACCIONES ---------- */

const FRACTION_ACTIVITIES = [
  {
    id: 'f1', emoji: '🍕', title: 'Coloreá la fracción',
    desc: 'Pintá porciones de pizza y de barras para representar cada fracción.',
    instruction: 'Tocá las porciones necesarias hasta representar la fracción indicada. Después presioná Verificar.',
    itemType: 'colorGrid',
    items: [
      { shape: 'pizza', total: 4, target: 3, label: '3/4', isDecimal: false },
      { shape: 'rect', total: 6, target: 2, label: '2/6', isDecimal: false },
      { shape: 'pizza', total: 8, target: 5, label: '5/8', isDecimal: false },
    ],
  },
  {
    id: 'f2', emoji: '⚖️', title: 'Comparar fracciones',
    desc: 'Elegí el signo correcto: <, > o =.',
    instruction: 'Observá las dos fracciones y elegí el símbolo que las relaciona correctamente.',
    itemType: 'compare',
    items: [
      { left: { n: 1, d: 2 }, right: { n: 1, d: 3 }, answer: '>' },
      { left: { n: 3, d: 4 }, right: { n: 5, d: 8 }, answer: '>' },
      { left: { n: 2, d: 5 }, right: { n: 4, d: 10 }, answer: '=' },
    ],
  },
  {
    id: 'f3', emoji: '📏', title: 'Ubicar en la recta numérica',
    desc: 'Arrastrá el punto hasta la posición correcta.',
    instruction: 'Arrastrá el marcador sobre la recta hasta ubicar la fracción indicada.',
    itemType: 'numberLine',
    items: [
      { min: 0, max: 1, target: 0.5, label: '1/2', isDecimal: false },
      { min: 0, max: 1, target: 0.25, label: '1/4', isDecimal: false },
      { min: 0, max: 2, target: 1.5, label: '3/2', isDecimal: false },
    ],
  },
  {
    id: 'f4', emoji: '🧩', title: 'Fracciones equivalentes',
    desc: 'Arrastrá cada tarjeta al grupo que le corresponde.',
    instruction: 'Arrastrá (o tocá la tarjeta y después el grupo) cada fracción hacia el grupo de fracciones equivalentes correcto.',
    itemType: 'dragMatch',
    items: [
      { bins: [{ label: '≈ 1/2', accepts: ['2/4', '3/6'] }, { label: '≈ 1/3', accepts: ['2/6', '4/12'] }], bank: ['2/4', '3/6', '2/6', '4/12'] },
      { bins: [{ label: '≈ 1/4', accepts: ['2/8', '3/12'] }, { label: '≈ 2/3', accepts: ['4/6', '6/9'] }], bank: ['2/8', '3/12', '4/6', '6/9'] },
      { bins: [{ label: '≈ 1/5', accepts: ['2/10', '3/15'] }, { label: '≈ 3/4', accepts: ['6/8', '9/12'] }], bank: ['2/10', '3/15', '6/8', '9/12'] },
    ],
  },
  {
    id: 'f5', emoji: '✂️', title: 'Simplificar fracciones',
    desc: 'Elegí la fracción irreducible.',
    instruction: 'Elegí la fracción irreducible equivalente a la que se muestra.',
    itemType: 'multipleChoice',
    items: [
      { question: '4/8 simplificada es:', options: ['1/2', '2/4', '1/4', '1/3'], correctIndex: 0 },
      { question: '6/9 simplificada es:', options: ['3/4', '2/3', '1/3', '6/9'], correctIndex: 1 },
      { question: '9/12 simplificada es:', options: ['3/4', '2/3', '9/12', '1/4'], correctIndex: 0 },
    ],
  },
  {
    id: 'f6', emoji: '➕', title: 'Sumar fracciones',
    desc: 'Sumá fracciones con igual denominador.',
    instruction: 'Resolvé la suma y elegí el resultado correcto.',
    itemType: 'multipleChoice',
    items: [
      { question: '1/5 + 2/5 =', options: ['3/5', '3/10', '2/5', '1/5'], correctIndex: 0 },
      { question: '3/8 + 2/8 =', options: ['5/16', '5/8', '1/8', '6/8'], correctIndex: 1 },
      { question: '2/6 + 3/6 =', options: ['5/12', '1/6', '5/6', '6/5'], correctIndex: 2 },
    ],
  },
  {
    id: 'f7', emoji: '➖', title: 'Restar fracciones',
    desc: 'Restá fracciones con igual denominador.',
    instruction: 'Resolvé la resta y elegí el resultado correcto.',
    itemType: 'multipleChoice',
    items: [
      { question: '5/6 − 2/6 =', options: ['3/6', '7/6', '1/6', '4/6'], correctIndex: 0 },
      { question: '7/8 − 3/8 =', options: ['10/8', '4/8', '1/8', '5/8'], correctIndex: 1 },
      { question: '4/5 − 1/5 =', options: ['3/5', '5/5', '1/5', '2/5'], correctIndex: 0 },
    ],
  },
  {
    id: 'f8', emoji: '🔀', title: 'Ordenar fracciones',
    desc: 'Ordená de menor a mayor.',
    instruction: 'Arrastrá las tarjetas (o usá las flechas ▲▼) para ordenarlas de menor a mayor.',
    itemType: 'order',
    items: [
      { values: ['3/4', '1/4', '1/2', '1/8'] },
      { values: ['2/3', '1/3', '1', '1/6'] },
      { values: ['5/6', '1/2', '1/3', '1'] },
    ],
  },
  {
    id: 'f9', emoji: '🧮', title: 'Fracción de un número',
    desc: 'Calculá qué parte de una cantidad representa la fracción.',
    instruction: 'Calculá el resultado y elegí la opción correcta.',
    itemType: 'multipleChoice',
    items: [
      { question: '1/4 de 20 =', options: ['5', '4', '8', '10'], correctIndex: 0 },
      { question: '1/3 de 18 =', options: ['9', '6', '3', '12'], correctIndex: 1 },
      { question: '2/5 de 25 =', options: ['5', '15', '10', '20'], correctIndex: 2 },
    ],
  },
  {
    id: 'f10', emoji: '🔍', title: 'Identificar la fracción',
    desc: 'Observá la imagen y elegí qué fracción representa.',
    instruction: 'Mirá la parte coloreada de la figura y elegí la fracción correcta.',
    itemType: 'identify',
    items: [
      { shape: 'pizza', total: 4, shaded: 3, options: ['3/4', '1/4', '2/4', '4/4'], correctIndex: 0, isDecimal: false },
      { shape: 'rect', total: 5, shaded: 2, options: ['2/5', '3/5', '1/5', '2/3'], correctIndex: 0, isDecimal: false },
      { shape: 'pizza', total: 6, shaded: 4, options: ['4/6', '2/6', '4/8', '6/4'], correctIndex: 0, isDecimal: false },
    ],
  },
];

/* ---------- Datos: 10 actividades de DECIMALES ---------- */

const DECIMAL_ACTIVITIES = [
  {
    id: 'd1', emoji: '🟩', title: 'Representar decimales',
    desc: 'Coloreá la cuadrícula de 100 para representar el decimal.',
    instruction: 'Tocá los cuadraditos necesarios para representar el número decimal indicado (la cuadrícula completa = 1 entero).',
    itemType: 'colorGrid',
    items: [
      { shape: 'grid100', total: 100, target: 34, label: '0,34', isDecimal: true },
      { shape: 'grid100', total: 100, target: 7, label: '0,07', isDecimal: true },
      { shape: 'grid100', total: 100, target: 60, label: '0,6', isDecimal: true },
    ],
  },
  {
    id: 'd2', emoji: '⚖️', title: 'Comparar decimales',
    desc: 'Elegí el signo correcto: <, > o =.',
    instruction: 'Observá los dos números decimales y elegí el símbolo correcto.',
    itemType: 'compare',
    items: [
      { left: '0,5', right: '0,45', answer: '>' },
      { left: '0,3', right: '0,30', answer: '=' },
      { left: '0,08', right: '0,8', answer: '<' },
    ],
  },
  {
    id: 'd3', emoji: '📏', title: 'Ubicar en la recta numérica',
    desc: 'Arrastrá el punto hasta la posición correcta.',
    instruction: 'Arrastrá el marcador sobre la recta hasta ubicar el decimal indicado.',
    itemType: 'numberLine',
    items: [
      { min: 0, max: 1, target: 0.3, label: '0,3', isDecimal: true },
      { min: 0, max: 1, target: 0.75, label: '0,75', isDecimal: true },
      { min: 0, max: 2, target: 1.2, label: '1,2', isDecimal: true },
    ],
  },
  {
    id: 'd4', emoji: '🔄', title: 'Fracción a decimal',
    desc: 'Convertí la fracción en su decimal equivalente.',
    instruction: 'Elegí el decimal equivalente a la fracción.',
    itemType: 'multipleChoice',
    items: [
      { question: '1/2 =', options: ['0,5', '0,2', '0,12', '1,2'], correctIndex: 0 },
      { question: '3/4 =', options: ['0,75', '0,34', '0,43', '7,4'], correctIndex: 0 },
      { question: '1/5 =', options: ['0,2', '0,5', '0,15', '1,5'], correctIndex: 0 },
    ],
  },
  {
    id: 'd5', emoji: '🔄', title: 'Decimal a fracción',
    desc: 'Convertí el decimal en su fracción equivalente.',
    instruction: 'Elegí la fracción equivalente al número decimal.',
    itemType: 'multipleChoice',
    items: [
      { question: '0,25 =', options: ['1/4', '1/5', '2/5', '1/2'], correctIndex: 0 },
      { question: '0,5 =', options: ['1/2', '1/4', '2/3', '1/5'], correctIndex: 0 },
      { question: '0,75 =', options: ['3/4', '3/5', '7/5', '1/4'], correctIndex: 0 },
    ],
  },
  {
    id: 'd6', emoji: '➕', title: 'Sumar decimales',
    desc: 'Sumá los números decimales.',
    instruction: 'Resolvé la suma y escribí el resultado (podés usar coma o punto decimal).',
    itemType: 'numericInput',
    items: [
      { question: '0,3 + 0,45 =', answer: 0.75, tolerance: 0.005 },
      { question: '1,2 + 0,8 =', answer: 2, tolerance: 0.005 },
      { question: '0,09 + 0,4 =', answer: 0.49, tolerance: 0.005 },
    ],
  },
  {
    id: 'd7', emoji: '➖', title: 'Restar decimales',
    desc: 'Restá los números decimales.',
    instruction: 'Resolvé la resta y escribí el resultado (podés usar coma o punto decimal).',
    itemType: 'numericInput',
    items: [
      { question: '0,8 − 0,35 =', answer: 0.45, tolerance: 0.005 },
      { question: '1,5 − 0,6 =', answer: 0.9, tolerance: 0.005 },
      { question: '2 − 0,25 =', answer: 1.75, tolerance: 0.005 },
    ],
  },
  {
    id: 'd8', emoji: '🔀', title: 'Ordenar decimales',
    desc: 'Ordená de menor a mayor.',
    instruction: 'Arrastrá las tarjetas (o usá las flechas ▲▼) para ordenarlas de menor a mayor.',
    itemType: 'order',
    items: [
      { values: ['0,6', '0,16', '0,061', '0,61'] },
      { values: ['1,2', '0,12', '1,02', '2,1'] },
      { values: ['0,3', '0,33', '0,03', '3,3'] },
    ],
  },
  {
    id: 'd9', emoji: '🎯', title: 'Valor posicional',
    desc: 'Identificá el valor posicional de un dígito.',
    instruction: 'Observá el número y elegí el valor posicional correcto del dígito señalado.',
    itemType: 'multipleChoice',
    items: [
      { question: 'En 4,763 ¿qué valor posicional tiene el 7?', options: ['Décimos (0,7)', 'Centésimos (0,07)', 'Unidades', 'Milésimos (0,007)'], correctIndex: 0 },
      { question: 'En 2,549 ¿qué valor posicional tiene el 4?', options: ['Centésimos (0,04)', 'Décimos (0,4)', 'Unidades', 'Milésimos (0,004)'], correctIndex: 0 },
      { question: 'En 8,091 ¿qué valor posicional tiene el 9?', options: ['Centésimos (0,09)', 'Décimos (0,9)', 'Milésimos (0,009)', 'Unidades'], correctIndex: 0 },
    ],
  },
  {
    id: 'd10', emoji: '🎲', title: 'Redondear decimales',
    desc: 'Redondeá al décimo o al entero más cercano.',
    instruction: 'Redondeá el número decimal según se indica y elegí la opción correcta.',
    itemType: 'multipleChoice',
    items: [
      { question: 'Redondeá 3,47 al décimo más cercano', options: ['3,5', '3,4', '3,0', '4,0'], correctIndex: 0 },
      { question: 'Redondeá 5,62 al décimo más cercano', options: ['5,6', '5,7', '6,0', '5,0'], correctIndex: 0 },
      { question: 'Redondeá 0,85 al entero más cercano', options: ['1', '0', '0,9', '0,8'], correctIndex: 0 },
    ],
  },
];

const SECTIONS = {
  fractions: { label: 'Fracciones', activities: FRACTION_ACTIVITIES, accentClass: 'section-fractions' },
  decimals: { label: 'Decimales', activities: DECIMAL_ACTIVITIES, accentClass: 'section-decimals' },
};

/* ---------- Estado global ---------- */

const STORAGE_KEY = 'cuaderno-fd-progreso';
let completed = new Set(loadProgress());
let state = { section: 'fractions', activityId: null, itemIndex: 0 };
let checkAnswer = null; // función asignada por cada renderer de ítem

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); } catch (e) { /* noop */ }
}

/* ---------- Referencias DOM ---------- */

const boardEl = document.getElementById('board');
const panelEl = document.getElementById('activity-panel');
const panelIndexEl = document.getElementById('panel-index');
const panelTitleEl = document.getElementById('panel-title');
const panelInstructionEl = document.getElementById('panel-instruction');
const itemDotsEl = document.getElementById('item-dots');
const itemContainerEl = document.getElementById('item-container');
const feedbackEl = document.getElementById('feedback');
const btnCheck = document.getElementById('btn-check');
const btnRetry = document.getElementById('btn-retry');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');
const tabFractions = document.getElementById('tab-fractions');
const tabDecimals = document.getElementById('tab-decimals');
const progressCountEl = document.getElementById('progress-count');
const ringFillEl = document.getElementById('ring-fill');
const celebrationEl = document.getElementById('celebration');

/* ---------- Progreso / celebración ---------- */

function updateProgressUI() {
  progressCountEl.textContent = completed.size;
  const circumference = 232.5;
  const pct = completed.size / 20;
  ringFillEl.style.strokeDashoffset = String(circumference * (1 - pct));
}

function celebrate() {
  const colors = ['#D6336C', '#0E7C7B', '#F2A93B', '#3AA655'];
  for (let i = 0; i < 28; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = (Math.random() * 0.3) + 's';
    piece.style.animationDuration = (1.2 + Math.random() * 0.8) + 's';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    celebrationEl.appendChild(piece);
    setTimeout(() => piece.remove(), 2400);
  }
}

/* ---------- Tablero de actividades ---------- */

function renderBoard() {
  const section = SECTIONS[state.section];
  boardEl.className = 'board ' + section.accentClass;
  boardEl.innerHTML = '';
  section.activities.forEach((act, i) => {
    const card = document.createElement('button');
    card.className = 'activity-card' + (completed.has(act.id) ? ' completed' : '');
    card.type = 'button';
    card.innerHTML = `
      <span class="card-check">✓</span>
      <span class="card-number">Actividad ${i + 1}</span>
      <span class="card-emoji">${act.emoji}</span>
      <h3 class="card-title">${act.title}</h3>
      <p class="card-desc">${act.desc}</p>
    `;
    card.addEventListener('click', () => openActivity(state.section, act.id));
    boardEl.appendChild(card);
  });
}

function switchSection(section) {
  state.section = section;
  const isFrac = section === 'fractions';
  tabFractions.classList.toggle('is-active', isFrac);
  tabFractions.setAttribute('aria-selected', String(isFrac));
  tabDecimals.classList.toggle('is-active', !isFrac);
  tabDecimals.setAttribute('aria-selected', String(!isFrac));
  panelEl.hidden = true;
  boardEl.hidden = false;
  renderBoard();
}

tabFractions.addEventListener('click', () => switchSection('fractions'));
tabDecimals.addEventListener('click', () => switchSection('decimals'));
btnBack.addEventListener('click', () => {
  panelEl.hidden = true;
  boardEl.hidden = false;
  renderBoard();
});

/* ---------- Panel de actividad ---------- */

function getActivity() {
  return SECTIONS[state.section].activities.find(a => a.id === state.activityId);
}

function openActivity(section, id) {
  state.section = section;
  state.activityId = id;
  state.itemIndex = 0;
  boardEl.hidden = true;
  panelEl.hidden = false;
  const act = getActivity();
  const idx = SECTIONS[section].activities.findIndex(a => a.id === id);
  panelIndexEl.textContent = `Actividad ${idx + 1} de 10 — ${SECTIONS[section].label}`;
  panelTitleEl.textContent = `${act.emoji} ${act.title}`;
  panelInstructionEl.textContent = act.instruction;
  renderDots();
  showItem();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderDots() {
  const act = getActivity();
  itemDotsEl.innerHTML = '';
  act.items.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'item-dot' + (i === state.itemIndex ? ' is-current' : '') + (i < state.itemIndex ? ' is-done' : '');
    itemDotsEl.appendChild(dot);
  });
}

function showItem() {
  const act = getActivity();
  const item = act.items[state.itemIndex];
  itemContainerEl.innerHTML = '';
  feedbackEl.textContent = '';
  feedbackEl.className = 'feedback';
  btnCheck.hidden = false;
  btnCheck.disabled = false;
  btnRetry.hidden = true;
  btnNext.hidden = true;
  btnNext.textContent = 'Siguiente →';
  checkAnswer = null;
  renderDots();

  RENDERERS[act.itemType](item, itemContainerEl);
}

btnCheck.addEventListener('click', () => {
  if (!checkAnswer) return;
  const result = checkAnswer();
  if (result === true) {
    feedbackEl.textContent = '¡Muy bien! Respuesta correcta 🎉';
    feedbackEl.className = 'feedback ok';
    btnCheck.hidden = true;
    btnRetry.hidden = true;
    const act = getActivity();
    if (state.itemIndex < act.items.length - 1) {
      btnNext.hidden = false;
      btnNext.textContent = 'Siguiente →';
      btnNext.onclick = () => {
        state.itemIndex++;
        showItem();
      };
    } else {
      completed.add(act.id);
      saveProgress();
      updateProgressUI();
      celebrate();
      feedbackEl.textContent = '¡Actividad completa! Sumaste una estrella ⭐';
      btnNext.hidden = false;
      btnNext.textContent = 'Volver al cuaderno';
      btnNext.onclick = () => {
        panelEl.hidden = true;
        boardEl.hidden = false;
        renderBoard();
      };
    }
  } else {
    feedbackEl.textContent = 'No es correcto todavía. ¡Probá de nuevo!';
    feedbackEl.className = 'feedback bad';
    btnCheck.hidden = true;
    btnRetry.hidden = false;
  }
});

btnRetry.addEventListener('click', () => { showItem(); });

/* =========================================================
   RENDERERS por tipo de actividad
   ========================================================= */

const RENDERERS = {
  multipleChoice: renderMultipleChoice,
  compare: renderCompare,
  numberLine: renderNumberLine,
  colorGrid: renderColorGrid,
  identify: renderIdentify,
  dragMatch: renderDragMatch,
  order: renderOrder,
  numericInput: renderNumericInput,
};

/* ---- Opción múltiple ---- */
function renderMultipleChoice(item, container) {
  const body = el('div', 'item-body');
  body.appendChild(el('div', 'item-prompt mono-value', item.question));
  const optionsWrap = el('div', 'mc-options');
  let selected = null;
  const buttons = item.options.map((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mc-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selected = i;
    });
    optionsWrap.appendChild(btn);
    return btn;
  });
  body.appendChild(optionsWrap);
  container.appendChild(body);

  checkAnswer = () => {
    if (selected === null) return false;
    buttons.forEach((b, i) => {
      if (i === item.correctIndex) b.classList.add('correct');
      else if (i === selected) b.classList.add('incorrect');
    });
    return selected === item.correctIndex;
  };
}

/* ---- Comparar (<, >, =) ---- */
function renderCompare(item, container) {
  const body = el('div', 'item-body');
  const row = el('div', 'compare-row');

  function valueHTML(v) {
    if (v && typeof v === 'object' && 'n' in v) return fracHTML(v.n, v.d);
    return `<span class="mono-value">${v}</span>`;
  }

  const leftBox = el('span', 'compare-value', valueHTML(item.left));
  const rightBox = el('span', 'compare-value', valueHTML(item.right));
  const symbolsWrap = el('div', 'compare-symbols');

  let selected = null;
  const buttons = ['<', '=', '>'].map(sym => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'symbol-btn';
    btn.textContent = sym;
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selected = sym;
    });
    symbolsWrap.appendChild(btn);
    return btn;
  });

  row.appendChild(leftBox);
  row.appendChild(symbolsWrap);
  row.appendChild(rightBox);
  body.appendChild(row);
  container.appendChild(body);

  checkAnswer = () => {
    if (selected === null) return false;
    buttons.forEach(b => {
      if (b.textContent === item.answer) b.classList.add('correct');
      else if (b.textContent === selected) b.classList.add('incorrect');
    });
    return selected === item.answer;
  };
}

/* ---- Recta numérica ---- */
function renderNumberLine(item, container) {
  const wrap = el('div', 'numberline-wrap');
  const labelHTML = item.isDecimal ? `<span class="mono-value">${item.label}</span>` : fracHTML(...item.label.split('/'));
  wrap.appendChild(el('div', 'numberline-target-label', `Ubicá: ${labelHTML}`));

  const line = el('div', 'numberline');
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = item.min + (i / steps) * (item.max - item.min);
    const tick = el('div', 'numberline-tick');
    tick.style.left = (i / steps) * 100 + '%';
    tick.innerHTML = `<span>${fmt(Math.round(v * 100) / 100)}</span>`;
    line.appendChild(tick);
  }

  const token = el('div', 'numberline-token' + (item.isDecimal ? ' token-decimal' : ''), '<span>●</span>');
  token.style.left = '0%';
  token.setAttribute('tabindex', '0');
  token.setAttribute('role', 'slider');
  token.setAttribute('aria-label', 'Marcador de posición');
  line.appendChild(token);
  wrap.appendChild(line);
  container.appendChild(wrap);

  let currentValue = item.min;

  function setFromClientX(clientX) {
    const rect = line.getBoundingClientRect();
    let ratio = (clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    currentValue = item.min + ratio * (item.max - item.min);
    token.style.left = (ratio * 100) + '%';
  }

  let dragging = false;
  token.addEventListener('pointerdown', (e) => {
    dragging = true;
    token.setPointerCapture(e.pointerId);
  });
  token.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    setFromClientX(e.clientX);
  });
  token.addEventListener('pointerup', () => { dragging = false; });
  token.addEventListener('pointercancel', () => { dragging = false; });
  // Teclado: flechas izquierda/derecha
  token.addEventListener('keydown', (e) => {
    const step = (item.max - item.min) / 20;
    if (e.key === 'ArrowLeft') { currentValue = Math.max(item.min, currentValue - step); }
    else if (e.key === 'ArrowRight') { currentValue = Math.min(item.max, currentValue + step); }
    else return;
    const ratio = (currentValue - item.min) / (item.max - item.min);
    token.style.left = (ratio * 100) + '%';
  });

  checkAnswer = () => {
    const tolerance = (item.max - item.min) * 0.035;
    const ok = Math.abs(currentValue - item.target) <= tolerance;
    token.classList.add(ok ? 'correct' : 'incorrect');
    return ok;
  };
}

/* ---- Colorear cuadrícula / pizza ---- */
function buildPizza(total, isDecimal, interactive, initialFilledCount, onChange) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.classList.add('pizza-svg');
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.setAttribute('width', '180');
  svg.setAttribute('height', '180');
  const cx = 100, cy = 100, r = 90;
  const filled = new Set();
  for (let i = 0; i < (initialFilledCount || 0); i++) filled.add(i);

  function polar(angleDeg) {
    const a = (angleDeg - 90) * Math.PI / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }
  function sliceD(startA, endA) {
    const start = polar(endA), end = polar(startA);
    const largeArc = endA - startA <= 180 ? '0' : '1';
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
  }

  for (let i = 0; i < total; i++) {
    const startA = i * (360 / total);
    const endA = (i + 1) * (360 / total);
    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', sliceD(startA, endA));
    path.classList.add('pizza-slice');
    if (isDecimal) path.classList.add('is-decimal');
    if (filled.has(i)) path.classList.add('filled');
    if (interactive) {
      path.style.cursor = 'pointer';
      path.addEventListener('click', () => {
        path.classList.toggle('filled');
        if (path.classList.contains('filled')) filled.add(i); else filled.delete(i);
        onChange && onChange(filled.size);
      });
    }
    svg.appendChild(path);
  }
  return { node: svg, filled };
}

function buildRectGrid(total, isDecimal, interactive, initialFilledCount, onChange) {
  const wrap = document.createElement('div');
  wrap.classList.add(total === 100 ? 'grid100' : 'rect-grid');
  if (total !== 100) wrap.style.gridTemplateColumns = `repeat(${Math.min(total, 6)}, 34px)`;
  const filled = new Set();
  for (let i = 0; i < (initialFilledCount || 0); i++) filled.add(i);
  for (let i = 0; i < total; i++) {
    const cell = document.createElement('div');
    cell.classList.add('rect-cell');
    if (isDecimal) cell.classList.add('is-decimal');
    if (filled.has(i)) cell.classList.add('filled');
    if (interactive) {
      cell.addEventListener('click', () => {
        cell.classList.toggle('filled');
        if (cell.classList.contains('filled')) filled.add(i); else filled.delete(i);
        onChange && onChange(filled.size);
      });
    }
    wrap.appendChild(cell);
  }
  return { node: wrap, filled };
}

function renderColorGrid(item, container) {
  const wrap = el('div', 'gridviz-wrap');
  const labelHTML = item.isDecimal ? `<span class="mono-value">${item.label}</span>` : fracHTML(...item.label.split('/'));
  wrap.appendChild(el('div', 'item-prompt', `Representá: ${labelHTML}`));

  const counter = el('div', 'gridviz-counter', '');
  function updateCounter(n) {
    counter.textContent = `${n} / ${item.target} coloreado(s)`;
  }

  let built;
  if (item.shape === 'pizza') built = buildPizza(item.total, item.isDecimal, true, 0, updateCounter);
  else built = buildRectGrid(item.total, item.isDecimal, true, 0, updateCounter);

  updateCounter(0);
  wrap.appendChild(built.node);
  wrap.appendChild(counter);
  container.appendChild(wrap);

  checkAnswer = () => {
    const ok = built.filled.size === item.target;
    wrap.style.outline = ok ? '3px solid var(--success)' : '3px solid var(--error)';
    wrap.style.borderRadius = '14px';
    return ok;
  };
}

/* ---- Identificar (visual fija + opción múltiple) ---- */
function renderIdentify(item, container) {
  const wrap = el('div', 'identify-wrap');
  let built;
  if (item.shape === 'pizza') built = buildPizza(item.total, item.isDecimal, false, item.shaded);
  else built = buildRectGrid(item.total, item.isDecimal, false, item.shaded);
  wrap.appendChild(built.node);

  const optionsWrap = el('div', 'mc-options');
  let selected = null;
  const buttons = item.options.map((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mc-option';
    btn.textContent = opt;
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selected = i;
    });
    optionsWrap.appendChild(btn);
    return btn;
  });
  wrap.appendChild(optionsWrap);
  container.appendChild(wrap);

  checkAnswer = () => {
    if (selected === null) return false;
    buttons.forEach((b, i) => {
      if (i === item.correctIndex) b.classList.add('correct');
      else if (i === selected) b.classList.add('incorrect');
    });
    return selected === item.correctIndex;
  };
}

/* ---- Arrastrar y emparejar (fracciones equivalentes) ---- */
function renderDragMatch(item, container) {
  const wrap = el('div', 'dragmatch-wrap');
  wrap.appendChild(el('div', 'order-hint', 'Arrastrá cada tarjeta (o tocala y después tocá el grupo correcto).'));

  const bank = el('div', 'drag-bank');
  const binsWrap = el('div', 'drop-bins');

  let selectedChip = null;
  let draggedChip = null;

  function makeChip(value) {
    const chip = el('div', 'drag-chip', value);
    chip.dataset.value = value;
    chip.draggable = true;
    chip.addEventListener('dragstart', () => { draggedChip = chip; setTimeout(() => chip.classList.add('dragging'), 0); });
    chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
    chip.addEventListener('click', () => {
      if (selectedChip === chip) { chip.classList.remove('selected'); selectedChip = null; return; }
      if (selectedChip) selectedChip.classList.remove('selected');
      selectedChip = chip;
      chip.classList.add('selected');
    });
    return chip;
  }

  shuffle(item.bank).forEach(v => bank.appendChild(makeChip(v)));

  bank.addEventListener('dragover', (e) => e.preventDefault());
  bank.addEventListener('drop', (e) => {
    e.preventDefault();
    if (draggedChip) { bank.appendChild(draggedChip); draggedChip = null; }
  });
  bank.addEventListener('click', (e) => {
    if (e.target === bank && selectedChip) {
      bank.appendChild(selectedChip);
      selectedChip.classList.remove('selected');
      selectedChip = null;
    }
  });

  item.bins.forEach((bin, i) => {
    const binEl = el('div', 'drop-bin');
    binEl.dataset.binIndex = String(i);
    binEl.appendChild(el('div', 'drop-bin-label', bin.label));
    const chipsHolder = el('div', 'bin-chips');
    chipsHolder.style.display = 'flex';
    chipsHolder.style.flexWrap = 'wrap';
    chipsHolder.style.gap = '8px';
    chipsHolder.style.justifyContent = 'center';
    binEl.appendChild(chipsHolder);

    binEl.addEventListener('dragover', (e) => { e.preventDefault(); binEl.classList.add('drag-over'); });
    binEl.addEventListener('dragleave', () => binEl.classList.remove('drag-over'));
    binEl.addEventListener('drop', (e) => {
      e.preventDefault();
      binEl.classList.remove('drag-over');
      if (draggedChip) { chipsHolder.appendChild(draggedChip); draggedChip = null; }
    });
    binEl.addEventListener('click', () => {
      if (selectedChip) {
        chipsHolder.appendChild(selectedChip);
        selectedChip.classList.remove('selected');
        selectedChip = null;
      }
    });
    binsWrap.appendChild(binEl);
  });

  wrap.appendChild(bank);
  wrap.appendChild(binsWrap);
  container.appendChild(wrap);

  checkAnswer = () => {
    if (bank.children.length > 0) return false;
    let allOk = true;
    item.bins.forEach((bin, i) => {
      const binEl = binsWrap.querySelector(`.drop-bin[data-bin-index="${i}"]`);
      const got = Array.from(binEl.querySelectorAll('.drag-chip')).map(c => c.dataset.value).sort();
      const expected = [...bin.accepts].sort();
      const ok = JSON.stringify(got) === JSON.stringify(expected);
      binEl.style.borderColor = ok ? 'var(--success)' : 'var(--error)';
      if (!ok) allOk = false;
    });
    return allOk;
  };
}

/* ---- Ordenar (arrastrar / flechas) ---- */
function renderOrder(item, container) {
  const wrap = el('div', 'order-wrap');
  const list = el('div', '');
  list.style.display = 'flex';
  list.style.flexDirection = 'column';
  list.style.gap = '10px';

  const display = shuffle(item.values);
  let draggedEl = null;

  function makeRow(value) {
    const row = el('div', 'order-item');
    row.draggable = true;
    row.dataset.value = value;
    row.innerHTML = `<span class="drag-handle">⋮⋮</span><span class="mono-value">${value}</span>`;
    const btnUp = document.createElement('button');
    btnUp.type = 'button'; btnUp.textContent = '▲'; btnUp.className = 'btn-ghost';
    btnUp.style.marginLeft = 'auto'; btnUp.style.padding = '4px 8px'; btnUp.style.fontSize = '0.75rem';
    const btnDown = document.createElement('button');
    btnDown.type = 'button'; btnDown.textContent = '▼'; btnDown.className = 'btn-ghost';
    btnDown.style.padding = '4px 8px'; btnDown.style.fontSize = '0.75rem';

    btnUp.addEventListener('click', () => {
      const prev = row.previousElementSibling;
      if (prev) list.insertBefore(row, prev);
    });
    btnDown.addEventListener('click', () => {
      const next = row.nextElementSibling;
      if (next) list.insertBefore(next, row);
    });

    row.addEventListener('dragstart', () => { draggedEl = row; setTimeout(() => row.classList.add('dragging'), 0); });
    row.addEventListener('dragend', () => row.classList.remove('dragging'));

    row.appendChild(btnUp);
    row.appendChild(btnDown);
    return row;
  }

  display.forEach(v => list.appendChild(makeRow(v)));

  list.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterEl = getDragAfterElement(list, e.clientY);
    if (!draggedEl) return;
    if (afterEl == null) list.appendChild(draggedEl);
    else list.insertBefore(draggedEl, afterEl);
  });

  function getDragAfterElement(container, y) {
    const items = [...container.querySelectorAll('.order-item:not(.dragging)')];
    return items.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) return { offset, element: child };
      return closest;
    }, { offset: -Infinity, element: null }).element;
  }

  wrap.appendChild(el('div', 'order-hint', 'De menor (arriba) a mayor (abajo).'));
  wrap.appendChild(list);
  container.appendChild(wrap);

  checkAnswer = () => {
    const current = Array.from(list.querySelectorAll('.order-item')).map(r => r.dataset.value);
    const sorted = [...item.values].sort((a, b) => parseValue(a) - parseValue(b));
    const ok = JSON.stringify(current) === JSON.stringify(sorted);
    list.querySelectorAll('.order-item').forEach(r => {
      r.style.borderColor = ok ? 'var(--success)' : 'var(--error)';
    });
    return ok;
  };
}

/* ---- Entrada numérica ---- */
function renderNumericInput(item, container) {
  const body = el('div', 'item-body');
  body.appendChild(el('div', 'item-prompt mono-value', item.question));
  const row = el('div', 'numeric-input-row');
  const input = document.createElement('input');
  input.type = 'text';
  input.inputMode = 'decimal';
  input.className = 'numeric-input';
  input.placeholder = '0,00';
  row.appendChild(input);
  body.appendChild(row);
  container.appendChild(body);

  input.focus();

  checkAnswer = () => {
    const val = parseFloat(input.value.replace(',', '.'));
    if (Number.isNaN(val)) { input.classList.add('incorrect'); return false; }
    const ok = Math.abs(val - item.answer) <= (item.tolerance || 0.01);
    input.classList.add(ok ? 'correct' : 'incorrect');
    return ok;
  };
}

/* ---------- Inicialización ---------- */

updateProgressUI();
switchSection('fractions');
