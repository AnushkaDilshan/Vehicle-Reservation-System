import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
function VehicleView() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        const response = await fetch("http://localhost:4000/api/vehicles/getVehicles", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  if (loading) return <div className="text-center p-10">Loading vehicles...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Available Vehicles</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{vehicle.name}</h2>
            <p>Status: {vehicle.availabilityStatus}</p>
            <p>Model: {vehicle.model}</p>
            <p>Registration Number: {vehicle.registrationNumber}</p>
            <p>Color: {vehicle.color}</p>
            <p>Seating Capacity: {vehicle.seatingCapacity}</p>
            <button
               onClick={() => navigate(`/user/reservationadd/${vehicle.registrationNumber}`)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehicleView;
