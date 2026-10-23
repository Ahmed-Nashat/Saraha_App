import * as enums from "../enum/index.js";
import {
  badRequestException,
  notFoundException,
} from "../exceptions/index.js";
import { myCompare, verifyToken } from "../utils/index.js";
import { userRepo } from "../repo/index.js";

// ---------------------- CHECK AUTHORIZATION ----------------
export const optionalAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  // return used to move the req to the next middleware and stop the function
  if (!authorization) return next();

  const [prefix, token] = authorization.split(" ");
  if (!token) return next();

  let user;

  switch (prefix) {
    case enums.authEnum.Basic: {
      const data = Buffer.from(token, "base64").toString();
      const [email, password] = data.split(":");
      user = await userRepo.findByEmail({ email });

      if (!user) notFoundException("User not found");
      const checkPassword = await myCompare({
        plainText: password,
        cypherText: user.password,
      });
      if (!checkPassword) notFoundException("User not found");

      req.user = user;
      return next();
    }

    case enums.authEnum.Bearer: {
      req.user = await verifyToken({
        token,
        tokenType: enums.tokenTypesEnum.access,
      });
      return next();
    }

    default:
      badRequestException("Invalid auth type");
  }
};
