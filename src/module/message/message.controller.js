import * as messageService from "./message.service.js";
import { Router } from "express";
import {
  authMiddleware,
  optionalAuth,
  processFiles,
  multerLocal,
  validator,
  fileTypes,
  response,
} from "../../common/index.js";
import { sendMessageSchema } from "./message.validation.js";

export const messageRouter = Router({});

messageRouter.post(
  "/",
  optionalAuth,
  multerLocal({
    fileType: fileTypes.images,
    customPath: "messages",
  }).array("images"),
  processFiles({ fileType: fileTypes.images }),
  validator(sendMessageSchema),
  async (req, res, next) => {
    try {
      const message = await messageService.sendMessage(
        req?.files,
        req.body,
        req?.user?._id,
      );
      return response({
        res,
        data: message,
        msg: "Message sent",
      });
    } catch (e) {
      next(e);
    }
  },
);

messageRouter.get("/getAll", authMiddleware, async (req, res, next) => {
  try {
    const data = await messageService.getMessages(req.user?._id, req.query);
    return response({
      res,
      data,
      msg: "Messages fetched",
    });
  } catch (e) {
    next(e);
  }
});

messageRouter.delete(
  "/delete/:messageId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const deletedMessage = await messageService.deleteMessage(
        req.user?._id,
        req.params.messageId,
      );
      return response({
        res,
        data: deletedMessage,
        msg: "Message deleted",
      });
    } catch (e) {
      next(e);
    }
  },
);

messageRouter.post(
  "/:messageId/requestIdentity",
  authMiddleware,
  async (req, res, next) => {
    const messageId = req.params?.messageId;
    const receiverId = req.user?._id;
    try {
      const data = await messageService.requestIdentity(messageId, receiverId);
      return response({
        res,
        data,
        msg: "Request sent",
      });
    } catch (e) {
      next(e);
    }
  },
);

messageRouter.get("/requested", authMiddleware, async (req, res, next) => {
  try {
    const data = await messageService.getRequestedMessages(
      req.user?._id,
      req.query,
    );
    return response({
      res,
      data,
      msg: "Requested messages fetched",
    });
  } catch (e) {
    next(e);
  }
});

messageRouter.patch(
  "/:messageId/requestStatus",
  authMiddleware,
  async (req, res, next) => {
    try {
      const data = await messageService.updateRequestStatus(
        req.params?.messageId,
        req.user?._id,
        req.body?.status,
      );
      return response({
        res,
        data,
        msg: "Request status updated",
      });
    } catch (e) {
      next(e);
    }
  },
);
