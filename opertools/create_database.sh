# USAGE
# mysql -u root -p < create_database.sh
# {{dbuser}} and {{password}} must be changed

CREATE DATABASE reconetsudb;

CREATE USER '{{dbuser}}'@'localhost' IDENTIFIED BY '{{password}}';

GRANT ALL PRIVILEGES ON reconetsudb.* TO '{{dbuser}}'@'localhost' IDENTIFIED BY '{{password}}';

FLUSH PRIVILEGES;
