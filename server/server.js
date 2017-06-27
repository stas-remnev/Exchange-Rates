var express = require('express');
var app = express();
var fs = require('fs');
var url = require('url');


app.get('/', function (req, res) {
	fs.readFile('exchange_rates.html', function(err, data) {
		res.end(data);
	});
})

app.get('/data_json.js', function (req, res) {
	fs.readFile("data_json.js", 'utf8', function (err, data) {
		res.end(data);
	});
})

var server = app.listen(8081, function () {

	var host = server.address().address
	var port = server.address().port

	console.log("Example app listening at http://%s:%s", host, port)

})
