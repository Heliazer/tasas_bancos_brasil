import { type ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'elevated' | 'bordered';
}

/**
 * Componente Card para contenedores de contenido
 */
export function Card({ children, className, padding = 'md', variant = 'default' }: CardProps) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantClasses = {
    default: 'bg-white rounded-xl',
    elevated: 'bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300',
    bordered: 'bg-white rounded-xl border-2 border-gray-200',
  };

  return (
    <div className={clsx(variantClasses[variant], paddingClasses[padding], className)}>
      {children}
    </div>
  );
}
