# 🔍 Guia de Debug - Payload WhatsApp

## ✅ Deploy Realizado (commit e1877b6)

Os logs de debug foram adicionados e já estão em produção na Vercel.

---

## 📋 Próximos Passos

### 1️⃣ Enviar Mensagem de Teste

**Envie uma mensagem** para o WhatsApp conectado à Evolution API.

Pode ser:
- ✅ Mensagem de texto simples
- ✅ De um contato privado (não grupo)
- ✅ Pode ser de qualquer número (não precisa ser o seu)

### 2️⃣ Ver Logs na Vercel

1. Acesse: https://vercel.com/seu-projeto
2. Vá em: **Deployments** → **Functions** → **Logs**
3. Procure por: `[DEBUG KEY]`
4. Você verá algo assim:

```
============================================================
[DEBUG KEY] PAYLOAD COMPLETO:
{
  "event": "messages.upsert",
  "instance": "whatsapp-principal",
  "data": {
    "key": {
      "remoteJid": "5521988960217@s.whatsapp.net",
      "fromMe": false,
      "id": "...",
      "participant": "..."  // <-- CAMPO CRÍTICO
    },
    "pushName": "Nome da Pessoa",
    "message": { ... },
    ...
  }
}
============================================================
[DEBUG KEY] key: { "remoteJid": "...", "fromMe": false, "participant": "..." }
[DEBUG FOTO] remoteJid: 5521988960217@s.whatsapp.net
[DEBUG FOTO] participant: undefined (ou um número)
[DEBUG FOTO] fromMe: false
[DEBUG FOTO] É grupo? false
============================================================
```

### 3️⃣ Copiar e Colar Aqui

**COPIE EXATAMENTE** o bloco entre os `====` e cole aqui para o Claude.

Exemplo do que copiar:

```
[DEBUG KEY] key: {"remoteJid":"5521988960217@s.whatsapp.net","fromMe":false,"id":"3EB..."}
[DEBUG FOTO] remoteJid: 5521988960217@s.whatsapp.net
[DEBUG FOTO] participant: undefined
[DEBUG FOTO] fromMe: false
[DEBUG FOTO] É grupo? false
```

---

## 🎯 O Que Vamos Descobrir

Com esses logs, saberemos:

### ✅ Se `participant` existe
- **undefined** → Mensagem privada (usar `remoteJid`)
- **"5521988960217@s.whatsapp.net"** → Mensagem de grupo (usar `participant`)

### ✅ Se `fromMe` está correto
- **true** → Mensagem enviada pelo robô (IGNORAR foto ou buscar destinatário)
- **false** → Mensagem recebida (buscar foto do remetente)

### ✅ Estrutura real do payload
- Confirmar se campos extras existem
- Ver se `profilePicUrl` já vem no payload
- Validar formato exato dos dados

---

## 🔧 Correções Já Aplicadas (Aguardando Validação)

### 1. Type atualizado
```typescript
key: {
  remoteJid: string
  fromMe: boolean
  id: string
  participant?: string  // ✅ ADICIONADO
}
```

### 2. Lógica de identificação
```typescript
const isGroup = remoteJid.includes('@g.us')
const actualSenderJid = isGroup && participant ? participant : remoteJid
const phoneNumber = actualSenderJid.split('@')[0]
```

### 3. Busca específica (não pega primeiro)
```typescript
const targetContact = contacts.find(c => c.remoteJid === actualSenderJid)
// ANTES: contacts[0] (sempre o robô)
// AGORA: Busca o contato correto
```

---

## ⚡ Teste Rápido

Se quiser testar **AGORA MESMO**:

1. Abra o WhatsApp
2. Envie **UMA** mensagem de texto para o número conectado
3. Espere 5 segundos
4. Abra Vercel → Logs
5. Procure `[DEBUG KEY]`
6. Copie e cole aqui

---

## 📊 Casos Possíveis

### Caso 1: Mensagem Privada Recebida
```json
{
  "remoteJid": "5521999999999@s.whatsapp.net",
  "fromMe": false,
  "participant": undefined
}
```
**Ação:** Buscar foto de `5521999999999`

### Caso 2: Mensagem de Grupo Recebida
```json
{
  "remoteJid": "120363401670357347@g.us",
  "fromMe": false,
  "participant": "5521999999999@s.whatsapp.net"
}
```
**Ação:** Buscar foto de `5521999999999` (participant)

### Caso 3: Mensagem Enviada pelo Robô
```json
{
  "remoteJid": "5521999999999@s.whatsapp.net",
  "fromMe": true
}
```
**Ação:** Ignorar ou buscar foto do destinatário

### Caso 4: Foto do Robô Carregou
```json
{
  "remoteJid": "5521988960217@s.whatsapp.net",  // SEU NÚMERO
  "fromMe": false
}
```
**Problema:** Está buscando foto da instância
**Solução:** Verificar se `remoteJid` é o número da instância (ignorar)

---

## 🚀 Depois de Colar os Logs

O Claude vai:

1. ✅ Analisar a estrutura real
2. ✅ Identificar qual campo usar
3. ✅ Ajustar o código se necessário
4. ✅ Fazer novo deploy
5. ✅ Testar novamente

---

## 📝 Commit Atual

```
e1877b6 - debug: adicionar logs completos do payload para identificar estrutura real
```

**Status:** ✅ Deployed na Vercel
**Aguardando:** 📨 Você enviar mensagem e colar os logs aqui

---

## ⏰ Tempo Estimado

- Enviar mensagem: **10 segundos**
- Abrir Vercel Logs: **30 segundos**
- Copiar e colar: **20 segundos**
- **Total: ~1 minuto**

Depois disso, ajustamos o código com 100% de certeza! 🎯
