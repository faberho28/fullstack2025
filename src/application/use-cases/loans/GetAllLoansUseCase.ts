import { Inject, Injectable } from '@nestjs/common';
import { Loan } from '../../../domain/entities/Loan.entity';
import { ILoanRepository } from '../../../domain/interfaces/ILoanRepository';

@Injectable()
export class GetAllLoansUseCase {
  constructor(
    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository,
  ) {}

  async execute(): Promise<Loan[]> {
    const loans = await this.loanRepository.findAll();
    return loans;
  }
}
