/** Espiral 3D de projetos (CSS 3D), com filtro por categoria, arraste e folha de detalhes. */
import type { Projeto } from '../data/projetos';

export function iniciarBiblioteca() {
  const sec = document.querySelector<HTMLElement>('[data-lib]');
  if (!sec) return;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const projetos: Projeto[] = JSON.parse(sec.querySelector('[data-lib-dados]')?.textContent ?? '[]');
  const palco = sec.querySelector<HTMLElement>('[data-palco]')!;
  const helice = sec.querySelector<HTMLElement>('[data-helice]')!;
  const itens = [...helice.querySelectorAll<HTMLLIElement>('li')];
  const cards = [...helice.querySelectorAll<HTMLButtonElement>('.hcard')];
  const filtros = [...sec.querySelectorAll<HTMLButtonElement>('.filtros .chip')];

  const cv = sec.querySelector<HTMLCanvasElement>('[data-nucleo]')!;
  const ctx = cv.getContext('2d');
  let t = 0;
  const PASSO = 30;
  let R = 440, DY = 30, rot = 0, vel = 0, arrasto: number | null = null;

  const posicionar = () => {
    const movel = palco.clientWidth < 760;
    R = movel ? 230 : Math.min(470, palco.clientWidth * 0.36);
    DY = movel ? 26 : 30;
    const n = itens.length;
    itens.forEach((li, i) => {
      li.style.transform = `rotateY(${i * PASSO}deg) translateZ(${R}px) translateY(${(i - (n - 1) / 2) * DY}px)${movel ? ' scale(.78)' : ''}`;
    });
  };
  const aplicar = () => {
    const r = palco.getBoundingClientRect();
    const p = (innerHeight - r.top) / (innerHeight + r.height);
    helice.style.transform = `translateY(${(0.5 - p) * 80}px) rotateX(-8deg) translateZ(${-R * 1.15}px) rotateY(${rot}deg)`;
    cards.forEach((c, i) => {
      if (c.classList.contains('off')) { c.style.opacity = ''; return; }
      const a = (((i * PASSO + rot) % 360) + 360) % 360;
      const f = Math.cos((a * Math.PI) / 180);
      c.style.opacity = f > 0 ? (0.55 + 0.45 * f).toFixed(2) : (0.18 + 0.12 * (1 + f)).toFixed(2);
    });
  };
  posicionar();
  addEventListener('resize', () => { posicionar(); aplicar(); });

  // Arrastar gira a espiral; teclado foca o card e a espiral vira para ele.
  palco.addEventListener('pointerdown', (e) => { if (!(e.target as Element).closest('.hcard')) arrasto = e.clientX; });
  addEventListener('pointerup', () => (arrasto = null));
  addEventListener('pointermove', (e) => { if (arrasto !== null) { vel = (e.clientX - arrasto) * 0.25; arrasto = e.clientX; } });
  cards.forEach((c, i) => c.addEventListener('focus', () => { rot = -i * PASSO; aplicar(); }));

  let naTela = false, rodando = false;
  const quadro = () => {
    if (!naTela || document.hidden) { rodando = false; return; }
    rot -= 0.12 + vel;
    vel *= 0.92;
    aplicar();
    t += 0.016;
    nucleo();
    requestAnimationFrame(quadro);
  };
  const retomar = () => { if (!rodando && naTela && !document.hidden && !reduz) { rodando = true; requestAnimationFrame(quadro); } };
  new IntersectionObserver((es) => { naTela = !!es[0]?.isIntersecting; retomar(); }).observe(palco);
  document.addEventListener('visibilitychange', retomar);
  if (reduz) { rot = -20; aplicar(); }

  filtros.forEach((b) => b.addEventListener('click', () => {
    const cat = b.dataset.cat;
    filtros.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    cards.forEach((c) => {
      const fora = cat !== 'Todos' && c.dataset.cat !== cat;
      c.classList.toggle('off', fora);
      c.tabIndex = fora ? -1 : 0;
    });
    aplicar();
  }));

  // Núcleo: asterisco de pontos girando (desenhado no mesmo loop da espiral).
  function nucleo() {
    if (!ctx) return;
    ctx.clearRect(0, 0, 300, 300);
    for (let a = 0; a < 8; a++) {
      const ang = (a / 8) * Math.PI * 2 + t * 0.2;
      for (let s = 1; s <= 7; s++) {
        const rr = s * 16, al = 1 - s / 9;
        ctx.fillStyle = a % 2 ? `rgba(205,245,100,${al})` : `rgba(236,238,228,${al * 0.8})`;
        ctx.beginPath();
        ctx.arc(150 + Math.cos(ang) * rr, 150 + Math.sin(ang) * rr * 0.95, a % 2 ? 4.2 - s * 0.35 : 3.2 - s * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.fillStyle = '#cdf564'; ctx.shadowColor = '#cdf564'; ctx.shadowBlur = 24;
    ctx.beginPath(); ctx.arc(150, 150, 9, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;
  }
  nucleo();

  // Folha de detalhes.
  const folha = sec.querySelector<HTMLDialogElement>('[data-folha]')!;
  const f = <T extends HTMLElement = HTMLElement>(k: string) => folha.querySelector<T>(`[data-f="${k}"]`)!;
  cards.forEach((c) => c.addEventListener('click', () => {
    const p = projetos[Number(c.dataset.i)];
    if (!p) return;
    if (p.caso) { location.href = `/cases/${p.caso}/`; return; }
    f('cat').textContent = p.categoria;
    f('vis').textContent = p.publico ? 'repositório público' : 'repositório privado';
    f('nome').textContent = p.nome;
    f('desc').textContent = p.descricao;
    const link = f<HTMLAnchorElement>('link');
    link.hidden = !p.publico;
    link.href = `https://github.com/ffagner/${p.nome}`;
    f('caso').hidden = true;
    folha.showModal();
  }));
  folha.querySelectorAll('[data-fechar]').forEach((b) => b.addEventListener('click', () => folha.close()));
  folha.addEventListener('click', (e) => { if (e.target === folha) folha.close(); });
}
