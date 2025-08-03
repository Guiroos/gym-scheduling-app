import { useCallback, useEffect, useState } from 'react';

const useScrollPosition = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    setScrollY(currentScrollY);
    setScrolled(currentScrollY > threshold);
  }, [threshold]);

  useEffect(() => {
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return { scrolled, scrollY };
};

export default useScrollPosition;
