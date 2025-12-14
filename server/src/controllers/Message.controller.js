import Message from "../models/Message.model.js";

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
  const sentTo = await Message.distinct("receiverId", {senderId: userId});

  const receivedFrom = await Message.distinct("senderId", {receiverId: userId});

  const chatList = Array.from(new Set([...sentTo, ...receivedFrom]));

  res.status(200).json(chatList);
}