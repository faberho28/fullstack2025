import { Inject, Injectable } from '@nestjs/common';
import { Loan } from '../../../domain/entities/Loan.entity';
import { ILoanRepository } from '../../../domain/interfaces/ILoanRepository';
import { LoanNotFoundException } from '../../../domain/exceptions/loans/LoanNotFoundException';

@Injectable()
export class GetLoanByIdUseCase {
  constructor(
    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository,
  ) {}

  async execute(_bookId: string): Promise<Loan> {
    const loan = await this.loanRepository.findById(_bookId);
    if (!loan) {
      throw new LoanNotFoundException();
    }
    return loan;
  }
}
