import { Inject, Injectable } from '@nestjs/common';
import { CreateLoanDto } from '../dtos/CreateLoanDto';
import { Loan } from '../../domain/entities/Loan.entity';
import { LoanRules } from '../../domain/rules/LoanRules';
import { IBookRepository } from '../../domain/interfaces/IBookRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { ILoanRepository } from '../../domain/interfaces/ILoanRepository';
import { BookNotFoundException } from '../../domain/exceptions/books/BookNotFoundException';
import { UserNotFoundException } from '../../domain/exceptions/users/UserNotFoundException';
import { LoanBorrowException } from '../../domain/exceptions/loans/LoanBorrowException';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateLoanUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,

    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,

    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository,
  ) {}

  async execute(_dto: CreateLoanDto): Promise<Loan> {
    const { bookId, userId } = _dto;
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new BookNotFoundException();
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundException();
    }

    const activeLoans = await this.loanRepository.findActiveByUserId(userId);
    const overdueLoans = await this.loanRepository.findOverdueByUserId(userId);

    const validationLoan = LoanRules.canUserBorrowBook(user, book, activeLoans, overdueLoans);

    if (!validationLoan.canBorrow) {
      throw new LoanBorrowException(validationLoan.reason);
    }

    const loan = Loan.createNew(uuidv4(), bookId, userId, user.type);

    book.decreaseAvailableCopies();

    await this.loanRepository.save(loan);
    await this.bookRepository.update(book);

    return loan;
  }
}
