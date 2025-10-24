import { Test, TestingModule } from '@nestjs/testing';
import { LoansController } from '../../../../src/presentation/controllers/loans.controller';
import { CreateLoanUseCase } from '../../../../src/application/use-cases/CreateLoanUseCase';
import { ReturnBookUseCase } from '../../../../src/application/use-cases/ReturnBookUseCase';
import { GetUserLoansUseCase } from '../../../../src/application/use-cases/GetUserLoansUseCase';
import { GetAllLoansUseCase } from '../../../../src/application/use-cases/loans/GetAllLoansUseCase';
import { GetLoanByIdUseCase } from '../../../../src/application/use-cases/loans/GetLoanByIdUseCase';
import { GetLoansByBookIdUseCase } from '../../../../src/application/use-cases/loans/GetLoansByBookIdUseCase';
import { DeleteLoanByIdUseCase } from '../../../../src/application/use-cases/loans/DeleteLoanByIdUseCase';
import { LoanNotFoundException } from '../../../../src/domain/exceptions/loans/LoanNotFoundException';
import { LoanBorrowException } from '../../../../src/domain/exceptions/loans/LoanBorrowException';
import { BookNotFoundException } from '../../../../src/domain/exceptions/books/BookNotFoundException';
import { HttpException, Logger } from '@nestjs/common';
import { CreateLoanDto } from '../../../../src/application/dtos/CreateLoanDto';
import { ReturnBookDto } from '../../../../src/application/dtos/ReturnBookDto';

