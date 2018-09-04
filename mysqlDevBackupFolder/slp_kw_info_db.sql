-- MySQL dump 10.13  Distrib 5.5.57, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: slp_kw_info_db
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
INSERT INTO `app_res_tb` VALUES (1000000000,'android','1.0.0','IMAGE_ASSET-1','image_asset',1),(1000000000,'android','1.0.0','IMG_SERVER_URL','http://14.63.169.217/images/sdla/photos/',1),(1000000000,'android','1.0.0','RESOURCE_URL','http://download.blueark.com/dla/platform_resource_qa/',1),(1000000000,'android','1.0.0','TEXT_ASSET-1','text_asset',2),(1000000000,'android','2.0.0','IMAGE_ASSET-1','image_asset',1),(1000000000,'android','2.0.0','IMG_SERVER_URL','http://14.63.169.217/images/sdla/photos/',1),(1000000000,'android','2.0.0','RESOURCE_URL','http://download.blueark.com/dla/platform_resource_qa/',1),(1000000000,'android','2.0.0','TEXT_ASSET-1','text_asset',2);
/*!40000 ALTER TABLE `app_res_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `app_ver_info_tb`
--

DROP TABLE IF EXISTS `app_ver_info_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_ver_info_tb` (
  `APP_ID` bigint(20) NOT NULL,
  `OS` enum('android','ios') NOT NULL,
  `VER` varchar(16) NOT NULL,
  `SUMMIT` enum('n','y') NOT NULL,
  `FORCE_UPDATE` enum('y','n') NOT NULL,
  `UPDATE_URL` varchar(256) NOT NULL,
  `CS_EMAIL` varchar(32) NOT NULL,
  `REG_DATETIME` datetime NOT NULL,
  PRIMARY KEY (`APP_ID`,`OS`,`VER`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_ver_info_tb`
--

LOCK TABLES `app_ver_info_tb` WRITE;
/*!40000 ALTER TABLE `app_ver_info_tb` DISABLE KEYS */;
INSERT INTO `app_ver_info_tb` VALUES (1000000000,'android','1.0.0','n','n','UPDATE_URL','kidswatts_kr@blueark.com','2015-09-16 14:23:54'),(1000000000,'android','1.1.1','n','n','UPDATE_URL','kidswatts_kr@blueark.com','2015-09-16 14:23:54'),(1000000000,'ios','1.0.0','n','n','UPDATE_URL','kidswatts_kr@blueark.com','2015-11-02 16:47:54'),(1000000000,'ios','1.1.0','n','n','UPDATE_URL','kidswatts_kr@blueark.com','2015-11-02 16:47:54');
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

-- Dump completed on 2017-07-24 15:43:39
