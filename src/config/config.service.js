import { config } from "dotenv";
import fs from "fs";

const envFile = `.env.${process.env.NODE_ENV}`;
const envFilePath =
  process.env.NODE_ENV && fs.existsSync(envFile) ? envFile : ".env";

config({ path: envFilePath });

export const port = Number(process.env.PORT),
  db_uri = process.env.DB_URI,
  enc_algo = process.env.ENC_ALGO,
  key = process.env.KEY,
  iv_length = Number(process.env.IV_LENGTH),
  user_access_secret_key = process.env.USER_ACCESS_SECRET_KEY,
  user_refresh_secret_key = process.env.USER_REFRESH_SECRET_KEY,
  admin_access_secret_key = process.env.ADMIN_ACCESS_SECRET_KEY,
  admin_refresh_secret_key = process.env.ADMIN_REFRESH_SECRET_KEY,
  google_client_id = process.env.GOOGLE_CLIENT_ID,
  google_client_secret = process.env.GOOGLE_CLIENT_SECRET,
  redis_uri = process.env.REDIS_URI,
  access_ex = Number(process.env.ACCESS_EX),
  refresh_ex = Number(process.env.REFRESH_EX),
  app_password = process.env.APP_PASSWORD,
  app_email = process.env.APP_EMAIL,
  max_send_retries = process.env.MAX_SEND_RETRIES,
  max_otp_retries = process.env.MAX_OTP_RETRIES,
  image_upload_max_count = process.env.IMAGE_UPLOAD_MAX_COUNT,
  origins = process.env.ORIGINS,
  rate_limit_max_count = process.env.RATE_LIMIT_MAX_COUNT;
