-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 30, 2026 at 12:40 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_nurses`
--

-- --------------------------------------------------------

--
-- Table structure for table `care_requests`
--

CREATE TABLE `care_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `preferred_nurse_id` int(11) DEFAULT NULL,
  `care_for` varchar(50) NOT NULL,
  `care_type` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `duration` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `status` enum('pending','accepted','rejected','completed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `care_requests`
--

INSERT INTO `care_requests` (`id`, `user_id`, `preferred_nurse_id`, `care_for`, `care_type`, `start_date`, `duration`, `address`, `latitude`, `longitude`, `notes`, `status`, `created_at`) VALUES
(3, 37, 58, 'Myself', 'Daily Assistance', '2027-02-10', '4-hours', 'akkar', 34.55552720, 36.17595750, 'bonjour', 'pending', '2026-09-20 10:26:15'),
(4, 37, 61, 'Spouse / Partner', 'Post-Surgery Care', '2027-02-08', '8-hours', 'ببنين', 34.50975610, 35.98909800, 'bonjour 2', 'pending', '2026-09-20 10:27:20'),
(6, 37, NULL, 'Person with disability', 'Mobility Assistance', '2028-02-03', '4-hours', 'حرار', 34.45717670, 36.12218020, 'sdfsdfsdfsfsf', 'pending', '2026-09-20 16:32:49'),
(7, 2, 76, 'Myself', 'Medication Support', '2027-02-04', '1-hour', 'حرار', 34.45717670, 36.12218020, 'bonjour', 'pending', '2026-09-23 09:58:20'),
(8, 37, 77, 'شخص من ذوي الإعاقة', 'المساعدة في الأدوية', '2026-02-02', '2-hours', 'اكروم', 34.54412850, 36.36365320, 'bonjour', 'pending', '2026-09-25 08:10:29'),
(9, 37, 76, 'أحد الوالدين', 'المساعدة على الحركة', '2026-02-03', '4-hours', 'حرار', 34.45717670, 36.12218020, 'مرحبا', 'pending', '2026-09-25 08:38:14'),
(10, 2, 77, 'Spouse / Partner', 'Elderly Care', '2027-02-26', '2-hours', 'حرار', 34.45717670, 36.12218020, 'koijijijio', 'pending', '2026-09-25 11:39:38');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(100) DEFAULT 'general',
  `message` text NOT NULL,
  `status` enum('unread','read','replied') DEFAULT 'unread',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `reply_message` text DEFAULT NULL,
  `replied_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `subject`, `message`, `status`, `created_at`, `reply_message`, `replied_at`) VALUES
(2, 'akil  boulad', 'akil@gmail.com', 'general', 'hi', 'read', '2026-09-28 16:45:07', NULL, NULL),
(3, 'akil  boulad', 'akil@gmail.com', 'general', 'اه', 'unread', '2026-09-30 10:38:54', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `nurse_categories`
--

CREATE TABLE `nurse_categories` (
  `id` int(11) NOT NULL,
  `nurse_id` int(11) NOT NULL,
  `category` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nurse_categories`
--

INSERT INTO `nurse_categories` (`id`, `nurse_id`, `category`) VALUES
(376, 46, 'Elderly Care'),
(377, 46, 'Companionship'),
(378, 47, 'Post-Surgery'),
(379, 47, 'Medication Support'),
(380, 48, 'Elderly Care'),
(381, 48, 'Daily Assistance'),
(382, 48, 'Companionship'),
(383, 49, 'Medication Support'),
(384, 49, 'Disability Support'),
(385, 50, 'Post-Surgery'),
(386, 50, 'Elderly Care'),
(387, 50, 'Medication Support'),
(388, 51, 'Daily Assistance'),
(389, 51, 'Disability Support'),
(390, 52, 'Elderly Care'),
(391, 52, 'Medication Support'),
(392, 52, 'Companionship'),
(393, 53, 'Palliative Care'),
(394, 53, 'Elderly Care'),
(395, 54, 'Post-Surgery'),
(396, 54, 'Daily Assistance'),
(397, 54, 'Medication Support'),
(398, 55, 'Medication Support'),
(399, 55, 'Companionship'),
(400, 56, 'Elderly Care'),
(401, 56, 'Palliative Care'),
(402, 57, 'Post-Surgery'),
(403, 57, 'Disability Support'),
(404, 57, 'Daily Assistance'),
(405, 58, 'Medication Support'),
(406, 58, 'Elderly Care'),
(407, 59, 'Palliative Care'),
(408, 59, 'Companionship'),
(409, 59, 'Elderly Care'),
(410, 60, 'Daily Assistance'),
(411, 60, 'Companionship'),
(412, 61, 'Post-Surgery'),
(413, 61, 'Medication Support'),
(414, 61, 'Palliative Care'),
(415, 62, 'Elderly Care'),
(416, 62, 'Disability Support'),
(417, 63, 'Medication Support'),
(418, 63, 'Daily Assistance'),
(419, 63, 'Companionship'),
(420, 64, 'Post-Surgery'),
(421, 64, 'Elderly Care'),
(422, 65, 'Palliative Care'),
(423, 65, 'Disability Support'),
(424, 65, 'Companionship'),
(425, 66, 'Elderly Care'),
(426, 66, 'Post-Surgery'),
(427, 66, 'Medication Support'),
(435, 76, 'ICU Support'),
(436, 76, 'Palliative Care'),
(437, 76, 'Pediatric Care'),
(438, 77, 'Elderly Care'),
(439, 77, 'IV Therapy & Injections'),
(440, 77, 'Pediatric Care'),
(441, 78, 'Pediatric Care'),
(442, 78, 'Palliative Care'),
(443, 79, 'Palliative Care'),
(444, 79, 'IV Therapy & Injections');

-- --------------------------------------------------------

--
-- Table structure for table `nurse_profiles`
--

CREATE TABLE `nurse_profiles` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `specialization` varchar(100) NOT NULL,
  `experience` varchar(20) NOT NULL,
  `location` varchar(255) NOT NULL,
  `cv_file` varchar(500) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `rating` decimal(3,2) DEFAULT 0.00,
  `reviews` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nurse_profiles`
--

INSERT INTO `nurse_profiles` (`id`, `user_id`, `specialization`, `experience`, `location`, `cv_file`, `image`, `status`, `created_at`, `updated_at`, `price`, `rating`, `reviews`) VALUES
(46, 5, 'Registered Nurse', '15 yrs', 'San Jose, CA', '', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop', 'approved', '2026-09-16 12:29:43', '2026-09-19 12:11:01', 65.00, 5.00, 189),
(47, 6, 'Registered Nurse', '8 yrs', 'San Francisco, CA', '', '/images/nurse2.png', 'pending', '2026-09-16 12:29:43', '2026-09-19 11:11:40', 45.00, 4.90, 127),
(48, 7, 'Home Health Aide', '7 yrs', 'Palo Alto, CA', '', '/images/nurses1.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 65.00, 4.80, 112),
(49, 8, 'Licensed Practical Nurse', '12 yrs', 'Oakland, CA', '', '/images/nurses3.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 52.00, 4.50, 99),
(50, 9, 'Licensed Practical Nurse', '8 yrs', 'Oakland, CA', '', '/images/Aisha.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 52.00, 4.50, 99),
(51, 10, 'Certified Nursing Assistant', '5 yrs', 'Berkeley, CA', '', '/images/sami.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 52.00, 4.50, 99),
(52, 11, 'Registered Nurse', '10 yrs', 'San Jose, CA', '', '/images/emily.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 58.00, 4.90, 156),
(53, 12, 'Registered Nurse', '11 yrs', 'San Francisco, CA', '', '/images/michel.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 60.00, 4.80, 143),
(54, 13, 'Licensed Practical Nurse', '6 yrs', 'Palo Alto, CA', '', '/images/sophia.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 48.00, 4.70, 91),
(55, 14, 'Certified Nursing Assistant', '5 yrs', 'Oakland, CA', '', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600&auto=format&fit=crop', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 42.00, 4.60, 78),
(56, 15, 'Registered Nurse', '13 yrs', 'Berkeley, CA', '', '/images/olivia.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 62.00, 5.00, 201),
(57, 16, 'Registered Nurse', '9 yrs', 'San Mateo, CA', '', '/images/james.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 55.00, 4.80, 134),
(58, 17, 'Registered Nurse', '9 yrs', 'San Jose, CA', '', '/images/nora.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 59.00, 4.90, 145),
(59, 18, 'Registered Nurse', '8 yrs', 'Oakland, CA', '', '/images/danielcarter.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 57.00, 4.80, 121),
(60, 19, 'Home Health Aide', '6 yrs', 'Berkeley, CA', '', '/images/emma.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 46.00, 4.70, 88),
(61, 20, 'Registered Nurse', '14 yrs', 'San Francisco, CA', '', '/images/Maya.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 68.00, 4.90, 176),
(62, 21, 'Registered Nurse', '7 yrs', 'San Jose, CA', '', '/images/nowa.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 50.00, 4.60, 104),
(63, 22, 'Licensed Practical Nurse', '10 yrs', 'Palo Alto, CA', '', '/images/lee.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 54.00, 4.80, 119),
(64, 23, 'Certified Nursing Assistant', '4 yrs', 'Oakland, CA', '', '/images/ethan.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 44.00, 4.50, 67),
(65, 24, 'Registered Nurse', '12 yrs', 'Berkeley, CA', '', '/images/chloe.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 63.00, 4.90, 162),
(66, 25, 'Registered Nurse', '8 yrs', 'San Mateo, CA', '', '/images/Ayman.png', 'approved', '2026-09-16 12:29:43', '2026-09-16 12:29:43', 56.00, 4.70, 113),
(67, 28, 'pediatric', '5-10', 'Tripoli,Abu Samra ', 'uploads/cvs/1789632141444-736483460.jpg', NULL, 'pending', '2026-09-17 08:02:21', '2026-09-17 08:02:21', 0.00, 0.00, 0),
(68, 29, 'pediatric', '0-1', 'Tripoli,Abu Samra ', 'uploads/cvs/1789632250866-221387732.png', NULL, 'pending', '2026-09-17 08:04:10', '2026-09-17 08:04:10', 0.00, 0.00, 0),
(69, 30, 'pediatric', '1-3', 'tripoli', 'uploads/cvs/1789636240159-967824817.png', NULL, 'pending', '2026-09-17 09:10:40', '2026-09-17 09:10:40', 0.00, 0.00, 0),
(76, 42, 'pediatric', '1-3', 'bbnin', '/uploads/cvs/1790074891613-980150822.pdf', '/uploads/imagenurses/1790158536245-248474897.jpg', 'approved', '2026-09-22 11:01:31', '2026-09-23 10:15:36', 50.00, 3.00, 1),
(77, 43, 'general', '1-3', 'kola', '/uploads/cvs/1790322818912-777778148.pdf', '/uploads/imagenurses/1790322818908-317388307.jpg', 'approved', '2026-09-25 07:53:38', '2026-09-25 07:59:02', 56.00, 0.00, 0),
(78, 45, 'pediatric', '1-3', 'bbnin', '/uploads/cvs/1790325862346-93799870.pdf', '/uploads/imagenurses/1790325862340-424775376.jpg', 'pending', '2026-09-25 08:44:22', '2026-09-25 08:44:22', 56.00, 0.00, 0),
(79, 46, 'pediatric', '3-5', 'kola', '/uploads/cvs/1790354983983-869415068.pdf', '/uploads/imagenurses/1790354983982-351543379.jpg', 'pending', '2026-09-25 16:49:44', '2026-09-25 16:49:44', 56.00, 0.00, 0);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `nurse_id` int(11) NOT NULL,
  `patient_id` int(11) NOT NULL,
  `rating` decimal(2,1) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `nurse_id`, `patient_id`, `rating`, `comment`, `created_at`) VALUES
(5, 76, 2, 3.0, NULL, '2026-09-22 11:05:41');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `settings_key` varchar(50) NOT NULL,
  `settings_value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`settings_value`)),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`settings_key`, `settings_value`, `updated_at`) VALUES
