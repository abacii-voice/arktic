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
			// add as new svitch
			UI.createSvitch(this, svitchPrototype.stateName, svitchPrototype.fn);
		}

		this.svitches = function () {
			var _this = this;
			return UI.allSvitches().filter(function (svitch) {
				return svitch.component.id === _this.id;
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
				// register
				Object.keys(registry).forEach(function (path) {
					Registry.set(path, registry[path]);
				});
			}
		}

		this.setBindings = function (bindings) {
			this.bindings = this.bindings !== undefined ? this.bindings : {};
			if (bindings !== undefined) {
				bindings.forEach(function (binding) {
					// 1. determine if binding with the same name is in the current array
					this.bindings[binding.name] = {fn: binding.fn};
					if (binding.fn2 !== undefined) {
						this.bindings[binding.name].fn2 = binding.fn2;
					}

					// 2. if rendered, add to model
					if (this.rendered) {
						var _this = this;
						if (binding.fn2 !== undefined) {
							this.model().on(binding.name, function () {
								binding.fn(_this);
							}, function () {
								binding.fn2(_this);
							});
						} else {
							this.model().on(binding.name, function () {
								binding.fn(_this);
							});
						}
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
				var fn = _this.bindings[bindingName].fn;
				var fn2 = _this.bindings[bindingName].fn2;

				if (fn2 !== undefined) {
					model.on(bindingName, function () {
						fn(_this);
					}, function () {
						fn2(_this);
					});
				} else {
					model.on(bindingName, function () {
						fn(_this);
					});
				}
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
		// remove from registry
		Registry.del(component.id);

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
			<div id='{id}' class='ie loading-icon centred {classes}' style='{style}'>
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
};

// CONTEXT: This is the context definition. It is a local storage of the relevant variables from
// the server used to display the interface. It should make direct calls to the server API to gather data.

var Context = {
	////////////
	// STORE
	// The variable extracted from the server API call. All parsing of its meaning is done by the specific
	// UI script for each page.
	store: {},

	// based on a string of parameters, access a value or other sub-structure from store.
	get: function (path) {
		path = path.split('.');
		sub = this.store;
		for (i=0; i<path.length; i++) {
			sub = sub[path[i]];
			if (sub === undefined) {
				break;
			}
		}
		return sub !== undefined ? sub : '';
	},

	// insert into Context and trigger registry entries
	set: function (path, value) {
		path = path.split('.');
		sub = this.store;
		for (i=0; i<path.length; i++) {
			if (i+1 === path.length) {
				sub[path[i]] = value;
			} else {
				if (sub[path[i]] === undefined) {
					sub[path[i]] = {};
				}
			}
			sub = sub[path[i]];
		}

		// find registry entries at or below this path
		var ids = Registry.get(path);
		Object.keys(ids).forEach(function (id) {
			ids[id](UI.getComponent(id));
		});
	},

	// remove from Context variable
	del: function (path) {
		path = path.split('.');
		sub = this.store;
		for (i=0; i<path.length; i++) {
			if (i+1 === path.length) {
				delete sub[path[i]];
			}
			sub = sub[path[i]];
		}
	},

	// load a path from the server
	load: function (path) {
		// loads data from the server using the given path
		Context.getdata(path, {}, function (data) {
			// the data is then inserted into the same path in Context.
			Context.set(path, data);
		});
	},

	// DATA METHODS
	// get and set data on the server
	getdata: function (path, data, callback) {
		// fetch data from the context url
		var ajax_params = {
			type: 'post',
			data: Context.ajaxdata(data),
			url:'/data/context/{path}'.format({path: path}),
			success: function (data, textStatus, XMLHttpRequest) {
				callback(data);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				if (xhr.status === 404 || xhr.status === 0) {
					Context.getdata(path, data, callback);
				}
			}
		};

		return $.ajax(ajax_params); // this is a promise
	},

	// call command
	command: function (name, data, callback, args) {
		args = args !== undefined ? args : {};
		var ajax_params = {
			type: 'post',
			data: Context.ajaxdata(data),
			processData: args.processData !== undefined ? args.processData : true,
			contentType: args.contentType !== undefined ? args.contentType : 'application/x-www-form-urlencoded',
			url:'/command/{name}/'.format({name: name}),
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
	},

	// register action
	action: function (name, data) {
		var ajax_params = {
			type: 'post',
			data: Context.ajaxdata(data),
			url:'/action/{name}/'.format({name: name}),
			success: function (data, textStatus, XMLHttpRequest) {},
			error: function (xhr, ajaxOptions, thrownError) {
				if (xhr.status === 404 || xhr.status === 0) {
					action(name, data);
				}
			}
		};

		return $.ajax(ajax_params); // this is a promise
	},

	// format data with the necessary permission variables
	ajaxdata: function (data) {
		var ajaxdata = {
			'client': Context.get('active.client'),
			'role': Context.get('active.role'),
		};

		$.extend(true, data, ajaxdata);
		return data;
	},
};

// REGISTRY
// register elements that are requesting data and notify them of its arrival in the context variable.
var Registry = {
	// this is a copy of the Context.store variable with functions instead of data
	store: {},

	get: function (path) {
		// based on a string of parameters, access a value or other sub-structure from store.
		path = path.split('.');
		sub = Registry.store;
		for (i=0; i<path.length; i++) {
			sub = sub[path[i]];
			if (sub === undefined) {
				break;
			}
		}
		var result = sub !== undefined ? sub : {};
		return Object.keys(result).filter(function (idTest) {
			return idTest.substring(0,2) === 'id';
		}).map(function (id) {
			return result[id];
		});
	},

	set: function (path, value) {
		path = path.split('.');
		sub = Registry.store;
		for (i=0; i<path.length; i++) {
			if (i+1 === path.length) {
				sub['id:{id}'.format({id: path[i]})] = value;
			} else {
				if (sub[path[i]] === undefined) {
					sub[path[i]] = {};
				}
			}
			sub = sub[path[i]];
		}
	},

	del: function (id) {

	},
};
