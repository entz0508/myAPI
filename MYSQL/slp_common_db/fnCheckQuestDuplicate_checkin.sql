CREATE DEFINER=`root`@`localhost` FUNCTION `fnCheckQuestDuplicate_checkin`(
	accountID BIGINT,
	appID varchar(100),
	questID varchar(50),
	questIDs varchar(1500),
	duplicateUnits varchar(500),
	countRequest int,
	timeZone varchar(30)
) RETURNS int(11)
BEGIN
	
	DECLARE loopIndex int default 1;
	DECLARE loopQuestID varchar(25) DEFAULT '';
	DECLARE loopDuplicateUnit varchar(25) DEFAULT '';
	DECLARE loopLastQuest varchar(25) DEFAULT 'NEW';
	DECLARE isExistCheckinLastDay INT DEFAULT 0;
	DECLARE isExistCheckinLastDay_lastQuest INT DEFAULT 0;
	DECLARE isExistCheckinLastQuestYesterday INT DEFAULT 0;
	DECLARE returnVal INT DEFAULT 1;
	DECLARE checkinQuest_first varchar(25) default 'NEW';
	DECLARE checkinQuest_last varchar(25) default 'NEW';
	
	SET loopIndex = 1;
	
	IF (SELECT	count(seq)
		FROM	slp_common_db.quest_history_tb
		WHERE	account_id = accountID AND
				CONCAT(app_id) in ( SELECT * FROM splitResults ) AND 
				quest_id = questID AND
				time_zone = timeZone AND
				reg_date between DATE_FORMAT(CONVERT_TZ(CURRENT_TIMESTAMP,'Asia/Seoul',timeZone), '%Y-%m-%d 00:00:01') AND DATE_FORMAT(CONVERT_TZ(CURRENT_TIMESTAMP,'Asia/Seoul',timeZone), '%Y-%m-%d 23:59:59')
		> 0) THEN
		
		SET returnVal = 1;
	ELSE 
		WHILE loopIndex < countRequest + 1 DO
			SET loopQuestID = (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(questIDs, ',', loopIndex), ',', -1));
			SET loopDuplicateUnit = (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(duplicateUnits, ',', loopIndex), ',', -1));
			
			IF ( loopDuplicateUnit = 'checkin' ) THEN 
				IF ( checkinQuest_first = 'NEW' ) THEN
					SET checkinQuest_first = loopQuestID;
				END IF;
				
				SET checkinQuest_last = loopQuestID;
				
			END IF;
			SET loopIndex = loopIndex + 1;
			
		END WHILE;
		
		
		SET isExistCheckinLastDay = (SELECT	count(seq)
									 FROM	slp_common_db.quest_history_tb
									 WHERE	account_id = accountID AND
											CONCAT(app_id) in ( SELECT * FROM splitResults ) AND 
											duplicate_unit = 'checkin' AND
											time_zone = timeZone AND
											reg_date between date_add(DATE_FORMAT(CONVERT_TZ(CURRENT_TIMESTAMP,'Asia/Seoul',timeZone), '%Y-%m-%d 00:00:01'), interval -1 day) AND date_add(DATE_FORMAT(CONVERT_TZ(CURRENT_TIMESTAMP,'Asia/Seoul',timeZone), '%Y-%m-%d 23:59:59'), interval -1 day));
		IF ( isExistCheckinLastDay > 0 ) THEN
			SET isExistCheckinLastDay_lastQuest = (	SELECT	count(seq)	
													FROM	slp_common_db.quest_history_tb
													WHERE	account_id = accountID AND 
															CONCAT(app_id) in ( SELECT * FROM splitResults ) AND
															quest_id = checkinQuest_last AND
															time_zone = timeZone AND
															reg_date between date_add(DATE_FORMAT(CONVERT_TZ(CURRENT_TIMESTAMP,'Asia/Seoul',timeZone), '%Y-%m-%d 00:00:01'), interval -1 day) AND date_add(DATE_FORMAT(CONVERT_TZ(CURRENT_TIMESTAMP,'Asia/Seoul',timeZone), '%Y-%m-%d 23:59:59'), interval -1 day));
		END IF;
		
		
		SET loopIndex = 1;
		WHILE loopIndex < countRequest + 1 DO
			SET loopQuestID = (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(questIDs, ',', loopIndex), ',', -1));
			SET loopDuplicateUnit = (SELECT SUBSTRING_INDEX(SUBSTRING_INDEX(duplicateUnits, ',', loopIndex), ',', -1));
			
			IF ( loopQuestID = questID ) THEN								
				IF ( isExistCheckinLastDay > 0 ) THEN						
					IF ( checkinQuest_first = loopQuestID ) THEN			
						IF ( isExistCheckinLastDay_lastQuest > 0 ) THEN		
							SET returnVal = 0;						
						ELSE
							SET returnVal = 1;								
						END IF;
					ELSE													
						SET isExistCheckinLastQuestYesterday = (SELECT	count(seq)
																FROM	slp_common_db.quest_history_tb
																WHERE	account_id = accountID AND
																		CONCAT(app_id) in ( SELECT * FROM splitResults ) AND
																		quest_id = loopLastQuest AND
																		time_zone = timeZone AND
																		reg_date between date_add(DATE_FORMAT(CONVERT_TZ(CURRENT_TIMESTAMP,'Asia/Seoul',timeZone), '%Y-%m-%d 00:00:01'), interval -1 day) AND date_add(DATE_FORMAT(CONVERT_TZ(CURRENT_TIMESTAMP,'Asia/Seoul',timeZone), '%Y-%m-%d 23:59:59'), interval -1 day));
						IF ( isExistCheckinLastQuestYesterday > 0 ) THEN
							SET returnVal = 0;	
						ELSE 
							SET returnVal = 1;	
						END IF;
					END IF;
				ELSE
					IF ( checkinQuest_first = loopQuestID ) THEN				
						SET returnVal = 0;
					ELSE 
						SET returnVal = 1;
					END IF;
				END IF;
				
				SET loopIndex = countRequest + 1;
			ELSE 
				IF ( loopDuplicateUnit = 'checkin' ) THEN 
					SET loopLastQuest = loopQuestID;
				END IF;
				SET loopIndex = loopIndex + 1;
			END IF;
			
		END WHILE;
	END IF;
	
	return returnVal;
END;