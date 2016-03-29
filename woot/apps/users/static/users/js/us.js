
// global states
UI.createGlobalStates('details-state', [
	
]);

/*

STEPS:
1. Opens with details state. User is prompted for their details.
2. User data is sent to the server and checked for conflicts.
3. If no conflicts, user is accepted and notified that their account will be approved by an admin.
4. Users are then redirected to the account page

*/

// no data to get, I'm a free man. Create dat app.
UI.createApp('hook', [
	UI.createComponent('user-signup-wrapper', {
		children: [
			UI.createComponent('us-client-notice', {
				children: [
					UI.createComponent('as-client-name'),
					UI.createComponent('as-admin-name'),
					UI.createComponent('as-admin-email'),
					UI.createComponent('as-user-roles'),
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
