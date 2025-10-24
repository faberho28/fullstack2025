import { GetLoansByBookIdUseCase } from '../../../../src/application/use-cases/loans/GetLoansByBookIdUseCase';
import { ILoanRepository } from '../../../../src/domain/interfaces/ILoanRepository';
import { Loan } from '../../../../src/domain/entities/Loan.entity';
import { LoanStatus } from '../../../../src/domain/entities/LoanStatus.enum';
import { UserType } from '../../../../src/domain/entities/UserType.enum';
import { LoanBorrowException } from '../../../../src/domain/exceptions/loans/LoanBorrowException';

describe('GetLoanByIdUseCase', () => {
  let getLoansByBookIdUseCase: GetLoansByBookIdUseCase;

  let loanRepository: jest.Mocked<ILoanRepository>;

  beforeEach(() => {
    loanRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      findActiveByUserId: jest.fn(),
      findOverdueByUserId: jest.fn(),
      findByBookId: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    getLoansByBookIdUseCase = new GetLoansByBookIdUseCase(loanRepository);
  });

  it('Should return loans for a book when they exist', async () => {
    const bookId = 'book-123';
    const loans: Loan[] = [
      new Loan(
        'loan-1',
        bookId,
        'user-123',
        new Date(),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        null,
        LoanStatus.ACTIVE,
        UserType.ADMIN,
      ),
      new Loan(
        'loan-2',
        bookId,
        'user-123',
        new Date(),
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        null,
        LoanStatus.ACTIVE,
        UserType.ADMIN,
      ),
    ];

    loanRepository.findByBookId.mockResolvedValue(loans);

    const result = await getLoansByBookIdUseCase.execute(bookId);

    expect(result).toEqual(loans);
    expect(loanRepository.findByBookId).toHaveBeenCalledWith(bookId);
    expect(loanRepository.findByBookId).toHaveBeenCalledTimes(1);
  });

  it('Should throw LoanBorrowException if no loans exist for the book', async () => {
    const bookId = 'book-123';
    loanRepository.findByBookId.mockResolvedValue([]);

    await expect(getLoansByBookIdUseCase.execute(bookId)).rejects.toThrow(LoanBorrowException);

    expect(loanRepository.findByBookId).toHaveBeenCalledWith(bookId);
  });

  it('Should propagate unexpected repository errors', async () => {
    const bookId = 'book-123';
    loanRepository.findByBookId.mockRejectedValue(new Error('Database error'));

    await expect(getLoansByBookIdUseCase.execute(bookId)).rejects.toThrow('Database error');
  });
});
