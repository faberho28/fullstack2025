import { Inject, Injectable } from '@nestjs/common';
import { Book } from '../../../domain/entities/Book.entity';
import { IBookRepository } from '../../../domain/interfaces/IBookRepository';
import { BookNotFoundException } from '../../../domain/exceptions/books/BookNotFoundException';

@Injectable()
export class FindBookByIdUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(id: string): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new BookNotFoundException();
    }
    return book;
  }
}
