import React, { useState } from 'react';
import { ArrowRight, PhoneCall } from 'lucide-react';

export default function Request() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    
    // Basic phone validation (check if at least 10 digits when stripped of non-numeric)
    const phone = form.phone.value;
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setErrorMessage('Please enter a valid phone number with at least 10 digits.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    // Combine date + time into ISO format
    const aptDate = form.aptDate.value;
    const aptTime = form.aptTime.value;
    const appointmentTime = new Date(`${aptDate}T${aptTime}`).toISOString();

    // Combine extra fields into notes
    const dob = form.dob.value;
    const altPhone = form.altPhone.value;
    const reqPickup = form.reqPickup.value;
    const returnTrip = form.returnTrip.value;
    const mobility = form.mobility.value;
    const recurring = form.recurring.value;

    const notes = [
      `DOB: ${dob}`,
      altPhone ? `Alt Phone: ${altPhone}` : '',
      `Req Pickup: ${reqPickup}`,
      `Return Trip: ${returnTrip}`,
      `Mobility: ${mobility}`,
      recurring ? `Recurring: ${recurring}` : ''
    ].filter(Boolean).join(' | ');

    const payload = {
      patient_name: form.patientName.value,
      phone: phone,
      pickup_address: form.pickup.value,
      dropoff_address: form.destination.value,
      appointment_time: appointmentTime,
      notes: notes
    };

    try {
      const response = await fetch('/rides', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to submit ride request');
      }

      setStatus('success');
      form.reset();
    } catch (err) {
      console.error(err);
      setErrorMessage('Something went wrong. Please try again later or call us directly.');
      setStatus('error');
    }
  };

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
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <h2 style={{ color: 'var(--sage-dark)', marginBottom: 16 }}>Request Received</h2>
              <p style={{ fontSize: 18, color: 'var(--muted)' }}>
                Your ride request has been received. We will contact you shortly.
              </p>
              <button onClick={() => setStatus('idle')} className="btn btn-primary" style={{ marginTop: 24 }}>
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {status === 'error' && (
                <div style={{ padding: 16, background: '#fee2e2', color: '#991b1b', borderRadius: 8, fontWeight: 500 }}>
                  {errorMessage}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label>Patient Name *</label>
                  <input name="patientName" type="text" required placeholder="Full Name" />
                </div>
                <div>
                  <label>Date of Birth *</label>
                  <input name="dob" type="date" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label>Phone Number *</label>
                  <input name="phone" type="tel" required placeholder="(xxx) xxx-xxxx" />
                </div>
                <div>
                  <label>Alternate / Caregiver Phone</label>
                  <input name="altPhone" type="tel" placeholder="(xxx) xxx-xxxx" />
                </div>
              </div>

              <div>
                <label>Pickup Address *</label>
                <input name="pickup" type="text" required placeholder="Street address, City, ZIP" />
              </div>

              <div>
                <label>Destination *</label>
                <input name="destination" type="text" required placeholder="Medical facility name and address" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
                <div>
                  <label>Appointment Date *</label>
                  <input name="aptDate" type="date" required />
                </div>
                <div>
                  <label>Appointment Time *</label>
                  <input name="aptTime" type="time" required />
                </div>
                <div>
                  <label>Requested Pickup *</label>
                  <input name="reqPickup" type="time" required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <label>Return Trip Needed?</label>
                  <select name="returnTrip">
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
                <div>
                  <label>Mobility Assistance</label>
                  <select name="mobility">
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
                <input name="recurring" type="text" placeholder="Yes, every Tuesday at 9am (or leave blank if no)" />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ marginTop: 16, width: '100%', padding: '16px', opacity: status === 'loading' ? 0.7 : 1 }}
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Submitting...' : (
                  <>Submit Ride Request <ArrowRight size={18} style={{ marginLeft: 8 }} /></>
                )}
              </button>

              <p style={{ fontSize: 14, color: 'var(--sage-dark)', textAlign: 'center', marginTop: -8, fontWeight: 500 }}>
                You will receive a confirmation email once your ride is scheduled.
              </p>

              <p style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'center', marginTop: 16 }}>
                By submitting this form, you acknowledge that Desert Path Mobility Services will contact you by phone or text to confirm your trip. Your information is kept confidential in accordance with HIPAA guidelines.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
