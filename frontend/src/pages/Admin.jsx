import React, { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function Admin() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem('adminKey'));
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const fetchRides = async () => {
      if (!adminKey) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/rides`, {
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": adminKey
          }
        });
        if (response.status === 401) {
          sessionStorage.removeItem('adminKey');
          setAdminKey(null);
          throw new Error('Unauthorized. Please enter the correct Admin Key.');
        }
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
  }, [adminKey]);

  const handleUpdateRide = async (rideId, updates) => {
    try {
      const response = await fetch(`${API_URL}/rides/${rideId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify(updates),
      });

      if (response.status === 401) {
        sessionStorage.removeItem('adminKey');
        setAdminKey(null);
        throw new Error('Unauthorized. Please enter the correct Admin Key.');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update ride');
      }

      const updatedRide = await response.json();
      setRides((prevRides) => prevRides.map(r => r.id === rideId ? updatedRide : r));
    } catch (err) {
      alert(`Error updating ride: ${err.message}`);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      sessionStorage.setItem('adminKey', inputValue.trim());
      setAdminKey(inputValue.trim());
      setInputValue('');
    }
  };

  if (!adminKey) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f8f9fa', zIndex: 9999
      }}>
        <div style={{
          background: 'white', padding: '40px', borderRadius: '8px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '24px', color: '#333' }}>Admin Access</h2>
          {error && <div style={{ color: '#d32f2f', background: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
          <form onSubmit={handleLoginSubmit}>
            <input 
              type="password" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter Admin Key"
              style={{
                width: '100%', padding: '12px', marginBottom: '16px',
                border: '1px solid #ccc', borderRadius: '4px', fontSize: '16px',
                boxSizing: 'border-box'
              }}
              autoFocus
            />
            <button 
              type="submit"
              style={{
                width: '100%', padding: '12px', background: '#004225', color: 'white',
                border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Loading rides...</div>;
  if (error) return <div style={{ padding: 40, textAlign: 'center', color: 'red' }}>Error: {error}</div>;

  const displayedRides = activeTab === 'recurring' 
    ? rides.filter(r => r.recurring && r.recurring.trim() !== '')
    : rides;

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ marginBottom: 24, fontSize: 24 }}>Admin - Ride Requests</h1>
      
      <div style={{ marginBottom: 24, display: 'flex', gap: '16px', borderBottom: '1px solid #e9ecef', paddingBottom: '8px' }}>
        <button 
          onClick={() => setActiveTab('all')}
          style={{ 
            padding: '8px 16px', 
            background: activeTab === 'all' ? '#004225' : 'transparent',
            color: activeTab === 'all' ? '#fff' : '#495057',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          All Rides
        </button>
        <button 
          onClick={() => setActiveTab('recurring')}
          style={{ 
            padding: '8px 16px', 
            background: activeTab === 'recurring' ? '#004225' : 'transparent',
            color: activeTab === 'recurring' ? '#fff' : '#495057',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          Recurring Rides
        </button>
      </div>
      
      {displayedRides.length === 0 ? (
        <p>No ride requests found for this filter.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderRadius: 8 }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Name</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Pickup</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Time</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Priority</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Recurring</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Driver</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {displayedRides.map((ride) => (
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
                      background: ride.priority === 'urgent' ? '#f8d7da' : (ride.priority === 'low' ? '#d1ecf1' : '#e2e3e5'),
                      color: ride.priority === 'urgent' ? '#721c24' : (ride.priority === 'low' ? '#0c5460' : '#383d41'),
                      textTransform: 'capitalize'
                    }}>
                      {ride.priority || 'Normal'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={ride.recurring}>
                    {ride.recurring ? ride.recurring : '-'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <input 
                      type="text" 
                      defaultValue={ride.driver_name || ''} 
                      placeholder="Assign driver..."
                      onBlur={(e) => {
                        const newDriver = e.target.value.trim() || null;
                        if (newDriver !== ride.driver_name) {
                          handleUpdateRide(ride.id, { driver_name: newDriver });
                        }
                      }}
                      style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ced4da', width: '100%' }}
                    />
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <select
                      value={ride.status}
                      onChange={(e) => handleUpdateRide(ride.id, { status: e.target.value })}
                      style={{
                        padding: '6px',
                        borderRadius: '4px',
                        border: '1px solid #ced4da',
                        background: '#fff'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="no_show">No Show</option>
                    </select>
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
