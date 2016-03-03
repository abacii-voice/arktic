
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

// no data to get, I'm a free man. Create dat app.
UI.createApp('hook', [
	UI.createComponent('admin-signup-wrapper', {
		children: [
			UI.createComponent('as-client-dialogue', {
				children: [
					UI.createComponent('as-client-name'),
					UI.createComponent('as-client-type'),
					UI.createComponent('as-client-contact-phone-number'),
				],
			}),
			UI.createComponent('as-user-dialogue', {
				children: [
					UI.createComponent('user-name', {
						children: [
							UI.createComponent('un-first-name-input'),
							UI.createComponent('un-last-name-input'),
						],
					}),
					UI.createComponent('email'),
				],
			})
		],
	}),
]);

// Render
UI.renderApp();
