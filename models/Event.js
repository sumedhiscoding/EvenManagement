// models/event.js
const mongoose = require('mongoose');

// Define the Event schema
const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
