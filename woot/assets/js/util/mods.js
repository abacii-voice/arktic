// extend trunc method for strings
String.prototype.trunc = function(n, useWordBoundary) {
	var isTooLong = this.length > n;
	var s_ = isTooLong ? this.substr(0,n-1) : this;
	var s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
	return	isTooLong ? s_ + '&hellip;' : s_;
}

// Trim string
if(!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	}
}

String.prototype.contains = function (object) {
	return this.indexOf(object) !== -1;
}

// Arrays
Array.prototype.contains = function (object) {
	return this.indexOf(object) !== -1;
}

Array.prototype.sum = function (object) {
	return this.reduce(function (f, s) {
		return f+s;
	});
}

Array.range = function (start, end, step) {
	// options
	var End = (end || start);
	start = end ? start : 0;
	step = (step || 1);
	step = End > start ? step : -step;

	//
	var range = [];
	while (step > 0 ? End >= start : End <= start) {
		range.push(start);
		start += step;
	}

	return range;
}

// Ordered promises
Promise.ordered = function (promiseFunctions, input) {
	if (promiseFunctions.length !== 0) {
		return promiseFunctions.reduce(function (previousResult, currentPromise) {
			return previousResult.then(function (previousValue) {
				return currentPromise(previousValue);
			});
		}, Util.ep(input));
	} else {
		return Util.ep();
	}
}
