import bcrypt from "bcrypt";
import { badRequestException } from "../exceptions/index.js";


// ---------------------- HASING -----------------------------
export const myHash = async (plainText) => {
  return await bcrypt.hash(plainText, 12);
};

// ---------------------- COMPARE ----------------------------
export const myCompare = async ({ plainText, cypherText }) => {
  const result = await bcrypt.compare(plainText, cypherText);
  if (!result) badRequestException("Invalid email or password");
};
