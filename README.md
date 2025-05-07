# Gold Tracker API

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Mô tả

Gold Tracker là một ứng dụng theo dõi và quản lý tài sản vàng, được xây dựng bằng NestJS. Ứng dụng cho phép người dùng:

- Đăng nhập/đăng ký tài khoản (bao gồm cả đăng nhập bằng Google)
- Theo dõi giá vàng theo thời gian thực
- Quản lý danh mục tài sản vàng
- Tính toán lãi/lỗ cho các khoản đầu tư
- Xem biểu đồ phân tích xu hướng

## Cài đặt

```bash
# Cài đặt dependencies
$ npm install

# Tạo file .env từ mẫu
$ cp .env.example .env

# Cập nhật các biến môi trường trong file .env
```

## Cấu hình môi trường

Tạo file `.env` với các biến sau:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=gold_tracker

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=1d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3002/auth/google/callback

# Server
PORT=3002
```

## Chạy ứng dụng

```bash
# Chế độ development
$ npm run start

# Chế độ watch
$ npm run start:dev

# Chế độ production
$ npm run start:prod
```

## API Documentation

Sau khi chạy ứng dụng, bạn có thể truy cập Swagger UI tại:
```
http://localhost:3002/api
```

### Các API chính

#### Authentication
- `POST /auth/login` - Đăng nhập bằng email/password
- `GET /auth/google` - Đăng nhập bằng Google
- `GET /auth/google/callback` - Callback URL cho Google OAuth

#### Users
- `POST /users/sample-data` - Tạo tài khoản mẫu
- `GET /users` - Lấy danh sách người dùng
- `GET /users/:id` - Lấy thông tin người dùng
- `PATCH /users/:id` - Cập nhật thông tin người dùng
- `DELETE /users/:id` - Xóa người dùng

#### Assets
- `POST /assets` - Tạo tài sản mới (vàng) với thông tin loại vàng, số lượng, giá mua và ghi chú
- `GET /assets` - Lấy danh sách tất cả tài sản của người dùng hiện tại
- `GET /assets/:id` - Lấy thông tin chi tiết của một tài sản theo ID
- `POST /assets/:id/sell` - Bán một tài sản vàng với giá bán được chỉ định
- `DELETE /assets/:id` - Xóa một tài sản khỏi danh mục
- `GET /assets/profit-loss` - Xem báo cáo phân tích lãi/lỗ cho toàn bộ danh mục đầu tư

#### Gold Price
- `GET /gold/prices/latest` - Lấy giá vàng hiện tại
- `GET /gold/prices/history` - Lấy lịch sử giá vàng
- `GET /gold/prices/type/:type` - Lấy giá vàng theo loại (SJC, DOJI, v.v)

## Chi tiết API Assets

### 1. Tạo tài sản mới - POST /assets

**Mô tả:** Tạo một tài sản vàng mới trong danh mục của người dùng hiện tại

**Request Body:**
```json
{
  "type": "SJC",
  "amount": 1.0,
  "buyPrice": 5000000,
  "note": "Mua vàng đầu tư dài hạn"
}
```

**Response:**
```json
{
  "id": 1,
  "type": "SJC",
  "amount": 1.0,
  "buyPrice": 5000000,
  "note": "Mua vàng đầu tư dài hạn",
  "isSold": false,
  "buyDate": "2023-10-15T08:15:30.000Z",
  "sellPrice": null,
  "sellDate": null
}
```

### 2. Xem tất cả tài sản - GET /assets

**Mô tả:** Lấy danh sách tất cả tài sản của người dùng đã đăng nhập

**Response:**
```json
[
  {
    "id": 1,
    "type": "SJC",
    "amount": 1.0,
    "buyPrice": 5000000,
    "note": "Mua vàng đầu tư dài hạn",
    "isSold": false,
    "buyDate": "2023-10-15T08:15:30.000Z",
    "sellPrice": null,
    "sellDate": null
  },
  {
    "id": 2,
    "type": "DOJI",
    "amount": 0.5,
    "buyPrice": 2450000,
    "note": "Quà tặng sinh nhật",
    "isSold": true,
    "buyDate": "2023-09-20T10:30:00.000Z",
    "sellPrice": 2600000,
    "sellDate": "2023-10-25T14:20:15.000Z"
  }
]
```

### 3. Bán tài sản - POST /assets/:id/sell

**Mô tả:** Cập nhật trạng thái tài sản sang đã bán, thêm giá bán và ngày bán (tự động)

**Request Body:**
```json
{
  "sellPrice": 5500000
}
```

**Response:**
```json
{
  "id": 1,
  "type": "SJC",
  "amount": 1.0,
  "buyPrice": 5000000,
  "note": "Mua vàng đầu tư dài hạn",
  "isSold": true,
  "buyDate": "2023-10-15T08:15:30.000Z",
  "sellPrice": 5500000,
  "sellDate": "2023-11-20T09:45:12.000Z"
}
```

### 4. Phân tích lãi/lỗ - GET /assets/profit-loss

**Mô tả:** Lấy báo cáo phân tích lãi/lỗ cho toàn bộ danh mục đầu tư

**Response:**
```json
{
  "totalInvestment": 7450000,
  "currentValue": 8100000,
  "realizedProfit": 150000,
  "unrealizedProfit": 500000,
  "totalProfit": 650000,
  "profitPercentage": 8.72
}
```

## Cấu trúc dự án

```
src/
├── assets/                 # Module quản lý tài sản
├── auth/                   # Module xác thực
├── gold-price/            # Module theo dõi giá vàng
├── users/                 # Module quản lý người dùng
├── app.module.ts          # Module gốc
└── main.ts               # File khởi động ứng dụng
```

## Công nghệ sử dụng

- [NestJS](https://nestjs.com/) - Framework Node.js
- [TypeORM](https://typeorm.io/) - ORM cho database
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Passport](https://www.passportjs.org/) - Authentication
- [JWT](https://jwt.io/) - JSON Web Token
- [Swagger](https://swagger.io/) - API Documentation

## Testing

```bash
# Unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# Test coverage
$ npm run test:cov
```

## License

[MIT licensed](LICENSE)
