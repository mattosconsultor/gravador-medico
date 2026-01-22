-- ================================================================
-- FIX RÁPIDO: Corrigir TODAS as mensagens da automação
-- ================================================================

-- Ver situação atual
SELECT 
  'ANTES DA CORREÇÃO' as momento,
  from_me,
  COUNT(*) as total
FROM whatsapp_messages
GROUP BY from_me;

-- CORREÇÃO: Mensagens que começam com '3EB', 'BAE', '2551' são ENVIADAS
-- Baseado nos IDs que vimos no console do navegador
UPDATE whatsapp_messages
SET from_me = true
WHERE from_me = false
  AND (
    message_id LIKE '3EB%'
    OR message_id LIKE 'BAE%'
    OR message_id LIKE '2551%'
    OR message_id LIKE '3A%'
    OR message_id LIKE '3AA%'
  );

-- Ver resultado
SELECT 
  'DEPOIS DA CORREÇÃO' as momento,
  from_me,
  COUNT(*) as total
FROM whatsapp_messages
GROUP BY from_me;

-- Ver mensagens específicas corrigidas
SELECT 
  message_id,
  LEFT(content, 50) as content,
  from_me,
  to_char(timestamp, 'DD/MM HH24:MI:SS') as quando
FROM whatsapp_messages
ORDER BY timestamp DESC
LIMIT 20;
