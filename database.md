# Database Relationship

Database yang digunakan pada project The Story Shoot adalah MySQL dengan nama database:

```text
aplikasi_booking
```

Database ini digunakan untuk menyimpan data user, studio, booking, pembayaran, dan kategori studio.

---

# Main Tables

## 1. users

Tabel users digunakan untuk menyimpan data akun pengguna website.

| Field        | Type         |
| ------------ | ------------ |
| id_user      | INT          |
| nama_lengkap | VARCHAR(100) |
| username     | VARCHAR(50)  |
| email        | VARCHAR(100) |
| nomor_hp     | VARCHAR(20)  |
| password     | VARCHAR(255) |
| status       | ENUM         |
| created_at   | TIMESTAMP    |

---

## 2. kategori

Tabel kategori digunakan untuk menyimpan kategori studio photo.

| Field              | Type         |
| ------------------ | ------------ |
| id_kategori        | INT          |
| nama_kategori      | VARCHAR(50)  |
| deskripsi_kategori | TEXT         |
| kode_kategori      | VARCHAR(10)  |
| url_gambar         | VARCHAR(255) |
| status             | ENUM         |

---

## 3. studio

Tabel studio digunakan untuk menyimpan data studio photo yang tersedia pada website.

| Field       | Type         |
| ----------- | ------------ |
| id_studio   | INT          |
| kode_studio | VARCHAR(20)  |
| nama_studio | VARCHAR(100) |
| deskripsi   | TEXT         |
| url_gambar  | VARCHAR(255) |
| id_kategori | INT          |
| harga       | INT          |
| durasi      | INT          |
| status      | ENUM         |

---

## 4. booking

Tabel booking digunakan untuk menyimpan data pemesanan studio oleh user.

| Field            | Type         |
| ---------------- | ------------ |
| id_booking       | INT          |
| kode_booking     | VARCHAR(20)  |
| id_user          | INT          |
| id_studio        | INT          |
| tanggal          | DATE         |
| jam              | TIME         |
| total_harga      | INT          |
| bukti_pembayaran | VARCHAR(255) |
| status           | ENUM         |
| created_at       | TIMESTAMP    |

---

## 5. pembayaran

Tabel pembayaran digunakan untuk menyimpan data pembayaran booking.

| Field             | Type         |
| ----------------- | ------------ |
| id_pembayaran     | INT          |
| kode_booking      | VARCHAR(20)  |
| id_user           | INT          |
| metode_pembayaran | ENUM         |
| jumlah_bayar      | INT          |
| bukti_transfer    | VARCHAR(255) |
| status_pembayaran | ENUM         |
| catatan_admin     | TEXT         |
| tanggal_bayar     | TIMESTAMP    |
| kode_unik         | SMALLINT     |
| jumlah_tagihan    | INT          |
| expired_at        | DATETIME     |

---

# Database Relationships

## Relasi Users ke Booking

Satu user dapat memiliki banyak booking.

```text
users
   └── booking
```

Relasi:

```text
users.id_user → booking.id_user
```

---

## Relasi Kategori ke Studio

Satu kategori dapat memiliki banyak studio.

```text
kategori
   └── studio
```

Relasi:

```text
kategori.id_kategori → studio.id_kategori
```

---

## Relasi Studio ke Booking

Satu studio dapat memiliki banyak booking.

```text
studio
   └── booking
```

Relasi:

```text
studio.id_studio → booking.id_studio
```

---

## Relasi Booking ke Pembayaran

Satu booking memiliki satu data pembayaran.

```text
booking
   └── pembayaran
```

Relasi:

```text
booking.kode_booking → pembayaran.kode_booking
```

---

# Database Flow

```text
User
  ↓
Booking Studio
  ↓
Pilih Jadwal
  ↓
Upload Pembayaran
  ↓
Verifikasi Booking
```

---
