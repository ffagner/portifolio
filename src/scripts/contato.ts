/** Contato: formulário (Netlify Forms), terminal de atalhos e esfera de pontos. */
interface Links { github: string; linkedin: string | null; email: string | null }

export function iniciarContato() {
  const sec = document.querySelector<HTMLElement>('[data-contato]');
  if (!sec) return;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const links: Links = JSON.parse(sec.querySelector('[data-contato-dados]')?.textContent ?? '{}');

  // ----- formulário -----
  const form = sec.querySelector<HTMLFormElement>('[data-form]')!;
  const estado = sec.querySelector<HTMLElement>('[data-estado]')!;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const botao = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    botao.disabled = true;
    estado.className = 'estado';
    estado.textContent = 'Enviando…';
    try {
      const corpo = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: corpo });
      if (!r.ok) throw new Error(String(r.status));
      form.reset();
      estado.className = 'estado ok';
      estado.textContent = 'Mensagem enviada. Respondo em até 2 dias úteis.';
    } catch {
      estado.className = 'estado erro';
      estado.textContent = 'Não foi possível enviar agora. Tente de novo em alguns minutos.';
    } finally {
      botao.disabled = false;
    }
  });

  // ----- copiar e-mail -----
  sec.querySelectorAll<HTMLButtonElement>('[data-copiar]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copiar ?? ''); b.textContent = 'Copiado'; }
    catch { b.textContent = 'Selecione e copie'; }
    window.setTimeout(() => (b.textContent = 'Copiar'), 1800);
  }));

  // ----- terminal -----
  const saida = sec.querySelector<HTMLElement>('[data-saida]')!;
  const termForm = sec.querySelector<HTMLFormElement>('[data-term]')!;
  const entrada = termForm.querySelector<HTMLInputElement>('input')!;
  const linha = (texto: string, classe?: string) => {
    const s = document.createElement('span');
    if (classe) s.className = classe;
    s.textContent = texto;
    return s;
  };
  const comandos: Record<string, () => (string | HTMLElement)[]> = {
    ajuda: () => ['comandos: ', linha('cases', 'ok'), ' · ', linha('github', 'ok'), ' · ', linha('stack', 'ok'), ' · ', linha('sobre', 'ok'), ' · ', linha('contato', 'ok'), ' · ', linha('limpar', 'ok')],
    cases: () => { document.getElementById('cases')?.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' }); return ['01 resultados sem vazamento\n02 gabarito em 1 segundo\n03 gestão escolar como SaaS\n04 presença e confiança']; },
    github: () => [linha(links.github.replace('https://', ''), 'ok')],
    stack: () => ['react · typescript · supabase · postgres · nestjs · firebase · recharts'],
    sobre: () => { document.getElementById('sobre')?.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' }); return ['fagner farias · croatá, ce\n14 anos na rede municipal · coordenador de estatística e tecnologia']; },
    contato: () => {
      document.getElementById('ct-nome')?.focus();
      const partes: (string | HTMLElement)[] = ['formulário acima, ou:'];
      if (links.email) partes.push('\ne-mail: ', linha(links.email, 'ok'));
      if (links.linkedin) partes.push('\nlinkedin: ', linha(links.linkedin.replace('https://', ''), 'ok'));
      partes.push('\ngithub: ', linha(links.github.replace('https://', ''), 'ok'));
      return partes;
    },
  };
  termForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const v = entrada.value.trim().toLowerCase();
    if (!v) return;
    entrada.value = '';
    if (v === 'limpar' || v === 'clear') { saida.replaceChildren(); return; }
    const resposta = comandos[v]?.() ?? ['comando não encontrado. digite ', linha('ajuda', 'ok')];
    saida.append('\n', linha(`$ ${v}`, 'cmd'), '\n', ...resposta);
    saida.scrollTop = saida.scrollHeight;
  });

  // ----- esfera -----
  const cv = sec.querySelector<HTMLCanvasElement>('[data-esfera]')!;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  let S = 0;
  const medir = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    S = cv.clientWidth;
    cv.width = S * dpr; cv.height = S * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  medir();
  const N = innerWidth < 760 ? 900 : 1600, ga = Math.PI * (3 - Math.sqrt(5));
  const pts = Array.from({ length: N }, (_, i) => {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i;
    return [Math.cos(th) * r, y, Math.sin(th) * r] as const;
  });
  let t = 0;
  const desenhar = () => {
    ctx.clearRect(0, 0, S, S);
    const R = S * 0.36, cx = S / 2, cy = S / 2, ca = Math.cos(t * 0.25), sa = Math.sin(t * 0.25), ct = Math.cos(0.35), st = Math.sin(0.35);
    for (const [px, py, pz] of pts) {
      const x = px * ca - pz * sa, z = px * sa + pz * ca;
      const y2 = py * ct - z * st, z2 = py * st + z * ct;
      const faixa = Math.sin(Math.atan2(pz, px) + t * 0.6) > 0.35;
      const prof = (z2 + 1) / 2;
      const esp = faixa ? 1 + Math.sin(t * 1.4 + py * 6) * 0.04 : 1;
      const a = 0.15 + prof * 0.85;
      ctx.fillStyle = faixa ? `rgba(205,245,100,${a})` : `rgba(236,238,228,${a * 0.75})`;
      const s = faixa ? 1.9 : 1.3;
      ctx.fillRect(cx + x * R * esp, cy + y2 * R * esp, s, s);
    }
  };
  let naTela = false, rodando = false;
  const quadro = () => {
    if (!naTela || document.hidden) { rodando = false; return; }
    t += 0.016;
    desenhar();
    requestAnimationFrame(quadro);
  };
  const retomar = () => { if (!rodando && naTela && !document.hidden && !reduz) { rodando = true; requestAnimationFrame(quadro); } };
  desenhar();
  addEventListener('resize', () => { medir(); desenhar(); });
  new IntersectionObserver((es) => { naTela = !!es[0]?.isIntersecting; retomar(); }).observe(cv);
  document.addEventListener('visibilitychange', retomar);
}
