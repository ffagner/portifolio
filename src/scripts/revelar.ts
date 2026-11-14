// Seções abaixo da dobra sobem levemente ao entrar na tela. O conteúdo fica sempre visível.
const reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduz && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.remove('pre');
        io.unobserve(e.target);
      }
    }),
    { rootMargin: '0px 0px -8% 0px' },
  );
  document.querySelectorAll<HTMLElement>('.rv').forEach((el) => {
    if (el.getBoundingClientRect().top > innerHeight) {
      el.classList.add('pre');
      io.observe(el);
    }
  });
}
