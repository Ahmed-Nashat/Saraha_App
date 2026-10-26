import mongoose, { Types } from "mongoose";
import { enums } from "../../common/index.js";

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      minLength: 5,
      maxLength: 5000,
      required: function () {
        return !this?.images; // 0 => false || !0 => true
      },
    },
    images: {
      type: [String],
      required: function () {
        return !this?.content || !this?.content.length;
      },
    },
    receiverId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    senderId: {
      type: Types.ObjectId,
      ref: "user",
    },
    isKnownSender: {
      type: Boolean,
      default: false,
    },
    requestStatus: {
      type: Number,
      enum: Object.values(enums.requestStatusEnum),
      default: enums.requestStatusEnum.none,
    },
    senderName: String,
  },
  {
    timestamps: true,
    toObject: true,
    toJSON: true,
  },
);

export const messageModel = mongoose.model("message", messageSchema);
