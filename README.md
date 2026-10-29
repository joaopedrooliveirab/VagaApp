# Descrição do projeto
Aqui será feito a descrição do projeto e o que ele vai atender

## Como rodar

Requisitos: Node.js 20+ e o app **Expo Go** no celular (ou um emulador Android/iOS).

```bash
npm install        # instala as dependências
npm start          # inicia o servidor Expo (escaneie o QR code com o Expo Go)
npm run android    # abre no emulador Android
npm run ios        # abre no simulador iOS (somente macOS)
npm run web        # abre no navegador
```

O `npm start` também sobe a rota de análise (`/api/analisar`). Celular e
computador precisam estar na mesma rede Wi-Fi.

### Ligar a IA (Claude)

Sem configuração, o app funciona em **modo de exemplo**: o resultado é um
cenário predefinido e o PDF não é lido. Para a análise real:

1. Copie `.env.example` para `.env.local`.
2. Preencha `ANTHROPIC_API_KEY` com a sua chave (https://console.anthropic.com).
3. Reinicie o `npm start`.

A chave fica só no servidor. Nunca use o prefixo `EXPO_PUBLIC_` nela: ele a
embutiria dentro do aplicativo, e qualquer pessoa conseguiria extraí-la.

## Como a análise funciona

1. A pessoa escolhe uma vaga e um PDF de currículo e, na revisão, **autoriza o
   envio**. A tela avisa se a análise será por IA (e qual modelo) ou de exemplo.
2. O app envia o PDF e o identificador da vaga para `POST /api/analisar`.
   O servidor confere que é um PDF de até 5 MB e que a vaga existe.
3. O servidor manda o PDF para a IA junto com os dados da vaga. O Claude lê o
   documento diretamente (texto e páginas) e, para **cada competência da vaga**,
   responde:
   - `evidenciada`: há projeto, experiência, curso ou resultado concreto;
   - `mencionada`: aparece listada, sem detalhe que comprove o uso;
   - `nao_identificada`: não aparece no currículo;
   e cita o trecho que sustenta a resposta (sem dados pessoais). Também escreve
   3 sugestões de melhoria para aquela vaga.
4. A resposta tem formato fixo (JSON Schema) e passa por uma validação no
   servidor: só valem competências da vaga, textos têm tamanho limitado, e
   competência não devolvida conta como `nao_identificada`.
5. **A compatibilidade é calculada por código, não pela IA**: média das
   competências, com `evidenciada = 1`, `mencionada = 0,5` e
   `nao_identificada = 0` (`src/features/analysis/score.ts`). Assim a nota é
   explicável e não depende de a IA "chutar" um número.
6. O app mostra pontos fortes (com o trecho citado), lacunas, sugestões e um
   bloco "Como esta análise foi feita" com a conta daquele resultado.

Cuidados com o conteúdo do PDF: ele é tratado como dado, nunca como instrução
(o prompt manda ignorar pedidos escritos no currículo), o servidor não guarda o
arquivo, e a IA é instruída a responder "não identificado" em vez de afirmar
que a pessoa não tem a competência. A compatibilidade não representa
probabilidade de contratação.

## Trocar o modelo ou o fornecedor de IA

Tudo fica em `src/server/llm/` e é escolhido por variáveis do `.env.local`:

| Quero | Faça |
| --- | --- |
| Trocar o modelo do Claude | `LLM_MODEL=claude-sonnet-5-5` (ou `claude-haiku-5-5`, `claude-opus-5-5`...) |
| Voltar ao modo de exemplo | `LLM_PROVIDER=mock` |
| Usar outro fornecedor | Crie `src/server/llm/<nome>.ts` implementando `LlmProvider` (veja `anthropic.ts`), registre em `index.ts` e use `LLM_PROVIDER=<nome>` |

O prompt, o esquema da resposta e a validação (`prompt.ts`) são os mesmos para
qualquer fornecedor: um novo provedor só precisa chamar a sua API e devolver o
resultado já validado por `parseAssessment`.

O modelo padrão é `claude-opus-5-5`. Modelos menores custam menos e respondem
mais rápido; vale comparar a qualidade nos seus currículos antes de trocar.

## Acessos de teste

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Aluno | `aluno@test.com` | `123456` |
| Administrativo (TEIA) | `admin@teia.com` | `teia123` |

O acesso administrativo fica em **Acessar área administrativa**, na tela de
login do aluno. Também é possível criar uma conta de aluno pelo cadastro.

## O que é demonstrativo

As vagas, o login e os números do painel TEIA são dados fictícios locais. A
análise do currículo é real quando há chave de IA configurada.

## Antes de publicar

- O login é simulado (usuário em memória) e a rota `/api/analisar` não exige
  autenticação: quem alcançar o servidor poderia gastar créditos da sua chave.
  Antes de publicar, proteja a rota (login real e limite de uso por pessoa).
- Para publicar o servidor (rota de análise) use EAS Hosting
  (`npx expo export --platform web` e `npx eas-cli@latest deploy`) e defina
  `origin` no plugin `expo-router` do `app.json`. As variáveis do `.env.local`
  precisam ser cadastradas no serviço de hospedagem.
- Currículos têm dados pessoais (LGPD): informe a finalidade e a retenção, e
  confira a política de dados do fornecedor de IA usado.

## Qualidade de código

```bash
npm run lint       # ESLint (eslint-config-expo)
npm run typecheck  # TypeScript (tsc --noEmit)
npx expo-doctor    # diagnóstico de dependências e configuração
```
