// UI: This is the UI definition. It is ignorant of the data passing through the app.
var UI = {
	// GLOBAL STATE
	// store current global state
	// This is a path like 'client-state.reload' -> later, James.
	globalState: undefined,

	// changeState
	changeState: function (stateName, trigger) {
		return new Promise(function(resolve, reject) {
			UI.globalState = stateName;
			resolve();
		}).then(function () {
			return Registry.trigger();
		}).then(function () {
			return Promise.all(UI.states.filter(function (state) {
				return state.name === UI.globalState;
			}).map(function (state) {
				return new Promise(function(resolve, reject) {
					state.component.changeState(UI.globalState);
					resolve();
				});
			}));
		});
	},

	// COMPONENT
	// components
	components: {},

	// getComponent
	getComponent: function (id) {
		return new Promise(function(resolve, reject) {
			resolve(UI.components[id]);
		});
	},

	// component
	component: function (id, args) {
		// set args if none exists
		var args = args !== undefined ? args : {};

		// METHODS
		// identity
		this.setId = function (id) {
			var currentId = this.id;
			this.id = id !== undefined ? id : currentId;

			// handle any changes
			if (this.id !== currentId && this.rendered) {
				var model = this.model();

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

			if (this.root !== currentRoot && this.rendered) {
				var newRoot = $('#{id}'.format({id: this.root}));
				this.model().appendTo(newRoot);

				// add to new root
				UI.getComponent(this.root).children[this.id] = this;

				// remove from old root
				delete UI.getComponent(currentRoot).children[this.id];
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

		// state
		this.getState = function (stateName) {
			return this.states().filter(function (state) {
				return state.name === stateName;
			})[0];
		}
		this.setState = function (state) {
			if (state !== undefined) {
				// default state
				var currentDefaultState = this.defaultState !== undefined ? this.defaultState : {};
				this.defaultState = state.defaultState !== undefined ? state.defaultState : currentDefaultState;

				// states
				this.addStates(state.states);

				// state map
				this.addStateMap(state.stateMap);
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
		this.addState = function (state) {
			// add as new state
			UI.createState(this, state.name, state.args);
		}
		this.states = function () {
			var _this = this;
			return UI.states.filter(function (state) {
				return state.component.id === _this.id;
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
					this.stateMap = stateMap;
				}
			}
		}
		this.mapState = function () {
			return this.stateMap[stateName] !== undefined ? this.stateMap[stateName] : '';
		}
		this.triggerState = function () {
			UI.changeState(this.mapState(UI.globalState), this.id);
		}
		this.setRegistry = function (registry) {
			var _this = this;
			if (registry !== undefined) {
				registry.forEach(function (entry) {
					var args = entry.args !== undefined ? entry.args : {};
					Registry.register(_this, entry.state, entry.path, args, entry.fn);
				});
			}
		}

		// DOM
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
			this.setTemplate(args.template);
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
		this.model = function () {
			return $('#{id}'.format({id: this.id}));
		}
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
		this.parent = function () {
			return UI.getComponent(this.root);
		}
		this.changeState = function (state) {
			// 1. set new state
			this.state = state;

			// 2. get model
			var _this = this;
			var model = _this.model();

			// 3. run pre FN
			var preFnPromise = function () {
				if (_this.state.preFn !== undefined) {
					return new Promise(_this.state.preFn);
				}
			}

			// 4. run state change
			var stateChangePromise = function () {
				return Promise.all(_this.stateClasses.map(function (className) {
					return new Promise(function(resolve, reject) {
						model.removeClass(className);
						resolve();
					});
				})).then(function () {
					_this.stateClasses = _this.state.classes !== undefined ? _this.state.classes : [];
					return Promise.all(_this.stateClasses.map(function (className) {
						return new Promise(function(resolve, reject) {
							model.addClass(className);
							resolve();
						});
					}));
				}).then(function () {
					return new Promise(function(resolve, reject) {
						if (_this.state.html !== undefined) {
							model.html(_this.state.html);
						}
						resolve();
					});
				}).then(function () {
					return new Promise(function(resolve, reject) {
						_this.stateStyle = _this.state.style !== undefined ? _this.state.style : {};
						model.css(_this.stateStyle);
						resolve();
					});
				});
			}

			// 5. run FN
			var fnPromise = function () {
				if (_this.state.fn !== undefined) {
					return new Promise(_this.state.fn);
				}
			}

			// execute
			preFnPromise().then(function () {
				return stateChangePromise();
			}).then(function () {
				return fnPromise();
			})
		}

		// initialise
		this.id = id;
		this.rendered = false; // establish whether or not the component has been rendered to the DOM.
		this.update(args);
	},

	// createComponent
	createComponent: function (id, args) {
		var component = new this.component(id, args);
		UI.components[id] = component;
		return component;
	},

	// removeComponent
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

	// createApp
	createApp: function (root, children) {
		var id = 'app';
		var args = {
			root: root,
			template: UI.templates.div,
			children: children,
		};

		this.createComponent(id, args);
	},

	// renderApp
	renderApp: function () {
		var app = this.getComponent('app');
		app.render();
		this.changeState(this.globalState);
	},

	// STATES
	states: [],

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
		state.index = this.states.length - 1; // able to find state again
		this.states.push(state);
		return state;
	},

	// TEMPLATES
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

	// FUNCTIONS
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

		return new Promise(function(resolve, reject) {
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

			resolve(sub);

		}).then(function (data) {
			if (data === undefined || force) {
				return Context.load(path).then(function (data) {
					return Context.set(path, data);
				});
			} else {
				return data;
			}
		});
	},

	// The load method gets the requested path from the server if it does not exist locally.
	// This operation can be forced from the get method.
	load: function (path) {
		return Permission.permit().then(function (data) {
			var ajax_data = {
				type: 'post',
				data: data,
				url: '/context/{path}'.format({path: path}),
				error: function (xhr, ajaxOptions, thrownError) {
					if (xhr.status === 404 || xhr.status === 0) {
						Context.load(path);
					}
				}
			}

			return $.ajax(ajax_data);
		});
	},

	// SET
	// Sets the value of a path in the store. If the value changes, a request is sent to change this piece of data.
	set: function (path, value) {
		return new Promise(function (resolve, reject) {
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
			resolve(sub);
		});
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

	set: function (value, key) {
		if (key !== undefined) {
			Permission.permission[key] = value;
		} else {
			Permission.permission = value;
		}
	},

	// appends permission details to an object to be passed as data
	permit: function (data) {
		return new Promise(function (resolve, reject) {
			// set
			data = data !== undefined ? data : {};
			data.permission = Permission.permission;
			resolve(JSON.stringify(data));
		})
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
	register: function (component, state, path, args, fn) {
		var force = args !== undefined ? (args.force !== undefined ? args.force : false) : false;
		context_path = path.split('.');

		// add state if necessary
		if (Registry.registry[state] === undefined) {
			Registry.registry[state] = {};
		}
		sub = Registry.registry[state];

		for (i=0; i<context_path.length; i++) {
			if (i+1 === context_path.length) {
				// initialise
				if (sub[context_path[i]] === undefined) {
					sub[context_path[i]] = {
						registered: {},
					};
				}

				// add fn to id
				sub[context_path[i]].registered[component.id] = fn;

				// set force if needed -> set to true if false or undefined and force=true
				sub[context_path[i]].force = sub[context_path[i]].force !== undefined ? (sub[context_path[i]].force || force) : force;
			} else {
				if (sub[context_path[i]] === undefined) {
					sub[context_path[i]] = {
						registered: {},
					};
				}
			}
			sub = sub[context_path[i]];
		}
	},

	trigger: function (parent, level) {
		// What is this method: if "registered", then return Context.get, else a loop of promises.

		// initialise at the top of the tree. This will traverse recursively.
		parent = parent !== undefined ? parent : '';
		level = level !== undefined ? level : (Registry.registry[UI.globalState] !== undefined ? Registry.registry[UI.globalState] : {});

		if ('registered' in level && parent !== '') {
			return Context.get(parent, {force: level.registered.force !== undefined ? level.registered.force : false}).then(function (data) {
				return Promise.all(Object.keys(level.registered).map(function (componentId) {
					return UI.getComponent(componentId).then(function (component) {
						var fn = level.registered[component.id];
						return new Promise(fn(component, data));
						// function must be of the form:
						// function (component, data) {
						// 	function (resolve, reject) {
						// 		... logic ...
						// 		resolve();
						// 	}
						// }

					});
				})).then(function () {
					return Promise.all(Object.keys(level).map(function (path) {
						if (path !== 'registered') {
							var get = '{parent}{dot}{path}'.format({parent: parent, dot: (parent !== '' ? '.' : ''), path: path});
							return Registry.trigger(get, level[path]);
						}
					}));
				});
			});
		} else {
			// continue without changing anything.
			return Promise.all(Object.keys(level).map(function (path) {
				var get = '{parent}{dot}{path}'.format({parent: parent, dot: (parent !== '' ? '.' : ''), path: path});
				return Registry.trigger(get, level[path]);
			}));
		}
	},
}
