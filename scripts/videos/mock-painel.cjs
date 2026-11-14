// Backend simulado do Painel de Resultados: Auth, PostgREST e Storage do Supabase.
// Responde com o snapshot fictício gerado em painel-demo/. Nada sai para a internet.
const fs = require('fs');
const path = require('path');

const DEMO = path.join(__dirname, 'painel-demo');
const USER_ID = '00000000-0000-4000-8000-00000000c0de';
const MUNICIPIO_ID = '00000000-0000-4000-8000-0000000000a1';
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const exp = Math.floor(Date.now() / 1000) + 3600 * 24;
const jwt = `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: USER_ID, role: 'authenticated', exp, aud: 'authenticated', email: 'gestao@valeverde.exemplo' })}.assinatura-ficticia`;
const user = { id: USER_ID, aud: 'authenticated', role: 'authenticated', email: 'gestao@valeverde.exemplo', app_metadata: { provider: 'email' }, user_metadata: {}, created_at: '2026-01-01T00:00:00Z' };
const sessao = { access_token: jwt, refresh_token: 'refresh-ficticio', token_type: 'bearer', expires_in: 86400, expires_at: exp, user };
const perfil = { user_id: USER_ID, nome: 'Gestão Vale Verde', papel: 'secretaria', municipio_id: MUNICIPIO_ID, escola_id: null, ativo: true, ultimo_acesso: null, painel_escolas: null };

async function prepararPainel(ctx) {
  await ctx.addInitScript((s) => localStorage.setItem('sb-backend-auth-token', JSON.stringify(s)), sessao);
  await ctx.route(/backend\.simulado/, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' } });
    if (url.pathname.startsWith('/auth/v1/user')) return json(user);
    if (url.pathname.startsWith('/auth/v1/token')) return json(sessao);
    if (url.pathname.startsWith('/auth/v1/')) return json({});
    const sto = url.pathname.match(/^\/storage\/v1\/object\/(?:authenticated\/)?resultados\/(.+)$/);
    if (sto) {
      const arq = path.join(DEMO, 'resultados', decodeURIComponent(sto[1]));
      if (fs.existsSync(arq)) return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: fs.readFileSync(arq) });
      return json({ statusCode: '404', error: 'not_found', message: 'Object not found' }, 400);
    }
    if (url.pathname === '/rest/v1/painel_perfis') {
      if (req.method() !== 'GET') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } });
      const umObjeto = (req.headers()['accept'] || '').includes('vnd.pgrst.object');
      return json(umObjeto ? perfil : [perfil]);
    }
    if (url.pathname === '/rest/v1/painel_publicacoes') {
      return json([{ id: 'pub-1', avaliacao_id: '00000000-0000-4000-8000-0000000000b1', municipio_id: MUNICIPIO_ID, pasta: 'vale-verde/2026-diagnostica-5ano-caderno-2', titulo: 'CADERNO 2', serie: '5º Ano', ano_letivo: 2026, status: 'entregue', versao: 1, geracao: '3b9d6c1e-5a2f-4e8b-9c7d-1f0a2b3c4d5e', gerado_em: '2026-11-10T14:00:00Z', entregue_em: '2026-11-11T10:00:00Z', created_at: '2026-11-10T14:00:00Z', metodologia: null, etapa_ordem: null, painel_municipios: { nome: 'Vale Verde', slug: 'vale-verde', logo_url: null } }]);
    }
    if (url.pathname.startsWith('/rest/v1/')) return json([]);
    return json({});
  });
}

module.exports = { prepararPainel, GERACAO: '3b9d6c1e-5a2f-4e8b-9c7d-1f0a2b3c4d5e' };
