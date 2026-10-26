import { messageTypeEnum } from "../../common/enum/message.enum.js";
import { requestStatusEnum } from "../../common/enum/requestStatus.enum.js";
import { UnauthorizedException } from "../../common/exceptions/index.js";
import {
  badRequestException,
  userRepo,
  messageRepo,
  notFoundException,
} from "../../common/index.js";
import { conversationRepo } from "../../common/repo/conversation.repo.js";

export const sendMessage = async (images, data, senderId) => {
  const { receiverId } = data;
  console.log({ receiverId });

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

  if (meta.totalPages > 0 && meta.currenPage > meta.totalPages)
    notFoundException("404 PAGE NOT FOUND");

  // convert the messages to js object so the delete can work on it
  const formattedMessages = await Promise.all(
    object.map(async (msg) => {
      const messageObj = msg.toObject ? msg.toObject() : { ...msg };

      // check if the sender is anonymous or not
      if (
        messageObj.receiverId?.toString() === userId?.toString() &&
        !messageObj.isKnownSender
      ) {
        delete messageObj.senderId;
        delete messageObj.senderName;
      } else {
        const senderId = messageObj.senderId;
        const sender = await userRepo.findById({ id: senderId });
        messageObj.senderName = `${sender.firstName} ${sender.lastName}`;
      }
      return messageObj;
    }),
  );

  return {
    messages: formattedMessages,
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

export const requestIdentity = async (messageId, receiverId) => {
  const message = await messageRepo.findById({ id: messageId });
  if (!message) notFoundException("Message not found");

  if (message.receiverId.toString() !== receiverId.toString())
    UnauthorizedException("You are not authorized to request this message");

  if (!message.senderId)
    badRequestException(
      "Cannot request identity for an unauthenticated sender",
    );

  if (message.isKnownSender)
    badRequestException("Sender identity is already known");

  if (message.requestStatus !== requestStatusEnum.none)
    badRequestException("This message identity is already requested");

  return await messageRepo.updateOne({
    filter: { _id: messageId },
    data: { requestStatus: requestStatusEnum.pending },
  });
};

export const getRequestedMessages = async (
  userId,
  { page = 1, limit = 5 } = {},
) => {
  page = Number(page) || 1;
  limit = Number(limit) || 5;
  const skip = (page - 1) * limit;

  const { object, meta } = await messageRepo.find({
    where: {
      requestStatus: requestStatusEnum.pending,
      senderId: userId,
    },
    skip,
    limit,
    page,
  });

  return {
    messages: object,
    meta,
  };
};

export const updateRequestStatus = async (messageId, userid, status) => {
  const message = await messageRepo.findOne({
    filter: {
      _id: messageId,
      requestStatus: requestStatusEnum.pending,
    },
  });
  if (!message) notFoundException("Message not found");

  if (message.senderId?.toString() !== userid?.toString())
    UnauthorizedException("You are not authorized to update this message");

  let newStatus;

  if (!status) newStatus = requestStatusEnum.rejected;
  else if (status == "approve") {
    newStatus = requestStatusEnum.approved;
    const existingConv = await conversationRepo.findOne({
      filter: {
        messageId,
      },
    });
    if (!existingConv) {
      await conversationRepo.create({
        data: {
          messageId,
          participants: [message.senderId, message.receiverId],
        },
      });
    }
  } else if (status == "reject") newStatus = requestStatusEnum.rejected;
  else badRequestException("Valid options: ['approve', 'reject']");

  return await messageRepo.updateOne({
    filter: {
      _id: messageId,
    },
    data: {
      requestStatus: newStatus,
      isKnownSender: newStatus === requestStatusEnum.approved,
    },
  });
};
