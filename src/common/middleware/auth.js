import * as enums from "../enum/index.js";
import {
  badRequestException,
  notFoundException,
  UnauthorizedException,
} from "../exceptions/index.js";
import { myCompare, verifyToken } from "../utils/index.js";
import { userRepo } from "../repo/index.js";

// ---------------------- CHECK AUTHORIZATION ----------------
export const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;
  let [prefix, token] = authorization.split(" ");

  if (!token) UnauthorizedException("Authinticated users only");
  let user;

  switch (prefix) {
    case enums.authEnum.Basic:
      const data = Buffer.from(token, "base64").toString();
      const [email, password] = data.split(":");
      user = await userRepo.findByEmail(email);

      if (!user) notFoundException("User not found");
      const checkPassword = await myCompare({
        plainText: password,
        cypherText: user.password,
      });
      if (!checkPassword) notFoundException("User not found");
      break;

    case enums.authEnum.Bearer:
      // inject new property into request

      req.user = await verifyToken({
        token,
        tokenType: enums.tokenTypesEnum.access,
      });

      next();
      break;

    default:
      badRequestException("Invalid auth type");
  }
};
