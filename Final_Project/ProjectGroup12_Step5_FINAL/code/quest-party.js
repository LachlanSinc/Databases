module.exports = function(){
    var express = require('express');
    var router = express.Router();



    function getQuestParty(res, mysql, context, complete){
        mysql.pool.query("SELECT q.id AS qid, p.id AS pid, q.name AS quest, p.name AS party FROM quest_party qp INNER JOIN party p ON p.id=qp.party_id INNER JOIN quest q ON q.id = qp.quest_id;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.questparty = results;
            complete();
        });
    }

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

    function getQuest(res, mysql, context, complete){
        mysql.pool.query("SELECT id, name FROM quest;", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.quest = results;
            complete();
        });
    }

    router.post('/', function(req, res){

        var mysql = req.app.get('mysql');
        var sql = "SELECT * FROM quest_party WHERE quest_id = ? AND party_id= ?";
        var inserts = [req.body.quest, req.body.party];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            //console.log()
            if(results.length==0)
            {
                var mysql = req.app.get('mysql');
                var sql = "INSERT INTO quest_party (quest_id, party_id) VALUES (?, ?)";
                var inserts = [req.body.quest, req.body.party];
                sql = mysql.pool.query(sql,inserts,function(error, results, fields){
                    if(error){
                        res.write(JSON.stringify(error));
                        res.end();
                    }else{
                        res.redirect('/quest-party');
                    }
                });
            }
        })



    });

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletequestparty.js"];
        var mysql = req.app.get('mysql');
        getQuestParty(res, mysql, context, complete);
        getQuest(res, mysql, context, complete);
        getParty(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('quest-party', context);
            }
        }
    });

    router.delete('/:id1/:id2', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM quest_party WHERE quest_id = ? AND party_id= ?";
        var inserts = [req.params.id1, req.params.id2];
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