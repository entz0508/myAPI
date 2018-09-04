-- MySQL dump 10.13  Distrib 5.5.57, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: slp_dla_info_db
-- ------------------------------------------------------
-- Server version	5.5.55-0ubuntu0.14.04.1-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `app_res_tb`
--

DROP TABLE IF EXISTS `app_res_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_res_tb` (
  `APP_ID` bigint(20) NOT NULL,
  `OS` enum('android','ios') NOT NULL,
  `C_VER` varchar(10) NOT NULL,
  `RES_KEY` varchar(32) NOT NULL,
  `RES_VALUE` varchar(256) NOT NULL,
  `RES_VER` int(11) NOT NULL,
  `APP_CATEGORY` enum('1','2','3','4','abc','kw') NOT NULL,
  PRIMARY KEY (`APP_ID`,`OS`,`C_VER`,`RES_KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_res_tb`
--

LOCK TABLES `app_res_tb` WRITE;
/*!40000 ALTER TABLE `app_res_tb` DISABLE KEYS */;
INSERT INTO `app_res_tb` VALUES (1000000003,'android','1.0.0','BUNDLE_BASE_URL','https://download.blueark.com/dla/DLA_Assetbundles_DEV_Taiwan/',1,'1'),(1000000003,'android','1.0.0','IMG_SERVER_URL','http://14.63.169.217/images/sdla/lv1/',1,'1'),(1000000003,'android','1.0.0','PRIMARY_DATA','res_primary',1,'1'),(1000000003,'android','1.0.0','STICKER','res_sticker',1,'1'),(1000000003,'android','1.0.0','THUMBNAIL','res_thumbnail',1,'1');
/*!40000 ALTER TABLE `app_res_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_ver_info_tb`
--

DROP TABLE IF EXISTS `app_ver_info_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_ver_info_tb` (
  `SEQ` int(11) NOT NULL AUTO_INCREMENT,
  `APP_ID` bigint(20) NOT NULL,
  `OS` enum('android','ios') NOT NULL,
  `VER` varchar(16) NOT NULL,
  `SUMMIT` enum('n','y') NOT NULL,
  `LEVEL` enum('1','2','3','4') NOT NULL,
  `FORCE_UPDATE` enum('y','n') NOT NULL,
  `UPDATE_URL` varchar(256) DEFAULT 'update_url',
  `CS_EMAIL` varchar(32) DEFAULT 'cs_mail',
  `REG_DATETIME` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SEQ`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_ver_info_tb`
--

LOCK TABLES `app_ver_info_tb` WRITE;
/*!40000 ALTER TABLE `app_ver_info_tb` DISABLE KEYS */;
INSERT INTO `app_ver_info_tb` VALUES (1,1000000003,'android','1.0.0','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-15 08:19:06'),(2,1000000003,'android','1.0.1','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-17 07:41:06'),(3,1000000003,'android','1.0.2','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-18 01:41:06'),(4,1000000003,'android','1.0.3','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(5,1000000003,'android','1.0.4','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(6,1000000003,'android','1.0.5','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(7,1000000003,'android','1.0.6','y','1','n','www.update_url.com','cs_email@blueark.com','2016-12-13 08:19:06'),(8,1000000003,'android','1.1.0','y','1','n','www.update_url.com','cs_email@blueark.com','2016-12-21 08:19:06'),(9,1000000003,'ios','1.0.0','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-15 08:19:06'),(10,1000000003,'ios','1.0.1','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-17 07:41:06'),(11,1000000003,'ios','1.0.2','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-18 01:41:06'),(12,1000000003,'ios','1.0.3','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(13,1000000003,'ios','1.0.4','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(14,1000000003,'ios','1.0.5','y','1','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(15,1000000003,'ios','1.0.6','y','1','n','www.update_url.com','cs_email@blueark.com','2016-12-13 08:19:06'),(16,1000000003,'ios','1.1.0','y','1','n','www.update_url.com','cs_email@blueark.com','2016-12-21 08:19:06'),(17,1000000004,'android','1.0.0','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-15 08:19:06'),(18,1000000004,'android','1.0.1','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-17 07:41:06'),(19,1000000004,'android','1.0.2','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-18 01:41:06'),(20,1000000004,'android','1.0.3','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(21,1000000004,'android','1.0.4','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(22,1000000004,'android','1.0.5','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(23,1000000004,'android','1.0.6','y','2','n','www.update_url.com','cs_email@blueark.com','2016-12-13 08:19:06'),(24,1000000004,'android','1.1.0','y','2','n','www.update_url.com','cs_email@blueark.com','2016-12-21 08:19:06'),(25,1000000004,'ios','1.0.0','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-15 08:19:06'),(26,1000000004,'ios','1.0.1','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-17 07:41:06'),(27,1000000004,'ios','1.0.2','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-18 01:41:06'),(28,1000000004,'ios','1.0.3','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(29,1000000004,'ios','1.0.4','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(30,1000000004,'ios','1.0.5','y','2','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(31,1000000004,'ios','1.0.6','y','2','n','www.update_url.com','cs_email@blueark.com','2016-12-13 08:19:06'),(32,1000000004,'ios','1.1.0','y','2','n','www.update_url.com','cs_email@blueark.com','2016-12-21 08:19:06'),(33,1000000005,'android','1.0.0','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-15 08:19:06'),(34,1000000005,'android','1.0.1','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-17 07:41:06'),(35,1000000005,'android','1.0.2','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-18 01:41:06'),(36,1000000005,'android','1.0.3','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(37,1000000005,'android','1.0.4','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(38,1000000005,'android','1.0.5','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(39,1000000005,'android','1.0.6','y','3','n','www.update_url.com','cs_email@blueark.com','2016-12-13 08:19:06'),(40,1000000005,'android','1.1.0','y','3','n','www.update_url.com','cs_email@blueark.com','2016-12-21 08:19:06'),(41,1000000005,'ios','1.0.0','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-15 08:19:06'),(42,1000000005,'ios','1.0.1','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-17 07:41:06'),(43,1000000005,'ios','1.0.2','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-18 01:41:06'),(44,1000000005,'ios','1.0.3','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(45,1000000005,'ios','1.0.4','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(46,1000000005,'ios','1.0.5','y','3','n','www.update_url.com','cs_email@blueark.com','2016-11-23 08:19:06'),(47,1000000005,'ios','1.0.6','y','3','n','www.update_url.com','cs_email@blueark.com','2016-12-13 08:19:06'),(48,1000000005,'ios','1.1.0','y','3','n','www.update_url.com','cs_email@blueark.com','2016-12-21 08:19:06');
/*!40000 ALTER TABLE `app_ver_info_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `constants_value`
--

DROP TABLE IF EXISTS `constants_value`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `constants_value` (
  `KEY` varchar(10) NOT NULL,
  `VALUE` varchar(16) NOT NULL,
  PRIMARY KEY (`KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `constants_value`
--

LOCK TABLES `constants_value` WRITE;
/*!40000 ALTER TABLE `constants_value` DISABLE KEYS */;
INSERT INTO `constants_value` VALUES ('APP_LV','2'),('APP_TYPE','dla_lv2');
/*!40000 ALTER TABLE `constants_value` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ep_info_tb`
--

DROP TABLE IF EXISTS `ep_info_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ep_info_tb` (
  `OS` enum('android','ios') NOT NULL,
  `LEVEL` tinyint(4) NOT NULL,
  `SEQUENCE` tinyint(4) NOT NULL,
  `EP_ID` varchar(10) NOT NULL,
  PRIMARY KEY (`OS`,`LEVEL`,`SEQUENCE`),
  UNIQUE KEY `U_EP_ID` (`EP_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ep_info_tb`
--

LOCK TABLES `ep_info_tb` WRITE;
/*!40000 ALTER TABLE `ep_info_tb` DISABLE KEYS */;
/*!40000 ALTER TABLE `ep_info_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ep_ver_info_tb`
--

DROP TABLE IF EXISTS `ep_ver_info_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ep_ver_info_tb` (
  `OS` enum('android','ios') NOT NULL,
  `EPISODE_ID` varchar(10) NOT NULL,
  `UNITY_CODE` varchar(16) NOT NULL,
  `VER` smallint(6) NOT NULL,
  `LAST_UPDATE` datetime NOT NULL,
  `ENABLE` enum('y','n') NOT NULL,
  PRIMARY KEY (`OS`,`EPISODE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ep_ver_info_tb`
--

LOCK TABLES `ep_ver_info_tb` WRITE;
/*!40000 ALTER TABLE `ep_ver_info_tb` DISABLE KEYS */;
/*!40000 ALTER TABLE `ep_ver_info_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_tb`
--

DROP TABLE IF EXISTS `user_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_tb` (
  `USER_ID` int(11) NOT NULL AUTO_INCREMENT,
  `CLIENT_UID` varchar(64) NOT NULL,
  `REG_DATETIME` datetime NOT NULL,
  `SIGNUP_OS` enum('android','ios') NOT NULL,
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_tb`
--

LOCK TABLES `user_tb` WRITE;
/*!40000 ALTER TABLE `user_tb` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_tb` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-07-24 15:43:38
