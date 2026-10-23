import { createTransport } from "nodemailer";
import * as configService from "../../config/config.service.js";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: configService.app_email,
    pass: configService.app_password,
  },
});

// const transporter = createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: true,
//   service: "gmail",
//   auth: {
//     user: configService.app_email,
//     pass: configService.app_password,
//   },
// });

export const sendMail = async ({
  recipients,
  subject,
  attachments,
  html,
  text,
}) => {
  const info = await transporter.sendMail({
    from: `Saraha Project <${configService.app_email}>`,
    ...recipients,
    // send mail to more than one
    // carbon copy
    // cc: "bexorey797@meinvr.com",
    // blind carbon copy
    // bcc: "bepone6294@calirona.com,
    subject,
    text,
    html,
    attachments,
  });
};
