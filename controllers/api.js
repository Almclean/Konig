// This does the raw neo commands.
// This is just a simple query for now, eventually we'll import 
// the remaining Models here, e.g. Nodes etc for CRUD operations

var neo4j = require('neo4j');
var connectionString = 'http://localhost:7474';
// Add in some params here, default for now.
var db = new neo4j.GraphDatabase(connectionString);
console.log('Connected to NEO4J @ ' + connectionString);

var api = { 
    runquery : function(queryText, res) {
        db.query(queryText, {}, function(err, results) {
            if (err) throw err;
            console.log(results);
            res(results);
        });
    }
};

module.exports = api;
