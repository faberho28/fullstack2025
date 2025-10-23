export class UserNotFoundException extends Error {
  constructor(message?: string) {
    super(message || `User is not found`);
    this.name = 'UserNotFoundException';
  }
}
