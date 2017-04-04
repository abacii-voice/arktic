// LIST OF CHANGES

// ##### version 1
// 1. Add color and ui measurements to _ variable

var AccountApplication = function () {
	return UI.component.create('accountApplication', {
		ui: {
			template: 'div.ie',
			styles: {
				'.border': {
					'border': `${_.ui.dimensions.border} solid ${_.color.grey.normal}`,
				},
				'.border-radius': {
					'border-radius': `${_.ui.dimensions.corner}`,
				},
			},
		},
		children: [
			// AccountInterfaces.controlInterface(),
			// AccountInterfaces.transcriptionInterface(),
			// AccountInterfaces.shortcutInterface(),
			// AccountInterfaces.projectInterface(),
		],
	}).then(function (base) {
		base.initialise = function () {
			return Promise.all([
				Context.get('clients').then(function (clients) {
					var client = Object.keys(clients).filter(function (key) {
						return clients[key].is_production;
					})[0];
					return Promise.all([
						Active.set('client', client),
						Context.get(`user.clients.${client}.roles`).then(function (roles) {
							var role = Object.keys(roles).filter(function (key) {
								return roles[key].type === 'admin';
							})[0];
							return Promise.all([
								Active.set('role', role),
								Context.get(`user.clients.${client}.roles.${role}.project`).then(function (project) {
									return Active.set('project', project);
								}),
							]);
						}),
					]);
				}),
			]).then(function () {
				// return UI.changeState('clientState');
				// return UI.changeState('controlState');
				// return UI.changeState('transcriptionState');
				return UI.changeState('projectState');
			});
		}
		return base;
	});
}
