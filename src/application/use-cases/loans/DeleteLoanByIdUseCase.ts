import { Inject, Injectable } from '@nestjs/common';
import { ILoanRepository } from '../../../domain/interfaces/ILoanRepository';

@Injectable()
export class DeleteLoanByIdUseCase {
  constructor(
    @Inject('ILoanRepository')
    private readonly loanRepository: ILoanRepository,
  ) {}
  async execute(_id: string): Promise<void> {
    await this.loanRepository.delete(_id);
  }
}
