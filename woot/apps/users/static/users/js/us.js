
// data
Context.setFn(getdata('us_data', initialData, function (data) {
	Context.update(data);
}));

// global states
UI.createGlobalStates('initial-state', [
	'confirmed-state',
]);

/*

STEPS:
1. Opens with details state. User is prompted for their details.
2. User data is sent to the server and checked for conflicts.
3. If no conflicts, user is accepted and notified that their account will be approved by an admin.
4. Users are then redirected to the account page

0c26e88d-e901-4a33-9946-76da9387a414
7lfGzO4lly5J

http://localhost:8000/verify/0c26e88d-e901-4a33-9946-76da9387a414/7lfGzO4lly5J

*/

UI.createApp('hook', [
	UI.createComponent('user-signup-wrapper', {
		children: [
			UI.createComponent('us-details-panel', {
				template: UI.template('div', 'ie show centred'),
				appearance: {
					style: {
						'height': '400px',
						'width': '550px',
					},
				},
				state: {
					states: [
						{name: 'initial-state', args: {
							preFn: UI.functions.activate,
							style: {
								'opacity': '1.0',
							},
						}},
						{name: 'confirmed-state', args: {
							style: {
								'opacity': '0.0',
							},
							fn: UI.functions.deactivate,
						}},
					],
				},
				children: [
					UI.createComponent('usdp-details-title', {
						template: UI.template('h3', 'ie show relative'),
						appearance: {
							style: {
								'top': '10px',
								'left': '10px',
								'width': '200px',
								'margin-bottom': '10px',
							},
							html: 'User details'
						},
					}),
					UI.createComponent('usdp-first-name-input', {
						template: UI.template('input', 'ie show input border border-radius relative'),
						appearance: {
							style: {
								'top': '10px',
								'left': '10px',
								'width': '200px',
								'margin-bottom': '10px',
							},
						},
						registry: {
							path: function () {
								return ['first_name'];
							},
							fn: function (_this, data) {
								var firstName = data;
								_this.update({
									appearance: {
										properties: {
											'placeholder': firstName,
										},
									},
								});
							},
						},
					}),
					UI.createComponent('usdp-last-name-input', {
						template: UI.template('input', 'ie show input border border-radius relative'),
						appearance: {
							style: {
								'top': '10px',
								'left': '10px',
								'width': '200px',
								'margin-bottom': '10px',
							},
						},
						registry: {
							path: function () {
								return ['last_name'];
							},
							fn: function (_this, data) {
								var lastName = data;
								_this.update({
									appearance: {
										properties: {
											'placeholder': lastName,
										},
									},
								});
							},
						},
					}),
					UI.createComponent('usdp-email-input', {
						template: UI.template('input', 'ie show input border border-radius relative'),
						appearance: {
							style: {
								'top': '10px',
								'left': '10px',
								'width': '300px',
								'margin-bottom': '10px',
							},
						},
						registry: {
							path: function () {
								return ['email'];
							},
							fn: function (_this, data) {
								var email = data;
								_this.update({
									appearance: {
										properties: {
											'placeholder': email,
										},
									},
								});
							},
						},
					}),
					UI.createComponent('usdp-password-title', {
						template: UI.template('h3', 'ie show relative'),
						appearance: {
							style: {
								'top': '10px',
								'left': '10px',
								'width': '200px',
								'margin-bottom': '10px',
								'margin-top': '20px',
							},
							html: 'Choose a password'
						},
					}),
					UI.createComponent('usdp-password-input', {
						template: UI.template('input', 'ie show input border border-radius relative'),
						appearance: {
							style: {
								'top': '10px',
								'left': '10px',
								'width': '200px',
								'margin-bottom': '10px',
							},
							properties: {
								'type': 'password',
								'placeholder': 'Password',
							},
						},
					}),
					UI.createComponent('usdp-password-repeat-input', {
						template: UI.template('input', 'ie show input border border-radius relative'),
						appearance: {
							style: {
								'top': '10px',
								'left': '10px',
								'width': '200px',
								'margin-bottom': '10px',
							},
							properties: {
								'type': 'password',
								'placeholder': 'Repeat password',
							},
						},
					}),
					UI.createComponent('usdp-confirm-button', {
						template: UI.templates.button,
						appearance: {
							style: {
								'transform': 'none',
								'left': '10px',
								'top': '10px',
								'height': '40px',
								'padding-top': '10px',
							},
							html: 'Confirm',
							classes: ['relative', 'border', 'border-radius'],
						},
						state: {
							stateMap: 'confirmed-state',
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								// 1. check details and compile data
								// 2. send data and wait for reply
								// 3. change state to confirmed
								_this.triggerState();
							}}
						],
					}),
					UI.createComponent('usdp-loading-icon', {
						template: UI.templates.loadingIcon,
						appearance: {
							style: {
								'display': 'none',
							},
						},
					}),
				],
			}),
			UI.createComponent('us-confirm-panel', {
				template: UI.template('div', 'ie show centred border border-radius'),
				appearance: {
					style: {
						'height': '400px',
						'width': '550px',
						'border-style': 'dotted',
					},
				},
				state: {
					states: [
						{name: 'initial-state', args: {
							style: {
								'opacity': '0.0',
							},
							fn: UI.functions.deactivate,
						}},
						{name: 'confirmed-state', args: {
							preFn: UI.functions.activate,
							style: {
								'opacity': '1.0',
							},
						}},
					],
				},
				children: [
					UI.createComponent('uscp-confirmed', {
						template: UI.template('h3', 'ie show centred-horizontally'),
						appearance: {
							html: 'Account confirmed.',
							style: {
								'top': '100px',
							},
						},
					}),
					UI.createComponent('uscp-blurb', {
						template: UI.template('span', 'ie show centred-horizontally'),
						appearance: {
							style: {
								'width': '300px',
								'height': '100px',
								'top': '150px',
							},
							html: 'Your account has been added, please click the button below to be directed to the login page.',
						},
					}),
					UI.createComponent('uscp-login-button', {
						template: UI.templates.button,
						appearance: {
							style: {
								'top': '240px',
								'width': '150px',
								'height': '40px',
								'padding-top': '10px',
							},
							classes: ['border', 'border-radius'],
							html: 'Proceed to login',
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								window.location = '/login/';
							}}
						],
					}),
				],
			}),
		],
	}),
]);

// Render
UI.renderApp();

// Load
Context.load();
