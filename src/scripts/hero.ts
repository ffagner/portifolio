/**
 * Hero: plano 3D de pontos (Three.js) com cards presos por hastes.
 * Three.js é carregado sob demanda, só quando o hero aparece e há WebGL.
 * Com movimento reduzido, desenha um único quadro.
 */
interface Card { k: string; v: string; vivo: boolean }
interface Conjunto { chip: string; pergunta: string; cards: Card[] }

const onda = (x: number, z: number, t: number) =>
  Math.sin(x * 0.32 + t * 0.5) * 0.32 + Math.cos(z * 0.45 + t * 0.35 + x * 0.1) * 0.28;

const ANCORAS: [number, number][] = [[-10, -13], [-3.2, -12.5], [3.2, -12.5], [10, -13]];

function curva(vivo: boolean) {
  let d = 'M0 16';
  for (let i = 1; i <= 10; i++) d += ` L${i * 14} ${(16 - (vivo ? i * 1.2 : 0) + Math.sin(i * 1.7) * 3).toFixed(1)}`;
  return d;
}

export function iniciarHero() {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!hero) return;
  const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const conjuntos: Conjunto[] = JSON.parse(hero.querySelector('[data-hero-sets]')?.textContent ?? '[]');
  const cards = [...hero.querySelectorAll<HTMLElement>('[data-mcard]')];
  const hastes = [...hero.querySelectorAll<HTMLElement>('[data-haste]')];
  const pergunta = hero.querySelector<HTMLElement>('[data-pergunta]')!;
  const chips = [...hero.querySelectorAll<HTMLButtonElement>('.chip')];

  // ----- troca de conjunto (funciona com ou sem WebGL) -----
  let digitando = 0;
  const digitar = (texto: string) => {
    window.clearInterval(digitando);
    if (reduz) { pergunta.textContent = texto; return; }
    let i = 0;
    digitando = window.setInterval(() => {
      i++;
      pergunta.innerHTML = '';
      pergunta.append(texto.slice(0, i));
      const c = document.createElement('span');
      c.className = 'cursor';
      pergunta.append(c);
      if (i >= texto.length) window.clearInterval(digitando);
    }, 22);
  };
  const preencher = (n: number) => {
    conjuntos[n]?.cards.forEach((c, i) => {
      const el = cards[i];
      if (!el) return;
      el.querySelector('.k')!.textContent = c.k;
      const v = el.querySelector('.v')!;
      v.textContent = c.v;
      v.classList.toggle('vivo', c.vivo);
      const p = el.querySelector('path')!;
      p.setAttribute('d', curva(c.vivo));
      p.setAttribute('stroke', c.vivo ? '#cdf564' : '#8d9182');
    });
  };
  chips.forEach((b) => b.addEventListener('click', () => {
    const n = Number(b.dataset.set);
    chips.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    cards.forEach((c) => (c.style.opacity = '0'));
    window.setTimeout(() => { preencher(n); cards.forEach((c) => (c.style.opacity = '1')); }, 220);
    digitar(conjuntos[n]?.pergunta ?? '');
  }));

  // ----- campo 3D -----
  const canvas = hero.querySelector<HTMLCanvasElement>('[data-campo]')!;
  const temWebGL = (() => {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
  })();
  if (!temWebGL) return;

  // O Three.js entra depois que a página terminou de carregar e o navegador ficou ocioso,
  // para não disputar a thread principal com a primeira pintura.
  const quandoOcioso = (fn: () => void) => {
    const agendar = () => ('requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 1500 }) : setTimeout(fn, 200));
    if (document.readyState === 'complete') agendar();
    else addEventListener('load', agendar, { once: true });
  };
  let iniciado = false;
  const io = new IntersectionObserver((es) => {
    if (es[0]?.isIntersecting && !iniciado) { iniciado = true; io.disconnect(); quandoOcioso(() => void montar()); }
  });
  io.observe(hero);

  async function montar() {
    const THREE = await import('three');
    let renderer: import('three').WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch { return; }
    hero!.classList.add('gl-ok');
    const cena = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    const movel = innerWidth < 760;
    const COLS = movel ? 70 : 150, LINHAS = movel ? 34 : 64, N = COLS * LINHAS;
    const pos = new Float32Array(N * 3), vivo = new Float32Array(N), semente = new Float32Array(N);
    let k = 0;
    for (let r = 0; r < LINHAS; r++) for (let c = 0; c < COLS; c++) {
      pos[k * 3] = (c / (COLS - 1) - 0.5) * 30;
      pos[k * 3 + 1] = 0;
      pos[k * 3 + 2] = -15 + (r / (LINHAS - 1)) * 17;
      const h = Math.abs(Math.sin(c * 12.9898 + r * 78.233) * 43758.5453) % 1;
      vivo[k] = h < 0.045 ? 1 : 0;
      semente[k] = h;
      k++;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aVivo', new THREE.BufferAttribute(vivo, 1));
    geo.setAttribute('aSemente', new THREE.BufferAttribute(semente, 1));
    const u = {
      uTempo: { value: 0 },
      uMouse: { value: new THREE.Vector2(99, 99) },
      uPR: { value: Math.min(devicePixelRatio, 2) },
      uEntrada: { value: reduz ? 1 : 0 },
    };
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: u,
      vertexShader: /* glsl */ `
        attribute float aVivo; attribute float aSemente;
        uniform float uTempo; uniform vec2 uMouse; uniform float uPR; uniform float uEntrada;
        varying float vA; varying float vVivo;
        void main() {
          vec3 p = position;
          float w = sin(p.x*0.32+uTempo*0.5)*0.32 + cos(p.z*0.45+uTempo*0.35+p.x*0.1)*0.28;
          float d = distance(p.xz, uMouse);
          w += exp(-d*d*0.12)*0.9*sin(d*1.6-uTempo*3.0);
          p.y += w*uEntrada - (1.0-uEntrada)*2.0*(0.5+aSemente);
          vec4 mv = modelViewMatrix*vec4(p,1.0);
          gl_Position = projectionMatrix*mv;
          float pulso = 0.75+0.25*sin(uTempo*2.0+aSemente*40.0);
          gl_PointSize = (aVivo>0.5 ? 3.4*pulso : 2.0)*uPR*(9.0/-mv.z);
          vA = smoothstep(-27.0,-8.0,mv.z)*(0.35+0.65*smoothstep(-0.4,0.6,w))*uEntrada;
          vVivo = aVivo;
        }`,
      fragmentShader: /* glsl */ `
        varying float vA; varying float vVivo;
        void main() {
          vec2 c = gl_PointCoord-0.5; float r = length(c);
          if (r > 0.5) discard;
          vec3 cor = mix(vec3(0.62,0.65,0.57), vec3(0.80,0.96,0.39), vVivo);
          float a = vA*(vVivo>0.5 ? 1.0 : 0.55)*smoothstep(0.5,0.3,r);
          gl_FragColor = vec4(cor, a);
        }`,
    });
    cena.add(new THREE.Points(geo, mat));
    camera.position.set(0, 3.0, 9.5);
    camera.lookAt(0, 0.4, -3);

    let W = 0, H = 0;
    const medir = () => {
      W = hero!.clientWidth; H = hero!.clientHeight;
      renderer.setPixelRatio(Math.min(devicePixelRatio, movel ? 1.5 : 2));
      renderer.setSize(W, H, false);
      camera.aspect = W / H;
      camera.fov = W < 760 ? 62 : 40;
      camera.updateProjectionMatrix();
    };
    medir();

    // Tamanhos dos cards guardados: ler offsetWidth a cada quadro forçaria o layout.
    let tamanhos = cards.map((c) => [c.offsetWidth, c.offsetHeight] as const);
    const medirCards = () => { tamanhos = cards.map((c) => [c.offsetWidth, c.offsetHeight] as const); };
    chips.forEach((b) => b.addEventListener('click', () => window.setTimeout(medirCards, 260)));

    const raio = new THREE.Raycaster();
    const plano = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const ndc = new THREE.Vector2(), acerto = new THREE.Vector3(), alvo = new THREE.Vector2(99, 99);
    hero!.addEventListener('pointermove', (e) => {
      const r = hero!.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raio.setFromCamera(ndc, camera);
      if (raio.ray.intersectPlane(plano, acerto)) alvo.set(acerto.x, acerto.z);
    });
    hero!.addEventListener('pointerleave', () => alvo.set(99, 99));

    const v = new THREE.Vector3();
    let t = 0, ultimo = performance.now(), camX = 0;
    let naTela = true, abaVisivel = document.visibilityState === 'visible', rodando = false;
    const posicionar = () => {
      const haste = W < 760 ? 52 : 78;
      ANCORAS.forEach(([x, z], i) => {
        v.set(x, onda(x, z, t) * u.uEntrada.value, z).project(camera);
        const sx = (v.x * 0.5 + 0.5) * W, sy = (-v.y * 0.5 + 0.5) * H;
        const c = cards[i], h = hastes[i];
        if (!c || !h) return;
        h.style.transform = `translate(${sx}px,${sy - haste}px)`;
        h.style.height = `${haste}px`;
        const giro = (i < 2 ? -1 : 1) * 2;
        const [cw, ch] = tamanhos[i] ?? [150, 80];
        c.style.transform = `translate(${sx - cw / 2}px,${sy - haste - ch}px) rotate(${giro}deg)`;
      });
    };
    // No celular, 30 quadros por segundo bastam e poupam bateria.
    const intervalo = movel ? 1000 / 30 : 0;
    const quadro = (agora: number) => {
      if (!naTela || !abaVisivel) { rodando = false; return; }
      if (intervalo && agora - ultimo < intervalo - 2) { requestAnimationFrame(quadro); return; }
      const dt = Math.min(0.05, (agora - ultimo) / 1000);
      ultimo = agora; t += dt;
      u.uTempo.value = t;
      u.uEntrada.value = Math.min(1, u.uEntrada.value + dt * 0.7);
      u.uMouse.value.lerp(alvo, 0.08);
      camX += ((alvo.x < 50 ? alvo.x * 0.04 : 0) - camX) * 0.03;
      camera.position.x = camX;
      camera.lookAt(0, 0.4, -3);
      renderer.render(cena, camera);
      posicionar();
      requestAnimationFrame(quadro);
    };
    const desenharUmaVez = () => { renderer.render(cena, camera); posicionar(); };

    addEventListener('resize', () => { medir(); medirCards(); if (reduz) desenharUmaVez(); });
    if (reduz) { desenharUmaVez(); return; }
    const retomar = () => {
      if (rodando || !naTela || !abaVisivel) return;
      rodando = true;
      ultimo = performance.now();
      requestAnimationFrame(quadro);
    };
    new IntersectionObserver((es) => { naTela = !!es[0]?.isIntersecting; retomar(); }).observe(hero!);
    document.addEventListener('visibilitychange', () => { abaVisivel = document.visibilityState === 'visible'; retomar(); });
  }
}
