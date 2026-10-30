const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');

// Usa o TypeScript já instalado para testar as regras puras, sem novo framework.
require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const { loginCompanyMock, loginAdminMock, loginMock, registerMock } = require('../src/features/auth/auth.ts');
const { companies } = require('../src/features/companies/companies.ts');
const { getCompanyJobs, getCompanyJobById } = require('../src/features/companies/jobs.ts');
const { jobs } = require('../src/features/jobs/jobs.ts');
const {
  ensureConversation, appendMessage, visibleConversations, conversationIdFor, conversationReducer,
} = require('../src/features/conversations/conversations.ts');

const company = loginCompanyMock({ email: 'empresa@test.com', password: '123456' }).user;
const admin = loginAdminMock({ email: 'admin@teia.com', password: 'teia123' }).user;
const student = loginMock({ email: 'aluno@test.com', password: '123456' }).user;
const otherCompany = { ...company, id: 'outra-equipe', companyId: 'orbita-sistemas' };
const jobId = 'estagio-analise-de-dados';
const otherJobId = 'nimbus-estagio-bi';
const now = '2026-10-30T12:00:00.000Z';
const later = '2026-10-30T12:05:00.000Z';
const id = conversationIdFor(company.companyId, jobId);
const open = () => ensureConversation([], company, jobId, now);

test('login da empresa valida campos e credenciais e normaliza e-mail', () => {
  assert.equal(loginCompanyMock({ email: '', password: '' }).ok, false);
  assert.equal(loginCompanyMock({ email: 'invalido', password: '123456' }).ok, false);
  assert.equal(loginCompanyMock({ email: company.email, password: 'errada' }).ok, false);
  assert.equal(loginCompanyMock({ email: admin.email, password: 'teia123' }).ok, false);
  const result = loginCompanyMock({ email: ' EMPRESA@TEST.COM ', password: '123456' });
  assert.equal(result.ok, true);
  assert.equal(result.user.companyId, 'nimbus-analytics');
  assert.equal(result.user.role, 'empresa');
});

test('cadastro público não concede perfil privilegiado mesmo com campos adicionais', () => {
  const result = registerMock({ name: 'Teste', email: 'novo@test.com', password: '123456',
    confirmPassword: '123456', role: 'administrativo', companyId: company.companyId });
  assert.equal(result.ok, true);
  assert.equal(result.user.role, 'aluno');
  assert.equal('companyId' in result.user, false);
});

test('catálogo do aluno mantém quatro vagas e empresas e situações válidas', () => {
  assert.equal(jobs.length, 4);
  assert.ok(jobs.every((job) => job.publicationStatus === 'published'));
  assert.ok(jobs.every((job) => companies.some((item) => item.id === job.companyId && item.name === job.company)));
  const ownJobs = getCompanyJobs(company.companyId);
  assert.equal(ownJobs.length, 3);
  assert.ok(ownJobs.every((job) => job.companyId === company.companyId));
  assert.deepEqual(new Set(ownJobs.map((job) => job.publicationStatus)), new Set(['published', 'review', 'closed']));
  assert.equal(getCompanyJobs('inexistente').length, 0);
});

test('abrir novamente não duplica nem apaga o histórico', () => {
  const initial = [];
  let state = ensureConversation(initial, company, jobId, now);
  state = appendMessage(state, company, id, 'Mensagem inicial', now);
  const reopened = ensureConversation(state, company, jobId, later);
  assert.equal(reopened, state);
  assert.equal(state.length, 1);
  assert.equal(state[0].messages.length, 1);
  assert.equal(initial.length, 0);
});

test('aberturas consecutivas processadas pelo reducer resultam em uma conversa', () => {
  const action = { type: 'open', user: company, jobId, now };
  const state = conversationReducer(conversationReducer([], action), action);
  assert.equal(state.length, 1);
  assert.equal(state[0].id, id);
});

