import { Inject, Injectable } from '@nestjs/common';
import { Book } from '../../../domain/entities/Book.entity';
import { IBookRepository } from '../../../domain/interfaces/IBookRepository';
import { BookNotFoundException } from '../../../domain/exceptions/books/BookNotFoundException';

@Injectable()
export class FindBookByISBNUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(isbn: string): Promise<Book> {
    const book = await this.bookRepository.findByISBN(isbn);
    if (!book) {
      throw new BookNotFoundException();
    }
    return book;
  }
}
