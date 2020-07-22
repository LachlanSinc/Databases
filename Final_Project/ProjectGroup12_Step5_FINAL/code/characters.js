

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    //get all characters from the db
    function getCharacters(res, mysql, context, complete){
        mysql.pool.query("SELECT c.id, c.fname AS fname, c.lname AS lname, c.weapon AS weapon, p.name AS party, f.name AS faction, a.type AS armor, cl.type AS class FROM characters c INNER JOIN armor a ON c.armor_id=a.id INNER JOIN party p ON c.party_id=p.id INNER JOIN faction f ON c.faction_id=f.id INNER JOIN class cl ON c.class_id=cl.id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.characters = results;
            complete();
        });
    }

    //get all classes from the db
    function getClass(res, mysql, context, complete){
        mysql.pool.query("SELECT id, type FROM class;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.class = results;
            complete();
        });
    }
    //return all factions from the db
    function getFaction(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM faction;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.faction = results;
            complete();
        });
    }

    //return all parties from the db
    function getParty(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM party;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.party = results;
            complete();
        });
    }



    //filter the characters by name
    function getFilterFname(req, res, mysql, context, complete) {
        //sanitize the input as well as include the % character
        var query = "SELECT c.id, c.fname AS fname, c.lname AS lname, c.weapon AS weapon, p.name AS party, f.name AS faction, a.type AS armor, cl.type AS class FROM characters c INNER JOIN armor a ON c.armor_id=a.id INNER JOIN party p ON c.party_id=p.id INNER JOIN faction f ON c.faction_id=f.id INNER JOIN class cl ON c.class_id=cl.id WHERE c.fname LIKE " + mysql.pool.escape(req.params.s + '%');
        //console.log(query)
  
        mysql.pool.query(query, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.characters = results;
              complete();
          });
      }

      //get the characters in the provided party
    function getCharactersByParty(req, res, mysql, context, complete){
        var query = "SELECT c.id, c.fname AS fname, c.lname AS lname, c.weapon AS weapon, p.name AS party, f.name AS faction, a.type AS armor, cl.type AS class FROM characters c INNER JOIN armor a ON c.armor_id=a.id INNER JOIN party p ON c.party_id=p.id INNER JOIN faction f ON c.faction_id=f.id INNER JOIN class cl ON c.class_id=cl.id WHERE c.party_id=?";
        //console.log(req.params)
        var inserts = [req.params.party]
        mysql.pool.query(query, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.characters = results;
              complete();
          });
      }
    
    
      //standarded get function, display all characters
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletefaction.js","filtercharacters.js","searchcharacters.js"];
        var mysql = req.app.get('mysql');
        getCharacters(res, mysql, context, complete);
        getClass(res, mysql, context, complete);
        getFaction(res, mysql, context, complete);
        getParty(res, mysql, context, complete);
        
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('characters', context);
            }

        }
    });

    //first need to create the new armor then pass then use it in the sencond insert via the select command
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO armor (type, slashing_def, piercing_def, bludegeoning_def) VALUES (?, ?, ?, ?)";
        var inserts = [req.body.type, req.body.slashing_def, req.body.piercing_def, req.body.bludegeoning_def];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                var sql = "INSERT INTO characters (fname, lname, armor_id, weapon, class_id, faction_id, party_id) VALUES (?, ?, (SELECT MAX(id) FROM armor), ?, ?, ?, ?)";
                var inserts = [req.body.fname, req.body.lname, req.body.weapon, req.body.class, req.body.faction, req.body.party];
                sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        res.redirect('/characters');
                    }
                });
            }
        });

    });

    //for empty strings
    router.get('/search/', function(req, res){

        res.redirect('/characters');    
    });

    //search for their first name
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletefaction.js","filtercharacters.js","searchcharacters.js"]
        var mysql = req.app.get('mysql');
        getFilterFname(req, res, mysql, context, complete);
        getClass(res, mysql, context, complete);
        getFaction(res, mysql, context, complete);
        getParty(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('characters', context);
            }
        }
    });

    router.get('/filter/:party', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletefaction.js","filtercharacters.js","searchcharacters.js"];
        var mysql = req.app.get('mysql');
        getCharactersByParty(req,res, mysql, context, complete);
        getClass(res, mysql, context, complete);
        getFaction(res, mysql, context, complete);
        getParty(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 4){
                res.render('characters', context);
            }

        }
    });

    //first delete the armor for the character then delete the character
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM armor WHERE id = (SELECT armor_id FROM characters c WHERE c.id=?)"; //"DELETE FROM characters WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                var mysql = req.app.get('mysql');
                var sql = "DELETE FROM characters WHERE id = ?";
                var inserts = [req.params.id];
                sql = mysql.pool.query(sql, inserts, function(error, results, fields){
                    if(error){
                        console.log(error)
                        res.write(JSON.stringify(error));
                        res.status(400);
                        res.end();
                    }else{
                        res.status(202).end();
                    }
                })
            }
        })
    })


    return router;
}();
