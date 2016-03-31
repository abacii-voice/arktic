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
			this.states[stateName] = [];
			this.svitches[stateName] = [];
		}
	},

	// create multiple global states with an array
	createGlobalStates: function (homeState, stateNames) {
		this.globalState = homeState;
		stateNames.unshift(homeState);
		stateNames.map(this.createGlobalState, this);
	},

	// A change of global state that is broadcast to the components that need to respond.
	changeState: function (stateName, trigger) {
		if (this.globalStates.indexOf(stateName) !== -1) {
			// update global state
			var stateChangePromise = new Promise(function (resolve, reject) {
				UI.globalState = stateName;
			});

			// global svitches promise
			var globalSvitchPromise = new Promise(function (resolve, reject) {
				if (UI.globalSvitches[stateName] !== undefined) {
					UI.globalSvitches[stateName].map(function (globalSvitch) {
						globalSvitch.fn(stateName);
					});
				}
			});

			// execute all component svitches with a promise
			var componentSvitchPromise = new Promise(function (resolve, reject) {
				UI.svitches[stateName].filter(function (svitch) {
					return svitch.component.id === trigger;
				}).forEach(function (svitch) {
					svitch.fn(svitch.component);
				});
			});

			// when svitches are complete, change the state of every component with the state name
			var statePromise = new Promise(function (resolve, reject) {
				UI.states[stateName].map(function (state) {
					state.component.changeState(state);
				});
			});

			// execute
			stateChangePromise.then(function () {
				return globalSvitchPromise;
			}).then(function () {
				return svitchPromise;
			}).then(function () {
				return statePromise;
			});
		}
	},

	// A chain of broadcasts made with a delay between them.
	// If one delay is given, it will be used for all calls. If more than N-1 delays are given,
	// only the first N-1 are used. Where N is the number of states.
	chainStates: function (stateNames, delays) {

	},

	////////////
	// COMPONENT
	// List of components stored by id
	components: {},
	getComponent: function (componentId) {
		return this.components[componentId];
	},

	// Basic component definition
	component: function (id, args) {
		var args = args !== undefined ? args : {};
		// the variable 'this' refers to an instance of this function when called with 'new component()'
		// args
		// The structure of this is not too important, but it should stay like this:
		//
		// (id, { // <- args variable
		// 	root: '',
		// 	template: UI.templates.*,
		// 	appearance: {
		// 		html: '',
		// 		classes: [],
		// 		style: {},
		// 	},
		// 	state: {
		// 		states: [],
		// 		svitches: [],
		// 		stateMap: {},
		// 	},
		// 	registry: {
		// 		path: [],
		// 		fn: function () {},
		// 	},
		// 	properties: {},
		// 	bindings: [
		// 		{
		// 			name: 'click',
		// 			fn: function () {},
		// 		}
		// 	],
		// 	children: [],
		// })

		///////////////
		// METHODS
		// update
		this.setId = function (id) {
			var currentId = this.id;
			var model = this.model();
			this.id = id !== undefined ? id : currentId;

			// handle any changes
			if (this.id !== currentId && this.rendered) {
				// 1. change model id
				model.attr('id', this.id);

				// 2. swap key in UI.components object
				UI.components[this.id] = UI.components[currentId];
				delete UI.components[currentId];

				// 3. remove old from parent children
				delete this.parent().children[currentId];
			}
		}

		this.setRoot = function (root) {
			var currentRoot = this.root !== undefined ? this.root : 'hook';
			this.root = root !== undefined ? root : currentRoot;

			if (this.rendered && this.root !== currentRoot) {
				var newRoot = $('#{id}'.format({id: this.root}));
				this.model().appendTo(newRoot);
				UI.getComponent(this.root).children[this.id] = this;
			}
		}

		this.setAfter = function (after) {
			var currentAfter;
			if (this.rendered) {
				// find previous child

			} else {

			}
		}

		this.setTemplate = function (template) {
			var currentTemplate = this.template !== undefined ? this.template : UI.templates.div;
			this.template = template !== undefined ? template : currentTemplate;
		}

		this.setAppearance = function (appearance) {
			var currentProperties = this.properties !== undefined ? this.properties : {};
			var currentClasses = this.classes !== undefined ? this.classes : [];
			var currentStyle = this.style !== undefined ? this.style : {};

			if (appearance !== undefined) {
				this.properties = appearance.properties !== undefined ? appearance.properties : currentProperties;
				this.html = appearance.html !== undefined ? appearance.html : this.html;
				this.classes = appearance.classes !== undefined ? appearance.classes : currentClasses;
				this.style = appearance.style !== undefined ? appearance.style : currentStyle;
			}

			if (this.rendered) {
				// model
				var model = this.model();

				// properties
				var _this = this;
				Object.keys(this.properties).forEach(function (property) {
					model.attr(property, _this.properties[property]);
				});

				// html
				model.html(this.html);

				// classes
				if (_this.classes !== undefined) {
					// remove current classes that are not the new classes variable
					currentClasses.filter(function (className) {
						return _this.classes.indexOf(className) === -1;
					}).forEach(function (className) {
						model.removeClass(className);
					});

					// add new classes
					_this.classes.forEach(function (className) {
						model.addClass(className);
					});
				}

				// style
				model.css(this.style);
			}
		}

		this.getState = function (stateName) {
			return this.states().filter(function (state) {
				return state.name === stateName;
			})[0];
		};

		this.setState = function (argsState) {
			if (argsState !== undefined) {
				// default state
				var currentDefaultState = this.defaultState !== undefined ? this.defaultState : {};
				this.defaultState = argsState.defaultState !== undefined ? argsState.defaultState : currentDefaultState;

				// states
				this.addStates(argsState.states);

				// svitches
				this.addSvitches(argsState.svitches);

				// state map
				this.addStateMap(argsState.stateMap);
			}
		}

		this.addStates = function (states) {
			if (states !== undefined) {
				states.forEach(this.addState, this);

				if (this.state === undefined) {
					this.state = this.getState(UI.globalState);
					if (this.state !== undefined) {
						this.stateClasses = this.state.classes !== undefined ? this.state.classes : [];
						this.stateStyle = this.state.style !== undefined ? this.state.style : {};
					}
				}
			}
		}

		this.addState = function (statePrototype) {
			// get conflicts
			var conflictStates = this.states().filter(function (stateInstance) {
				return stateInstance.name === statePrototype.name;
			});

			if (conflictStates.length !== 0) {
				// replace current state -> delete from global list
				UI.removeState(conflictStates[0]);
			}

			// add as new state
			UI.createState(this, statePrototype.name, statePrototype.args);
		}

		this.states = function () {
			var _this = this;
			return UI.allStates().filter(function (state) {
				return state.component.id === _this.id;
			});
		}

		this.addSvitches = function (svitches) {
			if (svitches !== undefined) {
				svitches.forEach(this.addSvitch, this);
			}
		}

		this.addSvitch = function (svitchPrototype) {
			// get conflicts
			var conflictSvitches = this.svitches().filter(function (svitchInstance) {
				return svitchInstance.stateName === svitchPrototype.stateName;
			});

			if (conflictSvitches.length !== 0) {
				// replace current state -> delete from global list
				UI.removeSvitch(conflictSvitches[0]);
			}

			// add as new svitch
			UI.createSvitch(this, svitchPrototype.stateName, svitchPrototype.fn);
		}

		this.svitches = function () {
			return UI.allSvitches().filter(function (svitch) {
				return svitch.component.id === this.id;
			});
		}

		this.addStateMap = function (stateMap) {
			this.stateMap = this.stateMap !== undefined ? this.stateMap : {};

			if (stateMap !== undefined) {
				if (typeof stateMap === 'string') {
					UI.globalStates.forEach(function (globalState) {
						this.stateMap[globalState] = stateMap;
					}, this);
				} else {
					Object.keys(stateMap).forEach(function (stateName) {
						this.stateMap[stateName] = stateMap[stateName];
					}, this);
				}
			}
		}

		this.setRegistry = function (registry) {
			if (registry !== undefined) {
				// vars
				this.registryPath = registry.path; // a function that generates an array of args
				this.registryResponse = registry.fn;

				// register
				Context.register(this.id, this.registryPath);
			}
		}

		this.setBindings = function (bindings) {
			this.bindings = this.bindings !== undefined ? this.bindings : {};
			if (bindings !== undefined) {
				bindings.forEach(function (binding) {
					// 1. determine if binding with the same name is in the current array
					this.bindings[binding.name] = binding.fn;

					// 2. if rendered, add to model
					if (this.rendered) {
						var _this = this;
						this.model().on(binding.name, function () {
							binding.fn(_this);
						});
						console.log(this.id, $._data(this.model()[0], 'events'));
					}
				}, this);
			}
		}

		this.setChildren = function (children) {
			this.children = this.children !== undefined ? this.children : {};
			if (children !== undefined) {
				children.forEach(function (child) {
					this.children[child.id] = child;

					if (this.rendered) {
						child.root = this.id;
						this.renderChild(child.id);
					}
				}, this);
			}
		}

		this.update = function (args) {
			// id, root, after, template
			this.setId(args.id);
			this.setRoot(args.root);
			this.setAfter(args.after);
			this.setTemplate(args.template);

			// appearance
			this.setAppearance(args.appearance);

			// state
			this.setState(args.state);

			// registry
			this.setRegistry(args.registry);

			// bindings
			this.setBindings(args.bindings);

			// children
			this.setChildren(args.children);
		}

		// model
		this.model = function () {
			return $('#{id}'.format({id: this.id}));
		}

		// render
		this.renderChild = function (childId) {
			var child = this.children[childId];
			child.root = this.id;
			child.render();
		}

		this.render = function () {
			// 1. root
			var root = $('#{id}'.format({id: this.root}));

			// 2. render template
			var classes = this.classes !== undefined ? this.classes : [];
			var style = this.style !== undefined ? this.style : {};
			var properties = this.properties != undefined ? this.properties : {};
			var html = this.html !== undefined ? this.html : '';
			var renderedTemplate = this.template.format({
				id: this.id,
				classes: formatClasses(classes),
				style: formatStyle(style),
				properties: formatProperties(properties),
				html: html,
			});

			// 3. Add element to the DOM under root.
			if (root.children().length !== 0) {
				root.children().last().after(renderedTemplate); // add as last child
			} else {
				root.html(renderedTemplate);
			}

			// 4. Add classes and style of initial state
			var model = this.model();
			if (this.state !== undefined) {
				this.stateClasses.forEach(function (stateClass) {
					model.addClass(stateClass);
				});
				model.css(this.stateStyle);
			}

			// 5. render children
			Object.keys(this.children).forEach(this.renderChild, this);

			// 6. add bindings
			var _this = this;
			Object.keys(this.bindings).forEach(function (bindingName) {
				var fn = _this.bindings[bindingName];
				model.on(bindingName, function () {
					fn(_this);
				});
			});

			// 7. set rendered
			this.rendered = true;
		}

		// parent
		this.parent = function () {
			return UI.getComponent(this.root);
		}

		///////////////
		// STATE CHANGES
		// change state
		this.changeState = function (state) {
			// 1. set new state
			this.state = state;

			// 2. get model
			var _this = this;
			var model = _this.model();

			// pre-fn promise
			var preFnPromise = new Promise(function (resolve, reject) {
				if (_this.state.preFn !== undefined) {
					_this.state.preFn(_this);
				}
			});

			// style promise
			var stylePromise = new Promise(function (resolve, reject) {
				// add classes
				_this.stateClasses.map(function (className) {
					model.removeClass(className);
				});

				_this.stateClasses = _this.state.classes !== undefined ? _this.state.classes : [];
				_this.stateClasses.map(function (className) {
					model.addClass(className);
				});

				// add html
				if (_this.state.html !== undefined) {
					model.html(_this.state.html);
				}

				// animate style
				_this.stateStyle = _this.state.style !== undefined ? _this.state.style : {};
				model.css(_this.stateStyle);
			});

			var fnPromise = new Promise(function (resolve, reject) {
				if (_this.state.fn !== undefined) {
					_this.state.fn(_this);
				}
			});

			// execute
			preFnPromise.then(function () {
				return stylePromise;
			}).then(function () {
				return fnPromise;
			});
		}

		this.mapState = function (stateName) {
			return this.stateMap[stateName] !== undefined ? this.stateMap[stateName] : '';
		}

		this.triggerState = function () {
			UI.changeState(this.mapState(UI.globalState), this.id);
		}

		// initialise
		this.id = id;
		this.rendered = false; // establish whether or not the component has been rendered to the DOM.
		this.update(args);
	},

	// component factory
	createComponent: function (id, args) {
		var component = new this.component(id, args);
		this.components[id] = component;
		return component;
	},

	removeComponent: function (id) {
		var component = this.getComponent(id);
		// remove from Context registry
		Context.remove(component.id);

		// remove all bindings
		Object.keys(component.bindings).forEach(function (bindingName) {
			component.model().off(bindingName);
		}, component);

		// remove children recursively
		Object.keys(component.children).forEach(function (childId) {
			UI.removeComponent(childId);
		});

		// remove model from DOM
		component.model().remove();

		// remove component from components
		delete this.components[id];
	},

	createApp: function (root, children) {
		var id = 'app';
		var args = {
			root: root,
			template: UI.templates.div,
			children: children,
		};

		this.createComponent(id, args);
	},

	renderApp: function () {
		var app = this.getComponent('app');
		app.render();
		this.changeState(this.globalState);
	},

	////////////
	// COMPONENT STATE
	// States grouped by name
	states: {},

	allStates: function () {
		var stateArray = [];
		this.globalStates.forEach(function (globalState) {
			this.states[globalState].forEach(function (state) {
				stateArray.push(state);
			}, this);
		}, this);
		return stateArray;
	},

	// Basic state definition
	state: function (component, name, args) {
		this.component = component;
		this.name = name;

		// args
		this.preFn = args.preFn;
		this.classes = args.classes;
		this.style = args.style;
		this.html = args.html;
		this.fn = args.fn;
	},

	// state factory
	createState: function (component, name, args) {
		var state;
		if (args === 'default') {
			state = new this.state(component, name, component.defaultState);
		} else {
			state = new this.state(component, name, args);
		}
		state.index = this.states[name].length - 1; // able to find state again
		this.states[name].push(state);
		return state;
	},

	////////////
	// COMPONENT SVITCH
	// Svitches are specific actions that must be carried out before a particular state change, such as a server API call.
	// A svitch can be used to access its component or state or be filtered by state name
	svitches: {},

	allSvitches: function () {
		var svitchArray = [];
		this.globalStates.forEach(function (globalState) {
			this.svitches[globalState].forEach(function (svitch) {
				svitchArray.push(svitch);
			}, this);
		}, this);
		return svitchArray;
	},

	// Svitch definition
	svitch: function (component, stateName, fn) {
		this.component = component;
		this.stateName = stateName;
		this.fn = fn;
	},

	// svitch factory
	createSvitch: function (component, stateName, fn) {
		var svitch = new this.svitch(component, stateName, fn);
		this.svitches[stateName].push(svitch);
		return svitch;
	},

	////////////
	// GLOBAL SVITCH
	// Global svitches are called before component svitches and are not specifically
	// connected with a component
	globalSvitches: [],

	globalSvitch: function (stateName, fn) {
		this.stateName = stateName;
		this.fn = fn;
	},

	createGlobalSvitches: function (stateName, fn) {
		var globalSvitch = new this.globalSvitch(stateName, fn);
		this.globalSvitches[stateName].push(globalSvitch);
		return globalSvitch;
	},

	////////////
	// COMPONENT TEMPLATES
	//
	templates: {
		button: `
			<div id={id} class='ie show button relative centred-horizontally {classes}' style='{style}' {properties}>
				{html}
			</div>
		`,
		div: `
			<div id='{id}' class='{classes}' style='{style}' {properties}>
				{html}
			</div>
		`,
		loadingIcon: `
			<div id='{id}' class='ie loading-icon show {classes}' style='{style}'>
				<img src='/static/img/loading-icon.gif' />
			</div>
		`,
	},

	template: function (type, initialClass) {
		return `<{type} id='{id}' class='{initialClass} {classes}' style='{style}' {properties}>{html}</{type}>`.format({
			type: type,
			id: '{id}',
			initialClass: initialClass !== undefined ? initialClass : '',
			classes: '{classes}',
			style: '{style}',
			properties: '{properties}',
			html: '{html}',
		});
	},

	////////////
	// STANDARD FUNCTIONS
	//

	functions: {
		activate: function (_this) {
			_this.model().css({'display': ' block'});
		},
		deactivate: function (_this) {
			_this.model().css({'display': 'none'});
		},
		triggerState: function (_this) {
			_this.triggerState();
		},
	},

}

