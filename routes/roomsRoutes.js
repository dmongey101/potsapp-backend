const express = require('express');
const router = express.Router();

const roomsController = require('../controllers/rooms/room');

router.get('/getRooms', roomsController.getRooms);
router.get('/getPlayers/:room', roomsController.getPlayers);
router.post('/createRoom', roomsController.createRoom);
router.post('/joinRoom', roomsController.joinRoom);
module.exports = router;