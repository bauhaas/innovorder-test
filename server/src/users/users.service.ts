
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {CreateUserDto} from './dto/createUser.dto';
import {User} from './user.entity';
import {UpdateUserDto} from './dto/updateUser.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export default class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  getAllUsers() {
    console.log('test get all users');
    return this.usersRepository.find();
  }

  async getUserById(id: number) {
  const user = await this.usersRepository.findOne({where: {id:id}});
    if (user) {
      return user;
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async updateUser(id: number, user: UpdateUserDto) {
    await this.usersRepository.update(id, user);
    const updatedUser = await this.usersRepository.findOne({where: {id:id}});
    if (updatedUser) {
      return updatedUser
    }
    throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  }

  async createUser(user: CreateUserDto) {
    const newUser = await this.usersRepository.create(user);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async deleteUser(id: number) {
    const deleteResponse = await this.usersRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}