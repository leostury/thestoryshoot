-- 1. INISIALISASI DATABASE
CREATE DATABASE IF NOT EXISTS aplikasi_booking;
USE aplikasi_booking;

-- 2. PEMBERSIHAN TABEL (URUTAN PENTING KARENA FOREIGN KEY)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS pembayaran;
DROP TABLE IF EXISTS booking;
DROP TABLE IF EXISTS studio;
DROP TABLE IF EXISTS kategori;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 3. PEMBUATAN TABEL
CREATE TABLE users (
                       id_user INT AUTO_INCREMENT PRIMARY KEY,
                       nama_lengkap VARCHAR(100) NOT NULL,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       nomor_hp VARCHAR(20),
                       password VARCHAR(255) NOT NULL,
                       status ENUM('active', 'pending', 'inactive') DEFAULT 'pending',
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE kategori (
                          id_kategori INT AUTO_INCREMENT PRIMARY KEY,
                          nama_kategori VARCHAR(50) NOT NULL,
                          kode_kategori VARCHAR(10) UNIQUE NOT NULL,
                          status ENUM('active', 'inactive') DEFAULT 'active'
);

CREATE TABLE studio (
                        id_studio INT AUTO_INCREMENT PRIMARY KEY,
                        kode_studio VARCHAR(20) UNIQUE NOT NULL,
                        nama_studio VARCHAR(100) NOT NULL,
                        deskripsi TEXT,
                        id_kategori INT NOT NULL,
                        harga INT NOT NULL,
                        status ENUM('available', 'maintenance', 'hidden') DEFAULT 'available',
                        FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori)
);

CREATE TABLE booking (
                         id_booking INT AUTO_INCREMENT PRIMARY KEY,
                         kode_booking VARCHAR(20) UNIQUE NOT NULL,
                         id_user INT,
                         id_studio INT,
                         tanggal DATE NOT NULL,
                         jam TIME NOT NULL,
                         total_harga INT NOT NULL,
                         status ENUM('pending', 'paid', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         FOREIGN KEY (id_user) REFERENCES users(id_user),
                         FOREIGN KEY (id_studio) REFERENCES studio(id_studio),
    -- Mencegah double booking di level database
                         UNIQUE KEY unique_jadwal (id_studio, tanggal, jam)
);

CREATE TABLE pembayaran (
                            id_pembayaran INT AUTO_INCREMENT PRIMARY KEY,
                            kode_booking VARCHAR(20) NOT NULL,
                            metode_pembayaran ENUM('transferbank', 'QRIS') NOT NULL,
                            jumlah INT NOT NULL,
                            bukti_transfer VARCHAR(255),
                            status_pembayaran ENUM('pending', 'success', 'failed') DEFAULT 'pending',
                            tanggal_bayar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (kode_booking) REFERENCES booking(kode_booking)
);

CREATE TABLE user_tokens (
                             id INT AUTO_INCREMENT PRIMARY KEY,
                             user_id INT,
                             token TEXT,
                             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. INSERT DATA MASTER (DUMMY)
INSERT INTO users (nama_lengkap, username, email, nomor_hp, password, status)
VALUES ('Nida Rahma', 'nidarahma', 'nida@email.com', '081234567890', 'password123', 'active'),
       ('Budi Santoso', 'budis', 'budi@email.com', '089988776655', 'password321', 'active');

INSERT INTO kategori (nama_kategori, kode_kategori)
VALUES ('Photobooth', 'PB'), ('Self Photo', 'SP'), ('Studio Pro', 'PS');

INSERT INTO studio (kode_studio, nama_studio, deskripsi, id_kategori, harga)
VALUES ('PB-01', 'Neon Booth Bandung', 'Konsep neon light kekinian', 1, 75000),
       ('SP-01', 'Retro Self Studio', 'Studio foto sendiri tanpa fotografer', 2, 150000),
       ('PS-01', 'Professional Portrait', 'Lighting lengkap & fotografer pro', 3, 350000);

-- 5. VIEW UNTUK LAPORAN (READ-ONLY)
CREATE OR REPLACE VIEW view_laporan_booking AS
SELECT
    b.kode_booking,
    u.nama_lengkap AS customer,
    s.nama_studio,
    b.tanggal,
    b.jam,
    b.total_harga,
    b.status AS status_booking
FROM booking b
         JOIN users u ON b.id_user = u.id_user
         JOIN studio s ON b.id_studio = s.id_studio;

-- 6. STORED PROCEDURE: BUAT BOOKING DENGAN VALIDASI
DELIMITER //
CREATE PROCEDURE buat_booking_v3(
    IN p_username VARCHAR(50),
    IN p_kode_studio VARCHAR(20),
    IN p_tanggal DATE,
    IN p_jam TIME
)
BEGIN
    DECLARE v_id_user INT;
    DECLARE v_id_studio INT;
    DECLARE v_harga INT;
    DECLARE v_is_booked INT;

SELECT id_user INTO v_id_user FROM users WHERE username = p_username AND status = 'active';
SELECT id_studio, harga INTO v_id_studio, v_harga FROM studio WHERE kode_studio = p_kode_studio;

IF v_id_user IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'User tidak ditemukan atau tidak aktif';
    ELSEIF v_id_studio IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Studio tidak ditemukan';
ELSE
        -- Cek ketersediaan
SELECT COUNT(*) INTO v_is_booked FROM booking
WHERE id_studio = v_id_studio AND tanggal = p_tanggal AND jam = p_jam AND status != 'cancelled';

IF v_is_booked > 0 THEN
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Jadwal studio sudah penuh!';
ELSE
            INSERT INTO booking (kode_booking, id_user, id_studio, tanggal, jam, total_harga)
            VALUES (CONCAT('BK-', DATE_FORMAT(p_tanggal, '%y%m%d'), '-', LPAD(FLOOR(RAND()*999), 3, '0')),
                    v_id_user, v_id_studio, p_tanggal, p_jam, v_harga);

SELECT 'Booking Berhasil!' AS Info;
END IF;
END IF;
END //
DELIMITER ;

-- 7. TRIGGER: AUTO UPDATE STATUS BOOKING SETELAH BAYAR
DELIMITER //
CREATE TRIGGER trg_pembayaran_after_update
    AFTER UPDATE ON pembayaran
    FOR EACH ROW
BEGIN
    IF NEW.status_pembayaran = 'success' THEN
    UPDATE booking SET status = 'confirmed' WHERE kode_booking = NEW.kode_booking;
END IF;
END //
DELIMITER ;


ALTER TABLE studio
    ADD COLUMN url_gambar VARCHAR(255) AFTER deskripsi;


CREATE TABLE studio_images (
                               id_image INT AUTO_INCREMENT PRIMARY KEY,
                               id_studio INT NOT NULL,
                               url_gambar VARCHAR(255) NOT NULL,
                               is_primary BOOLEAN DEFAULT FALSE, -- Foto utama untuk katalog
                               FOREIGN KEY (id_studio) REFERENCES studio(id_studio) ON DELETE CASCADE
);
SELECT * FROM users;

DELETE * FROM users;


SELECT id_user, nama_lengkap, username, email, status FROM users;

INSERT 

DELETE FROM studio;


