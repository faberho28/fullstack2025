import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/User.entity';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';

@Injectable()
export class GetAllUsersUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
