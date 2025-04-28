import Reservation from '../models/reservation.js';

// Add a reservation (Insert)
export async function reservationAdd(req, res) {
    const data = req.body;
    
    try {
        // Check if reservation with the same email already exists
        const existingReservation = await Reservation.findOne({ email: data.email });
        if (existingReservation) {
            return res.status(400).json({ message: "A reservation already exists with this email" });
        }

        // Create a new reservation
        const newReservation = new Reservation(data);
        await newReservation.save();

        // Send success response
        res.status(201).json({ message: "Reservation added successfully!", reservation: newReservation });
    } catch (e) {
        console.error("Error adding reservation:", e);
        return res.status(500).json({ error: "Reservation creation failed!" });
    }
}

// Find all reservations (View)
export async function reservationFind(req, res) {
    try {
        const reservations = await Reservation.find();

        if (reservations.length === 0) {
            return res.status(404).json({ success: false, message: "No reservations found" });
        }

        return res.status(200).json({ success: true, reservations });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// Find one reservation by ID (View specific)
export async function reservationFindOne(req, res) {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            return res.status(404).json({ success: false, message: "Reservation not found" });
        }
        return res.status(200).json({ success: true, reservation });
    } catch (error) {
        console.error("Error finding reservation:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}


// Update a reservation (Update)
export async function reservationUpdate(req, res) {
    const { vehicleNum, userId, driverID, name, email, phonenumber, address, service, locationpick, locationdrop, wantedtime, amount } = req.body;
    const reservationId = req.params.id;

    try {
        // Validate required fields
        if (!vehicleNum || !userId || !driverID || !name || !email || !phonenumber || !address || !service) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Update the reservation
        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            {
                $set: {
                    vehicleNum,
                    userId,
                    driverID,
                    name,
                    email,
                    phonenumber,
                    address,
                    service,
                    locationpick,
                    locationdrop,
                    wantedtime,
                    amount
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedReservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        return res.status(200).json({
            success: "Reservation updated successfully",
            reservation: updatedReservation
        });
    } catch (err) {
        console.error("Error updating reservation:", err);
        return res.status(500).json({ error: err.message });
    }
}

// Delete a reservation (Delete)
export async function reservationDelete(req, res) {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id);

        if (!deletedReservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }

        return res.json({ message: "Reservation deleted successfully", deletedReservation });
    } catch (err) {
        console.error("Error deleting reservation:", err);
        return res.status(500).json({ error: err.message });
    }
}
export async function reservationFindUserId(req, res) {
    try {
        const reservation = await Reservation.find(req.params.userId);
        if (!reservation) {
            return res.status(404).json({ success: false, message: "Reservation not found" });
        }
        return res.status(200).json({ success: true, reservation });
    } catch (error) {
        console.error("Error finding reservation:", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}
