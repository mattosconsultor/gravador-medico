-- =============================================
-- Migração: adicionar colunas no checkout_attempts
-- =============================================
-- Adiciona appmax_order_id e total_amount (se não existirem)

ALTER TABLE public.checkout_attempts
ADD COLUMN IF NOT EXISTS appmax_order_id TEXT;

ALTER TABLE public.checkout_attempts
ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10,2) DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_checkout_attempts_appmax_order_id
  ON public.checkout_attempts(appmax_order_id);
