/*
SQLyog Community v12.1 (64 bit)
MySQL - 5.6.19-log : Database - slp_dla_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`slp_dla_db` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `slp_dla_db`;

/*Table structure for table `constans_number_tb` */

DROP TABLE IF EXISTS `constans_number_tb`;

CREATE TABLE `constans_number_tb` (
  `KEY` varchar(32) NOT NULL,
  `VALUE` int(11) NOT NULL,
  PRIMARY KEY (`KEY`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `constans_number_tb` */

insert  into `constans_number_tb`(`KEY`,`VALUE`) values ('CLIENT_AUTH_LIMIT',5),('MIN_INT',-9999999);

/*Table structure for table `error_code_info_tb` */

DROP TABLE IF EXISTS `error_code_info_tb`;

CREATE TABLE `error_code_info_tb` (
  `CODE` int(11) NOT NULL,
  `MSG` varchar(100) NOT NULL,
  PRIMARY KEY (`CODE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `error_code_info_tb` */

insert  into `error_code_info_tb`(`CODE`,`MSG`) values (-400100,'이 clientUID 는 이미 게스트 ID가 존재함');

/*Table structure for table `guest_client_uid_tb` */

DROP TABLE IF EXISTS `guest_client_uid_tb`;

CREATE TABLE `guest_client_uid_tb` (
  `USER_ID` int(11) NOT NULL,
  `OS` enum('android','ios') NOT NULL,
  `CLIENT_UID` varchar(64) NOT NULL,
  PRIMARY KEY (`USER_ID`,`OS`,`CLIENT_UID`),
  UNIQUE KEY `U_CLIENT_UID` (`CLIENT_UID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `guest_client_uid_tb` */

insert  into `guest_client_uid_tb`(`USER_ID`,`OS`,`CLIENT_UID`) values (2,'android','123456'),(1,'android','1234567'),(3,'android','12345678'),(4,'android','1430210947'),(5,'android','1430210963'),(6,'android','1430211923'),(10,'android','1430211924');

/*Table structure for table `user_access_token_tb` */

DROP TABLE IF EXISTS `user_access_token_tb`;

CREATE TABLE `user_access_token_tb` (
  `USER_ID` int(11) NOT NULL,
  `OS` enum('android','ios') NOT NULL,
  `CLIENT_UID` varchar(64) NOT NULL,
  `ACCESS_TOKEN` varchar(40) NOT NULL,
  `SLP_ACCESS_TOKEN` varchar(40) NOT NULL,
  `REG_DATETIME` datetime NOT NULL,
  PRIMARY KEY (`USER_ID`,`OS`,`CLIENT_UID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_access_token_tb` */

insert  into `user_access_token_tb`(`USER_ID`,`OS`,`CLIENT_UID`,`ACCESS_TOKEN`,`SLP_ACCESS_TOKEN`,`REG_DATETIME`) values (2,'android','123456','96855a75e835722526974a35fbc20662355e6f2f','','2015-04-27 19:02:35'),(6,'android','1430211923','9ef81e5d7686ee081d8c76979301fb4fd5bad4a1','26c3d323d7571d5c57e6c95a4d4bee404627ef4d','2015-05-08 14:17:00');

/*Table structure for table `user_slp_account_tb` */

DROP TABLE IF EXISTS `user_slp_account_tb`;

CREATE TABLE `user_slp_account_tb` (
  `USER_ID` int(11) NOT NULL,
  `SLP_ACCOUNT_ID` bigint(20) NOT NULL,
  `OS` enum('android','ios') NOT NULL,
  `REG_DATETIME` datetime NOT NULL,
  PRIMARY KEY (`USER_ID`),
  UNIQUE KEY `U_SLP_ACCOUNT_ID` (`SLP_ACCOUNT_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_slp_account_tb` */

insert  into `user_slp_account_tb`(`USER_ID`,`SLP_ACCOUNT_ID`,`OS`,`REG_DATETIME`) values (6,100000097,'android','2015-05-07 16:23:56'),(9,100000096,'android','2015-04-28 18:56:35'),(10000,0,'android','2015-04-27 16:31:03');

/*Table structure for table `user_tb` */

DROP TABLE IF EXISTS `user_tb`;

CREATE TABLE `user_tb` (
  `USER_ID` int(11) NOT NULL AUTO_INCREMENT,
  `SIGNUP_OS` enum('android','ios') NOT NULL,
  `GUEST` enum('y','n') NOT NULL,
  `DELETED` enum('n','y') NOT NULL DEFAULT 'n',
  `REG_DATETIME` datetime NOT NULL,
  PRIMARY KEY (`USER_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=100000 DEFAULT CHARSET=utf8;

/*Data for the table `user_tb` */

insert  into `user_tb`(`USER_ID`,`SIGNUP_OS`,`GUEST`,`DELETED`,`REG_DATETIME`) values (1,'android','y','n','2015-04-27 16:41:19'),(2,'android','y','n','2015-04-27 16:42:23'),(3,'android','y','n','2015-04-28 17:48:40'),(4,'android','y','n','2015-04-28 17:49:17'),(5,'android','y','n','2015-04-28 18:02:14'),(6,'android','n','n','2015-04-28 18:05:28'),(9,'android','n','n','2015-04-28 18:56:35'),(10,'android','y','n','2015-05-07 18:26:07');

/* Function  structure for function  `fnGetConstantNumber` */

/*!50003 DROP FUNCTION IF EXISTS `fnGetConstantNumber` */;
DELIMITER $$

/*!50003 CREATE FUNCTION `fnGetConstantNumber`( keyName varchar(32) ) RETURNS int(11)
BEGIN
		DECLARE retv int;
		SELECT `VALUE` INTO retv FROM `constans_number_tb` WHERE `KEY`=keyName LIMIT 1;
		
		if ( retv is null) THEN
			SELECT `VALUE` INTO retv FROM `constans_number_tb` WHERE `KEY`='MIN_INT' LIMIT 1;
		END IF;
		
		return retv;
    END */$$
DELIMITER ;

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

/* Function  structure for function  `fnGetGuestFlag` */

/*!50003 DROP FUNCTION IF EXISTS `fnGetGuestFlag` */;
DELIMITER $$

/*!50003 CREATE FUNCTION `fnGetGuestFlag`(userID int) RETURNS char(1) CHARSET utf8
BEGIN
		DECLARE isGuest CHAR(1);
		
		SELECT `GUEST` INTO isGuest FROM `user_tb` WHERE `USER_ID`=userID AND `DELETED`='n' LIMIT 1;
		
		IF (isGuest is null) THEN
			SET isGuest = 'u';
		END IF;
		
		return isGuest;
		
				
    END */$$
DELIMITER ;

/* Function  structure for function  `fnGetNewAccessToken` */

/*!50003 DROP FUNCTION IF EXISTS `fnGetNewAccessToken` */;
DELIMITER $$

/*!50003 CREATE FUNCTION `fnGetNewAccessToken`(userID int) RETURNS varchar(40) CHARSET utf8
BEGIN	
		RETURN SHA1(CONCAT( CONCAT(userID, UNIX_TIMESTAMP(NOW())), UUID() ));
    END */$$
DELIMITER ;

/* Function  structure for function  `fnGetUserSlpAccountID` */

/*!50003 DROP FUNCTION IF EXISTS `fnGetUserSlpAccountID` */;
DELIMITER $$

/*!50003 CREATE FUNCTION `fnGetUserSlpAccountID`(userID int) RETURNS bigint(20)
BEGIN
		DECLARE slpAccountID bigint;
		
		SELECT `SLP_ACCOUNT_ID` INTO slpAccountID FROM `user_slp_account_tb` WHERE `USER_ID`=userID LIMIT 1;
		
		IF (slpAccountID is null) THEN
			SET slpAccountID = 0;
		END IF;
		
		return slpAccountID;		
				
    END */$$
DELIMITER ;

/* Function  structure for function  `fnIsLoggedInUser` */

/*!50003 DROP FUNCTION IF EXISTS `fnIsLoggedInUser` */;
DELIMITER $$

/*!50003 CREATE FUNCTION `fnIsLoggedInUser`( appID BIGINT, osType VARCHAR(15), clientUID VARCHAR(64), 
																userID INT, userAccessToken VARCHAR(40),
																slpAccountID BIGINT, slpAccountAccessToken VARCHAR(40) ) RETURNS int(11)
BEGIN
		
		DECLARE retv int;
		DECLARE tmpSlpAccountID INT;
		DECLARE isGuest CHAR;
		
		SELECT `GUEST` INTO isGuest FROM `user_tb` WHERE `USER_ID`=userID AND `DELETED`='n' LIMIT 1;
		
		if (isGuest is null) THEN
			SET retv = 0;
		ELSEIF ('y' = isGuest) THEN
			
			SELECT COUNT(`USER_ID`) INTO retv FROM `user_access_token_tb` 
			WHERE `USER_ID`=userID AND `OS`=osType AND `CLIENT_UID`=clientUID AND `ACCESS_TOKEN`=userAccessToken LIMIT 1;
			
		ELSEIF ('n' = isGuest) THEN
			
			SELECT COUNT(`USER_ID`) INTO retv FROM `user_access_token_tb` 
			WHERE `USER_ID`=userID AND `OS`=osType AND `CLIENT_UID`=clientUID AND `ACCESS_TOKEN`=userAccessToken AND `SLP_ACCESS_TOKEN`=slpAccountAccessToken LIMIT 1;
			
			IF (retv is not null) AND (0 < retv) THEN
				SELECT `SLP_ACCOUNT_ID` INTO tmpSlpAccountID FROM `user_slp_account_tb` WHERE `USER_ID`=userID LIMIT 1;
				IF (tmpSlpAccountID IS NOT NULL) AND (0 < tmpSlpAccountID) THEN
					IF (tmpSlpAccountID != slpAccountID) THEN
						SET retv = 0;
					END IF;
				END IF;
			END IF;
			
		ELSE
			SET retv = 0;
		END IF;
		return retv;
		
    END */$$
DELIMITER ;

/* Function  structure for function  `fnUpdateAccessToken` */

/*!50003 DROP FUNCTION IF EXISTS `fnUpdateAccessToken` */;
DELIMITER $$

/*!50003 CREATE FUNCTION `fnUpdateAccessToken`(userID INT, osType VARCHAR(10), clientUID VARCHAR(64), slpAccessToken varchar(40) ) RETURNS varchar(40) CHARSET utf8
BEGIN
		DECLARE cnt INT;
		DECLARE accessToken VARCHAR(40);
		DECLARE clientLimit INT;
		DECLARE oldDatatime DATETIME;
		
		SET accessToken = `fnGetNewAccessToken`(userID);
		
		SELECT COUNT(`USER_ID`) INTO cnt FROM `user_access_token_tb` WHERE `USER_ID`=userID AND `OS`=osType AND `CLIENT_UID`=clientUID LIMIT 1;
		IF (cnt IS NULL) OR (0 >= cnt) THEN
			INSERT INTO `user_access_token_tb`(`USER_ID`,`OS`,`CLIENT_UID`,`ACCESS_TOKEN`,`SLP_ACCESS_TOKEN`,`REG_DATETIME`) 
			VALUES(userID, osType, clientUID, accessToken, slpAccessToken, NOW());
		ELSE
			UPDATE `user_access_token_tb` SET `ACCESS_TOKEN`=accessToken, `REG_DATETIME`=NOW(), `SLP_ACCESS_TOKEN`=slpAccessToken 
			WHERE `USER_ID`=userID AND `OS`=osType AND `CLIENT_UID`=clientUID;
		END IF;
		
		
		SET clientLimit = `fnGetConstantNumber`('CLIENT_AUTH_LIMIT');
		SET cnt = 0;
		SELECT COUNT(`USER_ID`) INTO cnt FROM `user_access_token_tb` WHERE `USER_ID`=userID AND `CLIENT_UID`=clientUID LIMIT 1;
		IF (cnt IS NOT NULL) AND (clientLimit<cnt) THEN	
			SELECT `REG_DATETIME` INTO oldDatatime FROM `user_access_token_tb` WHERE `USER_ID`=userID AND `CLIENT_UID`=clientUID ORDER BY `REG_DATETIME` DESC LIMIT 1;						
			DELETE FROM `user_access_token_tb` WHERE `USER_ID`=userID AND `CLIENT_UID`=clientUID AND `REG_DATETIME`=oldDatatime;
		END IF;
		
		RETURN accessToken;
    END */$$
DELIMITER ;

/* Procedure structure for procedure `spConversion` */

/*!50003 DROP PROCEDURE IF EXISTS  `spConversion` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `spConversion`(appID BIGINT, osType VARCHAR(15), clientUID VARCHAR(64), 
															userID int, userAccessToken VARCHAR(40), 
															slpAccountID BIGINT, slpUserAccessToken VARCHAR(40))
BEGIN
    
		DECLARE resCode INT;
		DECLARE isLoggedInUser INT;
		DECLARE guestFlag CHAR(1);
		DECLARE tmpSlpAccountID BIGINT;	
	
		
		
		DECLARE EXIT HANDLER FOR SQLEXCEPTION 
		BEGIN
			ROLLBACK;
			
			SET resCode = -997;
			-- mysql 5.5.*
			SELECT resCode AS `RES`, 'slp_dla_db.spConversion '  AS `MSG`;
			SHOW ERRORS;
			
			-- mysql 5.6 이상.
			-- GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;			
			-- SELECT result AS `res`, CONCAT(CONCAT(CONCAT('SQLEXCEPTION, spShopPurchaseSinglEPGoogleConsume ', @sqlstate), @errno), @text)  AS `msg`;
		END;
		
		START TRANSACTION;
			SET resCode = 0;
			
			SET isLoggedInUser = `fnIsLoggedInUser`(appID, osType, clientUID, userID, userAccessToken, slpAccountID, slpUserAccessToken);
			if (0 >= isLoggedInUser) THEN
				SET resCode = -400113;
			END IF;
			
			
			IF (0 = resCode) THEN
				SET guestFlag = `fnGetGuestFlag`(userID);
				if (guestFlag is null) or ('y' != guestFlag) THEN
					SET resCode = -400114;
				END IF;
			END IF;
			
			IF (0 = resCode) THEN
				SET tmpSlpAccountID = `fnGetUserSlpAccountID`(userID);
				if (tmpSlpAccountID is not null) AND (0 < tmpSlpAccountID) THEN
					SET resCode = -400115;
				END IF;
			END IF;
			
			
			IF (0 = resCode) THEN
				INSERT INTO `user_slp_account_tb`(`USER_ID`,`SLP_ACCOUNT_ID`,`OS`,`REG_DATETIME`) VALUES(userID,slpAccountID,osType,NOW());
				
				SET tmpSlpAccountID = fnGetUserSlpAccountID(userID);
				IF (tmpSlpAccountID IS NULL) OR (0 >= tmpSlpAccountID) THEN
					SET resCode = -400116;
				ELSE 
					SET guestFlag = 'y';
					UPDATE `user_tb` SET `GUEST`='n' WHERE `USER_ID`=userID;
					SET guestFlag = `fnGetGuestFlag`(userID);
					IF (guestFlag IS NULL) OR ('n' != guestFlag) THEN
						SET resCode = -400114;
					END IF;
				END IF;
			END IF;
		
		IF (0 = resCode)	 THEN
			COMMIT;
			SELECT resCode AS `RES`, userID AS `USER_ID`, slpAccountID AS `SLP_ACCOUNT_ID`, guestFlag AS `GUEST`;
		ELSE
			ROLLBACK;
			SELECT resCode AS `RES`, fnGetErrorMessage(resCode) AS MSG;
		END IF;
		
    END */$$
DELIMITER ;

/* Procedure structure for procedure `spCreateUser` */

/*!50003 DROP PROCEDURE IF EXISTS  `spCreateUser` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `spCreateUser`(appLevel INT, osType VARCHAR(15), clientUID VARCHaR(64), slpAccountID BIGINT)
BEGIN
    
		DECLARE result INT;
		DECLARE userID INT;
		DECLARE guestCount INT;
		DECLARE guestMode CHAR(1);
		DECLARE slpAccountCount INT;
		
		
		DECLARE EXIT HANDLER FOR SQLEXCEPTION 
		BEGIN
			ROLLBACK;
			
			SET result = -997;
			-- mysql 5.5.*
			SELECT result AS `RES`, 'spCreateUserGuest '  AS `MSG`;
			SHOW ERRORS;
			
			-- mysql 5.6 이상.
			-- GET DIAGNOSTICS CONDITION 1 @sqlstate = RETURNED_SQLSTATE, @errno = MYSQL_ERRNO, @text = MESSAGE_TEXT;			
			-- SELECT result AS `res`, CONCAT(CONCAT(CONCAT('SQLEXCEPTION, spShopPurchaseSinglEPGoogleConsume ', @sqlstate), @errno), @text)  AS `msg`;
		END;
		
		START TRANSACTION;
			SET result = 0;
			
			if (0 >= slpAccountID) THEN
				-- 게스트 계정 생성 여부 확인
				SET guestMode = 'y'; 
				SELECT `USER_ID` INTO userID FROM `guest_client_uid_tb` WHERE `CLIENT_UID`=clientUID LIMIT 1;
				IF (userID IS NOT NULL) AND (0 < userID) THEN
					SET result = -400100;
				END IF;
			ELSE
				SET guestMode = 'n';
				SELECT `USER_ID` INTO userID FROM `user_slp_account_tb` WHERE `SLP_ACCOUNT_ID`=slpAccountID LIMIT 1;
				IF (userID IS NOT NULL) AND (0 < userID) THEN
					SET result = -400104;
				END IF;
			END IF;
			
			
			if (0 = result) THEN
				SET userID = 0;
				INSERT INTO `user_tb`(`SIGNUP_OS`,`GUEST`,`REG_DATETIME`) VALUES(osType, guestMode, NOW());
				SET userID = LAST_INSERT_ID();
				IF (userID IS NULL) or (0 > userID) THEN
					SET result = -400101;
				END IF;
			END IF;
			
			IF (0 = result) AND ('y' = guestMode) THEN
				INSERT INTO `guest_client_uid_tb`(`USER_ID`,`CLIENT_UID`,`OS`) VALUES(userID, clientUID, osType);
				SELECT COUNT(`USER_ID`) INTO guestCount FROM `guest_client_uid_tb` WHERE `USER_ID`=userID LIMIT 1;
				IF (guestCount IS NULL) OR (0 >= guestCount) THEN
					SET result = -400102;
				END IF;
			END IF;
				
			IF (0 = result) AND (0 < slpAccountID) THEN
				INSERT INTO `user_slp_account_tb`(`USER_ID`,`SLP_ACCOUNT_ID`,`REG_DATETIME`) VALUES(userID, slpAccountID, NOW());
				SELECT COUNT(`USER_ID`) INTO slpAccountCount FROM `user_slp_account_tb` WHERE `USER_ID`=userID AND `SLP_ACCOUNT_ID`=slpAccountID  LIMIT 1;
				IF (slpAccountCount IS NULL) OR (0 >= slpAccountCount) THEN
					SET result = -400103;
				END IF;
			END IF;
		
		IF (0 = result)	 THEN
			COMMIT;
			SELECT result AS `RES`, userID AS `USER_ID`, slpAccountID AS `SLP_ACCOUNT_ID`, guestMode AS `GUEST`;
		ELSE
			ROLLBACK;
			SELECT result AS `RES`, fnGetErrorMessage(result) AS MSG;
		END IF;
		
    END */$$
DELIMITER ;

/* Procedure structure for procedure `spIsLoggedIn` */

/*!50003 DROP PROCEDURE IF EXISTS  `spIsLoggedIn` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `spIsLoggedIn`(appID BIGINT, osType VARCHAR(15), clientUID VARCHAR(64), 
															userID INT, userAccessToken VARCHAR(40),
															slpAccountID BIGINT, slpAccountAccessToken VARCHAR(40) )
BEGIN
    
		DECLARE resCode INT;
		DECLARE isLoggedIn INT;
		DECLARE isGuest CHAR(1);
		
		SET resCode = 0;
		SET isLoggedIn = `fnIsLoggedInUser`(appID, osType, clientUID, userID, userAccessToken,slpAccountID,slpAccountAccessToken);
		if (isLoggedIn is null) OR (0 >= isLoggedIn) THEN
			SET resCode = -400113;
		END IF;
		
		IF (0 = resCode) THEN
			SELECT resCode AS `RES`, isLoggedIn AS `IS_LOGGED_IN`;
		ELSE
			SELECT resCode AS `RES`, fnGetErrorMessage(resCode) AS `MSG`;
		END IF;
		
		
    END */$$
DELIMITER ;

/* Procedure structure for procedure `spLogin` */

/*!50003 DROP PROCEDURE IF EXISTS  `spLogin` */;

DELIMITER $$

/*!50003 CREATE PROCEDURE `spLogin`(appID BIGINT, osType VARCHAR(15), clientUID VARCHAR(64), isGuest TINYINT, slpAccountID BIGINT, slpAccessToken VARCHAR(40))
BEGIN
    
		DECLARE resCode INT;
		DECLARE userID INT;
		DECLARE guestCount INT;
		DECLARE accessToken VARCHAR(40);
		DECLARE slpCount INT;
		DECLARE tmpSlpAccountID BIGINT;
		DECLARE guestFlag CHAR(1);
		
		
		SET userID = 0;
		SET resCode = 0;
		
		
		IF (1 = isGuest) THEN
			SET slpAccessToken = '';
			SELECT `USER_ID` INTO userID FROM `guest_client_uid_tb` WHERE `OS`=osType AND `CLIENT_UID`=clientUID LIMIT 1;
			IF (userID is NULL) OR (0 >= userID) THEN
				SET resCode = -400110;
			ELSE
				SET guestFlag = fnGetGuestFlag(userID);
				IF (guestFlag is NULL) THEN
					SET resCode = -400117;
				ELSEIF (guestFlag IS NOT NULL) AND ('y'!=guestFlag) THEN	
					SET resCode = -400118;
				ELSE
					SELECT `SLP_ACCOUNT_ID` INTO tmpSlpAccountID FROM `user_slp_account_tb` WHERE `USER_ID`=userID LIMIT 1;
					IF (tmpSlpAccountID IS NOT NULL) AND (0 < tmpSlpAccountID) THEN
						SET resCode = -400118;
					END IF;
				END IF;			
			END IF;
		ELSE
			IF (slpAccessToken is NOT null) AND (40=LENGTH(slpAccessToken)) THEN
				SELECT `USER_ID` INTO userID FROM `user_slp_account_tb` WHERE `SLP_ACCOUNT_ID`=slpAccountID LIMIT 1;
				IF (userID IS NULL) OR (0 >= userID) THEN
					SET resCode = -400111;
				ELSE
					SET guestFlag = fnGetGuestFlag(userID);
					IF (guestFlag IS NULL) THEN
						SET resCode = -400117;
					ELSEIF (guestFlag IS NOT NULL) AND ('n'!=guestFlag) THEN	
						SET resCode = -400118;
					ELSE
						SET resCode = 0;
					END IF;
				END IF;
			ELSE
				SET resCode = -400111;
			END IF;
		END IF;
		
		IF (0 = resCode) THEN
			SET accessToken = `fnUpdateAccessToken`(userID,osType,clientUID,slpAccessToken);
			IF (accessToken IS NULL) THEN
				SET resCode = -400112;
			END IF;
		END IF;
		
		IF (0 != resCode) THEN
			SET userID = 0;
			SET accessToken = '';
			SET slpAccountID = 0;
			SET slpAccessToken = '';
		END IF;
		
		SELECT resCode AS `RES`, `fnGetErrorMessage`(resCode) AS `MSG`, userID AS `USER_ID`, accessToken AS `USER_ACCESS_TOKEN`, isGuest AS `GUEST`, slpAccountID AS `SLP_ACCOUNT_ID` ;	
		
    END */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