test('somente a empresa proprietária abre sua vaga e referências inválidas são recusadas', () => {
  const initial = [];
  for (const user of [null, student, admin, otherCompany]) {
    assert.equal(ensureConversation(initial, user, jobId, now), initial);
  }
  assert.equal(ensureConversation(initial, company, 'inexistente', now), initial);
  assert.equal(ensureConversation(initial, company, 'estagio-backend-java', now), initial);
  assert.equal(getCompanyJobById('inexistente'), undefined);
});

test('mensagens vazias e de perfis sem acesso não alteram o estado', () => {
  const state = open();
  for (const text of ['', '   ', '\n\t']) {
    assert.equal(appendMessage(state, company, id, text, now), state);
  }
  for (const user of [null, student, otherCompany]) {
    assert.equal(appendMessage(state, user, id, 'Tentativa', now), state);
  }
  assert.equal(appendMessage(state, admin, 'inexistente', 'Tentativa', now), state);
});

test('empresa envia e TEIA responde na mesma coleção, sem mutar o histórico anterior', () => {
  const initial = open();
  const first = appendMessage(initial, company, id, '  Olá!\nPodem revisar a vaga?  ', now);
  const second = appendMessage(first, admin, id, 'Vamos revisar os requisitos.', later);
  assert.equal(initial[0].messages.length, 0);
  assert.equal(first[0].messages.length, 1);
  assert.equal(second[0].messages.length, 2);
  const [sent, reply] = second[0].messages;
  assert.equal(sent.text, 'Olá!\nPodem revisar a vaga?');
  assert.equal(sent.senderId, company.id);
  assert.equal(sent.senderName, company.name);
  assert.equal(sent.senderRole, 'empresa');
  assert.equal(sent.conversationId, id);
  assert.equal(reply.senderName, admin.name);
  assert.equal(reply.senderRole, 'administrativo');
  assert.equal(reply.sentAt, later);
  assert.notEqual(sent.id, reply.id);
  assert.equal(second[0].updatedAt, later);
});

test('trocar de perfil filtra o acesso e preserva as mensagens na mesma execução', () => {
  let state = appendMessage(open(), company, id, 'Olá TEIA', now);
  assert.deepEqual(visibleConversations(state, null), []);
  assert.deepEqual(visibleConversations(state, student), []);
  assert.deepEqual(visibleConversations(state, otherCompany), []);
  assert.equal(visibleConversations(state, admin)[0].messages[0].text, 'Olá TEIA');
  state = appendMessage(state, admin, id, 'Olá empresa', later);
  assert.equal(visibleConversations(state, company)[0].messages[1].text, 'Olá empresa');
});

test('vagas diferentes mantêm históricos separados e são ordenadas pela última atividade', () => {
  let state = ensureConversation(open(), company, otherJobId, later);
  const otherId = conversationIdFor(company.companyId, otherJobId);
  state = appendMessage(state, company, otherId, 'Sobre BI', later);
  assert.equal(state.find((item) => item.id === id).messages.length, 0);
  assert.equal(visibleConversations(state, admin)[0].id, otherId);
  state = appendMessage(state, admin, id, 'Sobre dados', '2026-10-30T12:10:00.000Z');
  const before = state.map((item) => item.id);
  assert.equal(visibleConversations(state, company)[0].id, id);
  assert.deepEqual(state.map((item) => item.id), before);
});

test('TEIA vê conversas de empresas diferentes e cada empresa vê apenas as suas', () => {
  let state = ensureConversation(open(), otherCompany, 'estagio-backend-java', later);
  assert.equal(visibleConversations(state, admin).length, 2);
  assert.equal(visibleConversations(state, company).length, 1);
  assert.equal(visibleConversations(state, otherCompany).length, 1);
  const foreignId = conversationIdFor(otherCompany.companyId, 'estagio-backend-java');
  state = appendMessage(state, company, foreignId, 'Acesso indevido', later);
  assert.equal(state.find((item) => item.id === foreignId).messages.length, 0);
});

test('referências inconsistentes entre empresa e vaga não ficam acessíveis', () => {
  const corrupted = [{ ...open()[0], companyId: 'orbita-sistemas' }];
  assert.deepEqual(visibleConversations(corrupted, admin), []);
  assert.equal(appendMessage(corrupted, admin, id, 'Tentativa', later), corrupted);
});
