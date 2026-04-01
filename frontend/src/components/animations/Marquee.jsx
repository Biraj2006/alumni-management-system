import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Marquee = ({ children, speed = 1, direction = 'left', className = "" }) => {
  const containerRef = useRef(null);
  const wrapperRef = useRef(null);

  useGSAP(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Duplicate children for seamless loop
    const content = wrapper.innerHTML;
    wrapper.innerHTML = content + content;

    const totalWidth = wrapper.scrollWidth / 2;
    const duration = totalWidth / (50 * speed);

    gsap.to(wrapper, {
      x: direction === 'left' ? -totalWidth : totalWidth,
      duration: duration,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth)
      }
    });

    // Pause on hover
    const pause = () => gsap.getTweensOf(wrapper).forEach(t => t.pause());
    const resume = () => gsap.getTweensOf(wrapper).forEach(t => t.play());

    wrapper.addEventListener('mouseenter', pause);
    wrapper.addEventListener('mouseleave', resume);

    return () => {
      wrapper.removeEventListener('mouseenter', pause);
      wrapper.removeEventListener('mouseleave', resume);
    };
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      className={`marquee-container ${className}`}
      style={{ overflow: 'hidden', width: '100%', whiteSpace: 'nowrap' }}
    >
      <div ref={wrapperRef} style={{ display: 'inline-block' }}>
        {children}
      </div>
    </div>
  );
};

export default Marquee;
