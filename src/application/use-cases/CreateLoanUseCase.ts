import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../infrastructure/repositories/BookRepository';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { LoanRepository } from '../../infrastructure/repositories/LoanRepository';
import { Loan } from '../../domain/entities/Loan.entity';
import { CreateLoanDto } from '../dtos/CreateLoanDto';

@Injectable()
export class CreateLoanUseCase {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly userRepository: UserRepository,
    private readonly loanRepository: LoanRepository,
  ) {}

  async execute(_dto: CreateLoanDto): Promise<Loan> {
    throw new Error('CreateLoanUseCase not implemented');
  }
}
