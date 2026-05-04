/* ════════════════════════════════════════════════════════════
   IPC VISUALIZER — script.js
   Handles: tabs, simulations, API fetch, terminal output,
            animations, navbar, particles, clock
   ════════════════════════════════════════════════════════════ */

'use strict';

// ── DOM refs ──────────────────────────────────────────────────
const navbar      = document.getElementById('navbar');
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const termBody    = document.getElementById('termBody');
const termTime    = document.getElementById('termTime');
const simTabs     = document.querySelectorAll('.sim-tab');
const tabContents = document.querySelectorAll('.tab-content');
const procA       = document.getElementById('procA');
const procB       = document.getElementById('procB');
const procAState  = document.getElementById('procAState');
const procBState  = document.getElementById('procBState');
const memFillA    = document.getElementById('memFillA');
const memFillB    = document.getElementById('memFillB');
const channelVis  = document.getElementById('channelVis');
const channelLabel= document.getElementById('channelLabel');
const channelPkt  = document.getElementById('channelPacket');

// ── Clock ──────────────────────────────────────────────────────
function updateClock() {
  if (termTime) {
    termTime.textContent = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
}
setInterval(updateClock, 1000);
updateClock();

// ── Navbar scroll effect ───────────────────────────────────────
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }

  const sections = document.querySelectorAll('section[id]');
  let current = '';

  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// ── Mobile hamburger ───────────────────────────────────────────
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.addEventListener('click', e => {
    if (e.target.classList.contains('nav-link')) navLinks.classList.remove('open');
  });
}

// ── Smooth close on outside click ─────────────────────────────
document.addEventListener('click', e => {
  if (navbar && navLinks && !navbar.contains(e.target)) {
    navLinks.classList.remove('open');
  }
});

