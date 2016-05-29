
// autocomplete: false, filter: false, search: false
var targets = Object.keys(args.options.targets);
for (i=0; i<targets.length; i++) {
	var details = args.options.targets[targets[i]];
	var path = details.path !== undefined ? details.path() : '';
	var fltr = details.fltr !== undefined ? {options: {filter: details.fltr()}} : {};

	// Context
	if (details.path !== undefined) {
		Context.get(path, fltr).then(details.process).then(function (results) {
			results.forEach(args.options.display.list(list));
		});
	}
}


// get only active filter
var path = filter.active.path !== undefined ? filter.active.path() : '';
var fltr = filter.active.fltr !== undefined ? {options: {filter: filter.active.fltr()}} : {};

// Context
if (filter.active.path !== undefined) {
	Context.get(path, fltr).then(filter.active.process).then(function (results) {
		results.filter(function (result) {
			// apply actual filter
			return result.main.indexOf(query) !== -1;
		}).forEach(args.options.display.list(list, query));
	});
}


// display only defaults
for (i=0; i<filter.defaults.length; i++) {
	var details = args.options.targets[filter.defaults[i]];
	var path = details.path !== undefined ? details.path() : '';
	var fltr = details.fltr !== undefined ? {options: {filter: details.fltr()}} : {};

	// Context
	if (details.path !== undefined) {
		Context.get(path, fltr).then(details.process).then(function (results) {
			results.filter(function (result) {
				// apply actual filter
				return result.main.indexOf(query) !== -1;
			}).forEach(args.options.display.list(list, query));
		});
	}
}


// display everything
var targets = Object.keys(args.options.targets);
for (i=0; i<targets.length; i++) {
	var details = args.options.targets[targets[i]];
	var path = details.path !== undefined ? details.path() : '';
	var fltr = details.fltr !== undefined ? {options: {filter: details.fltr()}} : {};

	// Context
	if (details.path !== undefined) {
		Context.get(path, fltr).then(details.process).then(function (results) {
			results.filter(function (result) {
				return result.main.indexOf(query) !== -1;
			}).forEach(args.options.display.list(list, query));
		});
	}
}


var targets = Object.keys(args.options.targets);
for (i=0; i<targets.length; i++) {
	var details = args.options.targets[targets[i]];
	var fltr = details.fltr !== undefined ? {options: {filter: details.fltr()}} : {};

	// Context
	if (details.path !== undefined) {
		Context.get(details.path(), fltr).then(details.process).then(function (results) {
			results.forEach(args.options.display.list(list));
		});
	}
}

var display = function () {
	
}
