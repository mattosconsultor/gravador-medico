# 🔧 Correção: Foreign Key Constraint WhatsApp Webhook

## ❌ Problema Anterior

**Erro:** `Foreign Key Constraint (Code 23503)`
```
Key (remote_jid)=(5521988960217@s.whatsapp.net) is not present in table "whatsapp_contacts"
```

### Causa Raiz
O webhook estava tentando inserir mensagens na tabela `whatsapp_messages` **antes** de garantir que o contato existia na tabela `whatsapp_contacts`.

Como existe uma foreign key constraint:
```sql
ALTER TABLE whatsapp_messages 
  ADD CONSTRAINT fk_whatsapp_messages_contact 
  FOREIGN KEY (remote_jid) 
  REFERENCES whatsapp_contacts(remote_jid) 
  ON DELETE CASCADE;
```

O PostgreSQL rejeitava o INSERT porque o `remote_jid` não existia na tabela referenciada.

---

## ✅ Solução Implementada

### Ordem Correta de Execução

**Arquivo:** `app/api/webhooks/whatsapp/route.ts`

```typescript
// ================================================================
// PASSO 1: UPSERT do contato PRIMEIRO (resolver FK constraint)
// ================================================================
console.log('🔄 Criando/atualizando contato primeiro...')
await upsertWhatsAppContact({
  remote_jid: key.remoteJid,
  push_name: pushName || undefined,
  is_group: key.remoteJid.includes('@g.us')
})
console.log('✅ Contato garantido:', key.remoteJid)

// ================================================================
// PASSO 2: INSERT da mensagem (agora o FK existe)
// ================================================================
const messageInput: CreateMessageInput = {
  message_id: key.id,
  remote_jid: key.remoteJid,
  content,
  message_type: type,
  media_url,
  caption,
  from_me: key.fromMe,
  timestamp: new Date(messageTimestamp * 1000).toISOString(),
  status: status as any,
  raw_payload: payload.data
}

const savedMessage = await upsertWhatsAppMessage(messageInput)
console.log('✅ Mensagem salva:', savedMessage.id)
```

### Como Funciona

1. **UPSERT do Contato:**
   - Se o contato **não existe**: cria um novo registro
   - Se o contato **já existe**: atualiza os dados (ou mantém se `ignoreDuplicates`)
   - Garante que o `remote_jid` existe antes de inserir a mensagem

2. **INSERT da Mensagem:**
   - Agora o `remote_jid` com certeza existe na tabela `whatsapp_contacts`
   - A foreign key constraint é satisfeita
   - Nenhum erro 23503

### Função UPSERT

**Arquivo:** `lib/whatsapp-db.ts`

```typescript
export async function upsertWhatsAppContact(input: UpdateContactInput): Promise<WhatsAppContact> {
  const { data, error } = await supabaseAdmin
    .from('whatsapp_contacts')
    .upsert(
      {
        remote_jid: input.remote_jid,
        name: input.name,
        push_name: input.push_name,
        profile_picture_url: input.profile_picture_url,
        is_group: input.is_group || false
      },
      {
        onConflict: 'remote_jid',  // ← Chave única
        ignoreDuplicates: false     // ← Atualiza se existir
      }
    )
    .select()
    .single()

  if (error) {
    console.error('❌ Erro ao upsert contato:', error)
    throw error
  }

  return data
}
```

---

## 🧪 Como Testar

1. **Enviar mensagem no WhatsApp** para o número conectado à Evolution API

2. **Verificar logs do webhook:**
   ```
   📥 Webhook recebido: { event: 'messages.upsert', ... }
   🔄 Criando/atualizando contato primeiro...
   ✅ Contato garantido: 5521988960217@s.whatsapp.net
   ✅ Mensagem salva: <uuid>
   ```

3. **Verificar no Supabase:**
   ```sql
   -- Contato criado
   SELECT * FROM whatsapp_contacts 
   WHERE remote_jid = '5521988960217@s.whatsapp.net';
   
   -- Mensagem inserida
   SELECT * FROM whatsapp_messages 
   WHERE remote_jid = '5521988960217@s.whatsapp.net';
   ```

4. **Nenhum erro 23503 deve aparecer** ✅

---

## 📊 Benefícios

✅ **Elimina erro FK constraint** completamente  
✅ **Garante integridade referencial** do banco  
✅ **Ordem de execução previsível** e segura  
✅ **Logs claros** para debug  
✅ **Funciona para mensagens recebidas e enviadas**  

---

## 🚀 Deploy

```bash
git add app/api/webhooks/whatsapp/route.ts
git commit -m "fix: resolver FK constraint - UPSERT contato antes de inserir mensagem"
git push origin main
```

**Status:** ✅ Corrigido e em produção
