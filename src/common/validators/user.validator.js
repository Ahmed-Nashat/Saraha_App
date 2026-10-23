import { z } from "zod";
import { genderEnum } from "../enum/index.js";
import { badRequestException } from "../exceptions/index.js";

// ---------------------- EMAIL RULE -------------------------
const emailRule = z
  .string({ required_error: "Email is required" })
  .trim()
  .toLowerCase()
  .email("Invalid email format")
  .endsWith("@gmail.com", "Email must be a @gmail.com address");

// ---------------------- SIGNUP SCHEMA ----------------------
export const signupSchema = z
  .object({
    firstName: z.string().trim().min(3).max(20),
    lastName: z.string().trim().min(3).max(20),
    email: emailRule,
    password: z
      .string()
      .trim()
      .min(6)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number",
      ),
    cPassword: z.string({ required_error: "Confirm password is required" }),
    phoneNumber: z.string().trim().optional(),
    gender: z.nativeEnum(genderEnum).optional(),
    DOB: z.coerce.date().optional(),
  })
  .refine((data) => data.password === data.cPassword, {
    message: "Passwords do not match",
    path: ["cPassword"],
  });

// ---------------------- LOGIN SCHEMA -----------------------
export const loginSchema = z.object({
  email: emailRule,
  password: z.string().min(1, "Password is required"),
});

// ---------------------- CHECK VALIDATION -------------------
export function checkValidation(data, where) {
  if (data.name) {
    const [firstName, ...rest] = data.name.trim().split(" ");
    data.firstName = firstName;
    data.lastName = rest.join(" ");
    delete data.name;
  }
  let result;
  switch (where) {
    case "signup":
      result = signupSchema.safeParse(data);
      if (!result.response) {
        const firstErrorMessage = result.error.issues[0].message;
        badRequestException(firstErrorMessage);
      }
    case "login":
      result = loginSchema.safeParse({
        email: data.email,
        password: data.password,
      });
      if (!result.response) {
        const firstErrorMessage = result.error.issues[0].message;
        badRequestException(firstErrorMessage);
      }
  }
}
