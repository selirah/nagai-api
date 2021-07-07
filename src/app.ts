import express, { Request, Response } from 'express';
import cors from 'cors';
import passport from 'passport';
import {
  hello,
  users,
  utils,
  company,
  manufacturers,
  categories,
  products,
  territories,
  clients,
  inventories,
  orders,
  userTerritories,
  deliveries,
  transactions,
  payments,
} from './api';
const api: string = '/api/v1';
import { passportMiddleware } from './middleware/passport';
import path from 'path';

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Middleware */
app.use(passport.initialize());
passportMiddleware(passport);

app.use(api, hello);
app.use(api, users);
app.use(api, utils);
app.use(api, company);
app.use(api, manufacturers);
app.use(api, categories);
app.use(api, products);
app.use(api, territories);
app.use(api, clients);
app.use(api, inventories);
app.use(api, orders);
app.use(api, userTerritories);
app.use(api, deliveries);
app.use(api, transactions);
app.use(api, payments);

/**
 * Test route for websocket
 */

app.get('/', (_: Request, res: Response) => {
  return res.sendFile(path.join(__dirname, './public/index.html'));
});

export { app };
