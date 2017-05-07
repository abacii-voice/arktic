// UI: This is the UI definition. It is ignorant of the data passing through the app.
var UI = {
	action: {
		controller: function (args) {
			return _.ep();
		},
		register: function (name, args) {
			return _.ep();
		},
	},
	state: {
		path: undefined,
		state: function (path) {
			return _.ep();
		},
		create: function (name, args) {
			return _.ep();
		},
		change: function (trigger, path) {
			return _.ep();
		},
		tree: function () {
			return _.ep();
		},
	},
	component: {
		_: {
			template: function (string) {
				return _.ep();
			},
			format: {
				style: function (style) {
					return _.ep();
				},
				classes: function (classes) {
					return _.ep();
				},
				properties: function (properties) {
					return _.ep();
				},
			},
			path: function (name, parent) {
				return _.ep();
			},
		},
		component: function (name) {

			// done once (and affect DOM)
			// 1. path
			// 2. template

			// can be changed, but do not affect DOM
			// 1. behaviours
			// 2. state
			// 3. options
			// 4. control
			// 5. data

			// can be changed, but must modify DOM
			// 1. bindings
			// 2. classes
			// 3. appearance
			// 4. children

			// $('name', {
			// 	ui: {
			// 		template: 'div.ie',
			// 		appearance: {
			// 			style: {},
			// 			classes: [],
			// 			html: '',
			// 			styles: {},
			// 		},
			// 		bindings: {
			// 			'click': {
			// 				state: (_this, event) => {
			//
			// 				},
			// 			},
			// 			'ctrl+space': (_this, event) => {
			//
			// 			},
			// 		},
			// 		state: {
			// 			'.': {
			// 				_: {
			// 					before: (_this) => {
			//
			// 					},
			// 					after: (_this) => {
			//
			// 					},
			// 				},
			// 				children: {
			// 					'hello': {
			// 						after: (_this) => {
			//
			// 						},
			// 					},
			// 				},
			// 			},
			// 		},
			// 	},
			// 	children: [
			// 		$('child', {
			//
			// 		}),
			// 	],
			// });

			// identity
			this.name = name;
			this.is = {
				rendered: false,
			}

			// dom and properties
			this.template = 'div.ie';
			this.update = ({ui, children}) => {
				ui = _.m(ui);

				// no processing
				this.options = _.m(this.options, ui.options);
				this.data = _.m(this.data, ui.data);
				this.control = _.m(this.control, ui.control);

				// need processing
				return _.all(
					// state
					this.state.add(ui.state),

					// DOM
					this.bindings.add(ui.bindings),
					this.appearance.add(ui.appearance),

					// children
					this.children.add(children),
				);
			}

			// state
			this.state = {
				_: {},
				get: function (path) {
					return _.ep();
				},
				add: (state) => _.ordered(_.keys(state).map(function (name) {

				})),

				add: function (state) {
					state: {
						'.': {
							_: {
								before: (_this) => {

								},
								after: (_this) => {

								},
							},
							children: {
								'hello': {
									after: (_this) => {

									},
								},
							},
						},
					},

					return _.keys(state);

				},
				change: function (path) {
					return _.ep();
				},
				map: {
					tree: undefined,
					get: function (path) {
						return _.ep();
					},
				},
				trigger: function () {
					return _.ep();
				},
			}

			// DOM
			this.bindings = {
				/*

				So the idea here, is that bindings will be added, but not to call a single function,
				but a range of functions, each referencing the _component and the _event. If this is first
				binding to be added, an event listener will be added to the _component.element. Attached event
				listeners are added to the attached object.

				*/

				add: function (bindings) {
					_component.bindings = _.m(_component.bindings, bindings);
					if (bindings) {
						_.items(bindings, function (event, fn) {
							if (_component.is.rendered) {
								let isWindowEvent = `on${event}` in window;
								_component.bindings.on(isWindowEvent, event, fn);
							}
						});
					}
				},
				attached: {},
				on: function (isWindowEvent, event, fn) {
					if (event in _component.bindings.attached) {
						_component.bindings.attached[event].push(fn);
					} else {
						_component.bindings.attached[event] = [fn];
						if (isWindowEvent) {
							_component.element().addEventListener(event, function (_event) {
								_component.bindings.attached[event].forEach(function (_handler) {
									_handler(_component, _event);
								});
							}, false);
						} else {
							// Mousetrap bindings must be kept track of centrally, independently of the component.
							UI.mousetrap.register(event, function (_event) {
								_component.bindings.attached[event].forEach(function (_handler) {
									_handler(_component, _event);
								});
							});
						}
					}
				},
			}

			this.appearance = {
				style: {},
				classes: [],
				html: undefined,
				styles: {},
				add: function (appearance) {

				},
			}
			this.children = {
				data: [],
				add: function (children) {
					return _.ep();
				},
				remove: function (name) {

				},
				refresh: function () {
					return _.ep();
				},
			}
			this.element = function () {
				return _.ep();
			}
			this.render = function () {
				return _.ep();
			}
			this.get = function (path) {
				return _.ep();
			}
			this.animate = function () {
				return _.ep();
			}
		},
		create: (name, args) => new UI.component.component(name).update(args),
		tree: function () {
			return _.ep();
		},
		get: function (path) {
			return _.ep();
		},
	},
	context: {
		permission: function () {

		},
		set: function (paths) {

		},
		send: function (data) {

		},
		get: function (paths) {

		},
		load: function (paths) {

		},
	},
	mousetrap: {
		attached: {},
		register: function (event, handler) {

		},
	},
}

