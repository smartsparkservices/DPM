import React, { useEffect, useState } from 'react';

export default function Admin() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch('/rides');
        if (!response.ok) throw new Error('Failed to fetch rides');
        const data = await response.json();
        setRides(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading rides...</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24, fontSize: 24 }}>Admin - Ride Requests</h1>
      
      {rides.length === 0 ? (
        <p>No ride requests found.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 8 }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Pickup</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Time</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rides.map((ride) => (
                <tr key={ride.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                  <td style={{ padding: '12px 16px' }}>{ride.patient_name}</td>
                  <td style={{ padding: '12px 16px' }}>{ride.pickup_address}</td>
                  <td style={{ padding: '12px 16px' }}>
                    {new Date(ride.appointment_time).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: 4, 
                      fontSize: 12, 
                      fontWeight: 500,
                      background: ride.status === 'pending' ? '#fff3cd' : '#e2e3e5',
                      color: ride.status === 'pending' ? '#856404' : '#383d41'
                    }}>
                      {ride.status || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
