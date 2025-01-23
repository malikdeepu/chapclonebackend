const Message = require('../models/Message');
const User = require('../models/User'); 

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
      .populate('senderId', 'username')  
      .populate('receiverId', 'username'); 
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

    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'Sender or Receiver not found' });
    }

   
    const message = new Message({
      senderId: sender._id,  
      receiverId: receiver._id,  
      text: text,
    });

    await message.save(); 
    res.status(201).json(message); 

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};
