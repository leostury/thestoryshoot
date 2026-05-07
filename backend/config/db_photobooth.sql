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

SELECT * FROM booking;

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




ALTER TABLE kategori
    ADD COLUMN url_gambar VARCHAR(255) AFTER kode_kategori;

ALTER TABLE kategori
    ADD COLUMN deskripsi_kategori TEXT AFTER nama_kategori;

SELECT id_user, nama_lengkap, username, email, status FROM users;


INSERT INTO studio (kode_studio, nama_studio, id_kategori, deskripsi, harga, url_gambar, status)
VALUES
    ('PB-01', 'Classic Photobooth', 1,
     'FITUR: Sesi mandiri tanpa fotografer.\nFASILITAS: Aksesoris lucu, lighting cerah, & background solid.\nDURASI: 10 Menit sesi foto (unlimited shots).\nHASIL: 2 Lembar cetakan strip & file digital via QR Code.',
     50000, '/images/classic-photobooth.jpeg', 'available');

-- Set foto utama untuk Classic Photobooth
INSERT INTO studio_images (id_studio, url_gambar, is_primary)
VALUES (4, '/images/photobooth-detail-1.jpg', TRUE);


-- 1. Matikan pengecekan foreign key
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Hapus tabelnya
DROP TABLE IF EXISTS studio;
DROP TABLE IF EXISTS kategori;

-- 3. Nyalakan kembali pengecekan
SET FOREIGN_KEY_CHECKS = 1;

-- 4. Buat ulang tabel kategori dengan struktur lengkap
CREATE TABLE kategori (
                          id_kategori INT AUTO_INCREMENT PRIMARY KEY,
                          nama_kategori VARCHAR(50) NOT NULL,
                          deskripsi_kategori TEXT,
                          kode_kategori VARCHAR(10) UNIQUE NOT NULL,
                          url_gambar VARCHAR(255),
                          status ENUM('active', 'inactive') DEFAULT 'active'
);

-- 5. Buat ulang tabel studio (karena tadi ikut dihapus supaya sinkron)
CREATE TABLE studio (
                        id_studio INT AUTO_INCREMENT PRIMARY KEY,
                        kode_studio VARCHAR(20) UNIQUE NOT NULL,
                        nama_studio VARCHAR(100) NOT NULL,
                        deskripsi TEXT,
                        url_gambar VARCHAR(255),
                        id_kategori INT NOT NULL,
                        harga INT NOT NULL,
                        status ENUM('available', 'maintenance', 'hidden') DEFAULT 'available',
                        FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori)
);

-- 6. Sekarang Insert datanya (Gak akan error duplicate lagi)
INSERT INTO kategori (nama_kategori, deskripsi_kategori, kode_kategori, url_gambar, status)
VALUES
    ('Photobooth', 'Abadikan momen seru instan dengan berbagai pilihan frame lucu.', 'PB', '/assets/photobooth.jpg', 'active'),
    ('Self Photo', 'Ekspresikan dirimu dengan bebas di studio privat tanpa fotografer.', 'SP', '/assets/selfphoto.jpg', 'active'),
    ('Studio Pro', 'Hasil foto kualitas tinggi dengan lighting profesional dan fotografer ahli.', 'PS', '/assets/photostudio.jpg', 'active');

INSERT INTO kategori (nama_kategori, deskripsi_kategori, kode_kategori, url_gambar, status)
VALUES
    (
        'Photobooth',
        'Abadikan momen seru instan dengan berbagai pilihan frame dan stiker lucu.',
        'PB',
        'frontend/src/assets/photobooth.jpeg',
        'active'
    ),
    (
        'Self Photo',
        'Ekspresikan dirimu dengan bebas di studio privat tanpa gangguan fotografer.',
        'SP',
        'frontend/src/assets/studio_photo.jpeg',
        'active'
    ),
    (
        'Studio Pro',
        'Hasil foto kualitas tinggi dengan dukungan lighting profesional dan fotografer ahli.',
        'PS',
        'frontend/src/assets/self_photo.jpeg',
        'active'
    );


