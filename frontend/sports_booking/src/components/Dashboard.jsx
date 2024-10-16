import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [centers, setCenters] = useState([]);
  const [sports, setSports] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCenters = async () => {
      const response = await fetch('http://localhost:5000/api/manager/centers', {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }
      });
      const data = await response.json();
      setCenters(data);
    };

    fetchCenters();
  }, []);

  const handleCenterChange = async (e) => {
    setSelectedCenter(e.target.value);
    const response = await fetch(`http://localhost:5000/api/manager/sports?center_id=${e.target.value}`, {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      }
    });
    const data = await response.json();
    setSports(data);
  };

  const handleProceed = () => {
    if (selectedSport) {
      navigate(`/booking?center_id=${selectedCenter}&sport_id=${selectedSport}`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4">
        <label className="block mb-2">Select Center</label>
        <select 
          className="border px-4 py-2 w-full"
          value={selectedCenter}
          onChange={handleCenterChange}
        >
          <option value="">Select a Center</option>
          {centers.map((center) => (
            <option key={center._id} value={center._id}>{center.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Select Sport</label>
        <select 
          className="border px-4 py-2 w-full"
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value)}
          disabled={!selectedCenter}
        >
          <option value="">Select a Sport</option>
          {sports.map((sport) => (
            <option key={sport._id} value={sport._id}>{sport.name}</option>
          ))}
        </select>
      </div>

      <button 
        className="bg-blue-500 text-white py-2 px-4 rounded"
        onClick={handleProceed}
        disabled={!selectedSport}
      >
        Proceed to Booking
      </button>
    </div>
  );
};

export default Dashboard;
