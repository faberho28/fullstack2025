import { DeleteResult, Repository } from 'typeorm';
import { BookEntity } from '../../../src/infrastructure/database/entities/BookEntity';
import { BookRepository } from '../../../src/infrastructure/repositories/BookRepository';
import { Book } from '../../../src/domain/entities/Book.entity';
import { BookNotFoundException } from '../../../src/domain/exceptions/books/BookNotFoundException';
import { ISBN } from '../../../src/domain/value-objects/ISBN.vo';

describe('BookRepository', () => {
  let repo: BookRepository;
  let typeOrmRepo: jest.Mocked<Repository<BookEntity>>;

  beforeEach(() => {
    typeOrmRepo = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<BookEntity>>;

    repo = new BookRepository(typeOrmRepo);
  });

  const createEntity = (): BookEntity => {
    const entity = new BookEntity();
    entity.id = 'book-1';
    entity.isbn = '978-0-13-468599-1';
    entity.title = 'Clean Code';
    entity.author = 'Robert C. Martin';
    entity.publicationYear = 2008;
    entity.category = 'Software';
    entity.availableCopies = 3;
    entity.totalCopies = 5;
    return entity;
  };

  const createDomain = (): Book => {
    return new Book(
      'book-1',
      ISBN.create('978-0-13-468599-1'),
      'Clean Code',
      'Robert C. Martin',
      2008,
      'Software',
      3,
      5,
    );
  };

  it('should return a book by ID', async () => {
    const entity = createEntity();
    typeOrmRepo.findOneBy.mockResolvedValue(entity);

    const result = await repo.findById('book-1');

    expect(result).toBeInstanceOf(Book);
    expect(result.id).toBe(entity.id);
    expect(typeOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 'book-1' });
  });

  it('should throw BookNotFoundException if findById fails', async () => {
    typeOrmRepo.findOneBy.mockResolvedValue(null);
    await expect(repo.findById('nonexistent')).rejects.toThrow(BookNotFoundException);
  });

  it('should return a book by ISBN', async () => {
    const entity = createEntity();
    typeOrmRepo.findOneBy.mockResolvedValue(entity);

    const result = await repo.findByISBN('978-0-13-468599-1');

    expect(result).toBeInstanceOf(Book);
    expect(result.isbn.getValue()).toBe(entity.isbn);
  });

  it('should throw BookNotFoundException if findByISBN fails', async () => {
    typeOrmRepo.findOneBy.mockResolvedValue(null);
    await expect(repo.findByISBN('978-0-00-000000-0')).rejects.toThrow(BookNotFoundException);
  });

  it('should save a book', async () => {
    const book = createDomain();
    typeOrmRepo.save.mockResolvedValue({} as unknown as BookEntity);
    const result = await repo.save(book);

    expect(result).toBe(book);
    expect(typeOrmRepo.save).toHaveBeenCalled();
  });

  it('should update a book', async () => {
    const book = createDomain();
    typeOrmRepo.update.mockResolvedValue({} as unknown as any);

    const result = await repo.update(book);

    expect(result).toBe(book);
    expect(typeOrmRepo.update).toHaveBeenCalledWith({ id: book.id }, expect.any(BookEntity));
  });

  it('should return all books', async () => {
    const entities = [createEntity(), createEntity()];
    typeOrmRepo.find.mockResolvedValue(entities);

    const result = await repo.findAll();

    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Book);
  });

  it('should delete a book or throw if not found', async () => {
    typeOrmRepo.delete.mockResolvedValue({
      raw: [],
      affected: 1,
    } as DeleteResult);
    await expect(repo.delete('book-1')).resolves.not.toThrow();

    typeOrmRepo.delete.mockResolvedValue({
      raw: [],
      affected: 0,
    } as DeleteResult);
    await expect(repo.delete('book-2')).rejects.toThrow(BookNotFoundException);
  });
});
