# THE STORY SHOOT

The Story Shoot adalah website booking studio photo dan photobooth yang dibuat untuk mempermudah proses reservasi studio secara online.

User dapat melihat studio, memilih jadwal yang tersedia, melakukan booking, upload bukti pembayaran, dan melihat riwayat booking melalui website.

---

# About Project

Project ini dibuat karena proses booking studio sebelumnya masih dilakukan secara manual melalui datang langsung.

Dengan adanya website ini, proses booking menjadi lebih mudah, cepat, dan praktis karena user dapat langsung melakukan reservasi secara online.

---

# Features

## User Features

- Register & Login
- Melihat studio photo
- Memilih tanggal dan jam booking
- Booking studio online
- Upload bukti pembayaran
- Melihat riwayat booking
- Detail booking
- Cancel booking

---

# Tech Stack

| Technology   | Description     |
| ------------ | --------------- |
| React + Vite | Frontend        |
| Express.js   | Backend         |
| MySQL        | Database        |
| Tailwind CSS | Styling         |
| JWT          | Authentication  |
| PM2          | Backend Process |
| Nginx        | Web Server      |
| VPS Ubuntu   | Hosting         |
| GitHub       | Version Control |

---

# Project Structure

```text
thestoryshoot/
├── frontend/
├── backend/
└── README.md
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/leostury/thestoryshoot.git
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Backend Setup

```bash
cd backend
npm install
npm start
```

---

# Deployment

Project ini berhasil dideploy menggunakan VPS Ubuntu dengan PM2 dan Nginx sehingga website dapat diakses secara online.

---

# VPS Deployment Process

## Clone Project di VPS

```bash
cd /var/www

git clone https://github.com/leostury/thestoryshoot.git
```

---

## Setup Backend

```bash
cd backend
npm install
```

Menjalankan backend menggunakan PM2:

```bash
pm2 start server.js --name backend
```

---

## Setup Frontend

```bash
cd ../frontend
npm install
npm run build
```

---

## Restart Nginx

```bash
sudo systemctl restart nginx
```

---

# Update Project di VPS

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

# Main Flow User

1. User membuka website
2. Login / Register
3. Memilih studio
4. Memilih tanggal dan jam booking
5. Melakukan booking
6. Upload pembayaran
7. Melihat riwayat booking

---

# Author

Nida Rahma Lestari
