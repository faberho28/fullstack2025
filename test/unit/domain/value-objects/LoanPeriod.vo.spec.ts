import { LoanPeriod } from '../../../../src/domain/value-objects/LoanPeriod.vo';
import { UserType } from '../../../../src/domain/entities/UserType.enum';

describe('LoanPeriod Value Object', () => {
  it('should return correct days for STUDENT', () => {
    const period = LoanPeriod.forUserType(UserType.STUDENT);
    expect(period.getDays()).toBe(14);
  });

  it('should return correct days for TEACHER', () => {
    const period = LoanPeriod.forUserType(UserType.TEACHER);
    expect(period.getDays()).toBe(30);
  });

  it('should return correct days for ADMIN', () => {
    const period = LoanPeriod.forUserType(UserType.ADMIN);
    expect(period.getDays()).toBe(30);
  });

  it('should throw error for unknown user type', () => {
    expect(() => LoanPeriod.forUserType('UNKNOWN' as UserType)).toThrow(
      'Unknown user type: UNKNOWN',
    );
  });

  it('should calculate correct expiration date', () => {
    const startDate = new Date('2024-01-01');
    const studentPeriod = LoanPeriod.forUserType(UserType.STUDENT);
    const teacherPeriod = LoanPeriod.forUserType(UserType.TEACHER);

    const studentExpiration = studentPeriod.calculateExpirationDate(startDate);
    const teacherExpiration = teacherPeriod.calculateExpirationDate(startDate);

    expect(studentExpiration.toDateString()).toBe(new Date('2024-01-15').toDateString());
    expect(teacherExpiration.toDateString()).toBe(new Date('2024-01-31').toDateString());
  });

  it('should determine overdue correctly', () => {
    const loanDate = new Date('2024-01-01');
    const period = LoanPeriod.forUserType(UserType.STUDENT);

    const notOverdueDate = new Date('2024-01-10');
    const overdueDate = new Date('2024-01-20');

    expect(period.isOverdue(loanDate, notOverdueDate)).toBe(false);
    expect(period.isOverdue(loanDate, overdueDate)).toBe(true);
  });

  it('should calculate overdue days correctly', () => {
    const loanDate = new Date('2024-01-01');
    const period = LoanPeriod.forUserType(UserType.STUDENT);

    const onTimeReturn = new Date('2024-01-14');
    const lateReturn = new Date('2024-01-20');

    expect(period.calculateOverdueDays(loanDate, onTimeReturn)).toBe(0);
    expect(period.calculateOverdueDays(loanDate, lateReturn)).toBe(5);
  });
});
