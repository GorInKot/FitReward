import "express";

declare global {
  namespace Express {
    interface Request {
      telegramId?: string;
    }
  }
}
