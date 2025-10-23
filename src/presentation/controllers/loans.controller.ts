import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  HttpException,
  Delete,
} from '@nestjs/common';
import { CreateLoanUseCase } from '../../application/use-cases/CreateLoanUseCase';
import { ReturnBookResult, ReturnBookUseCase } from '../../application/use-cases/ReturnBookUseCase';
import { GetUserLoansUseCase } from '../../application/use-cases/GetUserLoansUseCase';
import { CreateLoanDto } from '../../application/dtos/CreateLoanDto';
import { ReturnBookDto } from '../../application/dtos/ReturnBookDto';
import { GetAllLoansUseCase } from '../../application/use-cases/loans/GetAllLoansUseCase';
import { GetLoanByIdUseCase } from '../../application/use-cases/loans/GetLoanByIdUseCase';
import { GetLoansByBookIdUseCase } from '../../application/use-cases/loans/GetLoansByBookIdUseCase';
import { DeleteLoanByIdUseCase } from '../../application/use-cases/loans/DeleteLoanByIdUseCase';
import { LoanNotFoundException } from '../../domain/exceptions/loans/LoanNotFoundException';
import { LoanBorrowException } from '../../domain/exceptions/loans/LoanBorrowException';
import { BookNotFoundException } from '../../domain/exceptions/books/BookNotFoundException';
import { UserNotFoundException } from '../../domain/exceptions/users/UserNotFoundException';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ApiResponseType } from '../types/ApiResponse';
import { Loan } from '../../domain/entities/Loan.entity';