UPDATE kategori SET url_gambar = '/images/photobooth.jpeg' WHERE id_kategori = 1;
UPDATE kategori SET url_gambar = '/images/self_photo.jpeg' WHERE id_kategori = 2;
UPDATE kategori SET url_gambar = '/images/studio_photo.jpeg' WHERE id_kategori = 3;





SELECT id_kategori, nama_kategori, url_gambar FROM kategori;


INSERT INTO studio (kode_studio, nama_studio, deskripsi, url_gambar, id_kategori, harga, status)
VALUES
-- ========================
-- PHOTOBOOTH (id_kategori = 1)
-- ========================
('PB-01', 'Neon Glow Booth',
 'FITUR: Lampu neon warna-warni otomatis & timer foto mandiri.\nFASILITAS: 10+ properti lucu, background neon, printer instan.\nDURASI: 15 menit sesi foto bebas.\nHASIL: 3 lembar cetak strip + file digital via QR Code.\nBENEFIT: Cocok untuk foto bareng hingga 4 orang, hasil cetak langsung di tempat.',
 '/images/neon-photobooth.jpeg', 1, 50000, 'available'),

('PB-02', 'Retro Vintage Booth',
 'FITUR: Filter kamera ala polaroid & film grain otomatis.\nFASILITAS: Properti vintage (kacamata, topi, bingkai), background jadul.\nDURASI: 15 menit sesi foto bebas.\nHASIL: 3 lembar cetak polaroid + file digital via QR Code.\nBENEFIT: Nuansa tahun 90an yang timeless, cocok untuk konten estetik.',
 '/images/vintage-photobooth.jpeg', 1, 50000, 'available'),

('PB-03', 'Pastel Dream Booth',
 'FITUR: Background pastel ganti otomatis 3 warna.\nFASILITAS: Properti bunga, balon, & boneka lucu.\nDURASI: 15 menit sesi foto bebas.\nHASIL: 3 lembar cetak strip + file digital via QR Code.\nBENEFIT: Warna lembut yang sempurna untuk konten Instagram & TikTok.',
 '/images/photobooth.jpeg', 1, 55000, 'available'),

('PB-04', 'Idol Booth',
 'FITUR: Konsep photo booth ala Photoism Korea dengan filter kamera HD otomatis & pencahayaan soft idol.
 FASILITAS: Properti K-Pop (lightstick, album, polaroid idol), background pastel & hologram, stiker & frame ala Photoism, printer instan.
 DURASI: 15 menit sesi foto bebas unlimited shots.
 HASIL: 2 lembar cetak strip dengan frame idol lucu + soft file digital via QR Code.
 BENEFIT: Rasakan sensasi foto ala bintang K-Pop, hasil cetak bisa langsung dijadikan koleksi seperti photocard idol asli!',
 '/images/idol-photobooth.jpeg', 1, 60000, 'available'),

('PB-05', 'Monochrome Booth',
 'FITUR: Kamera dengan filter hitam putih profesional.\nFASILITAS: Background marble putih & hitam, properti minimalis.\nDURASI: 15 menit sesi foto bebas.\nHASIL: 3 lembar cetak hitam putih + file digital via QR Code.\nBENEFIT: Hasil foto artistik dan elegan, cocok untuk foto profil formal.',
 '/images/monocrome-photobooth.jpeg', 1, 50000, 'available'),

('PB-06', 'Groceries Booth',
 'FITUR: Konsep foto aesthetic ala supermarket & grocery store dengan prop makanan lucu.
 FASILITAS: Properti grocery (keranjang belanja mini, sayur & buah artificial, paper bag lucu), background rak supermarket & warna-warni cerah, stiker & frame ala aesthetic grocery, printer instan.
 DURASI: 15 menit sesi foto bebas unlimited shots.
 HASIL: 2 lembar cetak strip dengan frame grocery lucu + soft file digital via QR Code.
 BENEFIT: Konsep unik & hits di media sosial, cocok untuk foto solo maupun bareng teman dengan vibes daily life yang aesthetic!',
 '/images/glosir-photobooth.jpeg', 1, 65000, 'available');


