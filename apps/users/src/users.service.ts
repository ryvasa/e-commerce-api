import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import User from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
  ) {}
  async createUser(data: CreateUserDto) {
    // this.userRepository.create(data);
    // return this.userRepository.save(data);
    console.log(data);
  }
  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find({});
    this.client.emit('users_all', users);
    return users;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    await this.findOneById(id);
    await this.userRepository.update(id, data);
    return this.findOneById(id);
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.findOneById(id);
    return this.userRepository.remove(user);
  }
}
