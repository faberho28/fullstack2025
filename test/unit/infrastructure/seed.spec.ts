import { DataSource, Repository } from 'typeorm';
import { BookEntity } from '../../../src/infrastructure/database/entities/BookEntity';
import { UserEntity } from '../../../src/infrastructure/database/entities/UserEntity';
import * as seedModule from '../../../src/infrastructure/database/seed';

jest.mock('typeorm', () => {
  const original = jest.requireActual('typeorm');
  return {
    ...original,
    DataSource: jest.fn().mockImplementation(() => ({
      initialize: jest.fn(),
      destroy: jest.fn(),
      getRepository: jest.fn(),
    })),
  };
});

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid'),
}));

describe('Seed script', () => {
  let mockDataSource: any;
  let mockBookRepo: any;
  let mockUserRepo: any;

  beforeEach(() => {
    mockBookRepo = { save: jest.fn() };
    mockUserRepo = { save: jest.fn() };

    mockDataSource = new (DataSource as jest.Mock)();
    mockDataSource.getRepository.mockImplementation((entity: any) => {
      if (entity === BookEntity) return mockBookRepo;
      if (entity === UserEntity) return mockUserRepo;
    });
  });

  it('should seed books and users and destroy the datasource', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await seedModule.seed();

    expect(mockDataSource.initialize).toHaveBeenCalled();
    expect(mockBookRepo.save).toHaveBeenCalledWith([
      expect.objectContaining({ isbn: '978-0-13-468599-1' }),
      expect.objectContaining({ isbn: '978-0-201-63361-0' }),
      expect.objectContaining({ isbn: '978-0-13-235088-4' }),
    ]);
    expect(mockUserRepo.save).toHaveBeenCalledWith([
      expect.objectContaining({ email: 'john.student@example.com' }),
      expect.objectContaining({ email: 'jane.teacher@example.com' }),
      expect.objectContaining({ email: 'admin@example.com' }),
    ]);
    expect(mockDataSource.destroy).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('✅ Database seeded successfully!');
    expect(consoleLogSpy).toHaveBeenCalledWith('Created 3 books and 3 users');

    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should log error if seed fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockDataSource.initialize.mockRejectedValueOnce(new Error('Init failed'));

    await expect(seedModule.seed()).rejects.toThrow('Init failed');

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error seeding database:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});
