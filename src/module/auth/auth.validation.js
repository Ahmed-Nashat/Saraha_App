import { z } from "zod";
import { generalFeilds } from "../../common/utils/index.js";

const loginBody = (lang) =>
  // return zod schema
  z.object({
    email: generalFeilds.email(lang),
    password: generalFeilds.password(lang),
  });

export const loginSchema = (lang) =>
  z.object({
    body: loginBody(lang),
  });

const signupBody = (lang) =>
  loginBody(lang)
    .safeExtend({
      cPassword: generalFeilds.cPassword(lang),
      phoneNumber: generalFeilds.phoneNumber(lang),
      name: generalFeilds.name(lang),
      gender: generalFeilds.gender(lang),
      DOB: generalFeilds.DOB(lang),
      scores: generalFeilds.scores(lang),
    })
    .superRefine((data, ctx) => {
      if (data.cPassword !== data.password) {
        ctx.addIssue({
          code: "custom",
          path: ["confirm password"],
          message: "Password don't match confirm password",
        });
      }
      if (data.name.toLocaleLowerCase().includes("admin")) {
        ctx.addIssue({
          code: "invalid_value",
          path: ["name"],
          message: "invalid name",
        });
      }
    });

export const signupSchema = (lang) =>
  z.object({
    body: signupBody(lang),
    file: generalFeilds.file(lang).optional(),
  });

export const refreshTokenSchema = (lang) =>
  z.object({
    headers: generalFeilds.headers(lang).passthrough(),
  });