INSERT INTO studio (kode_studio, nama_studio, deskripsi, url_gambar, id_kategori, harga, status)
VALUES
('SP-01', 'Minimalist White Studio',
    'FITUR: Remote shutter & tripod profesional disediakan.\nFASILITAS: Background seamless putih, softbox lighting, cermin besar.\nDURASI: 60 menit sesi privat.\nHASIL: File digital resolusi tinggi dikirim via Google Drive.\nBENEFIT: Cocok untuk foto outfit, lookbook, & konten creator tanpa fotografer.',
    '/images/minimalist-self.jpeg', 2, 150000, 'available'),

('SP-02', 'Newspaper Studio',
 'FITUR: Remote shutter & ring light adjustable dengan nuansa editorial koran klasik.
 FASILITAS: Background dinding wallpaper koran vintage, properti koran & majalah lama, meja baca antik, kursi kayu klasik, & lampu meja retro.
 DURASI: 60 menit sesi privat.
 HASIL: File digital resolusi tinggi dikirim via Google Drive.
 BENEFIT: Nuansa vintage editorial yang unik & estetik, cocok untuk foto bertema journalist, retro aesthetic, & konten storytelling yang berkesan.',
 '/images/koran-self.jpeg', 2, 150000, 'available'),

('SP-03', 'Train Compartment Studio',
 'FITUR: Remote shutter & lighting warm tone ala pencahayaan gerbong kereta klasik.
 FASILITAS: Set kursi gerbong kereta vintage, jendela dengan pemandangan countryside, rak bagasi kayu, properti tiket & koper antik, & lampu gantung kereta retro.
 DURASI: 60 menit sesi privat.
 HASIL: File digital resolusi tinggi dikirim via Google Drive.
 BENEFIT: Nuansa perjalanan kereta yang romantis & sinematik, cocok untuk foto couple, solo traveling aesthetic, & konten bertema journey yang hits di media sosial.',
 '/images/train-self.jpeg', 2, 175000, 'available');


INSERT INTO studio (kode_studio, nama_studio, deskripsi, url_gambar, id_kategori, harga, status)
VALUES
    ('PS-01', 'Classic Portrait Studio',
     'FITUR: Fotografer profesional + 2 asisten lighting.\nFASILITAS: Strobo & softbox lengkap, background polos 5 warna, cermin full body.\nDURASI: 90 menit sesi foto terarah.\nHASIL: 10 foto terpilih edit profesional + file RAW via Google Drive.\nBENEFIT: Ideal untuk foto wisuda, foto profil LinkedIn, & keperluan formal.',
     '/images/minimalist-studio.jpeg', 3, 350000, 'available'),

    ('PS-02', 'Fashion Editorial Studio',
     'FITUR: Fotografer fashion berpengalaman + 1 asisten.\nFASILITAS: Lighting dramatis Rembrandt, background tekstur premium, & kipas angin.\nDURASI: 90 menit sesi foto terarah.\nHASIL: 10 foto terpilih edit profesional + file RAW via Google Drive.\nBENEFIT: Hasil foto sekelas majalah fashion, cocok untuk portofolio model & brand.',
     '/images/fashion-studio.jpeg', 3, 400000, 'available'),

    ('PS-03', 'Family Portrait Studio',
     'FITUR: Fotografer keluarga + asisten pose & properti.\nFASILITAS: Studio luas 6x8m, sofa & kursi keluarga, background warm tone.\nDURASI: 120 menit sesi foto santai.\nHASIL: 15 foto terpilih edit profesional + file RAW via Google Drive.\nBENEFIT: Momen keluarga terabadikan indah, cocok hingga 10 anggota keluarga.',
     '/images/family-studio.jpeg', 3, 450000, 'available'),

    ('PS-04', 'Wedding Pre-Wed Studio',
     'FITUR: Fotografer wedding profesional + dekorator.\nFASILITAS: Dekorasi bunga segar, backdrop mewah, & tata cahaya romantis.\nDURASI: 120 menit sesi foto romantis.\nHASIL: 20 foto terpilih edit profesional + file RAW via Google Drive.\nBENEFIT: Kenangan pre-wedding indoor yang memukau tanpa perlu keluar kota.',
     '/images/prewedding-studio.jpeg', 3, 500000, 'available'),

    ('PS-05', 'Product Photography',
     'FITUR: Fotografer produk + lighting macro spesialis.\nFASILITAS: Meja still life, backdrop kertas 10 warna, lensa macro, & diffuser.\nDURASI: 90 menit sesi foto produk.\nHASIL: 15 foto produk edit retouching + file RAW via Google Drive.\nBENEFIT: Foto produk berkualitas tinggi untuk marketplace, website, & iklan.',
     '/images/product-studio.jpeg', 3, 375000, 'available');


