// Gera um snapshot 100% fictício com as funções do próprio painel.
// Uso: SAIDA=/pasta npx vitest run src/demo
import { test } from "vitest";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { FAIXAS_PADRAO } from "@/shared/lib/faixas";
import { montarSnapshot } from "@/features/publicar-avaliacao/montar-snapshot";
import { visaoEscola } from "@/features/publicar-avaliacao/visao-escola";
import type { LinhaGabarito, LinhaResposta } from "@/features/publicar-avaliacao/tipos";

let semente = 20261114;
const rnd = () => { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; };
const escolher = <T,>(xs: readonly T[]) => xs[Math.floor(rnd() * xs.length)]!;

const NOMES = ["ANA", "BRUNO", "CARLA", "DAVI", "ELISA", "FELIPE", "GABRIELA", "HEITOR", "ISIS", "JOÃO", "LARISSA", "MIGUEL", "NINA", "OTÁVIO", "PAULA", "RAFAEL", "SOFIA", "TIAGO", "VITÓRIA", "YAGO", "BEATRIZ", "CAIO", "LÍVIA", "MATEUS", "HELENA", "ENZO"];
const SOBRENOMES = ["ARANTES", "BEZERRA", "CAMPOS", "DUARTE", "ESTEVES", "FIGUEIRA", "GUEDES", "HOLANDA", "JARDIM", "LACERDA", "MOURA", "NÓBREGA", "PINHEIRO", "QUINTELA", "REZENDE", "SAMPAIO", "TELES", "XAVIER"];

const ESCOLAS = [
  { slug: "emef-ipe-amarelo", nome: "EMEF IPÊ AMARELO", nivel: 0.76, turmas: [["A", "MANHÃ"], ["B", "MANHÃ"], ["C", "TARDE"]] },
  { slug: "emef-jatoba", nome: "EMEF JATOBÁ", nivel: 0.63, turmas: [["A", "MANHÃ"], ["B", "TARDE"]] },
  { slug: "emef-buriti", nome: "EMEF BURITI", nivel: 0.49, turmas: [["A", "MANHÃ"], ["B", "TARDE"]] },
  { slug: "emef-aroeira", nome: "EMEF AROEIRA", nivel: 0.38, turmas: [["A", "INTEGRAL"]] },
] as const;

const COMPONENTES = [
  { nome: "Língua Portuguesa", habilidades: ["D1", "D3", "D4", "D5", "D6", "D11", "D14", "D15", "D18", "D20"] },
  { nome: "Matemática", habilidades: ["D7", "D12", "D13", "D16", "D19", "D20", "D22", "D25", "D28", "D29"] },
];
const QUESTOES = 22;

test("gera snapshot fictício", () => {
  const saida = process.env.SAIDA!;
  const gabarito: LinhaGabarito[] = COMPONENTES.flatMap((c) =>
    Array.from({ length: QUESTOES }, (_, i) => ({
      id: `${c.nome}-${i + 1}`, componente: c.nome, numero_questao: i + 1,
      habilidade: c.habilidades[i % c.habilidades.length]!, resposta_correta: escolher(["A", "B", "C", "D"]), anulada: false,
    })));
  const dificuldade = new Map(gabarito.map((g) => [g.id, (rnd() - 0.5) * 0.4]));

  const respostas: LinhaResposta[] = [];
  const usados = new Set<string>();
  for (const e of ESCOLAS) {
    for (const [turma, turno] of e.turmas) {
      const n = 22 + Math.floor(rnd() * 8);
      const nivelTurma = e.nivel + (rnd() - 0.5) * 0.12;
      for (let k = 0; k < n; k++) {
        let nome = "";
        do nome = `${escolher(NOMES)} ${escolher(SOBRENOMES)} ${escolher(SOBRENOMES)}`; while (usados.has(nome));
        usados.add(nome);
        const habilidadeAluno = Math.min(0.97, Math.max(0.05, nivelTurma + (rnd() - 0.5) * 0.45));
        for (const c of COMPONENTES) {
          const presente = rnd() > 0.04;
          const linhas = gabarito.filter((g) => g.componente === c.nome).map((g) => {
            const acerto = rnd() < Math.min(0.98, Math.max(0.02, habilidadeAluno - dificuldade.get(g.id)!));
            const errada = ["A", "B", "C", "D"].filter((x) => x !== g.resposta_correta);
            return { numero_questao: g.numero_questao, habilidade: g.habilidade, resposta_dada: acerto ? g.resposta_correta : escolher(errada), acerto };
          });
          respostas.push({
            id: `${e.slug}-${turma}-${k}-${c.nome}`, nome, escola: e.nome, turma, turno, presente, componente: c.nome,
            total_acertos: presente ? linhas.filter((l) => l.acerto).length : 0, is_pcd: false,
            respostas_habilidades: presente ? linhas : [],
          });
        }
      }
    }
  }

  const cadastro = {
    municipioId: "00000000-0000-4000-8000-0000000000a1", slug: "vale-verde", nome: "Vale Verde", nomeBanco: "VALE VERDE", logoUrl: null,
    escolas: ESCOLAS.map((e, i) => ({ id: `00000000-0000-4000-8000-00000000e00${i}`, slug: e.slug, nome: e.nome, nomeBanco: e.nome })),
  };
  const parametros = {
    avaliacaoId: "00000000-0000-4000-8000-0000000000b1", avaliacao: "DIAGNÓSTICA 2026 - CADERNO 2", serie: "5º Ano", anoLetivo: 2026,
    titulo: "CADERNO 2", subtitulo: "Turmas de 5º Ano da Rede Municipal de Vale Verde - CADERNO 2",
    metodologia: null, etapaOrdem: null, faixas: [...FAIXAS_PADRAO], metas: { LP: 80, MT: 70 },
  };
  const snapshot = montarSnapshot(parametros as never, cadastro, respostas, gabarito, 1, new Date("2026-11-10T14:00:00Z"));

  const geracao = "3b9d6c1e-5a2f-4e8b-9c7d-1f0a2b3c4d5e";
  const base = join(saida, "resultados", "vale-verde", "2026-diagnostica-5ano-caderno-2", "versoes", geracao);
  const gravar = (rel: string, obj: object) => {
    const f = join(base, rel); mkdirSync(dirname(f), { recursive: true });
    writeFileSync(f, JSON.stringify({ ...obj, geracao }));
  };
  for (const esc of snapshot.escolas) {
    gravar(`escolas/${esc.escola.slug}.json`, esc);
    const visao = visaoEscola(snapshot.manifest, snapshot.rede, esc.escola.slug);
    gravar(`visoes/${esc.escola.slug}/manifest.json`, visao.manifest);
    gravar(`visoes/${esc.escola.slug}/rede.json`, visao.rede);
  }
  gravar("rede.json", snapshot.rede);
  gravar("manifest.json", snapshot.manifest);
  writeFileSync(join(saida, "info.json"), JSON.stringify({ geracao, alunos: snapshot.manifest.totais, alertas: snapshot.conferencia.alertas }, null, 2));
});
