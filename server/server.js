var express = require('express');
var app = express();
var fs = require('fs');
var url = require('url');


app.get('/', function (req, res) {

	var q = url.parse(req.url, true).query;
	if(q.from && q.to) res.end(getCurrencyData(q.from, q.to).join()) 
		else
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

	console.log("Listening at http://%s:%s", host, port)

})

//stub
function getCurrencyData(from, to) {
	
	var data = [12, 19, 3, 17, 6, 3, 7, 19, 3, 17, 6, 3, 7, 19, 3, 17, 6, 3, 7, 19, 3, 17];
	
	console.log(data.slice(0, dateDiffInDays(from,to)).join());
	return data.slice(0, dateDiffInDays(from,to));
}

function dateDiffInDays(a, b) {
	var date1 = new Date(a);
	var date2 = new Date(b);
	var timeDiff = Math.abs(date2.getTime() - date1.getTime());
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
	console.log(diffDays);
	return diffDays;
}
