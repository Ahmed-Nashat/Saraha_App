import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof multer.MulterError) {
    return res.status(err?.statusCode || err?.cause || 500).json({
      msg: err?.message || "Internal server error",
      err,
    });
  }

  if (err?.name === "ValidationError") {
    return res.status(400).json({
      msg: "Validation failed",
      errors: Object.values(err.errors).map((error) => error.message),
    });
  }

  if (err?.name === "JsonWebTokenError") {
    return res.status(400).json({
      msg: "Invalid signature",
    });
  }

  if (err?.code === 11000) {
    return res.status(409).json({
      msg: "An account with this email already exists",
    });
  }

  return res.status(err?.statusCode || err?.cause || 500).json({
    msg: err?.message || "Internal server error",
    err,
  });
};
