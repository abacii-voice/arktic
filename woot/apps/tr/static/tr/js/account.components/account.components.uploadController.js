var AccountComponents = (AccountComponents || {});
AccountComponents.uploadController = function () {
	var id = Util.makeid();
	return UI.createComponent('upload-controller-{}'.format({id: id})).then(function (base) {

		// controller logic
		base.unpackZip = function (file, done) {
			// try reading file
			var reader = new FileReader();
			var zip = new JSZip();
			reader.onload = function(e) {
				var contents = e.target.result;
				zip.load(contents);

				// extract list of files and cut off directory name
				var filenames = Object.keys(zip.files).filter(function (key) {
					console.log(zip.files[key]);
					return !zip.files[key].dir;
				}).map(function (key) {
					return Util.basename(key);
				});

				//
			}

			reader.readAsBinaryString(file);
		}

		return Promise.all([

		]).then(function () {
			return base;
		});
	});
}
