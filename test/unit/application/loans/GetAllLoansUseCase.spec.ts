import { GetAllLoansUseCase } from '../../../../src/application/use-cases/loans/GetAllLoansUseCase';
import { ILoanRepository } from '../../../../src/domain/interfaces/ILoanRepository';
import { Loan } from '../../../../src/domain/entities/Loan.entity';
import { LoanStatus } from '../../../../src/domain/entities/LoanStatus.enum';
import { UserType } from '../../../../src/domain/entities/UserType.enum';

describe('GetAllLoansUseCase', () => {
  let getAllLoansUseCase: GetAllLoansUseCase;

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

    getAllLoansUseCase = new GetAllLoansUseCase(loanRepository);
  });

  it('Should return all loans when they exist', async () => {
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

    loanRepository.findAll.mockResolvedValue(loans);

    const result = await getAllLoansUseCase.execute();

    expect(result).toEqual(loans);
    expect(loanRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('Should return empty array if no loans exist', async () => {
    loanRepository.findAll.mockResolvedValue([]);

    const result = await getAllLoansUseCase.execute();

    expect(result).toEqual([]);
    expect(loanRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('Should propagate unexpected repository errors', async () => {
    loanRepository.findAll.mockRejectedValue(new Error('Database error'));

    await expect(getAllLoansUseCase.execute()).rejects.toThrow('Database error');
  });
});
