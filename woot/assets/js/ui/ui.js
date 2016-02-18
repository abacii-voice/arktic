var UI = {

	///////// GLOBAL STATES
	// these states define the state structure of the app.
	// Components cannot have states that are not found in the global state list

	// global state list
	gState: '',
	globalStates: [],

	// really simple method
	createGlobalState: function (name) {
		if (this.globalStates.indexOf(name) == -1) {
			this.globalStates.push(name);
		}
	},

	createGlobalStates: function (initialState, states) {
		// set initial state
		this.gState = initialState;
		this.createGlobalState(initialState);

		states.map(function (name) {
			this.createGlobalState(name);
		}, this);
	},

	///////// STATE CHANGES
	changeState: function (name) {
		UI.gState = name;
		this.states.filter(function (state) { // filter the list of states by "name"
			return state.name === name;
		}).map(function (state) { // map to components
			state.component.changeState(state);
		});
	},

	///////// COMPONENTS
	// This is the main component function
	component: function (id, properties) {
		// assign id that identifies both in the DOM and in UI.
		this.id = id;

		// root for rendering
		this.root = properties.root;

		// template
		this.template = properties.args.template;
		this.classes = properties.args.classes; // html classes
		this.style = properties.args.style;
		this.html = properties.args.html;
		this.click = properties.args.click;
		this.fn = properties.args.fn;

		// states
		if (properties.args.states !== undefined) {
			this.states = properties.args.states.map(function (statePrototype) {
				return UI.createState(statePrototype.name, this, statePrototype.args);
			}, this);
			this.state = this.states[0]; // always start with the first state in the array
		}

		// svitches
		this.svitch = properties.args.svitch;

		// components
		this.children = properties.children;

		// render
		this.model = function () {
			return $('#{id}'.format({id: this.id}));
		};

		this.render = function () {
			var root = $('#{id}'.format({id: this.root}));

			// 0. template
			var template = this.template.format({
				id: this.id,
				classes: UI.formatClasses(this.classes),
				style: UI.formatStyle(this.style),
				html: this.html,
			})

			// 1. add element to the DOM
			if (root.children().length > 0) {
				root.children().last().after(template); // place as last child
			} else {
				root.html(template); // simply place inside
			}

			// 2. Bindings
			if (this.click !== undefined) {
				var component = this;
				var model = this.model();

				model.on('click', function (e) {
					// change state if necessary
					$.when(new Promise (function () {
						// perform click function
						component.click(model);
					})).done(function () {
						if (component.svitch[UI.gState] !== undefined) {
							UI.changeState(component.svitch[UI.gState]);
						}
					});
				});
			}

			var _this = this;
			if (_this.fn !== undefined) {
				$.when(_this.fn(_this)).done(function () {
					if (_this.children !== undefined) {
						_this.children.map(_this.renderChild, _this);
					}
				});
			} else {
				if (_this.children !== undefined) {
					_this.children.map(_this.renderChild, _this);
				}
			}
		};

		this.renderChild = function (child) {
			child.root = this.id;
			child.render();
		};

		this.changeState = function (state) {
			// set state
			this.state = state;

			// apply changes to model
			var model = this.model();

			// classes
			var classes = this.state.hasOwnProperty('classes') ? this.state.classes : this.classes;
			model.addClass(classes);

			// style
			var style = this.state.hasOwnProperty('style') ? this.state.style : this.style;
			if (style !== undefined) {
				model.animate(style);
			}

			// html
			var html = this.state.hasOwnProperty('html') ? this.state.html : this.html;
			if (html !== undefined) {
				model.html(html);
			}

			// fn
			if (this.state.fn !== undefined) {
				this.state.fn(this);
			}
		};
	},

	// stores a list of components and their attributes
	components:{},

	// factory method that creates and returns a component, adding to the list of components
	createComponent: function (id, args) {
		var component = new this.component(id, args);
		this.components[id] = component;
		return component;
	},

	getComponent: function (id) {
		return this.components[id];
	},

	///////// STATES
	// basic state object
	state: function (name, component, args) {
		// identify the state by its name and the component it belongs to.
		this.name = name;
		this.component = component;

		// args
		this.classes = args.classes;
		this.style = args.style;
		this.html = args.html;
		this.fn = args.fn;
	},

	// list of states
	states:[],

	// factory method that adds the state prototype to the array of states
	createState: function (name, component, args) {
		if (this.globalStates.indexOf(name) != -1) {
			var state = new this.state(name, component, args);
			this.states.push(state);
			return state;
		} else {
			throw 'State name, {name}, must be in the global list of states: {states}'.format({name:name, states:this.globalStates});
		}
	},

	///////// TEMPLATES
	// These are html templates that can be called
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
		`
	},

	///////// FORMATTING
	formatStyle: function (style) {
		if (style !== undefined) {
			var strings = Object.keys(style).map(function (value) {
				return '{key}: {value}; '.format({key: value, value: style[value]})
			});
			return strings.join('');
		} else {
			return '';
		}
	},

	formatClasses: function (classes) {
		if (classes !== undefined) {
			return classes.join(' ');
		} else {
			return '';
		}
	}

}
