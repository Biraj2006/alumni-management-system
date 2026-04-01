import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Cursor = () => {
  const cursorRef = useRef(null);
  const cursorDotRef = useRef(null);

  useGSAP(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return;

    // Hide default cursor gracefully via body class (will be added in index.css)
    document.body.classList.add('custom-cursor-active');

    const moveCursor = (e) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15, // Smooth lag
        ease: 'power2.out'
      });
      gsap.to(cursorDotRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0,
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Dynamic hover effects
    const handleMouseOver = (e) => {
      const isClickable = e.target.closest('button, a, input, select, textarea, .btn, .clickable');
      if (isClickable) {
        gsap.to(cursorRef.current, { scale: 1.5, opacity: 0.5, backgroundColor: 'var(--primary-color, rgba(14, 165, 233, 0.2))', duration: 0.2 });
      } else {
        gsap.to(cursorRef.current, { scale: 1, opacity: 1, backgroundColor: 'transparent', duration: 0.2 });
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('custom-cursor-active');
    };
  });

  return (
    <>
      <div 
        ref={cursorDotRef} 
        style={{ 
          position: 'fixed', top: 0, left: 0, width: '8px', height: '8px', 
          backgroundColor: 'var(--primary-color, #0ea5e9)', borderRadius: '50%', 
          pointerEvents: 'none', zIndex: 9999, transform: 'translate(-50%, -50%)',
          willChange: 'transform'
        }} 
      />
      <div 
        ref={cursorRef} 
        style={{ 
          position: 'fixed', top: 0, left: 0, width: '40px', height: '40px', 
          border: '2px solid var(--primary-color, #0ea5e9)', borderRadius: '50%', 
          pointerEvents: 'none', zIndex: 9998, transform: 'translate(-50%, -50%)',
          willChange: 'transform, scale'
        }} 
      />
    </>
  );
};

export default Cursor;
