import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const containerRef = useRef(null);

  useGSAP(() => {
    // A smooth curtain/wipe or fade + slide effect on route change
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  }, [location.pathname]);

  return (
    <div ref={containerRef} className="page-transition-wrapper">
      {children}
    </div>
  );
};

export default PageTransition;
