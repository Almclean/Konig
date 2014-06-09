var express = require('express');
var router = express.Router();
var api = require('../controllers/api');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Konig' });
});

router.route('/api/rawquery')
    .post(function(req, res, next) {
        var queryText = req.body.cql;
        console.log('CQL : ' + queryText);
        
        // Send off the query to the API...
        api.query(queryText);

        //Lets get the results
        api.on('queryResult', function(results) {
            console.log('retval = ' + results);
            res.json(results);
        });
        
        // Handle some error from the query, just rethrow for now.
        var errorVal = api.on('queryError', function(err) {
            throw err;
        });
        
    })
    .get(function(req, res, next) {
        next(new Error('Not Yet Implemented'));
    });
    

module.exports = router;