ALTER TABLE studio ADD COLUMN durasi INT NOT NULL DEFAULT 15 COMMENT 'dalam menit' AFTER harga;

-- Update durasi Studio Pro yang 90 menit
UPDATE studio SET durasi = 90 WHERE kode_studio = 'PS-01';
UPDATE studio SET durasi = 90 WHERE kode_studio = 'PS-02';
UPDATE studio SET durasi = 90 WHERE kode_studio = 'PS-05';

-- Update durasi Studio Pro yang 120 menit
UPDATE studio SET durasi = 120 WHERE kode_studio = 'PS-03';
UPDATE studio SET durasi = 120 WHERE kode_studio = 'PS-04';


SELECT * FROM studio;


SELECT kode_studio, nama_studio, deskripsi FROM studio WHERE id_kategori = 3;

DESCRIBE booking;

SELECT * FROM booking;


ALTER TABLE booking ADD COLUMN bukti_pembayaran VARCHAR(255) AFTER total_harga;


ALTER TABLE booking ADD UNIQUE (kode_booking);

DROP TABLE pembayaran;

CREATE TABLE pembayaran (
                            id_pembayaran INT AUTO_INCREMENT PRIMARY KEY,
                            kode_booking VARCHAR(20) NOT NULL,
                            id_user INT NOT NULL, -- Tambahkan ini agar mudah tracking pembayaran per user
                            metode_pembayaran ENUM('transferbank', 'QRIS') NOT NULL,
                            jumlah_bayar INT NOT NULL,
                            bukti_transfer VARCHAR(255), -- Nama file gambar struk
                            status_pembayaran ENUM('pending', 'success', 'failed') DEFAULT 'pending',
                            catatan_admin TEXT, -- Untuk alasan jika pembayaran ditolak (failed)
                            tanggal_bayar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Relasi
                            CONSTRAINT fk_booking_pembayaran FOREIGN KEY (kode_booking)
                                REFERENCES booking(kode_booking) ON DELETE CASCADE,
                            CONSTRAINT fk_user_pembayaran FOREIGN KEY (id_user)
                                REFERENCES users(id_user)
);

ALTER TABLE pembayaran
    ADD COLUMN kode_unik SMALLINT NOT NULL DEFAULT 0,        -- angk-- 1. INISIALISASI DATABASE
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

SELECT * FROM booking;

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




ALTER TABLE kategori
    ADD COLUMN url_gambar VARCHAR(255) AFTER kode_kategori;

ALTER TABLE kategori
    ADD COLUMN deskripsi_kategori TEXT AFTER nama_kategori;

SELECT id_user, nama_lengkap, username, email, status FROM users;


INSERT INTO studio (kode_studio, nama_studio, id_kategori, deskripsi, harga, url_gambar, status)
VALUES
    ('PB-01', 'Classic Photobooth', 1,
     'FITUR: Sesi mandiri tanpa fotografer.\nFASILITAS: Aksesoris lucu, lighting cerah, & background solid.\nDURASI: 10 Menit sesi foto (unlimited shots).\nHASIL: 2 Lembar cetakan strip & file digital via QR Code.',
     50000, '/images/classic-photobooth.jpeg', 'available');