var $ = function (path, args) {
	// Takes several combintations of arguments
	// 1. A single path -> gets a component
	// 2. A name + args -> creates a component
}

var _ = function (args) {
	// Data request from UI.context, or set using args
	// 1. {key: value, key: value}
	// 2. [key, key, key, key]
}

var $$ = function (path, args) {
	// State change request or creation
}

// BINDINGS? Should I have a binding object here as well? Build in state?

/*
var UI = {
	// GLOBAL STATE
	// store current global state
	// This is a path like 'client-state.reload' -> later, James.
	globalState: undefined,

	// changeState
	changeState: function (stateName, trigger) {
		if (!stateName.startsWith('-')) {
			UI.globalState = stateName;
		}
		return Promise.all(UI.createStates.filter(function (state) {
			return state.name === stateName;
		}).map(function (state) {
			return state.change();
		}));
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
	component: function (id) {
		// identity
		this.setName = function (name) {
			var currentName = this.name;
			this.name = (name || currentName);
			return Util.ep(this.name);
		}
		this.setId = function (id) {
			var currentId = this.id;
			id = id !== undefined ? id : currentId;
			return Util.ep(id);
		}
		this.setAfter = function (after) {
			var currentAfter = this.after;
			after = after !== undefined ? after : currentAfter;
			return Util.ep();
		}
		this.setRoot = function (root) {
			var _this = this;
			var currentRoot = (_this.root || 'hook');
			_this.root = (root || currentRoot);
			return Util.ep(_this.root)
		}
		this.setTemplate = function (template) {
			var currentTemplate = this.template !== undefined ? this.template : UI.templates.div;
			this.template = template !== undefined ? template : currentTemplate;
			return Util.ep(this.template);
		}
		this.renderTemplate = function () {
			var _this = this;
			return new Promise(function(resolve, reject) {
				var classes = _this.classes !== undefined ? _this.classes : [];
				var style = _this.style !== undefined ? _this.style : {};
				var properties = _this.properties != undefined ? _this.properties : {};
				var html = _this.html !== undefined ? _this.html : '';
				var renderedTemplate = _this.template.format({
					id: _this.id,
					classes: Util.format.classes(classes),
					style: Util.format.style(style),
					properties: Util.format.properties(properties),
					html: html,
				});
				resolve(renderedTemplate);
			});
		}
		this.setAppearance = function (appearance) {
			var currentClasses = (this.classes || []);

			if (appearance !== undefined) {
				this.properties = appearance.properties || this.properties;
				this.html = appearance.html;

				// classes need to be a combination of ones removed and ones added. If "add" and "remove" are not present, defaults to using whole object.
				this.classes = currentClasses;
				var _classes = (appearance.classes || {});

				// _classes can be:
				// 1. 'class' -> implied add
				// 2. {add: 'class'}
				// 3. {remove: 'class'}
				// 4. {add: 'class', remove: 'class'}
				// 5. all of the above but with arrays instead of strings.

				// make defaults arrays
				// {add: undefined, remove: ""}
				_classes.add = _classes.add ? _classes.add : (_classes.remove ? [] : ($.isArray(_classes) ? _classes : []));
				_classes.remove = _classes.remove ? _classes.remove : [];

				// force arrays
				var addClasses = $.isArray(_classes.add) ? _classes.add : [_classes.add];
				var removeClasses = $.isArray(_classes.remove) ? _classes.remove : [_classes.remove];
				var _this = this;

				if (addClasses) {
					_this.classes = _this.classes.concat(addClasses.filter(function (cls) {
						return _this.classes.indexOf(cls) === -1;
					}));
				}

				_this.classes = _this.classes.filter(function (cls) {
					return removeClasses.indexOf(cls) === -1;
				});

				_this.style = (_this.style || {});
				appearance.style = (appearance.style || {});
				Object.keys(appearance.style).forEach(function (key) {
					_this.style[key] = appearance.style[key];
				});

				if (_this.isRendered) {
					// model
					var model = _this.model();
					model.animate(appearance.style, 300);

					// set colors
					var colors = ['color', 'background-color', 'border-color'];
					colors.forEach(function (color) {
						if (color in appearance.style) {
							let dict = {};
							dict[color] = appearance.style[color];
							model.css(dict);
						}
					});

					// html - this will erase children of the current model
					if (appearance.html !== undefined) {
						model.html(_this.html);
					}

					// properties
					if (appearance.properties) {
						Object.keys(_this.properties).forEach(function (property) {
							model.attr(property, _this.properties[property]);
						});
					}

					// classes
					if (appearance.classes) {
						return Promise.all([
							Promise.all(removeClasses.map(function (cls) {
								return new Promise(function(resolve, reject) {
									model.removeClass(cls);
									resolve();
								});
							})),
							Promise.all(addClasses.map(function (cls) {
								return new Promise(function(resolve, reject) {
									model.addClass(cls);
									resolve();
								});
							})),
						]);
					}
					return Util.ep(appearance);
				} else {
					return Util.ep(appearance);
				}
			} else {
				return Util.ep();
			}
		}

		// state
		this.setState = function (state) {
			if (state !== undefined) {
				var currentDefaultState = this.defaultState !== undefined ? this.defaultState : {};
				this.defaultState = state.defaultState !== undefined ? state.defaultState : currentDefaultState;
				var _this = this;

				return Promise.all([
					_this.addStates(state.states),
					_this.addStateMap(state.stateMap),
				]);
			}
		}
		this.addStates = function (states) {
			if (states !== undefined) {
				var _this = this;
				return Promise.all(Object.keys(states).map(function (stateName) {
					return _this.addState(stateName, states[stateName]);
				}));
			}
		}
		this.addState = function (stateName, state) {
			// add as new state
			return UI.createState(this, stateName, state);
		}
		this.addStateMap = function (stateMap) {
			var _this = this;
			return new Promise(function(resolve, reject) {
				_this.stateMap = _this.stateMap !== undefined ? _this.stateMap : '';
				_this.stateMap = stateMap !== undefined ? stateMap : _this.stateMap;
				resolve();
			});
		}
		this.mapState = function (stateName) {
			if (typeof this.stateMap === 'string') {
				return this.stateMap;
			} else {
				return this.stateMap[stateName] !== undefined ? this.stateMap[stateName] : '';
			}
		}
		this.triggerState = function () {
			this.state = this.mapState(this.state || UI.globalState);
			return UI.changeState(this.state, this.id);
		}

		// DOM
		this.setBindings = function (bindings) {
			// TODO: later change to accept single value as single function, with the need for 'fn' key.
			var _this = this;
			return new Promise(function(resolve, reject) {
				_this.bindings = _this.bindings !== undefined ? _this.bindings : {};
				if (bindings !== undefined) {
					Object.keys(bindings).forEach(function (name) {
						var binding = bindings[name];
						// if rendered, add to model
						if (_this.isRendered) {
							_this.model().off(name);
							_this.model().on(name, function (event) {
								binding(_this, event);
							});
						} else {
							_this.bindings[name] = binding;
						}
					}, this);
				}
				resolve();
			});
		}
		this.addChild = function (child) {
			var _this = this;
			var index = child.index;
			child.index = (child.index !== undefined ? child.index : _this.children.length);
			if (child.name) {
				_this.cc = _this.cc || {};
				_this.cc[child.name] = child;
			}
			child.isAddedToParent = true;
			_this.children.splice(child.index, 0, child);
			return Util.ep(child);
		}
		this.removeChild = function (child) {
			var _this = this;
			_this.children.splice(child.index, 1);
			return UI.removeComponent(child).then(function () {
				// renumber children
				return _this.setChildIndexes();
			});
		}
		this.removeChildren = function () {
			var _this = this;
			return Promise.ordered(_this.children.map(function (child) {
				return function () {
					return _this.removeChild(child);
				}
			}));
		}
		this.setChildren = function (children) {
			var _this = this;
			_this.children = (_this.children || []);
			_this.components = (_this.components || {});
			if (children !== undefined) {
				return Promise.ordered(children.map(function (child) {
					return function () {
						if (child.then !== undefined) { // is an unevaluated promise
							return child.then(function (component) {
								return component.childIndexFromAfter();
							}).then(function (component) {
								return _this.addChild(component);
							}).then(function (final) {
								if (_this.isRendered) {
									final.root = _this.id;
									return final.render();
								} else {
									return final;
								}
							});
						} else {
							return child.childIndexFromAfter().then(function (component) {
								return _this.addChild(component);
							}).then(function (final) {
								if (_this.isRendered) {
									final.root = _this.id;
									return final.render();
								}
							});
						}
					}
				})).then(function () {
					return _this.setChildIndexes();
				});
			} else {
				return _this.children;
			}
		}
		this.setChildIndexes = function () {
			// set index from position in children array
			var _this = this;
			return Promise.all(_this.children.map(function (child, index) {
				return new Promise(function(resolve, reject) {
					child.index = index;
					resolve();
				});
			}));
		}
		this.childIndexFromAfter = function (placementIndex) {
			// find index from after key
			var _this = this;
			if (_this.after) {
				return UI.getComponent(_this.after).then(function (component) {
					return new Promise(function(resolve, reject) {
						_this.index = component !== undefined ? component.index + 1 : 0;
						resolve(_this);
					});
				});
			} else {
				return new Promise(function(resolve, reject) {
					_this.index = (placementIndex || (_this.after === '' ? 0 : undefined));
					resolve(_this);
				});
			}
		}
		this.update = function (args) {
			args = args || {};
			var _this = this;
			return Promise.all([
				// id, root, after, template
				_this.setId(args.id),
				_this.setName(args.name),
				_this.setRoot(args.root),
				_this.setAfter(args.after),
				_this.setTemplate(args.template),
				_this.setAppearance(args.appearance),

				// state
				_this.setState(args.state),

				// bindings
				_this.setBindings(args.bindings),
			]).then(function (results) {
				return _this.setChildren(args.children);
			}).then(function (children) {
				return _this;
			});
		}
		this.removeModel = function () {
			var _this = this;
			_this.model().remove();
			return Util.ep();
		}
		this.model = function (single) {
			if (single) {
				return $('#{id}'.format({id: this.id}))[0];
			} else {
				return $('#{id}'.format({id: this.id}));
			}
		}
		this.element = function () {
			return document.getElementById(this.id);
		}
		this.render = function () {
			var _this = this;
			var root = $('#{root}'.format({root: _this.root}));

			// SET STYLES HERE

			return _this.renderTemplate().then(function (renderedTemplate) {
				return new Promise(function(resolve, reject) {
					if (root.children().length !== 0) {
						if (_this.after !== undefined) {
							if (_this.after) {
								root.children('#{id}'.format({id: _this.after})).after(renderedTemplate); // add as child after 'after'.
							} else {
								root.children().first().before(renderedTemplate); // add as child before first child.
							}
						} else {
							root.children().last().after(renderedTemplate); // add as child after last child.
						}
					} else {
						root.html(renderedTemplate);
					}
					_this.isRendered = true;
					resolve();
				});
			}).then(function () {
				return _this.setBindings(_this.bindings);
			}).then(function () {
				return Promise.ordered(_this.children.sort(function (first, second) {
					return first.index - second.index;
				}).map(function (child) {
					return function () {
						child.root = _this.id; // CHANGE TO NAME
						return child.render();
					}
				}));
			}).then(function () {
				return _this;
			});
		}
		this.parent = function () {
			return UI.getComponent(this.root);
		}
		this.changeState = function (state) {
			var _this = this;
			_this.state = state.name;

			// run fn
			setTimeout(function () {
				(state.fn || Util.ep)(_this);
			}, 300);

			// 1. Run preFn
			return (state.preFn || Util.ep)(_this).then(function () {
				// 2. Run appearance
				return _this.setAppearance({
					classes: state.classes,
					style: state.style,
					html: state.html,
				});
			});
		}
		this.get = function (path, index) {
			// gets a child recursively by specifying a dotted string
			index = (index || 0); // might be the beginning of the chain
			if (index === 0) {
				path = path.split('.');
			}

			var children = (this.children || []).filter(function (child) {
				return child.name === path[index];
			});

			if (children.length) {
				return children[0].get(path, index+1);
			} else {
				return this;
			}
		}

		// initialise
		this.id = id;
	},

	// createComponent
	add: function (component) {
		return new Promise(function(resolve, reject) {
			UI.components[component.id] = component;
			resolve(component);
		});
	},

	createComponent: function (id, args) {
		return new Promise(function(resolve, reject) {
			resolve(new UI.component(id));
		}).then(function (component) {
			return component.update(args);
		});
	},

	// removeComponent
	removeComponent: function (component) {
		return component.removeChildren().then(function () {
			return component.removeModel();
		});
	},

	// app
	app: function (root, children) {
		var id = 'app';
		var args = {
			name: 'app',
			root: root,
			template: UI.template('div'),
			appearance: {
				style: {
					'position': 'absolute',
					'top': '0px',
					'left': '0px',
					'width': '100%',
					'height': '100%',
				},
			},
			children: children,
		};

		return UI.createComponent(id, args);
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

		// change
		this.change = function () {
			return this.component.changeState(this);
		}
	},

	// state factory
	createState: function (component, name, args) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			args = args === 'default' ? undefined : args;
			var state = new _this.state(component, name, (args || component.defaultState));
			state.index = _this.states.length - 1; // able to find state again
			_this.states.push(state);
			resolve(state);
		});
	},

	// TEMPLATES
	templates: {
		div: `
			<div id='{id}' class='{classes}' style='{style}' {properties}>
				{html}
			</div>
		`,
		loadingIcon: `
			<div id='{id}' class='ie loading-icon {classes}' style='{style}'>
				<img src='/static/img/loading-icon.gif' />
			</div>
		`,
	},

	template: function (type, initialClass) {
		return `<{type} id='{id}' class='{initialClass}{classes}' style='{style}' {properties}>{html}</{type}>`.format({
			type: type,
			id: '{id}',
			initialClass: initialClass !== undefined ? (initialClass + ' ') : '',
			classes: '{classes}',
			style: '{style}',
			properties: '{properties}',
			html: '{html}',
		});
	},

	// FUNCTIONS
	functions: {
		show: function (style) {
			style = (style || {});
			style['opacity'] = '1.0';
			return function (_this) {
				return _this.setAppearance({classes: {remove: ['hidden']}}).then(function () {
					return _this.setAppearance({style: style});
				});
			}
		},
		hide: function (style) {
			style = (style || {});
			style['opacity'] = '0.0';
			return function (_this) {
				return _this.setAppearance({style: style}).then(function () {
					return _this.setAppearance({classes: {add: ['hidden']}});
				});
			}
		}
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
	// This will get from the current store. If it does not exist, a request will be made for it.
	get: function (path, args) {
		// force load from the server?
		var force = ((args || {}).force || false);
		var options = ((args || {}).options || {});
		var overwrite = ((args || {}).overwrite || false);
		return (typeof path !== 'string' ? path : Util.ep)(path).then(function (calculatedPath) {
			calculatedPath = (calculatedPath || '');
			return new Promise(function(resolve, reject) {
				// proceed to get from context object
				context_path = calculatedPath.split('.');
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

			});
		}).then(function (data) {
			if (data === undefined || force) {
				return Context.load(path, options).then(function (data) {
					return Context.set(path, data, overwrite);
				});
			} else {
				return data;
			}
		});
	},

	// The load method gets the requested path from the server if it does not exist locally.
	// This operation can be forced from the get method.
	load: function (path, options) {
		return (typeof path !== 'string' ? path : Util.ep)(path).then(function (calculatedPath) {
			calculatedPath = (calculatedPath || '');
			return Permission.permit(options).then(function (data) {
				var ajax_data = {
					type: 'post',
					data: data,
					url: '/context/{path}'.format({path: calculatedPath}),
					error: function (xhr, ajaxOptions, thrownError) {
						if (xhr.status === 404 || xhr.status === 0) {
							Context.load(path, options);
						}
					}
				}

				return $.ajax(ajax_data);
			});
		});
	},

	// SET
	// Sets the value of a path in the store. If the value changes, a request is sent to change this piece of data.
	set: function (path, value, overwrite) {
		overwrite = (overwrite || false);
		return (typeof path !== 'string' ? path : Util.ep)(path).then(function (calculatedPath) {
			return new Promise(function (resolve, reject) {
				calculatedPath = (calculatedPath || '');
				context_path = calculatedPath.split('.');
				sub = Context.context;
				if (context_path[0] !== '') {
					for (i=0; i<context_path.length; i++) {
						if (i+1 === context_path.length) {

							// Here, the value can be an object, it should be merged with any existing object or overwritten if keys match.
							// if (typeof value === 'object' && typeof sub[context_path[i]] === 'object') {
							//
							// } else {
							// }
							if (sub[context_path[i]] !== undefined && !overwrite) {
								$.extend(sub[context_path[i]], value);
							} else {
								sub[context_path[i]] = value;
							}
						} else {
							if (sub[context_path[i]] === undefined) {
								sub[context_path[i]] = {};
							}
						}
						sub = sub[context_path[i]];
					}
					resolve(sub);
				} else {
					Context.context = value;
					resolve(Context.context);
				}
			});
		});
	},
}

// ACTIVE
// Active stores temporary variables that need to be synthesized using a series of temporally disconnected events, such as upload.
var Active = {
	active: {},

	// get
	get: function (path) {
		return new Promise(function(resolve, reject) {
			context_path = path.split('.');
			sub = Active.active;
			for (i=0; i<context_path.length; i++) {
				sub = sub[context_path[i]];
				if (sub === undefined) {
					break;
				}
			}

			resolve((sub || ''));
		});
	},

	// set
	set: function (path, value) {
		return new Promise(function(resolve, reject) {
			context_path = path.split('.');
			sub = Active.active;
			for (i=0; i<context_path.length; i++) {
				if (i+1 === context_path.length) {
					sub[context_path[i]] = value;
					break;
				} else {
					if (sub[context_path[i]] === undefined) {
						sub[context_path[i]] = {};
					}
				}
				sub = sub[context_path[i]];
			}
			resolve(sub);
		});
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
	// appends permission details to an object to be passed as data
	permit: function (data) {
		return Active.get('role').then(function (id) {
			data = data !== undefined ? data : {};
			data.permission = id;
			return JSON.stringify(data);
		});
	},
}
*/

