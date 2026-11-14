const { gravar } = require('./gravador.cjs'); const { prepararPainel, GERACAO } = require('./mock-painel.cjs');
gravar({
  nome: 'resultados-sem-vazamento',
  url: 'http://localhost:5184/r/vale-verde/2026-diagnostica-5ano-caderno-2/' + GERACAO,
  saida: process.argv[2],
  preparar: prepararPainel,
  mouseInicial: [1180, 150],
  tomadas: async (p, { mover, esperar }) => {
    const sel = (i) => p.locator('select').nth(i);
    const ir = async (i, valor) => {
      const box = await sel(i).boundingBox();
      await mover(box.x + box.width * 0.6, box.y + box.height / 2, 480);
      await esperar(180);
      await p.mouse.down(); await esperar(80); await p.mouse.up();
      await p.keyboard.press('Escape');
      await sel(i).selectOption({ label: valor });
    };
    await esperar(1200);
    await ir(0, 'Matemática');
    await esperar(1500);
    await ir(1, 'EMEF IPÊ AMARELO');
    await esperar(1700);
    await ir(1, 'Toda a rede');
    await esperar(500);
    await ir(0, 'Língua Portuguesa');
    await mover(1180, 150, 450);
    await esperar(400);
  },
}).then((r) => console.log(JSON.stringify(r))).catch((e) => { console.error(e); process.exit(1); });
