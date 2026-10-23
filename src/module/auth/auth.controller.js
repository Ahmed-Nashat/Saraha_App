import { Router } from "express";
import {
  authMiddleware,
  multerLocal,
  response,
  validator,
  processFiles,
  fileTypes,
} from "../../common/index.js";
import * as authService from "./auth.service.js";
import * as authValidation from "./auth.validation.js";
export const authRouter = Router();

// ---------------------- REFRESH TOKEN ----------------------
authRouter.get(
  "/refreshToken",
  validator(authValidation.refreshTokenSchema),
  async (req, res, next) => {
    const refreshToken = req.headers.authorization;
    const issuer = `${req.protocol}//${req.hostname}`;
    try {
      const tokens = await authService.refreshToken(refreshToken, issuer);
      return response({
        res,
        msg: "Token refreshed",
        data: tokens,
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- CONFIRM EMAIL ----------------------
authRouter.post("/confirmEmail", async (req, res, next) => {
  try {
    const user = await authService.confirmEmail(req.body);
    return response({
      res,
      msg: "Email confirmed",
      data: user ? user : null,
    });
  } catch (e) {
    next(e);
  }
});

// ---------------------- SIGNUP -----------------------------
authRouter.post(
  "/signup",
  multerLocal({
    fileType: fileTypes.images,
    customPath: "users",
  }).single("image"),
  validator(authValidation.signupSchema),
  processFiles({ fileType: fileTypes.images }),
  async (req, res, next) => {
    try {
      const user = await authService.creatUser(req.validate.body, req.file);
      return response({
        res,
        msg: user ? "User created" : "User creation failed",
        data: user ? user : null,
        status: 201,
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- LOGIN ------------------------------
authRouter.post(
  "/login",
  // validation midlleware
  validator(authValidation.loginSchema),
  async (req, res, next) => {
    const issuer = `${req.protocol}//${req.hostname}`;
    try {
      const tokens = await authService.login(req.body, issuer);
      return response({
        res,
        msg: "User loged in",
        data: tokens,
      });
    } catch (e) {
      next(e);
    }
  },
);

// ---------------------- LOGIN WITH GOOGLE ------------------
authRouter.post("/loginWithGmail", async (req, res, next) => {
  try {
    const issuer = `${req.protocol}://${req.host}`;
    const { token, status } = await authService.loginWithGmail(
      req.body,
      issuer,
    );
    return response({
      res,
      msg: "Loged in with google",
      data: token,
      status,
    });
  } catch (e) {
    next(e);
  }
});

// ---------------------- LOGOUT -----------------------------
authRouter.post("/logout", authMiddleware, async (req, res, next) => {
  try {
    const data = await authService.logout(
      req.headers.authorization,
      req.body.type,
    );
    return response({
      res,
      data,
      msg: "Logout",
    });
  } catch (e) {
    next(e);
  }
});

// ---------------------- VERIFY 2FA -------------------------
authRouter.post("/verify2fa", async (req, res, next) => {
  const issuer = `${req.protocol}://${req.hostname}`;
  try {
    const tokens = await authService.verify2FALogin(req.body, issuer);
    return response({
      res,
      msg: "2FA verified, login successful",
      data: tokens,
    });
  } catch (e) {
    next(e);
  }
});

// ---------------------- RESEND OTP -------------------------
authRouter.post("/resendOtp", async (req, res, next) => {
  try {
    const msg = await authService.resendOtp(req.body);
    return response({
      res,
      msg,
    });
  } catch (e) {
    next(e);
  }
});

// ---------------------- FORGET PASSWORD --------------------
authRouter.post("/forgetPass", async (req, res, next) => {
  try {
    const msg = await authService.forgetPassword(req.body.email);
    return response({
      res,
      msg,
    });
  } catch (e) {
    next(e);
  }
});

// ---------------------- RESET PASSWORD ---------------------
authRouter.post("/resetPass", async (req, res, next) => {
  try {
    const msg = await authService.resetPassword(req.body);
    return response({
      res,
      msg,
    });
  } catch (e) {
    next(e);
  }
});
