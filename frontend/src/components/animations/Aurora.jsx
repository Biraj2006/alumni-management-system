import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Aurora = ({ className = "" }) => {
  const auroraRef = useRef(null);

  useGSAP(() => {
    const canvas = auroraRef.current;
    if (!canvas) return;

    // This is a CSS-based Aurora effect using GSAP to animate blur/opacity/position
    // for a premium "glassmorphism" look.
    const blobs = canvas.querySelectorAll('.aurora-blob');
    
    gsap.to(blobs, {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      duration: "random(10, 20)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: {
        amount: 2,
        from: "random"
      }
    });

    gsap.to(blobs, {
      scale: "random(1.2, 2)",
      opacity: "random(0.3, 0.6)",
      duration: "random(5, 10)",
      repeat: -1,
      yoyo: true,
      ease: "none"
    });
  }, { scope: auroraRef });

  return (
    <div 
      ref={auroraRef} 
      className={`aurora-container ${className}`}
      style={{
        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
        overflow: 'hidden', zIndex: -1, backgroundColor: '#020617', // Deeper blue-black
        filter: 'blur(100px)'
      }}
    >
      <div className="aurora-blob" style={{ position: 'absolute', width: '60%', height: '60%', top: '-10%', left: '-10%', borderRadius: '50%', backgroundColor: '#0ea5e9', mixBlendMode: 'screen' }} />
      <div className="aurora-blob" style={{ position: 'absolute', width: '70%', height: '70%', bottom: '-10%', right: '-10%', borderRadius: '50%', backgroundColor: '#6366f1', mixBlendMode: 'screen' }} />
      <div className="aurora-blob" style={{ position: 'absolute', width: '50%', height: '50%', top: '30%', left: '30%', borderRadius: '50%', backgroundColor: '#a855f7', mixBlendMode: 'screen' }} />
      <div className="aurora-blob" style={{ position: 'absolute', width: '40%', height: '40%', bottom: '20%', left: '10%', borderRadius: '50%', backgroundColor: '#ec4899', mixBlendMode: 'screen' }} />
      
      {/* Noise Texture Overlay */}
      <div className="noise-overlay" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          opacity: 0.05, filter: 'contrast(100%) brightness(100%)',
          backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")',
          pointerEvents: 'none', mixBlendMode: 'overlay'
      }} />
    </div>
  );
};

export default Aurora;
