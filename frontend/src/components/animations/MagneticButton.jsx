import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const MagneticButton = ({ children, className = "", strength = 0.5 }) => {
  const buttonRef = useRef(null);

  useGSAP(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = btn.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const x = (clientX - centerX) * strength;
      const y = (clientY - centerY) * strength;

      gsap.to(btn, {
        x: x,
        y: y,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
    };

    btn.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      btn.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, { scope: buttonRef });

  return (
    <div ref={buttonRef} className={`magnetic-wrapper ${className}`} style={{ display: 'inline-block' }}>
      {children}
    </div>
  );
};

export default MagneticButton;
