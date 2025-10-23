import { User } from '../../../../src/domain/entities/User.entity';
import { Email } from '../../../../src/domain/value-objects/Email.vo';
import { UserType } from '../../../../src/domain/entities/UserType.enum';

describe('User Entity', () => {
  const validEmail = Email.create('test@example.com');

  it('should create a valid user', () => {
    const user = new User('user-1', 'Alice', validEmail, UserType.STUDENT);
    expect(user).toBeDefined();
    expect(user.name).toBe('Alice');
    expect(user.email.getValue()).toBe('test@example.com');
    expect(user.type).toBe(UserType.STUDENT);
  });

  it('should throw error if name is empty', () => {
    expect(() => new User('user-1', '', validEmail, UserType.STUDENT)).toThrow(
      'User name cannot be empty',
    );
  });

  it('should throw error if user type is invalid', () => {
    expect(() => new User('user-1', 'Alice', validEmail, 'INVALID' as unknown as UserType)).toThrow(
      'Invalid user type',
    );
  });

  it('should return correct max active loans per type', () => {
    expect(new User('1', 'Alice', validEmail, UserType.STUDENT).getMaxActiveLoans()).toBe(3);
    expect(new User('2', 'Bob', validEmail, UserType.TEACHER).getMaxActiveLoans()).toBe(5);
    expect(new User('3', 'Admin', validEmail, UserType.ADMIN).getMaxActiveLoans()).toBe(10);
  });

  it('should identify user roles correctly', () => {
    const student = new User('1', 'Alice', validEmail, UserType.STUDENT);
    const teacher = new User('2', 'Bob', validEmail, UserType.TEACHER);
    const admin = new User('3', 'Admin', validEmail, UserType.ADMIN);

    expect(student.isStudent()).toBe(true);
    expect(student.isTeacher()).toBe(false);
    expect(student.isAdmin()).toBe(false);

    expect(teacher.isStudent()).toBe(false);
    expect(teacher.isTeacher()).toBe(true);
    expect(teacher.isAdmin()).toBe(false);

    expect(admin.isStudent()).toBe(false);
    expect(admin.isTeacher()).toBe(false);
    expect(admin.isAdmin()).toBe(true);
  });

  it('should update user name', () => {
    const user = new User('user-1', 'Alice', validEmail, UserType.STUDENT);
    const updated = user.updateUser({ name: 'Alice Updated' });

    expect(updated.name).toBe('Alice Updated');
    expect(updated.email).toBe(user.email);
    expect(updated.type).toBe(user.type);
  });

  it('should update user email', () => {
    const user = new User('user-1', 'Alice', validEmail, UserType.STUDENT);
    const updated = user.updateUser({ email: 'new@example.com' });

    expect(updated.email.getValue()).toBe('new@example.com');
    expect(updated.name).toBe(user.name);
    expect(updated.type).toBe(user.type);
  });

  it('should update user type', () => {
    const user = new User('user-1', 'Alice', validEmail, UserType.STUDENT);
    const updated = user.updateUser({ type: UserType.TEACHER });

    expect(updated.type).toBe(UserType.TEACHER);
    expect(updated.name).toBe(user.name);
    expect(updated.email).toBe(user.email);
  });

  it('should update multiple fields at once', () => {
    const user = new User('user-1', 'Alice', validEmail, UserType.STUDENT);
    const updated = user.updateUser({
      name: 'Bob',
      email: 'bob@example.com',
      type: UserType.ADMIN,
    });

    expect(updated.name).toBe('Bob');
    expect(updated.email.getValue()).toBe('bob@example.com');
    expect(updated.type).toBe(UserType.ADMIN);
  });

  it('should return a new instance when updated', () => {
    const user = new User('user-1', 'Alice', validEmail, UserType.STUDENT);
    const updated = user.updateUser({ name: 'Bob' });

    expect(updated).not.toBe(user);
  });
});
