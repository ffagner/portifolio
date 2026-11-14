const { gravar } = require('./gravador.cjs');
gravar({
  nome: 'gestao-escolar-como-saas',
  url: 'http://localhost:5181/',
  saida: process.argv[2],
  mouseInicial: [1080, 36],
  tomadas: async (p, { clicar, mover, esperar }) => {
    await esperar(1100);
    await clicar('button:has-text("Matemática")', { ms: 450, pausa: 150 });
    await esperar(1300);
    await clicar('button:has-text("Mapa Territorial")', { ms: 500, pausa: 150 });
    await esperar(500);
    await mover(225, 312, 500);
    await esperar(1500);
    await clicar('button:has-text("Dashboard")', { ms: 450, pausa: 150 });
    await esperar(350);
    await clicar('button:has-text("Português")', { ms: 450, pausa: 150 });
    await mover(1080, 36, 450);
    await esperar(300);
  },
}).then((r) => console.log(JSON.stringify(r))).catch((e) => { console.error(e); process.exit(1); });
