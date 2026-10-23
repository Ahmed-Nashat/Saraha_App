import {
  badRequestException,
  encryptPhoneNumber,
  createTokens,
  eventEmitter,
  verifyToken,
  myCompare,
  myHash,
  enums,
  userRepo,
  redisService,
  notFoundException,
  decryptPhoneNumber,
  tooManyAttemptException,
} from "../../common/index.js";
import { OAuth2Client } from "google-auth-library";
import {
  google_client_id,
  max_send_retries,
} from "../../config/config.service.js";
import jwt from "jsonwebtoken";
import { getPrefixRevoke } from "../../common/utils/token.service.js";
import * as authHelper from "./auth.helper.js";

// ---------------------- REFRESH TOKEN ----------------------
export const refreshToken = async (refreshToken, issuer) => {
  const authorization = refreshToken;
  const [prefix, token] = authorization.split(" ");
  const user = await verifyToken({
    token,
    tokenType: enums.tokenTypesEnum.refresh,
  });
  // revoke the old refresh token
  await authHelper.revokedToken(token);
  return createTokens({
    userId: user._id || user.id,
    issuer,
    role: user.role,
  });
};

// ---------------------- SIGNUP -----------------------------
export const creatUser = async (userData, file) => {
  const { email, password } = userData;
  let imagePath = "";

  if (file?.path) {
    const normalizedPath = file.path.replace(/\\/g, "/");
    imagePath = `/uploads${normalizedPath.split("/uploads")[1]}`;
  } else if (file?.fullPath) imagePath = file.fullPath.replace(/\\/g, "/");

  const user = await authHelper.checkUser({ email, exists: false });

  const newUser = await userRepo.create({
    data: {
      ...userData,
      DOB: new Date(userData.DOB),
      password: await myHash(password),
      phoneNumber: encryptPhoneNumber(userData),
      image: imagePath,
    },
  });

  newUser.phoneNumber = decryptPhoneNumber(newUser);
  newUser.password = password;

  await authHelper.createAndSendOtp({
    user: newUser,
    event: enums.eventEnum.signup,
  });
  return newUser;
};

// ---------------------- CONFIRM EMAIL ----------------------
export const confirmEmail = async ({ email, otp }) => {
  const user = await authHelper.checkUser({ email });
  const UserOtpkey = authHelper.getUserOTPKey(user?.id);

  await authHelper.blockUser({ userId: user?.id, userOtpKey });

  const redisOtp = await redisService.get({ key: UserOtpkey });
  user.phoneNumber = decryptPhoneNumber(user);

  if (redisOtp == otp) {
    await user.updateOne({ $set: { confirmEmail: true } });
    await redisService.del({ key: [UserOtpkey] });
    return user;
  } else await authHelper.wrongOtpHandler(user?.id);
};

// ---------------------- RESEND OTP -------------------------
export const resendOtp = async ({ email, topic }) => {
  const user = await userRepo.findByEmail({ email });

  switch (topic) {
    case enums.eventEnum.signup:
      const sendKey = authHelper.getUserSendKey(user?._id || user?.id);
      const otpKey = authHelper.getUserOTPKey(user?._id || user?.id);

      if (await redisService.exists({ key: otpKey })) {
        tooManyAttemptException("cant't send new OTP try again later");
      }

      let count = await redisService.get({ key: sendKey });
      if (count) {
        if (count == max_send_retries) {
          tooManyAttemptException(
            `You reached your limit, please try after ${
              (await redisService.ttl({ key: sendKey })) < 1
                ? 0
                : (await redisService.ttl({ key: sendKey })) / 60
            } minutes`,
          );
        } else await redisService.incr({ key: sendKey });
      } else await redisService.set({ key: sendKey, value: 1, ttl: 600 });

      const otp = authHelper.generateOtp();
      await redisService.set({
        key: otpKey,
        value: otp,
        ttl: 5 * 60,
      });

      eventEmitter.emit(enums.eventEnum.signup, {
        recipients: { to: email },
        otp,
        name: user?.name,
      });
      break;

    default:
      break;
  }
  return `new OTP sent for ${topic}`;
};

// ---------------------- LOGIN ------------------------------
export const login = async (userData, issuer) => {
  const { email, password } = userData;

  const user = await authHelper.checkUser({ email });

  await myCompare({
    plainText: password,
    cypherText: user.password,
  });

  if (user.twoFactorEnabled) {
    await authHelper.blockUser({
      userId: user?.id,
      userOtpKey: authHelper.getUserOTPKey(user?.id),
    });
    const otp = authHelper.generateOtp();
    await redisService.set({
      key: authHelper.getUser2FAKey(user?.id),
      value: otp,
      ttl: 300,
    });
    eventEmitter.emit(enums.eventEnum.fa, {
      recipients: { to: email },
      name: user.firstName,
      otp,
    });

    return {
      message: "2FA OTP sent to your email",
      require2FA: true,
      userId: user?.id,
    };
  }

  return await authHelper.verifyLogin({ issuer, user });
};

