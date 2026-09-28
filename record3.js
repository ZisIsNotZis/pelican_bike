// Deterministic renderer v2: we own the clock.
// - requestAnimationFrame is stubbed before page load; each frame is driven by window.__step(dt).
// - CSS animations/transitions are seeked via Web Animations API (document.getAnimations()).
// - SMIL (butterflies) is seeked via svg.setCurrentTime() after pauseAnimations().
// Usage: node record3.js [frames=720] [outdir=frames3] [fps=30]
'use strict';
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const HS = process.env.HOME + '/.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell';
const PORT = 9226;
const PAGE_URL = 'file://' + path.resolve(__dirname, 'pelican_bike.html');
const N = +(process.argv[2] || 720);
const OUT = path.join(__dirname, process.argv[3] || 'frames3');
const FPS = +(process.argv[4] || 30);

const sleep = ms => new Promise(r => setTimeout(r, ms));

const INJECT = `
window.__pending = [];
window.__simNow = 0;
window.requestAnimationFrame = cb => { window.__pending.push(cb); return 0; };
window.__step = dtMs => {
  window.__simNow += dtMs;
  const cbs = window.__pending.splice(0);
  cbs.forEach(cb => cb(window.__simNow));
  document.getAnimations().forEach(a => { try { a.pause(); a.currentTime += dtMs; } catch (e) {} });
  try { document.getElementById('scene').setCurrentTime(window.__simNow / 1000); } catch (e) {}
};
`;

function getJson(p) {
  return new Promise((res, rej) => {
    http.get({ host: '127.0.0.1', port: PORT, path: p }, resp => {
      let d = ''; resp.on('data', c => d += c); resp.on('end', () => res(JSON.parse(d)));
    }).on('error', rej);
  });
}

async function main() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const browser = spawn(HS, [
    '--headless', '--disable-gpu', '--no-sandbox', '--hide-scrollbars',
    '--autoplay-policy=no-user-gesture-required',
    `--remote-debugging-port=${PORT}`, '--window-size=1280,700', 'about:blank',
  ], { stdio: 'ignore' });

  let targets = null;
  for (let i = 0; i < 50; i++) {
    try { targets = await getJson('/json/list'); if (targets.length) break; } catch {}
    await sleep(100);
  }
  if (!targets) throw new Error('devtools endpoint never came up');
  const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let msgId = 0;
  const pending = new Map();
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  };
  const cmd = (method, params = {}) => new Promise((res, rej) => {
    const id = ++msgId;
    pending.set(id, m => m.error ? rej(new Error(m.error.message)) : res(m.result));
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evalJs = async expression => {
    const r = await cmd('Runtime.evaluate', { expression });
    if (r.exceptionDetails) throw new Error('page eval: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r.result.value;
  };

  await cmd('Page.enable');
  await cmd('Page.addScriptToEvaluateOnNewDocument', { source: INJECT });
  await cmd('Page.navigate', { url: PAGE_URL + '?speed=10' });
  await sleep(2000);

  // freeze SMIL so setCurrentTime owns it
  await evalJs(`document.getElementById('scene').pauseAnimations(); window.__step(0);`);

  // choreography (virtual seconds)
  const valueAt = t => {
    if (t < 4) return 10;
    if (t < 8) return 10 + (t - 4) * 25 / 4;
    if (t < 12) return 35 + (t - 8) * 25 / 4;
    if (t < 16) return 60 + (t - 12) * 20 / 4;
    if (t < 22) return 80 + (t - 16) * 20 / 6;
    return 100;
  };
  const events = [
    [1.333, "document.getElementById('bellG').dispatchEvent(new MouseEvent('click', {bubbles: true}))"],
    [6, "document.getElementById('pelican').dispatchEvent(new MouseEvent('click', {bubbles: true}))"],
    [17, "document.getElementById('dayNight').click()"],
  ];
  let evIdx = 0;

  const dt = 1000 / FPS;
  const t0 = Date.now();
  for (let i = 0; i < N; i++) {
    const t = (i * dt) / 1000;
    const exprs = [`(() => { const s = document.getElementById('speed'); s.value = ${valueAt(t).toFixed(2)}; s.dispatchEvent(new Event('input')); })()`];
    while (evIdx < events.length && t >= events[evIdx][0]) exprs.push(events[evIdx][1]), evIdx++;
    exprs.push(`window.__step(${dt})`);
    await evalJs(exprs.join(';'));
    const shot = await cmd('Page.captureScreenshot', { format: 'jpeg', quality: 90 });
    fs.writeFileSync(path.join(OUT, `f${String(i).padStart(4, '0')}.jpg`), Buffer.from(shot.data, 'base64'));
    if (i % 90 === 0) console.log(`frame ${i}/${N}  (${((Date.now() - t0) / 1000).toFixed(0)}s wall)`);
  }
  console.log(`done: ${N} frames in ${((Date.now() - t0) / 1000).toFixed(0)}s wall`);
  ws.close(); browser.kill();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
