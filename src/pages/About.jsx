import React from 'react';

export default function About() {
  return (
    <div className="page-wrapper animate-fade-up">
      <div className="section" style={{ background: 'var(--off-white)', padding: '120px 0 80px' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-label">Our Story</span>
          <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', marginBottom: '20px' }}>Why Desert Path Exists</h1>
          <p className="text-muted" style={{ maxWidth: 600, margin: '0 auto', fontSize: '18px' }}>
            To make medical transportation in Phoenix accessible, dependable, and dignified — so that no patient misses an appointment because they couldn't get there.
          </p>
        </div>
      </div>

      <div className="section container" style={{ maxWidth: 800 }}>
        <div style={{ borderLeft: '4px solid var(--sage)', paddingLeft: 40, margin: '0 0 60px' }}>
          <p style={{ fontSize: '20px', lineHeight: 1.8, marginBottom: 24 }}>
            Desert Path Mobility Services was founded in Phoenix, Arizona. We launched with the belief that reliable medical transport shouldn't be the hardest part of a care plan.
          </p>
          <p style={{ fontSize: '18px', color: 'var(--muted)', lineHeight: 1.8 }}>
            Today, Desert Path operates across Greater Phoenix with a fleet of clean, well-maintained vehicles and a growing list of facility partnerships. We're fully certified, fully insured, and fully committed to making every ride as smooth and dignified as the care our patients receive.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 32, marginBottom: 32 }}>Our Values</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div style={{ background: 'var(--white)', padding: 32, borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ color: 'var(--sage)', marginBottom: 16 }}>Reliability</h3>
              <p className="text-muted">When we say we'll be there, we're there. Zero missed shifts, zero compromised pickups.</p>
            </div>
            
            <div style={{ background: 'var(--white)', padding: 32, borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ color: 'var(--sage)', marginBottom: 16 }}>Dignity</h3>
              <p className="text-muted">Every patient is treated with respect, patience, and absolute bedside-manner care.</p>
            </div>
            
            <div style={{ background: 'var(--white)', padding: 32, borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ color: 'var(--sage)', marginBottom: 16 }}>Compliance</h3>
              <p className="text-muted">We take HIPAA, safety, and certification seriously. No shortcuts in healthcare.</p>
            </div>
            
            <div style={{ background: 'var(--white)', padding: 32, borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ color: 'var(--sage)', marginBottom: 16 }}>Community</h3>
              <p className="text-muted">We're a Phoenix business serving Phoenix people.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
