import { Inject, Injectable } from '@nestjs/common';
import { Book } from '../../../domain/entities/Book.entity';
import { UpdateBookDto } from '../../dtos/UpdateBookDto';
import { IBookRepository } from '../../../domain/interfaces/IBookRepository';
import { BookNotFoundException } from '../../../domain/exceptions/books/BookNotFoundException';

@Injectable()
export class UpdateBookByIdUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(id: string, _book: UpdateBookDto): Promise<Book> {
    const currentBook = await this.bookRepository.findById(id);

    if (!currentBook) {
      throw new BookNotFoundException();
    }

    const updateBook = currentBook.update(_book);

    await this.bookRepository.update(updateBook);

    return updateBook;
  }
}
