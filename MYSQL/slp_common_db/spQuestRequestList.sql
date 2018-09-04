DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `spQuestRequestList`(
	accountID BIGINT, 
	appID BIGINT,
	questAppID varchar(1000), 
	questClass varchar(1000), 
	questID varchar(1500), 
	duplicate_unit varchar(1500), 
	starPoint varchar(500),
	timeZoneParam varchar(30),
	countRequest int
)
BEGIN
	DECLARE resCode INT;
	DECLARE errorCode INT;
	DECLARE retQuestID VARCHAR(50);
	DECLARE errorMsg VARCHAR(128);
	DECLARE searchRange DATETIME;
	DECLARE loopIndex int default 1;
	DECLARE loopQuestID varchar(40) DEFAULT '';
	DECLARE loopQuestClass varchar(25) DEFAULT '';
	DECLARE loopQuestAppID varchar(100) DEFAULT '';
	DECLARE loopDuplicateUnit varchar(25) DEFAULT '';
	DECLARE loopDuplicateUnit_lastQuest varchar(40) DEFAULT 'NEW';
	DECLARE loopStarPoint varchar(25) DEFAULT '';
	DECLARE loopTempResult varchar(25) DEFAULT 'disable';
	DECLARE resultArray text DEFAULT '';
	DECLARE timeZone VARCHAR(30) DEFAULT 'Asia/Seoul';
	DECLARE profileCursorCount INT DEFAULT 0;
	DECLARE vProfileID INT DEFAULT 0;
	DECLARE cursorTempProfileJson varchar(500) DEFAULT '';
	DECLARE done INT DEFAULT FALSE;
	DECLARE loopCount INT;
	DECLARE cur1 CURSOR FOR SELECT PROFILE_ID FROM slp_account_db.profile_tb WHERE HIDDEN = 'n' AND DELETED = 'n' AND ACCOUNT_ID = accountID;
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
	DECLARE exit handler for sqlexception
	BEGIN
		ROLLBACK;
		SET resCode = -1;
		SELECT resCode AS `RES`,  'SQLEXCEPTION, `slp_common_db`.`spBuyProduct` ' AS `msg`;
		SHOW ERRORS;
	END;
	DECLARE exit handler for sqlwarning
	BEGIN
		ROLLBACK;
		SET resCode = -1;
		SELECT resCode AS `RES`,  'SQLWARNING, `slp_common_db`.`spBuyProduct` ' AS `msg`;
		SHOW WARNINGS;
	END;

	SET resCode = 0;
	SET errorCode = 0;
	SET errorMsg = "";

	START TRANSACTION;

		SET timeZone = slp_common_db.fnGetFirstTimeZone( accountID, timeZoneParam);

		WHILE loopIndex < countRequest + 1 DO
			SET loopQuestID = (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(questID, ',', loopIndex), ',', -1));
			SET loopQuestClass = (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(questClass, ',', loopIndex), ',', -1));
			SET loopDuplicateUnit = (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(duplicate_unit, ',', loopIndex), ',', -1));
			SET loopStarPoint =  CAST((SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(starPoint, ',', loopIndex), ',', -1)) as CHAR) ;
			SET loopQuestAppID = REPLACE((SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(questAppID, ',', loopIndex), ',', -1)), '|', ',') ;

			call  spUtil_Split_to_row(loopQuestAppID, ',');

			IF ( loopDuplicateUnit = 'once' ) THEN
				SET searchRange = '2016-01-01 00:00:01';
			END IF;

			IF ( loopDuplicateUnit = 'day' ) THEN
				SET searchRange = DATE_FORMAT(CONVERT_TZ(CURRENT_TIMESTAMP,'Asia/Seoul',timeZone), '%Y-%m-%d 00:00:01');
			END IF;

			IF ( loopDuplicateUnit = 'month' ) THEN
				SET searchRange = DATE_FORMAT(CONVERT_TZ(CURRENT_TIMESTAMP,'Asia/Seoul',timeZone), '%Y-%m-01 00:00:01');
			END IF;

			IF ( loopQuestClass = 'account' ) THEN
				IF ( loopDuplicateUnit = 'checkin' ) THEN -- TODO 출석체크 확인부분
					IF ( `fnCheckQuestDuplicate_checkin`( accountID, appID, loopQuestID, questID, duplicate_unit , countRequest, timeZone ) = 0 ) THEN
						SET loopTempResult = 'able';
					ELSE
						SET loopTempResult = 'disable';
					END IF;
				ELSE
					IF (`fnCheckQuestDuplicate`( accountID, appID, 0, searchRange, loopQuestClass, loopQuestID ) = 0 ) THEN
						SET loopTempResult = 'able';
					ELSE
						SET loopTempResult = 'disable';
					END IF;
				END IF;

				SET resultArray = CONCAT( resultArray, '{' );
				SET resultArray = CONCAT( resultArray,  '"questID":"', loopQuestID, '"');
				SET resultArray = CONCAT( resultArray,  ',"class":"account"');
				SET resultArray = CONCAT( resultArray,  ',"available":"', loopTempResult, '"');
				SET resultArray = CONCAT( resultArray,  ',"point":', loopStarPoint);
				SET resultArray = CONCAT( resultArray, '}' );

			END IF;

			IF ( loopQuestClass = 'profile' ) THEN
				SET profileCursorCount = (SELECT count(*) FROM slp_account_db.profile_tb WHERE HIDDEN = 'n' AND DELETED = 'n' AND ACCOUNT_ID = accountID);

				SET resultArray = CONCAT( resultArray, '{' );
				SET resultArray = CONCAT( resultArray,  '"questID":"', loopQuestID, '"');
				SET resultArray = CONCAT( resultArray,  ',"class":"profile"');

				SET done = FALSE;
				SET loopCount = profileCursorCount;

				IF profileCursorCount > 0 THEN
					SET cursorTempProfileJson = '[';
					OPEN cur1;
						read_loop: LOOP
						FETCH cur1 INTO vProfileID ;

							IF done THEN
								LEAVE read_loop;
							END IF;

							IF (`fnCheckQuestDuplicate`( accountID, appID, vProfileID, searchRange, loopQuestClass, loopQuestID) = 0 ) THEN
								SET cursorTempProfileJson = CONCAT(cursorTempProfileJson, '{"profileID":', vProfileID ,',');
								SET cursorTempProfileJson = CONCAT(cursorTempProfileJson, '"avilable":"able"}');
							ELSE
								SET cursorTempProfileJson = CONCAT(cursorTempProfileJson, '{"profileID":', vProfileID ,',');
								SET cursorTempProfileJson = CONCAT(cursorTempProfileJson, '"avilable":"disable"}');
							END IF;

							IF ( loopCount > 1 ) THEN

								SET cursorTempProfileJson = CONCAT(cursorTempProfileJson, ',');
							END IF;

							SET loopCount = loopCount - 1;

						END LOOP;
					CLOSE cur1;

					SET cursorTempProfileJson = CONCAT(cursorTempProfileJson, ']');
					SET resultArray = CONCAT( resultArray,  ',"available":', cursorTempProfileJson);
					SET resultArray = CONCAT( resultArray,  ',"point":', loopStarPoint);
					SET resultArray = CONCAT( resultArray, '}' );
				ELSE

					SET resultArray = CONCAT( resultArray, '{' );
					SET resultArray = CONCAT( resultArray,  '"questID":"', loopQuestID, '"');
					SET resultArray = CONCAT( resultArray,  ',"class":"profile"');
					SET resultArray = CONCAT( resultArray,  ',"available":"disable"');
					SET resultArray = CONCAT( resultArray,  ',"point":', loopStarPoint);
					SET resultArray = CONCAT( resultArray, '}' );
				END IF;

			END IF;

			IF ( loopDuplicateUnit = 'checkin' ) THEN
				SET loopDuplicateUnit_lastQuest = loopQuestID;
			END IF;

			IF ( loopIndex < countRequest ) THEN
				SET resultArray = CONCAT( resultArray, ',' );
			END IF;

			SET loopIndex = loopIndex + 1;
		END WHILE;

	IF (0 = resCode) THEN
		COMMIT;
		SELECT resCode AS `RES`, errorCode AS `CODE`, resultArray AS `MSG`, accountID AS `ACCOUNT_ID`, (SELECT star_point FROM slp_account_db.account_tb WHERE ACCOUNT_ID = accountID) as `ACCOUNT_POINT` ;
	ELSE
		ROLLBACK;
		SET errorMsg = slp_account_db.fnGetAccountDBErrorMessage(resCode);
		SELECT resCode AS `RES`, errorCode AS `CODE`, errorMsg AS `MSG`;
	END IF;

END;;
DELIMITER ;