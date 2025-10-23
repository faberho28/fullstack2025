import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../../../src/infrastructure/database/entities/UserEntity';
import { UserRepository } from '../../../src/infrastructure/repositories/UserRepository';
import { UserType } from '../../../src/domain/entities/UserType.enum';
import { User } from '../../../src/domain/entities/User.entity';
import { Email } from '../../../src/domain/value-objects/Email.vo';
import { UserNotFoundException } from '../../../src/domain/exceptions/users/UserNotFoundException';

describe('UserRepository', () => {
  let repo: UserRepository;
  let typeOrmRepo: jest.Mocked<Repository<UserEntity>>;

  beforeEach(() => {
    typeOrmRepo = {
      findOneBy: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<UserEntity>>;

    repo = new UserRepository(typeOrmRepo);
  });

  it('should return a user by ID', async () => {
    const entity = new UserEntity();
    entity.id = 'user-1';
    entity.name = 'Alice';
    entity.email = 'alice@example.com';
    entity.type = UserType.STUDENT;

    typeOrmRepo.findOneBy.mockResolvedValue(entity);

    const result = await repo.findById('user-1');

    expect(result).toBeInstanceOf(User);
    expect(result.id).toBe(entity.id);
    expect(result.email.getValue()).toBe(entity.email);
    expect(typeOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 'user-1' });
  });

  it('should return null if findByEmail does not find a user', async () => {
    typeOrmRepo.findOneBy.mockResolvedValue(null);
    const result = await repo.findByEmail('unknown@example.com');
    expect(result).toBeNull();
  });

  it('should save a user', async () => {
    const user = new User('user-1', 'Alice', Email.create('alice@example.com'), UserType.STUDENT);

    typeOrmRepo.save.mockResolvedValue(new UserEntity());
    const result = await repo.save(user);

    expect(result).toBe(user);
    expect(typeOrmRepo.save).toHaveBeenCalled();
  });

  it('should update a user', async () => {
    const user = new User('user-1', 'Alice', Email.create('alice@example.com'), UserType.STUDENT);

    typeOrmRepo.update.mockResolvedValue({
      raw: [],
      affected: 1,
      generatedMaps: [],
    } as UpdateResult);
    const result = await repo.update(user);

    expect(result).toBe(user);
    expect(typeOrmRepo.update).toHaveBeenCalled();
  });

  it('should find all users', async () => {
    const entities = [
      { id: 'user-1', name: 'Alice', email: 'alice@example.com', type: UserType.STUDENT },
    ] as UserEntity[];

    typeOrmRepo.find.mockResolvedValue(entities);

    const result = await repo.findAll();
    expect(result).toHaveLength(1);
    expect(result[0]).toBeInstanceOf(User);
  });

  it('should delete a user or throw if not found', async () => {
    typeOrmRepo.delete.mockResolvedValue({ raw: [], affected: 1 } as DeleteResult);
    await expect(repo.delete('user-1')).resolves.not.toThrow();

    typeOrmRepo.delete.mockResolvedValue({ raw: [], affected: 0 } as DeleteResult);
    await expect(repo.delete('user-2')).rejects.toThrow(UserNotFoundException);
  });
});
