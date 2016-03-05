// 0. Open websocket connection
// really use only for transcription / moderation / settings change, but not file upload.
// don't have to use for loading context either. Ajax is fine for that.

// 1. Load Context
Context.setFn(ajax('user_context', {}, function (data) {
	Context.store = data;

	if (Context.get('one_client')) {
		if (Context.get('one_role')) {
			UI.changeState('control-state');
		} else {
			UI.changeState('role-state');
		}
	}
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

	// interfaces
	'message-state',
	'billing-state',
	'stats-state',
	'rules-state',
	'user-stats-state',
	'search-state',
	'user-management-state',
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
	UI.createComponent('breadcrumbs', {
		children: [
			UI.createComponent('breadcrumbs-client'),
			UI.createComponent('breadcrumbs-role'),
			UI.createComponent('breadcrumbs-location'),
		],
	}),

	// interfaces
	// now
	UI.createComponent('audio-interface', {

	}),
	UI.createComponent('upload-interface', {
		children: [
			UI.createComponent('upload-interface-left-panel', {
				children: [
					UI.createComponent('new-project-dialogue', {
						children: [
							UI.createComponent('project-title'),
							UI.createComponent('project-name-input'),
							UI.createComponent('project-deadline-date-picker'),
							UI.createComponent('project-description-textarea'),
						],
					}),
					UI.createComponent('rel-file-dropzone-wrapper', {
						children: [
							UI.createComponent('rel-file-title'),
							UI.createComponent('rel-file-dropzone', {
								children: [
									UI.createComponent('rel-file-dropzone-guide', {
										children: [
											UI.createComponent('rel-file-dropzone-guide-title'),
											UI.createComponent('rel-file-dropzone-guide-table'),
										],
									}),
									UI.createComponent('rel-file-dropzone-warning'),
								],
							}),
							UI.createComponent('rel-file-file-list'),
						],
					}),
				],
			}),
			UI.createComponent('upload-interface-right-panel', {
				children: [
					UI.createComponent('audio-title', {

					}),
					UI.createComponent('audio-file-dropzone-wrapper', {
						children: [
							UI.createComponent('audio-file-dropzone'),
							UI.createComponent('audio-file-confirmation-panel'),
						],
					}),
					UI.createComponent('upload-confirmation-button'),
				],
			}),
		],
	}),
	UI.createComponent('user-management-interface', {
		children: [
			UI.createComponent('user-management-interface-left-panel', {
				children: [
					UI.createComponent('user-role-filter'),
					UI.createComponent('user-list'),
				],
			}),
			UI.createComponent('user-management-interface-right-panel', {
				children: [
					UI.createComponent('user-card-wrapper', {
						children: [
							UI.createComponent('user-card'),
							UI.createComponent('new-user-button'),
							UI.createComponent('new-user-card'),
						],
					}),
				],
			}),
		],
	}),
	UI.createComponent('project-interface', {
		children: [
			UI.createComponent('project-interface-left-panel', {
				children: [
					UI.createComponent('project-list'),
				],
			}),
			UI.createComponent('project-interface-right-panel', {
				children: [
					UI.createComponent('project-card-wrapper', {
						children: [
							UI.createComponent('project-card'),
							UI.createComponent('new-project-button'),
						],
					}),
				],
			}),
		],
	}),
	UI.createComponent('billing-interface', {
		children: [
			UI.createComponent('billing-interface-left-panel', {
				children: [
					UI.createComponent('billing-user-search'),
					UI.createComponent('billing-confirmed-filter'),
					UI.createComponent('billing-date-list'),
				],
			}),
			UI.createComponent('billing-interface-right-panel', {
				children: [
					UI.createComponent('billing-card-wrapper', {
						children: [
							UI.createComponent('billing-card'),
							UI.createComponent('billing-card-confirm-button'),
						],
					}),
				],
			}),
		],
	}),
	UI.createComponent('rule-interface', {
		children: [
			UI.createComponent('rule-interface-left-panel', {
				children: [
					UI.createComponent('rule-search'),
					UI.createComponent('rule-list'),
				],
			}),
			UI.createComponent('rule-interface-right-panel', {
				children: [
					UI.createComponent('rule-card-wrapper', {
						children: [
							UI.createComponent('rule-card'),
							UI.createComponent('new-rule-button'),
							UI.createComponent('new-rule-card'),
						],
					}),
				],
			}),
		],
	}),

	// later
	UI.createComponent('search-interface', {
		children: [
			UI.createComponent('search-bar'),
			UI.createComponent('search-results'),
		],
	}),
	UI.createComponent('message-interface', {

	}),
	UI.createComponent('stats-interface', {

	}),

	// sidebars
	UI.createComponent('control-sidebar-wrapper', {
		children: [
			UI.createComponent('control-sidebar'),
			UI.createComponent('control-back-sidebar'),
		],
	}),
	UI.createComponent('client-sidebar-wrapper', {
		children: [
			UI.createComponent('client-sidebar', {
				children: [
					UI.createComponent('cs-title', {
						children: [
							UI.createComponent('cs-title-h3'),
							UI.createComponent('cs-title-lower-divider'),
						],
					}),
				],
			}),
			UI.createComponent('client-back-sidebar'),
		],
	}),
	UI.createComponent('role-sidebar-wrapper', {
		children: [
			UI.createComponent('role-sidebar'),
			UI.createComponent('role-back-sidebar'),
		],
	}),
	UI.createComponent('interface-back-sidebar', {

	}),

]);

// 4. Render app
UI.renderApp();

// 5. Load data
Context.update();
