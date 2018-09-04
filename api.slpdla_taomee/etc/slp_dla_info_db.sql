/*
SQLyog Community v12.1 (64 bit)
MySQL - 5.6.19-log : Database - slp_dla_info_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`slp_dla_info_db` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `slp_dla_info_db`;

/*Table structure for table `app_res_data_info_tb` */

DROP TABLE IF EXISTS `app_res_data_info_tb`;

CREATE TABLE `app_res_data_info_tb` (
  `OS` enum('android','ios') NOT NULL,
  `LEVEL` enum('1','2','3','4') NOT NULL,
  `VER` varchar(16) NOT NULL,
  `ID` varchar(16) NOT NULL,
  `NAME` varchar(16) NOT NULL,
  `RES_VER` smallint(6) NOT NULL,
  PRIMARY KEY (`OS`,`LEVEL`,`VER`,`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `app_res_data_info_tb` */

insert  into `app_res_data_info_tb`(`OS`,`LEVEL`,`VER`,`ID`,`NAME`,`RES_VER`) values ('android','1','1.0.0','primary_data','res_primary',1),('android','1','1.0.0','sticker','res_sticker',1),('android','1','1.0.0','thumbnail','res_thumbnail',1);

/*Table structure for table `app_res_path_info_tb` */

DROP TABLE IF EXISTS `app_res_path_info_tb`;

CREATE TABLE `app_res_path_info_tb` (
  `OS` enum('android','ios') NOT NULL,
  `LEVEL` enum('1','2','3','4') NOT NULL,
  `VER` varchar(16) NOT NULL,
  `KEY` varchar(32) NOT NULL,
  `PATH` varchar(256) NOT NULL,
  PRIMARY KEY (`OS`,`LEVEL`,`VER`,`KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `app_res_path_info_tb` */

insert  into `app_res_path_info_tb`(`OS`,`LEVEL`,`VER`,`KEY`,`PATH`) values ('android','1','1.0.0','BUNDLE_BASE_URL','https://download.blueark.com/dla/DLA_Assetbundles_DEV_Taiwan/'),('android','1','1.0.0','IMG_SERVER_URL','http://14.63.169.217/images/'),('android','2','1.0.0','BUNDLE_BASE_URL','https://download.blueark.com/dla/DLA_Assetbundles_DEV_Taiwan/'),('android','2','1.0.0','IMG_SERVER_URL','http://14.63.169.217/images/');

/*Table structure for table `app_ver_info_tb` */

DROP TABLE IF EXISTS `app_ver_info_tb`;

CREATE TABLE `app_ver_info_tb` (
  `OS` enum('android','ios') NOT NULL,
  `LEVEL` enum('1','2','3','4') NOT NULL,
  `VER` varchar(16) NOT NULL,
  `VER_SRL` int(11) NOT NULL AUTO_INCREMENT,
  `SUMMIT` enum('n','y') NOT NULL,
  `FORCE_UPDATE` enum('y','n') NOT NULL,
  `UPDATE_URL` varchar(256) NOT NULL,
  `CS_EMAIL` varchar(32) NOT NULL,
  `REG_DATETIME` datetime NOT NULL,
  PRIMARY KEY (`OS`,`LEVEL`,`VER`,`VER_SRL`),
  KEY `VER_SRL` (`VER_SRL`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `app_ver_info_tb` */

insert  into `app_ver_info_tb`(`OS`,`LEVEL`,`VER`,`VER_SRL`,`SUMMIT`,`FORCE_UPDATE`,`UPDATE_URL`,`CS_EMAIL`,`REG_DATETIME`) values ('android','1','1.0.0',1,'n','n','www.update_url.com','cs_email@blueark.com','2015-04-08 17:19:06');

/*Table structure for table `constants_value` */

DROP TABLE IF EXISTS `constants_value`;

CREATE TABLE `constants_value` (
  `KEY` varchar(10) NOT NULL,
  `VALUE` varchar(16) NOT NULL,
  PRIMARY KEY (`KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `constants_value` */

insert  into `constants_value`(`KEY`,`VALUE`) values ('APP_LV','2'),('APP_TYPE','dla_lv2');

/*Table structure for table `ep_info_tb` */

DROP TABLE IF EXISTS `ep_info_tb`;

CREATE TABLE `ep_info_tb` (
  `OS` enum('android','ios') NOT NULL,
  `LEVEL` tinyint(4) NOT NULL,
  `SEQUENCE` tinyint(4) NOT NULL,
  `EP_ID` varchar(10) NOT NULL,
  PRIMARY KEY (`OS`,`LEVEL`,`SEQUENCE`),
  UNIQUE KEY `U_EP_ID` (`EP_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `ep_info_tb` */

/*Table structure for table `ep_ver_info_tb` */

DROP TABLE IF EXISTS `ep_ver_info_tb`;

CREATE TABLE `ep_ver_info_tb` (
  `OS` enum('android','ios') NOT NULL,
  `EPISODE_ID` varchar(10) NOT NULL,
  `UNITY_CODE` varchar(16) NOT NULL,
  `VER` smallint(6) NOT NULL,
  `LAST_UPDATE` datetime NOT NULL,
  `ENABLE` enum('y','n') NOT NULL,
  PRIMARY KEY (`OS`,`EPISODE_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `ep_ver_info_tb` */

/*Table structure for table `user_tb` */

DROP TABLE IF EXISTS `user_tb`;

CREATE TABLE `user_tb` (
  `USER_ID` int(11) NOT NULL AUTO_INCREMENT,
  `CLIENT_UID` varchar(64) NOT NULL,
  `REG_DATETIME` datetime NOT NULL,
  `SIGNUP_OS` enum('android','ios') NOT NULL,
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_tb` */

/* Function  structure for function  `fnGetErrorMessage` */

/*!50003 DROP FUNCTION IF EXISTS `fnGetErrorMessage` */;
DELIMITER $$

/*!50003 CREATE FUNCTION `fnGetErrorMessage`(errorCode int) RETURNS varchar(100) CHARSET utf8
BEGIN
		
		DECLARE errorMSG varchar(100);	
		
		SELECT `MSG` INTO errorMSG FROM `error_code_info_tb` WHERE `CODE`=errorCode LIMIT 1;
		
		IF ( errorMSG is null) OR (0>=LENGTH(errorMSG)) THEN
			SET errorMSG = CONCAT('unknown error, code:', errorCode);
		END IF;
		
		return errorMSG;
		
    END */$$
DELIMITER ;

/* Function  structure for function  `fnGetLastLiveVersion` */

/*!50003 DROP FUNCTION IF EXISTS `fnGetLastLiveVersion` */;
DELIMITER $$

/*!50003 CREATE FUNCTION `fnGetLastLiveVersion`(osType VARCHAR(10), appLevel TINYINT) RETURNS varchar(16) CHARSET utf8
BEGIN
		
		DECLARE appVersion VARCHAR(16);
		
		SELECT `VER` INTO appVersion FROM `app_ver_info_tb` WHERE `OS`=osType AND `LEVEL`=appLevel AND `SUMMIT`='n' ORDER BY `REG_DATETIME` DESC LIMIT 1;
		
		IF (appVersion IS NULL) THEN
			RETURN '';
		ELSE 
			RETURN appVersion;
		END IF;
    END */$$
DELIMITER ;

/* Function  structure for function  `fnIsAppSummitVersion` */

/*!50003 DROP FUNCTION IF EXISTS `fnIsAppSummitVersion` */;
DELIMITER $$

/*!50003 CREATE FUNCTION `fnIsAppSummitVersion`( osType VARCHAR(10), appLevel TINYINT, clientVersion varchar(16)) RETURNS int(11)
BEGIN
		DECLARE isSummit CHAR(1);
		
		SELECT `SUMMIT` INTO isSummit FROM `app_ver_info_tb` WHERE `OS`=osType AND `LEVEL`=appLevel AND `VER`=clientVersion LIMIT 1;
		
		if (isSummit is null) OR ('y'=isSummit)THEN
			return 1;
		ELSE 
			return 0;
		END IF;
		
    END */$$
DELIMITER ;

/* Procedure structure for procedure `spGetAppResData` */

/*!50003 DROP PROCEDURE IF EXISTS  `spGetAppResData` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `spGetAppResData`( osType VARCHAR(10), appLevel TINYINT, clientVersion VARCHAR(16) )
BEGIN
	DECLARE targetVer VARCHAR(16);
	DECLARE isClientSummitVer INT;
	
	SET isClientSummitVer = fnIsAppSummitVersion( osType, appLevel, clientVersion );
	
	
	IF ( 0 = isClientSummitVer ) THEN -- no summit 모드, 라이브 상태
		SET targetVer = fnGetLastLiveVersion(osType, appLevel);
	ELSE
		SET targetVer = clientVersion;
	END IF;	
	
	SELECT res.`ID`, res.`NAME`, res.`RES_VER` AS `VER` FROM `app_res_data_info_tb` AS res WHERE res.`OS`=osType AND res.`LEVEL`=appLevel AND res.`VER`=targetVer;
		
    END */$$
DELIMITER ;

/* Procedure structure for procedure `spGetAppResPath` */

/*!50003 DROP PROCEDURE IF EXISTS  `spGetAppResPath` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `spGetAppResPath`( osType VARCHAR(10), appLevel tinyint, clientVersion VARCHAR(16) )
BEGIN
	DECLARE targetVer VARCHAR(16);
	DECLARE isClientSummitVer INT;
	
	SET isClientSummitVer = fnIsAppSummitVersion( osType, appLevel, clientVersion );
	
	
	IF ( 0 = isClientSummitVer ) THEN -- no summit 모드, 라이브 상태
		SET targetVer = fnGetLastLiveVersion(osType, appLevel);
	ELSE
		SET targetVer = clientVersion;
	END IF;
	
	SELECT path.`KEY`, path.`PATH` FROM `app_res_path_info_tb` AS path WHERE path.`OS`=osType AND path.`LEVEL`=appLevel AND path.`VER`=targetVer;
		
    END */$$
DELIMITER ;

/* Procedure structure for procedure `spGetAppVersion` */

/*!50003 DROP PROCEDURE IF EXISTS  `spGetAppVersion` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `spGetAppVersion`( osType VARCHAR(10), appLevel TINYINT, clientVersion VARCHAR(16) )
BEGIN
	DECLARE targetVer VARCHAR(16);
	DECLARE isClientSummitVer INT;
	
	SET isClientSummitVer = fnIsAppSummitVersion( osType, appLevel, clientVersion );
	
	
	IF ( 0 = isClientSummitVer ) THEN -- no summit 모드, 라이브 상태
		SET targetVer = fnGetLastLiveVersion(osType, appLevel);
	ELSE
		SET targetVer = clientVersion;
	END IF;	
	
	SELECT ver.*, UNIX_TIMESTAMP(NOW()) AS `SERVER_TIME` FROM `app_ver_info_tb` AS ver WHERE ver.`OS`=osType AND ver.`LEVEL`=appLevel AND ver.`VER`=targetVer LIMIT 1;
	
		
    END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
