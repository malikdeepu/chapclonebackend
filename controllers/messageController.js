const Message = require('../models/Message');
const User = require('../models/User');  // Import User model to get ObjectIds

// Get messages between the logged-in user and the specified userId
exports.getMessages = async (req, res) => {
  const { userId } = req.params;
  const { userId: loggedInUserId } = req.body;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: userId },
        { senderId: userId, receiverId: loggedInUserId },
      ],
    })
      .sort({ timestamp: 1 })
      .populate('senderId', 'username')  // Populate with sender's username
      .populate('receiverId', 'username');  // Populate with receiver's username

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  const { senderUsername, receiverUsername, text } = req.body;

  try {
    // Lookup the sender and receiver by their usernames
    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or Receiver not found' });
    }

    // Create the message using the ObjectIds of sender and receiver
    const message = new Message({
      senderId: sender._id,  // Use ObjectId of sender
      receiverId: receiver._id,  // Use ObjectId of receiver
      text: text,
    });

    await message.save();  // Save the message to the database
    res.status(201).json(message);  // Return the saved message

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};
