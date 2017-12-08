module.exports = {
	diffInDays: function (a, b) {
		var from = new Date(a);
		var to = new Date(b);
		var timeDiff = Math.abs(to.getTime() - from.getTime());
		var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

		return diffDays;
	},

	dateVals: function (val) {
		var now = val;
		var d = now.getDate();
		var m = now.getMonth();
		var y = now.getFullYear();

		if (d < 10) d = '0' + d;
		if (++m < 9) m = '0' + m;

		return {"day":d, "month": m, "year":y};
	},

	url: function(from, to) {
		return "http://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=" + from.day +
		"/" + from.month + "/" + from.year + "&date_req2=" + to.day + "/" + to.month + "/" + to.year +
		"&VAL_NM_RQ=R01235";
	}
}