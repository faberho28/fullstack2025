import { Inject, Injectable } from '@nestjs/common';
import { BookNotFoundException } from '../../domain/exceptions/books/BookNotFoundException';
import { IBookRepository } from '../../domain/interfaces/IBookRepository';

export interface BookAvailability {
  bookId: string;
  title: string;
  availableCopies: number;
  totalCopies: number;
  isAvailable: boolean;
}

@Injectable()
export class CheckBookAvailabilityUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(_bookId: string): Promise<BookAvailability> {
    const book = await this.bookRepository.findById(_bookId);
    if (!book) {
      throw new BookNotFoundException();
    }
    return {
      bookId: book.id,
      title: book.title,
      availableCopies: book.getAvailableCopies(),
      totalCopies: book.totalCopies,
      isAvailable: book.hasAvailableCopies(),
    };
  }
}
