const asyncHandler = require("express-async-handler");
const Chat = require("../model/chat");

// Create a chat message
const createChat = asyncHandler(async (req, res) => {
  const { adId, receiverId, message } = req.body;
  const senderId = req.user._id; // Logged-in user

  // Validate the required fields
  if (!adId || !receiverId || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Create the chat message
  const chatMessage = await Chat.create({
    ad: adId,
    sender: senderId,
    receiver: receiverId,
    message,
  });

  res.status(201).json({
    message: "Chat message sent successfully",
    chatMessage,
  });
});

// Get chat messages for a specific ad
const getChatMessages = asyncHandler(async (req, res) => {
  const { adId } = req.params;

  const messages = await Chat.find({ ad: adId })
    .populate("sender", "username")
    .populate("receiver", "username");

  res.status(200).json({ messages });
});

module.exports = {
  createChat,
  getChatMessages,
};