// ---------------------- VERIFY 2FA -------------------------
export const verify2FALogin = async ({ userId, otp }, issuer) => {
  const user = await authHelper.checkUser({ id: userId });

  await authHelper.blockUser({
    userId,
    userOtpKey: authHelper.getUser2FAKey(userId),
  });
  const key = authHelper.getUser2FAKey(userId);
  const redisOtp = await redisService.get({ key });

  if (!redisOtp) notFoundException("OTP expired or not found");
  if (redisOtp != otp) return await authHelper.wrongOtpHandler(userId);
  else {
    await redisService.del({
      key: [key, authHelper.getUserOtpTriesKey(userId)],
    });
    return await authHelper.verifyLogin({ issuer, user });
  }
};

// ---------------------- VERIFY GOOGLE ID -------------------
async function verifyGoogleid(idToken) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: google_client_id,
  });
  const payload = ticket.getPayload();
  if (!payload.email_verified) badRequestException("Email is not verified");
  return payload;
}

// ---------------------- LOGIN WITH GOOGLE ------------------
export const loginWithGmail = async ({ idToken }, issuer) => {
  const payload = await verifyGoogleid(idToken);
  const { email, given_name, family_name, picture } = payload;
  let user = await userRepo.findByEmail(email);

  if (user) {
    // login.
    const token = createTokens({
      userId: user.id,
      issuer,
    });
    eventEmitter.emit(enums.eventEnum.login, {
      recipients: { to: email },
      subject: "New login",
      text: `a new login detected at ${new Date()}, if it's not you please change the password`,
    });
    return { token, status: 200 };
  }

  // signup
  user = await userRepo.create({
    email,
    firstName: given_name,
    lastName: family_name,
    image: picture,
    provider: enums.providerEnum.google,
    confirmEmail: true,
  });

  const otp = authHelper.generateOtp();
  redisService.set({
    key: authHelper.getUserOTPKey(user?._id),
    value: otp,
    ttl: 5 * 60,
  });
  eventEmitter.emit(enums.eventEnum.signup, {
    recipients: { to: email },
    otp,
    name: payload?.name,
  });

  const token = createTokens({
    userId: user.id,
    issuer,
  });
  return { token, status: 201 };
};

// ---------------------- LOGOUT -----------------------------
export const logout = async (auth, type) => {
  const [, token] = auth.split(" ");
  const rawToken = token || auth;

  switch (type) {
    case enums.logoutEnum.all:
      const data = jwt.decode(rawToken);
      await userRepo.updateOne({
        filter: { _id: data?.sub },
        // update time in seconds
        data: { credintialsChangedAt: Math.ceil(Date.now() / 1000) },
      });
      const arr = await redisService.keys({
        prefix: getPrefixRevoke(data?.sub),
      });
      if (arr.length > 0) {
        // delete all revoked token
        await redisService.del({ key: arr });
      }
      // remove cached user
      await redisService.del({ key: authHelper.getUserKey(data?.sub) });
      break;
    default:
      // create one revoked token
      await authHelper.revokedToken(rawToken);
      break;
  }
};

// ---------------------- FORGET PASSWORD --------------------
export const forgetPassword = async (email) => {
  const user = await authHelper.checkUser({ email });
  // to revoke any previous tokens
  await user.updateOne({
    $set: { credintialsChangedAt: Math.ceil(Date.now() / 1000) },
  });
  const arr = await redisService.keys({
    prefix: getPrefixRevoke(user?.id),
  });
  arr.length && (await redisService.del({ key: arr }));
  await authHelper.createAndSendOtp({ user, event: enums.eventEnum.forget });
  return;
};

// ---------------------- RESET PASSWORD ---------------------
export const resetPassword = async ({ email, otp, newPassword, cPassword }) => {
  const user = await authHelper.checkUser({ email });

  if (newPassword !== cPassword) badRequestException("Password dont't match");

  await authHelper.blockUser({
    userId: user?.id,
    userOtpKey: authHelper.getUserOTPForgetKey(user?.id),
  });

  const redisOtp = await redisService.get({
    key: authHelper.getUserOTPForgetKey(user?.id),
  });
  // he didn't forget the password
  if (!redisOtp) notFoundException("OTP not found");

  if (redisOtp == otp) {
    await user.updateOne({
      $set: {
        password: await myHash(newPassword),
      },
    });
    return "Password changed";
  } else {
    await authHelper.wrongOtpHandler(user?.id);
  }
};
