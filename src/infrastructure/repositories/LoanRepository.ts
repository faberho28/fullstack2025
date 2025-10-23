import { Injectable } from '@nestjs/common';
import { ILoanRepository } from '../../domain/interfaces/ILoanRepository';
import { Loan } from '../../domain/entities/Loan.entity';
import { LoanEntity } from '../database/entities/LoanEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanStatus } from '../../domain/entities/LoanStatus.enum';
import { UserType } from '../../domain/entities/UserType.enum';
import { LoanNotFoundException } from '../../domain/exceptions/loans/LoanNotFoundException';

@Injectable()
export class LoanRepository implements ILoanRepository {
  constructor(
    @InjectRepository(LoanEntity)
    private readonly loanRepository: Repository<LoanEntity>,
  ) {}

  private toDomain = (entity: LoanEntity): Loan => {
    return new Loan(
      entity.id,
      entity.bookId,
      entity.userId,
      entity.loanDate,
      entity.expectedReturnDate,
      entity.returnDate,
      entity.status as LoanStatus,
      entity.userType as UserType,
    );
  };

  private toEntity = (domain: Loan): LoanEntity => {
    const entity = new LoanEntity();
    entity.id = domain.id;
    entity.bookId = domain.bookId;
    entity.userId = domain.userId;
    entity.loanDate = domain.loanDate;
    entity.expectedReturnDate = domain.expectedReturnDate;
    entity.returnDate = domain.getReturnDate();
    entity.status = domain.getStatus();
    entity.userType = domain.getUserType();
    return entity;
  };

  async findById(_id: string): Promise<Loan> {
    const loan = await this.loanRepository.findOneBy({ id: _id });
    if (!loan) {
      throw new LoanNotFoundException();
    }
    return this.toDomain(loan);
  }

  async findByUserId(_userId: string): Promise<Loan[]> {
    const loans = await this.loanRepository.findBy({ userId: _userId });
    return loans.map(this.toDomain);
  }

  async findActiveByUserId(_userId: string): Promise<Loan[]> {
    const loans = await this.loanRepository.findBy({ userId: _userId, status: LoanStatus.ACTIVE });
    return loans.map(this.toDomain);
  }

  async findOverdueByUserId(_userId: string): Promise<Loan[]> {
    const loans = await this.loanRepository.findBy({ userId: _userId, status: LoanStatus.OVERDUE });
    return loans.map(this.toDomain);
  }

  async findByBookId(_bookId: string): Promise<Loan[]> {
    const loans = await this.loanRepository.findBy({ bookId: _bookId });
    return loans.map(this.toDomain);
  }

  async save(_loan: Loan): Promise<Loan> {
    const dataLoan = this.toEntity(_loan);
    await this.loanRepository.save(dataLoan);
    return _loan;
  }

  async update(_loan: Loan): Promise<Loan> {
    const updatedBook = this.toEntity(_loan);
    await this.loanRepository.update({ id: _loan.id }, updatedBook);
    return _loan;
  }

  async findAll(): Promise<Loan[]> {
    const loans = await this.loanRepository.find();
    return loans.map(this.toDomain);
  }

  async delete(_id: string): Promise<void> {
    const result = await this.loanRepository.delete({ id: _id });
    if (result.affected === 0) {
      throw new LoanNotFoundException();
    }
  }
}
