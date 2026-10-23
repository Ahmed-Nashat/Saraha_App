import { badRequestException } from "../exceptions/index.js";
import { encrypting, decrypting } from "../utils/index.js";

export function encryptPhoneNumber(user) {
  if (!user) badRequestException("User must be provide");
  if (user?.phoneNumber) return encrypting(user.phoneNumber);
}

export function decryptPhoneNumber(user) {
  if (!user) badRequestException("User must be provide");
  if (user?.phoneNumber) return decrypting(user.phoneNumber);
}
