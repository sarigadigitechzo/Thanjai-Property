-- phpMyAdmin SQL Dump
-- Thanjai Property Database Schema

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+05:30";

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'sales',
  `phone` varchar(15) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default Super Admin (Password: Admin@1234)
INSERT INTO `users` (`name`, `email`, `password_hash`, `role`, `phone`) VALUES
('Super Admin', 'admin@realrest.example', '$2b$10$tZ2d6n0qI4k/i8E6.gPz.O5j8xM1/V9QG6y3H0A3x7/7lF6b8.3vS', 'admin', '9876543210');

-- --------------------------------------------------------
-- Table structure for table `properties`
-- --------------------------------------------------------
CREATE TABLE `properties` (
  `id` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `category` varchar(50) NOT NULL,
  `purpose` varchar(20) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `location` varchar(255) NOT NULL,
  `district` varchar(100) NOT NULL,
  `address` text,
  `size` varchar(50) NOT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `bathrooms` int(11) DEFAULT NULL,
  `furnishing` varchar(50) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Available',
  `latitude` varchar(50) DEFAULT NULL,
  `longitude` varchar(50) DEFAULT NULL,
  `video_url` varchar(255) DEFAULT NULL,
  `owner_name` varchar(100) DEFAULT NULL,
  `owner_phone` varchar(15) DEFAULT NULL,
  `listed_by` varchar(100) DEFAULT NULL,
  `images_json` text, 
  `description` text,
  `features_json` text, 
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `leads`
-- --------------------------------------------------------
CREATE TABLE `leads` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `mobile` varchar(15) NOT NULL,
  `whatsapp` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  `budget_min` decimal(15,2) DEFAULT NULL,
  `budget_max` decimal(15,2) DEFAULT NULL,
  `bedrooms` int(11) DEFAULT NULL,
  `notes` text,
  `type` varchar(50) DEFAULT NULL,
  `source` varchar(50) DEFAULT NULL,
  `assign_to` varchar(100) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'New',
  `followup` varchar(100) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for table `lead_timeline`
-- --------------------------------------------------------
CREATE TABLE `lead_timeline` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lead_id` varchar(50) NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `lead_id` (`lead_id`),
  FOREIGN KEY (`lead_id`) REFERENCES `leads` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
