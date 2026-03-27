import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Facilities() {
  return (
    <div className="page-wrapper animate-fade-up">
      <div className="section" style={{ background: 'var(--off-white)', padding: '120px 0 80px' }}>
        <div className="container">
          <div style={{ maxWidth: 800 }}>
            <span className="section-label">For Coordinators & Case Managers</span>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: '24px' }}>NEMT Partnership for Healthcare Facilities</h1>
            <p className="text-muted" style={{ fontSize: '18px', lineHeight: 1.8 }}>
              Missed appointments. Delayed discharges. Patients without reliable rides. These problems cost your facility time, resources, and readmission risk. Desert Path Mobility is the Phoenix-area NEMT partner that shows up on time, every time — so your team can focus on care, not logistics.
            </p>
          </div>
        </div>
      </div>

      <div className="section container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 60 }}>
          
          <div>
            <h2 style={{ fontSize: 32, marginBottom: 32 }}>What a Partnership Looks Like</h2>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {[
                'Dedicated account contact for your facility — one call, one point of contact',
                'Same-day and scheduled trip requests accepted via phone, email, or form',
                'HIPAA-compliant communication at every step',
                'Pickup confirmation and trip status updates available',
                'Monthly invoicing available for high-volume facilities',
                'Credential verification packet delivered immediately'
              ].map((text, i) => (
                <li key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <CheckCircle2 color="var(--sage)" size={24} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 16, color: 'var(--muted)' }}>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 16, padding: 40, boxShadow: 'var(--shadow-md)' }}>
            <h2 style={{ marginBottom: 24 }}>Facility Partnership Inquiry</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label>Facility Name *</label>
                  <input type="text" required placeholder="Hospital / Clinic" />
                </div>
                <div>
                  <label>Your Name *</label>
                  <input type="text" required placeholder="Full name" />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label>Your Title / Role *</label>
                  <input type="text" required placeholder="Discharge Planner" />
                </div>
                <div>
                  <label>Phone Number *</label>
                  <input type="tel" required placeholder="(623) 555-0199" />
                </div>
              </div>

              <div>
                <label>Email Address *</label>
                <input type="email" required placeholder="you@facility.com" />
              </div>

              <div>
                <label>Type of Facility</label>
                <select>
                  <option>Hospital / Medical Center</option>
                  <option>Dialysis Center</option>
                  <option>Skilled Nursing Facility (SNF)</option>
                  <option>Assisted Living Community</option>
                  <option>Behavioral Health / Outpatient Clinic</option>
                </select>
              </div>

              <div>
                <label>Services Needed</label>
                <textarea rows="4" placeholder="Describe your average weekly transport volume and needs..."></textarea>
              </div>

              <button type="button" className="btn btn-primary" style={{ marginTop: 8 }}>
                Submit Partnership Inquiry <ArrowRight size={18} style={{ marginLeft: 8 }} />
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
