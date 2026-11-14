// Grava uma sequência de tomadas com Playwright e exporta WebM, MP4 e pôster com ffmpeg.
// Toda requisição que não for local (ou explicitamente simulada) é bloqueada.
const { chromium } = require('playwright');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PERMITIDOS = [/^http:\/\/localhost/, /^http:\/\/127\.0\.0\.1/, /^data:/, /^blob:/, /cdn\.tailwindcss\.com/, /fonts\.googleapis\.com/, /fonts\.gstatic\.com/];

const CURSOR = `
(() => {
  if (window.__cursor) return; window.__cursor = true;
  const c = document.createElement('div');
  c.style.cssText = 'position:fixed;left:0;top:0;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:rgba(15,23,42,.18);border:2px solid rgba(15,23,42,.75);box-shadow:0 2px 8px rgba(0,0,0,.25);pointer-events:none;z-index:2147483647;transition:transform .12s ease;transform:translate(-100px,-100px)';
  const pos = { x: -100, y: -100 };
  addEventListener('mousemove', (e) => { pos.x = e.clientX; pos.y = e.clientY; c.style.transform = 'translate(' + pos.x + 'px,' + pos.y + 'px)'; }, true);
  addEventListener('mousedown', () => { c.style.transform = 'translate(' + pos.x + 'px,' + pos.y + 'px) scale(.7)'; }, true);
  addEventListener('mouseup', () => { c.style.transform = 'translate(' + pos.x + 'px,' + pos.y + 'px)'; }, true);
  const por = () => document.body ? document.body.appendChild(c) : requestAnimationFrame(por); por();
})();`;

/**
 * @param {object} o
 * @param {string} o.nome           nome base dos arquivos de saída
 * @param {string} o.url            URL inicial
 * @param {string} o.saida          pasta de saída
 * @param {(ctx: import('playwright').BrowserContext) => Promise<void>} [o.preparar]  rotas simuladas, sessão etc.
 * @param {(p: import('playwright').Page, h: object) => Promise<void>} o.tomadas
 * @param {RegExp[]} [o.permitir]   padrões extras liberados (ex.: backend simulado tratado em preparar)
 * @param {number} [o.largura] @param {number} [o.altura]
 */
async function gravar(o) {
  const W = o.largura ?? 1280, H = o.altura ?? 800;
  const bruto = path.join(o.saida, '_bruto', o.nome);
  fs.rmSync(bruto, { recursive: true, force: true });
  fs.mkdirSync(bruto, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: W, height: H }, recordVideo: { dir: bruto, size: { width: W, height: H } } });
  const t0 = Date.now();
  const bloqueados = [];
  const permitidos = [...PERMITIDOS, ...(o.permitir ?? [])];
  await ctx.route('**/*', (route) => {
    const u = route.request().url();
    if (permitidos.some((r) => r.test(u))) return route.fallback();
    bloqueados.push(u);
    return route.abort();
  });
  if (o.preparar) await o.preparar(ctx);
  await ctx.addInitScript(CURSOR);
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  await p.goto(o.url, { waitUntil: 'networkidle' });
  const [ix, iy] = o.mouseInicial ?? [W * 0.62, H * 0.55];
  await p.mouse.move(ix, iy);
  if (o.antesDeGravar) await o.antesDeGravar(p);
  await p.waitForTimeout(700);
  const inicio = (Date.now() - t0) / 1000;

  // Ajudantes: movimento suave do cursor e clique com pausa.
  let mx = ix, my = iy;
  const mover = async (x, y, ms = 600) => {
    const passos = Math.max(6, Math.round(ms / 40));
    const x0 = mx, y0 = my;
    for (let i = 1; i <= passos; i++) {
      const t = i / passos, e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      await p.mouse.move(x0 + (x - x0) * e, y0 + (y - y0) * e);
      await p.waitForTimeout(ms / passos);
    }
    mx = x; my = y;
  };
  const clicar = async (alvo, { ms = 600, pausa = 250 } = {}) => {
    const loc = typeof alvo === 'string' ? p.locator(alvo).first() : alvo;
    const box = await loc.boundingBox();
    if (!box) throw new Error('alvo sem caixa: ' + alvo);
    await mover(box.x + box.width / 2, box.y + box.height / 2, ms);
    await p.waitForTimeout(pausa);
    await p.mouse.down(); await p.waitForTimeout(90); await p.mouse.up();
  };
  const esperar = (ms) => p.waitForTimeout(ms);
  const digitar = async (texto, atraso = 70) => { await p.keyboard.type(texto, { delay: atraso }); };

  await o.tomadas(p, { mover, clicar, esperar, digitar });
  const fim = (Date.now() - t0) / 1000;
  await p.waitForTimeout(300);
  const video = p.video();
  await ctx.close();
  await b.close();
  const arqBruto = await video.path();

  const dur = Math.max(1, fim - inicio);
  const base = path.join(o.saida, o.nome);
  const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
  const corte = ['-ss', inicio.toFixed(2), '-t', dur.toFixed(2), '-i', arqBruto, '-an', '-vf', `fps=30,scale=${W}:${H}:flags=lanczos`];
  if (o.intermediario) {
    ff([...corte, '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', base + '.mp4']);
    return { duracao: +dur.toFixed(1), arquivo: base + '.mp4', bloqueados, erros };
  }
  ff([...corte, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', base + '.webm']);
  ff([...corte, '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', base + '.mp4']);
  ff(['-ss', (inicio + 0.05).toFixed(2), '-i', arqBruto, '-frames:v', '1', '-vf', `scale=${W}:${H}`, '-q:v', '4', base + '.jpg']);
  const kb = (f) => Math.round(fs.statSync(f).size / 1024);
  return { duracao: +dur.toFixed(1), webm: kb(base + '.webm'), mp4: kb(base + '.mp4'), jpg: kb(base + '.jpg'), bloqueados, erros };
}

/** Junta clipes intermediários com fade e exporta WebM, MP4 e pôster. */
function juntar(clipes, saidaBase, fade = 0.45) {
  const durs = clipes.map((c) => c.duracao);
  const ins = clipes.flatMap((c) => ['-i', c.arquivo]);
  let filtro = '', ant = '[0:v]', acum = durs[0];
  for (let i = 1; i < clipes.length; i++) {
    const off = (acum - fade).toFixed(2);
    const out = i === clipes.length - 1 ? '[v]' : `[x${i}]`;
    filtro += `${ant}[${i}:v]xfade=transition=fade:duration=${fade}:offset=${off}${out};`;
    ant = out; acum = acum + durs[i] - fade;
  }
  filtro = filtro.replace(/;$/, '');
  const ff = (args) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args]);
  ff([...ins, '-filter_complex', filtro, '-map', '[v]', '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', saidaBase + '.webm']);
  ff([...ins, '-filter_complex', filtro, '-map', '[v]', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', saidaBase + '.mp4']);
  ff(['-i', clipes[0].arquivo, '-frames:v', '1', '-q:v', '4', saidaBase + '.jpg']);
  const kb = (f) => Math.round(fs.statSync(f).size / 1024);
  return { duracao: +acum.toFixed(1), webm: kb(saidaBase + '.webm'), mp4: kb(saidaBase + '.mp4'), jpg: kb(saidaBase + '.jpg') };
}

module.exports = { gravar, juntar };
