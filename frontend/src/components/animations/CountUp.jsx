import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const CountUp = ({ end, duration = 2, suffix = "", className = "" }) => {
  const countRef = useRef(null);
  const obj = { value: 0 };

  useGSAP(() => {
    gsap.to(obj, {
      value: end,
      duration: duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: countRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        if (countRef.current) {
          countRef.current.innerText = Math.floor(obj.value).toLocaleString() + suffix;
        }
      }
    });
  }, { scope: countRef });

  return <span ref={countRef} className={className}>0{suffix}</span>;
};

export default CountUp;
