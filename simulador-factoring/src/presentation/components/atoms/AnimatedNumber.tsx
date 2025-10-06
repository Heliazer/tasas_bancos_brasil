import { motion } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp';
import { formatCurrency } from '../../../utils/formatters';

interface AnimatedNumberProps {
  value: number;
  currency?: boolean;
  decimals?: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

/**
 * Número animado con efecto count-up
 * Ideal para mostrar montos de manera impactante
 */
export function AnimatedNumber({
  value,
  currency = true,
  decimals = 2,
  duration = 1.5,
  className,
  prefix = '',
  suffix = '',
}: AnimatedNumberProps) {
  const { currentValue } = useCountUp(value, duration, true);

  const formattedValue = currency
    ? formatCurrency(currentValue)
    : currentValue.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {formattedValue}
      {suffix}
    </motion.span>
  );
}
