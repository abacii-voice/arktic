var AccountComponents = (AccountComponents || {});
AccountComponents.uploadController = function () {
	var id = Util.makeid();
	return UI.createComponent('upload-controller-{}'.format({id: id})).then(function (base) {

		// controller logic
		base.upload = {
			error: {
				any: function () {
					return base.upload.error.no_zip_or_folder || base.upload.error.no_relfile || base.upload.error.relfile_duplicates || base.upload.error.no_caption || base.error.upload.server_duplicates;
				},
				no_zip_or_folder: false,
				no_relfile: false,
				relfile_duplicates: false,
				no_caption: false,
				server_duplicates: false,
			},
			buffer: {
				id: undefined,
				addAudio: function () {

				},
				relfile: {},
				audio: {},
				push: function () {
					// reset buffer
					// reset id
					// reset errors
				},
			},
			unpack: function (file) {
				// sort by file type
				if (file.type === 'audio/wav') {

				} else if (file.type === 'text/csv') {

				} else if (file.type === 'application/zip') {

				} else {

				}

				// check for complete


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
					base.error.relfile = (base.error.relfile || relfileData === undefined);

					// 2. open and get list of filenames and their captions
					if (!base.error.any()) {
						var relfileContent = zip.file(relfileData.name).asText();
						var relfileCaptions = {};
						relfileContent.split('\n').forEach(function (line) {
							let [filename, caption] = line.split(',');
							filename = Util.basename(filename);
							if (filename.contains('.wav')) {
								if (filename in relfileCaptions) {
									if (!base.error.relfile_duplicates) {
										base.error.relfile_duplicates = true;
									}
									relfileCaptions[filename].isDuplicate = true;
								} else {
									relfileCaptions[filename] = {caption: caption};
								}
							}
						});
					}

					// 3. place files to be uploaded in Context under contract_client > new_uploads
					if (!base.error.any()) {
						var audioFiles = Object.keys(zip.files).filter(function (key) {
							return key.contains('.wav');
						}).map(function (key) {
							return zip.file(key);
						});

						var audioDataInstances = {};
						audioFiles.forEach(function (audioFile) {
							let filename = Util.basename(audioFile.name);
							if (filename in relfileCaptions) {
								audioFile.caption = relfileCaptions[filename].caption;
							} else {
								audioFile.caption = '';
								audioFile.noCaption = true;
								base.error.no_caption = true;
							}
							audioDataInstances[filename] = audioFile;
						});
					}

					// get relevant data
					return Promise.all([
						Active.get('client'),
						Active.get('contract_client'),
					]).then(function (results) {
						if (!base.error.any()) {
							var [client_id, contract_client] = results;
							return Context.set('clients.{client_id}.contract_clients.{contract_client_id}.projects.{project_id}.uploads.{upload_id}'.format({
								client_id: client_id,
								contract_client_id: contract_client.id,
								project_id: contract_client.project,
								upload_id: id,
							}), {audioData: audioDataInstances});
						}
					}).then(function () {
						// 4. trigger state to prompt display lists to draw from Context
						return base.triggerState();
					});
				}
				zipReader.readAsBinaryString(file);
			},
			preUpload: function () {
				// send list of files and hash
			},
			start: function () {

			},
		}

		return Promise.all([

		]).then(function () {
			return base;
		});
	});
}
