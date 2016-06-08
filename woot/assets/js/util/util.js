
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
Promise.ordered = function (promises) {
	var result = promises[0];
	promises.forEach(function (promise, index) {
		if (index > 0) {
			result = result.then(function () {
				return promise;
			});
		}
	});

	return result;
}

// Trim string
if(!String.prototype.trim) {
	String.prototype.trim = function () {
		return this.replace(/^\s+|\s+$/g,'');
	};
}

// audio processing
function syncStream(node) {
	return new Promise(function(resolve, reject) {
		var buf8 = new Uint8Array(node.buffer);
		buf8.indexOf = Array.prototype.indexOf;
		var i = node.sync, b = buf8;

		while(true) {
			node.retry++;
			i = b.indexOf(0xFF, i);
			if (i === -1 || (b[i+1] & 0xE0 == 0xE0)) {
				break;
			}
			i++;
		}

		if (i !== -1) {
			var tmp = node.buffer.slice(i);
			delete(node.buffer);
			node.buffer = null;
			node.buffer = tmp;
			node.sync = i;
			return true;
		}

		return false;
	});
}

function decodeAudio(node, decodedCallback) {
	return syncStream().then(function (buffer) {

	});


		node.context.decodeAudioData(node.buffer, decodedCallback, function () {
			// only on error attempt to sync on frame boundary
			if (syncStream(node)) {
				decodeAudio(node, decodedCallback);
			}
		});
}
