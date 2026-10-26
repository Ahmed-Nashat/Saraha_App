import { Router } from "express";
import * as conversationService from "./conversation.service.js";
import { authMiddleware } from "../../common/middleware/index.js";
import { response } from "../../common/utils/index.js";
import { validator } from "../../common/middleware/index.js";
import {
  sendConversationMessageSchema,
  getConversationMessagesSchema,
} from "./conversation.validation.js";

export const conversationRouter = Router({});

// ---------------------- SEND MESSAGE -----------------------
conversationRouter.post(
  "/:conversationId/message",
  authMiddleware,
  validator(sendConversationMessageSchema),
  async (req, res, next) => {
    try {
      const data = await conversationService.sendMessage(
        req.params?.conversationId,
        req.user?._id,
        req.body,
      );
      return response({
        res,
        data,
        msg: "Message sent",
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- GET MESSAGE ------------------------
conversationRouter.get(
  "/:conversationId/messages",
  authMiddleware,
  validator(getConversationMessagesSchema),
  async (req, res, next) => {
    try {
      const data = await conversationService.getMessages(
        req.params?.conversationId,
        req.user?._id,
        req.query,
      );
      return response({
        res,
        data,
        msg: "Messages fetched",
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- GET CONVERSATION MESSAGES ----------
conversationRouter.get(
  "/:conversationId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const data = await conversationService.getConversationMessages(
        req.user?._id,
        req.params.conversationId,
        req.query,
      );
      return response({
        res,
        data,
        msg: "Messages fetched",
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- GET USER CONVERSATIONS -------------
conversationRouter.get("/", authMiddleware, async (req, res, next) => {
  try {
    const data = await conversationService.getUserConversations(
      req.user?._id,
      req.query,
    );
    return response({
      res,
      data,
      msg: "Conversations fetched",
    });
  } catch (e) {
    next(e);
  }
});