-- Set foto utama untuk Classic Photobooth
INSERT INTO studio_images (id_studio, url_gambar, is_primary)
VALUES (4, '/images/photobooth-detail-1.jpg', TRUE);


-- 1. Matikan pengecekan foreign key
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Hapus tabelnya
DROP TABLE IF EXISTS studio;
DROP TABLE IF EXISTS kategori;

-- 3. Nyalakan kembali pengecekan
SET FOREIGN_KEY_CHECKS = 1;

-- 4. Buat ulang tabel kategori dengan struktur lengkap
CREATE TABLE kategori (
                          id_kategori INT AUTO_INCREMENT PRIMARY KEY,
                          nama_kategori VARCHAR(50) NOT NULL,
                          deskripsi_kategori TEXT,
                          kode_kategori VARCHAR(10) UNIQUE NOT NULL,
                          url_gambar VARCHAR(255),
                          status ENUM('active', 'inactive') DEFAULT 'active'
);

-- 5. Buat ulang tabel studio (karena tadi ikut dihapus supaya sinkron)
CREATE TABLE studio (
                        id_studio INT AUTO_INCREMENT PRIMARY KEY,
                        kode_studio VARCHAR(20) UNIQUE NOT NULL,
                        nama_studio VARCHAR(100) NOT NULL,
                        deskripsi TEXT,
                        url_gambar VARCHAR(255),
                        id_kategori INT NOT NULL,
                        harga INT NOT NULL,
                        status ENUM('available', 'maintenance', 'hidden') DEFAULT 'available',
                        FOREIGN KEY (id_kategori) REFERENCES kategori(id_kategori)
);

-- 6. Sekarang Insert datanya (Gak akan error duplicate lagi)
INSERT INTO kategori (nama_kategori, deskripsi_kategori, kode_kategori, url_gambar, status)
VALUES
    ('Photobooth', 'Abadikan momen seru instan dengan berbagai pilihan frame lucu.', 'PB', '/assets/photobooth.jpg', 'active'),
    ('Self Photo', 'Ekspresikan dirimu dengan bebas di studio privat tanpa fotografer.', 'SP', '/assets/selfphoto.jpg', 'active'),
    ('Studio Pro', 'Hasil foto kualitas tinggi dengan lighting profesional dan fotografer ahli.', 'PS', '/assets/photostudio.jpg', 'active');

INSERT INTO kategori (nama_kategori, deskripsi_kategori, kode_kategori, url_gambar, status)
VALUES
    (
        'Photobooth',
        'Abadikan momen seru instan dengan berbagai pilihan frame dan stiker lucu.',
        'PB',
        'frontend/src/assets/photobooth.jpeg',
        'active'
    ),
    (
        'Self Photo',
        'Ekspresikan dirimu dengan bebas di studio privat tanpa gangguan fotografer.',
        'SP',
        'frontend/src/assets/studio_photo.jpeg',
        'active'
    ),
    (
        'Studio Pro',
        'Hasil foto kualitas tinggi dengan dukungan lighting profesional dan fotografer ahli.',
        'PS',
        'frontend/src/assets/self_photo.jpeg',
        'active'
    );


UPDATE kategori SET url_gambar = '/images/photobooth.jpeg' WHERE id_kategori = 1;
UPDATE kategori SET url_gambar = '/images/self_photo.jpeg' WHERE id_kategori = 2;
UPDATE kategori SET url_gambar = '/images/studio_photo.jpeg' WHERE id_kategori = 3;





SELECT id_kategori, nama_kategori, url_gambar FROM kategori;


