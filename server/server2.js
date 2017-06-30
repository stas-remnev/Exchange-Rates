var http = require('http');
var fs = require('fs');
var url = require('url');
var express = require('express');
var app = express();

var file = fs.createWriteStream("example.xml");
var str;
var now = new Date();
var d = now.getDate();
var m = now.getMonth();
var y = now.getFullYear();
if (d < 10) { d = "0" + d };
m = m + 1;
if (m < 9) { m = "0" + m };


app.get('/', function (req, res) {

    var q = url.parse(req.url, true).query;
    if (q.from && q.to) { res.end(getCurrencyData(q.from, q.to).join()) }
    else
        fs.readFile('exchange_rates.html', function (err, data) {
            res.end(data);
        });
});

app.get('/data_json.js', function (req, res) {

    fs.readFile('data_json.js', function (err, data) {
        res.end(data);
    });
});

function requestData(ld, lm, ly) {
    http.get("http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=" + ld +
        "/" + lm + "/" + ly + "&date_req2=" + d + "/" + m + "/" + y +
        "&VAL_NM_RQ=R01235", function (res) {
            str = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                str = str + chunk;
            });

            res.on('end', function () {
                str2 = str;
                var k = (str2.split('Nominal').length - 1);
                k = k / 2;
                var arr = new Array();
                var arr1 = new Array();
                var arr2 = new Array();
                var arr3 = new Array();
                var str1 = str.match(/.Value.*,*.Value./g);
                arr = str1.toString().split('</Value>');
                for (var i = 0; i < k; i++)
                { arr1[i] = arr[i].replace(/\D/g, '') / 10000; }



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
                //console.log(info)
                var zna41 = JSON.stringify(info);

                fs.open("baks12.json", "w+", 0644, function (err, file_handle) {
                    if (!err) {


                        fs.write(file_handle, zna41, null, 'ascii', function
(err, written) {
                            if (!err) {
                                // Всё прошло хорошо
                            } else {
                                // Произошла ошибка при записи
                            }
                        });
                    } else {
                        // Обработка ошибок при открытии
                    }
                });


            });

        });
}

app.listen(8080, function () {

    console.log('Example app listening on port 8080!');

    fs.readFile("lastrequest.txt", 'utf8', function (err, data) {
        if (data != now.toDateString()) {
            val = new Date(data);
            var date = new Date(val.setDate(val.getDate() + 1));
            var ld = date.getDate();
            var lm = date.getMonth();
            var ly = date.getFullYear();
            if (ld < 10) { ld = "0" + ld };
            lm = lm + 1;
            if (lm < 9) { lm = "0" + lm };
            requestData(ld, lm, ly);
            fs.writeFile("lastrequest.txt", now.toDateString(), function (err) {
                if (err) throw err;
            });
        }
    });

});

function getCurrencyData(from, to) {

    var num = dateDiffInDays(from, to);
    var result = [], j = 0;

    var data = JSON.parse(fs.readFileSync("baks12.json", 'utf8'));
    console.log(data);
    var pos = data.findIndex(function (element) {
        return element.date ==
            from
    });
    console.log(pos, num);
    for (var i = pos; i <= pos + num && i < data.length; i++) {
        console.log(data[i].value);
        result[j++] = (data[i].value);
    }
    console.log(result);
    return result;
}

function dateDiffInDays(a, b) {
    var date1 = new Date(a);
    var date2 = new Date(b);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return diffDays;
}
