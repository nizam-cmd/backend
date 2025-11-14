-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 14 Nov 2025 pada 08.11
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gym`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `attendance`
--

CREATE TABLE `attendance` (
  `attendance_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `role` enum('Member','Personal Trainer') NOT NULL,
  `check_in` datetime DEFAULT NULL,
  `check_out` datetime DEFAULT NULL,
  `duration` varchar(20) DEFAULT NULL,
  `status` enum('Check-in','Check-out') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `attendance`
--

INSERT INTO `attendance` (`attendance_id`, `user_id`, `role`, `check_in`, `check_out`, `duration`, `status`, `created_at`) VALUES
(1, 17, 'Member', '2025-11-14 14:11:11', '2025-11-14 14:11:13', '0m', 'Check-out', '2025-11-14 07:11:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `booking`
--

CREATE TABLE `booking` (
  `booking_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `class_id` int(10) NOT NULL,
  `booking_date` date NOT NULL,
  `status` varchar(10) NOT NULL,
  `check_in` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `class`
--

CREATE TABLE `class` (
  `class_id` int(10) NOT NULL,
  `trainer_id` int(10) NOT NULL,
  `branch_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `schedule_date` date NOT NULL,
  `start_time` varchar(15) NOT NULL,
  `end_time` varchar(15) NOT NULL,
  `capacity` int(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `gymbranch`
--

CREATE TABLE `gymbranch` (
  `gymbranch_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `open_hours` varchar(7) NOT NULL,
  `manage_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `gymbranch`
--

INSERT INTO `gymbranch` (`gymbranch_id`, `name`, `address`, `phone`, `open_hours`, `manage_name`) VALUES
(2, 'Gym Center Jakarta', 'Jl. Sudirman No. 10', '081234567890', '08:00-2', 'Andi'),
(3, 'Gym Center Bandung', 'Jl. Asia Afrika No. 25', '081298765432', '07:00-2', 'Budi'),
(4, 'Gym Center Surabaya', 'Jl. Pemuda No. 50', '082112345678', '06:00-2', 'Citra'),
(5, 'Main Branch', 'Alamat Default', '', '', '');

-- --------------------------------------------------------

--
-- Struktur dari tabel `membership`
--

CREATE TABLE `membership` (
  `membership_id` int(10) NOT NULL,
  `user_id` int(10) DEFAULT NULL,
  `membership_type` varchar(50) NOT NULL,
  `start_date` varchar(10) NOT NULL,
  `end_date` varchar(10) NOT NULL,
  `status` varchar(10) NOT NULL DEFAULT 'active',
  `price` varchar(30) NOT NULL,
  `payment_id` int(10) DEFAULT NULL,
  `category` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `membership`
--

INSERT INTO `membership` (`membership_id`, `user_id`, `membership_type`, `start_date`, `end_date`, `status`, `price`, `payment_id`, `category`, `created_at`) VALUES
(5, 1, 'B', '2025-11-11', '2026-02-11', 'active', '80', NULL, 'pelajar', '2025-11-11 07:40:22'),
(10, 12, 'B', '2025-11-13', '2026-05-13', 'active', '80', NULL, 'non-pelajar', '2025-11-12 12:51:35'),
(11, 13, 'C', '2025-11-12', '2026-02-11', 'active', '80', NULL, 'pelajar', '2025-11-12 13:02:07'),
(16, NULL, 'C', '2025-11-13', '2025-12-13', 'active', '99999', NULL, 'non-pelajar', '2025-11-13 15:22:05');

-- --------------------------------------------------------

--
-- Struktur dari tabel `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `amount` float NOT NULL,
  `payment_date` date NOT NULL,
  `method` varchar(20) NOT NULL,
  `status` varchar(10) NOT NULL,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_training_schedule`
--

CREATE TABLE `personal_training_schedule` (
  `schedule_id` int(11) NOT NULL,
  `member_id` int(11) DEFAULT NULL,
  `trainer_id` int(11) DEFAULT NULL,
  `waktu_mulai` datetime DEFAULT NULL,
  `waktu_selesai` datetime DEFAULT NULL,
  `catatan` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `roles`
--

CREATE TABLE `roles` (
  `role_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `schedule`
--

CREATE TABLE `schedule` (
  `id` int(11) NOT NULL,
  `trainer_id` int(10) NOT NULL,
  `member_id` int(10) NOT NULL,
  `sesi` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `schedule`
--

INSERT INTO `schedule` (`id`, `trainer_id`, `member_id`, `sesi`, `created_at`) VALUES
(2, 30, 14, '3', '2025-11-13 05:13:27'),
(5, 37, 14, '1', '2025-11-13 15:50:55');

-- --------------------------------------------------------

--
-- Struktur dari tabel `trainer`
--

CREATE TABLE `trainer` (
  `trainer_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `jumlah_pertemuan` varchar(50) DEFAULT NULL,
  `harga` decimal(15,2) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `bio` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `trainer`
--

INSERT INTO `trainer` (`trainer_id`, `name`, `jumlah_pertemuan`, `harga`, `photo`, `phone`, `email`, `bio`) VALUES
(36, '3IA05 Nizam Danial hasan', '1 Sesi', NULL, '/uploads/photo-1763048419352.jpg', '081291014750', 'nizamdanialhasan14@gmail.com', 'ada'),
(37, 'hanif', '1 Sesi', 0.00, '/uploads/photo-1763049045627.jpg', '081291014750', 'nizamdanialhasan14@gmail.com', 'segs');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `user_id` int(10) NOT NULL,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(20) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `membership_id` int(11) DEFAULT NULL,
  `join_date` date DEFAULT curdate(),
  `role_id` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`user_id`, `name`, `email`, `password`, `phone`, `address`, `gender`, `photo`, `membership_id`, `join_date`, `role_id`) VALUES
(1, 'Nizam', 'nizam@example.com', '123456', '08123456789', NULL, NULL, NULL, NULL, '2025-11-11', 1),
(14, 'ali', 'nizamdanialhasan14@gmail.com', '', '081291014750', 'manggarai utara 2', 'Female', '/uploads/photo-1762953332976.jpg', 5, '2025-11-12', 2),
(17, 'ryan', 'nizamdanialhasan14@gmail.com', '', '081291014750', 'manggarai utara 2', 'Male', '/uploads/photo-1763049123537.jpg', NULL, '2025-11-13', 2);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`attendance_id`);

--
-- Indeks untuk tabel `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `fk_booking_user` (`user_id`),
  ADD KEY `fk_booking_class` (`class_id`);

--
-- Indeks untuk tabel `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`class_id`),
  ADD KEY `fk_class_trainer` (`trainer_id`),
  ADD KEY `fk_class_branch` (`branch_id`);

--
-- Indeks untuk tabel `gymbranch`
--
ALTER TABLE `gymbranch`
  ADD PRIMARY KEY (`gymbranch_id`);

--
-- Indeks untuk tabel `membership`
--
ALTER TABLE `membership`
  ADD PRIMARY KEY (`membership_id`);

--
-- Indeks untuk tabel `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `fk_payment_user` (`user_id`);

--
-- Indeks untuk tabel `personal_training_schedule`
--
ALTER TABLE `personal_training_schedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `trainer_id` (`trainer_id`);

--
-- Indeks untuk tabel `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- Indeks untuk tabel `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `trainer`
--
ALTER TABLE `trainer`
  ADD PRIMARY KEY (`trainer_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `fk_membership` (`membership_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `attendance`
--
ALTER TABLE `attendance`
  MODIFY `attendance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `booking`
--
ALTER TABLE `booking`
  MODIFY `booking_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `class`
--
ALTER TABLE `class`
  MODIFY `class_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `gymbranch`
--
ALTER TABLE `gymbranch`
  MODIFY `gymbranch_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `membership`
--
ALTER TABLE `membership`
  MODIFY `membership_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT untuk tabel `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `personal_training_schedule`
--
ALTER TABLE `personal_training_schedule`
  MODIFY `schedule_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int(10) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `schedule`
--
ALTER TABLE `schedule`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `trainer`
--
ALTER TABLE `trainer`
  MODIFY `trainer_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `fk_booking_class` FOREIGN KEY (`class_id`) REFERENCES `class` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_booking_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `fk_class_branch` FOREIGN KEY (`branch_id`) REFERENCES `gymbranch` (`gymbranch_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_class_trainer` FOREIGN KEY (`trainer_id`) REFERENCES `trainer` (`trainer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `fk_payment_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `personal_training_schedule`
--
ALTER TABLE `personal_training_schedule`
  ADD CONSTRAINT `personal_training_schedule_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `personal_training_schedule_ibfk_2` FOREIGN KEY (`trainer_id`) REFERENCES `trainer` (`trainer_id`);

--
-- Ketidakleluasaan untuk tabel `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_membership` FOREIGN KEY (`membership_id`) REFERENCES `membership` (`membership_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
