CREATE USER 'tomee'@'%'
  IDENTIFIED BY 'tomee';
GRANT USAGE ON *.* TO 'tomee'@'%'
REQUIRE NONE
WITH MAX_QUERIES_PER_HOUR 0
  MAX_CONNECTIONS_PER_HOUR 0
  MAX_UPDATES_PER_HOUR 0
  MAX_USER_CONNECTIONS 0;
CREATE DATABASE IF NOT EXISTS `tomee` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
GRANT ALL PRIVILEGES ON `tomee`.* TO 'tomee'@'%';