
// String formatting
function formatStyle (style) {
	if (style !== undefined) {
		var strings = Object.keys(style).map(function (value) {
			return '{key}: {value}; '.format({key: value, value: style[value]})
		});
		return strings.join('');
	} else {
		return '';
	}
}

function formatClasses (classes) {
	if (classes !== undefined) {
		return classes.join(' ').trim();
	} else {
		return '';
	}
}

function formatProperties (properties) {
	if (properties !== undefined) {
		var strings = Object.keys(properties).map(function (property) {
			return '{property}="{value}" '.format({property: property, value: properties[property]})
		});
		return strings.join('');
	} else {
		return '';
	}
}

// generate random string
function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 5; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

// extend trunc method for strings
String.prototype.trunc = function(n, useWordBoundary) {
	var isTooLong = this.length > n;
	var s_ = isTooLong ? this.substr(0,n-1) : this;
	var s_ = (useWordBoundary && isTooLong) ? s_.substr(0,s_.lastIndexOf(' ')) : s_;
	return	isTooLong ? s_ + '&hellip;' : s_;
};

// gives filename without directories
function basename(path) {
	return path.replace(/.*\//, '');
}

function dirname(path) {
	return path.match(/.*\//);
}

// alphabetical sort
function alphaSort(key) {
	return function (a,b) {
		if (key !== undefined) {
			a = a[key];
			b = b[key];
		}

		if (a>b) {
			return 1;
		} else if (a<b) {
			return -1;
		} else {
			return 0;
		}
	}
}

// Ordered promises
Promise.ordered = function (promiseFunctions, input) {
	if (promiseFunctions.length !== 0) {
		var result = promiseFunctions[0](input);
		promiseFunctions.forEach(function (promiseFunction, index) {
			if (index > 0) {
				result = result.then(promiseFunction);
			}
		});

		return result;
	} else {
		return new Promise(function(resolve, reject) {resolve()});
	}
}

// Trim string
if(!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}

// Array interpolation
function linearInterpolate (before, after, atPoint) {
	return before + (after - before) * atPoint;
};

function interpolateArray (data, fitCount) {
	var newData = new Array();
	var springFactor = new Number((data.length - 1) / (fitCount - 1));
	newData[0] = data[0]; // for new allocation
	for ( var i = 1; i < fitCount - 1; i++) {
		var tmp = i * springFactor;
		var before = new Number(Math.floor(tmp)).toFixed();
		var after = new Number(Math.ceil(tmp)).toFixed();
		var atPoint = tmp - before;
		newData[i] = this.linearInterpolate(data[before], data[after], atPoint);
		}
	newData[fitCount - 1] = data[data.length - 1]; // for new allocation
	return newData;
};

function getMaxOfArray (numArray) {
  return Math.max.apply(null, numArray);
}

function getAbsNormalised (array, max) {
	// abs
	var abs = array.map(function (value) {
		return Math.abs(value);
	});

	var arrayMax = getMaxOfArray(abs);

	var normalised = abs.map(function (value) {
		return max * Math.sqrt(value / arrayMax);
		// return max * value / arrayMax;
	});

	return normalised;
}

function getDifferenceArray (previous, next) {
	if (previous.length === next.length) {
		var differenceArray = [];
		for (i=0; i<previous.length; i++) {
			differenceArray.push(next[i] - previous[i]);
		}
	}
}

function reduceSum (previous, next) {
	return previous + next;
}

function emptyPromise () {
	return new Promise(function(resolve, reject) {
		resolve();
	});
}

function blankFunction () {}

function onOff (onOff) {
	return {
		style: {
			'left': onOff,
		},
	}
}

Array.prototype.contains = function (object) {
	return this.indexOf(object) !== -1;
}

Array.prototype.sum = function (object) {
	return this.reduce(reduceSum);
}
