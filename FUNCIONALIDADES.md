# 🎯 Guia de Uso - Voice Pen Pro Dashboard

## Como Usar Cada Funcionalidade

### 1️⃣ **Botão "Ver Guia" (Card Instalar Gravador)**

**Ação:** Clique no botão azul "Ver Guia"

**Resultado:**
- Abre um modal com 3 abas interativas
- **Aba 1 - Download:**
  - Mostra QR Codes para iOS (App Store) e Android (Play Store)
  - Design visual com gradientes azul e verde
  - QR codes simulados (padrão de pixels aleatórios)
  
- **Aba 2 - Configuração:**
  - Lista de 5 passos numerados
  - Cada passo aparece com animação sequencial
  - Instruções detalhadas sobre ativação de "High Quality Audio"
  
- **Aba 3 - Concluir:**
  - Mensagem de conclusão com checklist
  - Botão "Tudo Pronto!" que fecha o modal
  - Animação de sucesso ao clicar

---

### 2️⃣ **Botão "Copiar Agora" (Card Prompt Mestre)**

**Ação:** Clique no botão verde "Copiar Agora"

**Resultado:**
1. O prompt completo é copiado para a área de transferência
2. O botão muda instantaneamente para:
   - Cor: Verde escuro
   - Texto: "Copiado com Sucesso!"
   - Ícone: Check ✓
3. Aparece uma notificação (toast) no canto inferior direito
4. Após 3 segundos, o botão volta ao estado normal

**Prompt Copiado:**
```
Atue como um escriba médico especialista em documentação clínica...
[Estrutura SOAP completa com 70+ linhas]
```

**Onde Colar:**
- Configurações do seu gravador de áudio
- Ferramenta de transcrição (WhisperAI, etc.)
- ChatGPT/Claude para processar transcrições

---

### 3️⃣ **Botão "Desbloquear" (Card Cardiologia)**

**Ação:** Clique no botão "Desbloquear" no card amarelo

**Resultado:**
- Abre modal premium com design elegante
- **Conteúdo exibido:**
  - Título: "🫀 Pack Cardiologia Premium"
  - Ícone de coração vermelho
  - Badge "Premium" em dourado
  - 6 benefícios com checkmarks verdes:
    1. 12 prompts avançados para doenças cardiovasculares
    2. Análise automatizada de ECG
    3. Modelos para insuficiência cardíaca
    4. Prompts para hipertensão
    5. Relatórios de ecocardiograma
    6. Atualizações mensais
  - Preço: R$ 29,90 (desconto de R$ 49,90)
  - Badge: "-40% OFF"
  - Garantia de 7 dias

**Botão "Desbloquear Agora":**
- Ao clicar, simula redirecionamento para pagamento
- Mostra toast: "Redirecionando para pagamento seguro... 🔒"
- Após 2 segundos: "Em breve você terá acesso ao conteúdo premium!"
- Modal fecha automaticamente

---

### 4️⃣ **Botão "Desbloquear" (Card Escudo Jurídico)**

**Ação:** Clique no botão "Desbloquear" no card azul

**Resultado:**
- Abre modal premium com design elegante
- **Conteúdo exibido:**
  - Título: "🛡️ Escudo Jurídico"
  - Ícone de escudo azul
  - Badge "Proteção" em azul
  - 6 benefícios com checkmarks verdes:
    1. Termos de consentimento automáticos (LGPD)
    2. Cláusulas de responsabilidade personalizadas
    3. Modelos revisados por advogados
    4. Atualizações conforme CFM
    5. Políticas de privacidade
    6. Suporte jurídico consultivo
  - Preço: R$ 49,90
  - Garantia de 7 dias

**Comportamento igual ao modal de Cardiologia**

---

## 🎨 Detalhes Visuais

### Animações Implementadas

1. **Entrada da Página:**
   - Header desce suavemente (fade-in + slide down)
   - Barra de progresso anima de 0% → 40% em 1 segundo
   - Cards aparecem em sequência (delay de 0.1s cada)

2. **Hover nos Cards:**
   - Escala aumenta para 105%
   - Sombra se intensifica
   - Transição suave de 200ms

3. **Botão Copiar:**
   - Troca de estado com animação scale (0.8 → 1)
   - Transição de cor suave
   - AnimatePresence para entrada/saída

4. **Modais:**
   - Backdrop com blur
   - Conteúdo com fade-in + zoom-in
   - Elementos internos com animação sequencial

5. **Toast Notifications:**
   - Slide-in from right
   - Fade-out ao fechar
   - Auto-dismiss após 3s

### Cores e Estados

| Elemento | Normal | Hover | Active |
|----------|--------|-------|--------|
| Botão Primário | #2563EB | #1E40AF | #1E3A8A |
| Botão Sucesso | #059669 | #047857 | #065F46 |
| Card | Branco | Shadow-lg | - |
| Badge Premium | Âmbar-100 | - | - |
| Badge Proteção | Azul-100 | - | - |

---

## 🧪 Testando Funcionalidades

### Checklist de Teste

- [ ] Clique em "Ver Guia" → Modal abre
- [ ] Navegue pelas 3 abas → Conteúdo muda
- [ ] Clique "Tudo Pronto!" → Modal fecha com animação
- [ ] Clique "Copiar Agora" → Botão fica verde
- [ ] Verifique área de transferência → Texto copiado
- [ ] Aguarde 3s → Botão volta ao normal
- [ ] Clique "Desbloquear" (Cardiologia) → Modal abre
- [ ] Verifique 6 benefícios → Todos visíveis
- [ ] Clique "Desbloquear Agora" → Toast aparece
- [ ] Repita com "Escudo Jurídico" → Conteúdo diferente

---

## 🐛 Resolução de Problemas

**Botão Copiar não funciona:**
- Verifique se está usando HTTPS (clipboard API requer)
- Em localhost funciona normalmente

**Modais não abrem:**
- Verifique console do navegador
- Certifique-se que JavaScript está habilitado

**Animações travadas:**
- Verifique se framer-motion está instalado
- Execute: `npm install framer-motion`

---

## 📱 Responsividade

- **Desktop (>1024px):** Grid 2 colunas
- **Tablet (768px-1024px):** Grid 2 colunas
- **Mobile (<768px):** Grid 1 coluna

---

Desenvolvido com ❤️ para profissionais da saúde.
