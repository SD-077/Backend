import type { RequestHandler } from "express";

const logger: RequestHandler = (req, res, next) => {
  console.log(`method ${req.method} url ${req.url} date ${Date.now()}`);
  next();
};

export default logger;
