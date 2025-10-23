import { CreateUserDto } from '../../../../src/application/dtos/CreateUserDto';
import { CreateUserUseCase } from '../../../../src/application/use-cases/users/CreateUserUseCase';
import { User } from '../../../../src/domain/entities/User.entity';
import { UserType } from '../../../../src/domain/entities/UserType.enum';
import { UserExistException } from '../../../../src/domain/exceptions/users/UserExistException';
import { IUserRepository } from '../../../../src/domain/interfaces/IUserRepository';
import { Email } from '../../../../src/domain/value-objects/Email.vo';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;

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

    createUserUseCase = new CreateUserUseCase(userRepository);
  });

  it('Should create a new user successfully', async () => {
    const dto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      type: UserType.STUDENT,
    };

    userRepository.findByEmail.mockResolvedValue(null);

    const createdUser = new User('user-123', dto.name, Email.create(dto.email), dto.type);
    userRepository.save.mockResolvedValue(createdUser);

    const result = await createUserUseCase.execute(dto);

    expect(result).toBe(createdUser);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(userRepository.save).toHaveBeenCalledTimes(1);
  });

  it('Should throw UserExistException if email already exists', async () => {
    const dto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      type: UserType.STUDENT,
    };

    const existingUser = new User('user-123', dto.name, Email.create(dto.email), dto.type);
    userRepository.findByEmail.mockResolvedValue(existingUser);

    await expect(createUserUseCase.execute(dto)).rejects.toThrow(UserExistException);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(dto.email);
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('Should propagate unexpected repository errors', async () => {
    const dto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      type: UserType.STUDENT,
    };

    userRepository.findByEmail.mockRejectedValue(new Error('Database error'));

    await expect(createUserUseCase.execute(dto)).rejects.toThrow('Database error');
  });
});
