import { error } from "../utils/index.js";

export const serverException = (msg = "Internal Server Error") =>
  error(msg, { cause: 500 });

export const tooManyAttemptException = (msg = "Too Many Attempt") =>
  error(msg, { cause: 429 });

export const conflictException = (msg = "Conflict") =>
  error(msg, { cause: 409 });

export const notFoundException = (msg = "Not Found") =>
  error(msg, { cause: 404 });

export const forbiddenException = (msg = "Forbidden") =>
  error(msg, { cause: 403 });

export const UnauthorizedException = (msg = "Unauthorized") =>
  error(msg, { cause: 401 });

export const badRequestException = (msg = "Bad Request") =>
  error(msg, { cause: 400 });
