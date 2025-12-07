const asyncHandler = require('express-async-handler');
const Player = require('../models/Player');
const { playerValidation } = require('../utils/validation');
const fs = require('fs');
const path = require('path');

// @desc    Get all players
// @route   GET /api/players
// @access  Public
const getPlayers = asyncHandler(async (req, res) => {
    // Pagination, Search, Sort
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.search
        ? {
            name: {
                $regex: req.query.search,
                $options: 'i',
            },
        }
        : {};

    const count = await Player.countDocuments({ ...keyword });
    const players = await Player.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ players, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get single player
// @route   GET /api/players/:id
// @access  Public
const getPlayerById = asyncHandler(async (req, res) => {
    const player = await Player.findById(req.params.id);

    if (player) {
        res.json(player);
    } else {
        res.status(404);
        throw new Error('Player not found');
    }
});

// @desc    Create a player
// @route   POST /api/players
// @access  Private
const createPlayer = asyncHandler(async (req, res) => {
    // Validate data (excluding image which is separate)
    const { error } = playerValidation(req.body);
    if (error) {
        res.status(400);
        throw new Error(error.details[0].message);
    }

    const { name, role, bio } = req.body;

    let image = 'no-photo.jpg';
    if (req.file) {
        // In production, you would upload to cloud (AWS S3, Cloudinary)
        // For this assignment, we use the local path relative to public/
        image = `/uploads/${req.file.filename}`;
    }

    const player = await Player.create({
        name,
        role,
        bio,
        image,
        user: req.user.id,
    });

    res.status(201).json(player);
});

// @desc    Update a player
// @route   PUT /api/players/:id
// @access  Private (Owner only)
const updatePlayer = asyncHandler(async (req, res) => {
    const { name, role, bio } = req.body;
    const player = await Player.findById(req.params.id);

    if (!player) {
        res.status(404);
        throw new Error('Player not found');
    }

    // Check ownership
    if (player.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized to update this player');
    }

    player.name = name || player.name;
    player.role = role || player.role;
    player.bio = bio || player.bio;

    if (req.file) {
        player.image = `/uploads/${req.file.filename}`;
    }

    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
});

// @desc    Delete a player
// @route   DELETE /api/players/:id
// @access  Private (Owner only)
const deletePlayer = asyncHandler(async (req, res) => {
    const player = await Player.findById(req.params.id);

    if (!player) {
        res.status(404);
        throw new Error('Player not found');
    }

    // Check ownership
    if (player.user.toString() !== req.user.id && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized to delete this player');
    }

    await player.deleteOne();
    res.json({ message: 'Player removed' });
});

module.exports = {
    getPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
};
