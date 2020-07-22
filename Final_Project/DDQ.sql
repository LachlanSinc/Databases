DROP TABLE IF EXISTS `characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

-- Add the characters table

CREATE TABLE `characters` (  
`id` int(11) NOT NULL AUTO_INCREMENT,  
`fname` varchar(255),
`lname` varchar(255),
`armor_id` int(11) DEFAULT NULL,
`weapon` varchar(255) DEFAULT NULL,
`class_id` int(11) DEFAULT NULL,
`faction_id` int(11) DEFAULT NULL,
`party_id`  int(11) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Add the armor table

DROP TABLE IF EXISTS `armor`;

CREATE TABLE `armor` (  
`id` int(11) NOT NULL AUTO_INCREMENT,  
`type` varchar(255) DEFAULT NULL,
`slashing_def` int(11) DEFAULT '0',
`piercing_def` int(11) DEFAULT '0',
`bludegeoning_def` int(11) DEFAULT '0',
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Add the class table

DROP TABLE IF EXISTS `class`;

CREATE TABLE `class` (  
`id` int(11) NOT NULL AUTO_INCREMENT,  
`type` varchar(255) NOT NULL UNIQUE,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


-- Add the faction table

DROP TABLE IF EXISTS `faction`;

CREATE TABLE `faction` (  
`id` int(11) NOT NULL AUTO_INCREMENT,  
`name` varchar(255) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Add the quest table

DROP TABLE IF EXISTS `quest`;

CREATE TABLE `quest` (  
`id` int(11) NOT NULL AUTO_INCREMENT,  
`name` varchar(255) NOT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Add the party table

DROP TABLE IF EXISTS `party`;

CREATE TABLE `party` (  
`id` int(11) NOT NULL AUTO_INCREMENT,  
`name` varchar(255) NOT NULL,
`faction_id` int(11),
PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;


-- Add the many to many quest_party table

DROP TABLE IF EXISTS `quest_party`;

CREATE TABLE `quest_party` ( 
`party_id` int(11) NOT NULL,  
`quest_id` int(11) NOT NULL,
PRIMARY KEY (`party_id`, `quest_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;



-- Add all of the foreign keys to characters, all of them cascade

ALTER TABLE `characters`
ADD CONSTRAINT `character_ibxc_1` FOREIGN KEY (`armor_id`) REFERENCES `armor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `party_ibxc_1` FOREIGN KEY (`party_id`) REFERENCES `party` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `class_ibxc_1` FOREIGN KEY (`class_id`) REFERENCES `class` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `faction_ibxc_1` FOREIGN KEY (`faction_id`) REFERENCES `faction` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Add the two foreign keys to the many to many quest_party table

ALTER TABLE `quest_party`
ADD CONSTRAINT `quest_par_ibfk_1` FOREIGN KEY (`quest_id`) REFERENCES `quest` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `party_que_ibfk_1` FOREIGN KEY (`party_id`) REFERENCES `party` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- add the one foreign key to the party table, will cascade, however party can be updated to have faction set to null

ALTER TABLE `party`
ADD CONSTRAINT `party_par_ibfk_1` FOREIGN KEY (`faction_id`) REFERENCES `faction` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- seed the database

-- add the factions
INSERT INTO `faction` (name) VALUES ('Elfs');
INSERT INTO `faction` (name) VALUES ('Humans');
INSERT INTO `faction` (name) VALUES ('Dwarves');
INSERT INTO `faction` (name) VALUES ('Orcs');

-- add the only three classes, this is not meant to be changed
INSERT INTO `class` (type) VALUES ('Tank');
INSERT INTO `class` (type) VALUES ('Healer');
INSERT INTO `class` (type) VALUES ('Damage');

-- ad the intial quests
INSERT INTO `quest` (name) VALUES ('Caves');
INSERT INTO `quest` (name) VALUES ('Waterfall');
INSERT INTO `quest` (name) VALUES ('Dungeon');
INSERT INTO `quest` (name) VALUES ('Air Ship');

-- add the parties using the factions entered
INSERT INTO `party` (name, faction_id) VALUES ('Rangers', 
(SELECT id FROM faction WHERE name="Elfs"));
INSERT INTO `party` (name, faction_id) VALUES ('Knights', 
(SELECT id FROM faction WHERE name="Humans"));
INSERT INTO `party` (name, faction_id) VALUES ('Miners', 
(SELECT id FROM faction WHERE name="Dwarves"));
INSERT INTO `party` (name, faction_id) VALUES ('Barbarians', 
(SELECT id FROM faction WHERE name="Orcs"));


-- insert armor/character pairs
INSERT INTO `armor` (type, slashing_def, piercing_def, bludegeoning_def) VALUES ('Chain', 1,1,1);

INSERT INTO `characters`(`fname`, `lname`, `armor_id`, `weapon`, `class_id`, `faction_id`, `party_id`) VALUES ('John', 'Smith',
(SELECT MAX(id) FROM armor),
'Sword',
(SELECT id FROM class WHERE type="Tank"), 
(SELECT id FROM faction WHERE name="Elfs"), 
(SELECT id FROM party WHERE name="Rangers"));

INSERT INTO `armor` (type, slashing_def, piercing_def, bludegeoning_def) VALUES ('Cloth', 1,1,1);

INSERT INTO `characters`(`fname`, `lname`, `armor_id`, `weapon`, `class_id`, `faction_id`, `party_id`) VALUES ('Ronin', 'Smith',
(SELECT MAX(id) FROM armor),
'Sword',
(SELECT id FROM class WHERE type="Healer"), 
(SELECT id FROM faction WHERE name="Humans"), 
(SELECT id FROM party WHERE name="Knights"));

INSERT INTO `armor` (type, slashing_def, piercing_def, bludegeoning_def) VALUES ('Leather', 1,1,1);

INSERT INTO `characters`(`fname`, `lname`, `armor_id`, `weapon`, `class_id`, `faction_id`, `party_id`) VALUES ('Lock', 'Smith',
(SELECT MAX(id) FROM armor),
'Sword',
(SELECT id FROM class WHERE type="Damage"), 
(SELECT id FROM faction WHERE name="Humans"), 
(SELECT id FROM party WHERE name="Knights"));

INSERT INTO `armor` (type, slashing_def, piercing_def, bludegeoning_def) VALUES ('Plate', 1,1,1);

INSERT INTO `characters`(`fname`, `lname`, `armor_id`, `weapon`, `class_id`, `faction_id`, `party_id`) VALUES ('Rob', 'Smith',
(SELECT MAX(id) FROM armor),
'Sword',
(SELECT id FROM class WHERE type="Damage"), 
(SELECT id FROM faction WHERE name="Humans"), 
(SELECT id FROM party WHERE name="Knights"));


-- insert to values in the many to many table
INSERT INTO `quest_party` VALUES (
(SELECT id FROM quest WHERE name="Caves"), 
(SELECT id FROM party WHERE name="Rangers"));

INSERT INTO `quest_party` VALUES (
(SELECT id FROM quest WHERE name="Waterfall"), 
(SELECT id FROM party WHERE name="Knights"));







