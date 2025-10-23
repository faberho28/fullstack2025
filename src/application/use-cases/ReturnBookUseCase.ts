import { Inject, Injectable } from '@nestjs/common';
import { Loan } from '../../domain/entities/Loan.entity';
import { ReturnBookDto } from '../dtos/ReturnBookDto';
import { IBookRepository } from '../../domain/interfaces/IBookRepository';
import { ILoanRepository } from '../../domain/interfaces/ILoanRepository';
import { LoanRules } from '../../domain/rules/LoanRules';
import { LoanNotFoundException } from '../../domain/exceptions/loans/LoanNotFoundException';
import { BookNotFoundException } from '../../domain/exceptions/books/BookNotFoundException';
import { LoanBorrowException } from '../../domain/exceptions/loans/LoanBorrowException';

export interface ReturnBookResult {
  loan: Loan;
  fine: number;
}

@Injectable()
export class ReturnBookUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,

    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository,
  ) {}

  async execute(_dto: ReturnBookDto): Promise<ReturnBookResult> {
    const { loanId, returnDate } = _dto;

    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      throw new LoanNotFoundException();
    }

    const book = await this.bookRepository.findById(loan.bookId);
    if (!book) {
      throw new BookNotFoundException();
    }

    const hasBeenReturned = LoanRules.validateReturnBook(loan);

    if (!hasBeenReturned.canReturn) {
      throw new LoanBorrowException(hasBeenReturned.reason);
    }

    const normalizeReturnDate = returnDate ? new Date(returnDate) : new Date();

    const fine = loan.calculateFine(normalizeReturnDate);

    loan.returnBook(normalizeReturnDate);

    book?.increaseAvailableCopies();

    await this.loanRepository.update(loan);
    await this.bookRepository.update(book);

    return {
      loan: loan,
      fine: fine,
    };
  }
}
