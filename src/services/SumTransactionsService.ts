import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class SumTransactionService {
  private transactionRepository: TransactionsRepository;

  constructor(transactionRepository: TransactionsRepository) {
    this.transactionRepository = transactionRepository;
  }

  public sum(type: string): number {
    const items = this.transactionRepository
      .all()
      .filter(transaction => transaction.type === type);

    const sumItems = items.reduce(function (total, income) {
      return total + income.value;
    }, 0);

    return sumItems;
  }
}

export default SumTransactionService;
