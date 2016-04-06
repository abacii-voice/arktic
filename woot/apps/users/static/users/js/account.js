// 0. Open websocket connection
// really use only for transcription / moderation / settings change, but not file upload.
// don't have to use for loading context either. Ajax is fine for that.

// 1. Load Context
Context.setFn(getdata('context', {}, function (data) {
	Context.update(data);

	if (Context.get('one_client')) {
		if (Context.get('one_role')) {
			UI.changeState('control-state');
		} else {
			UI.changeState('role-state');
		}
	}

	// debug and construction
	// $.when(new Promise (function (resolve, reject) {
	// 	Context.set('current_client', 'TestContractClient');
	// 	Context.set('current_role', 'admin')
	// })).done(function () {
	// 	UI.changeState('control-state');
	// });
}));

// 2. Define global states
UI.createGlobalStates('client-state', [
	'role-state',

	// control panel
	'control-state',

	// work interface states
	'interface-state',
	'upload-state',
	'upload-state-audio',
	'upload-date-state',
	'upload-relfile-drop-state',
	'upload-audio-drop-state',

	// ### interfaces
	'message-state',
	'billing-state',
	'stats-state',
	'rules-state',
	'user-stats-state',
	'search-state',

	// user management
	'user-management-state',
	'user-management-user-state',
	'user-management-user-stats-state',
	'user-management-user-message-state',
	'user-management-user-moderation-state',
	'user-management-user-settings-state',
	'user-management-new-user-state',
	'user-management-confirm-user-state',

	// projects
	'project-state',
]);

// 3. Define component tree
// (id, { // <- args variable
// 	root: '',
// 	template: UI.templates.*,
// 	appearance: {
// 		html: '',
// 		classes: [],
// 		style: {},
// 	},
// 	state: {
// 		states: [],
// 		svtiches: [],
// 		stateMap: {},
// 	},
// 	registry: {
// 		path: [],
// 		fn: function () {},
// 	},
// 	properties: {},
// 	bindings: [
// 		{
// 			name: 'click',
// 			fn: function () {},
// 		}
// 	],
// 	children: [],
// })
UI.createApp('hook', [
	// breadcrumbs
	Components.breadcrumbs(),

	// interfaces
	UI.createComponent('transcription-interface', {
		children: [

		],
	}),
	UI.createComponent('user-management-interface', {
		children: [
			UI.createComponent('umi-button-panel', {
				children: [
					UI.createComponent('umi-list-button'),
					UI.createComponent('umi-new-user-button'),
					UI.createComponent('umi-settings-button'),
				],
			}),
			UI.createComponent('umi-primary-panel', {
				children: [
					Components.scrollList('umi-pp-user-list', {

					}),
					UI.createComponent('umi-pp-user-info'),
					UI.createComponent('umi-pp-user-confirmed'),
					UI.createComponent('umi-pp-user-card', {
						children: [
							UI.createComponent('umi-pp-uc-control-panel', {
								children: [
									UI.createComponent('umi-pp-uc-cp-title'),
									UI.createComponent('umi-pp-uc-cp-subtitle'),
									UI.createComponent('umi-pp-uc-cp-role-panel', {
										children: [
											Components.roleIndicator('umi-pp-uc-cp-rp-admin-role'),
											Components.roleIndicator('umi-pp-uc-cp-rp-moderator-role'),
											Components.roleIndicator('umi-pp-uc-cp-rp-worker-role'),
										],
									}),
									UI.createComponent('umi-pp-uc-cp-admin-enabled-panel'), // for contract
									UI.createComponent('umi-pp-uc-cp-worker-enabled-panel'), // for mods
									UI.createComponent('umi-pp-uc-cp-action-panel', {
										children: [
											UI.createComponent('umi-pp-uc-cp-ap-message-button'),
											UI.createComponent('umi-pp-uc-cp-ap-moderation-button'),
											UI.createComponent('umi-pp-uc-cp-ap-stats-button'),
											UI.createComponent('umi-pp-uc-cp-ap-settings-button'),
										],
									}),
								],
							}),
							UI.createComponent('umi-pp-uc-message-panel'),
							UI.createComponent('umi-pp-uc-moderation-panel'),
							UI.createComponent('umi-pp-uc-stats-panel'),
							UI.createComponent('umi-pp-uc-settings-panel'),
						],
					}),
				],
			}),
			UI.createComponent('umi-new-user-panel'),
			UI.createComponent('umi-user-confirmed'),
		],
	}),
	UI.createComponent('project-interface', {
		children: [
			UI.createComponent('pi-button-panel', {
				children: [
					UI.createComponent('pi-project-list-button'),
					UI.createComponent('pi-new-project-button'),
					UI.createComponent('pi-settings-button'),
				],
			}),
			UI.createComponent('pi-primary-panel', {
				children: [
					Components.scrollList('pi-mp-project-group-list', {

					}),
					UI.createComponent('pi-mp-project-info'),
					UI.createComponent('pi-mp-project-card'),
				],
			}),
			UI.createComponent('pi-mp-project-settings-panel'),
			UI.createComponent('pi-mp-new-project-panel'),
		],
	}),
	UI.createComponent('rule-interface', {
		children: [

		],
	}),
	UI.createComponent('billing-interface', {
		children: [

		],
	}),

	// sidebars
	Components.sidebar('client-sidebar', {
		title: 'Clients',
		state: {
			states: [
				{name: 'client-state', args: {
					style: {
						'left': '0px',
					},
				}},
				{name: 'role-state', args: 'next'},
				{name: 'control-state', args: 'default'},
			],
		},
		children: [
			Components.scrollList('cs-client-list', {

			}),
		],
	}),
	Components.sidebar('role-sidebar', {
		state: {
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: {
					style: {
						'left': '50px',
					},
				}},
				{name: 'control-state', args: 'next'},
			],
		},
		children: [
			Components.scrollList('rs-role-list'),
		],
	}),
	Components.sidebar('control-sidebar', {
		state: {
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: {
					style: {
						'left': '50px',
					},
				}},
			],
		},
		children: [
			Components.scrollList('cns-action-list'),
		],
	}),
]);

// 4. Render app
UI.renderApp();

// 5. Load data
Context.load();
