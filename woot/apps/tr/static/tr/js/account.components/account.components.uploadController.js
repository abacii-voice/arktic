var AccountComponents = (AccountComponents || {});
AccountComponents.uploadController = function () {
	var id = Util.makeid();
	return UI.createComponent('upload-controller-{}'.format({id: id})).then(function (base) {

		// controller logic
		base.unpackZip = function (file) {
			// try reading file
			var reader = new FileReader();
			var zip = new JSZip();
			reader.onload = function(e) {
				var contents = e.target.result;
				zip.load(contents);

				// 1. get relfile from zip
				// 2. open and get list of filenames and their captions
				// 3. place files to be uploaded in Active under contract_client.uploads.{random key} - store key and path
				// 4. display list of files in a list in the upload panel by fetching from active
			}

			reader.readAsBinaryString(file);
		}
		base.upload = {
			start: function () {

			},
		}

		return Promise.all([

		]).then(function () {
			return base;
		});
	});
}
