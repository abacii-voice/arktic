var UI = {

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

		// states
		this.states = properties.args.states.map(function (statePrototype) {
			return UI.createState(statePrototype.name, this, statePrototype.args);
		}, this);
		this.state = this.states[0]; // always start with the first state in the array

		// svitches
		this.svitches = properties.args.svitches.map(function (svitchPrototype) {
			return UI.createSwitch(this.states[svitchPrototype.name], this, svitchPrototype.trigger, svitchPrototype.args);
		}, this);

		// components
		this.children = properties.children;

		// render
		this.model = function () {
			return $('#{id}'.format({id: this.id}));
		}

		this.render = function () {
			var root = $('#{id}'.format({id: this.root}));

			// 0. template
			var template = this.template.format({
				id: this.id,
				classes: this.classes,
				style: this.style,
				html: this.html,
			})

			// 1. add element to the DOM
			if (root.children().length > 0) {
				root.children().last().after(template); // place as last child
			} else {
				root.html(template); // simply place inside
			}

			// 2. render children
			this.children.map(function (child) {
				child.root = this.id;
				child.render();
			}, this);
		}
	},

	// stores a list of components and their attributes
	components:{},

	// factory method that creates and returns a component, adding to the list of components
	createComponent: function (id, args) {
		var component = new this.component(id, args);
		this.components[id] = component;
		return component;
	},

	///////// STATES
	// basic state object
	state: function (name, component, args) {
		// identify the state by its name and the component it belongs to.
		this.name = name;
		this.component = component;
		this.args = args;
	},

	getComponent: function (id) {
		return this.components[id];
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

	///////// SVITCHES
	svitch: function (state, component, triggerID, args) {
		this.state = state;
		this.component = component;
		this.triggerID = triggerID;
		this.args = args;
	},

	createSwitch: function (state, component, triggerID, args) {
		var svitch = new this.svitch(state, component, triggerID, args);
		return svitch;
	},

	///////// GLOBAL STATES
	// these states define the state structure of the app.
	// Components cannot have states that are not found in the global state list

	// global state list
	globalStates: [],

	// really simple method
	createGlobalState: function (name) {
		if (this.globalStates.indexOf(name) == -1) {
			this.globalStates.push(name);
		}
	},

	createGlobalStates: function (states) {
		states.map(function (name) {
			this.createGlobalState(name);
		}, this);
	},

	///////// TEMPLATES
	// These are html templates that can be called
	templates: {
		sidebar: `
			<div id='{id}' class='sidebar {classes}'></div>
		`,
		panel:`

		`,
		button:`
			<div id={id} class='btn btn-default'>
				{html}
			</div>
		`,
	},

	///////// STATE CHANGES

}
