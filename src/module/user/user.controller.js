import { Router } from "express";
import {
  response,
  authMiddleware,
  validator,
  decryptPhoneNumber,
  roleBasedAccessMiddleware,
  enums,
  multerLocal,
} from "../../common/index.js";
import * as userService from "./user.service.js";
import { getUserByIdSchema, pagginationSchema } from "./user.validation.js";
import { image_upload_max_count } from "../../config/config.service.js";
import {
  fileTypes,
  processFiles,
} from "../../common/middleware/multer.local.js";

export const userRouter = Router();

// ---------------------- GET SIGNED IN USER PROFILE ---------
userRouter.get(
  "/",
  authMiddleware,
  roleBasedAccessMiddleware([enums.roleEnum.user]),
  async (req, res) => {
    req.user.phone = decryptPhoneNumber(req.user);
    return response({
      res,
      msg: "User fetched",
      data: req.user || {},
    });
  },
);

// ---------------------- GET USER PROFILE -------------------
userRouter.get(
  "/profile/:userId",
  validator(getUserByIdSchema),
  async (req, res, next) => {
    try {
      const user = await userService.getUserById(req.validate.params.userId);
      if (req.validate.query.phoneNumber) {
        user.phoneNumber = decryptPhoneNumber(user);
      }
      return response({
        res,
        msg: "User fetched",
        data: user,
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- GET ALL USERS ----------------------
userRouter.get(
  "/getAllUsers",
  authMiddleware,
  roleBasedAccessMiddleware([enums.roleEnum.admin]),
  validator(pagginationSchema),
  async (req, res, next) => {
    try {
      const users = await userService.getAllusers(
        req.query.page,
        req.query.limit,
      );
      return response({
        res,
        msg: "Users fetched",
        data: users,
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- FILE UPLOAD ------------------------
userRouter.post(
  "/image",
  multerLocal({
    fileType: fileTypes.images,
  }).single("image"),
  processFiles({
    fileType: fileTypes.images,
  }),
  async (req, res, next) => {
    return response({
      res,
      data: files(req),
    });
  },
);

userRouter.post(
  "/manyImage",
  multerLocal({
    fileType: fileTypes.images,
  }).array("image", image_upload_max_count),
  processFiles({
    fileType: fileTypes.images,
  }),
  async (req, res, next) => {
    ({ rejectedFiles: req.rejectedFiles });
    return response({
      res,
      data: files(req),
    });
  },
);

userRouter.post(
  "/pdf",
  multerLocal({
    fileType: fileTypes.pdfs,
  }).single("pdf"),
  processFiles({
    fileType: fileTypes.pdfs,
  }),
  async (req, res, next) => {
    return response({
      res,
      data: files(req),
    });
  },
);

userRouter.post(
  "/manyPdf",
  multerLocal({
    fileType: fileTypes.pdfs,
  }).array("pdf", image_upload_max_count),
  processFiles({
    fileType: fileTypes.pdfs,
  }),
  async (req, res, next) => {
    ({ rejectedFiles: req.rejectedFiles });
    return response({
      res,
      data: files(req),
    });
  },
);

userRouter.post(
  "/fieldsImage",
  multerLocal({
    fileType: [...fileTypes.images, ...fileTypes.pdfs],
  }).fields([{ name: "image", maxCount: image_upload_max_count }]),
  processFiles({
    fileType: [...fileTypes.images, ...fileTypes.pdfs],
  }),
  async (req, res, next) => {
    return response({
      res,
      data: files(req),
    });
  },
);

const files = (req) => {
  return {
    uploadedFiles: req.files || req.file,
    rejectedFiles: req.rejectedFiles || [],
    body: req.body,
  };
};
