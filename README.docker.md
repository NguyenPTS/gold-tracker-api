# Hướng dẫn sử dụng Docker với Gold Tracker API

## Yêu cầu
- Docker
- Docker Compose

## Các bước triển khai

### 1. Chuẩn bị môi trường
Đảm bảo bạn đã có file `.env` hoặc `.env.docker` với các biến môi trường cần thiết:
```
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=gold_tracker
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3002/auth/google/callback
```

### 2. Build và chạy container
```bash
# Build và chạy container
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng container
docker-compose down
```

### 3. Truy cập API
- API: http://localhost:3002
- Swagger: http://localhost:3002/api

## Lưu ý quan trọng
- Khi triển khai lên môi trường production, hãy thay đổi các thông tin nhạy cảm trong file `.env.docker`
- Đảm bảo GOOGLE_CALLBACK_URL đã được cấu hình đúng trong Google Cloud Console
- Nếu cần thay đổi cổng, hãy cập nhật trong file `docker-compose.yml` 