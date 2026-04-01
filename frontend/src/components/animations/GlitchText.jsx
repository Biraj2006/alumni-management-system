import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const GlitchText = ({ text, className = "" }) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const glitch = containerRef.current;
    if (!glitch) return;

    // Create a glitch timeline that repeats with random delay
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: Math.random() * 5 + 3, // Random pause between glitches
    });

    tl.to(glitch, {
      skewX: () => Math.random() * 20 - 10,
      x: () => Math.random() * 10 - 5,
      opacity: 0.8,
      duration: 0.1,
      ease: 'power4.inOut',
    })
    .to(glitch, {
      skewX: 0,
      x: 0,
      opacity: 1,
      duration: 0.1,
      ease: 'power4.inOut',
    })
    .to(glitch, {
        clipPath: 'inset(80% 0 0 0)',
        duration: 0.1
    })
    .to(glitch, {
        clipPath: 'inset(0 0 0 0)',
        duration: 0.1
    });

    // Color glitch bars
    const bars = glitch.querySelectorAll('.glitch-bar');
    gsap.to(bars, {
        opacity: () => Math.random() * 0.5,
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        ease: 'none'
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={`glitch-text-wrapper ${className}`} style={{ position: 'relative', display: 'inline-block' }}>
      <span className="glitch-text-main" style={{ position: 'relative', zIndex: 1 }}>{text}</span>
      <span className="glitch-text-copy glitch-r" style={{ position: 'absolute', top: 0, left: '2px', width: '100%', height: '100%', zIndex: 0, color: 'rgba(255, 0, 0, 0.5)', clipPath: 'inset(10% 0 30% 0)' }}>{text}</span>
      <span className="glitch-text-copy glitch-b" style={{ position: 'absolute', top: 0, left: '-2px', width: '100%', height: '100%', zIndex: 0, color: 'rgba(0, 0, 255, 0.5)', clipPath: 'inset(40% 0 10% 0)' }}>{text}</span>
    </div>
  );
};

export default GlitchText;
