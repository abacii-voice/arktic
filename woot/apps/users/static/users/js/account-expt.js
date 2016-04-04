
// 1. Load context

// 2. Define global states

// 3. Define component tree
UI.createApp('hook', [
	// breadcrumbs


	// interfaces
	UI.createComponent('transcription-interface', {
		
	}),
	UI.createComponent('user-management-interface'),
	UI.createComponent('project-interface'),
	UI.createComponent('rule-interface'),
	UI.createComponent('billing-interface'),

	// sidebars
	Components.sidebar('client-sidebar'),
	Components.sidebar('role-sidebar'),
	Components.sidebar('control-sidebar'),
]);

// 4. Render app

// 5. Load data
