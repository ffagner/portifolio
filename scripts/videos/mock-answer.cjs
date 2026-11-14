// Backend simulado do Answer Sheets: Auth + PostgREST em memória, com dados 100% fictícios.
let semente = 3141;
const rnd = () => { semente = (semente * 16807) % 2147483647; return (semente - 1) / 2147483646; };
const escolher = (xs) => xs[Math.floor(rnd() * xs.length)];

const USER_ID = '00000000-0000-4000-8000-0000000a5001';
const CIDADE = { id: 'c0000000-0000-4000-8000-000000000001', name: 'Vale Verde', created_at: '2026-01-01' };
const ESCOLAS = [
  { id: 's0000000-0000-4000-8000-000000000001', city_id: CIDADE.id, name: 'EMEF Ipê Amarelo', created_at: '2026-01-01' },
  { id: 's0000000-0000-4000-8000-000000000002', city_id: CIDADE.id, name: 'EMEF Jatobá', created_at: '2026-01-01' },
];
const NOMES = ['Ana', 'Bruno', 'Carla', 'Davi', 'Elisa', 'Felipe', 'Gabriela', 'Heitor', 'Isis', 'João', 'Larissa', 'Miguel', 'Nina', 'Otávio', 'Paula', 'Rafael', 'Sofia', 'Tiago', 'Vitória', 'Yago', 'Beatriz', 'Caio', 'Lívia', 'Mateus'];
const SOBRENOMES = ['Arantes', 'Bezerra', 'Campos', 'Duarte', 'Esteves', 'Figueira', 'Guedes', 'Holanda', 'Jardim', 'Lacerda', 'Moura', 'Nóbrega', 'Pinheiro', 'Rezende', 'Sampaio', 'Teles'];
const alunos = [];
const usados = new Set();
for (const esc of ESCOLAS) for (const turma of ['A', 'B']) for (let i = 0; i < 24; i++) {
  let n; do n = `${escolher(NOMES)} ${escolher(SOBRENOMES)} ${escolher(SOBRENOMES)}`; while (usados.has(n)); usados.add(n);
  alunos.push({ id: `a${String(alunos.length).padStart(7, '0')}-0000-4000-8000-000000000000`, cid: null, class_name: turma, created_at: '2026-02-01', grade: '5º ANO', name: n, school_id: esc.id, shift: 'Manhã', status: 'ativo' });
}
alunos.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
const AVALIACAO = { id: 'e0000000-0000-4000-8000-000000000001', name: 'Diagnóstica 2026', status_active: true, created_at: '2026-03-01' };
const gab = (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [String(i + 1), escolher(['A', 'B', 'C', 'D'])]));
const CHAVES = [
  { id: 'k0000000-0000-4000-8000-000000000001', name: 'Língua Portuguesa · 5º Ano', subject: 'Língua Portuguesa', grade: '5º ANO', total_questions: 10, answers_json: gab(10), evaluation_id: AVALIACAO.id, status_active: true, ability: null, year: 2026, created_at: '2026-03-01' },
  { id: 'k0000000-0000-4000-8000-000000000002', name: 'Matemática · 5º Ano', subject: 'Matemática', grade: '5º ANO', total_questions: 10, answers_json: gab(10), evaluation_id: AVALIACAO.id, status_active: true, ability: null, year: 2026, created_at: '2026-03-01' },
];
// Respostas já lançadas para parte da turma, para o relatório ter dados.
const respostas = [];
for (const chave of CHAVES) for (const al of alunos) {
  if (al.name === alunos[0].name || rnd() < 0.25) continue;
  const nivel = 0.35 + rnd() * 0.6;
  const ans = {}; let certas = 0;
  for (const [q, c] of Object.entries(chave.answers_json)) { const ok = rnd() < nivel; ans[q] = ok ? c : escolher(['A', 'B', 'C', 'D'].filter((x) => x !== c)); if (ok) certas++; }
  respostas.push({ id: `r${String(respostas.length).padStart(7, '0')}-0000-4000-8000-000000000000`, student_id: al.id, school_id: al.school_id, answer_key_id: chave.id, answers_json: ans, correct_count: certas, incorrect_count: chave.total_questions - certas, score_percentage: Math.round((certas / chave.total_questions) * 1000) / 10, corrected: true, corrected_at: '2026-11-10T12:00:00Z', corrections_json: null, not_evaluated: false, not_evaluated_reason: null, skills_performance: null, submitted_at: '2026-11-10T11:00:00Z', updated_at: '2026-11-10T12:00:00Z' });
}
const PERFIL = { id: USER_ID, name: 'Coordenação Ipê Amarelo', email: 'coordenacao@ipe.exemplo', role: 'user', school_id: ESCOLAS[0].id, escolaName: ESCOLAS[0].name, created_at: '2026-01-01' };
const TABELAS = { cities: [CIDADE], schools: ESCOLAS, students: alunos, evaluations: [AVALIACAO], answer_keys: CHAVES, student_answers: respostas, users_profile: [PERFIL], formador_allocations: [], writing_evaluations: [], writing_criteria: [], writing_sublevels: [] };

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const exp = Math.floor(Date.now() / 1000) + 86400;
const jwt = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: USER_ID, role: 'authenticated', exp, aud: 'authenticated' })}.assinatura-ficticia`;
const user = { id: USER_ID, aud: 'authenticated', role: 'authenticated', email: PERFIL.email, app_metadata: {}, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const sessao = { access_token: jwt, refresh_token: 'refresh-ficticio', token_type: 'bearer', expires_in: 86400, expires_at: exp, user };

function aplicarFiltros(linhas, params) {
  let out = [...linhas];
  for (const [k, v] of params) {
    if (['select', 'order', 'limit', 'offset', 'on_conflict', 'columns'].includes(k)) continue;
    // Filtro em tabela embutida (students.school_id=eq.X) lê o objeto aninhado já montado.
    const ler = (r) => k.split('.').reduce((o, c) => (o == null ? undefined : o[c]), r);
    const [op, ...resto] = v.split('.'); const val = resto.join('.');
    if (op === 'eq') out = out.filter((r) => String(ler(r)) === val);
    else if (op === 'in') { const xs = val.replace(/^\(|\)$/g, '').split(',').map((x) => x.replace(/^"|"$/g, '')); out = out.filter((r) => xs.includes(String(ler(r)))); }
    else if (op === 'is') out = out.filter((r) => (val === 'null' ? ler(r) == null : String(ler(r)) === val));
  }
  const ord = params.get('order');
  if (ord) { const [col, dir] = ord.split(','), [c, d] = [col.split('.')[0], (col.split('.')[1] || 'asc')]; out.sort((a, b) => String(a[c]).localeCompare(String(b[c]), 'pt-BR') * (d === 'desc' ? -1 : 1)); }
  return out;
}

function embutir(tabela, linhas, select) {
  if (!select) return linhas;
  return linhas.map((r) => {
    const o = { ...r };
    if (tabela === 'answer_keys' && /evaluations/.test(select)) o.evaluations = TABELAS.evaluations.find((e) => e.id === r.evaluation_id) || null;
    if (tabela === 'student_answers' && /students/.test(select)) { const s = alunos.find((a) => a.id === r.student_id); o.students = s ? { ...s, schools: ESCOLAS.find((e) => e.id === s.school_id) } : null; }
    if (tabela === 'student_answers' && /answer_keys/.test(select)) o.answer_keys = CHAVES.find((k) => k.id === r.answer_key_id) || null;
    if (tabela === 'students' && /schools/.test(select)) o.schools = ESCOLAS.find((e) => e.id === r.school_id) || null;
    if (tabela === 'schools' && /cities/.test(select)) o.cities = CIDADE;
    return o;
  });
}

async function prepararAnswer(ctx) {
  await ctx.addInitScript((s) => localStorage.setItem('sb-backend-auth-token', JSON.stringify(s)), sessao);
  await ctx.route(/backend\.simulado/, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const cors = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'access-control-expose-headers': '*' };
    const json = (body, status = 200, extra = {}) => route.fulfill({ status, contentType: 'application/json', headers: { ...cors, ...extra }, body: JSON.stringify(body) });
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: cors });
    if (url.pathname.startsWith('/auth/v1/user')) return json(user);
    if (url.pathname.startsWith('/auth/v1/token')) return json(sessao);
    if (url.pathname.startsWith('/auth/v1/')) return json({});
    const m = url.pathname.match(/^\/rest\/v1\/([a-z_]+)$/);
    if (!m) return json({});
    const tabela = m[1];
    if (req.method() !== 'GET' && req.method() !== 'HEAD') return json([], 201);
    // Simula o RLS do banco real: usuário de escola só enxerga a própria escola (is_school_member).
    const rls = (linhas) => (['student_answers', 'students'].includes(tabela) ? linhas.filter((r) => r.school_id === PERFIL.school_id) : linhas);
    const linhas = aplicarFiltros(embutir(tabela, rls(TABELAS[tabela] || []), url.searchParams.get('select')), url.searchParams);
    const umObjeto = (req.headers()['accept'] || '').includes('vnd.pgrst.object');
    const extra = { 'content-range': `0-${Math.max(0, linhas.length - 1)}/${linhas.length}` };
    if (req.method() === 'HEAD') return route.fulfill({ status: 200, headers: { ...cors, ...extra } });
    if (umObjeto) return linhas.length ? json(linhas[0], 200, extra) : json({ code: 'PGRST116', message: 'no rows' }, 406);
    return json(linhas, 200, extra);
  });
}

module.exports = { prepararAnswer, ESCOLAS, CHAVES, alunos };
