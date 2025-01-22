const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');

// Route to get all messages between the logged-in user and another user
router.get('/:userId', getMessages);

// Route to send a new message
router.post('/', sendMessage);

module.exports = router;
