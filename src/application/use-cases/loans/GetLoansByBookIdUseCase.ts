import { Inject, Injectable } from '@nestjs/common';
import { Loan } from '../../../domain/entities/Loan.entity';
import { LoanBorrowException } from '../../../domain/exceptions/loans/LoanBorrowException';
import { ILoanRepository } from '../../../domain/interfaces/ILoanRepository';

@Injectable()
export class GetLoansByBookIdUseCase {
  constructor(
    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository,
  ) {}

  async execute(_bookId: string): Promise<Loan[]> {
    const loans = await this.loanRepository.findByBookId(_bookId);
    if (!loans.length) {
      throw new LoanBorrowException('Loans by book not found');
    }
    return loans;
  }
}
