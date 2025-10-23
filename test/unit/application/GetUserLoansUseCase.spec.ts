import { GetUserLoansUseCase } from '../../../src/application/use-cases/GetUserLoansUseCase';
import { ILoanRepository } from '../../../src/domain/interfaces/ILoanRepository';
import { Loan } from '../../../src/domain/entities/Loan.entity';
import { LoanStatus } from '../../../src/domain/entities/LoanStatus.enum';
import { UserType } from '../../../src/domain/entities/UserType.enum';
import { LoanBorrowException } from '../../../src/domain/exceptions/loans/LoanBorrowException';

describe('GetUserLoansUseCase', () => {
  let getUserLoansUseCase: GetUserLoansUseCase;

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

    getUserLoansUseCase = new GetUserLoansUseCase(loanRepository);
  });

  it("Should return user's loans when they exist", async () => {
    const loans: Loan[] = [
      new Loan(
        'loan-1',
        'book-1',
        'user-123',
        new Date(),
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        null,
        LoanStatus.ACTIVE,
        UserType.ADMIN,
      ),
      new Loan(
        'loan-2',
        'book-2',
        'user-123',
        new Date(),
        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        null,
        LoanStatus.ACTIVE,
        UserType.ADMIN,
      ),
    ];

    loanRepository.findByUserId.mockResolvedValue(loans);

    const result = await getUserLoansUseCase.execute('user-123');

    expect(result).toEqual(loans);
    expect(loanRepository.findByUserId).toHaveBeenCalledWith('user-123');
    expect(loanRepository.findByUserId).toHaveBeenCalledTimes(1);
  });

  it('Should throw LoanBorrowException if user has no loans', async () => {
    loanRepository.findByUserId.mockResolvedValue([]);

    await expect(getUserLoansUseCase.execute('user-123')).rejects.toThrow(LoanBorrowException);

    expect(loanRepository.findByUserId).toHaveBeenCalledWith('user-123');
  });

  it('Should propagate unexpected repository errors', async () => {
    loanRepository.findByUserId.mockRejectedValue(new Error('Database error'));

    await expect(getUserLoansUseCase.execute('user-123')).rejects.toThrow('Database error');
  });
});
