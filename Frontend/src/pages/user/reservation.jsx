import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    vehicleNum: '{id}',
    userId: '',
    driverID: '',
    name: '',
    email: '',
    phonenumber: '',
    address: '',
    service: '',
    locationpick: '',
    locationdrop: '',
    wantedtime: '',
    amount: '',
    wanteddate:''
  });
 const { id } = useParams();
  const [drivers, setDrivers] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    //const storedUserId = '680f61242610f207c9c0fdae';
    if (storedUserId || id) {
      setFormData(prev => ({
        ...prev,
        userId: storedUserId || '',
        vehicleNum: id || '',
      }));
    }
  
    fetchDrivers();
  }, [id]); // <<< add id as dependency
  

  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/driver'); 
      const result = await response.json();
      if (result.success) {
        setDrivers(result.posts);
      } else {
        console.error('Failed to fetch drivers');
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };
const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "wantedtime") {
      const time = parseFloat(value) || 0;
      setFormData(prev => ({
        ...prev,
        wantedtime: value,
        amount: time * 100, 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:4000/api/reservation/reservations', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const result = await response.json();
//       if (response.ok) {
//         setMessage({ type: 'success', text: result.message });
//       } else {
//         setMessage({ type: 'error', text: result.message });
//       }
//     } catch (error) {
//       setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
//     }
//   };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/reservation/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
      if (response.ok) {
        setMessage({ type: 'success', text: result.message });
  
   
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Reservation Confirmation', 20, 20);
  
        doc.setFontSize(12);
        doc.text(`Name: ${formData.name}`, 20, 40);
        doc.text(`Email: ${formData.email}`, 20, 50);
        doc.text(`Phone Number: ${formData.phonenumber}`, 20, 60);
        doc.text(`Service: ${formData.service}`, 20, 70);
        doc.text(`Vehicle Number: ${formData.vehicleNum}`, 20, 80);
        doc.text(`Driver ID: ${formData.driverID}`, 20, 90);
        doc.text(`Pick-up: ${formData.locationpick}`, 20, 100);
        doc.text(`Drop-off: ${formData.locationdrop}`, 20, 110);
        doc.text(`Date: ${formData.wanteddate}`, 20, 110);
        doc.text(`Wanted Time: ${formData.wantedtime} hours`, 20, 120);
        doc.text(`Total Amount: Rs. ${formData.amount}`, 20, 130);
  

        doc.save('Reservation-Details.pdf');
        
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    }
  };
  
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Reservation Form</h2>
      {message && (
        <div
          style={{
            padding: '10px',
            backgroundColor: message.type === 'success' ? 'green' : 'red',
            color: 'white',
            marginBottom: '20px',
          }}
        >
          {message.text}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        {/* Hidden User ID */}
        <input type="hidden" name="userId" value={formData.userId} readOnly />

        {/* Vehicle Number */}
        <input
  type="text"
  id="vehicleNum"
  name="vehicleNum"
  value={formData.vehicleNum}
  onChange={handleChange}
  required
  style={{ width: '100%', padding: '8px' }}
  readOnly // <<< Add this!
/>


        {/* Driver Dropdown */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="driverID">Select Driver:</label>
          <select
            id="driverID"
            name="driverID"
            value={formData.driverID}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">-- Select a Driver --</option>
            {drivers.map((driver) => (
              <option key={driver._id} value={driver._id}>
                {driver.DriverName} - {driver.DriverPhone}
              </option>
            ))}
          </select>
        </div>

        {/* Other Inputs */}
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="phonenumber">Phone Number:</label>
          <input
            type="text"
            id="phonenumber"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        {/* <div style={{ marginBottom: '10px' }}>
  <label htmlFor="service">Service Type:</label>
  <select
    id="service"
    name="service"
    value={formData.service}
    onChange={handleChange}
    required
    style={{ width: '100%', padding: '8px' }}
  >
    <option value="">-- Select Service --</option>
    <option value="Wedding">Wedding</option>
    <option value="Other">Other</option>
  </select>
</div> */}


<div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
          <label htmlFor="service">Service Type:</label>
  <select
    id="service"
    name="service"
    value={formData.service}
    onChange={handleChange}
    required
    style={{ width: '100%', padding: '8px' }}
  >
    <option value="">-- Select Service --</option>
    <option value="Wedding">Wedding</option>
    <option value="Other">Other</option>
  </select>
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="locationdrop">Date:</label>
            <input
              type="Date"
              id="wanteddate"
              name="wanteddate"
              value={formData.wanteddate}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        </div>

        {/* Pickup and Drop */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="locationpick">Pick-up Location:</label>
            <input
              type="text"
              id="locationpick"
              name="locationpick"
              value={formData.locationpick}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="locationdrop">Drop-off Location:</label>
            <input
              type="text"
              id="locationdrop"
              name="locationdrop"
              value={formData.locationdrop}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
        </div>

        {/* Time and Amount */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="wantedtime">Wanted Time (hours):</label>
            <input
              type="number"
              id="wantedtime"
              name="wantedtime"
              value={formData.wantedtime}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
  <label htmlFor="amount">Amount (LKR):</label>
  <input
    type="number"
    id="amount"
    name="amount"
    value={formData.amount}
    readOnly // <-- user can't manually edit it
    style={{ width: '100%', padding: '8px' }}
  />
</div>

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Submit Reservation
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
