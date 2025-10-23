import { GetLoanByIdUseCase } from '../../../../src/application/use-cases/loans/GetLoanByIdUseCase';
import { ILoanRepository } from '../../../../src/domain/interfaces/ILoanRepository';
import { Loan } from '../../../../src/domain/entities/Loan.entity';
import { LoanStatus } from '../../../../src/domain/entities/LoanStatus.enum';
import { UserType } from '../../../../src/domain/entities/UserType.enum';
import { LoanNotFoundException } from '../../../../src/domain/exceptions/loans/LoanNotFoundException';

describe('GetLoanByIdUseCase', () => {
  let getLoanByIdUseCase: GetLoanByIdUseCase;

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

    getLoanByIdUseCase = new GetLoanByIdUseCase(loanRepository);
  });

  it('Should return a loan when it exists', async () => {
    const loanId = 'loan-123';
    const loan = new Loan(
      loanId,
      'book-1',
      'user-123',
      new Date(),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      null,
      LoanStatus.ACTIVE,
      UserType.ADMIN,
    );

    loanRepository.findById.mockResolvedValue(loan);

    const result = await getLoanByIdUseCase.execute(loanId);

    expect(result).toBe(loan);
    expect(loanRepository.findById).toHaveBeenCalledWith(loanId);
    expect(loanRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('Should throw LoanNotFoundException if loan does not exist', async () => {
    const loanId = 'non-existent-loan';
    loanRepository.findById.mockResolvedValue(null);

    await expect(getLoanByIdUseCase.execute(loanId)).rejects.toThrow(LoanNotFoundException);

    expect(loanRepository.findById).toHaveBeenCalledWith(loanId);
  });

  it('Should propagate unexpected repository errors', async () => {
    const loanId = 'loan-123';
    loanRepository.findById.mockRejectedValue(new Error('Database error'));

    await expect(getLoanByIdUseCase.execute(loanId)).rejects.toThrow('Database error');
  });
});
