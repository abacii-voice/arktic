// call command
function command (name, data, callback) {
	var ajax_params = {
		type: 'post',
		data: data,
		url:'/commands/{name}/'.format({name: name}),
		success: function (data, textStatus, XMLHttpRequest) {
			callback(data);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			if (xhr.status === 404 || xhr.status === 0) {
				command(name, data, callback);
			}
		}
	};

	return $.ajax(ajax_params); // this is a promise
};

// request data
function data (name, data, callback) {
	var ajax_params = {
		type: 'post',
		data: data,
		url:'/action/{name}/'.format({name: name}),
		success: function (data, textStatus, XMLHttpRequest) {
			callback(data);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			if (xhr.status === 404 || xhr.status === 0) {
				command(name, data, callback);
			}
		}
	};

	return $.ajax(ajax_params); // this is a promise
};

// perform action
function action (name, data, callback) {
	var ajax_params = {
		type: 'post',
		data: data,
		url:'/commands/{name}/'.format({name: name}),
		success: function (data, textStatus, XMLHttpRequest) {
			callback(data);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			if (xhr.status === 404 || xhr.status === 0) {
				command(name, data, callback);
			}
		}
	};

	return $.ajax(ajax_params); // this is a promise
};

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
		return classes.join(' ');
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
	return  isTooLong ? s_ + '&hellip;' : s_;
};

// gives filename without directories
function basename(str) {
	var base = new String(str).substring(str.lastIndexOf('/') + 1);
	return base;
}