INSERT INTO studio (kode_studio, nama_studio, deskripsi, url_gambar, id_kategori, harga, status)
VALUES
-- ========================
-- PHOTOBOOTH (id_kategori = 1)
-- ========================
('PB-01', 'Neon Glow Booth',
 'FITUR: Lampu neon warna-warni otomatis & timer foto mandiri.\nFASILITAS: 10+ properti lucu, background neon, printer instan.\nDURASI: 15 menit sesi foto bebas.\nHASIL: 3 lembar cetak strip + file digital via QR Code.\nBENEFIT: Cocok untuk foto bareng hingga 4 orang, hasil cetak langsung di tempat.',
 '/images/neon-photobooth.jpeg', 1, 50000, 'available'),

('PB-02', 'Retro Vintage Booth',
 'FITUR: Filter kamera ala polaroid & film grain otomatis.\nFASILITAS: Properti vintage (kacamata, topi, bingkai), background jadul.\nDURASI: 15 menit sesi foto bebas.\nHASIL: 3 lembar cetak polaroid + file digital via QR Code.\nBENEFIT: Nuansa tahun 90an yang timeless, cocok untuk konten estetik.',
 '/images/vintage-photobooth.jpeg', 1, 50000, 'available'),

('PB-03', 'Pastel Dream Booth',
 'FITUR: Background pastel ganti otomatis 3 warna.\nFASILITAS: Properti bunga, balon, & boneka lucu.\nDURASI: 15 menit sesi foto bebas.\nHASIL: 3 lembar cetak strip + file digital via QR Code.\nBENEFIT: Warna lembut yang sempurna untuk konten Instagram & TikTok.',
 '/images/photobooth.jpeg', 1, 55000, 'available'),

('PB-04', 'Idol Booth',
 'FITUR: Konsep photo booth ala Photoism Korea dengan filter kamera HD otomatis & pencahayaan soft idol.
 FASILITAS: Properti K-Pop (lightstick, album, polaroid idol), background pastel & hologram, stiker & frame ala Photoism, printer instan.
 DURASI: 15 menit sesi foto bebas unlimited shots.
 HASIL: 2 lembar cetak strip dengan frame idol lucu + soft file digital via QR Code.
 BENEFIT: Rasakan sensasi foto ala bintang K-Pop, hasil cetak bisa langsung dijadikan koleksi seperti photocard idol asli!',
 '/images/idol-photobooth.jpeg', 1, 60000, 'available'),

('PB-05', 'Monochrome Booth',
 'FITUR: Kamera dengan filter hitam putih profesional.\nFASILITAS: Background marble putih & hitam, properti minimalis.\nDURASI: 15 menit sesi foto bebas.\nHASIL: 3 lembar cetak hitam putih + file digital via QR Code.\nBENEFIT: Hasil foto artistik dan elegan, cocok untuk foto profil formal.',
 '/images/monocrome-photobooth.jpeg', 1, 50000, 'available'),

('PB-06', 'Groceries Booth',
 'FITUR: Konsep foto aesthetic ala supermarket & grocery store dengan prop makanan lucu.
 FASILITAS: Properti grocery (keranjang belanja mini, sayur & buah artificial, paper bag lucu), background rak supermarket & warna-warni cerah, stiker & frame ala aesthetic grocery, printer instan.
 DURASI: 15 menit sesi foto bebas unlimited shots.
 HASIL: 2 lembar cetak strip dengan frame grocery lucu + soft file digital via QR Code.
 BENEFIT: Konsep unik & hits di media sosial, cocok untuk foto solo maupun bareng teman dengan vibes daily life yang aesthetic!',
 '/images/glosir-photobooth.jpeg', 1, 65000, 'available');


