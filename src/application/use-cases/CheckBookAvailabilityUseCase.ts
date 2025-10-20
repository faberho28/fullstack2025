import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../infrastructure/repositories/BookRepository';

export interface BookAvailability {
  bookId: string;
  title: string;
  availableCopies: number;
  totalCopies: number;
  isAvailable: boolean;
}

@Injectable()
export class CheckBookAvailabilityUseCase {
  constructor(private readonly bookRepository: BookRepository) {}

  async execute(_bookId: string): Promise<BookAvailability> {
    throw new Error('CheckBookAvailabilityUseCase not implemented');
  }
}
