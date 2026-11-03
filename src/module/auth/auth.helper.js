import jwt from "jsonwebtoken";
import {
  badRequestException,
  conflictException,
  createTokens,
  enums,
  eventEmitter,
  notFoundException,
  redisService,
  tooManyAttemptException,
  userRepo,
} from "../../common/index.js";
import { max_retries, refresh_ex } from "../../config/config.service.js";
import { getRevokeKey } from "../../common/utils/token.service.js";
import crypto from "crypto";
import { resolveSrv } from "dns";

export const getUserKey = (userId) => `user::${userId?.toString()}`,
  getUserOTPKey = (userId) => `otp::${getUserKey(userId)}`,
  getUserOTPForgetKey = (userId) => `forget::${getUserOTPKey(userId)}`,
  getUserSendKey = (userId) => `send::${getUserKey(userId)}`,
  getUserOtpTriesKey = (userId) => `tries::${getUserOTPKey(userId)}`,
  getUser2FAKey = (userId) => `2fa::${getUserOTPKey(userId)}`,
  generateOtp = () => crypto.randomInt(100000, 1000000),
  getUserLoginTriesKey = (userId) => `tries::login::${getUserKey(userId)}`,
  handleFailedLogin = async (userId) => {
    const key = getUserLoginTriesKey(userId);
    let tries = 1;

    if (await redisService.exists({ key }))
      tries = await redisService.incr({ key });
    else await redisService.set({ key, value: 1, ttl: 15 * 60 });

    if (tries >= max_retries) {
      await redisService.del({ key });
      await userRepo.updateOne({
        filter: {
          _id: userId,
        },
        data: {
          $set: {
            banned: true,
          },
        },
      });
      tooManyAttemptException(
        "Too many failed attempts. You got banned, please contact support",
      );
    }
    badRequestException("Invalid email or password");
  };

// ---------------------- CREATE & SEND OTP ------------------
export const createAndSendOtp = async ({ user, event }) => {
  const otp = generateOtp();
  const key =
    event === enums.eventEnum.forget
      ? getUserOTPForgetKey(user?.id)
      : getUserOTPKey(user?.id);
  await redisService.set({
    key: key,
    value: otp,
    ttl: 5 * 60,
  });
  eventEmitter.emit(event, {
    recipients: { to: user?.email },
    otp,
    name: user?.name,
  });
};

// ---------------------- REVOKE TOKEN -----------------------
export const revokedToken = async (token) => {
  const data = jwt.decode(token),
    currentTimeInSec = Math.ceil(Date.now() / 1000),
    iat = currentTimeInSec - data.iat,
    ttl = refresh_ex - iat;

  if (ttl > 0) {
    redisService.set({
      key: getRevokeKey(data?.sub, data?.jti),
      value: 1,
      ttl,
    });
  }
};

// ---------------------- WRONG OTP --------------------------
export const wrongOtpHandler = async (userId) => {
  const key = getUserOtpTriesKey(userId);
  if (await redisService.exists({ key })) {
    await redisService.incr({ key });
  } else {
    await redisService.set({ key, value: 1, ttl: 5 * 60 });
  }
  badRequestException("Wrong OTP");
};

// ---------------------- BLOCK USER -------------------------
export const blockUser = async ({ userId, userOtpKey }) => {
  const triesKey = getUserOtpTriesKey(userId);
  const userOtpretries = await redisService.get({
    key: triesKey,
  });

  if (userOtpretries && Number(userOtpretries) >= max_retries) {
    // delete the active otp

    if (userOtpKey) await redisService.del({ key: [userOtpKey] });
    await userRepo.updateOne({
      filter: {
        _id: userId,
      },
      data: {
        $set: {
          banned: true,
        },
      },
      options: { runValidators: true },
    });
    tooManyAttemptException("You got banned, pleasse contact support");
  }
};

// ---------------------- VERIFY LOGIN -----------------------
export const verifyLogin = async ({ user, issuer }) => {
  eventEmitter.emit(enums.eventEnum.login, {
    recipients: { to: user?.email },
    subject: "New login",
    text: `a new login detected at ${new Date()}, if it's not you please change the password`,
  });

  return createTokens({
    userId: user?.id,
    issuer,
    role: user?.role,
  });
};

// ---------------------- CHECK USER HELPER ------------------
export const checkUser = async ({ email, id, exists = true }) => {
  let user;
  if (id) user = await userRepo.findById({ id });
  else if (email) user = await userRepo.findByEmail({ email });

  // login - reset password
  if (exists && !user) notFoundException("User not found");
  else if (!exists && user) conflictException("User already exists");

  return user;
};
