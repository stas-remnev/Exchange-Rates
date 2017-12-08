var fs = require('fs');
var url = require('url');
var express = require('express');
var app = express();

app.use('/modules', express.static('modules'));

var config = require('./config/config.js');
var date = require('./modules/date-factory');
var query = require('./modules/query');

var port = config.port;

app.get('/', function(req, res){
    var q = url.parse(req.url, true).query;
    if (q.from && q.to) {
        res.end(query.getRatesArray(q.from, q.to).join());
    } else {
        fs.readFile('exchange_rates.html', function (err, data) {
            res.end(data);
        });
    }
});

app.get('/data_json.js', function(req, res){
    fs.readFile('data_json.js', function (err, data) {
        res.end(data);
    });
});

app.listen(port, function(){
    console.log('App listening on port ' + port);
    
    fs.readFile("lastrequest.txt", 'utf8', function (err, data) {
        if (data != (new Date()).toDateString()) {
            var lastUpdate = new Date(data);
            lastUpdate = new Date(lastUpdate.setDate(lastUpdate.getDate() + 1));
            query.requestData(date.dateVals(lastUpdate), function(){
                fs.writeFile("lastrequest.txt", (new Date()).toDateString(), function (err) {
                    if (err) throw err;
                });
            });
        }
    });
});