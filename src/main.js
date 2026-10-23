import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import { errorHandler, redisService } from "./common/index.js";
import {
  port,
  origins,
  rate_limit_max_count,
} from "./config/config.service.js";
import * as routers from "./module/index.js";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { redisClient } from "./db/redis.connection.js";
import geoip from "geoip-lite";

if (process.env.NODE_ENV == "production") console.log = () => {};

const app = express();

// ---------------------- DB CONNECTION ----------------------
try {
  await connectDB();
} catch (error) {
  console.error(`Database connection failed: ${error.message}`);
  process.exit(1);
}
const corsOptions = {
  // allow this to connect to the database
  origin: function (origin, cb) {
    if (origins && !origins.includes(origin))
      cb(new Error("Not allowed origin"), origin);
    else cb(null, origin);
  },
};

// values:
//  1 -> trust the last ip
//  true -> pass any ip
//  loopback  -> trust reverse proxies running on the same machine
app.set("trust-proxy", true);
app.use(
  helmet(),
  express.json(),
  cors(),
  rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: function (req) {
      const data = geoip.lookup(req.headers["x-forward-for"]);
      return data?.country == "EG" ? 100 : 0;
    },
    legacyHeaders: false,
    message: JSON.stringify({
      message: data?.country == "EG" ? "Too many requests" : "Not Allowed",
    }),
    keyGenerator: (req) => {
      // custom key per request
      const Ip = req.headers["x-forward-for"];
      // apply the rate limiter to every url individually
      return `${Ip}::${req.url}`;
    },
    skipSuccessfulRequests: true,
    store: {
      async incr(key, cb) {
        try {
          const count = await redisService.incr({ key });
          if (count == rate_limit_max_count) await redisClient.expire(key, 300);
          cb(null, count);
        } catch (e) {
          cb(e);
        }
      },
      async decrement(key, cb) {
        if (await redisService.exists({ key })) await redisClient.decr(key);
      },
    },
  }),
);

// ---------------------- ROUTES -----------------------------
app.use("/user", routers.userRouter);
app.use("/auth", routers.authRouter);
app.use("/message", routers.messageRouter);
app.use("/uploads", express.static("uploads"));

// ---------------------- HEALTH CHECK -----------------------
app.get("/", (req, res, next) => {
  res.status(200).json({
    ok: 1,
  });
});

// ---------------------- DUMMY ------------------------------
app.use("/{*dummy}", (req, res, next) => {
  res.status(404).json({
    msg: "404 PAGE NOT FOUND",
    route: req.params.dummy.join("/"),
  });
});

// ---------------------- MIDDLEWARE -------------------------
app.use(errorHandler);

// ---------------------- SERVER LISTING ---------------------
app.listen(port, () => {
  console.info(`server is running on port ${port}`);
});