// ── Particle field ─────────────────────────────────────────────
(function initParticles() {
  const field = document.getElementById('particleField');
  if (!field) return;

  const count = window.innerWidth < 600 ? 20 : 45;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 3 + 1;

    Object.assign(p.style, {
      position: 'absolute',
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
      background: Math.random() > 0.5 ? 'rgba(0,245,196,0.5)' : 'rgba(123,97,255,0.4)',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      boxShadow: '0 0 6px currentColor',
      animation: `particleDrift ${8 + Math.random() * 12}s ease-in-out ${Math.random() * 8}s infinite alternate`
    });

    field.appendChild(p);
  }

  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleDrift {
      from { transform: translate(0, 0) scale(1); opacity: 0.3; }
      to   { transform: translate(${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 30}px, ${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 40}px) scale(${0.5 + Math.random()}); opacity: 0.8; }
    }
  `;
  document.head.appendChild(style);
})();

// ── Simulation Tab switching ────────────────────────────────────
const channelLabels = {
  pipe: 'PIPE CHANNEL',
  shm:  'SHARED MEM SEGMENT',
  mq:   'MESSAGE QUEUE',
  sem:  'SEMAPHORE STATE',
};

simTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    simTabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    const activeTab = document.getElementById('tab-' + target);
    if (activeTab) activeTab.classList.add('active');

    if (channelLabel) {
      channelLabel.textContent = channelLabels[target] || 'IPC CHANNEL';
    }

    resetProcessBoxes();
    termLog('info', `[TAB] Switched to: ${tab.textContent.trim().toUpperCase()} simulation`);
  });
});

// ── Terminal helper ─────────────────────────────────────────────
function termLog(type, text, delay = 0) {
  if (!termBody) return;

  setTimeout(() => {
    const cursorLine = termBody.querySelector('.term-cursor-line');
    const div = document.createElement('div');
    div.className = 'term-line term-' + type;

    if (type === 'prompt') {
      div.innerHTML = `<span class="term-prompt">root@ipc-sim:~$</span><span class="term-cmd"> ${text}</span>`;
    } else {
      div.textContent = text;
    }

    if (cursorLine) {
      termBody.insertBefore(div, cursorLine);
    } else {
      termBody.appendChild(div);
    }

    termBody.scrollTop = termBody.scrollHeight;
  }, delay);
}

function clearOutput() {
  if (!termBody) return;
  const lines = termBody.querySelectorAll('.term-line:not(.term-cursor-line)');
  lines.forEach(l => l.remove());
  termLog('info', 'Terminal cleared.');
  termLog('dim', '─'.repeat(48));
}

// ── Process box state helpers ───────────────────────────────────
function setProcessState(proc, state, label) {
  const el = proc === 'A' ? procA : procB;
  const stateEl = proc === 'A' ? procAState : procBState;
  const memEl = proc === 'A' ? memFillA : memFillB;

  if (!el || !stateEl || !memEl) return;

  el.classList.remove('active-proc', 'receiving-proc');
  if (state === 'active') el.classList.add('active-proc');
  if (state === 'receiving') el.classList.add('receiving-proc');

  stateEl.textContent = label;
  memEl.style.width = (20 + Math.random() * 65).toFixed(0) + '%';
}

function resetProcessBoxes() {
  if (procA) procA.classList.remove('active-proc', 'receiving-proc');
  if (procB) procB.classList.remove('active-proc', 'receiving-proc');
  if (procAState) procAState.textContent = 'IDLE';
  if (procBState) procBState.textContent = 'WAITING';
  if (memFillA) memFillA.style.width = '30%';
  if (memFillB) memFillB.style.width = '15%';
  if (channelPkt) channelPkt.classList.remove('animate');
}

function animatePacket() {
  if (!channelPkt) return;
  channelPkt.classList.remove('animate');
  void channelPkt.offsetWidth;
  channelPkt.classList.add('animate');
}

// ── Spinner helpers ─────────────────────────────────────────────
function showSpinner(id) {
  const s = document.getElementById('spin-' + id);
  if (s) s.classList.add('active');
}

function hideSpinner(id) {
  const s = document.getElementById('spin-' + id);
  if (s) s.classList.remove('active');
}

// ── API endpoint map ────────────────────────────────────────────
const BASE_URL = 'http://127.0.0.1:5000';

const endpoints = {
  pipe: BASE_URL + '/api/pipe',
  shm:  BASE_URL + '/api/shared-memory',
  mq:   BASE_URL + '/api/message-queue',
  sem:  BASE_URL + '/api/semaphore',
};

// ── Payload builders per simulation type ───────────────────────
function buildPayload(type) {
  switch (type) {
    case 'pipe':
      return {
        message: document.getElementById('pipeMsg')?.value.trim() || 'Hello from Process A'
      };

    case 'shm':
      return {
        data: document.getElementById('shmMsg')?.value.trim() || 'Shared payload data'
      };

    case 'mq':
      return {
        message: document.getElementById('mqMsg')?.value.trim() || 'Queue message'
      };

    case 'sem':
      return {
        process_name: document.getElementById('semOp')?.value || 'Process A'
      };

    default:
      return {};
  }
}

// ── Mock local response (fallback when API is unavailable) ──────
function mockResponse(type, payload) {
  const ts = new Date().toISOString();
  const rnd = () => Math.floor(Math.random() * 9000 + 1000);

  const responses = {
    pipe: {
      status: 'success',
      mechanism: 'Pipe',
      sender: 'Process A',
      receiver: 'Process B',
      message: payload.message,
      timestamp: ts,
    },
    shm: {
      status: 'success',
      mechanism: 'Shared Memory',
      memory_before: null,
      memory_after: payload.data,
      read_value: payload.data,
      timestamp: ts,
    },
    mq: {
      status: 'success',
      mechanism: 'Message Queue',
      queue_before: [],
      processed_message: payload.message,
      queue_after: [],
      timestamp: ts,
    },
    sem: {
      status: 'success',
      mechanism: 'Semaphore',
      process_name: payload.process_name,
      semaphore_value_before: 1,
      semaphore_value_after: 1,
      action: `${payload.process_name} entered critical section (wait) and exited critical section (signal)`,
      timestamp: ts,
    },
  };

  return responses[type];
}

// ── Render terminal output from JSON ───────────────────────────
function renderResult(type, data, isMock) {
  const sep = '─'.repeat(50);
  termLog('dim', sep);

  if (isMock) termLog('warn', '⚠ API offline — showing simulated response');

  termLog('success', `✓ [${data.ipc_type || data.mechanism || type.toUpperCase()}] Response received`);
  termLog('dim', '');

  Object.entries(data).forEach(([key, val]) => {
    if (key === 'status') return;
    const display = typeof val === 'object' ? JSON.stringify(val) : String(val);
    termLog('data', `  ${key.padEnd(22)} : ${display}`);
  });

  termLog('dim', sep);
  termLog('success', `  STATUS: ${data.status?.toUpperCase() || 'OK'}`);
}

// ── Animation sequence during simulation ───────────────────────
function playAnimation(type) {
  resetProcessBoxes();

  setProcessState('A', 'active', 'SENDING');
  setProcessState('B', 'idle', 'WAITING');

  setTimeout(() => {
    animatePacket();
  }, 400);

  setTimeout(() => {
    setProcessState('A', 'idle', 'SENT ✓');
    setProcessState('B', 'receiving', 'RECEIVED');
  }, 1500);

  setTimeout(() => {
    setProcessState('A', 'idle', 'IDLE');
    setProcessState('B', 'idle', 'IDLE');
  }, 3500);
}

// ── Main simulation runner (called from HTML buttons) ───────────
window.runSimulation = async function(type) {
  const payload = buildPayload(type);
  const endpoint = endpoints[type];

  showSpinner(type);
  termLog('prompt', `fetch('${endpoint}', { method: 'POST', body: JSON.stringify({...}) })`);
  termLog('info', `[SEND] Initiating ${type.toUpperCase()} communication...`);
  termLog('dim', `       Payload size: ${JSON.stringify(payload).length} bytes`);

  playAnimation(type);

  let data, isMock = false;

  try {
    const resp = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    data = await resp.json();
  } catch (err) {
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    data = mockResponse(type, payload);
    isMock = true;
  }

  hideSpinner(type);
  renderResult(type, data, isMock);
};

// ── Intersection Observer for entrance animations ───────────────
(function initScrollReveal() {
  const targets = document.querySelectorAll('.concept-card, .feat-card, .wf-step, .team-card');
  if (!('IntersectionObserver' in window)) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'fadeSlideUp 0.7s ease both';
        entry.target.style.opacity = '1';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.animationDelay = (i * 0.07) + 's';
    obs.observe(el);
  });
})();

// ── Hero concept card stagger on load ──────────────────────────
window.addEventListener('load', () => {
  document.querySelectorAll('.concept-card').forEach((card, i) => {
    card.style.animationDelay = (i * 0.08 + 0.2) + 's';
  });
});

// ── Smooth active tab indicator on click ───────────────────────
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});