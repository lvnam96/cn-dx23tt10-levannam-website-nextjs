# Đền thờ Chủ tịch Hồ Chí Minh — Website quản lý di tích

Website quản lý di tích **Đền thờ Chủ tịch Hồ Chí Minh** (Long Đức, Trà Vinh).

**Stack:** Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · Prisma 6 · PostgreSQL · NextAuth.js v5 · Cloudinary

---

## Yêu cầu

- Node.js 24 (dùng `nvm use` để tự động chuyển phiên bản theo `.nvmrc`)
- npm
- Docker & Docker Compose (dùng cho cơ sở dữ liệu local)

---

## Biến môi trường

Sao chép file mẫu và điền đầy đủ các giá trị:

```bash
cp .env.example .env
```

| Biến | Mô tả |
|---|---|
| `DATABASE_URL` | Chuỗi kết nối Postgres có pooling (dùng cho truy vấn ứng dụng) |
| `DATABASE_URL_UNPOOLED` | Chuỗi kết nối Postgres trực tiếp (dùng cho migration) |
| `AUTH_SECRET` | Chuỗi bí mật ngẫu nhiên cho NextAuth — tạo bằng `npx auth secret` |
| `AUTH_URL` | URL đầy đủ của ứng dụng, ví dụ `http://localhost:3000` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Tên cloud trên Cloudinary |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Tên upload preset (unsigned) |
| `CLOUDINARY_API_KEY` | API key của Cloudinary |
| `CLOUDINARY_API_SECRET` | API secret của Cloudinary |

> **Lưu ý:** Prisma CLI (`prisma migrate`, `prisma db seed`) chỉ đọc file `.env` — không đọc `.env.local`. Luôn giữ URL cơ sở dữ liệu trong `.env`.

---

## Lựa chọn A — Phát triển local (Docker Postgres)

### 1. Khởi động cơ sở dữ liệu

```bash
docker compose up -d
```

Lệnh này khởi động PostgreSQL 16 trên `localhost:5432` với:
- User: `postgres` · Mật khẩu: `password` · Database: `den_tho_bac_dev`

### 2. Cấu hình URL cơ sở dữ liệu trong `.env`

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/den_tho_bac_dev
DATABASE_URL_UNPOOLED=postgresql://postgres:password@localhost:5432/den_tho_bac_dev
```

Với Postgres local không có connection pooler nên hai biến này trỏ đến cùng một URL.

### 3. Chạy migration và seed dữ liệu

```bash
npm run db:migrate
npm run db:seed
```

### 4. Khởi động máy chủ phát triển

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

---

## Lựa chọn B — Neon Serverless Postgres (triển khai / cloud)

### 1. Cài đặt Neon CLI

```bash
npm i -g neonctl
```

### 2. Đăng nhập

```bash
neonctl auth
```

Trình duyệt sẽ mở để xác thực qua OAuth. Chỉ cần thực hiện một lần — thông tin đăng nhập được lưu lại.

### 3. Tạo project

```bash
neonctl projects create --name den-tho-bac --region-id aws-ap-southeast-1 --set-context
```

`--set-context` đặt project này làm mặc định, giúp bỏ qua `--project-id` ở các lệnh tiếp theo.

### 4. Lấy chuỗi kết nối

```bash
# URL có pooling — dùng cho DATABASE_URL (truy vấn ứng dụng)
neonctl connection-string --pooled --prisma --output raw

# URL trực tiếp — dùng cho DATABASE_URL_UNPOOLED (migration)
neonctl connection-string --output raw
```

Điền vào `.env`:

```env
DATABASE_URL=<chuỗi có pooling>
DATABASE_URL_UNPOOLED=<chuỗi trực tiếp>
```

### 5. Chạy migration và seed dữ liệu

```bash
npm run db:migrate
npm run db:seed
```

### 6. Khởi động máy chủ phát triển

```bash
npm run dev
```

---

## Chuyển đổi giữa local và Neon

Next.js ưu tiên `.env.local` hơn `.env` khi chạy ứng dụng. Dùng điều này để trỏ ứng dụng sang database khác mà không cần sửa `.env` (vốn luôn được Prisma CLI đọc):

```bash
# .env.local — ghi đè DATABASE_URL chỉ cho ứng dụng đang chạy
DATABASE_URL=postgresql://postgres:password@localhost:5432/den_tho_bac_dev
DATABASE_URL_UNPOOLED=postgresql://postgres:password@localhost:5432/den_tho_bac_dev
```

| File | Được đọc bởi | Nội dung thường dùng |
|---|---|---|
| `.env` | Prisma CLI + Next.js (dự phòng) | URL Neon |
| `.env.local` | Chỉ ứng dụng Next.js (ghi đè `.env`) | URL Docker local |

Xóa hoặc để trống `.env.local` để ứng dụng dùng URL trong `.env` (Neon).

---

## Các lệnh thường dùng

```bash
npm run dev          # máy chủ dev trên :3000 (Turbopack)
npm run build        # build production
npm run lint         # ESLint

npm run db:migrate   # tạo và áp dụng Prisma migration
npm run db:seed      # seed dữ liệu mẫu
npm run db:studio    # mở Prisma Studio

docker compose up -d      # khởi động Postgres local
docker compose down -v    # dừng và xóa toàn bộ dữ liệu Postgres local
```

---

## Thông tin đăng nhập mặc định (sau khi seed)

| Trường | Giá trị |
|---|---|
| Email | `admin@den-tho-bac.local` |
| Mật khẩu | `admin123` |
| Trang quản trị | [http://localhost:3000/admin](http://localhost:3000/admin) |

---

## Dữ liệu seed

| Đối tượng | Số lượng |
|---|---|
| Phòng | 5 |
| Hiện vật | 12 (4 nổi bật) |
| Bài viết | 8 (tất cả đã xuất bản) |
| Triển lãm | 4 |
| Đoàn tham quan | 6 |
| Liên hệ | 5 |
