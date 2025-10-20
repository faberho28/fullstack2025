import { Injectable } from '@nestjs/common';
import { ILoanRepository } from '../../domain/interfaces/ILoanRepository';
import { Loan } from '../../domain/entities/Loan.entity';

@Injectable()
export class LoanRepository implements ILoanRepository {
  async findById(_id: string): Promise<Loan | null> {
    throw new Error('LoanRepository.findById not implemented');
  }

  async findByUserId(_userId: string): Promise<Loan[]> {
    throw new Error('LoanRepository.findByUserId not implemented');
  }

  async findActiveByUserId(_userId: string): Promise<Loan[]> {
    throw new Error('LoanRepository.findActiveByUserId not implemented');
  }

  async findOverdueByUserId(_userId: string): Promise<Loan[]> {
    throw new Error('LoanRepository.findOverdueByUserId not implemented');
  }

  async findByBookId(_bookId: string): Promise<Loan[]> {
    throw new Error('LoanRepository.findByBookId not implemented');
  }

  async save(_loan: Loan): Promise<Loan> {
    throw new Error('LoanRepository.save not implemented');
  }

  async update(_loan: Loan): Promise<Loan> {
    throw new Error('LoanRepository.update not implemented');
  }

  async findAll(): Promise<Loan[]> {
    throw new Error('LoanRepository.findAll not implemented');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('LoanRepository.delete not implemented');
  }
}
