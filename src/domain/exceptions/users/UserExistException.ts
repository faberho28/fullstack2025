export class UserExistException extends Error {
  constructor(message?: string) {
    super(message || `User is already registered.`);
    this.name = 'UserExistException';
  }
}