INSERT INTO studio (kode_studio, nama_studio, deskripsi, url_gambar, id_kategori, harga, status)
VALUES
    ('SP-01', 'Minimalist White Studio',
     'FITUR: Remote shutter & tripod profesional disediakan.\nFASILITAS: Background seamless putih, softbox lighting, cermin besar.\nDURASI: 60 menit sesi privat.\nHASIL: File digital resolusi tinggi dikirim via Google Drive.\nBENEFIT: Cocok untuk foto outfit, lookbook, & konten creator tanpa fotografer.',
     '/images/minimalist-self.jpeg', 2, 150000, 'available'),

    ('SP-02', 'Newspaper Studio',
     'FITUR: Remote shutter & ring light adjustable dengan nuansa editorial koran klasik.
     FASILITAS: Background dinding wallpaper koran vintage, properti koran & majalah lama, meja baca antik, kursi kayu klasik, & lampu meja retro.
     DURASI: 60 menit sesi privat.
     HASIL: File digital resolusi tinggi dikirim via Google Drive.
     BENEFIT: Nuansa vintage editorial yang unik & estetik, cocok untuk foto bertema journalist, retro aesthetic, & konten storytelling yang berkesan.',
     '/images/koran-self.jpeg', 2, 150000, 'available'),

    ('SP-03', 'Train Compartment Studio',
     'FITUR: Remote shutter & lighting warm tone ala pencahayaan gerbong kereta klasik.
     FASILITAS: Set kursi gerbong kereta vintage, jendela dengan pemandangan countryside, rak bagasi kayu, properti tiket & koper antik, & lampu gantung kereta retro.
     DURASI: 60 menit sesi privat.
     HASIL: File digital resolusi tinggi dikirim via Google Drive.
     BENEFIT: Nuansa perjalanan kereta yang romantis & sinematik, cocok untuk foto couple, solo traveling aesthetic, & konten bertema journey yang hits di media sosial.',
     '/images/train-self.jpeg', 2, 175000, 'available');


INSERT INTO studio (kode_studio, nama_studio, deskripsi, url_gambar, id_kategori, harga, status)
VALUES
    ('PS-01', 'Classic Portrait Studio',
     'FITUR: Fotografer profesional + 2 asisten lighting.\nFASILITAS: Strobo & softbox lengkap, background polos 5 warna, cermin full body.\nDURASI: 90 menit sesi foto terarah.\nHASIL: 10 foto terpilih edit profesional + file RAW via Google Drive.\nBENEFIT: Ideal untuk foto wisuda, foto profil LinkedIn, & keperluan formal.',
     '/images/minimalist-studio.jpeg', 3, 350000, 'available'),

    ('PS-02', 'Fashion Editorial Studio',
     'FITUR: Fotografer fashion berpengalaman + 1 asisten.\nFASILITAS: Lighting dramatis Rembrandt, background tekstur premium, & kipas angin.\nDURASI: 90 menit sesi foto terarah.\nHASIL: 10 foto terpilih edit profesional + file RAW via Google Drive.\nBENEFIT: Hasil foto sekelas majalah fashion, cocok untuk portofolio model & brand.',
     '/images/fashion-studio.jpeg', 3, 400000, 'available'),

    ('PS-03', 'Family Portrait Studio',
     'FITUR: Fotografer keluarga + asisten pose & properti.\nFASILITAS: Studio luas 6x8m, sofa & kursi keluarga, background warm tone.\nDURASI: 120 menit sesi foto santai.\nHASIL: 15 foto terpilih edit profesional + file RAW via Google Drive.\nBENEFIT: Momen keluarga terabadikan indah, cocok hingga 10 anggota keluarga.',
     '/images/family-studio.jpeg', 3, 450000, 'available'),

    ('PS-04', 'Wedding Pre-Wed Studio',
     'FITUR: Fotografer wedding profesional + dekorator.\nFASILITAS: Dekorasi bunga segar, backdrop mewah, & tata cahaya romantis.\nDURASI: 120 menit sesi foto romantis.\nHASIL: 20 foto terpilih edit profesional + file RAW via Google Drive.\nBENEFIT: Kenangan pre-wedding indoor yang memukau tanpa perlu keluar kota.',
     '/images/prewedding-studio.jpeg', 3, 500000, 'available'),

    ('PS-05', 'Product Photography',
     'FITUR: Fotografer produk + lighting macro spesialis.\nFASILITAS: Meja still life, backdrop kertas 10 warna, lensa macro, & diffuser.\nDURASI: 90 menit sesi foto produk.\nHASIL: 15 foto produk edit retouching + file RAW via Google Drive.\nBENEFIT: Foto produk berkualitas tinggi untuk marketplace, website, & iklan.',
     '/images/product-studio.jpeg', 3, 375000, 'available');


