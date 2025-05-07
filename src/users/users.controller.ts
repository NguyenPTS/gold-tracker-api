import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateSampleDataDto } from './dto/create-sample-data.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('sample-data')
  @ApiOperation({ 
    summary: 'Tạo tài khoản mẫu',
    description: 'Tạo một tài khoản mẫu với dữ liệu đầy đủ để test hệ thống'
  })
  @ApiBody({
    type: CreateSampleDataDto,
    description: 'Thông tin tài khoản mẫu',
    examples: {
      example1: {
        summary: 'Tài khoản cơ bản',
        value: {
          email: 'test@example.com',
          password: 'Test@123',
          username: 'testuser',
          firstName: 'Test',
          lastName: 'User'
        }
      },
      example2: {
        summary: 'Tài khoản với email khác',
        value: {
          email: 'test2@example.com',
          password: 'Test@456',
          username: 'testuser2',
          firstName: 'Test2',
          lastName: 'User2'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo tài khoản thành công',
    type: User
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ hoặc tài khoản đã tồn tại'
  })
  async createSampleData(@Body() createSampleDataDto: CreateSampleDataDto) {
    return this.usersService.createSampleData(createSampleDataDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Tạo tài khoản mới',
    description: 'Tạo một tài khoản mới trong hệ thống (yêu cầu xác thực)'
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Thông tin tài khoản mới'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo tài khoản thành công',
    type: User
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ hoặc tài khoản đã tồn tại'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Lấy danh sách người dùng',
    description: 'Lấy danh sách tất cả người dùng trong hệ thống (yêu cầu xác thực)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách người dùng',
    type: [User]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Lấy thông tin người dùng',
    description: 'Lấy thông tin chi tiết của một người dùng theo ID (yêu cầu xác thực)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin người dùng',
    type: User
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng'
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Cập nhật thông tin người dùng',
    description: 'Cập nhật thông tin của một người dùng theo ID (yêu cầu xác thực)'
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Thông tin cần cập nhật'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Cập nhật thành công',
    type: User
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng'
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Xóa người dùng',
    description: 'Xóa một người dùng khỏi hệ thống theo ID (yêu cầu xác thực)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Xóa thành công'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy người dùng'
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
