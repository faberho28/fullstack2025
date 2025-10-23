import { Inject, Injectable } from '@nestjs/common';
import { Book } from '../../../domain/entities/Book.entity';
import { BookNotFoundException } from '../../../domain/exceptions/books/BookNotFoundException';
import { IBookRepository } from '../../../domain/interfaces/IBookRepository';

@Injectable()
export class GetAllBooksUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(): Promise<Book[]> {
    const books = await this.bookRepository.findAll();
    if (!books?.length) {
      throw new BookNotFoundException();
    }
    return books;
  }
}
