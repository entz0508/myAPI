-- MySQL dump 10.13  Distrib 5.5.57, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: slp_en_info_db
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
  PRIMARY KEY (`APP_ID`,`OS`,`C_VER`,`RES_KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_res_tb`
--

LOCK TABLES `app_res_tb` WRITE;
/*!40000 ALTER TABLE `app_res_tb` DISABLE KEYS */;
INSERT INTO `app_res_tb` VALUES (1000000001,'android','1.0.0','BUNDLE_BASE_URL','https://download.blueark.com/dla/DLA_Assetbundles_DEV_Taiwan/',1),(1000000001,'android','1.0.0','PRIMARY_DATA','res_primary',1),(1000000001,'android','1.0.0','STICKER','res_sticker',1),(1000000001,'android','1.0.0','THUMBNAIL','res_thumbnail',1);
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
  `VER` varchar(16) NOT NULL DEFAULT '',
  `SUMMIT` enum('n','y') NOT NULL,
  `FORCE_UPDATE` enum('y','n') NOT NULL,
  `UPDATE_URL` varchar(256) DEFAULT 'update_url',
  `CS_EMAIL` varchar(32) DEFAULT 'cs_email',
  `REG_DATETIME` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SEQ`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_ver_info_tb`
--

LOCK TABLES `app_ver_info_tb` WRITE;
/*!40000 ALTER TABLE `app_ver_info_tb` DISABLE KEYS */;
INSERT INTO `app_ver_info_tb` VALUES (1,1000000001,'android','2.0.1','y','n','update_url','cs_email','2015-08-03 01:52:28'),(2,1000000001,'android','2.1.0','y','y','update_url','cs_email','2016-05-04 05:30:28'),(3,1000000001,'android','2.2.0','y','n','update_url','cs_email','2016-05-29 15:00:00'),(4,1000000001,'android','2.4.0','n','n','update_url','cs_email','2016-07-10 15:00:00'),(5,1000000001,'android','2.4.1','n','n','update_url','cs_email','2016-08-21 15:00:00'),(6,1000000001,'android','2.4.2','n','n','update_url','cs_email','2016-08-21 15:00:00'),(7,1000000001,'android','2.4.3','n','n','update_url','cs_email','2016-11-27 15:00:00'),(8,1000000001,'android','2.4.4','n','n','update_url','cs_email','2016-11-27 15:00:00'),(9,1000000001,'android','2.4.5','n','n','update_url','cs_email','2016-11-27 15:00:00'),(10,1000000001,'android','2.4.5.1','n','n','update_url','cs_email','2016-12-14 15:00:00'),(11,1000000001,'android','2.4.6','n','n','update_url','cs_email','2016-12-12 15:00:00'),(12,1000000001,'android','2.4.7','n','n','update_url','cs_email','2016-12-12 15:00:00'),(13,1000000001,'android','2.5.0','n','n','update_url','cs_email','2016-12-20 15:00:00'),(14,1000000001,'android','2.5.1','n','n','update_url','cs_email','2016-12-20 15:00:00'),(15,1000000001,'ios','2.0.2','y','n','update_url','cs_email','2015-08-03 01:52:57'),(16,1000000001,'ios','2.1.0','y','y','update_url','cs_email','2016-05-04 05:30:28'),(17,1000000001,'ios','2.2.0','y','n','update_url','cs_email','2016-05-29 15:00:00'),(18,1000000001,'ios','2.4.0','y','n','update_url','cs_email','2016-07-11 01:52:57'),(19,1000000001,'ios','2.4.1','y','n','update_url','cs_email','2016-08-28 15:00:00'),(20,1000000001,'ios','2.4.2','y','n','update_url','cs_email','2016-08-28 15:00:00'),(21,1000000001,'ios','2.4.3','y','n','update_url','cs_email','2016-11-27 15:00:00'),(22,1000000001,'ios','2.4.4','y','n','update_url','cs_email','2016-11-27 15:00:00'),(23,1000000001,'ios','2.4.5','y','n','update_url','cs_email','2016-11-27 15:00:00'),(24,1000000001,'ios','2.4.5.1','y','n','update_url','cs_email','2016-12-14 15:00:00'),(25,1000000001,'ios','2.4.6','y','n','update_url','cs_email','2016-12-12 15:00:00'),(26,1000000001,'ios','2.4.7','y','n','update_url','cs_email','2016-12-12 15:00:00'),(27,1000000001,'ios','2.5.0','y','n','update_url','cs_email','2016-12-20 15:00:00'),(28,1000000001,'ios','2.5.1','y','n','update_url','cs_email','2016-12-20 15:00:00'),(43,1000000001,'ios','2.5.6','y','n','update_url','cs_email','2016-12-20 15:00:00');
/*!40000 ALTER TABLE `app_ver_info_tb` ENABLE KEYS */;
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
