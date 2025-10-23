import { Email } from '../../../../src/domain/value-objects/Email.vo';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = Email.create('test@example.com');
    expect(email).toBeInstanceOf(Email);
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should convert email to lowercase', () => {
    const email = Email.create('TEST@Example.COM');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should throw an error for invalid email', () => {
    expect(() => Email.create('invalid-email')).toThrow('Invalid email format');
    expect(() => Email.create('invalid@')).toThrow('Invalid email format');
    expect(() => Email.create('invalid.com')).toThrow('Invalid email format');
  });

  it('should validate correct emails using isValid', () => {
    expect(Email.isValid('valid@example.com')).toBe(true);
    expect(Email.isValid('user.name+tag+sorting@example.com')).toBe(true);
  });

  it('should invalidate incorrect emails using isValid', () => {
    expect(Email.isValid('invalid-email')).toBe(false);
    expect(Email.isValid('invalid@')).toBe(false);
    expect(Email.isValid('invalid.com')).toBe(false);
  });

  it('should compare emails using equals', () => {
    const email1 = Email.create('test@example.com');
    const email2 = Email.create('TEST@example.com');
    const email3 = Email.create('other@example.com');

    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });

  it('should return email string via toString', () => {
    const email = Email.create('test@example.com');
    expect(email.toString()).toBe('test@example.com');
  });
});
