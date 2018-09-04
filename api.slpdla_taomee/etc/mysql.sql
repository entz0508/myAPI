CREATE DATABASE `slp_dla_db` /*!40100 DEFAULT CHARACTER SET utf8 */
CREATE DATABASE `slp_dla_info_db` /*!40100 DEFAULT CHARACTER SET utf8 */

INSERT INTO `mysql`.`db`(`Host`,`Db`,`User`,`Select_priv`,`Insert_priv`,`Update_priv`,`Delete_priv`,`Create_priv`,`Drop_priv`,`Grant_priv`,`References_priv`,`Index_priv`,`Alter_priv`,`Create_tmp_table_priv`,`Lock_tables_priv`,`Create_view_priv`,`Show_view_priv`,`Create_routine_priv`,`Alter_routine_priv`,`Execute_priv`,`Event_priv`,`Trigger_priv`)
VALUES
('localhost','slp_dla_db','spldladev','Y','Y','Y','Y','N','N','N','N','N','N','Y','N','Y','Y','N','N','Y','N','N'),
('127.0.0.1','slp_dla_db','spldladev','Y','Y','Y','Y','N','N','N','N','N','N','Y','N','Y','Y','N','N','Y','N','N'),
('localhost','slp_dla_info_db','spldladev','Y','Y','Y','Y','N','N','N','N','N','N','Y','N','Y','Y','N','N','Y','N','N'),
('127.0.0.1','slp_dla_info_db','spldladev','Y','Y','Y','Y','N','N','N','N','N','N','Y','N','Y','Y','N','N','Y','N','N');


INSERT INTO `mysql`.`user`(`Host`,`User`,`Password`,`Select_priv`,`Insert_priv`,`Update_priv`,`Delete_priv`,`Create_priv`,`Drop_priv`,`Reload_priv`,`Shutdown_priv`,`Process_priv`,`File_priv`,`Grant_priv`,`References_priv`,`Index_priv`,`Alter_priv`,`Show_db_priv`,`Super_priv`,`Create_tmp_table_priv`,`Lock_tables_priv`,`Execute_priv`,`Repl_slave_priv`,`Repl_client_priv`,`Create_view_priv`,`Show_view_priv`,`Create_routine_priv`,`Alter_routine_priv`,`Create_user_priv`,`Event_priv`,`Trigger_priv`,`Create_tablespace_priv`,`ssl_type`,`ssl_cipher`,`x509_issuer`,`x509_subject`,`max_questions`,`max_updates`,`max_connections`,`max_user_connections`,`plugin`,`authentication_string`)
VALUES
('localhost','spldladev',PASSWORD('qmffndkzm!!!!'),'Y','Y','Y','Y','N','N','N','N','N','N','N','N','N','N','N','N','N','N','Y','N','N','N','N','N','N','N','N','N','N','','','','','0','0','0','0','',''),
('127.0.0.1','spldladev',PASSWORD('qmffndkzm!!!!'),'Y','Y','Y','Y','N','N','N','N','N','N','N','N','N','N','N','N','N','N','Y','N','N','N','N','N','N','N','N','N','N','','','','','0','0','0','0','','');

flush privileges;