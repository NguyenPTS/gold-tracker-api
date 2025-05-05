import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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

  async findAll() {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'firstName', 'lastName', 'picture'] // Không trả về password
    });
  }

  async findOne(id: number) {
    return this.userRepository.findOne({ 
      where: { id },
      select: ['id', 'username', 'email', 'firstName', 'lastName', 'picture']
    });
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
    // Nếu có password mới, hash nó
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (user) {
      await this.userRepository.delete(id);
      return user;
    }
    return null;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    console.log('Validating password for user:', { 
      id: user?.id,
      hasPassword: !!user?.password,
      providedPassword: !!password 
    });

    if (!user || !user.password || !password) {
      console.log('Missing user or password');
      return false;
    }

    try {
      console.log('Comparing passwords...');
      const isValid = await bcrypt.compare(password, user.password);
      console.log('Password comparison result:', isValid);
      return isValid;
    } catch (error) {
      console.error('Password validation error:', error);
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
}
