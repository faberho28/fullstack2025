import { Injectable } from '@nestjs/common';
import { IBookRepository } from '../../domain/interfaces/IBookRepository';
import { Book } from '../../domain/entities/Book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookEntity } from '../database/entities/BookEntity';
import { ISBN } from '../../domain/value-objects/ISBN.vo';
import { BookNotFoundException } from '../../domain/exceptions/books/BookNotFoundException';

@Injectable()
export class BookRepository implements IBookRepository {
  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) {}

  private toDomain = (entity: BookEntity): Book => {
    return new Book(
      entity.id,
      ISBN.create(entity.isbn),
      entity.title,
      entity.author,
      entity.publicationYear,
      entity.category,
      entity.availableCopies,
      entity.totalCopies,
    );
  };

  private toEntity = (domain: Book): BookEntity => {
    const entity = new BookEntity();
    entity.id = domain.id;
    entity.isbn = domain.isbn.getValue();
    entity.title = domain.title;
    entity.author = domain.author;
    entity.publicationYear = domain.publicationYear;
    entity.category = domain.category;
    entity.availableCopies = domain.getAvailableCopies();
    entity.totalCopies = domain.totalCopies;
    return entity;
  };

  async findById(_id: string): Promise<Book> {
    const bookEntity = await this.bookRepository.findOneBy({
      id: _id,
    });
    if (!bookEntity) {
      throw new BookNotFoundException();
    }
    return this.toDomain(bookEntity);
  }

  async findByISBN(_isbn: string): Promise<Book> {
    const bookEntity = await this.bookRepository.findOneBy({
      isbn: _isbn,
    });
    if (!bookEntity) {
      throw new BookNotFoundException();
    }
    return this.toDomain(bookEntity);
  }

  async save(_book: Book): Promise<Book> {
    const newBook = this.toEntity(_book);
    await this.bookRepository.save(newBook);
    return _book;
  }

  async update(_book: Book): Promise<Book> {
    const updatedBook = this.toEntity(_book);
    await this.bookRepository.update({ id: _book.id }, updatedBook);
    return _book;
  }

  async findAll(): Promise<Book[]> {
    const entities = await this.bookRepository.find();
    return entities.map(this.toDomain);
  }

  async delete(_id: string): Promise<void> {
    const result = await this.bookRepository.delete({ id: _id });
    if (result.affected === 0) {
      throw new BookNotFoundException();
    }
  }
}
