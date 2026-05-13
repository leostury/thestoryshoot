# Deployment Documentation

Dokumentasi ini menjelaskan proses deployment project The Story Shoot mulai dari setup database, backend, frontend, hingga update project production di VPS.

---

# Deployment Overview

Project The Story Shoot menggunakan:

- MySQL untuk database
- Express.js untuk backend
- React + Vite untuk frontend
- PM2 untuk menjalankan backend
- Nginx sebagai web server
- VPS Ubuntu sebagai hosting server

---

# 1. Setup Database

## Install MySQL

```bash
sudo apt update
sudo apt install mysql-server -y
```

---

## Login MySQL

```bash
mysql -u root -p
```

---

## Create Database

```sql
CREATE DATABASE aplikasi_booking;
```

---

## Import Database

Upload file database ke VPS lalu import:

```bash
mysql -u root -p aplikasi_booking < aplikasi_booking.sql
```

---

# 2. Setup Backend

## Clone Repository

```bash
cd /var/www

git clone https://github.com/leostury/thestoryshoot.git
```

Masuk ke folder project:

```bash
cd thestoryshoot/backend
```

---

## Install Dependency Backend

```bash
npm install
```

---

## Setup Backend Environment

Membuat file `.env`

```env

PORT=3000

DB_HOST=76.13.23.200
DB_PORT=3306
DB_USER=nidarahma
DB_PASSWORD=soupkatak
DB_NAME=aplikasi_booking

ACCESS_TOKEN_SECRET=apa_saja_yang_penting_rahasia_123
JWT_SECRET=apa_saja_yang_penting_rahasia_123

CORS_ORIGINS=http://76.13.23.200

```

---

## Install PM2

```bash
npm install pm2 -g
```

---

## Run Backend

```bash
pm2 start index.mjs
```

---

## Cek Backend

```bash
pm2 status
```

---

# 3. Setup Frontend

Masuk ke folder frontend:

```bash
cd ../frontend
```

---

## Install Dependency Frontend

```bash
npm install
```

---

## Setup Frontend Environment

Membuat file `.env.production`

```env
VITE_API_URL=/api
VITE_BASE_URL=
```

---

## Build Frontend Production

```bash
npm run build
```

---

# 4. Setup Nginx

## Install Nginx

```bash
sudo apt install nginx -y
```

---

## Restart Nginx

```bash
sudo systemctl restart nginx
```

---

## Cek Status Nginx

```bash
sudo systemctl status nginx
```

---

# 5. Website Successfully Online

Setelah semua proses selesai:

- database berhasil dijalankan,
- backend berhasil online,
- frontend berhasil dibuild,
- dan website dapat diakses secara online.

---

# Update Project Production

Jika terdapat perubahan code terbaru dari GitHub.

---

## Masuk Folder Project

```bash
cd /var/www/thestoryshoot
```

---

## Pull Update dari GitHub

```bash
git pull origin book
```

---

## Restart Backend

```bash
cd backend

pm2 restart backend
```

---

## Build Frontend

```bash
cd ../frontend

npm run build
```

---

## Restart Nginx

```bash
sudo systemctl restart nginx
```

---

# Deployment Flow

```text
Database MySQL
      ↓
Backend Express.js
      ↓
Frontend React + Vite
      ↓
PM2 + Nginx
      ↓
Website Online
```

---

# Conclusion

Project The Story Shoot berhasil dideploy ke VPS Ubuntu menggunakan MySQL, PM2, dan Nginx sehingga website dapat berjalan secara online dan mempermudah proses booking studio photo.
