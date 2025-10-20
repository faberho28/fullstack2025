import { Injectable } from '@nestjs/common';
import { LoanRepository } from '../../infrastructure/repositories/LoanRepository';
import { Loan } from '../../domain/entities/Loan.entity';

@Injectable()
export class GetUserLoansUseCase {
  constructor(private readonly loanRepository: LoanRepository) {}

  async execute(_userId: string): Promise<Loan[]> {
    throw new Error('GetUserLoansUseCase not implemented');
  }
}
