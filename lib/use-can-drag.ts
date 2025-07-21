import { useEffect, useState } from 'react';

export const useCanDrag = (): boolean => {
  const [canDrag, setCanDrag] = useState(false);

  useEffect(() => {
    if (typeof navigator === 'undefined' || typeof window === 'undefined') {
      setCanDrag(false);
      return;
    }
    const isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
    setCanDrag(!isTouch);
  }, []);

  return canDrag;
};
