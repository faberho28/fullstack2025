import { Inject, Injectable } from '@nestjs/common';
import { Book } from '../../../domain/entities/Book.entity';
import { CreateBookDto } from '../../dtos/CreateBookDto';
import { ISBN } from '../../../domain/value-objects/ISBN.vo';
import { IBookRepository } from '../../../domain/interfaces/IBookRepository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreateBookUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(_book: CreateBookDto): Promise<Book> {
    const isbn = ISBN.create(_book.isbn);
    const book = new Book(
      uuidv4(),
      isbn,
      _book.title,
      _book.author,
      _book.publicationYear,
      _book.category,
      _book.availableCopies,
      _book.totalCopies,
    );
    const newBook = await this.bookRepository.save(book);
    return newBook;
  }
}
