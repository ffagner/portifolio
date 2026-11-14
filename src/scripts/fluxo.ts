/** "Como funciona": partículas saem de três trilhas e convergem num ponto. Canvas 2D. */
interface Passo { titulo: string; texto: string; chave: string; detalhe: string; meta: string; trilhas: string[] }

export function iniciarFluxo() {
  const sec = document.querySelector<HTMLElement>('[data-fluxo]');
  if (!sec) return;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const passos: Passo[] = JSON.parse(sec.querySelector('[data-fluxo-dados]')?.textContent ?? '[]');
  const palco = sec.querySelector<HTMLElement>('[data-palco]')!;
  const cv = sec.querySelector<HTMLCanvasElement>('[data-fluxo-cv]')!;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const campos = (k: string) => sec.querySelector<HTMLElement>(`[data-f="${k}"]`)!;
  const trilhas = [...sec.querySelectorAll<HTMLElement>('[data-trilha]')];
  const abas = [...sec.querySelectorAll<HTMLButtonElement>('[data-passo]')];

  let W = 0, H = 0;
  const medir = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    W = palco.clientWidth; H = palco.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  medir();

  const N = innerWidth < 760 ? 420 : 900;
  const P = Array.from({ length: N }, (_, i) => ({
    trilha: i % 3, t: Math.random(), vel: 0.0012 + Math.random() * 0.0026, j: Math.random() - 0.5, viva: Math.random() < 0.06,
  }));
  const bez = (a: number, b: number, c: number, d: number, t: number) => {
    const u = 1 - t;
    return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
  };

  const desenhar = () => {
    const movel = W < 760;
    ctx.clearRect(0, 0, W, H);
    const ex = movel ? W * 0.5 : W * 0.66, ey = movel ? H * 0.58 : H * 0.66;
    const ys = movel ? [0.3, 0.58, 0.86] : [0.4, 0.66, 0.92];
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(205,245,100,.55)';
    ctx.beginPath(); ctx.moveTo(movel ? 0 : W * 0.02, ey); ctx.lineTo(ex, ey); ctx.stroke();
    if (!movel) {
      ctx.strokeStyle = 'rgba(205,245,100,.8)';
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(W - Math.min(290, W * 0.34), ey); ctx.stroke();
    }
    for (const p of P) {
      if (!reduz) { p.t += p.vel; if (p.t > 1) { p.t = 0; p.j = Math.random() - 0.5; } }
      const ly = (ys[p.trilha] ?? 0.5) * H;
      const x = bez(0, W * 0.3, W * 0.45, ex, p.t);
      const y = bez(ly, ly, ey, ey, p.t) + p.j * (movel ? 60 : 70) * (1 - p.t) * (1 - p.t);
      const a = Math.sin(p.t * Math.PI) * 0.9;
      ctx.fillStyle = p.viva ? `rgba(205,245,100,${a})` : `rgba(190,196,176,${a * 0.55})`;
      const s = p.viva ? 2.2 : 1.4;
      ctx.fillRect(x, y, s, s);
    }
    ctx.fillStyle = '#cdf564'; ctx.shadowColor = '#cdf564'; ctx.shadowBlur = 14;
    ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  };

  let naTela = false, rodando = false;
  const quadro = () => {
    if (!naTela || document.hidden) { rodando = false; return; }
    desenhar();
    requestAnimationFrame(quadro);
  };
  const retomar = () => { if (!rodando && naTela && !document.hidden) { rodando = true; requestAnimationFrame(quadro); } };
  addEventListener('resize', () => { medir(); desenhar(); });
  if (reduz) desenhar();
  else {
    new IntersectionObserver((es) => { naTela = !!es[0]?.isIntersecting; retomar(); }).observe(palco);
    document.addEventListener('visibilitychange', retomar);
  }

  let atual = 0, automatico = !reduz;
  const ir = (i: number) => {
    const s = passos[i];
    if (!s) return;
    atual = i;
    campos('titulo').textContent = s.titulo;
    campos('texto').textContent = s.texto;
    campos('chave').textContent = s.chave;
    campos('detalhe').textContent = s.detalhe;
    campos('meta').textContent = s.meta;
    trilhas.forEach((el, j) => (el.textContent = s.trilhas[j] ?? ''));
    abas.forEach((b, j) => b.setAttribute('aria-selected', String(j === i)));
    P.forEach((p) => (p.viva = Math.random() < 0.05 + i * 0.03));
    if (reduz) desenhar();
  };
  abas.forEach((b) => b.addEventListener('click', () => { automatico = false; ir(Number(b.dataset.passo)); }));
  window.setInterval(() => { if (automatico && naTela && !document.hidden) ir((atual + 1) % passos.length); }, 5200);
}
