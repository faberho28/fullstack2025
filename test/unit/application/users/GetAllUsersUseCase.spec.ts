import { GetAllUsersUseCase } from '../../../../src/application/use-cases/users/GetAllUsersUseCase';
import { User } from '../../../../src/domain/entities/User.entity';
import { UserType } from '../../../../src/domain/entities/UserType.enum';
import { IUserRepository } from '../../../../src/domain/interfaces/IUserRepository';
import { Email } from '../../../../src/domain/value-objects/Email.vo';

describe('GetAllUsersUseCase', () => {
  let getAllUsersUseCase: GetAllUsersUseCase;

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

    getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  });

  it('Should return all users when they exist', async () => {
    const users: User[] = [
      new User('user-1', 'John Doe', Email.create('john@example.com'), UserType.STUDENT),
      new User('user-2', 'Jane Doe', Email.create('jane@example.com'), UserType.STUDENT),
    ];

    userRepository.findAll.mockResolvedValue(users);

    const result = await getAllUsersUseCase.execute();

    expect(result).toEqual(users);
    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('Should return empty array if no users exist', async () => {
    userRepository.findAll.mockResolvedValue([]);

    const result = await getAllUsersUseCase.execute();

    expect(result).toEqual([]);
    expect(userRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('Should propagate unexpected repository errors', async () => {
    userRepository.findAll.mockRejectedValue(new Error('Database error'));

    await expect(getAllUsersUseCase.execute()).rejects.toThrow('Database error');
  });
});
