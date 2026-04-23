import React from 'react';
import { DownloadCloud, ShieldCheck, FileKey, Stethoscope, CarFront } from 'lucide-react';

export default function Credentials() {
  return (
    <div className="page-wrapper animate-fade-up">
      <div className="section" style={{ background: 'var(--sage)', color: 'var(--white)', padding: '120px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="section-label" style={{ background: 'var(--sage-dark)', color: 'var(--white)' }}>Verified & Current</span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: '20px', color: 'var(--white)' }}>Our Certifications & Credentials</h1>
          <p style={{ maxWidth: 600, margin: '0 auto', fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>
            Healthcare facilities and patients deserve to know exactly who they're trusting with their transport. Here's everything we have — verified, current, and available for your records.
          </p>
        </div>
      </div>

      <div className="section container">
        <div className="services-grid" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="service-card animate-fade-up">
            <div className="service-icon-wrapper"><ShieldCheck size={24} /></div>
            <h3>HIPAA Compliance</h3>
            <p className="text-muted">Fully certified and trained in handling Protected Health Information (PHI) securely at every step of transport.</p>
          </div>

          <div className="service-card animate-fade-up stagger-1">
            <div className="service-icon-wrapper"><FileKey size={24} /></div>
            <h3>NPI Registered</h3>
            <p className="text-muted">Registered with the National Plan and Provider Enumeration System (NPPES) for seamless facility integration.</p>
          </div>

          <div className="service-card animate-fade-up stagger-2">
            <div className="service-icon-wrapper"><Stethoscope size={24} /></div>
            <h3>First Aid & CPR / BLS</h3>
            <p className="text-muted">Drivers carry current Basic Life Support (BLS), CPR, and First Aid certifications.</p>
          </div>

          <div className="service-card animate-fade-up stagger-3">
            <div className="service-icon-wrapper"><CarFront size={24} /></div>
            <h3>Commercial Insurance</h3>
            <p className="text-muted">Fully insured with commercial NEMT liability coverage. Certificate of Insurance (COI) available upon request.</p>
          </div>
        </div>

        <div className="section" style={{ marginTop: 60, padding: '60px', background: 'var(--off-white)', borderRadius: 16, textAlign: 'center' }}>
          <h2>Need a copy for your facility records?</h2>
          <p className="text-muted" style={{ margin: '20px auto 30px', maxWidth: 600 }}>
            If your hospital or clinic requires a complete credentials packet (including EIN, COI, and Business Formation), we can email it within one business day.
          </p>
          <a href="mailto:desertkeysrentals@gmail.com" className="btn btn-primary" style={{ display: 'inline-flex', gap: 12 }}>
            <DownloadCloud size={20} /> Request Credentials Packet
          </a>
        </div>
      </div>
    </div>
  );
}
