import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: { type: String, required: true },
  Timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Message", messageSchema);
