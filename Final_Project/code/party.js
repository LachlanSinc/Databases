

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getParties(res, mysql, context, complete){
        mysql.pool.query("SELECT p.id AS id, p.name AS name, f.name AS faction FROM party p LEFT JOIN faction f ON f.id=p.faction_id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.party = results;
            complete();
        });
    }

    function getParty(res, mysql, context, id, complete){
        var sql = "SELECT id, name, faction_id FROM party WHERE id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.party = results[0];
            complete();
        });
    }

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

    /*Display all people. Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletefaction.js"]; //,"filterpeople.js","searchpeople.js"];
        var mysql = req.app.get('mysql');
        getFaction(res, mysql, context, complete);
        getParties(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('party', context);
            }

        }
    });

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO party (name, faction_id) VALUES (?, ?)";
        var inserts = [req.body.name, req.body.faction];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/party');
            }
        });
    });

    //go to update page
    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateparty.js", "selectfaction.js"];
        var mysql = req.app.get('mysql');
        getParty(res, mysql, context, req.params.id, complete);
        getFaction(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-party', context);
            }

        }
    });


    //update
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');

        if(isNaN(parseInt(req.body.faction, 10)))
        {
            var sql = "UPDATE party SET name=?, faction_id=NULL WHERE id=?";
            var inserts = [req.body.name, req.params.id];
        }
        else{
            var sql = "UPDATE party SET name=?, faction_id=? WHERE id=?";
            var inserts = [req.body.name,req.body.faction, req.params.id];
        }

        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });

    });

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM party WHERE id = ?";
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
    })


    return router;
}();
