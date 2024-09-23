const express = require("express");
const { createChat, getChatMessages } = require("../controllers/chatCtrl");
const isAuthenticated = require("../middlewares/isAuth");

const chatRouter = express.Router();

// Create a chat message
chatRouter.post("/api/v1/chats", isAuthenticated, createChat);

// Get chat messages for a specific ad
chatRouter.get("/api/v1/chats/:adId", isAuthenticated, getChatMessages);

module.exports = chatRouter;
