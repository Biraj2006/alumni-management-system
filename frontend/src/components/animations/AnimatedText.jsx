import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AnimatedText = ({ text, className = "", delay = 0 }) => {
  const textRef = useRef(null);
  
  // Split text into words, then chars to animate independently without extra plugins
  const words = text.split(' ').map((word, wordIndex) => (
    <span key={wordIndex} style={{ display: 'inline-block', whiteSpace: 'nowrap', overflow: 'hidden', marginRight: '0.25em' }}>
      {word.split('').map((char, charIndex) => (
        <span 
          key={charIndex} 
          className="char" 
          style={{ display: 'inline-block', transform: 'translateY(100%)', opacity: 0 }}
        >
          {char}
        </span>
      ))}
    </span>
  ));

  useGSAP(() => {
    if (!textRef.current) return;
    const chars = textRef.current.querySelectorAll('.char');
    
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      gsap.set(chars, { y: '0%', opacity: 1 });
      return;
    }

    gsap.to(chars, {
      y: '0%',
      opacity: 1,
      duration: 0.8,
      stagger: 0.03,
      ease: 'back.out(1.7)',
      delay: delay
    });
  }, { scope: textRef });

  return (
    <div ref={textRef} className={`animated-text ${className}`}>
      {words}
    </div>
  );
};

export default AnimatedText;
