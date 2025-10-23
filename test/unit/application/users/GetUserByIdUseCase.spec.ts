import { GetUserByIdUseCase } from '../../../../src/application/use-cases/users/GetUserByIdUseCase';
import { User } from '../../../../src/domain/entities/User.entity';
import { UserType } from '../../../../src/domain/entities/UserType.enum';
import { UserNotFoundException } from '../../../../src/domain/exceptions/users/UserNotFoundException';
import { IUserRepository } from '../../../../src/domain/interfaces/IUserRepository';
import { Email } from '../../../../src/domain/value-objects/Email.vo';

describe('GetUserByIdUseCase', () => {
  let getUserByIdUseCase: GetUserByIdUseCase;

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

    getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  });

  it('Should return a user when it exists', async () => {
    const userId = 'user-123';
    const user = new User(userId, 'John Doe', Email.create('john@example.com'), UserType.STUDENT);

    userRepository.findById.mockResolvedValue(user);

    const result = await getUserByIdUseCase.execute(userId);

    expect(result).toBe(user);
    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('Should throw UserNotFoundException if user does not exist', async () => {
    const userId = 'nonexistent-user';
    userRepository.findById.mockResolvedValue(null);

    await expect(getUserByIdUseCase.execute(userId)).rejects.toThrow(UserNotFoundException);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('Should propagate unexpected repository errors', async () => {
    const userId = 'user-123';
    userRepository.findById.mockRejectedValue(new Error('Database error'));

    await expect(getUserByIdUseCase.execute(userId)).rejects.toThrow('Database error');
  });
});
