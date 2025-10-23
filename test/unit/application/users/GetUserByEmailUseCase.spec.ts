import { GetUserByEmailUseCase } from '../../../../src/application/use-cases/users/GetUserByEmailUseCase';
import { User } from '../../../../src/domain/entities/User.entity';
import { UserType } from '../../../../src/domain/entities/UserType.enum';
import { UserNotFoundException } from '../../../../src/domain/exceptions/users/UserNotFoundException';
import { IUserRepository } from '../../../../src/domain/interfaces/IUserRepository';
import { Email } from '../../../../src/domain/value-objects/Email.vo';

describe('GetUserByEmailUseCase', () => {
  let getUserByEmailUseCase: GetUserByEmailUseCase;

  let userRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
    };

    getUserByEmailUseCase = new GetUserByEmailUseCase(userRepository);
  });

  it('Should return a user when it exists', async () => {
    const email = 'john@example.com';
    const user = new User('user-123', 'John Doe', Email.create(email), UserType.STUDENT);

    userRepository.findByEmail.mockResolvedValue(user);

    const result = await getUserByEmailUseCase.execute(email);

    expect(result).toBe(user);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(userRepository.findByEmail).toHaveBeenCalledTimes(1);
  });

  it('Should throw UserNotFoundException if user does not exist', async () => {
    const email = 'nonexistent@example.com';
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(getUserByEmailUseCase.execute(email)).rejects.toThrow(UserNotFoundException);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
  });

  it('Should propagate unexpected repository errors', async () => {
    const email = 'john@example.com';
    userRepository.findByEmail.mockRejectedValue(new Error('Database error'));

    await expect(getUserByEmailUseCase.execute(email)).rejects.toThrow('Database error');
  });
});
