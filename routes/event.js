// routes/events.js
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// Create an event
router.post("/events", async (req, res) => {
  try {
    const { name, startTime, duration } = req.body;
    const event = new Event({ name, startTime, duration });
    await event.save();
    res.status(201).json({ event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/events", async (req, res) => {
  try {
    const currentTime = new Date();
    const tenMinutesLater = new Date(currentTime.getTime() + 10 * 60000);

    // Find upcoming events
    const upcomingEvents = await Event.find({
      startTime: { $gt: tenMinutesLater },
    });

    // Find live events
    const liveEvents = await Event.find({
        $or: [
          // Events starting within the next 10 minutes
          {
            startTime: { $gte: currentTime, $lte: tenMinutesLater }
          },
          // Events that started before the current time and are still ongoing
          {
            startTime: { $lt: currentTime },
            $expr: {
              $gte: [
                { $add: ["$startTime", { $multiply: ["$duration", 60000] }] },
                currentTime
              ]
            }
          }
        ]
      });

    // Find finished events
    const finishedEvents = await Event.find({
      startTime: { $lte: currentTime },
      $expr: {
        $gt: [
          { $add: ["$startTime", { $multiply: ["$duration", 60000] }] },
          currentTime,
        ],
      },
    });

    res.json({ upcomingEvents, liveEvents, finishedEvents });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, message2: "failure in startTime" });
  }
});

// Fetch live events

module.exports = router;
