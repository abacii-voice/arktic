// UI: This is the UI definition. It should be 100% ignorant of the actual data passing through the app
// (other than the structure of the components). It is not responsible for the context of the
// interface, only the definitions of what is where, when.

var UI = {
	////////////
	// GLOBAL STATE
	// stores current global state
	globalState: undefined,

	// stores list of possible global states. These constrain any states submitted by components.
	globalStates: [],

	// shortcut to create a global state
	createGlobalState: function (stateName) {
		if (this.globalStates.indexOf(stateName) === -1) {
			this.globalStates.push(stateName);
			this.states[stateName] = []; // initialise arrays
			this.svitches[stateName] = [];
		}
	},

	// create multiple global states with an array
	createGlobalStates: function (homeState, stateNames) {
		this.globalState = homeState;
		stateNames.shift(homeState);
		stateNames.map(createGlobalState, this);
	},

	// A change of global state that is broadcast to the components that need to respond.
	changeState: function (stateName) {
		if (this.globalStates.indexOf(stateName) !== -1) {
			// update global state
			this.globalState = stateName;

			// execute all svitches with a promise
			var svitchPromise = new Promise(function () {
				UI.svitches[stateName].map(function (svitch) {
					svitch.fn(svitch.component);
				});
			});

			// when svitches are complete, change the state of every component with the state name
			var stateFunction = function () {
				UI.states[stateName].map(function (state) {
					state.component.changeState(state);
				});
			}

			// execute
			$.when(svitchPromise).done(stateFunction);
		}
	},

	// A chain of broadcasts made with a delay between them.
	// If one delay is given, it will be used for all calls. If more than N-1 delays are given,
	// only the first N-1 are used. Where N is the number of states.
	chainStates: function (stateNames, delays) {

	}

	////////////
	// COMPONENT
	// List of components stored by id
	components: {},
	getComponent: function (componentId) {
		return this.components[componentId];
	}

	// Basic component definition
	component: function (id, args) {
		// the variable 'this' refers to an instance of this function when called with 'new component()'

		// id
		this.id = id;

		// args
		// The structure of this is not too important, but it should stay like this:
		// (id, { // <- args variable
		// 	root: '',
		// 	properties: {
		// 		props: {},
		// 		template: UI.templates.*,
		// 		html: '',
		// 		classes: [],
		// 		style: {},
		// 		states: [],
		// 		svtiches: [],
		// 		stateMap: {},
		// 		click: function () {},
		// 	},
		// 	children: [],
		// })

		// root
		this.root = args.root;

		// static properties
		this.props = args.properties.props;

		// rendered with template
		this.template = args.properties.template;
		this.html = args.properties.html;
		this.classes = args.properties.classes;
		this.style = args.properties.style;

		// states
		if (args.properties.states !== undefined) {
			this.states = args.properties.states.map(function (state) {
				return UI.createState(this, state.name, state.args);
			}, this);
		}

		if (args.properties.svtiches !== undefined) {
			this.svitches = args.properties.svitches.map(function (svitch) {
				return UI.createSvitch(this, svitch.stateName, svitch.fn);
			});
		}

		this.stateMap = args.properties.stateMap;

		// children
		this.children = args.children;

		// bindings
		this.click = args.click;

		///////////////
		// PRE-PROCESSING
		// model
		this.model = function () {
			return $('#{id}'.format({id: this.id}));
		}

		// render
		this.render = function () {
			// 1. root
			var root = $('#{id}'.format({id: this.root}));

			// 2. render template
			var renderedTemplate = this.template.format({
				id: this.id,
				classes: formatClasses(this.classes),
				style: formatStyle(this.style),
				html: this.html,
			});

			// 3. Add element to the DOM under root.
			if (root.children().length !== 0) {
				root.children().last().after(renderedTemplate); // add as last child
			} else {
				root.html(renderedTemplate);
			}

			// 4. add bindings
			if (this.click !== undefined) {
				var _this = this;

				_this.model().on('click', function () {
					_this.click(_this);
				});
			}

			// 5. render children
			if (this.children !== undefined) {
				this.children.map(this.renderChild, this);
			}
		}

		// render child
		this.renderChild = function (child) {
			child.root = this.id;
			child.render();
		}

		///////////////
		// STATE CHANGES
		// change state
		this.changeState = function (stateName) {
			// 1. set new state
			this.state = this.getState(stateName);

			// 2. get model
			var model = this.model();

			// 3. add classes
			var classes = this.state.classes !== undefined ? this.state.classes : this.classes;
			model.addClass(formatClasses(classes));

			// 4. add style
			var style = this.state.style !== undefined ? this.state.style : this.style;
			model.animate(style);

			// 5. add html
			if (this.state.html !== undefined) {
				model.html(this.state.html);
			}

			// 6. perform action
			if (this.state.fn !== undefined) {
				this.state.fn(this);
			}
		}

		this.mapState = function (stateName) {
			return this.stateMap[stateName] !== undefined ? this.stateMap[stateName] : '';
		}

		///////////////
		// UTILITY
		// get state
		this.getState = function (stateName) {
			return this.states.filter(function (state) {
				return state.name === stateName;
			})[0];
		}

	},

	// component factory
	createComponent: function (id, args) {
		var component = new this.component(id, args);
		components[id] = component;
		return component;
	}

	////////////
	// COMPONENT STATE
	// States grouped by name
	states: {},

	// Basic state definition
	state: function (component, name, args) {
		this.component = component;
		this.name = name;

		// args
		this.classes = args.classes;
		this.style = args.style;
		this.html = args.html;
		this.fn = args.fn;
	}

	// state factory
	createState: function (component, name, args) {
		var state = new this.state(component, name, args);
		this.states[name].push(state);
		return state;
	}

	////////////
	// COMPONENT SVITCH
	// Svitches are specific actions that must be carried out before a particular state change, such as a server API call.
	// A svitch can be used to access its component or state or be filtered by state name
	svitches: {},

	// Svitch definition
	svitch: function (component, stateName, fn) {
		this.component = component;
		this.stateName = stateName;
		this.fn = fn;
	},

	// svitch factory
	createSvitch: function (component, state, fn) {
		var svitch = new this.svitch(component, stateName, fn);
		this.svitches[stateName].push(svitch);
		return svitch;
	},

	////////////
	// COMPONENT TEMPLATES
	//
	templates: {
		sidebar: `
			<div id='{id}' class='sidebar {classes}' style='{style}'></div>
		`,
		contentPanel: `
			<div id='{id}' class='content-panel {classes}' style='{style}'>
				{html}
			</div>
		`,
		button: `
			<div id={id} class='btn btn-default {classes}' style='{style}'>
				{html}
			</div>
		`,
		div: `
			<div id={id}></div>
		`,
	}

}

// CONTEXT: This is the context definition. It is a local storage of the relevant variables from
// the server used to display the interface. It should make direct calls to the server API to gather data.

var Context = {
	////////////
	// STORE
	// The variable extracted from the server API call. All parsing of its meaning is done by the specific
	// UI script for each page.
	store: {},
	get: function (args) {
		// based on a string of parameters, access a value or other sub-structure from store.
		sub = this.store;
		var i;
		for (i=0; i<args.length, i++) {
			sub = sub[args[i]]
		}
	}

	// define update function for context along with triggers and anything else.
	fn: undefined,
	setFn: function (fn) {
		this.fn = fn;
	},

	// A custom function can be defined to update the store and even trigger a state based on the result.
	update: function (args) {
		this.fn(args); // args is not intended to be new data. This functionality should be encoded in this.fn.
	},
}
