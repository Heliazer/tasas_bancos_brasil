import { useId } from 'react';
import clsx from 'clsx';

interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/**
 * Toggle switch para opciones binarias (ej: auto-reinversión)
 */
export function Toggle({ label, checked, onChange, disabled = false, className }: ToggleProps) {
  const id = useId();

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          'relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
          {
            'bg-green-500': checked,
            'bg-gray-300': !checked,
            'opacity-50 cursor-not-allowed': disabled,
            'cursor-pointer': !disabled,
          }
        )}
      >
        <span
          className={clsx(
            'inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200',
            {
              'translate-x-6': checked,
              'translate-x-1': !checked,
            }
          )}
        />
      </button>

      {label && (
        <label
          htmlFor={id}
          className={clsx('text-sm font-medium text-gray-700', {
            'cursor-pointer': !disabled,
            'opacity-50': disabled,
          })}
          onClick={() => !disabled && onChange(!checked)}
        >
          {label}
        </label>
      )}
    </div>
  );
}
