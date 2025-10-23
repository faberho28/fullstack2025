import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';

@Injectable()
export class DeleteUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(_id: string): Promise<void> {
    await this.userRepository.delete(_id);
  }
}
