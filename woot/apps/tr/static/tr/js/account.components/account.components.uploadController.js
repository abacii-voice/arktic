var AccountComponents = (AccountComponents || {});
AccountComponents.uploadController = function () {
	var id = Util.makeid();
	return UI.createComponent('upload-controller-{}'.format({id: id})).then(function (base) {

		// controller logic
		base.unpackZip = function (file) {
			// try reading file
			var zipReader = new FileReader();
			var zip = new JSZip();
			zipReader.onload = function(e) {
				var contents = e.target.result;
				zip.load(contents);

				// 1. get relfile from zip
				var relfileData = Object.keys(zip.files).filter(function (key) {
					return key.contains('.csv');
				}).map(function (key) {
					return zip.file(key);
				})[0];

				// 2. open and get list of filenames and their captions
				var relfileContent = zip.file(relfileData.name).asText();
				var relfileCaptions = {};
				relfileContent.split('\n').forEach(function (line) {
					let [filename, caption] = line.split(',');
					filename = Util.basename(filename);
					if (filename.contains('.wav')) {
						if (filename in relfileCaptions) {
							relfileCaptions[filename].duplicate = true;
						} else {
							relfileCaptions[filename] = {caption: caption};
						}
					}
				});

				// 3. place files to be uploaded in Context under contract_client > new_uploads
				var audioFiles = Object.keys(zip.files).filter(function (key) {
					return key.contains('.wav');
				}).map(function (key) {
					return zip.file(key);
				});

				var audioDataInstances = {};
				audioFiles.forEach(function (audioFile) {
					let filename = Util.basename(audioFile.name);
					let instance = {name: filename};
					if (filename in relfileCaptions) {
						instance.caption = relfileCaptions[filename].caption;
					} else {
						instance.caption = '';
						instance.noCaption = true;
					}
				});

				// ???? Will this just work?
				// Context.set('clients.{client_id}.contract_clients.{contract_client_id}.projects.{project_id}.uploads.{upload_id}'.format(), audioDataInstances);

				// 4. trigger state to prompt display lists to draw from Context

			}

			zipReader.readAsBinaryString(file);
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
