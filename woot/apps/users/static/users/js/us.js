
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
					UI.createComponent('usdp-first-name-input'),
					UI.createComponent('usdp-last-name-input'),
					UI.createComponent('usdp-email-input'),
					UI.createComponent('usdp-password-input'),
					UI.createComponent('usdp-password-repeat-input'),
					UI.createComponent('usdp-loading-icon'),
					UI.createComponent('usdp-loading-icon'),
				],
			}),
			UI.createComponent('us-confirm-panel', {
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
					UI.createComponent('uscp-confirmed'),
				],
			}),
		],
	}),
]);

// Render
UI.renderApp();

// Load
Context.load();
