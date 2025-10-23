import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../../../../src/presentation/controllers/users.controller';
import { CreateUserUseCase } from '../../../../src/application/use-cases/users/CreateUserUseCase';
import { DeleteUserByIdUseCase } from '../../../../src/application/use-cases/users/DeleteUserByIdUseCase';
import { GetAllUsersUseCase } from '../../../../src/application/use-cases/users/GetAllUsersUseCase';
import { GetUserByEmailUseCase } from '../../../../src/application/use-cases/users/GetUserByEmailUseCase';
import { GetUserByIdUseCase } from '../../../../src/application/use-cases/users/GetUserByIdUseCase';
import { UpdateUserUseCase } from '../../../../src/application/use-cases/users/UpdateUserUseCase';
import { UserNotFoundException } from '../../../../src/domain/exceptions/users/UserNotFoundException';
import { UserExistException } from '../../../../src/domain/exceptions/users/UserExistException';
import { HttpException } from '@nestjs/common';
import { CreateUserDto } from '../../../../src/application/dtos/CreateUserDto';
import { UpdateUserDto } from '../../../../src/application/dtos/UpdateUserDto';
import { UserType } from '../../../../src/domain/entities/UserType.enum';

describe('UsersController', () => {
  let controller: UsersController;
  let mockCreateUserUseCase: Partial<CreateUserUseCase>;
  let mockDeleteUserByIdUseCase: Partial<DeleteUserByIdUseCase>;
  let mockGetAllUsersUseCase: Partial<GetAllUsersUseCase>;
  let mockGetUserByEmailUseCase: Partial<GetUserByEmailUseCase>;
  let mockGetUserByIdUseCase: Partial<GetUserByIdUseCase>;
  let mockUpdateUserUseCase: Partial<UpdateUserUseCase>;

  const dummyUser = {
    id: 'user-id',
    name: 'John Doe',
    email: { value: 'john@example.com' },
    type: 'STUDENT',
  };

  beforeEach(async () => {
    mockCreateUserUseCase = { execute: jest.fn() };
    mockDeleteUserByIdUseCase = { execute: jest.fn() };
    mockGetAllUsersUseCase = { execute: jest.fn() };
    mockGetUserByEmailUseCase = { execute: jest.fn() };
    mockGetUserByIdUseCase = { execute: jest.fn() };
    mockUpdateUserUseCase = { execute: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: CreateUserUseCase, useValue: mockCreateUserUseCase },
        { provide: DeleteUserByIdUseCase, useValue: mockDeleteUserByIdUseCase },
        { provide: GetAllUsersUseCase, useValue: mockGetAllUsersUseCase },
        { provide: GetUserByEmailUseCase, useValue: mockGetUserByEmailUseCase },
        { provide: GetUserByIdUseCase, useValue: mockGetUserByIdUseCase },
        { provide: UpdateUserUseCase, useValue: mockUpdateUserUseCase },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      (mockGetAllUsersUseCase.execute as jest.Mock).mockResolvedValue([dummyUser]);

      const result = await controller.getAllUsers();
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'Users have been found correctly',
        data: [dummyUser],
      });
    });

    it('should throw HttpException on error', async () => {
      (mockGetAllUsersUseCase.execute as jest.Mock).mockRejectedValue(new Error());

      await expect(controller.getAllUsers()).rejects.toThrow(HttpException);
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      (mockGetUserByIdUseCase.execute as jest.Mock).mockResolvedValue(dummyUser);

      const result = await controller.getUserById('user-id');
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been found correctly',
        data: dummyUser,
      });
    });

    it('should throw HttpException with 404 if user not found', async () => {
      (mockGetUserByIdUseCase.execute as jest.Mock).mockRejectedValue(new UserNotFoundException());

      await expect(controller.getUserById('non-existent')).rejects.toThrow(HttpException);
      await expect(controller.getUserById('non-existent')).rejects.toMatchObject({
        response: { success: false, responseCode: 1011, data: {} },
      });
    });
  });

  describe('getByEmail', () => {
    it('should return user by email', async () => {
      (mockGetUserByEmailUseCase.execute as jest.Mock).mockResolvedValue(dummyUser);

      const result = await controller.getByEmail('john@example.com');
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been found correctly',
        data: dummyUser,
      });
    });

    it('should throw HttpException with 404 if user not found', async () => {
      (mockGetUserByEmailUseCase.execute as jest.Mock).mockRejectedValue(
        new UserNotFoundException(),
      );

      await expect(controller.getByEmail('missing@example.com')).rejects.toThrow(HttpException);
    });
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      type: UserType.STUDENT,
    };

    it('should create a new user', async () => {
      (mockCreateUserUseCase.execute as jest.Mock).mockResolvedValue(dummyUser);

      const result = await controller.createUser(createUserDto);
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been created correctly',
        data: dummyUser,
      });
    });

    it('should throw HttpException with 409 if user exists', async () => {
      (mockCreateUserUseCase.execute as jest.Mock).mockRejectedValue(new UserExistException());

      await expect(controller.createUser(createUserDto)).rejects.toThrow(HttpException);
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      type: UserType.TEACHER,
    };

    it('should update a user', async () => {
      (mockUpdateUserUseCase.execute as jest.Mock).mockResolvedValue(dummyUser);

      const result = await controller.updateUser('user-id', updateUserDto);
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been updated correctly',
        data: dummyUser,
      });
    });

    it('should throw HttpException with 409 if user exists', async () => {
      (mockUpdateUserUseCase.execute as jest.Mock).mockRejectedValue(new UserExistException());

      await expect(controller.updateUser('user-id', updateUserDto)).rejects.toThrow(HttpException);
    });
  });

  describe('deleteUserById', () => {
    it('should delete a user', async () => {
      (mockDeleteUserByIdUseCase.execute as jest.Mock).mockResolvedValue(undefined);

      const result = await controller.deleteUserById('user-id');
      expect(result).toEqual({
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been deleted correctly',
      });
    });

    it('should throw HttpException with 404 if user not found', async () => {
      (mockDeleteUserByIdUseCase.execute as jest.Mock).mockRejectedValue(
        new UserNotFoundException(),
      );

      await expect(controller.deleteUserById('non-existent')).rejects.toThrow(HttpException);
    });
  });
});
