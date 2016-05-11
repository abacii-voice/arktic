// UI: This is the UI definition. It is ignorant of the data passing through the app.
var UI = {
	// GLOBAL STATE
	// store current global state
	globalState: undefined,

	// global state array

	// createGlobalState
	// createGlobalStates
	// changeGlobalState

	// COMPONENT
	// components
	// getComponent
	// component
	// createComponent
	// removeComponent
	// createApp
	// renderApp

	// HEADS
	// STATES
	// TAILS
	// REGISTRY

	// TEMPLATES
	// FUNCTIONS
}

// CONTEXT
// The Context stores a sample of data from the server. It can be accessed using a path. The same path can access the same data on the server.
var Context = {
	// STORE
	// This object stores the entire context and can be set and reset by the Context methods.
	// This contains only data from the server. Any locally created content such as temporary objects
	// is stored in Active.
	context: {},

	// GET
	// This will get from the current store. If it does not exist, a request will be made for it. This will trigger registry.
	get: function (path, args) {
		// force load from the server?
		force = args !== undefined ? (args.force !== undefined ? args.force : false) : false;
		callback = args !== undefined ? (args.callback !== undefined ? args.callback : undefined) : undefined;

		// proceed to get from context object
		context_path = path.split('.');
		sub = Context.context;
		if (context_path[0] !== '') {
			for (i=0; i<context_path.length; i++) {
				sub = sub[context_path[i]];
				if (sub === undefined) {
					break;
				}
			}
		} else {
			sub = Object.keys(sub).length !== 0 ? sub : undefined; // empty context
		}

		// return loaded data if necessary
		if (sub === undefined || force) {
			$.when(Context.load(path)).done(function () {
				callback(Context.get(path));
			});
		} else {
			return sub;
		}
	},

	// The load method gets the requested path from the server if it does not exist locally.
	// This operation can be forced from the get method.
	load: function (path) {
		var ajax_data = {
			type: 'post',
			data: Permission.permit(),
			url: '/context/{path}'.format({path: path}),
			success: function (data, textStatus, XMLHttpRequest) {
				Context.set(path, data);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				if (xhr.status === 404 || xhr.status === 0) {
					Context.load(path);
				}
			}
		}

		return $.ajax(ajax_data);
	},

	// SET
	// Sets the value of a path in the store. If the value changes, a request is sent to change this piece of data.
	set: function (path, value) {
		context_path = path.split('.');
		sub = Context.context;
		if (context_path[0] !== '') {
			for (i=0; i<context_path.length; i++) {
				if (i+1 === context_path.length) {
					sub[context_path[i]] = value;
				} else {
					if (sub[context_path[i]] === undefined) {
						sub[context_path[i]] = {};
					}
				}
				sub = sub[context_path[i]];
			}
		} else {
			Context.context = value;
		}

		// trigger registry
		Registry.trigger(path);
	},
}

// ACTIVE
// Active stores temporary variables that need to be synthesized using a series of temporally disconnected events, such as upload.
var Active = {
	active: {},

	// get
	get: function (path) {
		context_path = path.split('.');
		sub = Active.active;
		for (i=0; i<context_path.length; i++) {
			sub = sub[context_path[i]];
			if (sub === undefined) {
				break;
			}
		}

		return sub !== undefined ? sub : '';
	},

	// set
	set: function (path, value) {
		context_path = path.split('.');
		sub = Context.context;
		for (i=0; i<context_path.length; i++) {
			if (i+1 === context_path.length) {
				sub[context_path[i]] = value;
			} else {
				if (sub[context_path[i]] === undefined) {
					sub[context_path[i]] = {};
				}
			}
			sub = sub[context_path[i]];
		}
	},

	// COMMANDS
	// A set of commands that are sent with permission data.
	commands: {
		sendWhatever: function () {

		},
		abstract: function (name, data, callback, args) {
			args = args !== undefined ? args : {};
			var ajax_params = {
				type: 'post',
				data: Permission.permit(data),
				processData: args.processData !== undefined ? args.processData : true,
				contentType: args.contentType !== undefined ? args.contentType : 'application/x-www-form-urlencoded',
				url:'/command/{name}/'.format({name: name}),
				success: function (data, textStatus, XMLHttpRequest) {
					callback(data);
				},
				error: function (xhr, ajaxOptions, thrownError) {
					if (xhr.status === 404 || xhr.status === 0) {
						Active.commands.abstract(name, data, callback, args);
					}
				},
			};

			return $.ajax(ajax_params); // this is a promise
		},
	}
}

// PERMISSION
// Works the same way as active but stores only the permission information needed to specify the user, role, and client.
var Permission = {
	// stores relevant permission details
	permission: {
		// role_type: 'admin',
		// client_id: '6f56a306-cfa9-4557-bec9-f65bd2de67e0',
		role_type: '',
		client_id: '',
	},

	get: function () {
		return Permission.permission;
	},

	set: function (value, key) {
		if (key !== undefined) {
			Permission.permission[key] = value;
		} else {
			Permission.permission = value;
		}
	},

	// appends permission details to an object to be passed as data
	permit: function (data) {
		// set
		data = data !== undefined ? data : {};
		data.permission = Permission.permission;
		return JSON.stringify(data);
	}
}

// ACTION
// Stores a record of the actions performed by the user and relays them to the server.
var Action = {
	actions: {},
}

// REGISTRY
// Keeps a record of the state dependent paths that objects are waiting for. Updates them when data arrives in Context.
var Registry = {
	registry: {},

	// register an object with a state, path, and function
	register: function (component, state, path, fn) {
		context_path = path.split('.');

		// add state if necessary
		if (Registry.registry[state] === undefined) {
			Registry.registry[state] = {};
		}
		sub = Registry.registry[state];

		for (i=0; i<context_path.length; i++) {
			if (i+1 === context_path.length) {
				if (sub[context_path[i]] === undefined) {
					sub[context_path[i]] = {
						registered: {},
					};
					sub[context_path[i]].registered[component.id] = fn;
				} else {
					sub[context_path[i]].registered[component.id] = fn;
				}
			} else {
				if (sub[context_path[i]] === undefined) {
					sub[context_path[i]] = {
						'registered': {},
					};
				}
			}
			sub = sub[context_path[i]];
		}
	},

	// finds registry entries in the current state with the given path and runs their stored methods.
	trigger: function (path) {
		context_path = path.split('.');

		// this works roughly like the get method in the rest of the structures.
		sub = Registry.registry[state];
		for (i=0; i<context_path.length; i++) {
			sub = sub[context_path[i]];
			if (sub === undefined) {
				break;
			}
		}

		// get list of components and their methods from sub
		// 1. trigger all objects with exactly this path (easiest)?
		// 2. trigger all objects with paths below this one (pretty hard)?
		// For now: exact path. I will do all below if it proves useful.

		if (sub.registered !== undefined) {
			Object.keys(sub.registered).forEach(function (componentId) {
				var component = UI.getComponent(componentId);
				var fn = sub.registered[componentId];
				fn(component);
			});
		}
	},

	get: function (path) {
		context_path = path.split('.');
		sub = Context.context;
		for (i=0; i<context_path.length; i++) {
			sub = sub[context_path[i]];
			if (sub === undefined) {
				break;
			}
		}

		return sub;
	},
}
