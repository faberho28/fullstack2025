export class BookNotFoundException extends Error {
  constructor(message?: string) {
    super(message || 'Book is not found');
    this.name = 'BookNotFoundException';
  }
}
