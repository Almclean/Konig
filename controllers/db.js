var neo4j = require('neo4j');
var connectionString = 'http://localhost:7474';
var db = null;

try {
    db = new neo4j.GraphDatabase(connectionString);
    console.log('NEO4J connection established.');
}
catch (e) {
    console.log(e.message)
}

module.exports = db;
