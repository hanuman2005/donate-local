// backend/services/sessionStore.js
const redisClient = require("../config/redis");

const setSession = async (key, value, ttl = 3600) => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttl,
  });
};

const getSession = async (key) => {
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

const deleteSession = async (key) => {
  await redisClient.del(key);
};

module.exports = { setSession, getSession, deleteSession };
