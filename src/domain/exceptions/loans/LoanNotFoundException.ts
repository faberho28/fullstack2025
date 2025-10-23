export class LoanNotFoundException extends Error {
  constructor(message?: string) {
    super(message || `Loan not found`);
    this.name = 'LoanNotFoundException';
  }
}
