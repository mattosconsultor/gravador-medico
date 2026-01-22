-- ================================================================
-- ATUALIZAR CAMPO from_me EM MENSAGENS EXISTENTES
-- ================================================================

-- IMPORTANTE: Este script limpa mensagens antigas.
-- A partir de agora, apenas NOVAS mensagens do webhook virão com from_me correto.

-- ================================================================
-- OPÇÃO RECOMENDADA: Limpar dados antigos e começar do zero
-- ================================================================

-- Se você quiser manter histórico, pule esta seção
-- Se quiser começar limpo (sem mensagens antigas), descomente:

-- DELETE FROM whatsapp_messages 
-- WHERE created_at < NOW() - INTERVAL '1 day';

-- ================================================================
-- ALTERNATIVA: Marcar todas como recebidas (padrão seguro)
-- ================================================================
-- Mantém histórico mas todas antigas ficam como "recebidas"
UPDATE whatsapp_messages 
SET from_me = false 
WHERE from_me IS NULL OR from_me = false;

-- ================================================================
-- VERIFICAÇÃO: Contar mensagens por tipo
-- ================================================================
SELECT 
  CASE 
    WHEN from_me THEN 'Enviadas pelo sistema'
    ELSE 'Recebidas de clientes'
  END as tipo,
  COUNT(*) as total
FROM whatsapp_messages
GROUP BY from_me
ORDER BY from_me DESC;

-- ================================================================
-- TESTAR: Ver últimas 10 mensagens com detalhes
-- ================================================================
SELECT 
  id,
  remote_jid,
  SUBSTRING(content, 1, 50) as preview,
  from_me,
  timestamp,
  created_at
FROM whatsapp_messages
ORDER BY timestamp DESC
LIMIT 10;
