import { ConflictException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) { }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.usersRepository.findByEmail(createUserDto.email);
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        return this.usersRepository.create({
            ...createUserDto,
            password: hashedPassword,
        });
    }

    async findOne(id: string): Promise<User | null> {
        return this.usersRepository.findById(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findByEmail(email);
    }
}
