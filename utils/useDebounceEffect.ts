import { useEffect, useState } from 'react';

export const useDebounceEffect = (effect, deps, delay) => {
  const [isFirstTime, setIsFirstTime] = useState(true);
  useEffect(() => {
    if (isFirstTime) {
      setIsFirstTime(false);
      return;
    }
    const handler = setTimeout(() => effect(), delay);

    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || []), delay]);
};
