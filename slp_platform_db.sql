-- MySQL dump 10.13  Distrib 5.5.59, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: slp_platform_db
-- ------------------------------------------------------
-- Server version	5.5.59-0ubuntu0.14.04.1-log

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
-- Table structure for table `country_tb`
--

DROP TABLE IF EXISTS `country_tb`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `country_tb` (
  `country_name_kr` varchar(100) DEFAULT NULL,
  `country_name` varchar(100) DEFAULT NULL,
  `iso_cd` varchar(2) NOT NULL DEFAULT '',
  `iso_3_cd` varchar(3) DEFAULT NULL,
  `country_cd` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`iso_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `country_tb`
--

LOCK TABLES `country_tb` WRITE;
/*!40000 ALTER TABLE `country_tb` DISABLE KEYS */;
INSERT INTO `country_tb` VALUES ('안도라','Andorra','AD','AND','376'),('아랍 에미리트','United Arab Emirates','AE','ARE','971'),('아프가니스탄','Afghanistan','AF','AFG','93'),('앤티가 바부다','Antigua and Barbuda','AG','ATG','1 268'),('앵 귈라','Anguilla','AI','AIA','1 264'),('알바니아','Albania','AL','ALB','355'),('아르메니아','Armenia','AM','ARM','374'),('네덜란드령 앤틸리스','Netherlands Antilles','AN','ANT','599'),('앙골라','Angola','AO','AGO','244'),('남극 대륙','Antarctica','AQ','ATA','672'),('아르헨티나','Argentina','AR','ARG','54'),('아메리칸 사모아','American Samoa','AS','ASM','1 684'),('오스트리아','Austria','AT','AUT','43'),('호주','Australia','AU','AUS','61'),('아루바','Aruba','AW','ABW','297'),('아제르바이잔','Azerbaijan','AZ','AZE','994'),('보스니아 헤르체고비나','Bosnia and Herzegovina','BA','BIH','387'),('바베이도스','Barbados','BB','BRB','1 246'),('방글라데시','Bangladesh','BD','BGD','880'),('벨기에','Belgium','BE','BEL','32'),('부르 키나 파소','Burkina Faso','BF','BFA','226'),('불가리아','Bulgaria','BG','BGR','359'),('바레인','Bahrain','BH','BHR','973'),('부룬디','Burundi','BI','BDI','257'),('베냉','Benin','BJ','BEN','229'),('생 바르 텔레 미','Saint Barthelemy','BL','BLM','590'),('버뮤다','Bermuda','BM','BMU','1 441'),('브루나이','Brunei','BN','BRN','673'),('볼리비아','Bolivia','BO','BOL','591'),('브라질','Brazil','BR','BRA','55'),('바하마','Bahamas','BS','BHS','1 242'),('부탄','Bhutan','BT','BTN','975'),('보츠와나','Botswana','BW','BWA','267'),('벨라루스','Belarus','BY','BLR','375'),('벨리즈','Belize','BZ','BLZ','501'),('캐나다','Canada','CA','CAN','1'),('코코스 제도','Cocos (Keeling) Islands','CC','CCK','61'),('콩고 민주 공화국','Democratic Republic of the Congo','CD','COD','243'),('중앙 아프리카 공화국','Central African Republic','CF','CAF','236'),('콩고 공화국','Republic of the Congo','CG','COG','242'),('스위스','Switzerland','CH','CHE','41'),('코트디부아르','Ivory Coast','CI','CIV','225'),('쿡 제도','Cook Islands','CK','COK','682'),('칠레','Chile','CL','CHL','56'),('카메룬','Cameroon','CM','CMR','237'),('중국','China','CN','CHN','86'),('콜롬비아','Colombia','CO','COL','57'),('코스타리카','Costa Rica','CR','CRC','506'),('쿠바','Cuba','CU','CUB','53'),('카보 베르데','Cape Verde','CV','CPV','238'),('크리스마스 섬','Christmas Island','CX','CXR','61'),('키프로스','Cyprus','CY','CYP','357'),('체코','Czech Republic','CZ','CZE','420'),('독일','Germany','DE','DEU','49'),('지부티','Djibouti','DJ','DJI','253'),('덴마크','Denmark','DK','DNK','45'),('도미니카','Dominica','DM','DMA','1 767'),('도미니카 공화국','Dominican Republic','DO','DOM','1 809'),('알제리','Algeria','DZ','DZA','213'),('에콰도르','Ecuador','EC','ECU','593'),('에스토니아','Estonia','EE','EST','372'),('이집트','Egypt','EG','EGY','20'),('서부 사하라','Western Sahara','EH','ESH','212'),('에리트레아','Eritrea','ER','ERI','291'),('스페인','Spain','ES','ESP','34'),('에티오피아','Ethiopia','ET','ETH','251'),('핀란드','Finland','FI','FIN','358'),('피지','Fiji','FJ','FJI','679'),('포클랜드 제도','Falkland Islands','FK','FLK','500'),('마이크로 네시아','Micronesia','FM','FSM','691'),('페로 제도','Faroe Islands','FO','FRO','298'),('프랑스','France','FR','FRA','33'),('가봉','Gabon','GA','GAB','241'),('연합 왕국','United Kingdom','GB','GBR','44'),('그레나다','Grenada','GD','GRD','1 473'),('그루지야','Georgia','GE','GEO','995'),('가나','Ghana','GH','GHA','233'),('지브롤터','Gibraltar','GI','GIB','350'),('그린란드','Greenland','GL','GRL','299'),('감비아','Gambia','GM','GMB','220'),('기니','Guinea','GN','GIN','224'),('적도 기니','Equatorial Guinea','GQ','GNQ','240'),('그리스','Greece','GR','GRC','30'),('과테말라','Guatemala','GT','GTM','502'),('괌','Guam','GU','GUM','1 671'),('기니 비사우','Guinea-Bissau','GW','GNB','245'),('가이아나','Guyana','GY','GUY','592'),('홍콩','Hong Kong','HK','HKG','852'),('온두라스','Honduras','HN','HND','504'),('크로아티아','Croatia','HR','HRV','385'),('아이티','Haiti','HT','HTI','509'),('헝가리','Hungary','HU','HUN','36'),('인도네시아','Indonesia','ID','IDN','62'),('아일랜드','Ireland','IE','IRL','353'),('이스라엘','Israel','IL','ISR','972'),('맨 섬','Isle of Man','IM','IMN','44'),('인도','India','IN','IND','91'),('영국령 인도양 지역','British Indian Ocean Territory','IO','IOT',''),('이라크','Iraq','IQ','IRQ','964'),('이란','Iran','IR','IRN','98'),('아이슬란드','Iceland','IS','IS','354'),('이탈리아','Italy','IT','ITA','39'),('저지','Jersey','JE','JEY',''),('자메이카','Jamaica','JM','JAM','1 876'),('요르단','Jordan','JO','JOR','962'),('일본','Japan','JP','JPN','81'),('케냐','Kenya','KE','KEN','254'),('키르기스스탄','Kyrgyzstan','KG','KGZ','996'),('캄보디아','Cambodia','KH','KHM','855'),('키리바시','Kiribati','KI','KIR','686'),('코모로','Comoros','KM','COM','269'),('세인트 키츠 네비스','Saint Kitts and Nevis','KN','KNA','1 869'),('북한','North Korea','KP','PRK','850'),('대한민국','South Korea','KR','KOR','82'),('쿠웨이트','Kuwait','KW','KWT','965'),('케이맨 제도','Cayman Islands','KY','CYM','1 345'),('카자흐스탄','Kazakhstan','KZ','KAZ','7'),('라오스','Laos','LA','LAO','856'),('레바논','Lebanon','LB','LBN','961'),('세인트 루시아','Saint Lucia','LC','LCA','1 758'),('리히텐슈타인','Liechtenstein','LI','LIE','423'),('스리랑카','Sri Lanka','LK','LKA','94'),('라이베리아','Liberia','LR','LBR','231'),('레소토','Lesotho','LS','LSO','266'),('리투아니아','Lithuania','LT','LTU','370'),('룩셈부르크','Luxembourg','LU','LUX','352'),('라트비아','Latvia','LV','LVA','371'),('리비아','Libya','LY','LBY','218'),('모로코','Morocco','MA','MAR','212'),('모나코','Monaco','MC','MCO','377'),('몰르더바','Moldova','MD','MDA','373'),('몬테네그로','Montenegro','ME','MNE','382'),('세인트 마틴','Saint Martin','MF','MAF','1 599'),('마다가스카르','Madagascar','MG','MDG','261'),('마샬 군도','Marshall Islands','MH','MHL','692'),('마케도니아 (Macedonia)','Macedonia','MK','MKD','389'),('말리','Mali','ML','MLI','223'),('버마 (미얀마)','Burma (Myanmar)','MM','MMR','95'),('몽골리아','Mongolia','MN','MNG','976'),('마카오','Macau','MO','MAC','853'),('북 마리아나 제도','Northern Mariana Islands','MP','MNP','1 670'),('모리타니','Mauritania','MR','MRT','222'),('몬트 세 라트','Montserrat','MS','MSR','1 664'),('몰타','Malta','MT','MLT','356'),('모리셔스','Mauritius','MU','MUS','230'),('몰디브','Maldives','MV','MDV','960'),('말라위','Malawi','MW','MWI','265'),('멕시코','Mexico','MX','MEX','52'),('말레이시아','Malaysia','MY','MYS','60'),('모잠비크','Mozambique','MZ','MOZ','258'),('나미비아','Namibia','NA','NAM','264'),('뉴 칼레도니아','New Caledonia','NC','NCL','687'),('니제르','Niger','NE','NER','227'),('나이지리아','Nigeria','NG','NGA','234'),('니카라과','Nicaragua','NI','NIC','505'),('네덜란드','Netherlands','NL','NLD','31'),('노르웨이','Norway','NO','NOR','47'),('네팔','Nepal','NP','NPL','977'),('나우루어','Nauru','NR','NRU','674'),('니우에','Niue','NU','NIU','683'),('뉴질랜드','New Zealand','NZ','NZL','64'),('오만','Oman','OM','OMN','968'),('파나마','Panama','PA','PAN','507'),('페루','Peru','PE','PER','51'),('프랑스령 폴리네시아','French Polynesia','PF','PYF','689'),('파푸아 뉴기니','Papua New Guinea','PG','PNG','675'),('필리핀','Philippines','PH','PHL','63'),('파키스탄','Pakistan','PK','PAK','92'),('폴란드','Poland','PL','POL','48'),('생 피에르 미클롱','Saint Pierre and Miquelon','PM','SPM','508'),('핏케언 제도','Pitcairn Islands','PN','PCN','870'),('푸에르토 리코','Puerto Rico','PR','PRI','1'),('포르투갈','Portugal','PT','PRT','351'),('팔라우','Palau','PW','PLW','680'),('파라과이','Paraguay','PY','PRY','595'),('카타르','Qatar','QA','QAT','974'),('루마니아','Romania','RO','ROU','40'),('세르비아','Serbia','RS','SRB','381'),('러시아','Russia','RU','RUS','7'),('르완다','Rwanda','RW','RWA','250'),('사우디 아라비아','Saudi Arabia','SA','SAU','966'),('솔로몬 제도','Solomon Islands','SB','SLB','677'),('세이셸','Seychelles','SC','SYC','248'),('수단','Sudan','SD','SDN','249'),('스웨덴','Sweden','SE','SWE','46'),('싱가포르','Singapore','SG','SGP','65'),('세인트 헬레나','Saint Helena','SH','SHN','290'),('슬로베니아','Slovenia','SI','SVN','386'),('스발바르','Svalbard','SJ','SJM',''),('슬로바키아','Slovakia','SK','SVK','421'),('시에라 리온','Sierra Leone','SL','SLE','232'),('산 마리노','San Marino','SM','SMR','378'),('세네갈','Senegal','SN','SEN','221'),('소말리아','Somalia','SO','SOM','252'),('수리남','Suriname','SR','SUR','597'),('상투메 프린시페','Sao Tome and Principe','ST','STP','239'),('엘살바도르','El Salvador','SV','SLV','503'),('시리아','Syria','SY','SYR','963'),('스와질란드','Swaziland','SZ','SWZ','268'),('터크스 케이커스 제도','Turks and Caicos Islands','TC','TCA','1 649'),('차드','Chad','TD','TCD','235'),('토고','Togo','TG','TGO','228'),('태국','Thailand','TH','THA','66'),('타지키스탄','Tajikistan','TJ','TJK','992'),('토켈 라우','Tokelau','TK','TKL','690'),('동 티모르','Timor-Leste','TL','TLS','670'),('투르크메니스탄','Turkmenistan','TM','TKM','993'),('튀니지','Tunisia','TN','TUN','216'),('통가','Tonga','TO','TON','676'),('터키','Turkey','TR','TUR','90'),('트리니다드 토바고','Trinidad and Tobago','TT','TTO','1 868'),('투발루','Tuvalu','TV','TUV','688'),('대만','Taiwan','TW','TWN','886'),('탄자니아','Tanzania','TZ','TZA','255'),('우크라이나','Ukraine','UA','UKR','380'),('우간다','Uganda','UG','UGA','256'),('미국','United States','US','USA','1'),('우루과이','Uruguay','UY','URY','598'),('우즈베키스탄','Uzbekistan','UZ','UZB','998'),('교황청 (바티칸 시티)','Holy See (Vatican City)','VA','VAT','39'),('세인트 빈센트 그레나딘','Saint Vincent and the Grenadines','VC','VCT','1 784'),('베네수엘라','Venezuela','VE','VEN','58'),('영국령 버진 아일랜드','British Virgin Islands','VG','VGB','1 284'),('미국령 버진 아일랜드','US Virgin Islands','VI','VIR','1 340'),('베트남','Vietnam','VN','VNM','84'),('바누아투','Vanuatu','VU','VUT','678'),('월리스 푸 투나','Wallis and Futuna','WF','WLF','681'),('사모아','Samoa','WS','WSM','685'),('코소보','Kosovo','XK','XKX','383'),('예멘','Yemen','YE','YEM','967'),('마 요트','Mayotte','YT','MYT','262'),('남아프리카 공화국','South Africa','ZA','ZAF','27'),('잠비아','Zambia','ZM','ZMB','260'),('짐바브웨','Zimbabwe','ZW','ZWE','263');
/*!40000 ALTER TABLE `country_tb` ENABLE KEYS */;
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
INSERT INTO `service_app_tb` VALUES (1000000001,'도라의 영어 모험','','com.bluearkedu.dla.english','slpen','https://itunes.apple.com/kr/app/kakaotog-kakaotalk/id362057947?mt=8'),(1000000000,'키즈와츠','','com.bluearkedu.kidswatts','kwkr','https://itunes.apple.com/kr/app/kakaotog-kakaotalk/id362057947?mt=8'),(1000000003,'DLA Lv1','','','',''),(1000000004,'DLA Lv2','','','',''),(1000000005,'DLA Lv3','','','',''),(1000000007,'NDE','','','','');
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

-- Dump completed on 2018-03-09 10:45:31
