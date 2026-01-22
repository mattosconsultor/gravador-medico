# ✅ SOLUÇÃO FINAL - Profile Pictures WhatsApp

## 🎯 Problema Resolvido

Após **7 tentativas** de diferentes endpoints da Evolution API, finalmente identificamos o endpoint correto que retorna `profilePicUrl`.

---

## 📸 Endpoint Correto (VALIDADO via Terminal)

```bash
POST /chat/findContacts/{instance}
```

### Request
```json
{
  "number": "5521988960217"
}
```

### Response
```json
[
  {
    "id": "cmkoihkmx000tp15l4aqlhvzf",
    "remoteJid": "5521988960217@s.whatsapp.net",
    "pushName": "Helcio Mattos",
    "profilePicUrl": "https://pps.whatsapp.net/v/t61.24694-24/491867936_2494348990932423_439212641060988894_n.jpg?ccb=11-4&oh=01_Q5Aa3gFVVWxeV7FjxqOCilK9U3OBnpc9-RZP5MIXntvNggY8RA&oe=697E73B5&_nc_sid=5e03e0&_nc_cat=104",
    "createdAt": "2026-01-21T21:04:58.041Z",
    "updatedAt": "2026-01-22T00:14:29.810Z",
    "instanceId": "2dc4c8ab-6e5a-4d1e-b207-725d72d8dd1f",
    "isGroup": false,
    "isSaved": true,
    "type": "contact"
  }
]
```

---

## 🔄 Histórico de Tentativas

| # | Endpoint | Método | Body/Query | Status | Motivo |
|---|----------|--------|------------|--------|---------|
| 1 | `/chat/fetchProfilePicture` | POST | `{"number": "5521988960217"}` | ❌ 404 | Endpoint não existe |
| 2 | `/chat/findContacts` | GET | `?where[remoteJid]=xxx@s.whatsapp.net` | ❌ 404 | Query parameter incorreto |
| 3 | `/contact/checkNumbers` | POST | `{"numbers": ["5521988960217"]}` | ❌ 404 | Endpoint não existe |
| 4 | `/chat/fetchProfilePicture` | POST | `{"number": "5521988960217"}` | ❌ 404 | Endpoint não existe |
| 5 | `/chat/findPicture` | POST | `{"number": "5521988960217@s.whatsapp.net"}` | ❌ 404 | Endpoint não existe |
| 6 | `/chat/findContacts/{instance}` | GET | `?number=5521988960217` | ❌ 404 | Método incorreto (GET) |
| 7 | `/chat/findContacts/{instance}` | POST | `{"number": "5521988960217"}` | ✅ 200 | **FUNCIONA!** |

---

## 💻 Implementação Final

### Webhook (`app/api/webhooks/whatsapp/route.ts`)

```typescript
async function fetchProfilePicture(
  remoteJid: string, 
  messagePayload?: any
): Promise<string | null> {
  try {
    const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL
    const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY
    const EVOLUTION_INSTANCE_NAME = process.env.EVOLUTION_INSTANCE_NAME

    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY || !EVOLUTION_INSTANCE_NAME) {
      return null
    }

    // Extrair apenas o número (sem @s.whatsapp.net)
    const phoneNumber = remoteJid.split('@')[0]
    const url = `${EVOLUTION_API_URL}/chat/findContacts/${EVOLUTION_INSTANCE_NAME}`
    const requestBody = { number: phoneNumber }
    
    console.log(`📸 [DEBUG FOTO] URL: ${url}`)
    console.log(`📸 [DEBUG FOTO] Body: ${JSON.stringify(requestBody)}`)
    
    // Timeout de 5 segundos
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': EVOLUTION_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error(`❌ [DEBUG FOTO] ERRO HTTP ${response.status}`)
      return null
    }

    const data = await response.json()
    const contacts = Array.isArray(data) ? data : (data ? [data] : [])
    
    if (contacts.length === 0) {
      return null
    }
    
    // Pegar profilePicUrl do primeiro contato
    const photoUrl = contacts[0].profilePicUrl || null
    
    if (photoUrl) {
      console.log(`✅ [DEBUG FOTO] Foto encontrada: ${photoUrl.substring(0, 50)}...`)
      return photoUrl
    }

    return null
    
  } catch (error) {
    console.error('❌ [DEBUG FOTO] Erro ao buscar:', error)
    return null
  }
}
```

