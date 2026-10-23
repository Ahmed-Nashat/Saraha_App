import { EventEmitter } from "events";
import { sendMail } from "../services/mail.service.js";
import { eventEnum } from "../enum/index.js";
import {
  signupOtpTemplate,
  forgetPasswordOtpTemplate,
  twoFactorOtpTemplate,
} from "../templates/templates.js";

export const eventEmitter = new EventEmitter();

eventEmitter.on(eventEnum.signup, async ({ recipients, name, otp }) => {
  try {
    await sendMail({
      recipients,
      subject: `Welcome ${name}`,
      html: signupOtpTemplate({ name, otp }),
    });
  } catch (e) {
    e.message;
    e;
  }
});

eventEmitter.on(eventEnum.login, async (payload) => {
  try {
    await sendMail(payload);
  } catch (e) {
    e.message;
    e;
  }
});

eventEmitter.on(eventEnum.forget, async ({ recipients, name, otp }) => {
  try {
    await sendMail({
      recipients,
      subject: "Reset your password",
      html: forgetPasswordOtpTemplate({ name, otp }),
    });
  } catch (e) {
    e.message;
    e;
  }
});

eventEmitter.on(eventEnum.fa, async ({ recipients, name, otp }) => {
  try {
    await sendMail({
      recipients,
      subject: "2FA Verification Code",
      html: twoFactorOtpTemplate({ name, otp }),
    });
  } catch (e) {
    e.message;
    e;
  }
});
