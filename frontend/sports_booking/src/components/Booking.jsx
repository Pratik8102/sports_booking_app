import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Booking = () => {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [message, setMessage] = useState('');

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const centerId = params.get('center_id');
  const sportId = params.get('sport_id');

  const fetchAvailableSlots = async () => {
    if (date) {
      const response = await fetch(`/api/slots/${centerId}/${sportId}/${date}`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      const data = await response.json();
      setSlots(data);
    }
  };

  const handleBookSlot = async () => {
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ court_id: selectedSlot, date }),
      });

      if (!response.ok) {
        throw new Error('Failed to book slot');
      }

      setMessage('Slot booked successfully');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Book Slot</h1>
      <div className="mb-4">
        <label className="block mb-2">Select Date</label>
        <input 
          type="date"
          className="border px-4 py-2 w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <button 
        className="bg-green-500 text-white py-2 px-4 mb-4 rounded"
        onClick={fetchAvailableSlots}
        disabled={!date}
      >
        Check Available Slots
      </button>

      {slots.length > 0 && (
        <div className="mb-4">
          <label className="block mb-2">Available Slots</label>
          <select 
            className="border px-4 py-2 w-full"
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
          >
            <option value="">Select a Slot</option>
            {slots.map((slot, idx) => (
              <option key={idx} value={slot}>{slot}</option>
            ))}
          </select>
        </div>
      )}

      {message && <p className="text-green-500">{message}</p>}

      <button 
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleBookSlot}
        disabled={!selectedSlot}
      >
        Book Slot
      </button>
    </div>
  );
};

export default Booking;
