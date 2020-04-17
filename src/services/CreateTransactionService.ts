import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import SumTransactionsService from './SumTransactionsService';

interface TransactiontDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  private sumTransactionsService: SumTransactionsService;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
    this.sumTransactionsService = new SumTransactionsService(
      transactionsRepository,
    );
  }

  public execute({ title, value, type }: TransactiontDTO): Transaction {
    const sumIncomes = this.sumTransactionsService.sum('income');
    const sumOutcomes = this.sumTransactionsService.sum('outcome');

    if (type === 'outcome' && sumOutcomes + value > sumIncomes) {
      throw Error('Outcome exceeded the incomes');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