@Controller('loans')
export class LoansController {
  constructor(
    private readonly createLoanUseCase: CreateLoanUseCase,
    private readonly returnBookUseCase: ReturnBookUseCase,
    private readonly getUserLoansUseCase: GetUserLoansUseCase,
    private readonly getAllLoansUseCase: GetAllLoansUseCase,
    private readonly getLoanByIdUseCase: GetLoanByIdUseCase,
    private readonly getLoanByBookIdUseCase: GetLoansByBookIdUseCase,
    private readonly deleteLoanByIdUseCase: DeleteLoanByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all loans',
    description: 'Retrieve all loans registered in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of loans retrieved successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loans have been found correctly',
        data: [
          {
            id: '73a7466c-ad9f-4c45-b4fc-6213677803de',
            bookId: '9d9a86b4-f757-4156-b868-28b1f43df271',
            userId: '282d1ffe-965f-4c32-9c8b-de1c91bfa699',
            loanDate: '2025-10-23T16:35:39.361Z',
            expectedReturnDate: '2025-11-22T16:35:39.361Z',
            returnDate: null,
            status: 'ACTIVE',
            userType: 'ADMIN',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An unexpected error occurred while finding the loans',
        data: [],
      },
    },
  })
  async getAllLoans(): Promise<ApiResponseType<Loan[]>> {
    try {
      const response = await this.getAllLoansUseCase.execute();
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loans have been found correctly',
        data: response,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while finding the loans',
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get loan by ID',
    description: 'Retrieve a single loan by its unique identifier.',
  })
  @ApiParam({ name: 'id', description: 'Unique identifier of the loan' })
  @ApiResponse({
    status: 200,
    description: 'Loan retrieved successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been found correctly',
        data: {
          id: '73a7466c-ad9f-4c45-b4fc-6213677803de',
          bookId: '9d9a86b4-f757-4156-b868-28b1f43df271',
          userId: '282d1ffe-965f-4c32-9c8b-de1c91bfa699',
          loanDate: '2025-10-23T16:35:39.361Z',
          expectedReturnDate: '2025-11-22T16:35:39.361Z',
          returnDate: null,
          status: 'ACTIVE',
          userType: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Loan not found.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: 'Loan not found',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An unexpected error occurred while finding the loan',
        data: {},
      },
    },
  })
  async getLoanById(@Param('id') _id: string): Promise<ApiResponseType<Loan>> {
    try {
      const response = await this.getLoanByIdUseCase.execute(_id);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been found correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof LoanNotFoundException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while finding the loan',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('book/:bookId')
  @ApiOperation({
    summary: 'Get loans by book ID',
    description: 'Retrieve all loans associated with a specific book.',
  })
  @ApiParam({ name: 'bookId', description: 'Unique identifier of the book' })
  @ApiResponse({
    status: 200,
    description: 'Loans retrieved successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loans by bookId have been found correctly',
        data: [
          {
            id: '73a7466c-ad9f-4c45-b4fc-6213677803de',
            bookId: '9d9a86b4-f757-4156-b868-28b1f43df271',
            userId: '282d1ffe-965f-4c32-9c8b-de1c91bfa699',
            loanDate: '2025-10-23T16:35:39.361Z',
            expectedReturnDate: '2025-11-22T16:35:39.361Z',
            returnDate: null,
            status: 'ACTIVE',
            userType: 'ADMIN',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid loan request.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: 'LoanBorrowException',
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or has no loans.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: 'Loans by book not found',
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An unexpected error occurred while finding the loans by book id',
        data: {},
      },
    },
  })
  async getLoanByBookId(@Param('bookId') _bookId: string): Promise<ApiResponseType<Loan[]>> {
    try {
      const response = await this.getLoanByBookIdUseCase.execute(_bookId);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loans by bookId have been found correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof LoanBorrowException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while finding the loans by book id',
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get loans by user ID',
    description: 'Retrieve all loans associated with a specific user.',
  })
  @ApiParam({ name: 'userId', description: 'Unique identifier of the user' })
  @ApiResponse({
    status: 200,
    description: 'Loans retrieved successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loans by user have been found correctly',
        data: [
          {
            id: '73a7466c-ad9f-4c45-b4fc-6213677803de',
            bookId: '9d9a86b4-f757-4156-b868-28b1f43df271',
            userId: '282d1ffe-965f-4c32-9c8b-de1c91bfa699',
            loanDate: '2025-10-23T16:35:39.361Z',
            expectedReturnDate: '2025-11-22T16:35:39.361Z',
            returnDate: null,
            status: 'ACTIVE',
            userType: 'ADMIN',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid loan request.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: 'LoanBorrowException',
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found or has no loans.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: "User doesn't have associated loans",
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An unexpected error occurred while finding the loan',
        data: {},
      },
    },
  })
  async getUserLoans(@Param('userId') userId: string): Promise<ApiResponseType<Loan[]>> {
    try {
      const response = await this.getUserLoansUseCase.execute(userId);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loans by user have been found correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof LoanBorrowException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while finding the loan',
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new loan',
    description: 'Creates a loan for a user and a book.',
  })
  @ApiBody({
    description: 'Create a new loan',
    type: CreateLoanDto,
    examples: {
      example: {
        value: {
          bookId: '9d9a86b4-f757-4156-b868-28b1f43df271',
          userId: '282d1ffe-965f-4c32-9c8b-de1c91bfa699',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Loan created successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been created correctly',
        data: {
          id: '9252c8ce-49cc-4fdb-b57a-e6e063c5866a',
          bookId: 'd8b9ea8e-fdf6-4abb-aa50-040273d06e53',
          userId: '282d1ffe-965f-4c32-9c8b-de1c91bfa699',
          loanDate: '2025-10-23T16:50:36.488Z',
          expectedReturnDate: '2025-11-22T16:50:36.488Z',
          returnDate: null,
          status: 'ACTIVE',
          userType: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid loan request.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: 'LoanBorrowException',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User or book not found.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: '(Book or user) not found.',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An unexpected error occurred while creating the loan',
        data: {},
      },
    },
  })
  async createLoan(@Body() createLoanDto: CreateLoanDto): Promise<ApiResponseType<Loan>> {
    try {
      const response = await this.createLoanUseCase.execute(createLoanDto);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been created correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof BookNotFoundException || error instanceof UserNotFoundException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (error instanceof LoanBorrowException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: {},
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while creating the loan',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('return')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Return a borrowed book',
    description: 'Marks an existing loan as returned by the user.',
  })
  @ApiBody({
    description: 'Loan to be returned',
    type: ReturnBookDto,
    examples: {
      example1: {
        summary: 'Valid loan return request',
        value: {
          loanId: '6b4fb534-e9fb-4e8a-82b1-2251bfe594a9',
          returnDate: '2025-10-24T14:30:00Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Book returned successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been returned correctly',
        data: {
          loan: {
            id: '6b4fb534-e9fb-4e8a-82b1-2251bfe594a9',
            bookId: '9d9a86b4-f757-4156-b868-28b1f43df271',
            userId: '282d1ffe-965f-4c32-9c8b-de1c91bfa699',
            loanDate: '2025-10-23T16:33:17.797Z',
            expectedReturnDate: '2025-11-22T16:33:17.797Z',
            returnDate: '2025-10-24T12:34:56.789Z',
            status: 'RETURNED',
            userType: 'ADMIN',
          },
          fine: 0,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid return request.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: 'LoanBorrowException',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Book, user, or loan not found.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: '(Book, user, or loan) not found.',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An unexpected error occurred while returning the loan',
        data: {},
      },
    },
  })
  async returnBook(
    @Body() returnBookDto: ReturnBookDto,
  ): Promise<ApiResponseType<ReturnBookResult>> {
    try {
      const response = await this.returnBookUseCase.execute(returnBookDto);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been returned correctly',
        data: response,
      };
    } catch (error) {
      if (
        error instanceof BookNotFoundException ||
        error instanceof UserNotFoundException ||
        error instanceof LoanNotFoundException
      ) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }
      if (error instanceof LoanBorrowException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: {},
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while returning the loan',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a loan by ID',
    description: 'Deletes a loan from the system by its ID.',
  })
  @ApiParam({ name: 'id', description: 'Unique identifier of the loan' })
  @ApiResponse({
    status: 200,
    description: 'Loan deleted successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been deleted correctly',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Loan not found.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'Loan not found.',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An error occurred while deleting the loan',
        data: {},
      },
    },
  })
  async deleteBookById(@Param('id') _id: string): Promise<ApiResponseType<Loan | null>> {
    try {
      await this.deleteLoanByIdUseCase.execute(_id);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Loan has been deleted correctly',
        data: null,
      };
    } catch (error) {
      if (error instanceof LoanNotFoundException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An error occurred while deleting the loan',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
