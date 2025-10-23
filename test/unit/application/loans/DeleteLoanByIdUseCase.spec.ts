import { DeleteLoanByIdUseCase } from '../../../../src/application/use-cases/loans/DeleteLoanByIdUseCase';
import { ILoanRepository } from '../../../../src/domain/interfaces/ILoanRepository';
import { LoanNotFoundException } from '../../../../src/domain/exceptions/loans/LoanNotFoundException';

describe('DeleteLoanByIdUseCase', () => {
  let deleteLoanByIdUseCase: DeleteLoanByIdUseCase;

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

    deleteLoanByIdUseCase = new DeleteLoanByIdUseCase(loanRepository);
  });

  it('Should delete a loan successfully', async () => {
    const loanId = 'loan-123';
    loanRepository.delete.mockResolvedValue(undefined);

    await expect(deleteLoanByIdUseCase.execute(loanId)).resolves.not.toThrow();
    expect(loanRepository.delete).toHaveBeenCalledWith(loanId);
    expect(loanRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('Should propagate LoanBorrowException if loan does not exist', async () => {
    const loanId = 'non-existent-loan';
    loanRepository.delete.mockRejectedValue(new LoanNotFoundException());

    await expect(deleteLoanByIdUseCase.execute(loanId)).rejects.toThrow(LoanNotFoundException);

    expect(loanRepository.delete).toHaveBeenCalledWith(loanId);
  });

  it('Should propagate unexpected repository errors', async () => {
    const loanId = 'loan-123';
    loanRepository.delete.mockRejectedValue(new Error('Database error'));

    await expect(deleteLoanByIdUseCase.execute(loanId)).rejects.toThrow('Database error');
  });
});
