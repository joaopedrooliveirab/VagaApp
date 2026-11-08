const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
  });
  module._compile(outputText, filename);
};

const { createCompanyStore } = require('../src/features/companies/accounts.ts');
const { loginAdminMock, loginMock } = require('../src/features/auth/auth.ts');
const { getCompanyJobs } = require('../src/features/companies/jobs.ts');
const { ensureConversation, visibleConversations } = require('../src/features/conversations/conversations.ts');

const admin = loginAdminMock({ email: 'admin@teia.com', password: 'teia123' }).user;
const student = loginMock({ email: 'aluno@test.com', password: '123456' }).user;
const data = {
  companyName: '  Nova empresa  ', responsibleName: '  Maria  ',
  email: '  NOVA@TEST.COM  ', password: '  senha123  ', confirmPassword: '  senha123  ',
};
const credentials = { email: 'nova@test.com', password: data.password };

test('valida todos os campos antes de criar a solicitação', () => {
  const store = createCompanyStore();
  for (const key of Object.keys(data)) {
    assert.equal(store.request({ ...data, [key]: '' }).ok, false, key);
  }
  for (const invalid of [
    { companyName: '   ' }, { responsibleName: '   ' }, { email: 'inválido' },
    { password: '12345', confirmPassword: '12345' },
    { password: '      ', confirmPassword: '      ' }, { confirmPassword: 'diferente' },
  ]) {
    assert.equal(store.request({ ...data, ...invalid }).ok, false);
  }
  assert.equal(store.getSnapshot().length, 1);
});

test('normaliza nomes e e-mail, recusa duplicidade e ignora perfis/situações externos', () => {
  const store = createCompanyStore();
  assert.equal(store.request({ ...data, role: 'administrativo', status: 'approved' }).ok, true);
  const company = store.getSnapshot()[1];
  assert.equal(company.name, 'Nova empresa');
  assert.equal(company.responsibleName, 'Maria');
  assert.equal(company.email, 'nova@test.com');
  assert.equal(company.status, 'pending');
  assert.ok(Number.isFinite(Date.parse(company.requestedAt)));
  assert.equal(company.approvedAt, undefined);
  assert.equal(store.request({ ...data, email: 'nova@test.com' }).ok, false);
  assert.equal(store.request({ ...data, email: ' EMPRESA@TEST.COM ' }).ok, false);
  assert.equal(store.getSnapshot().length, 2);
});

test('confere a senha antes de informar pendência e preserva espaços da credencial', () => {
  const store = createCompanyStore();
  store.request(data);
  const wrong = store.login({ ...credentials, password: data.password.trim() });
  assert.equal(wrong.ok, false);
  assert.equal(wrong.message, 'E-mail ou senha incorretos.');
  const pending = store.login(credentials);
  assert.equal(pending.ok, false);
  assert.match(pending.message, /aguardando aprovação/);
  assert.equal('user' in pending, false);
});

test('somente TEIA aprova, sem alterar sua identidade ou duplicar registros', () => {
  const store = createCompanyStore();
  store.request(data);
  const id = store.getSnapshot()[1].id;
  const companyUser = store.login({ email: 'empresa@test.com', password: '123456' }).user;
  const before = store.getSnapshot();
  for (const actor of [null, student, companyUser]) assert.equal(store.approve(id, actor).ok, false);
  assert.equal(store.getSnapshot(), before);
  const originalAdmin = { ...admin };
  assert.equal(store.approve('inexistente', admin).ok, false);
  assert.equal(store.approve(id, admin).ok, true);
  const approved = store.getSnapshot()[1];
  assert.equal(approved.id, id);
  assert.equal(approved.status, 'approved');
  assert.ok(Number.isFinite(Date.parse(approved.approvedAt)));
  assert.deepEqual(admin, originalAdmin);
  assert.equal(store.approve(id, admin).ok, false);
  assert.equal(store.getSnapshot().length, 2);
  assert.equal(store.getSnapshot()[1].approvedAt, approved.approvedAt);
});

test('conta aprovada pode autenticar repetidamente, com sessão pública sem credenciais', () => {
  const store = createCompanyStore();
  store.request(data);
  store.approve(store.getSnapshot()[1].id, admin);
  const first = store.login(credentials);
  assert.equal(first.ok, true);
  assert.equal(first.user.role, 'empresa');
  assert.equal(first.user.name, 'Maria');
  assert.equal(first.user.companyId, store.getSnapshot()[1].id);
  assert.equal(first.user.email, 'nova@test.com');
  assert.deepEqual(Object.keys(first.user).sort(), ['companyId', 'email', 'id', 'name', 'role']);
  const originalIdentity = { ...first.user };
  first.user.name = 'Alteração somente na sessão';
  assert.equal(store.getSnapshot()[1].responsibleName, 'Maria');
  loginAdminMock({ email: 'admin@teia.com', password: 'teia123' });
  const again = store.login(credentials);
  assert.deepEqual(again.user, originalIdentity);
  for (const company of store.getSnapshot()) {
    assert.equal('password' in company, false);
    assert.equal('confirmPassword' in company, false);
  }
});

test('nova empresa não herda vagas ou conversas, e Nimbus mantém seu acesso', () => {
  const store = createCompanyStore();
  store.request(data);
  store.approve(store.getSnapshot()[1].id, admin);
  const fresh = store.login(credentials).user;
  const nimbus = store.login({ email: ' EMPRESA@TEST.COM ', password: '123456' }).user;
  assert.deepEqual(getCompanyJobs(fresh.companyId), []);
  assert.equal(getCompanyJobs(nimbus.companyId).length, 3);
  const job = getCompanyJobs(nimbus.companyId)[0];
  const conversations = ensureConversation([], nimbus, job.id, new Date().toISOString());
  assert.equal(visibleConversations(conversations, nimbus).length, 1);
  assert.deepEqual(visibleConversations(conversations, fresh), []);
  assert.equal(ensureConversation(conversations, fresh, job.id, new Date().toISOString()), conversations);
});

test('solicitações independentes têm IDs distintos e aprovação isolada', () => {
  const store = createCompanyStore();
  store.request(data);
  store.request({ ...data, email: 'outra@test.com' });
  const [, first, second] = store.getSnapshot();
  assert.notEqual(first.id, second.id);
  store.approve(first.id, admin);
  assert.equal(store.login(credentials).ok, true);
  assert.equal(store.login({ ...credentials, email: second.email }).ok, false);
});

test('assinantes recebem atualizações imediatas; reinício descarta contas temporárias', () => {
  const store = createCompanyStore();
  let updates = 0;
  const unsubscribe = store.subscribe(() => { updates++; });
  store.request(data);
  store.approve(store.getSnapshot()[1].id, admin);
  store.approve(store.getSnapshot()[1].id, admin);
  assert.equal(updates, 2);
  unsubscribe();
  store.request({ ...data, email: 'outra@test.com' });
  assert.equal(updates, 2);
  const restarted = createCompanyStore();
  assert.equal(restarted.login(credentials).ok, false);
  assert.equal(restarted.getSnapshot().length, 1);
  assert.equal(restarted.login({ email: 'empresa@test.com', password: '123456' }).ok, true);
});
