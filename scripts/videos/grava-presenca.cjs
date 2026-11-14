const { gravar, juntar } = require('./gravador.cjs');
const path = require('path');
const SAIDA = process.argv[2];
const AE = { id: '44444444-4444-4444-4444-444444444444', nome: 'Daniela AE', email: 'ae@edupresenca.dev', papel: 'agente_educacional', municipio_id: '00000000-0000-0000-0000-000000000001', escola_id: '00000000-0000-0000-0000-000000000201' };
(async () => {
  const a = await gravar({
    nome: '_presenca-alertas', url: 'http://localhost:5183/ae/alertas', saida: SAIDA, intermediario: true,
    mouseInicial: [900, 640],
    preparar: async (ctx) => { await ctx.addInitScript((u) => localStorage.setItem('edupresenca:auth', JSON.stringify({ state: { usuario: u }, version: 0 })), AE); },
    tomadas: async (p, { clicar, esperar }) => {
      await esperar(1200);
      await clicar(p.locator('text=Alisson Oliveira').first(), { ms: 550, pausa: 150 });
      await esperar(2600);
    },
  });
  const c = await gravar({
    nome: '_cert-validar', url: 'http://localhost:5182/validar/7f3c2a91-4b8e-4d2a-9c61-2e5f0b8a7d14', saida: SAIDA, intermediario: true,
    mouseInicial: [1180, 120],
    tomadas: async (p, { esperar, mover }) => {
      await esperar(1300);
      await mover(990, 270, 500);
      await esperar(500);
      await p.mouse.wheel(0, 260); await esperar(1300);
    },
  });
  console.log(JSON.stringify({ a: [a.duracao, a.bloqueados, a.erros], c: [c.duracao, c.bloqueados, c.erros] }));
  console.log(JSON.stringify(juntar([a, c], path.join(SAIDA, 'presenca-e-confianca'))));
})().catch((e) => { console.error(e); process.exit(1); });
