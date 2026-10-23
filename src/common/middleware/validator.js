import { response } from "../utils/index.js";

export const validator = (schema) => {
  // schema returns as a function
  return (req, res, next) => {
    const { success, error, data } = schema(
      req.headers["accept-language"],
    ).safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      file: req.file,
      files: req.files,
    });

    if (!success) {
      return response({
        res,
        status: 422,
        msg: error.issues[0].path[0]
          ? `Validation Error in ${error.issues[0].path[0]}`
          : `Validation Error`,
        data: error.issues,
      });
    }
    req.validate = data;
    next();
  };
};
