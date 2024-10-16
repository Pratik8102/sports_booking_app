const express = require('express');
const Booking = require('../models/Booking');
const Center = require('../models/Center');
const Sport = require('../models/Sport');
const Court = require('../models/Court');
const { verifyToken, isManager } = require('../middleware/authMiddleware');
const router = express.Router();

// Helper function to convert DD-MM-YYYY to a valid Date object
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);  // Convert to YYYY-MM-DD format
};

// Route to get all available centers
router.get('/centers', verifyToken, async (req, res) => {
  try {
    const centers = await Center.find(); // Fetch all centers
    if (centers.length === 0) {
      return res.status(404).json({ message: 'No centers found' });
    }
    res.status(200).json(centers);
  } catch (error) {
    console.error('Error retrieving centers:', error);
    res.status(500).json({ error: 'Error retrieving centers' });
  }
});

// Route to get all sports for a specific center
router.get('/sports', verifyToken, async (req, res) => {
  const { center_id } = req.query;

  try {
    if (!center_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid center ID format' });
    }

    const sports = await Sport.find({ center_id });  // Find sports for a given center

    if (sports.length === 0) {
      return res.status(404).json({ message: 'No sports found for this center' });
    }

    res.status(200).json(sports);
  } catch (error) {
    console.error('Error retrieving sports:', error);
    res.status(500).json({ error: 'Error retrieving sports', details: error.message });
  }
});

// Route to get available slots for a specific court and date
router.get('/slots/:center_id/:sport_id/:date', verifyToken, async (req, res) => {
  const { center_id, sport_id, date } = req.params;

  try {
    if (!center_id.match(/^[0-9a-fA-F]{24}$/) || !sport_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid center or sport ID format' });
    }

    const parsedDate = parseDate(date);  // Convert date string to Date object
    if (isNaN(parsedDate)) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Find courts that belong to the sport within the specified center
    const courts = await Court.find({ sport_id });

    if (courts.length === 0) {
      return res.status(404).json({ message: 'No courts found for this sport' });
    }

    // Get the court IDs to find bookings for the given date
    const courtIds = courts.map(court => court._id);

    // Find all bookings for the specified courts and date
    const bookings = await Booking.find({ court_id: { $in: courtIds }, date: parsedDate });

    // Get available slots for the courts (slots that aren't booked)
    const availableSlots = courts.flatMap(court => {
      const bookedSlots = bookings.filter(booking => booking.court_id.equals(court._id)).map(booking => booking.slot);
      return court.slots.filter(slot => !bookedSlots.includes(slot));
    });

    if (availableSlots.length === 0) {
      return res.status(404).json({ message: 'No available slots for the selected date' });
    }

    res.status(200).json(availableSlots);
  } catch (error) {
    console.error('Error retrieving slots:', error);
    res.status(500).json({ error: 'Error retrieving slots', details: error.message });
  }
});

// Manager view all bookings for a specific sport
router.get('/bookings/sport/:sport_id', verifyToken, isManager, async (req, res) => {
  let { sport_id } = req.params;

  try {
    sport_id = sport_id.trim();

    if (!sport_id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid sport ID format' });
    }

    const courts = await Court.find({ sport_id });

    if (courts.length === 0) {
      return res.status(404).json({ message: 'No courts found for this sport' });
    }

    const courtIds = courts.map(court => court._id);

    const bookings = await Booking.find({ court_id: { $in: courtIds } });

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found for this sport' });
    }

    res.json(bookings);
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ error: 'Error retrieving bookings', details: error.message });
  }
});

// Create a new center (only managers can do this)
router.post('/center', verifyToken, isManager, async (req, res) => {
  const { name, location } = req.body;

  const center = new Center({ name, location });
  try {
    await center.save();
    res.status(201).json({ message: 'Center created successfully', center });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create center' });
  }
});

// Create a new sport for a center (only managers can do this)
router.post('/sport', verifyToken, isManager, async (req, res) => {
  const { name, center_id } = req.body;

  const sport = new Sport({ name, center_id });
  try {
    await sport.save();
    res.status(201).json({ message: 'Sport created successfully', sport });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sport' });
  }
});

// Create a new court for a sport (only managers can do this)
router.post('/court', verifyToken, isManager, async (req, res) => {
  const { name, sport_id, slots } = req.body;

  const court = new Court({ name, sport_id, slots });
  try {
    await court.save();
    res.status(201).json({ message: 'Court created successfully', court });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create court' });
  }
});

// Add or update slots for a specific court (only managers can do this)
router.put('/court/:courtId/slots', verifyToken, isManager, async (req, res) => {
  const { slots } = req.body;
  const courtId = req.params.courtId;

  try {
    const court = await Court.findById(courtId);

    if (!court) {
      return res.status(404).json({ message: 'Court not found' });
    }

    court.slots = slots;  // Replace existing slots with new ones
    await court.save();

    res.status(200).json({ message: 'Slots updated successfully', court });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update slots' });
  }
});

module.exports = router;
