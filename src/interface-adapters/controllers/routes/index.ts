import { Router, Request, Response } from 'express';
import { ConvertCurrencyController } from '../convert-currency-controller';
import { CreateCurrencyController } from '../create-currency-controller';

const router = Router();

router.post('/api/converter', async (req: Request, res: Response) => {
  const response = await ConvertCurrencyController(req.body);
  res.status(response.status).send(response);
});

router.post('/api/create-currency', async (req: Request, res: Response) => {
  const response = await CreateCurrencyController(req.body);
  res.status(response.status).send(response);
});

router.get('/health-check', (req, res) => {
  res.status(200).send(`Doctor said I'm good.\n${new Date().toISOString()}`);
});

export default router;
