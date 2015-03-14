# USAGE
# mysql -u {{dbuser}} -p < create_dbtables;

CREATE TABLE reconetsudb.user 
  (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
    username VARCHAR(20) NOT NULL, 
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    registered_date DATETIME,
    password_updated_date DATETIME,
    is_user_valid ENUM('true', 'false')
  ) ENGINE = InnoDB;
