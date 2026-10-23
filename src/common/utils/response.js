export const response = ({
  res,
  status = 200,
  data = undefined,
  msg = "done",
}) => {
  return res.status(status).json({
    msg,
    data,
  });
};

export const error = (msg = "Internal server error", { cause = 500 } = {}) => {
  throw new Error(msg, { cause });
};
