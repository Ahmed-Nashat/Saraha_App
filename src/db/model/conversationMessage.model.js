import mongoose, { Types } from "mongoose";

const conversationMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: Types.ObjectId,
      ref: "conversation",
      required: true,
    },
    senderId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 5000,
    },
  },
  { timestamps: true },
);

export const conversationMessageModel = mongoose.model(
  "conversationMessage",
  conversationMessageSchema,
);
