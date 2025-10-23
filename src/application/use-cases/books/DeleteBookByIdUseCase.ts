import { Inject, Injectable } from '@nestjs/common';
import { IBookRepository } from '../../../domain/interfaces/IBookRepository';

@Injectable()
export class DeleteBookByIdUseCase {
  constructor(
    @Inject('IBookRepository')
    private readonly bookRepository: IBookRepository,
  ) {}

  async execute(id: string): Promise<void> {
    await this.bookRepository.delete(id);
  }
}
