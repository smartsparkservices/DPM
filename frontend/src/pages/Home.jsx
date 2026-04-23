import React from 'react';
import { ShieldCheck, HeartPulse, Stethoscope, CarFront, Clock, Heart, Building, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-bg.png';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="container">
          <div className="hero-content animate-fade-up">
            <h1 className="hero-title">Getting to your appointment shouldn't be the hardest part.</h1>
            <p className="hero-subtitle">
              Desert Path Mobility Services provides safe, reliable, compassionate non-emergency medical transportation throughout Greater Phoenix. HIPAA-certified, NPI-registered, and built around your schedule — not ours.
            </p>
            <div className="hero-buttons">
              <Link to="/request" className="btn btn-primary stagger-1 animate-fade-up">
                Request a Ride <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </Link>
              <Link to="/facilities" className="btn btn-secondary stagger-2 animate-fade-up">
                For Healthcare Facilities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="trust-bar">
        <div className="container">
          <div className="trust-card stagger-3 animate-fade-up">
            <div className="trust-items">
              <div className="trust-item">
                <div className="trust-icon"><ShieldCheck size={20} /></div>
                HIPAA Certified
              </div>
              <div className="trust-item">
                <div className="trust-icon"><FileText size={20} /></div>
                NPI Registered
              </div>
              <div className="trust-item">
                <div className="trust-icon"><HeartPulse size={20} /></div>
                First Aid Certified
              </div>
              <div className="trust-item">
                <div className="trust-icon"><CarFront size={20} /></div>
                Fully Insured
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section className="section services-section">
        <div className="container">
          <div className="services-header animate-fade-up">
            <span className="section-label">Transportation built for medical needs</span>
            <h2>Who We Serve</h2>
            <p>We work with patients, families, and healthcare facilities across Phoenix to make sure nobody misses an appointment because they couldn't get a ride.</p>
          </div>

          <div className="services-grid">
            <div className="service-card animate-fade-up stagger-1">
              <div className="service-icon-wrapper"><HeartPulse size={24} /></div>
              <h3>Dialysis Patients</h3>
              <p>Reliable transport for your 3x-weekly appointments. We'll be there every time.</p>
            </div>
            
            <div className="service-card animate-fade-up stagger-2">
              <div className="service-icon-wrapper"><Stethoscope size={24} /></div>
              <h3>Medical Appointments</h3>
              <p>Doctor visits, specialist consultations, follow-up care, lab work, and more.</p>
            </div>

            <div className="service-card animate-fade-up stagger-3">
              <div className="service-icon-wrapper"><Building size={24} /></div>
              <h3>Hospital Discharge</h3>
              <p>Safe, coordinated pickup when your patient is ready to go home.</p>
            </div>

            <div className="service-card animate-fade-up stagger-4">
              <div className="service-icon-wrapper"><Clock size={24} /></div>
              <h3>Ongoing Care Schedules</h3>
              <p>Weekly, recurring transport for patients with regular treatment needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Difference Section */}
      <section className="section difference-section">
        <div className="container difference-grid">
          <div className="difference-content animate-fade-up">
            <span className="section-label">The Desert Path Difference</span>
            <h2>Not just a ride. A reliable part of your care plan.</h2>
            <p>
              Most missed medical appointments come down to one thing: no reliable way to get there. Desert Path Mobility exists to close that gap in the Phoenix area. We're locally owned, deeply committed to the patients and facilities we serve, and we treat every ride like someone's health depends on it — because it does.
            </p>
            <p>
              We are HIPAA-trained, NPI-registered, and carry full commercial insurance. Our vehicles are clean, accessible, and maintained to the same standard we'd want for our own family members.
            </p>
            <div style={{ marginTop: 32 }}>
              <Link to="/about" className="btn btn-outline">Read Our Story</Link>
            </div>
          </div>
          <div className="difference-image animate-fade-up stagger-2">
            <div style={{ padding: '60px', textAlign: 'center', background: 'var(--sage-pale)', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'var(--sage-dark)' }}>
              <Heart size={64} style={{ margin: '0 auto 24px', opacity: 0.8 }} />
              <h3 style={{ fontSize: '24px', marginBottom: '16px' }}>Serving Greater Phoenix</h3>
              <p style={{ opacity: 0.8 }}>Available across Phoenix, Scottsdale, Tempe, Mesa, Chandler, and surrounding areas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* For Facilities Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-content animate-fade-up">
            <h2>Are you a discharge planner, case manager, or facility coordinator?</h2>
            <p>
              We make your job easier. Desert Path Mobility offers facility partnerships with verified credentials, fast response times, and a driver who shows up when scheduled. Let's talk.
            </p>
            <Link to="/facilities" className="btn btn-primary" style={{ background: 'var(--sage)', color: 'var(--white)' }}>
              Learn About Facility Partnerships <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
