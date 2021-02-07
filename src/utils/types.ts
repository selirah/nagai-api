import { Request, Response, Router } from 'express';

export type AppContext = {
  req: Request;
  res: Response;
};

export const router: Router = Router();
