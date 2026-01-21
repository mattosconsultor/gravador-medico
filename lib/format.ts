/**
 * Formata um valor numérico para moeda brasileira
 * Garante que não quebra com undefined/null
 */
export const formatMoney = (value: number | null | undefined): string => {
  const num = Number(value)
  return Number.isFinite(num) ? num.toFixed(2) : '0.00'
}

/**
 * Formata um valor numérico para moeda brasileira com traço quando indefinido
 */
export const formatMoneyOrDash = (value: number | null | undefined): string => {
  const num = Number(value)
  return Number.isFinite(num) ? num.toFixed(2) : '—'
}

/**
 * Formata percentual com 1 casa decimal
 */
export const formatPercent = (value: number | null | undefined): string => {
  const num = Number(value)
  return Number.isFinite(num) ? num.toFixed(1) : '0.0'
}
