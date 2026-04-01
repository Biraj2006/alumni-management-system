import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Aurora from '../components/animations/Aurora';
import AnimatedText from '../components/animations/AnimatedText';
import GlitchText from '../components/animations/GlitchText';
import MagneticButton from '../components/animations/MagneticButton';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const cardRef = useRef(null);
  const spotlightRef = useRef(null);

  useGSAP(() => {
    // Spotlight effect
    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { left, top } = cardRef.current.getBoundingClientRect();
        const x = clientX - left;
        const y = clientY - top;
        
        gsap.to(spotlightRef.current, {
            background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.06), transparent 40%)`,
            duration: 0.3
        });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, { scope: containerRef });

  useGSAP(() => {
    const tl = gsap.timeline();
    
    tl.from(cardRef.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power4.out'
    });

    tl.from('.form-group', {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out'
    }, "-=0.5");
    
    tl.from('.btn-block', {
      scale: 0.9,
      opacity: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    }, "-=0.3");
  }, { scope: containerRef });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData.email, formData.password);
      
      // Redirect based on role
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'alumni':
          navigate('/alumni/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container" ref={containerRef}>
      <Aurora />
      <div className="auth-card" ref={cardRef}>
        <div ref={spotlightRef} className="spotlight-overlay" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }} />
        <h1 className="h1-title" style={{ position: 'relative', zIndex: 1 }}>
            <GlitchText text="Welcome Back" />
        </h1>
        <p className="auth-subtitle" style={{ position: 'relative', zIndex: 1 }}>Sign in to Alumni Management System</p>
        
        {error && <div className="alert alert-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          
          <MagneticButton className="btn-block">
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </MagneticButton>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
