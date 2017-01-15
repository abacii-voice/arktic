var Request = {
	load_audio: function (transcriptionId) {
		return Permission.permit({id: transcriptionId}).then(function (data) {
			return new Promise(function(resolve, reject) {
				request = new XMLHttpRequest();
				request.open('POST', '/command/load_audio/', true);
				request.responseType = 'arraybuffer';
				request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				request.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
				request.addEventListener('load', function (event) {
					resolve(event.target.response);
				}, false);
				request.send(data);
			});
		});
	},
	submit_revisions: function (revisionData) {
		return Permission.permit({fragments: revisionData}).then(function (data) {
			var ajax_data = {
				type: 'post',
				data: data,
				url: '/command/submit_revisions/',
				error: function (xhr, ajaxOptions, thrownError) {
					if (xhr.status === 404 || xhr.status === 0) {
						Request.submit_revisions(revisionData);
					}
				},
			}
			return $.ajax(ajax_data);
		});
	},
}
