// all purpose ajax
function ajax (url, data, callback) {

	var ajax_params = {
		type: 'post',
		data: data,
		url:'/commands/{url}/'.format({url: url}),
		success: function (data, textStatus, XMLHttpRequest) {
			callback(data);
		},
		error: function (xhr, ajaxOptions, thrownError) {
			if (xhr.status === 404 || xhr.status === 0) {
				ajax(url, data, callback);
			}
		}
	};

	return $.ajax(ajax_params);
};

// This is just polling.
function ajaxloop (url, data, repeatCallback, completionCondition, completionCallback) {
	function loopFunction () {
		setTimeout(function () {
			// run ajax call
			ajax(url, data, function (data) {
				if (completionCondition(data)) {
					completionCallback(data);
				} else {
					repeatCallback(data);
					loopFunction();
				}
			});
		}, 500);
	}

	loopFunction();
}

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
