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
		}).then(Registry.trigger).then(function () {
			return Promise.all(UI.states.map(function (state) {
				return state.change();
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
	component: function (id) {
		// identity
		this.setId = function (id) {
			var currentId = this.id;
			id = id !== undefined ? id : currentId;

			if (id !== currentId) {
				var _this = this;
				// 1. remove the component while keeping a solid var present
				// 2. change the id of the var and change the model attr.
				// 3. Add the var.

				return UI.remove(_this).then(function (component) {
					return new Promise(function(resolve, reject) {
						if (component.isRendered) {
							component.model().attr('id', id);
						}
						component.id = id;
						resolve(component);
					});
				}).then(UI.add);
			} else {
				return this.id;
			}
		}
		this.setAfter = function (after) {
			var currentAfter = this.after;
			after = after !== undefined ? after : currentAfter;

			if (after !== currentAfter) {
				var _this = this;
				_this.after = after;
				// 1. Parent stays the same.
				// 2. Or does it...
				// 3. No other element has to change.
				if (after !== '') {
					return UI.getComponent(_this.after).then(function (before) {
						return _this.setRoot(before.root).then(function (child) {
							return new Promise(function(resolve, reject) {
								_this.model().insertAfter(before.model());
								resolve();
							});
						});
					});
				} else {
					return _this.parent().then(function (parent) {
						return new Promise(function(resolve, reject) {
							_this.model().insertBefore(parent.model().children().first());
							resolve();
						});
					});
				}
			} else {
				return this.after;
			}
		}
		this.setRoot = function (root) {
			var currentRoot = this.root !== undefined ? this.root : 'hook'; // this should be 'app' when making an app
			root = root !== undefined ? root : currentRoot;

			if (root !== currentRoot) {
				var _this = this;
				_this.root = _this.root !== undefined ? _this.root : root;
				// 1. get the current parent.
				// 2.	remove the child from the current parent.
				// 3. append to new parent model.
				// 4. change the root value.
				// 5. get the new parent.
				// 6. add the child to new parent.
				return _this.parent().then(function (parent) {
					if (_this.isRendered) {
						return parent.removeChild(_this.id);
					}
				}).then(function () {
					return new Promise(function(resolve, reject) {
						_this.root = root;
						if (_this.isRendered) {
							_this.model().appendTo('#{id}'.format({id: root}));
						}
						resolve(root);
					});
				}).then(UI.getComponent).then(function (newParent) {
					return newParent.addChild(_this);
				});
			} else {
				this.root = root;
				return new Promise(function(resolve, reject) {
					resolve(this.root);
				});
			}
		}
		this.setTemplate = function (template) {
			var currentTemplate = this.template !== undefined ? this.template : UI.templates.div;
			this.template = template !== undefined ? template : currentTemplate;

			if (this.template !== currentTemplate) {
				var _this = this;
				// 1. render empty template element to the DOM.
				// 2. Append all children to the new empty element
				// 3. Remove the old element.

				return _this.renderTemplate().then(function (renderedTemplate) {
					return new Promise(function(resolve, reject) {
						if (_this.isRendered) {
							var model = _this.model();
							model.after(renderedTemplate);
							model.attr('id', 'REMOVE-{id}'.format({id: _this.id}));
						}
						resolve();
					});
				}).then(function () {
					if (_this.isRendered) {
						return Promise.all(Object.keys(_this.children).map(function (key) {
							return UI.getComponent(key).then(function (child) {
								return new Promise(function(resolve, reject) {
									child.model().appendTo('#{id}'.format({id: _this.id}));
									resolve();
								});
							});
						}));
					}
				}).then(function () {
					if (_this.isRendered) {
						return new Promise(function(resolve, reject) {
							$('#REMOVE-{id}'.format({id: _this.id})).remove();
							resolve();
						});
					}
				});
			} else {
				return this.template;
			}
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
					classes: formatClasses(classes),
					style: formatStyle(style),
					properties: formatProperties(properties),
					html: html,
				});
				resolve(renderedTemplate);
			});
		}
		this.setAppearance = function (appearance) {
			var currentProperties = this.properties !== undefined ? this.properties : {};
			var currentHTML = this.html !== undefined ? this.html : '';
			var currentClasses = this.classes !== undefined ? this.classes : [];
			var currentStyle = this.style !== undefined ? this.style : {};
			var currentAppearance = {
				properties: currentProperties,
				html: currentHTML,
				classes: currentClasses,
				style: currentStyle,
			}

			if (appearance !== undefined) {
				this.properties = appearance.properties !== undefined ? appearance.properties : currentProperties;
				this.html = appearance.html !== undefined ? appearance.html : currentHTML;

				// classes need to be a combination of ones removed and ones added. If "add" and "remove" are not present, defaults to using whole object.
				this.classes = currentClasses;
				var addClasses = appearance.classes !== undefined ? (appearance.classes.add !== undefined ? appearance.classes.add : (appearance.classes.remove !== undefined ? [] : appearance.classes)) : [];
				var removeClasses = appearance.classes !== undefined ? (appearance.classes.remove !== undefined ? appearance.classes.remove : []) : [];
				var _this = this;
				this.classes = this.classes.concat(addClasses.filter(function (cls) {
					return _this.classes.indexOf(cls) === -1;
				}));

				this.classes = this.classes.filter(function (cls) {
					return removeClasses.indexOf(cls) === -1;
				});

				this.style = appearance.style !== undefined ? appearance.style : currentStyle;

				if (this.isRendered) {
					return new Promise(function(resolve, reject) {
						// model
						var model = _this.model();

						// properties
						Object.keys(_this.properties).forEach(function (property) {
							model.attr(property, _this.properties[property]);
						});

						// html
						if (model.children().length === 0) {
							model.html(_this.html);
						}

						// classes
						if (_this.classes !== undefined) {
							// remove current classes that are not the new classes variable
							removeClasses.forEach(function (cls) {
								model.removeClass(cls);
							});

							// add new classes
							addClasses.forEach(function (cls) {
								model.addClass(cls);
							});
						}

						// style
						model.css(_this.style);

						resolve();
					});
				} else {
					return appearance;
				}
			} else {
				return currentAppearance;
			}
		}

		// state
		this.setState = function (state) {
			if (state !== undefined) {
				var currentDefaultState = this.defaultState !== undefined ? this.defaultState : {};
				this.defaultState = state.defaultState !== undefined ? state.defaultState : currentDefaultState;
				var _this = this;

				return Promise.all([
					this.addStates(state.states),
					this.addStateMap(state.stateMap),
				]);
			}
		}
		this.addStates = function (states) {
			if (states !== undefined) {
				var _this = this;
				return Promise.all(states.map(function (state) {
					return _this.addState(state);
				}));
			}
		}
		this.addState = function (state) {
			// add as new state
			return UI.createState(this, state.name, state.args);
		}
		this.addStateMap = function (stateMap) {
			return new Promise(function(resolve, reject) {
				this.stateMap = this.stateMap !== undefined ? this.stateMap : '';
				this.stateMap = stateMap !== undefined ? stateMap : this.stateMap;
				resolve();
			});
		}
		this.mapState = function () {
			if (typeof this.stateMap === 'string') {
				return this.stateMap;
			} else {
				return this.stateMap[stateName] !== undefined ? this.stateMap[stateName] : '';
			}
		}
		this.triggerState = function () {
			return UI.changeState(this.mapState(UI.globalState), this.id);
		}
		this.setRegistry = function (registry) {
			var _this = this;
			if (registry !== undefined) {
				return Promise.all(registry.map(function (entry) {
					var args = entry.args !== undefined ? entry.args : {};
					return Registry.register(_this, entry.state, entry.path, args, entry.fn);
				}));
			}
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
						// 1. determine if binding with the same name is in the current array
						_this.bindings[name] = {fn: binding.fn};
						if (binding.fn2 !== undefined) {
							_this.bindings[name].fn2 = binding.fn2;
						}

						// 2. if rendered, add to model
						if (_this.isRendered) {
							if (_this.bindings[name].fn2 !== undefined) {
								_this.model().on(name, function () {
									_this.bindings[name].fn(_this);
								}, function () {
									_this.bindings[name].fn2(_this);
								});
							} else {
								_this.model().on(name, function () {
									_this.bindings[name].fn(_this);
								});
							}
						}
					}, this);
				}
				resolve();
			});
		}
		this.addChild = function (child) {
			var _this = this;
			return new Promise(function(resolve, reject) {
				_this.children[child.id] = child;
				resolve(child);
			});
		}
		this.removeChild = function (id) {
			var _this = this;
			return new Promise(function(resolve, reject) {
				delete _this.children[id];
				resolve(id);
			}).then(UI.removeComponent);
		}
		this.removeChildren = function () {
			var _this = this;
			return Promise.all(Object.keys(_this.children).map(function (child) {
				return _this.removeChild(child);
			}));
		}
		this.setChildren = function (children) {
			this.children = this.children !== undefined ? this.children : {};
			var _this = this;
			if (children !== undefined) {
				return Promise.all(children.map(function (child, index) {
					if (child.then !== undefined) { // is an unevaluated promise
						return child.then(function (component) {
							component.index = index;
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
						child.index = index;
						return _this.addChild(child).then(function (final) {
							if (_this.isRendered) {
								final.root = _this.id;
								return final.render();
							}
						});
					}
				}));
			} else {
				return this.children;
			}
		}
		this.update = function (args) {
			args = args !== undefined ? args : {};
			var _this = this;
			_this.index = args.index !== undefined ? args.index : -1;
			return Promise.all([
				// id, root, after, template
				_this.setId(args.id),
				_this.setRoot(args.root),
				_this.setAfter(args.after),
				_this.setTemplate(args.template),
				_this.setAppearance(args.appearance),

				// state
				_this.setState(args.state),

				// registry
				_this.setRegistry(args.registry),

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
			return new Promise(function(resolve, reject) {
				_this.model().remove();
				resolve();
			});
		}
		this.model = function () {
			return $('#{id}'.format({id: this.id}));
		}
		this.render = function () {
			var _this = this;
			var root = $('#{id}'.format({id: _this.root}));

			return _this.renderTemplate().then(function (renderedTemplate) {
				return new Promise(function(resolve, reject) {
					if (root.children().length !== 0) {
						if (_this.after !== undefined) {
							root.children().find('#{id}'.format({id: _this.after})).after(renderedTemplate); // add as child after 'after'.
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
				return Promise.ordered(Object.keys(_this.children).sort(function (first, second) {
					return _this.children[first].index - _this.children[second].index;
				}).map(function (key) {
					return UI.getComponent(key).then(function (child) {
						child.root = _this.id;
						return child.render();
					});
				}));
			}).then(function () {
				return _this;
			});
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
			return preFnPromise().then(function () {
				return stateChangePromise();
			}).then(function () {
				return fnPromise();
			})
		}

		// initialise
		this.id = id;
		this.isRendered = false; // establish whether or not the component has been rendered to the DOM.
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
		}).then(UI.add).then(function (component) {
			return component.update(args);
		});
	},

	// removeComponent
	remove: function (component) {
		return new Promise(function(resolve, reject) {
			delete UI.components[component.id];
			resolve(component);
		});
	},

	removeComponent: function (id) {
		return UI.getComponent(id).then(function (component) {
			return component.removeChildren().then(function () {
				return component.removeModel();
			}).then(function () {
				return Promise.all([UI.remove(component), Registry.delete(component)]);
			});
		});
	},

	// app
	app: function (root, children) {
		var id = 'app';
		var args = {
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
			if (this.name === UI.globalState) {
				return this.component.changeState();
			}
		}
	},

	// state factory
	createState: function (component, name, args) {
		var _this = this;
		return new Promise(function(resolve, reject) {
			var state;
			if (args === 'default') {
				state = new _this.state(component, name, component.defaultState);
			} else {
				state = new _this.state(component, name, args);
			}
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
		var force = args !== undefined ? (args.force !== undefined ? args.force : false) : false;
		var options = args !== undefined ? (args.options !== undefined ? args.options : {}) : {};

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
				return Context.load(path, options).then(function (data) {
					return Context.set(path, data);
				});
			} else {
				return data;
			}
		});
	},

	// The load method gets the requested path from the server if it does not exist locally.
	// This operation can be forced from the get method.
	load: function (path, options) {
		return Permission.permit(options).then(function (data) {
			var ajax_data = {
				type: 'post',
				data: data,
				url: '/context/{path}'.format({path: path}),
				error: function (xhr, ajaxOptions, thrownError) {
					if (xhr.status === 404 || xhr.status === 0) {
						Context.load(path, options);
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

	// find id of current role
	role_id: function () {
		return Promise.all([
			Active.get('client'),
			Active.get('role'),
		]).then(function (results) {

		});
	}

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
	permission: '',
	set: function (id) {
		Permission.permission = id;
	},

	// appends permission details to an object to be passed as data
	permit: function (data) {
		return new Promise(function (resolve, reject) {
			// set
			data = data !== undefined ? data : {};
			data.permission = Permission.permission;
			resolve(JSON.stringify(data));
		})
	},
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
						return fn(component, data); // must return a promise
					});
				})).then(function () {
					return Promise.all(Object.keys(level).map(function (path) {
						if (path !== 'registered' && path !== 'force') {
							var get = '{parent}{dot}{path}'.format({parent: parent, dot: (parent !== '' ? '.' : ''), path: path});
							return Registry.trigger(get, level[path]);
						}
					}));
				});
			});
		} else {
			// continue without changing anything.
			return Promise.all(Object.keys(level).map(function (path) {
				if (path !== 'force') {
					var get = '{parent}{dot}{path}'.format({parent: parent, dot: (parent !== '' ? '.' : ''), path: path});
					return Registry.trigger(get, level[path]);
				}
			}));
		}
	},

	delete: function (component, level) {
		// initialise state and level
		level = level !== undefined ? level : (Registry.registry !== undefined ? Registry.registry : {});

		// scan registry for this component and remove fn from each entry
		if ('registered' in level) {
			if (component.id in level.registered) {
				delete level.registered[component.id];
			}
		}

		return Promise.all(Object.keys(level).map(function (key) {
			// each key is a top level state
			if (key !== 'registered' && key !== 'force') {
				return Registry.delete(component, level[key]);
			}
		}));
	},
}

var Request = {
	get: function (url, args) {
		if (url !== undefined && url !== '') {
			return Permission.permit(args).then(function (data) {
				var ajax_data = {
					type: 'post',
					data: data,
					url: '/{url}'.format({url: url}),
					error: function (xhr, ajaxOptions, thrownError) {
						if (xhr.status === 404 || xhr.status === 0) {
							Request.get(url, args);
						}
					}
				}

				return $.ajax(ajax_data);
			});
		} else {
			return new Promise(function(resolve, reject) {
				resolve();
			});
		}
	}
}
