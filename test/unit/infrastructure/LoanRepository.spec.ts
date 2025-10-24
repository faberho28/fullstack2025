import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { LoanEntity } from '../../../src/infrastructure/database/entities/LoanEntity';
import { LoanRepository } from '../../../src/infrastructure/repositories/LoanRepository';
import { LoanStatus } from '../../../src/domain/entities/LoanStatus.enum';
import { UserType } from '../../../src/domain/entities/UserType.enum';
import { Loan } from '../../../src/domain/entities/Loan.entity';
import { LoanNotFoundException } from '../../../src/domain/exceptions/loans/LoanNotFoundException';

describe('LoanRepository', () => {
  let repo: LoanRepository;
  let typeOrmRepo: jest.Mocked<Repository<LoanEntity>>;

  beforeEach(() => {
    typeOrmRepo = {
      findOneBy: jest.fn(),
      findBy: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      find: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<LoanEntity>>;

    repo = new LoanRepository(typeOrmRepo);
  });

  const createEntity = (): LoanEntity => {
    const entity = new LoanEntity();
    entity.id = 'loan-1';
    entity.bookId = 'book-1';
    entity.userId = 'user-1';
    entity.loanDate = new Date();
    entity.expectedReturnDate = new Date();
    entity.returnDate = null;
    entity.status = LoanStatus.ACTIVE;
    entity.userType = UserType.STUDENT;
    return entity;
  };

  const createDomain = (): Loan => {
    const entity = createEntity();
    return new Loan(
      entity.id,
      entity.bookId,
      entity.userId,
      entity.loanDate,
      entity.expectedReturnDate,
      entity.returnDate,
      entity.status as LoanStatus,
      entity.userType as UserType,
    );
  };

  it('should return a loan by ID', async () => {
    const entity = createEntity();
    typeOrmRepo.findOneBy.mockResolvedValue(entity);

    const result = await repo.findById('loan-1');

    expect(result).toBeInstanceOf(Loan);
    expect(result.id).toBe(entity.id);
    expect(typeOrmRepo.findOneBy).toHaveBeenCalledWith({ id: 'loan-1' });
  });

  it('should throw LoanNotFoundException if findById fails', async () => {
    typeOrmRepo.findOneBy.mockResolvedValue(null);
    await expect(repo.findById('nonexistent')).rejects.toThrow(LoanNotFoundException);
  });

  it('should find loans by userId', async () => {
    const entities = [createEntity()];
    typeOrmRepo.findBy.mockResolvedValue(entities);

    const result = await repo.findByUserId('user-1');
    expect(result).toHaveLength(1);
    expect(typeOrmRepo.findBy).toHaveBeenCalledWith({ userId: 'user-1' });
  });

  it('should find active loans by userId', async () => {
    const entities = [createEntity()];
    typeOrmRepo.findBy.mockResolvedValue(entities);

    const result = await repo.findActiveByUserId('user-1');
    expect(result).toHaveLength(1);
    expect(typeOrmRepo.findBy).toHaveBeenCalledWith({
      userId: 'user-1',
      status: LoanStatus.ACTIVE,
    });
  });

  it('should find overdue loans by userId', async () => {
    const entities = [createEntity()];
    typeOrmRepo.findBy.mockResolvedValue(entities);

    const result = await repo.findOverdueByUserId('user-1');
    expect(result).toHaveLength(1);
    expect(typeOrmRepo.findBy).toHaveBeenCalledWith({
      userId: 'user-1',
      status: LoanStatus.OVERDUE,
    });
  });

  it('should find loans by bookId', async () => {
    const entities = [createEntity()];
    typeOrmRepo.findBy.mockResolvedValue(entities);

    const result = await repo.findByBookId('book-1');
    expect(result).toHaveLength(1);
    expect(typeOrmRepo.findBy).toHaveBeenCalledWith({ bookId: 'book-1' });
  });

  it('should save a loan', async () => {
    const loan = createDomain();
    typeOrmRepo.save.mockResolvedValue(new LoanEntity());

    const result = await repo.save(loan);
    expect(result).toBe(loan);
    expect(typeOrmRepo.save).toHaveBeenCalled();
  });

  it('should update a loan', async () => {
    const loan = createDomain();
    typeOrmRepo.update.mockResolvedValue({} as UpdateResult);

    const result = await repo.update(loan);
    expect(result).toBe(loan);
    expect(typeOrmRepo.update).toHaveBeenCalledWith({ id: loan.id }, expect.any(LoanEntity));
  });

  it('should find all loans', async () => {
    const entities = [createEntity(), createEntity()];
    typeOrmRepo.find.mockResolvedValue(entities);

    const result = await repo.findAll();
    expect(result).toHaveLength(2);
    expect(result[0]).toBeInstanceOf(Loan);
  });

  it('should delete a loan or throw if not found', async () => {
    typeOrmRepo.delete.mockResolvedValue({ raw: [], affected: 1 } as DeleteResult);
    await expect(repo.delete('loan-1')).resolves.not.toThrow();

    typeOrmRepo.delete.mockResolvedValue({ raw: [], affected: 0 } as DeleteResult);
    await expect(repo.delete('loan-2')).rejects.toThrow(LoanNotFoundException);
  });
});