describe('LoansController', () => {
  let controller: LoansController;
  let mockCreateLoanUseCase: Partial<CreateLoanUseCase>;
  let mockReturnBookUseCase: Partial<ReturnBookUseCase>;
  let mockGetUserLoansUseCase: Partial<GetUserLoansUseCase>;
  let mockGetAllLoansUseCase: Partial<GetAllLoansUseCase>;
  let mockGetLoanByIdUseCase: Partial<GetLoanByIdUseCase>;
  let mockGetLoanByBookIdUseCase: Partial<GetLoansByBookIdUseCase>;
  let mockDeleteLoanByIdUseCase: Partial<DeleteLoanByIdUseCase>;

  const dummyLoan = {
    id: 'loan-id',
    bookId: 'book-id',
    userId: 'user-id',
    loanDate: new Date(),
    expectedReturnDate: new Date(),
    returnDate: null,
    status: 'ACTIVE',
    userType: 'ADMIN',
  };

  beforeEach(async () => {
    mockCreateLoanUseCase = { execute: jest.fn() };
    mockReturnBookUseCase = { execute: jest.fn() };
    mockGetUserLoansUseCase = { execute: jest.fn() };
    mockGetAllLoansUseCase = { execute: jest.fn() };
    mockGetLoanByIdUseCase = { execute: jest.fn() };
    mockGetLoanByBookIdUseCase = { execute: jest.fn() };
    mockDeleteLoanByIdUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoansController],
      providers: [
        { provide: CreateLoanUseCase, useValue: mockCreateLoanUseCase },
        { provide: ReturnBookUseCase, useValue: mockReturnBookUseCase },
        { provide: GetUserLoansUseCase, useValue: mockGetUserLoansUseCase },
        { provide: GetAllLoansUseCase, useValue: mockGetAllLoansUseCase },
        { provide: GetLoanByIdUseCase, useValue: mockGetLoanByIdUseCase },
        { provide: GetLoansByBookIdUseCase, useValue: mockGetLoanByBookIdUseCase },
        { provide: DeleteLoanByIdUseCase, useValue: mockDeleteLoanByIdUseCase },
      ],
    }).compile();

    controller = module.get<LoansController>(LoansController);

    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  });

  describe('getAllLoans', () => {
    it('should return all loans', async () => {
      (mockGetAllLoansUseCase.execute as jest.Mock).mockResolvedValue([dummyLoan]);
      const result = await controller.getAllLoans();
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Loans have been found correctly',
        data: [dummyLoan],
      });
    });

    it('should throw HttpException on error', async () => {
      (mockGetAllLoansUseCase.execute as jest.Mock).mockRejectedValue(new Error());
      await expect(controller.getAllLoans()).rejects.toThrow(HttpException);
    });
  });

  describe('getLoanById', () => {
    it('should return loan by ID', async () => {
      (mockGetLoanByIdUseCase.execute as jest.Mock).mockResolvedValue(dummyLoan);
      const result = await controller.getLoanById('loan-id');
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been found correctly',
        data: dummyLoan,
      });
    });

    it('should throw 404 if loan not found', async () => {
      (mockGetLoanByIdUseCase.execute as jest.Mock).mockRejectedValue(new LoanNotFoundException());
      await expect(controller.getLoanById('missing-id')).rejects.toThrow(HttpException);
    });
  });

  describe('getLoanByBookId', () => {
    it('should return loans by book ID', async () => {
      (mockGetLoanByBookIdUseCase.execute as jest.Mock).mockResolvedValue([dummyLoan]);
      const result = await controller.getLoanByBookId('book-id');
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Loans by bookId have been found correctly',
        data: [dummyLoan],
      });
    });

    it('should throw 400 for LoanBorrowException', async () => {
      (mockGetLoanByBookIdUseCase.execute as jest.Mock).mockRejectedValue(
        new LoanBorrowException(),
      );
      await expect(controller.getLoanByBookId('book-id')).rejects.toThrow(HttpException);
    });
  });

  describe('getUserLoans', () => {
    it('should return loans by user ID', async () => {
      (mockGetUserLoansUseCase.execute as jest.Mock).mockResolvedValue([dummyLoan]);
      const result = await controller.getUserLoans('user-id');
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Loans by user have been found correctly',
        data: [dummyLoan],
      });
    });

    it('should throw 400 for LoanBorrowException', async () => {
      (mockGetUserLoansUseCase.execute as jest.Mock).mockRejectedValue(new LoanBorrowException());
      await expect(controller.getUserLoans('user-id')).rejects.toThrow(HttpException);
    });
  });

  describe('createLoan', () => {
    const createLoanDto: CreateLoanDto = { bookId: 'book-id', userId: 'user-id' };

    it('should create a loan', async () => {
      (mockCreateLoanUseCase.execute as jest.Mock).mockResolvedValue(dummyLoan);
      const result = await controller.createLoan(createLoanDto);
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been created correctly',
        data: dummyLoan,
      });
    });

    it('should throw 404 if book or user not found', async () => {
      (mockCreateLoanUseCase.execute as jest.Mock).mockRejectedValue(new BookNotFoundException());
      await expect(controller.createLoan(createLoanDto)).rejects.toThrow(HttpException);
    });

    it('should throw 400 for LoanBorrowException', async () => {
      (mockCreateLoanUseCase.execute as jest.Mock).mockRejectedValue(new LoanBorrowException());
      await expect(controller.createLoan(createLoanDto)).rejects.toThrow(HttpException);
    });
  });

  describe('returnBook', () => {
    const returnBookDto: ReturnBookDto = {
      loanId: 'loan-id',
      returnDate: '2025-10-24T12:34:56.789Z',
    };

    it('should return a loan', async () => {
      const response = { loan: dummyLoan, fine: 0 };
      (mockReturnBookUseCase.execute as jest.Mock).mockResolvedValue(response);
      const result = await controller.returnBook(returnBookDto);
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been returned correctly',
        data: response,
      });
    });

    it('should throw 404 if loan, user, or book not found', async () => {
      (mockReturnBookUseCase.execute as jest.Mock).mockRejectedValue(new LoanNotFoundException());
      await expect(controller.returnBook(returnBookDto)).rejects.toThrow(HttpException);
    });

    it('should throw 400 for LoanBorrowException', async () => {
      (mockReturnBookUseCase.execute as jest.Mock).mockRejectedValue(new LoanBorrowException());
      await expect(controller.returnBook(returnBookDto)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteBookById', () => {
    it('should delete a loan', async () => {
      (mockDeleteLoanByIdUseCase.execute as jest.Mock).mockResolvedValue(undefined);
      const result = await controller.deleteBookById('loan-id');
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been deleted correctly',
        data: null,
      });
    });

    it('should throw 404 if loan not found', async () => {
      (mockDeleteLoanByIdUseCase.execute as jest.Mock).mockRejectedValue(
        new LoanNotFoundException(),
      );
      await expect(controller.deleteBookById('loan-id')).rejects.toThrow(HttpException);
    });
  });
});