ALTER TABLE studio ADD COLUMN durasi INT NOT NULL DEFAULT 15 COMMENT 'dalam menit' AFTER harga;

-- Update durasi Studio Pro yang 90 menit
UPDATE studio SET durasi = 90 WHERE kode_studio = 'PS-01';
UPDATE studio SET durasi = 90 WHERE kode_studio = 'PS-02';
UPDATE studio SET durasi = 90 WHERE kode_studio = 'PS-05';

-- Update durasi Studio Pro yang 120 menit
UPDATE studio SET durasi = 120 WHERE kode_studio = 'PS-03';
UPDATE studio SET durasi = 120 WHERE kode_studio = 'PS-04';


SELECT * FROM studio;


SELECT kode_studio, nama_studio, deskripsi FROM studio WHERE id_kategori = 3;

DESCRIBE booking;

SELECT * FROM booking;


ALTER TABLE booking ADD COLUMN bukti_pembayaran VARCHAR(255) AFTER total_harga;


ALTER TABLE booking ADD UNIQUE (kode_booking);

DROP TABLE pembayaran;

CREATE TABLE pembayaran (
                            id_pembayaran INT AUTO_INCREMENT PRIMARY KEY,
                            kode_booking VARCHAR(20) NOT NULL,
                            id_user INT NOT NULL, -- Tambahkan ini agar mudah tracking pembayaran per user
                            metode_pembayaran ENUM('transferbank', 'QRIS') NOT NULL,
                            jumlah_bayar INT NOT NULL,
                            bukti_transfer VARCHAR(255), -- Nama file gambar struk
                            status_pembayaran ENUM('pending', 'success', 'failed') DEFAULT 'pending',
                            catatan_admin TEXT, -- Untuk alasan jika pembayaran ditolak (failed)
                            tanggal_bayar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Relasi
                            CONSTRAINT fk_booking_pembayaran FOREIGN KEY (kode_booking)
                                REFERENCES booking(kode_booking) ON DELETE CASCADE,
                            CONSTRAINT fk_user_pembayaran FOREIGN KEY (id_user)
                                REFERENCES users(id_user)
);

ALTER TABLE pembayaran
    ADD COLUMN kode_unik SMALLINT NOT NULL DEFAULT 0,        -- angka 001-999
    ADD COLUMN jumlah_tagihan INT NOT NULL DEFAULT 0,        -- harga asli
    ADD COLUMN expired_at DATETIME;                          -- batas waktu bayar


DESCRIBE pembayaran;
a 001-999
    ADD COLUMN jumlah_tagihan INT NOT NULL DEFAULT 0,        -- harga asli
    ADD COLUMN expired_at DATETIME;                          -- batas waktu bayar


DESCRIBE pembayaran;


SELECT * FROM booking WHERE kode_booking = 'BK-20260507-001';

SELECT kode_booking FROM booking;

DESCRIBE pembayaran;

SHOW CREATE TABLE booking;

ALTER TABLE booking
    MODIFY COLUMN status ENUM('pending', 'waiting', 'confirmed', 'cancelled') DEFAULT 'pending';


-- Tambahkan 'waiting' ke ENUM tabel booking
ALTER TABLE booking
    MODIFY COLUMN status ENUM('pending', 'waiting', 'confirmed', 'cancelled') DEFAULT 'pending';

-- Tambahkan 'waiting' ke ENUM tabel pembayaran (jika ingin digunakan di sana juga)
ALTER TABLE pembayaran
    MODIFY COLUMN status_pembayaran ENUM('pending', 'waiting', 'success', 'failed') DEFAULT 'pending';