import { z } from "zod";
import { genderEnum } from "../enum/index.js";
import { getErrorMessage } from "./validationErrors.js";
import { isValidObjectId } from "mongoose";

export const generalFeilds = {
  email: (lang) =>
    z
      .email({
        error: getErrorMessage(lang, "email"),
      })
      .regex(/^[A-Za-z0-9_\-\.]+@[A-Za-z\-_]{1,20}(\.[a-z]{2,8}){1,2}$/),
  password: (lang) =>
    z
      .string()
      .max(20, { error: getErrorMessage(lang, "longPassword") })
      .min(6, { error: getErrorMessage(lang, "shortPassword") }),
  cPassword: (lang) => z.string().max(20).min(6),
  phoneNumber: (lang) =>
    z
      .e164({
        pattern: /^\+201[0125]\d{8}$/,
        error: getErrorMessage(lang, "wrongPhoneNumber"),
      })
      .optional(),
  name: (lang) =>
    z
      .string({ error: getErrorMessage(lang, "name.invalidName") })
      .regex(/^[A-Za-z]{3,20}\s[A-Za-z]{3,20}$/, {
        error: getErrorMessage(lang, "name.twoNames"),
      }),
  DOB: (lang) => z.string(),
  scores: (lang) => z.array(z.number()).nonempty().optional(),
  gender: (lang) =>
    z.enum(genderEnum, {
      error: getErrorMessage(lang, "gender"),
    }),
  id: (lang) =>
    z
      .string()
      .min(14)
      .max(24)
      .refine((value) => isValidObjectId(value), {
        error: getErrorMessage(lang, "invalidObjectId"),
      }),
  page: (lang) => z.coerce.number().gte(1),
  limit: (lang) => z.coerce.number().gte(1),
  stringBool: (lang) =>
    z.stringbool({
      truthy: ["true"],
      falsy: ["false"],
      error: getErrorMessage(lang, "stringBool"),
    }),
  headers: (lang) =>
    z.object({
      authorization: z.string().refine(
        (val) => {
          const [prefix, token] = (val || "").split(" ");
          return (
            prefix === "Bearer" && z.string().jwt().safeParse(token).success
          );
        },
        { message: "Invalid Bearer token" },
      ),
      "accept-language": z
        .enum(["ar", "en"], {
          error: getErrorMessage(lang, "language"),
        })
        .optional(),
    }),
  file: (lang) =>
    z.object({
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string(),
      size: z.number().optional(),
      path: z.string().optional(),
      destination: z.string().optional(),
      filename: z.string().optional(),
      buffer: z.string().optional(),
    }),
};
