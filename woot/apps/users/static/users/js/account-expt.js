
// 1. Load context

// 2. Define global states

// 3. Define component tree
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
				UI.createComponent('umi-list-button'),
				UI.createComponent('umi-new-user-button'),
				UI.createComponent('umi-settings-button'),
			}),
			UI.createComponent('umi-primary-panel', {
				children: [
					Components.scrollList('umi-pp-user-list', {
						title: 'Users',
						search: {
							
						},
					}),
					UI.createComponent('umi-pp-user-info'),
					UI.createComponent('umi-pp-user-confirmed'),
					UI.createComponent('umi-pp-user-card', {
						children: [
							UI.createComponent('umi-pp-uc-control-panel', {
								children: [
									UI.createComponent(''),
								],
							}),
							UI.createComponent('umi-pp-uc-moderation-panel'),
							UI.createComponent('umi-pp-uc-message-panel'),
							UI.createComponent('umi-pp-uc-stats-panel'),
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
	Components.sidebar('client-sidebar'),
	Components.sidebar('role-sidebar'),
	Components.sidebar('control-sidebar'),
]);

// 4. Render app

// 5. Load data
