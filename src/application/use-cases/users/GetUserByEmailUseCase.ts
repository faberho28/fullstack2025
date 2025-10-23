import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/User.entity';
import { UserNotFoundException } from '../../../domain/exceptions/users/UserNotFoundException';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(_email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(_email);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }
}
