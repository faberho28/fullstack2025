import { Module } from '@nestjs/common';
import { CreateLoanUseCase } from './use-cases/CreateLoanUseCase';
import { ReturnBookUseCase } from './use-cases/ReturnBookUseCase';
import { GetUserLoansUseCase } from './use-cases/GetUserLoansUseCase';
import { CheckBookAvailabilityUseCase } from './use-cases/CheckBookAvailabilityUseCase';
import { GetAllBooksUseCase } from './use-cases/books/GetAllBooksUseCase';
import { CreateBookUseCase } from './use-cases/books/CreateBookUseCase';
import { UpdateBookByIdUseCase } from './use-cases/books/UpdateBookByIdUseCase';
import { FindBookByIdUseCase } from './use-cases/books/FindBookByIdUseCase';
import { FindBookByISBNUseCase } from './use-cases/books/FindBookByISBNUseCase';
import { DeleteBookByIdUseCase } from './use-cases/books/DeleteBookByIdUseCase';
import { DeleteLoanByIdUseCase } from './use-cases/loans/DeleteLoanByIdUseCase';
import { GetAllLoansUseCase } from './use-cases/loans/GetAllLoansUseCase';
import { GetLoanByIdUseCase } from './use-cases/loans/GetLoanByIdUseCase';
import { GetLoansByBookIdUseCase } from './use-cases/loans/GetLoansByBookIdUseCase';
import { BookRepository } from '../infrastructure/repositories/BookRepository';
import { UserRepository } from '../infrastructure/repositories/UserRepository';
import { LoanRepository } from '../infrastructure/repositories/LoanRepository';
import { BookEntity } from '../infrastructure/database/entities/BookEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanEntity } from '../infrastructure/database/entities/LoanEntity';
import { UserEntity } from '../infrastructure/database/entities/UserEntity';
import { CreateUserUseCase } from './use-cases/users/CreateUserUseCase';
import { DeleteUserByIdUseCase } from './use-cases/users/DeleteUserByIdUseCase';
import { GetAllUsersUseCase } from './use-cases/users/GetAllUsersUseCase';
import { GetUserByEmailUseCase } from './use-cases/users/GetUserByEmailUseCase';
import { GetUserByIdUseCase } from './use-cases/users/GetUserByIdUseCase';
import { UpdateUserUseCase } from './use-cases/users/UpdateUserUseCase';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, LoanEntity, UserEntity])],
  providers: [
    //Books
    ReturnBookUseCase,
    CheckBookAvailabilityUseCase,
    GetAllBooksUseCase,
    CreateBookUseCase,
    UpdateBookByIdUseCase,
    FindBookByIdUseCase,
    FindBookByISBNUseCase,
    DeleteBookByIdUseCase,
    BookRepository,
    //Loans
    CreateLoanUseCase,
    GetUserLoansUseCase,
    DeleteLoanByIdUseCase,
    GetAllLoansUseCase,
    GetLoanByIdUseCase,
    GetLoansByBookIdUseCase,
    LoanRepository,
    //Users
    CreateUserUseCase,
    DeleteUserByIdUseCase,
    GetAllUsersUseCase,
    GetUserByEmailUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
    UserRepository,
    //Interfaces
    {
      provide: 'IBookRepository',
      useClass: BookRepository,
    },
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
    {
      provide: 'ILoanRepository',
      useClass: LoanRepository,
    },
  ],
  exports: [
    //Books
    ReturnBookUseCase,
    CheckBookAvailabilityUseCase,
    GetAllBooksUseCase,
    CreateBookUseCase,
    UpdateBookByIdUseCase,
    FindBookByIdUseCase,
    FindBookByISBNUseCase,
    DeleteBookByIdUseCase,
    //Loans
    CreateLoanUseCase,
    GetUserLoansUseCase,
    DeleteLoanByIdUseCase,
    GetAllLoansUseCase,
    GetLoanByIdUseCase,
    GetLoansByBookIdUseCase,
    //Users
    CreateUserUseCase,
    DeleteUserByIdUseCase,
    GetAllUsersUseCase,
    GetUserByEmailUseCase,
    GetUserByIdUseCase,
    UpdateUserUseCase,
  ],
})
export class ApplicationModule {}
