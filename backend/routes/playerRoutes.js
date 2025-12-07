const express = require('express');
const router = express.Router();
const {
    getPlayers,
    getPlayerById,
    createPlayer,
    updatePlayer,
    deletePlayer,
} = require('../controllers/playerController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getPlayers)
    .post(protect, upload.single('image'), createPlayer);

router.route('/:id')
    .get(getPlayerById)
    .put(protect, upload.single('image'), updatePlayer)
    .delete(protect, deletePlayer);

module.exports = router;
