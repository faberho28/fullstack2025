import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CheckBookAvailabilityUseCase } from '../../application/use-cases/CheckBookAvailabilityUseCase';
import { GetAllBooksUseCase } from '../../application/use-cases/books/GetAllBooksUseCase';
import { UpdateBookByIdUseCase } from '../../application/use-cases/books/UpdateBookByIdUseCase';
import { UpdateBookDto } from '../../application/dtos/UpdateBookDto';
import { CreateBookDto } from '../../application/dtos/CreateBookDto';
import { CreateBookUseCase } from '../../application/use-cases/books/CreateBookUseCase';
import { FindBookByIdUseCase } from '../../application/use-cases/books/FindBookByIdUseCase';
import { FindBookByISBNUseCase } from '../../application/use-cases/books/FindBookByISBNUseCase';
import { DeleteBookByIdUseCase } from '../../application/use-cases/books/DeleteBookByIdUseCase';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BookNotFoundException } from '../../domain/exceptions/books/BookNotFoundException';

@Controller('books')
export class BooksController {
  constructor(
    private readonly checkBookAvailabilityUseCase: CheckBookAvailabilityUseCase,
    private readonly getAllBooksUseCase: GetAllBooksUseCase,
    private readonly createBookUseCase: CreateBookUseCase,
    private readonly updateBookByIDUseCase: UpdateBookByIdUseCase,
    private readonly findBookByIdUseCase: FindBookByIdUseCase,
    private readonly findBookByIsbnUseCase: FindBookByISBNUseCase,
    private readonly deleteBookByIdUseCase: DeleteBookByIdUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Retrieve all books',
    description: 'Returns a list of all books currently registered in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'Books retrieved successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Books have been found correctly',
        data: [
          {
            id: 'a1b2c3d4',
            isbn: '978-3-16-148410-0',
            title: 'Clean Code',
            author: 'Robert C. Martin',
            publicationYear: 2008,
            category: 'Software Engineering',
            availableCopies: 5,
            totalCopies: 10,
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error while retrieving the books.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An error occurred while finding the books',
        data: [],
      },
    },
  })
  async getAllBooks() {
    try {
      const response = await this.getAllBooksUseCase.execute();
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Books have been found correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof BookNotFoundException) {
        throw new HttpException(
          {
            success: false,
            responseCode: 1011,
            responseMessage: error.message,
            data: [],
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          success: false,
          responseCode: 1010,
          responseMessage: 'An unexpected error occurred while finding the books',
          data: [],
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id/availability')
  @ApiOperation({
    summary: 'Check book availability',
    description: 'Checks whether a specific book (by ID) has available copies for borrowing.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the book',
    example: 'a1b2c3d4',
  })
  @ApiResponse({
    status: 200,
    description: 'Book availability found successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Availability book has been found correctly',
        data: {
          id: 'a1b2c3d4',
          title: 'Clean Code',
          availableCopies: 3,
          totalCopies: 10,
          isAvailable: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error while retrieving book availability.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An error occurred while finding the availability book',
        data: {},
      },
    },
  })
  async checkAvailability(@Param('id') id: string) {
    try {
      const response = await this.checkBookAvailabilityUseCase.execute(id);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Availability book has been found correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof BookNotFoundException) {
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
          responseMessage: 'An error occurred while finding the availability book',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get book by ID',
    description: 'Retrieves the details of a specific book by its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the book',
    example: 'a1b2c3d4',
  })
  @ApiResponse({
    status: 200,
    description: 'Book found successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Book by id has been found correctly',
        data: {
          id: 'a1b2c3d4',
          isbn: '978-3-16-148410-0',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          publicationYear: 2008,
          category: 'Software Engineering',
          availableCopies: 5,
          totalCopies: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error while retrieving the book by ID.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An error occurred while finding the book by id',
        data: {},
      },
    },
  })
  async getBookById(@Param('id') id: string) {
    try {
      const response = await this.findBookByIdUseCase.execute(id);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Book by id has been found correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof BookNotFoundException) {
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
          responseMessage: 'An error occurred while finding the book by id',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getBookByIsbn/:isbn')
  @ApiOperation({
    summary: 'Get book by ISBN',
    description: 'Retrieves detailed information about a specific book using its ISBN code.',
  })
  @ApiParam({
    name: 'isbn',
    description: 'ISBN code of the book',
    example: '978-3-16-148410-0',
  })
  @ApiResponse({
    status: 200,
    description: 'Book found successfully by ISBN.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Book by isbn has been found correctly',
        data: {
          id: 'a1b2c3d4',
          isbn: '978-3-16-148410-0',
          title: 'Clean Code',
          author: 'Robert C. Martin',
          publicationYear: 2008,
          category: 'Software Engineering',
          availableCopies: 5,
          totalCopies: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error while retrieving the book by ISBN.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An error occurred while finding the book by isbn',
        data: {},
      },
    },
  })
  async getBookByIsbn(@Param('isbn') isbn: string) {
    try {
      const response = await this.findBookByIsbnUseCase.execute(isbn);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Book by isbn has been found correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof BookNotFoundException) {
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
          responseMessage: 'An error occurred while finding the book by isbn',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new book',
    description: 'Registers a new book in the system using the provided book details.',
  })
  @ApiBody({
    description: 'Book data to be created',
    type: CreateBookDto,
    examples: {
      example1: {
        summary: 'Valid book creation request',
        value: {
          isbn: '978-3-16-148410-0',
          title: 'Clean Architecture',
          author: 'Robert C. Martin',
          publicationYear: 2017,
          category: 'Software Engineering',
          availableCopies: 10,
          totalCopies: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Book created successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Book has been created correctly',
        data: {
          id: 'a1b2c3d4',
          isbn: '978-3-16-148410-0',
          title: 'Clean Architecture',
          author: 'Robert C. Martin',
          publicationYear: 2017,
          category: 'Software Engineering',
          availableCopies: 10,
          totalCopies: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error while creating the book.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An error occurred while creating the book',
        data: {},
      },
    },
  })
  async createBook(@Body() book: CreateBookDto) {
    try {
      const response = await this.createBookUseCase.execute(book);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Book has been created correctly',
        data: response,
      };
    } catch (error) {
      const response = {
        success: false,
        responseCode: 1010,
        responseMessage: 'An error occurred while creating the book',
        data: {},
      };
      throw new HttpException(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update book by ID',
    description: 'Updates the details of an existing book using its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the book to update',
    example: 'a1b2c3d4',
  })
  @ApiBody({
    description: 'Book data to update',
    type: UpdateBookDto,
    examples: {
      example1: {
        summary: 'Valid update request',
        value: {
          title: 'Clean Code (Updated Edition)',
          author: 'Robert C. Martin',
          publicationYear: 2024,
          category: 'Software Engineering',
          availableCopies: 7,
          totalCopies: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Book updated successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Book has been updated correctly',
        data: {
          id: 'a1b2c3d4',
          isbn: '978-3-16-148410-0',
          title: 'Clean Code (Updated Edition)',
          author: 'Robert C. Martin',
          publicationYear: 2024,
          category: 'Software Engineering',
          availableCopies: 7,
          totalCopies: 10,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error while updating the book.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An error occurred while updating the book',
        data: {},
      },
    },
  })
  async updateBookById(@Param('id') id: string, @Body() book: UpdateBookDto) {
    try {
      const response = await this.updateBookByIDUseCase.execute(id, book);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Book has been updated correctly',
        data: response,
      };
    } catch (error) {
      if (error instanceof BookNotFoundException) {
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
          responseMessage: 'An error occurred while updating the book',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Delete book by ID',
    description: 'Deletes an existing book from the system using its unique identifier.',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique identifier of the book to delete',
    example: 'a1b2c3d4',
  })
  @ApiResponse({
    status: 200,
    description: 'Book deleted successfully.',
    schema: {
      example: {
        success: true,
        responseCode: 1001,
        responseMessage: 'Book has been deleted correctly',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Error while deleting the book.',
    schema: {
      example: {
        success: false,
        responseCode: 1010,
        responseMessage: 'An error occurred while deleting the book',
      },
    },
  })
  async deleteBookById(@Param('id') id: string) {
    try {
      await this.deleteBookByIdUseCase.execute(id);
      return {
        success: true,
        responseCode: 1001,
        responseMessage: 'Book has been deleted correctly',
      };
    } catch (error) {
      if (error instanceof BookNotFoundException) {
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
          responseMessage: 'An error occurred while deleting the book',
          data: {},
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
