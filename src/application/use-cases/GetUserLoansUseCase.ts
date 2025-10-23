import { Inject, Injectable } from '@nestjs/common';
import { Loan } from '../../domain/entities/Loan.entity';
import { LoanBorrowException } from '../../domain/exceptions/loans/LoanBorrowException';
import { ILoanRepository } from '../../domain/interfaces/ILoanRepository';

@Injectable()
export class GetUserLoansUseCase {
  constructor(
    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository,
  ) {}

  async execute(_userId: string): Promise<Loan[]> {
    const loandsByUser = await this.loanRepository.findByUserId(_userId);
    if (!loandsByUser.length) {
      throw new LoanBorrowException("User doesn't have associated loans");
    }
    return loandsByUser;
  }
}
