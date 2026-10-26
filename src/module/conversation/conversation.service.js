import { notFoundException } from "../../common/index.js";
import {
  conversationMessageRepo,
  conversationRepo,
  userRepo,
} from "../../common/repo/index.js";

// ---------------------- SEND MESSAGE -----------------------
export const sendMessage = async (conversationId, userId, { content }) => {
  const conversation = await conversationRepo.findOne({
    filter: {
      _id: conversationId,
      participants: userId,
    },
  });
  if (!conversation)
    notFoundException("Conversation not found or access denied");

  return await conversationMessageRepo.create({
    data: {
      conversationId,
      senderId: userId,
      content,
    },
  });
};

// ---------------------- GET MESSAGE ------------------------
export const getMessages = async (
  conversationId,
  userId,
  { page = 1, limit = 5 } = {},
) => {
  page = Number(page) || 1;
  limit = Number(limit) || 20;
  const skip = (page - 1) * limit;

  const conversation = await conversationRepo.findOne({
    filter: {
      _id: conversationId,
      participants: userId,
    },
  });
  if (!conversation)
    notFoundException("Conversation not found or access denied");

  const { object: messages, meta } = await conversationMessageRepo.find({
    where: { conversationId },
    sort: { createdAt: 1 },
    skip,
    limit,
    page,
  });
  return {
    messages,
    meta,
  };
};

// ---------------------- GET USER CONVERSATIONS -------------
export const getUserConversations = async (
  userId,
  { page = 1, limit = 5 } = {},
) => {
  page = Number(page) || 1;
  limit = Number(limit) || 20;
  const skip = (page - 1) * limit;

  const { object: conversations, meta } = await conversationRepo.find({
    where: {
      participants: userId,
    },

    sort: { updatedAt: -1 },
    skip,
    limit,
    page,
  });
  return {
    conversations,
    meta,
  };
};

// ---------------------- GET CONVERSATION MESSAGES ----------
export const getConversationMessages = async (
  userId,
  conversationId,
  { page = 1, limit = 20 } = {},
) => {
  const conversation = await conversationRepo.findOne({
    filter: {
      _id: conversationId,
      participants: userId,
    },
  });
  if (!conversation)
    notFoundException("Conversation not found or access denied");

  page = Number(page) || 1;
  limit = Number(limit) || 20;
  const skip = (page - 1) * limit;

  const { object: messages, meta } = await conversationMessageRepo.find({
    where: { conversationId },
    sort: { createdAt: 1 },
    select: "content conversationId",
    skip,
    limit,
    page,
  });

  return {
    messages,
    meta,
  };
};
