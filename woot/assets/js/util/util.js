var Util = {

	// String formatting
	format: {
		style: function (style) {
			if (style !== undefined) {
				var strings = Object.keys(style).map(function (value) {
					return '{key}: {value}; '.format({key: value, value: style[value]})
				});
				return strings.join('');
			} else {
				return '';
			}
		},
		classes: function (classes) {
			if (classes !== undefined) {
				return classes.join(' ').trim();
			} else {
				return '';
			}
		},
		properties: function (properties) {
			if (properties !== undefined) {
				var strings = Object.keys(properties).map(function (property) {
					if (typeof(properties[property]) === 'boolean' && properties[property]) {
						return '{property} '.format({property: property});
					} else {
						return '{property}="{value}" '.format({property: property, value: properties[property]});
					}
				});
				return strings.join('');
			} else {
				return '';
			}
		},
	},

	// generate random string
	makeid: function () {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < 8; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	},

	// filenames
	basename: function (path) {
		return path.replace(/.*\//, '');
	},
	dirname: function (path) {
		return path.match(/.*\//);
	},

	// sort
	sort: {
		alpha: function (key) {
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
		},
	},

	// arrays
	arrays: {
		linearInterpolate: function (before, after, atPoint) {
			return before + (after - before) * atPoint;
		},
		interpolateArray: function (data, fitCount) {
			var newData = new Array();
			var springFactor = new Number((data.length - 1) / (fitCount - 1));
			newData[0] = data[0]; // for new allocation
			for ( var i = 1; i < fitCount - 1; i++) {
				var tmp = i * springFactor;
				var before = new Number(Math.floor(tmp)).toFixed();
				var after = new Number(Math.ceil(tmp)).toFixed();
				var atPoint = tmp - before;
				newData[i] = Util.arrays.linearInterpolate(data[before], data[after], atPoint);
			}
			newData[fitCount - 1] = data[data.length - 1]; // for new allocation
			return newData;
		},
		getMaxOfArray: function (numArray) {
			return Math.max.apply(null, numArray);
		},
		getAbsNormalised: function (array, max) {
			// abs
			var abs = array.map(function (value) {
				return Math.abs(value);
			});

			var arrayMax = Util.arrays.getMaxOfArray(abs);

			var normalised = abs.map(function (value) {
				return max * Math.sqrt(value / arrayMax);
				// return max * value / arrayMax;
			});

			return normalised;
		},
	},

	// empty promise
	ep: function (input) {
		return new Promise(function(resolve, reject) {
			resolve(input);
		});
	},

	// objects
	isEmptyObject: function (e) {
		for (var t in e) {
			return false;
		}
		return true;
	},
}
