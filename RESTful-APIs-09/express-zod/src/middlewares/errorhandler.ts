import type { ErrorRequestHandler } from "express";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

const errorHandler: ErrorRequestHandler = async (err, req, res, next) => {
  let errorMessage = "Internal server error";
  let statusCode = 500;

  try {
    if (err instanceof Error) {
      errorMessage = err.message;

      if (
        err.cause &&
        typeof err.cause === "object" &&
        "status" in err.cause &&
        typeof err.cause.status === "number"
      ) {
        statusCode = err.cause.status;
      }
    }

    const date = new Date().toISOString().slice(0, 10);

    const logDirectory = path.join(process.cwd(), "log");
    const logFile = path.join(logDirectory, `${date}-error.log`);

    const logEntry = [
      `[${new Date().toISOString()}]`,
      `${req.method} ${req.originalUrl}`,
      `Status: ${statusCode}`,
      `Error: ${errorMessage}`,
      "\n",
    ].join("\n");

    await mkdir(logDirectory, { recursive: true });
    await appendFile(logFile, logEntry);
  } catch (loggingError) {
    console.error("Failed to write error log:", loggingError);
  }

  res.status(statusCode).json({
    message: errorMessage,
  });
};

export default errorHandler;
