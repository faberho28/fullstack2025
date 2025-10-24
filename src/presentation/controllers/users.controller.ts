import {
  Controller,
  Get,
  HttpStatus,
  HttpException,
  Param,
  Post,
  HttpCode,
  Body,
  Put,
  Delete,
  Logger,
} from '@nestjs/common';
import { CreateUserUseCase } from '../../application/use-cases/users/CreateUserUseCase';
import { DeleteUserByIdUseCase } from '../../application/use-cases/users/DeleteUserByIdUseCase';
import { GetAllUsersUseCase } from '../../application/use-cases/users/GetAllUsersUseCase';
import { GetUserByEmailUseCase } from '../../application/use-cases/users/GetUserByEmailUseCase';
import { GetUserByIdUseCase } from '../../application/use-cases/users/GetUserByIdUseCase';
import { UpdateUserUseCase } from '../../application/use-cases/users/UpdateUserUseCase';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserNotFoundException } from '../../domain/exceptions/users/UserNotFoundException';
import { CreateUserDto } from '../../application/dtos/CreateUserDto';
import { UserExistException } from '../../domain/exceptions/users/UserExistException';
import { UpdateUserDto } from '../../application/dtos/UpdateUserDto';
import { User } from '../../domain/entities/User.entity';
import { ApiResponseType } from '../types/ApiResponse';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserByIdUseCase: DeleteUserByIdUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve all users registered in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Users have been found correctly',
        data: [
          {
            id: '13ae7ccc-3dbd-45d4-8ace-3a81d90f3c2c',
            name: 'John Doe',
            email: {
              value: 'john.student@example.com',
            },
            type: 'STUDENT',
          },
          {
            id: '61934fa3-605c-41c2-9f8d-dbd92b627c74',
            name: 'Jane Smith',
            email: {
              value: 'jane.teacher@example.com',
            },
            type: 'TEACHER',
          },
          {
            id: '282d1ffe-965f-4c32-9c8b-de1c91bfa699',
            name: 'Admin User',
            email: {
              value: 'admin@example.com',
            },
            type: 'ADMIN',
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An unexpected error occurred while finding the users',
        data: [],
      },
    },
  })
  async getAllUsers(): Promise<ApiResponseType<User[]>> {
    try {
      const response = await this.getAllUsersUseCase.execute();
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Users have been found correctly',
        data: response,
      };
    } catch (error) {
      this.logger.error(error);
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while finding the users',
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a single user by its unique identifier.',
  })
  @ApiParam({ name: 'id', description: 'Unique identifier of the user' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Users have been found correctly',
        data: {
          id: '13ae7ccc-3dbd-45d4-8ace-3a81d90f3c2c',
          name: 'John Doe',
          email: {
            value: 'john.student@example.com',
          },
          type: 'STUDENT',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: 'User is not found',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An unexpected error occurred while finding the user',
        data: {},
      },
    },
  })
  async getUserById(@Param('id') _userId: string): Promise<ApiResponseType<User>> {
    try {
      const response = await this.getUserByIdUseCase.execute(_userId);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been found correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while finding the user',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getByEmail/:email')
  @ApiOperation({
    summary: 'Get user by email',
    description: 'Retrieve a single user by its email.',
  })
  @ApiParam({ name: 'email', description: 'Email of the user' })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Users have been found correctly',
        data: {
          id: '13ae7ccc-3dbd-45d4-8ace-3a81d90f3c2c',
          name: 'John Doe',
          email: {
            value: 'john.student@example.com',
          },
          type: 'STUDENT',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: 'User is not found',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An unexpected error occurred while finding the user',
        data: {},
      },
    },
  })
  async getByEmail(@Param('email') _email: string): Promise<ApiResponseType<User>> {
    try {
      const response = await this.getUserByEmailUseCase.execute(_email);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been found correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while finding the user',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user',
  })
  @ApiBody({
    description: 'Create a new user',
    type: CreateUserDto,
    examples: {
      example: {
        value: {
          name: 'Sam Does',
          email: 'same.doe@example.com',
          type: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been created correctly',
        data: {
          id: '70803495-36d8-4bb7-87bd-d786c4d96a8a',
          name: 'Sam Does',
          email: {
            value: 'same.doe@example.com',
          },
          type: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User is already registered.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: 'User is already registered.',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An unexpected error occurred while creating the user',
        data: {},
      },
    },
  })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<ApiResponseType<User>> {
    try {
      const response = await this.createUserUseCase.execute(createUserDto);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been created correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof UserExistException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: {},
          },
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while creating the user',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update a user',
    description: 'Updates a user',
  })
  @ApiBody({
    description: 'Update a user',
    type: UpdateUserDto,
    examples: {
      example: {
        value: {
          name: 'Sam Does Second',
          email: 'same.doe@example.com',
          type: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been updated correctly',
        data: {
          id: '70803495-36d8-4bb7-87bd-d786c4d96a8a',
          name: 'Sam Does',
          email: {
            value: 'same.doe@example.com',
          },
          type: 'ADMIN',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User is already registered.',
    schema: {
      example: {
        success: false,
        responseCode: 1011,
        responseMessage: 'User is already registered.',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An unexpected error occurred while updating the user',
        data: {},
      },
    },
  })
  async updateUser(
    @Param('id') _id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseType<User>> {
    try {
      const response = await this.updateUserUseCase.execute(_id, updateUserDto);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been updated correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof UserExistException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: {},
          },
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while updating the user',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user by ID',
    description: 'Deletes a user from the system by its ID.',
  })
  @ApiParam({ name: 'id', description: 'Unique identifier of the user' })
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been deleted correctly',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'User not found.',
        data: {},
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Unexpected server error.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An error occurred while deleting the user',
        data: {},
      },
    },
  })
  async deleteUserById(@Param('id') _id: string): Promise<ApiResponseType<User | null>> {
    try {
      await this.deleteUserByIdUseCase.execute(_id);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'User has been deleted correctly',
        data: null,
      };
    } catch (error) {
      if (error instanceof UserNotFoundException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: {},
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An error occurred while deleting the user',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
