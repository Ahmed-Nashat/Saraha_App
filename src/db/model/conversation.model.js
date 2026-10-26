import mongoose, { Types } from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    messageId: {
      type: Types.ObjectId,
      ref: "message",
      required: true,
      unique: true,
    },
    participants: [
      {
        type: Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);
export const conversationModel = mongoose.model(
  "conversation",
  conversationSchema,
);
