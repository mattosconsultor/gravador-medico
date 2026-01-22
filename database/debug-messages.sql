-- ================================================================
-- DEBUG: Verificar mensagens no banco
-- ================================================================

-- 1. Ver todas as mensagens e seus campos from_me
SELECT 
  id,
  message_id,
  remote_jid,
  LEFT(content, 50) as content_preview,
  from_me,
  timestamp,
  status,
  created_at
FROM whatsapp_messages
ORDER BY timestamp DESC
LIMIT 20;

-- 2. Contar por from_me
SELECT 
  from_me,
  COUNT(*) as total,
  COUNT(DISTINCT remote_jid) as conversas
FROM whatsapp_messages
GROUP BY from_me;

-- 3. Ver padrões de message_id
SELECT 
  SUBSTRING(message_id, 1, 3) as id_prefix,
  from_me,
  COUNT(*) as total
FROM whatsapp_messages
WHERE message_id IS NOT NULL
GROUP BY SUBSTRING(message_id, 1, 3), from_me
ORDER BY total DESC;

-- 4. Ver mensagens recentes de uma conversa específica
SELECT 
  message_id,
  LEFT(content, 80) as content,
  from_me,
  status,
  to_char(timestamp, 'DD/MM HH24:MI:SS') as quando
FROM whatsapp_messages
WHERE remote_jid = '5521967294908@s.whatsapp.net'  -- Ajuste o número
ORDER BY timestamp DESC
LIMIT 30;
