import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../infrastructure/repositories/BookRepository';
import { LoanRepository } from '../../infrastructure/repositories/LoanRepository';
import { Loan } from '../../domain/entities/Loan.entity';
import { ReturnBookDto } from '../dtos/ReturnBookDto';

export interface ReturnBookResult {
  loan: Loan;
  fine: number;
}

@Injectable()
export class ReturnBookUseCase {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly loanRepository: LoanRepository,
  ) {}

  async execute(_dto: ReturnBookDto): Promise<ReturnBookResult> {
    throw new Error('ReturnBookUseCase not implemented');
  }
}
