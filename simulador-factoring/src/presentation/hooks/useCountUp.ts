import { useEffect, useState, useRef } from 'react';
import { ANIMATION_CONFIG } from '../../utils/constants';

/**
 * Hook para animar números (count-up effect)
 * Ideal para mostrar el crecimiento de capital de manera impactante
 */
export function useCountUp(
  endValue: number,
  duration: number = ANIMATION_CONFIG.COUNT_UP_DURATION,
  startOnMount: boolean = true
) {
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!startOnMount) return;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Easing function: ease-out cubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCurrentValue(endValue * easedProgress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    setIsAnimating(true);
    startTimeRef.current = undefined;
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [endValue, duration, startOnMount]);

  const restart = () => {
    setCurrentValue(0);
    startTimeRef.current = undefined;
    setIsAnimating(true);
  };

  return {
    currentValue,
    isAnimating,
    restart,
  };
}
