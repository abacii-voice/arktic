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

				if (_this.isRendered) {
					return (after !== '' ? function () {
						return UI.getComponent(_this.after).then(function (before) {
							return _this.setRoot(before.root).then(function (child) {
								return new Promise(function(resolve, reject) {
									_this.model().insertAfter(before.model());
									resolve();
								});
							});
						});
					} : function () {
						return _this.parent().then(function (parent) {
							return new Promise(function(resolve, reject) {
								_this.model().insertBefore(parent.model().children().first());
								resolve();
							});
						});
					})().then(function () {
						return _this.parent().then(function (parent) {
							return parent.setChildIndexes();
						})
					});
				} else {
					return Util.ep(_this.after);
				}
			} else {
				return Util.ep(this.after);
			}
		}
		this.setRoot = function (root) {
			var _this = this;
			var currentRoot = (_this.root || 'hook');
			newRoot = (root || currentRoot);

			if (newRoot !== currentRoot) {
				_this.root = newRoot;
				// 1. get the current parent.
				// 2.	remove the child from the current parent.
				// 3. append to new parent model.
				// 4. change the root value.
				// 5. get the new parent.
				// 6. add the child to new parent.
				if (_this.isAddedToParent) {
					return _this.parent().then(function (parent) {
						return parent.removeChild(_this.id);
					}).then(function () {
						return new Promise(function(resolve, reject) {
							_this.root = newRoot;
							if (_this.isRendered) {
								_this.model().appendTo('#{id}'.format({id: newRoot}));
							}
							resolve(newRoot);
						});
					}).then(UI.getComponent).then(function (newParent) {
						return newParent.addChild(_this);
					});
				} else {
					return Util.ep();
				}
			} else {
				_this.root = newRoot;
				return new Promise(function(resolve, reject) {
					resolve(_this.root);
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
						return Promise.all(_this.children.map(function (child) {
							return new Promise(function(resolve, reject) {
								child.model().appendTo('#{id}'.format({id: _this.id}));
								resolve();
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
					classes: Util.format.classes(classes),
					style: Util.format.style(style),
					properties: Util.format.properties(properties),
					html: html,
				});
				resolve(renderedTemplate);
			});
		}
		this.setAppearance = function (appearance) {
			var currentProperties = (this.properties || {});
			var currentHTML = (this.html || '');
			var currentClasses = (this.classes || []);
			var currentStyle = (this.style || {});

			if (appearance !== undefined) {
				this.properties = (appearance.properties || currentProperties);
				this.html = appearance.html !== undefined ? appearance.html : currentHTML;

				// classes need to be a combination of ones removed and ones added. If "add" and "remove" are not present, defaults to using whole object.
				this.classes = currentClasses;
				var addClasses = appearance.classes ? (appearance.classes.add ? ($.isArray(appearance.classes.add) ? appearance.classes.add : [appearance.classes.add]) : (appearance.classes.remove ? [] : appearance.classes)) : [];
				var removeClasses = appearance.classes ? (appearance.classes.remove ? ($.isArray(appearance.classes.remove) ? appearance.classes.remove : [appearance.classes.remove]) : []) : [];
				var _this = this;
				this.classes = this.classes.concat(addClasses.filter(function (cls) {
					return _this.classes.indexOf(cls) === -1;
				}));
				this.classes = this.classes.filter(function (cls) {
					return removeClasses.indexOf(cls) === -1;
				});

				this.style = (appearance.style || currentStyle);

				if (this.isRendered) {
					// model
					var model = _this.model();
					return model.animate(appearance.style, 300).promise().then(function () {
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
					}).then(function () {
						return new Promise(function(resolve, reject) {
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
							resolve();
						});
					});
				} else {
					return new Promise(function(resolve, reject) {
						resolve(appearance);
					});
				}
			} else {
				return new Promise(function(resolve, reject) {
					resolve({
						properties: currentProperties,
						html: currentHTML,
						classes: currentClasses,
						style: currentStyle,
					});
				});
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
			return UI.changeState(this.mapState(UI.globalState), this.id);
		}
		this.setRegistry = function (registry) {
			var _this = this;
			if (registry !== undefined) {
				return Promise.all(Object.keys(registry).map(function (state) {
					var entry = registry[state];
					var args = entry.args !== undefined ? entry.args : {};
					return Registry.register(_this, state, entry.path, args, entry.fn);
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
						// if rendered, add to model
						if (_this.isRendered) {
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
			return new Promise(function(resolve, reject) {
				child.index = (child.index || _this.children.length);
				child.isAddedToParent = true;
				_this.children.splice(child.index, 0, child);
				resolve(child);
			});
		}
		this.removeChild = function (id) {
			var _this = this;
			return UI.getComponent(id).then(function (child) {
				return new Promise(function(resolve, reject) {
					_this.children.splice(child.index, 1);
					resolve(id);
				})
			}).then(UI.removeComponent).then(function () {
				// renumber children
				return _this.setChildIndexes();
			});
		}
		this.removeChildren = function () {
			var _this = this;
			return Promise.ordered(_this.children.map(function (child) {
				return function () {
					return _this.removeChild(child.id);
				}
			}));
		}
		this.setChildren = function (children) {
			var _this = this;
			console.log(_this.id);
			_this.children = (_this.children || []);
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
			if (_this.after !== undefined) {
				return UI.getComponent(_this.after).then(function (component) {
					return new Promise(function(resolve, reject) {
						_this.index = component !== undefined ? component.index + 1 : 0;
						resolve(_this);
					});
				});
			} else {
				return new Promise(function(resolve, reject) {
					_this.index = placementIndex;
					resolve(_this);
				});
			}
		}
		this.update = function (args) {
			args = args !== undefined ? args : {};
			var _this = this;
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
		this.model = function (single) {
			if (single !== undefined && single) {
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
			var root = $('#{id}'.format({id: _this.root}));
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
						child.root = _this.id;
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

			// 1. Run preFn
			return (state.preFn || Util.ep)(_this).then(function () {
				// 2. Run appearance
				return _this.setAppearance({
					classes: state.classes,
					style: state.style,
					html: state.html,
				});
			}).then(function () {
				// 3. Run fn
				return (state.fn || Util.ep)(_this);
			});
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
				return this.component.changeState(this);
			}
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
		show: function (_this) {
			return _this.setAppearance({
				classes: {remove: ['hidden']},
			}).then(function () {
				return _this.setAppearance({
					style: {opacity: 1},
				});
			});
		},
		hide: function (_this) {
			return _this.setAppearance({
				style: {opacity: 0},
			}).then(function () {
				return _this.setAppearance({
					classes: {add: ['hidden']},
				});
			});
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
		var force = (args || {}).force || false;
		var options = ((args || {}).options || {});

		return (path.then !== undefined ? path : new Promise(function(resolve, reject) {
			resolve(path);
		})).then(function (calculatedPath) {
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
		return (path.then !== undefined ? path : new Promise(function(resolve, reject) {
			resolve(path);
		})).then(function (calculatedPath) {
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
	set: function (path, value) {
		return (path.then !== undefined ? path : new Promise(function(resolve, reject) {
			resolve(path);
		})).then(function (calculatedPath) {
			return new Promise(function (resolve, reject) {
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
							if (sub[context_path[i]] !== undefined) {
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
	// stores relevant permission details
	permission: '',
	get: function () {
		return new Promise(function(resolve, reject) {
			resolve(Permission.permission);
		});
	},

	set: function (id) {
		return new Promise(function(resolve, reject) {
			Permission.permission = id;
			resolve();
		});
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
	load_audio: function (transcriptionId) {
		return Permission.permit({id: transcriptionId}).then(function (data) {
			return new Promise(function(resolve, reject) {
				request = new XMLHttpRequest();
				request.open('POST', '/command/load_audio/', true);
				request.responseType = 'arraybuffer';
				request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				request.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
				request.addEventListener('load', function (event) {
					resolve(event.target.response);
				}, false);
				request.send(data);
			});
		});
	},
}
