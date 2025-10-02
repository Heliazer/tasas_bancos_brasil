/**
 * Formats a number as Brazilian currency (R$)
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formats a number as Brazilian percentage
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Formats a date as DD/MM/YYYY (Brazilian format)
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
}

/**
 * Formats CNPJ as XX.XXX.XXX/XXXX-XX
 */
export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, '');

  if (cleaned.length !== 14) {
    return cnpj; // Return as-is if invalid length
  }

  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

/**
 * Validates CNPJ format (basic validation)
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleaned = cnpj.replace(/\D/g, '');

  if (cleaned.length !== 14) {
    return false;
  }

  // Check if all digits are the same
  if (/^(\d)\1+$/.test(cleaned)) {
    return false;
  }

  // Calculate verification digits
  let length = cleaned.length - 2;
  let numbers = cleaned.substring(0, length);
  const digits = cleaned.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) {
    return false;
  }

  length = length + 1;
  numbers = cleaned.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) {
    return false;
  }

  return true;
}

/**
 * Formats a number with Brazilian locale
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Parses a Brazilian formatted number string to number
 */
export function parseBrazilianNumber(value: string): number {
  // Remove thousands separator (.) and replace decimal comma (,) with dot
  const normalized = value
    .replace(/\./g, '')
    .replace(',', '.');

  return parseFloat(normalized);
}
