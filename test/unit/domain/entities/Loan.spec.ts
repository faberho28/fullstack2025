import { Loan } from '../../../../src/domain/entities/Loan.entity';
import { LoanStatus } from '../../../../src/domain/entities/LoanStatus.enum';
import { UserType } from '../../../../src/domain/entities/UserType.enum';

describe('Loan Entity', () => {
  const loanDate = new Date('2024-01-01');

  it('should create a loan with correct expiration date for STUDENT', () => {
    const loanDate = new Date('2024-01-01');
    const loan = Loan.createNew(
      '123e4567-e89b-12d3-a456-426614174000',
      'book-id',
      'user-id',
      UserType.STUDENT,
      loanDate,
    );

    const expectedDate = new Date('2024-01-15'); // 14 days later
    expect(loan.expectedReturnDate.toDateString()).toBe(expectedDate.toDateString());
  });

  it('should create a loan with correct expiration date for TEACHER', () => {
    const loanDate = new Date('2024-01-01');
    const loan = Loan.createNew(
      '123e4567-e89b-12d3-a456-426614174000',
      'book-id',
      'user-id',
      UserType.TEACHER,
      loanDate,
    );

    const expectedDate = new Date('2024-01-31'); // 30 days later
    expect(loan.expectedReturnDate.toDateString()).toBe(expectedDate.toDateString());
  });

  it('should mark loan as overdue after expiration date', () => {
    const loanDate = new Date('2024-01-01');
    const loan = Loan.createNew(
      '123e4567-e89b-12d3-a456-426614174000',
      'book-id',
      'user-id',
      UserType.STUDENT,
      loanDate,
    );

    const currentDate = new Date('2024-01-20'); // 5 days overdue
    expect(loan.isOverdue(currentDate)).toBe(true);
  });

  it('should calculate fine for overdue loans', () => {
    const loanDate = new Date('2024-01-01');
    const loan = Loan.createNew(
      '123e4567-e89b-12d3-a456-426614174000',
      'book-id',
      'user-id',
      UserType.STUDENT,
      loanDate,
    );

    const returnDate = new Date('2024-01-20'); // 5 days overdue (expected: Jan 15)
    loan.returnBook(returnDate);

    const fine = loan.calculateFine();
    expect(fine).toBe(7.5); // 5 days * $1.5 per day
  });

  it('should throw error if expectedReturnDate is before loanDate', () => {
    expect(() => {
      new Loan(
        '1',
        'book-id',
        'user-id',
        loanDate,
        new Date('2023-12-31'),
        null,
        LoanStatus.ACTIVE,
        UserType.STUDENT,
      );
    }).toThrow('Expected return date must be after loan date');
  });

  it('should returnBook and change status to RETURNED', () => {
    const loan = Loan.createNew('1', 'book-id', 'user-id', UserType.STUDENT, loanDate);
    const returnDate = new Date('2024-01-10');
    loan.returnBook(returnDate);

    expect(loan.getStatus()).toBe(LoanStatus.RETURNED);
    expect(loan.getReturnDate()).toEqual(returnDate);
    expect(loan.isReturned()).toBe(true);
  });

  it('should throw error if returnBook called twice', () => {
    const loan = Loan.createNew('1', 'book-id', 'user-id', UserType.STUDENT, loanDate);
    loan.returnBook(new Date('2024-01-10'));

    expect(() => loan.returnBook(new Date('2024-01-11'))).toThrow('Loan is already returned');
  });

  it('should throw error if returnBook called with date before loanDate', () => {
    const loan = Loan.createNew('1', 'book-id', 'user-id', UserType.STUDENT, loanDate);
    expect(() => loan.returnBook(new Date('2023-12-31'))).toThrow(
      'Return date cannot be before loan date',
    );
  });

  it('should markAsOverdue and change status', () => {
    const loan = Loan.createNew('1', 'book-id', 'user-id', UserType.STUDENT, loanDate);
    loan.markAsOverdue();
    expect(loan.getStatus()).toBe(LoanStatus.OVERDUE);
  });

  it('should throw error if markAsOverdue called on returned loan', () => {
    const loan = Loan.createNew('1', 'book-id', 'user-id', UserType.STUDENT, loanDate);
    loan.returnBook(new Date('2024-01-10'));
    expect(() => loan.markAsOverdue()).toThrow('Cannot mark returned loan as overdue');
  });

  it('should calculateFine correctly for active overdue loan', () => {
    const loan = Loan.createNew('1', 'book-id', 'user-id', UserType.STUDENT, loanDate);
    const currentDate = new Date('2024-01-20');
    expect(loan.calculateFine(currentDate)).toBe(7.5);
  });

  it('getDaysUntilDue should return correct days remaining', () => {
    const loan = Loan.createNew('1', 'book-id', 'user-id', UserType.STUDENT, loanDate);
    const checkDate = new Date('2024-01-10');
    expect(loan.getDaysUntilDue(checkDate)).toBe(5);
  });

  it('getDaysUntilDue should return 0 if loan is returned', () => {
    const loan = Loan.createNew('1', 'book-id', 'user-id', UserType.STUDENT, loanDate);
    loan.returnBook(new Date('2024-01-10'));
    expect(loan.getDaysUntilDue(new Date('2024-01-12'))).toBe(0);
  });
});
