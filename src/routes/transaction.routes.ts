import { Router } from 'express';
import CreateTransactionService from '../services/CreateTransactionService';
import SumTransactionsService from '../services/SumTransactionsService';
import TransactionsRepository from '../repositories/TransactionsRepository';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();

    const sumTransactionsService = new SumTransactionsService(
      transactionsRepository,
    );

    const sumIncomes = sumTransactionsService.sum('income');
    const sumOutcomes = sumTransactionsService.sum('outcome');
    const total = sumIncomes - sumOutcomes;

    return response.status(200).json({
      transactions,
      balance: { income: sumIncomes, outcome: sumOutcomes, total },
    });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type } = request.body;

    const createTransactionService = new CreateTransactionService(
      transactionsRepository,
    );
    const transaction = createTransactionService.execute({
      title,
      value,
      type,
    });

    return response.status(200).json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
