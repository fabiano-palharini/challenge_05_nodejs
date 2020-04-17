import { Router } from 'express';
import CreateTransactionService from '../services/CreateTransactionService';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

function sumTransactions(transactions: Transaction[], type: string): number {
  const items = transactions.filter(transaction => transaction.type === type);

  const sumItems = items.reduce(function (total, income) {
    return total + income.value;
  }, 0);

  return sumItems;
}

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();

    const sumIncomes = sumTransactions(transactions, 'income');
    const sumOutcomes = sumTransactions(transactions, 'outcome');
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
