import { DeleteUserByIdUseCase } from '../../../../src/application/use-cases/users/DeleteUserByIdUseCase';
import { UserNotFoundException } from '../../../../src/domain/exceptions/users/UserNotFoundException';
import { IUserRepository } from '../../../../src/domain/interfaces/IUserRepository';

describe('DeleteUserByIdUseCase', () => {
  let deleteUserByIdUseCase: DeleteUserByIdUseCase;

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

    deleteUserByIdUseCase = new DeleteUserByIdUseCase(userRepository);
  });

  it('Should delete a user successfully', async () => {
    const userId = 'user-123';
    userRepository.delete.mockResolvedValue(undefined);

    await expect(deleteUserByIdUseCase.execute(userId)).resolves.not.toThrow();
    expect(userRepository.delete).toHaveBeenCalledWith(userId);
    expect(userRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('Should propagate UserNotFoundException if user does not exist', async () => {
    const userId = 'non-existent-user';
    userRepository.delete.mockRejectedValue(new UserNotFoundException());

    await expect(deleteUserByIdUseCase.execute(userId)).rejects.toThrow(UserNotFoundException);

    expect(userRepository.delete).toHaveBeenCalledWith(userId);
  });

  it('Should propagate unexpected repository errors', async () => {
    const userId = 'user-123';
    userRepository.delete.mockRejectedValue(new Error('Database error'));

    await expect(deleteUserByIdUseCase.execute(userId)).rejects.toThrow('Database error');
  });
});
