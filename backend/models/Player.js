const mongoose = require('mongoose');

const playerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        role: {
            type: String,
            required: [true, 'Please add a role'], // e.g., Batsman, Bowler
            trim: true,
        },
        bio: {
            type: String,
            required: [true, 'Please add a bio'],
        },
        image: {
            type: String,
            default: 'no-photo.jpg',
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true, // Ownership: User who created the player
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Player', playerSchema);
