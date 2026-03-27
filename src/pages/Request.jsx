import React from 'react';
import { ArrowRight, PhoneCall } from 'lucide-react';

export default function Request() {
  return (
    <div className="page-wrapper animate-fade-up">
      <div className="section" style={{ background: 'var(--sage-pale)', padding: '120px 0 80px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label">Book an Appointment</span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: '20px' }}>Request Your Ride</h1>
          <p className="text-muted" style={{ maxWidth: 600, margin: '0 auto', fontSize: '18px' }}>
            Fill out the form below and we'll contact you to confirm your trip. For urgent requests or same-day transport, please call us directly.
          </p>
          <a href="tel:6236883533" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 32, fontWeight: 600, color: 'var(--sage-dark)', fontSize: 24 }}>
            <PhoneCall size={28} /> (623) 688-3533
          </a>
        </div>
      </div>

      <div className="section container" style={{ maxWidth: 800 }}>
        <div style={{ background: 'var(--white)', padding: '60px', borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label>Patient Name *</label>
                <input type="text" required placeholder="Full Name" />
              </div>
              <div>
                <label>Date of Birth *</label>
                <input type="date" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label>Phone Number *</label>
                <input type="tel" required placeholder="(xxx) xxx-xxxx" />
              </div>
              <div>
                <label>Alternate / Caregiver Phone</label>
                <input type="tel" placeholder="(xxx) xxx-xxxx" />
              </div>
            </div>

            <div>
              <label>Pickup Address *</label>
              <input type="text" required placeholder="Street address, City, ZIP" />
            </div>

            <div>
              <label>Destination *</label>
              <input type="text" required placeholder="Medical facility name and address" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
              <div>
                <label>Appointment Date *</label>
                <input type="date" required />
              </div>
              <div>
                <label>Appointment Time *</label>
                <input type="time" required />
              </div>
              <div>
                <label>Requested Pickup *</label>
                <input type="time" required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label>Return Trip Needed?</label>
                <select>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div>
                <label>Mobility Assistance</label>
                <select>
                  <option>Can walk independently</option>
                  <option>Needs arm assistance</option>
                  <option>Uses walker / cane</option>
                  <option>Uses manual wheelchair</option>
                  <option>Uses power wheelchair</option>
                </select>
              </div>
            </div>

            <div>
              <label>Is this a recurring appointment?</label>
              <input type="text" placeholder="Yes, every Tuesday at 9am (or leave blank if no)" />
            </div>

            <button type="button" className="btn btn-primary" style={{ marginTop: 16, width: '100%', padding: '16px' }}>
              Submit Ride Request <ArrowRight size={18} style={{ marginLeft: 8 }} />
            </button>

            <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', marginTop: 16 }}>
              By submitting this form, you acknowledge that Desert Path Mobility Services will contact you by phone or text to confirm your trip. Your information is kept confidential in accordance with HIPAA guidelines.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
