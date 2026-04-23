import React from 'react';
import { ArrowRight, Activity, CalendarClock, Building2, UserPlus, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <div className="page-wrapper animate-fade-up">
      <div className="section" style={{ background: 'var(--sage-pale)', padding: '120px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section-label">What We Offer</span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: '20px' }}>Transportation built for medical needs.</h1>
          <p className="text-muted" style={{ maxWidth: 600, margin: '0 auto', fontSize: '18px' }}>
            From single appointments to recurring weekly transport — we provide dependable, dignified rides for patients throughout Greater Phoenix.
          </p>
        </div>
      </div>

      <div className="section container">
        <div className="services-grid" style={{ display: 'flex', flexDirection: 'column', gap: 40, maxWidth: 800, margin: '0 auto' }}>
          
          <div className="service-card" style={{ display: 'flex', gap: 24, padding: 40, alignItems: 'flex-start' }}>
            <div className="service-icon-wrapper" style={{ flexShrink: 0 }}><UserPlus size={28} /></div>
            <div>
              <h3>Ambulatory Transport</h3>
              <p className="text-muted" style={{ marginBottom: 16 }}>For patients who can walk or transfer with minimal assistance. We provide door-to-door service from your home or facility to any medical appointment in the Phoenix metro area. Clean vehicle, punctual driver, no stress.</p>
              <span className="text-sage" style={{ fontSize: 13, fontWeight: 500 }}>Best for: Doctor visits, outpatient procedures, physical therapy</span>
            </div>
          </div>

          <div className="service-card" style={{ display: 'flex', gap: 24, padding: 40, alignItems: 'flex-start' }}>
            <div className="service-icon-wrapper" style={{ flexShrink: 0 }}><Activity size={28} /></div>
            <div>
              <h3>Dialysis Transport</h3>
              <p className="text-muted" style={{ marginBottom: 16 }}>Dialysis patients need consistent, reliable transportation three times a week — every week. We specialize in recurring dialysis runs and build a schedule that works around your treatment center's hours. Never miss a session.</p>
              <span className="text-sage" style={{ fontSize: 13, fontWeight: 500 }}>Best for: Hemodialysis or peritoneal dialysis patients</span>
            </div>
          </div>

          <div className="service-card" style={{ display: 'flex', gap: 24, padding: 40, alignItems: 'flex-start' }}>
            <div className="service-icon-wrapper" style={{ flexShrink: 0 }}><Building2 size={28} /></div>
            <div>
              <h3>Hospital Discharge Transport</h3>
              <p className="text-muted" style={{ marginBottom: 16 }}>Coordinated discharge transport for patients leaving the hospital. We work directly with case managers and discharge planners to ensure a smooth, on-time transition from the facility to home or a skilled nursing facility.</p>
              <span className="text-sage" style={{ fontSize: 13, fontWeight: 500 }}>Best for: Discharge coordinators, social workers, SNF transitions</span>
            </div>
          </div>

          <div className="service-card" style={{ display: 'flex', gap: 24, padding: 40, alignItems: 'flex-start' }}>
            <div className="service-icon-wrapper" style={{ flexShrink: 0 }}><CalendarClock size={28} /></div>
            <div>
              <h3>Recurring Care Transport</h3>
              <p className="text-muted" style={{ marginBottom: 16 }}>For patients with ongoing treatment schedules — chemotherapy, wound care, mental health appointments, and more. We set up a standing schedule and stick to it. You'll have the same driver, the same pickup time, and peace of mind.</p>
              <span className="text-sage" style={{ fontSize: 13, fontWeight: 500 }}>Best for: Weekly recurring appointments</span>
            </div>
          </div>

        </div>
      </div>

      <div className="section" style={{ background: 'var(--off-white)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <ShieldAlert size={48} style={{ color: 'var(--sage)', margin: '0 auto 24px' }} />
          <h2>Transparent, competitive pricing.</h2>
          <p className="text-muted" style={{ fontSize: 16, margin: '20px 0 32px' }}>
            Rates vary by trip distance, frequency, and service type. Whether you are an individual paying privately or a facility setting up an account, contact us for a detailed quote.
          </p>
          <Link to="/request" className="btn btn-primary">Request a Quote <ArrowRight size={18} style={{ marginLeft: 8 }} /></Link>
        </div>
      </div>
    </div>
  );
}
