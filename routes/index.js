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
        
        var retval = api.runquery(queryText, function(results) {
            console.log('retval = ' + results);
            
            // Finally return it as JSON
            res.json(retval);
        });
    })
    .get(function(req, res, next) {
        next(new Error('Not Yet Implemented'));
    });
    

module.exports = router;
