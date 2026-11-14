import type { No } from '../data/ecossistema';

export function iniciarEcossistema() {
  const sec = document.querySelector<HTMLElement>('[data-eco]');
  if (!sec) return;
  const nos: No[] = JSON.parse(sec.querySelector('[data-eco-dados]')?.textContent ?? '[]');
  const campo = <T extends Element = HTMLElement>(k: string) => sec.querySelector<T>(`[data-i="${k}"]`)!;
  const botoes = [...sec.querySelectorAll<HTMLButtonElement>('[data-no]')];
  const caminhos = [...sec.querySelectorAll<SVGPathElement>('[data-cam]')];

  const spark = (id: string) => {
    const s = id.charCodeAt(0) + id.charCodeAt(1);
    const pts = Array.from({ length: 13 }, (_, i) => [i * (260 / 12), 46 - i * 2.6 - Math.sin(i * 1.3 + s) * 6] as const);
    const d = 'M' + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
    campo<SVGPathElement>('linha').setAttribute('d', d);
    campo<SVGPathElement>('area').setAttribute('d', `${d} L260 56 L0 56 Z`);
  };

  const selecionar = (id: string) => {
    const n = nos.find((x) => x.id === id);
    if (!n) return;
    botoes.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.no === id)));
    caminhos.forEach((p) => p.classList.toggle('on', p.dataset.cam === id));
    campo('sigla').textContent = n.sigla;
    campo('nome').textContent = n.nome;
    campo('numero').textContent = n.numero;
    campo('unidade').textContent = n.unidade;
    campo('texto').textContent = n.texto;
    const ul = campo('stack');
    ul.replaceChildren(...n.stack.map(([a, b]) => {
      const li = document.createElement('li');
      const s1 = document.createElement('span'); s1.textContent = a;
      const s2 = document.createElement('span'); s2.textContent = b;
      li.append(s1, s2);
      return li;
    }));
    const link = campo<HTMLAnchorElement>('caso');
    link.hidden = !n.caso;
    if (n.caso) link.href = `/cases/${n.caso}/`;
    spark(id);
  };

  botoes.forEach((b) => {
    const id = b.dataset.no!;
    b.addEventListener('click', () => selecionar(id));
    b.addEventListener('mouseenter', () => selecionar(id));
    b.addEventListener('focus', () => selecionar(id));
  });
  spark(nos[0]?.id ?? 'rs');
}
