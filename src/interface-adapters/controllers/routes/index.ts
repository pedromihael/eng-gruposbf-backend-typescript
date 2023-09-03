import { Router, Request, Response } from 'express';
import { ConvertCurrencyController } from '../convert-currency-controller';
import { CreateCurrencyController } from '../create-currency-controller';
import { consoleLogger, fileLogger } from '../../../shared/logs/index';
import { log } from '../helpers/log';
import { ListCurrenciesController } from '../list-currencies-controller';
import { UpdateCurrencyController } from '../update-currency-controller';

const router = Router();

router.post('/api/converter', async (req: Request, res: Response) => {
  log(req, 'POST', '/api/converter');

  const response = await ConvertCurrencyController(req.body);
  res.status(response.status).send(response);
});

router.post('/api/create-currency', async (req: Request, res: Response) => {
  log(req, 'POST', '/api/create-currency');

  const response = await CreateCurrencyController(req.body);
  res.status(response.status).send(response);
});

router.get('/api/list-currencies', async (req: Request, res: Response) => {
  log(req, 'GET', '/api/list-currencies');

  const response = await ListCurrenciesController();
  res.status(response.status).send(response);
});

router.put('/api/update-currency', async (req: Request, res: Response) => {
  log(req, 'PUT', '/api/update-currency');

  const response = await UpdateCurrencyController(req.body);
  res.status(response.status).send(response);
});

router.get('/health-check', (req, res) => {
  log(req, 'POST', '/health-check');

  res.status(200).send(`Doctor said I'm good.\n${new Date().toISOString()}`);
});

export default router;