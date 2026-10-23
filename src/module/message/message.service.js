import { messageTypeEnum } from "../../common/enum/message.enum.js";
import {
  badRequestException,
  userRepo,
  messageRepo,
  notFoundException,
} from "../../common/index.js";

export const sendMessage = async (images, data, senderId) => {
  const { receiverId } = data;

  if (images && images.length > 0) {
    data.images = images.map((file) => {
      const normalizedPath = file.path.replace(/\\/g, "/");
      return `/uploads${normalizedPath.split("/uploads")[1]}`;
    });
  }

  const receiver = await userRepo.findById({ id: receiverId });
  if (!receiver) badRequestException("User not found");

  if (senderId) {
    if (senderId == receiverId) {
      badRequestException("You can't send message to yourself");
    }
    const sender = await userRepo.findById({ id: senderId });
    if (!sender) badRequestException("User not found");
    data.senderId = senderId;
    data.senderName = `${sender.firstName} ${sender.lastName}`;
  }

  return await messageRepo.create({ data });
};

export const getMessages = async (userId, { type, page, limit }) => {
  page = Number(page) || 1;
  limit = Number(limit) || 5;
  const skip = (page - 1) * limit;

  let filter = {};
  switch (Number(type)) {
    case messageTypeEnum.receiver:
      filter.receiverId = userId;
      break;

    case messageTypeEnum.sender:
      filter.senderId = userId;
      break;

    case messageTypeEnum.all:
      filter.$or = [{ receiverId: userId }, { senderId: userId }];
      break;
    default:
      badRequestException("Wrong type value");
  }

  const { object, meta } = await messageRepo.find({
    where: filter,
    limit,
    skip,
    page,
  });

  if (meta.currenPage > meta.totalPages)
    notFoundException("404 PAGE NOT FOUND");

  return {
    messages: object,
    meta,
  };
};

export const deleteMessage = async (userId, messageId) => {
  const message = await messageRepo.deleteOne({
    filter: {
      _id: messageId,
      receiverId: userId,
    },
  });
  if (message.deletedCount == 0) notFoundException("Message not found");
  return message;
};
