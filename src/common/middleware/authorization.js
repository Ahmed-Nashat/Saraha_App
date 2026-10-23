import { forbiddenException } from "../exceptions/index.js";

export const roleBasedAccessMiddleware = (roles) => {
  return (req, res, next) => {
    const userRole = Number(req.user.role);

    if (!roles.includes(userRole)) {
      forbiddenException("Authnticated users only");
    }
    next();
  };
};
