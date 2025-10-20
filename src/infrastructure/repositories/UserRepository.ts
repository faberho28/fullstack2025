import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { User } from '../../domain/entities/User.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  async findById(_id: string): Promise<User | null> {
    throw new Error('UserRepository.findById not implemented');
  }

  async findByEmail(_email: string): Promise<User | null> {
    throw new Error('UserRepository.findByEmail not implemented');
  }

  async save(_user: User): Promise<User> {
    throw new Error('UserRepository.save not implemented');
  }

  async update(_user: User): Promise<User> {
    throw new Error('UserRepository.update not implemented');
  }

  async findAll(): Promise<User[]> {
    throw new Error('UserRepository.findAll not implemented');
  }

  async delete(_id: string): Promise<void> {
    throw new Error('UserRepository.delete not implemented');
  }
}
