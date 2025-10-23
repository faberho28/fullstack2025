export class LoanBorrowException extends Error {
  constructor(message?: string) {
    super(message || 'LoanBorrowException');
    this.name = 'LoanBorrowException';
  }
}
