import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User.entity';
import { UserEntity } from '../database/entities/UserEntity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from '../../domain/value-objects/Email.vo';
import { UserType } from '../../domain/entities/UserType.enum';
import { UserNotFoundException } from '../../domain/exceptions/users/UserNotFoundException';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private toDomain = (entity: UserEntity): User => {
    const email = Email.create(entity.email);
    return new User(entity.id, entity.name, email, entity.type as UserType);
  };

  private toEntity = (domain: User): UserEntity => {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.email = domain.email.getValue();
    entity.name = domain.name;
    entity.type = domain.type;
    return entity;
  };

  async findById(_id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: _id });
    if (!user) {
      throw new UserNotFoundException();
    }
    return this.toDomain(user);
  }

  async findByEmail(_email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email: _email });
    if (!user) return null;
    return this.toDomain(user);
  }

  async save(_user: User): Promise<User> {
    const newUser = this.toEntity(_user);
    await this.userRepository.save(newUser);
    return _user;
  }

  async update(_user: User): Promise<User> {
    const updatedUser = this.toEntity(_user);
    await this.userRepository.update({ id: _user.id }, updatedUser);
    return _user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (!users) {
      throw new UserNotFoundException('Users not found');
    }
    return users.map(this.toDomain);
  }

  async delete(_id: string): Promise<void> {
    const response = await this.userRepository.delete({ id: _id });
    if (response.affected === 0) {
      throw new UserNotFoundException();
    }
  }
}
