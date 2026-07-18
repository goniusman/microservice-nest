import { ConflictException, Injectable } from '@nestjs/common';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = this.userRepository.create({
        email: createUserDto.email,
        password: hashedPassword,
      });

      await this.userRepository.save(user);

      return {
        message: 'User registered successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    return await this.userRepository.findOneBy({ id: id });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.userRepository.delete(id);
  }

  // async getFreshProfile(userId: string): Promise<User> {
  //   // Bypasses the read replica pool entirely to avoid replication lag issues
  //   return await this.userRepository.manager.findOne(User, {
  //     where: { id: userId },
  //     replicationMode: 'master',
  //   });
  // }

  @RabbitRPC({
    exchange: 'bookverse_global_exchange',
    routingKey: 'user.validate',
    queue: 'user_rpc_queue',
  })
  async validateUser(data: { userId: string }) {
    console.log('[User Service] RPC validateUser:', data);

    const user = await this.userRepository.findOneBy({ id: data?.userId });

    if (!user) {
      return { valid: false };
    }

    return {
      valid: true,
      user,
    };
  }
}
