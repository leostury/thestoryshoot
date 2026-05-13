# Presentation Notes

## Opening

Perkenalkan saya Nida Rahma Lestari.

Pada project ini saya membuat website booking studio photo dan photobooth bernama The Story Shoot.

Project ini dibuat untuk membantu proses reservasi studio secara online agar lebih mudah dan praktis dibandingkan sistem booking manual.

---

# Background

Sebelumnya proses booking masih dilakukan secara manual melalui datang langsung ke studio.

Hal tersebut sering menyebabkan:

- jadwal booking bentrok,
- sulit melihat slot yang tersedia,
- dan proses pembayaran menjadi kurang praktis.

Karena itu dibuat website booking studio untuk membantu proses reservasi menjadi lebih modern dan efisien.

---

# Tujuan Project

Tujuan project ini adalah:

- mempermudah proses booking studio,
- membantu user melihat jadwal yang tersedia,
- mempermudah upload pembayaran,
- dan mengurangi kesalahan jadwal booking.

---

# Fitur Utama

Fitur utama pada website:

- login & register,
- melihat studio,
- booking studio,
- memilih tanggal dan jam,
- upload bukti pembayaran,
- melihat riwayat booking,
- dan cancel booking.

---

# Teknologi Yang Digunakan

Project ini dibuat menggunakan:

- React + Vite untuk frontend,
- Express.js untuk backend,
- MySQL untuk database,
- dan VPS Ubuntu untuk deployment.

Backend dijalankan menggunakan PM2 dan frontend menggunakan Nginx.

---

# Database

Database menggunakan MySQL dengan beberapa tabel utama:

- users,
- studio,
- booking,
- pembayaran,
- dan kategori.

Database juga memiliki validasi agar jadwal studio tidak dapat dibooking di jam yang sama.

---

# Deployment

Website berhasil dideploy ke VPS Ubuntu sehingga project dapat diakses secara online.

Proses deployment menggunakan:

- GitHub,
- PM2,
- dan Nginx.

---

# Demo Flow

Alur penggunaan website:

1. User membuka website
2. Login / register
3. Memilih studio
4. Memilih tanggal dan jam
5. Melakukan booking
6. Upload pembayaran
7. Melihat riwayat booking

---

# Challenges

Beberapa kendala saat pengembangan project:

- deployment VPS,
- upload image,
- koneksi backend,
- build frontend,
- dan validasi database.

---

# Conclusion

The Story Shoot berhasil membantu proses booking studio photo menjadi lebih mudah, cepat, dan modern dibandingkan sistem manual sebelumnya.