---

## 🧪 Teste via Terminal

```bash
chmod +x scripts/test-findcontacts-post.sh
./scripts/test-findcontacts-post.sh 5521988960217
```

**Resultado Esperado:**
```json
✅ HTTP 200
✅ Array de contatos com profilePicUrl preenchido
```

---

## 🔍 Validação no Vercel

Após receber uma mensagem, verificar logs:

```
📸 [DEBUG FOTO] URL: https://evolution-api-production-eb21.up.railway.app/chat/findContacts/whatsapp-principal
📸 [DEBUG FOTO] Body: {"number":"5521988960217"}
📸 [DEBUG FOTO] Status HTTP: 200
✅ [DEBUG FOTO] Foto encontrada: https://pps.whatsapp.net/v/t61.24694-24/4918...
✅ [CONTATO] Contato criado/atualizado com sucesso
```

---

## 📊 Banco de Dados

### Tabela: `whatsapp_contacts`

```sql
SELECT 
  remote_jid,
  push_name,
  profile_picture_url,
  updated_at
FROM whatsapp_contacts
WHERE remote_jid = '5521988960217@s.whatsapp.net';
```

**Resultado Esperado:**
```
remote_jid                       | push_name      | profile_picture_url                              | updated_at
---------------------------------|----------------|--------------------------------------------------|-------------------
5521988960217@s.whatsapp.net     | Helcio Mattos  | https://pps.whatsapp.net/v/t61.24694-24/491...   | 2026-01-22 00:14:29
```

---

## ⚡ Realtime (Supabase)

### Verificação no Console do Navegador

Após receber mensagem, deve aparecer:

```javascript
// Log do Realtime
{
  eventType: 'UPDATE',
  table: 'whatsapp_contacts',
  new: {
    remote_jid: '5521988960217@s.whatsapp.net',
    push_name: 'Helcio Mattos',
    profile_picture_url: 'https://pps.whatsapp.net/v/t61.24694-24/491...',
    updated_at: '2026-01-22T00:14:29.810Z'
  }
}
```

### UI Atualiza Automaticamente

O `ContactList` já está inscrito no Realtime. Quando o banco atualizar `profile_picture_url`, a foto aparece **INSTANTANEAMENTE** sem precisar recarregar a página.

---

## 🎯 Checklist Final

- [x] Endpoint correto identificado via terminal
- [x] Webhook atualizado para POST com body JSON
- [x] Logs DEBUG expandidos
- [x] Script de teste criado (`test-findcontacts-post.sh`)
- [x] Commit e push para produção (fd106b2)
- [x] Supabase Realtime configurado
- [x] RLS desativado
- [x] Publications ativas
- [ ] **Aguardar próxima mensagem para validar foto na UI**

---

## 🚀 Próximos Passos

1. **Enviar uma mensagem** para o WhatsApp
2. **Verificar logs** no Vercel → Procurar por `[DEBUG FOTO]`
3. **Conferir banco** → Supabase → Table Editor → whatsapp_contacts
4. **Validar UI** → Dashboard WhatsApp → Foto deve aparecer automaticamente

---

## 📝 Commits Relacionados

- `fd106b2` - fix: corrigir endpoint para POST /chat/findContacts com body JSON
- `2088b68` - fix: usar GET /chat/findContacts (TENTATIVA 6 - 404)
- Commits anteriores: Tentativas 1-5 (todos com 404)

---

## ✅ Confirmação de Funcionamento

**Teste via curl:**
```bash
curl -X POST \
  "https://evolution-api-production-eb21.up.railway.app/chat/findContacts/whatsapp-principal" \
  -H "apikey: Beagle3005" \
  -H "Content-Type: application/json" \
  -d '{"number": "5521988960217"}' | jq '.[0].profilePicUrl'
```

**Saída:**
```
"https://pps.whatsapp.net/v/t61.24694-24/491867936_2494348990932423_439212641060988894_n.jpg?ccb=11-4&oh=01_Q5Aa3gFVVWxeV7FjxqOCilK9U3OBnpc9-RZP5MIXntvNggY8RA&oe=697E73B5&_nc_sid=5e03e0&_nc_cat=104"
```

✅ **ENDPOINT CONFIRMADO E FUNCIONANDO!**
