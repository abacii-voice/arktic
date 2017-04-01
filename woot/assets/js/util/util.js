// LIST OF CHANGES

// ##### version 1
// 1. Change formatting functions to be more consistent
// 2. Change 'makeid' to 'name'
// 3. Move 'basename' and 'dirname' to 'paths'
// 4. Move color and ui to this file

var _ = {

	// String formatting
	format: {
		style: function (style) {
			style = (style || {});
			return Object.keys(style).map(function (key) {
				return `${key}: ${style[key]};`;
			}).join(' ');
		},
		classes: function (classes) {
			classes = (classes || []);
			return classes.join(' ');
		},
		properties: function (properties) {
			properties = (properties || {});
			return Object.keys(properties).map(function (property) {
				let value = properties[property];
				return `${property}` + _.isBoolean(value) && value ? '' : `=${value}`;
			}).join(' ');
		},
	},

	// generate random string
	name: function () {
		var i;
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

		for(i=0, i<8; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	},

	// paths
	path: {
		basename: function (path) {
			return path.replace(/.*\//, '');
		},
		dirname: function (path) {
			return path.match(/.*\//);
		},
	}

	// sort
	sort: {
		alpha: function (key) {
			return function (a, b) {
				if (key) {
					a = a[key];
					b = b[key];
				}

				if (a > b) {
					return 1;
				} else if (a < b) {
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
			var i;
			var newData = new Array();
			var springFactor = new Number((data.length - 1) / (fitCount - 1));
			newData[0] = data[0]; // for new allocation
			for (i = 1; i < fitCount - 1; i++) {
				var tmp = i * springFactor;
				var before = new Number(Math.floor(tmp)).toFixed();
				var after = new Number(Math.ceil(tmp)).toFixed();
				var atPoint = tmp - before;
				newData[i] = _.arrays.linearInterpolate(data[before], data[after], atPoint);
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

			var arrayMax = _.arrays.getMaxOfArray(abs);

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

	// accept
	accept: function (value, accept) {
		return accept.indexOf(value) !== -1;
	}

	// colors
	color: {
		grey: {
			normal: '#868686',
			uberlight: '#E2E2E2',
			lightest: '#D2D2D2',
			light: '#A8A8A8',
			dark: '#636363',
			darkest: '#3A3B3A',
		},
		red: {
			normal: '#F5B1AF',
			lightest: '#FFEFEE',
			light: '#FFD7D6',
			dark: '#CF7876',
			darkest: '#AA4845',
		},
		yellow: {
			normal: '#F5EAAF',
			lightest: '#FFFCEE',
			light: '#FFF8D6',
			dark: '#CFC076',
			darkest: '#AA9A45',
		},
		purple: {
			normal: '#897EA9',
			uberlight: '#ECEAF2',
			lightest: '#DCD8E6',
			light: '#B2ABC8',
			dark: '#65588F',
			darkest: '#473775',
		},
		green: {
			normal: '#8AC18D',
			lightest: '#DEEEDF',
			light: '#B6D9B8',
			dark: '#5CA361',
			darkest: '#36863B',
		},
	},

	// measurements
	ui: {
		dimensions: {
			corner: '5px',
		},
	},
}
