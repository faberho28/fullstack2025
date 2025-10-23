import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../../application/dtos/CreateUserDto';
import { User } from '../../../domain/entities/User.entity';
import { v4 as uuidv4 } from 'uuid';
import { Email } from '../../../domain/value-objects/Email.vo';
import { UserExistException } from '../../../domain/exceptions/users/UserExistException';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(_user: CreateUserDto): Promise<User> {
    const currentUser = await this.userRepository.findByEmail(_user.email);
    if (currentUser) {
      throw new UserExistException();
    }
    const email = Email.create(_user.email);
    const user = new User(uuidv4(), _user.name, email, _user.type);
    const newUser = await this.userRepository.save(user);

    return newUser;
  }
}
