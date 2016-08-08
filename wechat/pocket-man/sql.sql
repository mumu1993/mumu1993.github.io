-- phpMyAdmin SQL Dump
-- version 4.4.1.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Feb 04, 2016 at 10:32 AM
-- Server version: 5.5.41-0+wheezy1
-- PHP Version: 5.4.45-0+deb7u2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `dev_penguin`
--

-- --------------------------------------------------------

--
-- Table structure for table `statistics`
--

CREATE TABLE IF NOT EXISTS `statistics` (
  `date` date NOT NULL,
  `pv` int(11) NOT NULL DEFAULT '0',
  `uv` int(11) NOT NULL DEFAULT '0',
  `start_pv` int(11) NOT NULL DEFAULT '0',
  `start_uv` int(11) NOT NULL DEFAULT '0',
  `share_friend_pv` int(11) NOT NULL DEFAULT '0',
  `share_friend_uv` int(11) NOT NULL DEFAULT '0',
  `share_timeline_pv` int(11) NOT NULL DEFAULT '0',
  `share_timeline_uv` int(11) NOT NULL DEFAULT '0',
  `singlemessage_pv` int(11) NOT NULL,
  `singlemessage_uv` int(11) NOT NULL,
  `groupmessage_pv` int(11) NOT NULL,
  `groupmessage_uv` int(11) NOT NULL,
  `timeline_pv` int(11) NOT NULL,
  `timeline_uv` int(11) NOT NULL,
  `from` char(64) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `openid` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `block` text COLLATE utf8_unicode_ci NOT NULL,
  `add_time` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `statistics`
--
ALTER TABLE `statistics`
  ADD UNIQUE KEY `date` (`date`,`from`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `openid` (`openid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;