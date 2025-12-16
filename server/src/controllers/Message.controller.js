import mongoose from "mongoose";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";

////////////send message ///////////////
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const senderId = req.user.id;
    const receiverId = req.params.receiverId;

    const newMessage = new Message({
      sender: senderId,
      receiver: receiverId,
      content: message,
    });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" }, err);
  }
};

/////////////get chat list ///////////////
export const getChatList = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    //users I sent messages to
    const sentTo = await Message.distinct("receiver", { sender: userId });

    //users I received messages from
    const receivedFrom = await Message.distinct("sender", { receiver: userId });

    const chatUserIds = [...new Set([...sentTo, ...receivedFrom])].filter(
      (id) => id.toString() !== userId.toString()
    );

    //fetch user details
    const users = await User.find(
      { _id: { $in: chatUserIds } },
      { username: 1 } //only return username
    );

    res.status(200).json(users);
  } catch (err) {
    console.error("getchatlist error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
