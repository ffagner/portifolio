const { gravar, juntar } = require('./gravador.cjs'); const { prepararAnswer } = require('./mock-answer.cjs');
const path = require('path'); const SAIDA = process.argv[2];
(async () => {
  const a = await gravar({
    nome: '_answer-lancar', url: 'http://localhost:5185/gabaritos', saida: SAIDA, intermediario: true, preparar: prepararAnswer,
    mouseInicial: [1180, 300],
    antesDeGravar: async (p) => {
      const s = p.locator('select');
      await s.nth(2).selectOption({ label: '5º ANO' }); await p.waitForTimeout(300);
      await s.nth(3).selectOption({ label: 'A' }); await p.waitForTimeout(500);
      await s.nth(4).selectOption({ index: 1 }); await p.waitForTimeout(400);
      await s.nth(5).selectOption({ index: 1 }); await p.waitForTimeout(600);
      await s.nth(6).selectOption({ index: 1 }); await p.waitForTimeout(400);
      await p.locator('button:has-text("Iniciar Lançamento")').click(); await p.waitForTimeout(900);
      await p.evaluate(() => window.scrollTo(0, 0));
    },
    tomadas: async (p, { clicar, esperar }) => {
      await esperar(500);
      const marcas = ['B', 'D', 'A', 'C', 'C'];
      for (let i = 0; i < marcas.length; i++) {
        const n = String(i + 1).padStart(2, '0');
        const alvo = p.locator(`xpath=//*[normalize-space(text())='${n}']/ancestor::*[.//*[normalize-space(text())='X']][1]//*[normalize-space(text())='${marcas[i]}']`).first();
        await clicar(alvo, { ms: 260, pausa: 60 });
        await esperar(150);
      }
      await esperar(1100);
    },
  });
  const b = await gravar({
    nome: '_answer-relatorio', url: 'http://localhost:5185/relatorio-preliminar', saida: SAIDA, intermediario: true, preparar: prepararAnswer,
    mouseInicial: [700, 300],
    antesDeGravar: async (p) => {
      const s = p.locator('select');
      await s.nth(0).selectOption({ index: 1 }); await p.waitForTimeout(700);
      await s.nth(2).selectOption({ index: 1 }); await p.waitForTimeout(400);
    },
    tomadas: async (p, { clicar, esperar }) => {
      await esperar(400);
      await clicar('button:has-text("Gerar Relatório")', { ms: 450, pausa: 120 });
      await esperar(1300);
      for (let k = 0; k < 10; k++) { await p.mouse.wheel(0, 34); await esperar(30); }
      await esperar(1200);
    },
  });
  console.log(JSON.stringify({ a: [a.duracao, a.bloqueados, a.erros.length], b: [b.duracao, b.bloqueados, b.erros.length] }));
  console.log(JSON.stringify(juntar([a, b], path.join(SAIDA, 'gabarito-em-1-segundo'))));
})().catch((e) => { console.error(e); process.exit(1); });
