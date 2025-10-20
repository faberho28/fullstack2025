import { Injectable } from '@nestjs/common';
import { IBookRepository } from '../../domain/interfaces/IBookRepository';
import { Book } from '../../domain/entities/Book.entity';

@Injectable()
export class BookRepository implements IBookRepository {
  async findById(_id: string): Promise<Book | null> {
    throw new Error('BookRepository.findById not implemented');
  }

  async findByISBN(_isbn: string): Promise<Book | null> {
    throw new Error('BookRepository.findByISBN not implemented');
  }

  async save(_book: Book): Promise<Book> {
    throw new Error('BookRepository.save not implemented');
  }

  async update(_book: Book): Promise<Book> {
    throw new Error('BookRepository.update not implemented');
  }

  async findAll(): Promise<Book[]> {
    throw new Error('BookRepository.findAll not implemented');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('BookRepository.delete not implemented');
  }
}
