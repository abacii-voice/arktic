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
}