//
// function extend () {
// 	var options, name, src, copy, copyIsArray, clone,
// 		target = arguments[0] || {},
// 		i = 1,
// 		length = arguments.length,
// 		deep = false;
//
// 	// Handle a deep copy situation
// 	if ( typeof target === "boolean" ) {
// 		deep = target;
// 		target = arguments[1] || {};
// 		// skip the boolean and the target
// 		i = 2;
// 	}
//
// 	// Handle case when target is a string or something (possible in deep copy)
// 	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
// 		target = {};
// 	}
//
// 	// extend jQuery itself if only one argument is passed
// 	if ( length === i ) {
// 		target = this;
// 		--i;
// 	}
//
// 	for ( ; i < length; i++ ) {
// 		// Only deal with non-null/undefined values
// 		if ( (options = arguments[ i ]) != null ) {
// 			// Extend the base object
// 			for ( name in options ) {
// 				src = target[ name ];
// 				copy = options[ name ];
//
// 				// Prevent never-ending loop
// 				if ( target === copy ) {
// 					continue;
// 				}
//
// 				// Recurse if we're merging plain objects or arrays
// 				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
// 					if ( copyIsArray ) {
// 						copyIsArray = false;
// 						clone = src && jQuery.isArray(src) ? src : [];
//
// 					} else {
// 						clone = src && jQuery.isPlainObject(src) ? src : {};
// 					}
//
// 					// Never move original objects, clone them
// 					target[ name ] = jQuery.extend( deep, clone, copy );
//
// 				// Don't bring in undefined values
// 				} else if ( copy !== undefined ) {
// 					target[ name ] = copy;
// 				}
// 			}
// 		}
// 	}
//
// 	// Return the modified object
// 	return target;
// }
//
// var animate = function( prop, speed, easing, callback ) {
// 	var optall = jQuery.speed( speed, easing, callback );
//
// 	if ( jQuery.isEmptyObject( prop ) ) {
// 		return this.each( optall.complete, [ false ] );
// 	}
//
// 	// Do not change referenced properties as per-property easing will be lost
// 	prop = jQuery.extend( {}, prop );
//
// 	function doAnimation() {
// 		// XXX 'this' does not always have a nodeName when running the
// 		// test suite
//
// 		if ( optall.queue === false ) {
// 			jQuery._mark( this );
// 		}
//
// 		var opt = jQuery.extend( {}, optall ),
// 			isElement = this.nodeType === 1,
// 			hidden = isElement && jQuery(this).is(":hidden"),
// 			name, val, p, e, hooks, replace,
// 			parts, start, end, unit,
// 			method;
//
// 		// will store per property easing and be used to determine when an animation is complete
// 		opt.animatedProperties = {};
//
// 		// first pass over propertys to expand / normalize
// 		for ( p in prop ) {
// 			name = jQuery.camelCase( p );
// 			if ( p !== name ) {
// 				prop[ name ] = prop[ p ];
// 				delete prop[ p ];
// 			}
//
// 			if ( ( hooks = jQuery.cssHooks[ name ] ) && "expand" in hooks ) {
// 				replace = hooks.expand( prop[ name ] );
// 				delete prop[ name ];
//
// 				// not quite $.extend, this wont overwrite keys already present.
// 				// also - reusing 'p' from above because we have the correct "name"
// 				for ( p in replace ) {
// 					if ( ! ( p in prop ) ) {
// 						prop[ p ] = replace[ p ];
// 					}
// 				}
// 			}
// 		}
//
// 		for ( name in prop ) {
// 			val = prop[ name ];
// 			// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
// 			if ( jQuery.isArray( val ) ) {
// 				opt.animatedProperties[ name ] = val[ 1 ];
// 				val = prop[ name ] = val[ 0 ];
// 			} else {
// 				opt.animatedProperties[ name ] = opt.specialEasing && opt.specialEasing[ name ] || opt.easing || 'swing';
// 			}
//
// 			if ( val === "hide" && hidden || val === "show" && !hidden ) {
// 				return opt.complete.call( this );
// 			}
//
// 			if ( isElement && ( name === "height" || name === "width" ) ) {
// 				// Make sure that nothing sneaks out
// 				// Record all 3 overflow attributes because IE does not
// 				// change the overflow attribute when overflowX and
// 				// overflowY are set to the same value
// 				opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];
//
// 				// Set display property to inline-block for height/width
// 				// animations on inline elements that are having width/height animated
// 				if ( jQuery.css( this, "display" ) === "inline" &&
// 						jQuery.css( this, "float" ) === "none" ) {
//
// 					// inline-level elements accept inline-block;
// 					// block-level elements need to be inline with layout
// 					if ( !jQuery.support.inlineBlockNeedsLayout || defaultDisplay( this.nodeName ) === "inline" ) {
// 						this.style.display = "inline-block";
//
// 					} else {
// 						this.style.zoom = 1;
// 					}
// 				}
// 			}
// 		}
//
// 		if ( opt.overflow != null ) {
// 			this.style.overflow = "hidden";
// 		}
//
// 		for ( p in prop ) {
// 			e = new jQuery.fx( this, opt, p );
// 			val = prop[ p ];
//
// 			if ( rfxtypes.test( val ) ) {
//
// 				// Tracks whether to show or hide based on private
// 				// data attached to the element
// 				method = jQuery._data( this, "toggle" + p ) || ( val === "toggle" ? hidden ? "show" : "hide" : 0 );
// 				if ( method ) {
// 					jQuery._data( this, "toggle" + p, method === "show" ? "hide" : "show" );
// 					e[ method ]();
// 				} else {
// 					e[ val ]();
// 				}
//
// 			} else {
// 				parts = rfxnum.exec( val );
// 				start = e.cur();
//
// 				if ( parts ) {
// 					end = parseFloat( parts[2] );
// 					unit = parts[3] || ( jQuery.cssNumber[ p ] ? "" : "px" );
//
// 					// We need to compute starting value
// 					if ( unit !== "px" ) {
// 						jQuery.style( this, p, (end || 1) + unit);
// 						start = ( (end || 1) / e.cur() ) * start;
// 						jQuery.style( this, p, start + unit);
// 					}
//
// 					// If a +=/-= token was provided, we're doing a relative animation
// 					if ( parts[1] ) {
// 						end = ( (parts[ 1 ] === "-=" ? -1 : 1) * end ) + start;
// 					}
//
// 					e.custom( start, end, unit );
//
// 				} else {
// 					e.custom( start, val, "" );
// 				}
// 			}
// 		}
//
// 		// For JS strict compliance
// 		return true;
// 	}
//
// 	return optall.queue === false ?
// 		this.each( doAnimation ) :
// 		this.queue( optall.queue, doAnimation );
// }