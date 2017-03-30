var UserSignupApplication = function (id, args) {
	return UI.createComponent('{id}-base'.format({id: id}), {
		name: 'base',
		template: UI.template('div', 'ie'),
		appearance: {
			style: {
				'height': '100%',
			},
		},
		children: [
			UserSignupInterface(),
		],
	});
}
