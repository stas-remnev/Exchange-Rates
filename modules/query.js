var http = require('http');
var date = require('./date-factory');
var fs = require('fs');


module.exports = {
	getRatesArray: function(from, to) {
		var num = date.diffInDays(from, to);
		var data = JSON.parse(fs.readFileSync("./data.json", 'utf8'));
		var pos = data.findIndex(function (element) {
			return element.date == from;
		});
		var result = [];
		for (var i = pos; i <= pos + num && i < data.length; i++) {
			result.push(data[i].value);
		}
		return result;
	},

	requestData: function(from, callback) {
		var to = date.dateVals(new Date());
		http.get(date.url(from, to), function (res) {
			var str = '';

			res.setEncoding('utf8');
			res.on('data', function (chunk) {
				str = str + chunk;
			});

			res.on('end', function () {
				var str2 = str;
				var k = (str2.split('Nominal').length - 1);
				k = k / 2;
				var arr = new Array();
				var arr1 = new Array();
				var arr2 = new Array();
				var arr3 = new Array();
				var str1 = str.match(/.Value.*,*.Value./g);
				arr = str1.toString().split('</Value>');
				for (var i = 0; i < k; i++){
					arr1[i] = arr[i].replace(/\D/g, '') / 10000;
				}

				var str3 = str2.match(/Date=............./g);
				arr2 = str3.toString().split('Date=');
				for (var i = 0; i < k; i++) {
					arr3[i] = arr2[i + 1].replace(/\D/g, '');
					arr3[i] = arr3[i].charAt(4) + arr3[i].charAt(5) +
					arr3[i].charAt(6) + arr3[i].charAt(7) + "-" + arr3[i].charAt(2) +
					arr3[i].charAt(3) + "-" + arr3[i].charAt(0) + arr3[i].charAt(1);
				}


				var info = new Array();
				for (var lo = 0; lo < k; lo++) {
					info[lo] = { date: arr3[lo], value: arr1[lo] };
				}
				var zna41 = JSON.stringify(info);

				fs.open("data.json", "w+", 0644, function (err, file_handle) {
					if (!err) {
						fs.write(file_handle, zna41, null, 'ascii', function(err, written) {
							if (!err && typeof(callback) === "function") {
								callback();
							} else { // write error

							}
						});
					} else { // open error

					}
				});
			});
		});
	}
}