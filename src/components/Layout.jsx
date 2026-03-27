import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

export default function Layout() {
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app">
      <nav className={`navbar ${scrolled ? 'nav-scrolled' : ''}`} style={location.pathname !== '/' ? {background: 'var(--glass-bg)', backdropFilter: 'blur(12px)'} : {}}>
        <div className="container nav-container">
          <Link to="/" className="nav-logo">
            Desert <span>Path</span> Mobility
          </Link>
          <div className="nav-links">
            <Link to="/services">Services</Link>
            <Link to="/credentials">Credentials</Link>
            <Link to="/facilities">For Facilities</Link>
            <Link to="/about">About</Link>
            
            <button 
              onClick={toggleTheme} 
              className="theme-toggle" 
              aria-label="Toggle Dark Mode"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '8px'
              }}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <Link to="/request" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>
              Request a Ride
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>Desert Path Mobility</h3>
              <p>Providing safe, reliable, and compassionate non-emergency medical transportation throughout Greater Phoenix, AZ.</p>
            </div>
            
            <div className="footer-links">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/services">Services</Link></li>
                <li><Link to="/credentials">Our Credentials</Link></li>
                <li><Link to="/facilities">For Facilities</Link></li>
                <li><Link to="/about">About Us</Link></li>
              </ul>
            </div>

            <div className="footer-links">
              <h4>Contact</h4>
              <ul>
                <li><a href="tel:6236883533">(623) 688-3533</a></li>
                <li><a href="mailto:desertkeysrentals@gmail.com">desertkeysrentals@gmail.com</a></li>
                <li><Link to="/request" className="text-sage" style={{ fontWeight: 500 }}>Request a Ride</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <span>© 2025 Desert Path Mobility Services. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '20px' }}>
              <a href="#">Privacy Policy</a>
              <a href="#">HIPAA Notice</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
