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
	get: function (path, force) {
		// force load from the server?
		force = force !== undefined ? force : false;

		// proceed to get from context object
		path = path.split('.');
		sub = Context.context;
		for (i=0; i<path.length; i++) {
			sub = sub[path[i]];
			if (sub === undefined) {
				break;
			}
		}

		// return loaded data if necessary
		sub = sub !== undefined ? (force ? Context.load(path) : sub) : Context.load(path);
		return sub;
	},

	// The load method gets the requested path from the server if it does not exist locally.
	// This operation can be forced from the get method.
	load: function (path) {
		var ajax_data = {
			type: 'post',
			data: Permission.permit(),
			url: '/context/{path}'.format({path: path}),
			success: function (data, textStatus, XMLHttpRequest) {
				Registry.trigger(path);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				if (xhr.status === 404 || xhr.status === 0) {
					Context.load(path);
				}
			}
		}

		$.when($.ajax(ajax_data)).done();
	},

	// SET
	// Sets the value of a path in the store. If the value changes, a request is sent to change this piece of data.
	set: function (path, value) {

	},
}

// ACTIVE
// Active stores temporary variables that need to be synthesized using a series of temporally disconnected events, such as upload.
var Active = {
	active: {},

	// COMMANDS
	// A set of commands that are sent with permission data.
	commands: {
		sendWhatever: function () {

		},
		abstract: function () {

		},
	}
}

// PERMISSION
// Works the same way as active but stores only the permission information needed to specify the user, role, and client.
var Permission = {
	permission: {},
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
}
