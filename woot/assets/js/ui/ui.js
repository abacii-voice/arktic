var UI = {

	///////// COMPONENTS
	// This is the main component function
	component: function (id, args) {
		// assign id that identifies both in the DOM and in UI.
		this.id = id;

		// template
		this.template = args.template;
		this.class = args.class; // html classes
		this.style = args.style;

		// states
		this.states = args.states.map(function (state) {

		});
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

		// finally, add it to the list of states for the component
		this.component.states[this.name] = this;
	},

	// list of states
	states:[],

	// factory method that adds the state prototype to the array of states
	createState: function (name, component, args) {
		if (this.globalStates.indexOf(name) != -1) {
			var state = new this.state(name, component, args);
			this.states.push({name: name, component: component});
			return state;
		} else {
			throw 'State name, {name}, must be in the global list of states: {states}'.format({name:name, states:this.globalStates});
		}
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

	///////// TEMPLATES
	// These are html templates that can be called
	templates: {
		sidebar: `
			<div id='{id}' class='sidebar'>
			<div>
		`,
		panel:`

		`,
		button:`

		`,
	},
}
