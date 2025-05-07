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
- `POST /assets` - Tạo tài sản mới
- `GET /assets` - Lấy danh sách tài sản
- `GET /assets/:id` - Lấy thông tin tài sản
- `PATCH /assets/:id` - Cập nhật tài sản
- `DELETE /assets/:id` - Xóa tài sản
- `GET /assets/profit-loss` - Xem báo cáo lãi/lỗ

#### Gold Price
- `GET /gold-price` - Lấy giá vàng hiện tại
- `GET /gold-price/history` - Lấy lịch sử giá vàng

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
