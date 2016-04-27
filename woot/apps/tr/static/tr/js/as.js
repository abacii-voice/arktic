
// global states
UI.createGlobalStates('details-state', [
	'client=exists-state',
	'verification-email-sent-state',
]);

/*

STEPS:
1. Opens with details state. User is prompted for the details of the client.
2. Client data is sent to the server and checked for a match, a list of possible matches is returned.
3. If the client already exists, the user is prompted to enter their details and notified that they
	 will be verified by another admin user.
4. If not, the user enters their details anyway.
5. Users are notified that a verification email has been sent and are invited to close the window.

*/

// No data to get, I'm a free man. Create dat app.
UI.createApp('hook', [
	UI.createComponent('admin-signup-wrapper', {
		template: UI.template('div', 'ie show cb pn'),
		children: [
			UI.createComponent('as-client-dialogue', {
				template: UI.template('div', 'ie show pn sp br'),
				children: [
					UI.createComponent('as-client-details-title-wrapper', {
						template: UI.template('div', 'ie show rel'),
						children: [
							UI.createComponent('as-client-details-title', {
								template: UI.template('h3', ''),
								appearance: {
									html: 'Client details',
								}
							}),
						],
					}),
					UI.createComponent('as-client-name', {
						template: UI.template('input', 'ie show ci rel'),
						appearance: {
							properties: {
								'placeholder': 'Company name',
							},
						}
					}),
					UI.createComponent('as-client-type-select', {
						template: UI.template('div', 'ie show pn sp rel'),
						children: [
							UI.createComponent('as-client-type-select-contract', {
								template: UI.template('button', 'ie show bn ba'),
								appearance: {
									html: 'Production client',
								}
							}),
							UI.createComponent('as-client-type-select-production', {
								template: UI.template('button', 'ie show bn ba'),
								appearance: {
									html: 'Contract client',
								}
							}),
						],
					}),
					UI.createComponent('as-client-contact-phone-number'),
				],
			}),
			UI.createComponent('as-user-dialogue', {
				template: UI.template('div', 'ie show pn sp'),
				children: [
					UI.createComponent('as-user-details-title-wrapper', {
						template: UI.template('div', 'ie show rel'),
						children: [
							UI.createComponent('as-user-details-title', {
								template: UI.template('h3', ''),
								appearance: {
									html: 'User details',
								}
							}),
						],
					}),
					UI.createComponent('user-name', {
						template: UI.template('div', 'ie show rel'),
						children: [
							UI.createComponent('un-first-name-input', {
								template: UI.template('input', 'ie show ci'),
								appearance: {
									properties: {
										'placeholder': 'First name',
									},
								},
							}),
							UI.createComponent('un-last-name-input', {
								template: UI.template('input', 'ie show ci'),
								appearance: {
									properties: {
										'placeholder': 'Last name',
									},
								},
							}),
						],
					}),
					UI.createComponent('email', {
						template: UI.template('input', 'ie show ci rel'),
						appearance: {
							properties: {
								'placeholder': 'Email',
							},
						},
					}),
					UI.createComponent('register-description', {
						// template: 
					}),
				],
			})
		],
	}),
]);

// Render
UI.renderApp();
