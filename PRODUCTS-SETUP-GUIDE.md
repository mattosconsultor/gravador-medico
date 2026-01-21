# 🎯 Guia de Configuração - Produtos Intelligence

## ⚠️ LEIA ISTO PRIMEIRO!

**Você está vendo erro "column si.product_name does not exist"?**

➡️ **Use este arquivo:** `database/PRODUCTS-INTELLIGENCE-MINIMAL.sql`

Este arquivo cria TODAS as tabelas necessárias do zero e resolve o erro automaticamente.

📖 **Guia completo de troubleshooting:** `SOLUCAO-DEFINITIVA.md`

---

## Passo a Passo para Ativação

### 1️⃣ Executar SQL no Supabase

#### 🌟 Método Recomendado: MINIMAL (Setup Completo)

1. Abra o **SQL Editor** do Supabase
2. Copie **TODO** o conteúdo do arquivo:
   ```
   database/PRODUCTS-INTELLIGENCE-MINIMAL.sql
   ```
3. Cole no SQL Editor
4. Clique em **"RUN"** (ou Ctrl+Enter)
5. Aguarde 2-3 segundos

**✅ Pronto! Tabelas criadas:**
- `customers`
- `products`
- `sales`
- `sales_items` ← Esta estava faltando!
- Views de performance
- Função de auto-discovery

#### 📌 Alternativa: Se Você Já Tem Schema Parcial

Se você já executou parcialmente outros SQLs:

```
database/PRODUCTS-INTELLIGENCE-STANDALONE.sql
```

Ou se já tem `sales` + `sales_items`:

```
database/PRODUCTS-INTELLIGENCE.sql
```

---

### 2️⃣ Verificar se Funcionou

Execute no Supabase SQL Editor:

```sql
-- Ver tabelas criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('sales', 'sales_items', 'products');

-- Deve retornar 3 linhas
```

**Resultado esperado:**
```
table_name
----------
sales
sales_items
products
```

---

### 5️⃣ Métricas de Performance (View)

A `product_performance` calcula automaticamente:

**Métricas Financeiras:**
- `total_sales`: Quantidade de vendas aprovadas
- `total_revenue`: Receita total (R$)
- `avg_price`: Preço médio

**Métricas de Qualidade:**
- `refund_rate`: Taxa de reembolso (%)
- `conversion_rate`: Taxa de conversão checkout → venda (%)
- `health_score`: Pontuação 0-100 baseada em reembolsos e falhas

**Fórmula do Health Score:**
```
Health = 100 
  - (refund_rate * 50)      // Perde até 50 pontos
  - (failure_rate * 30)     // Perde até 30 pontos
```

**Exemplo:**
- Produto com 0% reembolso e 0% falhas = **100**
- Produto com 10% reembolso e 5% falhas = **45**

---

### 6️⃣ Funcionalidades Operacionais

#### Copiar Link do Checkout
Clique no ícone **📋 Copy** para copiar o `checkout_url` do produto.

#### Ativar/Desativar Produto
Clique no badge de status (🟢 Ativo / ⚪ Inativo) para alternar.

#### Editar Produto
Clique no ícone **✏️ Edit** (funcionalidade em construção).

#### Filtros
- **Busca:** Nome do produto
- **Categoria:** subscription, one_time, upsell, auto-detected

---

### 7️⃣ Troubleshooting

#### ❌ Erro: "Nenhum produto encontrado"
**Causa:** Tabela `sales` está vazia.

**Solução:**
1. Verifique se tem vendas: `SELECT COUNT(*) FROM sales`
2. Se não tiver, insira vendas de teste ou aguarde webhooks da Appmax

#### ❌ Erro: "duplicate key value violates unique constraint"
**Causa:** Tentando inserir produto com `external_id` duplicado.

**Solução:** O upsert deve resolver automaticamente. Se persistir:
```sql
-- Limpar duplicatas manualmente
DELETE FROM products 
WHERE id NOT IN (
  SELECT MIN(id) 
  FROM products 
  GROUP BY external_id
);
```

#### ❌ Performance está vazia
**Causa:** View `product_performance` usa dados dos últimos 30 dias.

**Solução:** Aguarde vendas recentes ou ajuste o intervalo no SQL:
```sql
WHERE s.created_at > (now() - interval '90 days') -- Aumentar para 90 dias
```

---

### 8️⃣ Próximos Passos

- [ ] Adicionar Drawer de Edição completo
- [ ] Implementar Sparklines (gráficos de tendência)
- [ ] Configurar Upsells/Order Bumps
- [ ] Exportar relatório de produtos (CSV/Excel)
- [ ] Dashboard de comparação entre produtos

---

## 🎉 Pronto!

Agora você tem um **Product Intelligence Center** completo:

✅ Auto-discovery de produtos
✅ Métricas de performance em tempo real
✅ Health Score automático
✅ Alertas de produtos problemáticos
✅ Interface visual de classe mundial

**Tempo total de setup:** ~5 minutos

---

## 📊 SQL Executado

Arquivo completo:
```
/database/PRODUCTS-INTELLIGENCE.sql
```

Principais objetos criados:
- `public.products` (table)
- `public.product_performance` (view)
- `public.product_trends` (view)
- `discover_products_from_sales()` (function)
- 8 índices otimizados
- 4 políticas RLS

**Próxima vez que fizer deploy:**
Execute novamente o SQL no Supabase de produção!
