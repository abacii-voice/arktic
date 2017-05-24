var Request = {
	submit_actions: function (actions) {
		return Permission.permit({actions: actions}).then(function (data) {
			var ajax_data = {
				type: 'post',
				data: data,
				url: '/command/submit_actions/',
				error: function (xhr, ajaxOptions, thrownError) {
					if (xhr.status === 404 || xhr.status === 0) {
						setTimeout(function () {
							Request.submit_actions(actions);
						}, 1000);
					}
				},
			}
			return $.ajax(ajax_data);
		});
	},
}
