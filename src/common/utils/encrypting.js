import crypto from "node:crypto";
import { enc_algo, key, iv_length } from "../../config/config.service.js";

const algorithm = enc_algo;
const BufferedKey = Buffer.from(key, "hex");

// ---------------------- ENCRYPTING -------------------------
export const encrypting = (plainText) => {
  const iv = crypto.randomBytes(iv_length);
  const cipher = crypto.createCipheriv(algorithm, BufferedKey, iv);
  let encrypted = cipher.update(plainText, "utf-8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}::${encrypted}`;
};

// ---------------------- DECRYPTING -------------------------
export const decrypting = (cipherTex) => {
  let [iv, cipher] = cipherTex.split("::");
  iv = Buffer.from(iv, "hex");
  const plainText = crypto.createDecipheriv(algorithm, BufferedKey, iv);
  let decrypted = plainText.update(cipher, "hex", "utf-8");
  decrypted += plainText.final("utf-8");
  return decrypted;
};
