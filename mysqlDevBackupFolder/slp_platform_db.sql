-- MySQL dump 10.13  Distrib 5.5.57, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: slp_platform_db
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
-- Table structure for table `app_auth_token_tb`
--

DROP TABLE IF EXISTS `app_auth_token_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `app_auth_token_tb` (
  `APP_ID` bigint(20) NOT NULL,
  `AUTH_TOKEN` varchar(45) NOT NULL,
  `REG_DATETIME` datetime NOT NULL,
  PRIMARY KEY (`APP_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `app_auth_token_tb`
--

LOCK TABLES `app_auth_token_tb` WRITE;
/*!40000 ALTER TABLE `app_auth_token_tb` DISABLE KEYS */;
/*!40000 ALTER TABLE `app_auth_token_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apps_tb`
--

DROP TABLE IF EXISTS `apps_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apps_tb` (
  `APP_ID` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'APP 고유번호\n',
  `DEVELOPER_ID` int(11) NOT NULL COMMENT '개발자 고유 번호\n',
  `API_KEY` varchar(32) NOT NULL COMMENT 'API KEY\n외부에서 API 인증시 사용할 APP API 고유 Key\n\n',
  `PACAKGE_NAME` varchar(128) NOT NULL COMMENT 'package 이름\n',
  `APP_NAME` varchar(64) NOT NULL COMMENT 'APP 이름\n',
  `ICON_URL` varchar(128) NOT NULL,
  `STATUS` tinyint(4) NOT NULL COMMENT '0 : 비활성 상태\n1 : 활성 상태\n',
  `CACHE_IDX` tinyint(4) NOT NULL,
  `REG_DATETIME` datetime NOT NULL COMMENT '등록일',
  PRIMARY KEY (`APP_ID`),
  UNIQUE KEY `APP_ID_UNIQUE` (`APP_ID`),
  UNIQUE KEY `API_KEY_UNIQUE` (`API_KEY`)
) ENGINE=InnoDB AUTO_INCREMENT=1000000008 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apps_tb`
--

LOCK TABLES `apps_tb` WRITE;
/*!40000 ALTER TABLE `apps_tb` DISABLE KEYS */;
INSERT INTO `apps_tb` VALUES (1000000000,3,'1000000000','SLP Kidswatts','SLP Kidswatts','',0,0,'2015-03-05 15:48:01'),(1000000001,3,'1000000001','Dora 영어','Dora 영어','',0,0,'2015-04-27 16:23:21'),(1000000002,3,'1000000002','Dora 전화','Dora 전화','',0,0,'2015-04-27 16:23:21'),(1000000003,3,'1000000003','Dora lv1','Dora lv1','',0,0,'2015-04-27 16:23:21'),(1000000004,3,'1000000004','Dora lv2','Dora lv2','',0,0,'2015-04-27 16:23:21'),(1000000005,3,'1000000005','Dora lv3','Dora lv3','',0,0,'2015-04-27 16:23:21'),(1000000006,3,'1000000006','Dora lv4','Dora lv4','',0,0,'2015-04-27 16:23:21'),(1000000007,3,'1000000007','SLP NDE','SLP NDE','',0,0,'2017-07-24 14:35:46');
/*!40000 ALTER TABLE `apps_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `developer_tb`
--

DROP TABLE IF EXISTS `developer_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `developer_tb` (
  `DEVELOPER_ID` int(11) NOT NULL AUTO_INCREMENT,
  `EMAIL` varchar(128) NOT NULL,
  `PWD` varchar(128) NOT NULL,
  `COMPANY_NAME` varchar(128) NOT NULL,
  `REG_DATETIME` datetime NOT NULL,
  `AUTH_TOKEN` varchar(40) NOT NULL,
  `AUTH_IP` varchar(40) NOT NULL,
  `AUTH_DATETIME` datetime NOT NULL,
  PRIMARY KEY (`DEVELOPER_ID`),
  UNIQUE KEY `U_EMAIL` (`EMAIL`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `developer_tb`
--

LOCK TABLES `developer_tb` WRITE;
/*!40000 ALTER TABLE `developer_tb` DISABLE KEYS */;
INSERT INTO `developer_tb` VALUES (1,'bae@blueark.com','sTeoVVWPFbp3B23HlSLQy0TmXNRNGG3tuah/k8wOCZ+K3BL/wn2JeygjVDlr1csS87lLhlGg1Io64yLgrnRCRg==','bae','2016-12-28 16:29:47','','','2016-12-28 16:29:47');
/*!40000 ALTER TABLE `developer_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `error_code_info_tb`
--

DROP TABLE IF EXISTS `error_code_info_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `error_code_info_tb` (
  `CODE` int(11) NOT NULL,
  `MSG` varchar(100) NOT NULL,
  PRIMARY KEY (`CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `error_code_info_tb`
--

LOCK TABLES `error_code_info_tb` WRITE;
/*!40000 ALTER TABLE `error_code_info_tb` DISABLE KEYS */;
INSERT INTO `error_code_info_tb` VALUES (100,'이미 존재하는 개발자 이메일'),(101,'개발자 계정 생성 실패');
/*!40000 ALTER TABLE `error_code_info_tb` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_app_tb`
--

DROP TABLE IF EXISTS `service_app_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `service_app_tb` (
  `APP_ID` bigint(20) DEFAULT NULL,
  `APP_NAME` varchar(128) DEFAULT NULL,
  `ICON_URL` varchar(256) DEFAULT NULL,
  `PACKAGE_NAME` varchar(32) DEFAULT NULL,
  `SCHEME` varchar(45) DEFAULT NULL,
  `IOS_STORE_URL` varchar(256) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_app_tb`
--

LOCK TABLES `service_app_tb` WRITE;
/*!40000 ALTER TABLE `service_app_tb` DISABLE KEYS */;
INSERT INTO `service_app_tb` VALUES (1000000001,'도라의 영어 모험','','com.bluearkedu.dla.english','slpen','https://itunes.apple.com/kr/app/kakaotog-kakaotalk/id362057947?mt=8'),(1000000000,'키즈와츠','','com.bluearkedu.kidswatts','kwkr','https://itunes.apple.com/kr/app/kakaotog-kakaotalk/id362057947?mt=8');
/*!40000 ALTER TABLE `service_app_tb` ENABLE KEYS */;
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