('about_content', '{\"foundedYear\": \"2026\", \"statFamilies\": \"10,000+\", \"statNurses\": \"2,500+\", \"statCities\": \"40+\", \"statRating\": \"4.9/5\", \"storyParagraph1\": \"\", \"storyParagraph2\": \"\"}', '2026-09-30 10:04:14'),
('contact_info', '{\"email\":\"test@gmail.com\",\"phone\":\"+961 00 000 000\",\"emergencyPhone\":\"112 / +961 00 000 000\",\"location\":\"Beirut, Lebanon\",\"workingHours\":\"24/7 Available\"}', '2026-09-30 10:34:40');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `phone`, `role`, `created_at`, `updated_at`, `reset_token`, `reset_token_expiry`) VALUES
(1, 'Abed', 'Boulad', 'abed@test.com', '$2b$10$ui6xPicz4Q081C797xDx9uGDdzRj6qk1T/IitXYpsnDITq5eca0o2', '70123456', 'user', '2026-09-09 10:32:22', '2026-09-09 10:32:22', NULL, NULL),
(2, 'abed', 'boulad', 'abed@gmail.com', '$2b$10$77qfzMsOiQlxABoQThas0O2FeBTLBTWQZmQXVJO750pDDBTs5KM1.', '76986611', 'admin', '2026-09-12 15:35:43', '2026-09-28 16:00:49', NULL, NULL),
(3, 'ossman', 'boulad', 'ossmanboulad@gmail.com', '$2b$10$gwr7Dx2ArELlCT/q0F5HqOfae2ofmiDD9GqbC4HLGOYbFBHo5SbM6', '76986611', 'user', '2026-09-12 15:38:20', '2026-09-12 15:38:20', NULL, NULL),
(4, 'akil', 'boulad', 'akil@gmail.com', '$2b$10$3bAJu4yDGYqFg4wY.VEklu2tlYHGcV1f45eZpvrDlgAyj2DXCked6', '-123456789', 'user', '2026-09-12 15:39:09', '2026-09-12 15:39:09', NULL, NULL),
(5, 'Sarah', 'Haddad', 'sarah.haddad@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(6, 'David', 'Thompson', 'david.thompson@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(7, 'Lisa', 'Park', 'lisa.park@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(8, 'Maria', 'Santos', 'maria.santos@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(9, 'Aisha', 'Patel', 'aisha.patel@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(10, 'Sami', 'Okonkwo', 'sami.okonkwo@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(11, 'Emily', 'Johnson', 'emily.johnson@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(12, 'Michael', 'Brown', 'michael.brown@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldLJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(13, 'Sophia', 'Wilson', 'sophia.wilson@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(14, 'Daniel', 'Miller', 'daniel.miller@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(15, 'Olivia', 'Martinez', 'olivia.martinez@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(16, 'James', 'Anderson', 'james.anderson@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(17, 'Nora', 'Williams', 'nora.williams@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(18, 'Daniel', 'Carter', 'daniel.carter@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(19, 'Emma', 'Davis', 'emma.davis@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(20, 'Maya', 'Robinson', 'maya.robinson@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(21, 'Noah', 'Williams', 'noah.williams@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(22, 'Grace', 'Lee', 'grace.lee@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(23, 'Ethan', 'Moore', 'ethan.moore@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(24, 'Chloe', 'Taylor', 'chloe.taylor@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(25, 'Ayman', 'Harris', 'ayman.harris@example.com', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, 'nurse', '2026-09-16 12:29:43', '2026-09-16 12:29:43', NULL, NULL),
(26, 'jane', 'doe', 'janDoe@gmail.com', '$2b$10$Xp6Yu7Qu.o03Wgv7cR9T3OFyQ.60R5Upp6tGDfJoy.xXfteAm3CQi', '81230455', 'patient', '2026-09-17 07:46:07', '2026-09-17 07:46:07', NULL, NULL),
(27, 'sara', 'sara', 'sara@gmail.com', '$2b$10$UerfGGR60rJC2L32yGbVlupchC6EXTgNWdzTcWzP4PfnK7VXbf.R2', '81233333', 'patient', '2026-09-17 07:47:57', '2026-09-17 07:47:57', NULL, NULL),
(28, 'Razan', 'Hassoun', 'rznhassoun@gmail.com', '$2b$10$wt9ppHxFI2boAoO/YLA5g..3jE6PFbVLi7AMG1Z91mDIMSIVk1HCi', '70852961', 'nurse', '2026-09-17 08:02:21', '2026-09-17 08:02:21', NULL, NULL),
(29, 'Roro', 'hass', 'razan@gmail.com', '$2b$10$dT0u/lrOi6LsOyis7sU4EOqBxjZOXBh3kEGuyy6cuZkTxliVvmGUC', '70852961', 'nurse', '2026-09-17 08:04:10', '2026-09-17 08:04:10', NULL, NULL),
(30, 'sasa', 'sasa', 'sasa@email.com', '$2b$10$YO4ARgLNmV08YY3s3WIxJOjPQFYf9dcahU09.zgn26nMg3r9CfKJW', '3030303', 'nurse', '2026-09-17 09:10:40', '2026-09-17 09:10:40', NULL, NULL),
(32, 'jana', 'boulad', 'jana@gmai.com', '$2b$10$fGsh3o6CK5AQy07k58zNCOIEUKt2KjhvxNI1vto2cRLTfOWgCqaRO', '76986611', 'nurse', '2026-09-19 12:12:55', '2026-09-19 12:12:55', NULL, NULL),
(33, 'abedlrazak', 'boulad', 'bouladabedlrazak@gmail.com', 'google_authenticated_oauth', NULL, 'patient', '2026-09-19 16:43:02', '2026-09-19 16:43:02', NULL, NULL),
(34, 'habib', 'sarrag', 'habib@gmail.com', '$2b$10$1KVZAfDyTHMG/77txpoo1evBCuoVipMfuDWX2D2XLmCF2/cTIzsya', '76986611', 'patient', '2026-09-19 16:57:44', '2026-09-19 16:57:44', NULL, NULL),
(35, 'amjad', 'boulad', 'amjad@gmail.com', '$2b$10$lCACcoX78sfwUNb5EjKkOe3NJugkw6G4gFnHdaXIOyu7IXC1gzBrW', '76986611', 'nurse', '2026-09-19 17:03:31', '2026-09-19 17:03:31', NULL, NULL),
(36, 'King ', 'Kingboulad', 'kingkingboulad@gmail.com', '$2b$10$BhH0GhNh2CvY02I231yvCuBDCq8nzap1sL9aQBpjQsUiO0xZLHVpy', NULL, 'patient', '2026-09-19 17:29:56', '2026-09-28 17:13:29', NULL, NULL),
(37, 'dora', 'sarrg', 'dora@gmail.com', '$2b$10$4YOxQrtprIVwX2TokOsI0OoMsOqyrcPmvdywifWD2LpF9to.Wv44W', '76986611', 'patient', '2026-09-19 17:32:49', '2026-09-19 17:32:49', NULL, NULL),
(38, 'boudi', 'boulad', 'boudi@gmail.com', '$2b$10$niy6DwQsc08aDx4dga7eteScEk4bvP.yzudmOFAviON5cyZtMsRCy', '76986611', 'nurse', '2026-09-20 10:48:15', '2026-09-20 10:48:15', NULL, NULL),
(42, 'jihan', 'eid', 'jihan@gmail.com', '$2b$10$40/2rrObwnQrq8dx/E.UX.mKoER.y7Ag.JqJ1E.QTAn0Od3EoF1UO', '76986611', 'nurse', '2026-09-22 10:55:35', '2026-09-22 11:05:22', NULL, NULL),
(43, 'noura', 'boulad', 'noura@gmail.com', '$2b$10$TRAOveKGyeaZHmz.HmYuEeQrlww5Je1Q0IVJl28LxWBN0Niv65clm', '7698611', 'nurse', '2026-09-25 07:51:55', '2026-09-25 07:59:02', NULL, NULL),
(44, 'razan', 'haasoun', 'roro@gmail.com', '$2b$10$fGu/1lYmgEmkjoh/Cla.WeqGiH9aoxftp16XCgnYcEJhIWZ9VeawG', NULL, 'admin', '2026-09-25 08:32:59', '2026-09-25 08:35:40', NULL, NULL),
(45, 'houda', 'sarag', 'houda@gmail.com', '$2b$10$wy2YN0Z1XlWaZ3jaSnB5g.Zbu7Kvk36dAND3zli5y4iragW7Pl5oy', '123456789', 'patient', '2026-09-25 08:43:24', '2026-09-25 08:43:24', NULL, NULL),
(46, 'abdo', 'abdo', 'abdo@gmail.com', '$2b$10$pT6SxtRWXn2IGi5Sf3zEqOZTNkB0Iz9qAk8EsJ1BAmDXXao2Sz342', '76986611', 'nurse', '2026-09-25 16:49:44', '2026-09-25 16:49:44', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `care_requests`
--
ALTER TABLE `care_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_care_requests_user` (`user_id`),
  ADD KEY `fk_care_requests_nurse` (`preferred_nurse_id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `nurse_categories`
--
ALTER TABLE `nurse_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nurse_id` (`nurse_id`);

--
-- Indexes for table `nurse_profiles`
--
ALTER TABLE `nurse_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `nurse_id` (`nurse_id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`settings_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `care_requests`
--
ALTER TABLE `care_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `nurse_categories`
--
ALTER TABLE `nurse_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=445;

--
-- AUTO_INCREMENT for table `nurse_profiles`
--
ALTER TABLE `nurse_profiles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `care_requests`
--
ALTER TABLE `care_requests`
  ADD CONSTRAINT `fk_care_requests_nurse` FOREIGN KEY (`preferred_nurse_id`) REFERENCES `nurse_profiles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_care_requests_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `nurse_categories`
--
ALTER TABLE `nurse_categories`
  ADD CONSTRAINT `nurse_categories_ibfk_1` FOREIGN KEY (`nurse_id`) REFERENCES `nurse_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `nurse_profiles`
--
ALTER TABLE `nurse_profiles`
  ADD CONSTRAINT `fk_nurse_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `fk_review_nurse_profile` FOREIGN KEY (`nurse_id`) REFERENCES `nurse_profiles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_review_patient_user` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
