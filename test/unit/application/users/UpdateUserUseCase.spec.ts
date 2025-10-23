import { UpdateUserDto } from '../../../../src/application/dtos/UpdateUserDto';
import { UpdateUserUseCase } from '../../../../src/application/use-cases/users/UpdateUserUseCase';
import { User } from '../../../../src/domain/entities/User.entity';
import { UserType } from '../../../../src/domain/entities/UserType.enum';
import { UserExistException } from '../../../../src/domain/exceptions/users/UserExistException';
import { UserNotFoundException } from '../../../../src/domain/exceptions/users/UserNotFoundException';
import { IUserRepository } from '../../../../src/domain/interfaces/IUserRepository';
import { Email } from '../../../../src/domain/value-objects/Email.vo';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;

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

    updateUserUseCase = new UpdateUserUseCase(userRepository);
  });

  it('Should update a user successfully', async () => {
    const userId = 'user-123';
    const currentUser = new User(
      userId,
      'John Doe',
      Email.create('john@example.com'),
      UserType.STUDENT,
    );
    const dto: UpdateUserDto = { name: 'John Updated', email: 'john@example.com' };

    userRepository.findById.mockResolvedValue(currentUser);
    userRepository.update.mockResolvedValue(currentUser.updateUser(dto));

    const result = await updateUserUseCase.execute(userId, dto);

    expect(result.name).toBe(dto.name);
    expect(result.email.getValue()).toBe(dto.email);

    expect(userRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: userId,
        name: dto.name,
        email: expect.any(Email),
      }),
    );

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('Should throw UserNotFoundException if user does not exist', async () => {
    const userId = 'nonexistent-user';
    const dto: UpdateUserDto = { name: 'John Updated' };

    userRepository.findById.mockResolvedValue(null);

    await expect(updateUserUseCase.execute(userId, dto)).rejects.toThrow(UserNotFoundException);
  });

  it('Should throw UserExistException if new email already exists', async () => {
    const userId = 'user-123';
    const currentUser = new User(
      userId,
      'John Doe',
      Email.create('john@example.com'),
      UserType.STUDENT,
    );
    const dto: UpdateUserDto = { email: 'existing@example.com' };
    const existingUser = new User(
      'user-456',
      'Jane',
      Email.create('existing@example.com'),
      UserType.TEACHER,
    );

    userRepository.findById.mockResolvedValue(currentUser);
    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(updateUserUseCase.execute(userId, dto)).rejects.toThrow(UserExistException);
  });

  it('Should propagate unexpected repository errors', async () => {
    const userId = 'user-123';
    const dto: UpdateUserDto = { name: 'John Updated' };

    userRepository.findById.mockRejectedValue(new Error('Database error'));

    await expect(updateUserUseCase.execute(userId, dto)).rejects.toThrow('Database error');
  });
});