// CONTEXT: This is the context definition. It is a local storage of the relevant variables from
// the server used to display the interface. It should make direct calls to the server API to gather data.

var Context = {
	////////////
	// STORE
	// The variable extracted from the server API call. All parsing of its meaning is done by the specific
	// UI script for each page.
	store: {},
	get: function () {
		// based on a string of parameters, access a value or other sub-structure from store.
		sub = this.store;
		var i;
		for (i=0; i<arguments.length; i++) {
			sub = sub[arguments[i]];
		}
		return sub;
	},

	set: function (key, value) {
		Context.store[key] = value;
	},

	del: function () {
		sub = this.store;
		var i;
		for (i=0; i<arguments.length; i++) {
			sub = sub[arguments[i]];
		}
		delete sub;
	},

	// REGISTRY
	// register elements that are requesting data and notify them of its arrival in the context variable.
	registry: {},
	// e.g.
	// registry: {
	// 	'element-id-1':['args','that','lead','to','data'],
	// }

	register: function (componentId, componentPath) {
		this.registry[componentId] = componentPath;
	},

	remove: function (componentId) {
		delete this.registry[componentId];
	},

	// define update function for context along with triggers and anything else.
	fn: undefined, // this must be a valid promise
	setFn: function (fn) {
		this.fn = fn;
	},

	// A custom function can be defined to update the store and even trigger a state based on the result.
	load: function () {
		$.when(this.fn).done(function () {
			// call back to every component that has registered
			Object.keys(Context.registry).map(function (registryId) {
				var component = UI.getComponent(registryId);
				var path = Context.registry[registryId];
				component.registryResponse(component, Context.get.apply(Context, path()));
			});
		});
	},

	// include new data in context
	update: function (data) {
		$.extend(true, Context.store, data);
	}
}
