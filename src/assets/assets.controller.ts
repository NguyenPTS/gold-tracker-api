import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { SellAssetDto } from './dto/sell-asset.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { 
  ApiTags, 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam,
  getSchemaPath 
} from '@nestjs/swagger';
import { Asset } from './entities/asset.entity';

@ApiTags('assets')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Tạo tài sản mới', 
    description: 'Tạo một tài sản vàng mới trong danh mục của người dùng hiện tại' 
  })
  @ApiBody({ 
    type: CreateAssetDto,
    description: 'Thông tin tài sản cần tạo',
    examples: {
      example1: {
        summary: 'Vàng SJC 1 lượng',
        value: {
          type: 'SJC',
          amount: 1.0,
          buyPrice: 5000000,
          note: 'Mua vàng đầu tư dài hạn'
        }
      },
      example2: {
        summary: 'Vàng DOJI 0.5 lượng',
        value: {
          type: 'DOJI',
          amount: 0.5,
          buyPrice: 2450000
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Tạo tài sản thành công',
    type: Asset
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  create(@Body() createAssetDto: CreateAssetDto, @Req() req) {
    return this.assetsService.create(createAssetDto, req.user);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Lấy danh sách tài sản', 
    description: 'Lấy danh sách tất cả tài sản của người dùng đã đăng nhập' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Danh sách tài sản',
    type: [Asset]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  findAll(@Req() req) {
    return this.assetsService.findAll(req.user);
  }

  @Get('profit-loss')
  @ApiOperation({ 
    summary: 'Phân tích lãi/lỗ', 
    description: 'Lấy báo cáo phân tích lãi/lỗ cho toàn bộ danh mục đầu tư' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Báo cáo lãi/lỗ',
    schema: {
      properties: {
        totalInvestment: {
          type: 'number',
          description: 'Tổng số tiền đã đầu tư',
          example: 7450000
        },
        currentValue: {
          type: 'number',
          description: 'Giá trị hiện tại của danh mục',
          example: 8100000
        },
        realizedProfit: {
          type: 'number',
          description: 'Lợi nhuận đã thực hiện (từ các tài sản đã bán)',
          example: 150000
        },
        unrealizedProfit: {
          type: 'number',
          description: 'Lợi nhuận chưa thực hiện (từ các tài sản chưa bán)',
          example: 500000
        },
        totalProfit: {
          type: 'number',
          description: 'Tổng lợi nhuận',
          example: 650000
        },
        profitPercentage: {
          type: 'number',
          description: 'Phần trăm lợi nhuận',
          example: 8.72
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  getProfitLoss(@Req() req) {
    return this.assetsService.getProfitLoss(req.user);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Lấy thông tin tài sản', 
    description: 'Lấy thông tin chi tiết của một tài sản theo ID'
  })
  @ApiParam({ name: 'id', description: 'ID của tài sản' })
  @ApiResponse({ 
    status: 200, 
    description: 'Thông tin tài sản',
    type: Asset
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy tài sản'
  })
  findOne(@Param('id') id: string, @Req() req) {
    return this.assetsService.findOne(+id, req.user);
  }

  @Post(':id/sell')
  @ApiOperation({ 
    summary: 'Bán tài sản', 
    description: 'Cập nhật trạng thái tài sản sang đã bán, thêm giá bán và ngày bán (tự động)' 
  })
  @ApiParam({ name: 'id', description: 'ID của tài sản cần bán' })
  @ApiBody({ 
    type: SellAssetDto,
    description: 'Thông tin bán tài sản',
    examples: {
      example1: {
        summary: 'Bán với giá cao hơn',
        value: {
          sellPrice: 5500000
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Bán tài sản thành công',
    type: Asset
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dữ liệu không hợp lệ hoặc tài sản đã được bán'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy tài sản'
  })
  sell(@Param('id') id: string, @Body() sellAssetDto: SellAssetDto, @Req() req) {
    return this.assetsService.sell(+id, sellAssetDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Xóa tài sản', 
    description: 'Xóa một tài sản khỏi danh mục'
  })
  @ApiParam({ name: 'id', description: 'ID của tài sản cần xóa' })
  @ApiResponse({ 
    status: 200, 
    description: 'Xóa tài sản thành công'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Không có quyền truy cập'
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Không tìm thấy tài sản'
  })
  remove(@Param('id') id: string, @Req() req) {
    return this.assetsService.remove(+id, req.user);
  }
}
