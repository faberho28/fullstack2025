import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/User.entity';
import { UpdateUserDto } from '../../../application/dtos/UpdateUserDto';
import { UserExistException } from '../../../domain/exceptions/users/UserExistException';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { UserNotFoundException } from '../../../domain/exceptions/users/UserNotFoundException';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(_id: string, _user: UpdateUserDto): Promise<User> {
    const currentUser = await this.userRepository.findById(_id);

    if (_user?.email && _user?.email !== currentUser?.email.getValue()) {
      const user = await this.userRepository.findByEmail(_user.email);
      if (user) {
        throw new UserExistException();
      }
    }

    if (!currentUser) {
      throw new UserNotFoundException();
    }

    const updatedUser = currentUser.updateUser(_user);

    await this.userRepository.update(updatedUser);

    return updatedUser;
  }
}
