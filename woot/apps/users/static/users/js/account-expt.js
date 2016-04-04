
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
										Components.roleIndicator('umi-pp-uc-cp-rp-admin-role'),
										Components.roleIndicator('umi-pp-uc-cp-rp-moderator-role'),
										Components.roleIndicator('umi-pp-uc-cp-rp-worker-role'),
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
	Components.sidebar('client-sidebar'),
	Components.sidebar('role-sidebar'),
	Components.sidebar('control-sidebar'),
]);

// 4. Render app

// 5. Load data
