import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateSampleDataDto } from './dto/create-sample-data.dto';
import { RegisterDto } from '../auth/dto/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async createSampleData(createSampleDataDto: CreateSampleDataDto) {
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await this.userRepository.findOne({
      where: [
        { email: createSampleDataDto.email },
        { username: createSampleDataDto.username }
      ]
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Tạo user mới
    const hashedPassword = await bcrypt.hash(createSampleDataDto.password, 10);
    const user = this.userRepository.create({
      ...createSampleDataDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);
    console.log('Created sample user:', {
      id: savedUser.id,
      email: savedUser.email,
      username: savedUser.username
    });

    return savedUser;
  }

  async findAll() {
    return this.userRepository.find();
  }

  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string) {
    console.log('Finding user by email:', email);
    const user = await this.userRepository.findOne({ 
      where: { email },
      select: ['id', 'username', 'email', 'firstName', 'lastName', 'picture', 'password', 'isGoogleUser']
    });
    console.log('Found user:', { 
      hasUser: !!user, 
      hasPassword: !!(user && user.password),
      email: user?.email 
    });
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return this.userRepository.remove(user);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password) {
      console.log('User has no password');
      return false;
    }
    
    try {
      const isValid = await bcrypt.compare(password, user.password);
      console.log('Password validation result:', isValid);
      return isValid;
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  }

  // Tạo tài khoản test với password cố định
  async createTestAccount() {
    const testUser = {
      username: 'test' + Math.floor(Math.random() * 1000),
      email: `test${Math.floor(Math.random() * 1000)}@example.com`,
      password: 'Test@123',
      firstName: 'Test',
      lastName: 'User',
    };

    try {
      console.log('Creating test account with:', { 
        username: testUser.username, 
        email: testUser.email 
      });

      // Kiểm tra xem tài khoản đã tồn tại chưa
      const existingUser = await this.userRepository.findOne({
        where: [
          { email: testUser.email },
          { username: testUser.username }
        ],
        select: ['id', 'username', 'email', 'firstName', 'lastName', 'picture', 'password', 'isGoogleUser']
      });

      if (existingUser) {
        console.log('Found existing user:', { 
          id: existingUser.id, 
          email: existingUser.email,
          hasPassword: !!existingUser.password 
        });
        return existingUser;
      }

      // Tạo tài khoản mới
      const newUser = await this.create(testUser);
      console.log('Created new test account:', { 
        id: newUser.id, 
        email: newUser.email,
        hasPassword: !!newUser.password 
      });
      return newUser;
    } catch (error) {
      console.error('Error creating test account:', error);
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    const user = await this.create(registerDto);
    return user;
  }
}
