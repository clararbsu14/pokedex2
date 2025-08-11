SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS pokemon;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE pokemon (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name_french VARCHAR(255),
  types VARCHAR(255),
  abilities VARCHAR(255),
  hp INT,
  attack INT,
  defense INT,
  sp_attack INT,
  sp_defense INT,
  speed INT,
  description TEXT,
  height VARCHAR(50),
  weight VARCHAR(50),
  hires VARCHAR(255)
);