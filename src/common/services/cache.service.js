import { redisClient as client } from "../../db/redis.connection.js";

export const set = async ({ key, value, ttl = undefined }) => {
  if (typeof value !== "string") value = JSON.stringify(value);
  return await client.set(key, value, { EX: ttl });
};

export const get = async ({ key }) => {
  const data = await client.get(key);
  let result;
  try {
    result = JSON.parse(data);
  } catch (error) {
    result = data;
  }
  return result;
};

export const exists = async ({ key }) => await client.exists(key);

export const del = async ({ key }) => {
  // accept single key and arrays
  if (!key || (Array.isArray(key) && key.length === 0))
    return "Key is not exists";
  const deleted = await client.del(key);
  if (deleted >= 1) return "Key deleted";
  return "Key is not exists";
};

export const ttl = async ({ key }) => await client.ttl(key);

export const keys = async ({ prefix }) => await client.keys(`${prefix}*`);

export const incr = async ({ key }) => await client.incr(key);
