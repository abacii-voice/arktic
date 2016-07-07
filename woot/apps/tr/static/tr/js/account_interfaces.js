var AccountInterfaces = {
	transcriptionInterface: function () {
		var id = 'transcription-interface';

		return Promise.all([
			UI.createComponent('{id}-base'.format({id: id}), {
				template: UI.template('div', 'ie abs centred-vertically'),
				appearance: {
					style: {
						'height': '70%',
						'width': '954px',
						'left': '120px',
						'opacity': '0',
					},
				},
				state: {
					defaultState: {
						style: {
							'opacity': '0',
							'left': '0px',
						},
						fn: function (_this) {
							return function (resolve, reject) {
								_this.model().css({'display': 'none'});
								resolve();
							}
						},
					},
					states: [
						{name: 'transcription-state', args: {
							preFn: function (_this) {
								return function (resolve, reject) {
									_this.model().css({'display': 'block'});
									resolve();
								}
							},
							style: {
								'left': '60px',
								'opacity': '1',
							},
						}},
						{name: 'control-state'},
					],
				},
			}),

			// counter must have the following methods:
			// 1. increment
			// 2. decrement
			// 3. clear
			Components.counter('{id}-counter'.format({id: id}), {
				appearance: {
					style: {
						'height': '100%',
						'width': '80px',
						'float': 'left',
					},
				},
				registry: {
					'transcription-state': {
						path: 'user.clients',
						fn: function (_this) {
							_this.load();
						}
					},
				},
				options: {
					source: {
						daily: function () {
							return Promise.all([
								Active.get('client'),
								Context.get('user').then(function (user) {
									return user.id;
								}),
								Permission.get(),
							]).then(function (results) {
								// unpack variable
								var client = results[0];
								var user_id = results[1];
								var role_id = results[2];

								return 'user.clients.{client}.roles.{role_id}.daily_count'.format({client: client, role_id: role_id});
							});
						},
						cycle: function () {
							return Promise.all([
								Active.get('client'),
								Context.get('user').then(function (user) {
									return user.id;
								}),
								Permission.get(),
							]).then(function (results) {
								// unpack variable
								var client = results[0];
								var user_id = results[1];
								var role_id = results[2];

								return 'user.clients.{client}.roles.{role_id}.cycle_count'.format({client: client, role_id: role_id});
							});
						},
					},
				},
			}),

			// scroll must have the following methods:
			// 1. an external method placed inside the on-input function of the search input. DONE
			Components.scroll('{id}-counter'.format({id: id})),

			// This holds tokens, audio, original, and modified
			UI.createComponent('{id}-transcription-panel'.format({id: id})),

			// TOKEN FIELD
			// The token field is one of only two components that are directly affected by the search input
			// tokens are separated by spaces, but spaces are not directly rendered.
			Components.renderedTextField('{id}-counter'.format({id: id})),

			// audio requires the following methods:
			// 1. play/replay, stop (reset), remove cut
			Components.audio('{id}-counter'.format({id: id})),

			// ORIGINAL CAPTION
			// Completely static. Nothing can change it.
			Components.renderedTextField('{id}-counter'.format({id: id})),

			// MODIFIED CAPTION
			// Reacts to changes in the search bar.
			Components.renderedTextField('{id}-counter'.format({id: id})),

			// This can be triggered by searching for rules, flags, or tags in the search box
			UI.createComponent('{id}-info-panel'.format({id: id})),

			// This holds the buttons
			UI.createComponent('{id}-control-panel'.format({id: id})),

			//
			UI.createComponent('{id}-previous-button'.format({id: id})),
			UI.createComponent('{id}-next-button'.format({id: id})),
			UI.createComponent('{id}-done-button'.format({id: id})),
			UI.createComponent('{id}-flags-button'.format({id: id})),
		]).then(function (components) {

			// unpack components
			var base = components[0];
			var counter = components[1];
			var scroll = components[2];
			var transcriptionPanel = components[3];
			var tokens = components[4];
			var audio = components[5];
			var originalCaption = components[6];
			var modifiedCaption = components[7];
			var infoPanel = components[8];
			var controlPanel = components[9];
			var nextButton = components[10];
			var doneButton = components[11];
			var flagsButton = components[12];

			// add methods and properties


			// associate components
			transcriptionPanel.setChildren([
				tokens,
				audio,
				originalCaption,
				modifiedCaption,
			]);

			controlPanel.setChildren([
				nextButton,
				doneButton,
				flagsButton,
			]);

			base.setChildren([
				counter,
				scroll,
				transcriptionPanel,
				infoPanel,
				controlPanel,
			]);

			// return base
			return base;
		});
	},
}
