import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/User.entity';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { UserNotFoundException } from '../../../domain/exceptions/users/UserNotFoundException';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(_id: string): Promise<User> {
    const user = await this.userRepository.findById(_id);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
