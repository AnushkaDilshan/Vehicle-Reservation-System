import React, { useEffect, useState } from 'react';

const ViewReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null); // For handling edit

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/reservation/reservations/user/${localStorage.getItem('userId')}`);
        const result = await response.json();
         //console.log(result);
        if (response.ok) {
          //console.log(result);
          if (result.reservation && result.reservation.length > 0) {
            setReservations(result.reservation);
            console.log(result);
          } else {
            setError('No reservations found for this user');
          }
        } else {
          setError('Failed to fetch reservations');
        }
      } catch (error) {
        setError('An error occurred while fetching reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []); // Empty array means this effect runs once on mount

  const handleDelete = async (reservationId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this reservation?');
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:4000/api/reservation/reservations/${reservationId}`, {
          method: 'DELETE',
        });
        const result = await response.json();
        
        if (response.ok) {
          setReservations(prevReservations => prevReservations.filter(res => res._id !== reservationId));
        } else {
          setError(result.message || 'Failed to delete reservation');
        }
      } catch (error) {
        setError('An error occurred while deleting the reservation');
      }
    }
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation); // Set reservation for editing
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/reservation/reservations/${editingReservation._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingReservation),
      });
      const result = await response.json();

      if (response.ok) {
        setReservations(prevReservations => 
          prevReservations.map(res => 
            res._id === editingReservation._id ? editingReservation : res
          )
        );
        setEditingReservation(null); // Reset the editing form
      } else {
        setError(result.message || 'Failed to update reservation');
      }
    } catch (error) {
      setError('An error occurred while updating the reservation');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    if (name === "wantedtime") {
      updatedValue = parseFloat(value) || 0;  // Ensure a number is always set
      const calculatedAmount = updatedValue * 100; // Calculate amount based on time (1 hour = 100 LKR)
      setEditingReservation((prev) => ({
        ...prev,
        wantedtime: updatedValue,
        amount: calculatedAmount,  // Update the amount field based on the time
      }));
    } else {
      setEditingReservation((prev) => ({
        ...prev,
        [name]: updatedValue,
      }));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>All Reservations</h2>
      {reservations.length === 0 ? (
        <div>No reservations found.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Vehicle Number</th>
              <th>Name</th>
              <th>Email</th>
              <th>Date</th>
              <th>Service</th>
              <th>Pickup Location</th>
              <th>Drop-off Location</th>
              <th>Wanted Time (hrs)</th>
              <th>Amount (LKR)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.vehicleNum}</td>
                <td>{reservation.name}</td>
                <td>{reservation.email}</td>
                <td>{reservation.wanteddate}</td>
                <td>{reservation.service}</td>
                <td>{reservation.locationpick}</td>
                <td>{reservation.locationdrop}</td>
                <td>{reservation.wantedtime}</td>
                <td>{reservation.amount}</td>
                <td>
                  <button onClick={() => handleEdit(reservation)} style={{ marginRight: '10px' }}>Edit</button>
                  <button onClick={() => handleDelete(reservation._id)} style={{ backgroundColor: 'red', color: 'white' }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Form */}
      {editingReservation && (
        <div style={{ marginTop: '20px' }}>
          <h3>Edit Reservation</h3>
          <form onSubmit={handleUpdate}>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={editingReservation.name}
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
                value={editingReservation.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="locationpick">Pickup Location:</label>
              <input
                type="text"
                id="locationpick"
                name="locationpick"
                value={editingReservation.locationpick}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="locationdrop">Drop-off Location:</label>
              <input
                type="text"
                id="locationdrop"
                name="locationdrop"
                value={editingReservation.locationdrop}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="wantedtime">Wanted Time (hrs):</label>
              <input
                type="number"
                id="wantedtime"
                name="wantedtime"
                value={editingReservation.wantedtime}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="amount">Amount (LKR):</label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={editingReservation.amount}
                readOnly
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <button type="submit" style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px' }}>
              Update Reservation
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ViewReservations;
