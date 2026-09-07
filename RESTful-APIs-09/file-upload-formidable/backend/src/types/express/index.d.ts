declare global {
  namespace Express {
    export interface Request {
      file?: any;
    }
  }
}
export {};
