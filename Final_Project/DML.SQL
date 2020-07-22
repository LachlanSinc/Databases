--Insert fuctions section


-- Query to add a new faction functionality with colon : characters being used to 
-- denote the variables that will have data from the backend programming language

INSERT INTO `faction` (`name`)
VALUES (:name);

-- Query to add a new class 

INSERT INTO `class` (`type`)
VALUES (:type);

-- Query to add a new weapon

INSERT INTO `weapon` (`type`,`slashing_bon`,`piercing_bon`,`bludegeoning_bon`,)
VALUES (:type, slashing_bon,:piercing_bon, :bludegeoning_bon);

-- Query to add a new quest 

INSERT INTO `quest` (`name`)
VALUES (:name);

-- Query to add a new party 

INSERT INTO `party` (name, faction_id) VALUES (:questname, 
(SELECT id FROM faction WHERE name=:factionname));

-- Query to add a characters

INSERT INTO `characters`(`name`, `armor_id`, `class_id`, `faction_id`, `party_id`) VALUES (:name, 
(SELECT id FROM armor WHERE type=:armortype),
(SELECT id FROM class WHERE type=:classtype), 
(SELECT id FROM faction WHERE name=:factionname), 
(SELECT id FROM party WHERE name=:partyname));
-- Query to add a new armor

INSERT INTO `armor` (`type`,`slashing_def`,`piercing_def`,`bludegeoning_def`)
VALUES (:type, :slashing_def, :piercing_def, :bludegeoning_def);

-- Query to delete a character 

DELETE FROM `characters` WHERE `name`=:string;

-- Query to delete armor based off a character

DELETE FROM armor WHERE id = (SELECT armor_id FROM characters c WHERE c.id=:characterID)

-- Query to delete a party

DELETE FROM `party` WHERE `name`=:string;

-- Query to delete a quest

DELETE FROM `quest` WHERE `name`=:string;

-- Delete from the many to many quest party table

DELETE FROM quest_party WHERE quest_id = :questID AND party_id= :partyID

-- Query to update a characters

UPDATE `characters`
SET `party_id`=:newID, `weapon_id`=newWID,
WHERE `name1`=:string

-- Query to update a armor

UPDATE `armor`
SET `slashing_def`=:newstat, `piercing_def`=:newstat, `bludegeoning_def`=:newstat,
WHERE `name`=:name;

-- query to display all atributes of a characters

SELECT c.name, p.name, f.name, a.type FROM characters c
INNER JOIN armor a ON c.armor_id=a.id
INNER JOIN party p ON c.party_id=p.party_id
INNER JOIN faction f ON c.faction_id=f.faction_id
WHERE gc.name=:providedName;

-- display all memebers of a faction
SELECT c.name FROM characters c 
INNER JOIN faction f ON c.faction_id=f.id
WHERE f.name=:factionName;

-- display members in a party
SELECT c.name FROM characters c 
INNER JOIN party p ON c.party_id=p.id
WHERE p.name=:partyName;

-- display all quests a party is on
SELECT q.name FROM quest q
INNER JOIN quest_party qp ON qp.quest_id=q.id
INNER JOIN party p ON p.id=qp.party_id
WHERE q.name=:questName;

-- select the values in the main
SELECT q.id AS qid, p.id AS pid, q.name AS quest, p.name AS party FROM quest_party qp 
INNER JOIN party p ON p.id=qp.party_id INNER JOIN quest q ON q.id = qp.quest_id;

-- function for filtering characters by name

SELECT c.id, c.fname AS fname, c.lname AS lname, c.weapon AS weapon, p.name AS party, f.name AS faction, a.type AS armor, cl.type AS class FROM characters c 
INNER JOIN armor a ON c.armor_id=a.id 
INNER JOIN party p ON c.party_id=p.id 
INNER JOIN faction f ON c.faction_id=f.id 
INNER JOIN class cl ON c.class_id=cl.id WHERE c.fname LIKE :partialName

-- filter characters based on parties

SELECT c.id, c.fname AS fname, c.lname AS lname, c.weapon AS weapon, p.name AS party, f.name AS faction, a.type AS armor, cl.type AS class FROM characters c 
INNER JOIN armor a ON c.armor_id=a.id 
INNER JOIN party p ON c.party_id=p.id 
INNER JOIN faction f ON c.faction_id=f.id 
INNER JOIN class cl ON c.class_id=cl.id WHERE c.party_id= :partyId

-- Select a specific quest andd party from the many to many table

SELECT * FROM quest_party WHERE quest_id = questID AND party_id= :partyID

-- Check to see if a quest party pair exists, if not the insert command can be run

SELECT * FROM quest_party WHERE quest_id = :questID AND party_id= :partyID;
INSERT INTO quest_party (quest_id, party_id) VALUES (:questID, :partyID);
