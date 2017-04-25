// LIST OF CHANGES

// ##### version 1
// 1. Change formatting functions to be more consistent
// 2. Change 'makeid' to 'name'
// 3. Move 'basename' and 'dirname' to 'paths'
// 4. Move color and ui to this file

var _ = {

	// String formatting
	format: {
		style: (style={}) => _.keys(style).map(key => `${key}: ${style[key]};`).join(' '),
		classes: classes => classes.join(' '),
		properties: (properties={}) => _.keys(properties).map(key => `${property}` + _.isBoolean(properties[property]) && properties[property] ? '' : `=${properties[property]}`).join(' '),
	},
	json: obj => JSON.stringify(obj),

	// generate random string
	name: () =>
	name: function () {
		var i;
		var text = '';
		var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

		for (i=0; i<8; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}

		return text;
	},

	// paths
	path: {
		basename: path => path.replace(/.*\//, ''),
		dirname: path => path.match(/.*\//),
	},

	// sort
	sort: {
		usageAlpha: function (a, b) {
			// sort by usage
			if (a.usage && b.usage) {
				if (a.usage > b.usage) {
					return 1;
				} else if (a.usage < b.usage) {
					return -1;
				}
			}

			// then alphabetically
			if (a.main.toLowerCase() > b.main.toLowerCase()) {
				return 1;
			} else {
				return -1;
			}
		},
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
		linearInterpolate: (before, after, atPoint) => before + (after - before) * atPoint,
		interpolateArray: (data, fitCount) => {
			var newData = [];
			var springFactor = new Number((data.length - 1) / (fitCount - 1));
			newData[0] = data[0]; // for new allocation
			for (let i=0; i<fitCount-1; i++) {
				let tmp = i * springFactor;
				let before = new Number(Math.floor(tmp)).toFixed();
				let after = new Number(Math.ceil(tmp)).toFixed();
				let atPoint = tmp - before;
				newData[i] = _.arrays.linearInterpolate(data[before], data[after], atPoint);
			}
			newData[fitCount-1] = data[data.length-1]; // for new allocation
			return newData;
		},
		getMaxOfArray: numArray => Math.max.apply(null, numArray),
		getAbsNormalised: (array, max) => {
			// abs
			var abs = [];
			for (let i=0; i<array.length; i++) {
				abs[i] = Math.abs(array[i]);
			}

			var arrayMax = _.arrays.getMaxOfArray(abs);
			var normalised = [];
			for (let j=0; j<array.length; j++) {
				normalised[j] = max * Math.sqrt(abs[j] / arrayMax);
			}

			return normalised;
		},
	},
	isArray: array => Array.isArray(array),
	range: (start, end, step=1) => {
		var list = [];
		while (start < end) {
			list.push(start);
			start += step;
		}
		return list;
	},

	// objects
	isObject: obj => obj === Object(obj) && obj.length === undefined, // make sure it is not an array
	empty: obj => {
		for (var key in obj) {
			return false;
		}
		return true;
	},
	keys: obj => Object.keys(obj),
	m: (obj, ...rest) => {
		// merge objects, order indicates precedence
		obj = (obj || {});

		for (let i=0; i<rest.length; i++) {
			if (_.isObject(rest[i])) {
				for (let r in rest[i]) {
					obj[r] = r in obj ? _.m(obj[r], rest[i][r]) : rest[i][r];
				}
			} else {
				// if this happens, simply assign the value
				return rest[i];
			}
		}

		return obj;
	},
	items: (obj) => _.keys(obj).map(key => [key, obj[key]]),
	pair: obj => {
		var keys = _.keys(obj);
		if (keys.length === 1) {
			return [keys[0], obj[keys[0]]];
		}
	},

	// promises
	ep: input => new Promise((resolve, reject) => resolve(input)),
	all: (...args) => Promise.all(args),
	ordered: (first, ...rest) => rest.reduce((previous, current) => previous.then(current), first),

	// accept
	accept: (value, accept) => accept.indexOf(value) !== -1,

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
