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
				noZipOrFolder: false,
				noRelfile: false,
				relfileDuplicates: false,
				noCaption: false,
				serverDuplicatesWithinBatch: false,
			},
			buffer: {
				id: undefined,
				audio: {},
				relfile: {
					entries: {},
				},
				addAudio: function (audioFile) {
					let filename = Util.basename(audioFile.name);
					if (filename in base.upload.buffer.relfile.entries) {
						audioFile.caption = base.upload.buffer.relfile.entries[filename].caption;
					}
					base.upload.buffer.audio[filename] = audioFile;
					base.upload.buffer.check();
				},
				addRelfile: function (relfileContent) {
					relfileContent.split('\n').forEach(function (line) {
						let [filename, caption] = line.split(',');
						filename = Util.basename(filename);
						if (filename.contains('.wav')) {
							if (filename in base.upload.buffer.relfile.entries) {
								base.upload.buffer.relfile.entries[filename].isDuplicate = true;
							} else {
								base.upload.buffer.relfile.entries[filename] = {caption: caption};
							}
						}
					});
					base.upload.buffer.check();
				},
				check: function () {
					// check for errors and accept or reject, then push
				},
				push: function () {
					// reset buffer
					// reset id
					// reset errors
				},
			},
			unpack: function (file) {
				// sort by file type
				if (file.type === 'audio/wav') {
					// 1. add to buffer.audio
					base.upload.buffer.addAudio(file);
				} else if (file.type === 'text/csv' || file.name.contains('.csv')) {
					// 2. add to buffer.relfile
					var reader = new FileReader();
					reader.onload = function(e) {
						base.upload.buffer.addRelfile(e.target.result);
					}
					reader.readAsBinaryString(file);

				} else if (file.type === 'application/zip') {
					// 3. create zip object and unzip
					var zipReader = new FileReader();
					var zip = new JSZip();
					zipReader.onload = function (e) {
						// load zip
						zip.load(e.target.result);

						// 1. extract relfile
						var relfileData = Object.keys(zip.files).filter(function (key) {
							return key.contains('.csv');
						}).map(function (key) {
							return zip.file(key);
						})[0];
						if (relfileData) {
							base.upload.buffer.addRelfile(zip.file(relfileData.name).asText());
						}

						// 2. extract audio files
						Object.keys(zip.files).filter(function (key) {
							return key.contains('.wav');
						}).forEach(function (key) {
							base.upload.buffer.addAudio(zip.file(key));
						});

						console.log(Object.keys(base.upload.buffer.audio).length);
					}
				} else {
					console.log('no');
				}

				// check for complete


				// get relevant data
				// return Promise.all([
				// 	Active.get('client'),
				// 	Active.get('contract_client'),
				// ]).then(function (results) {
				// 	if (!base.error.any()) {
				// 		var [client_id, contract_client] = results;
				// 		return Context.set('clients.{client_id}.contract_clients.{contract_client_id}.projects.{project_id}.uploads.{upload_id}'.format({
				// 			client_id: client_id,
				// 			contract_client_id: contract_client.id,
				// 			project_id: contract_client.project,
				// 			upload_id: id,
				// 		}), {audioData: audioDataInstances});
				// 	}
				// }).then(function () {
				// 	// 4. trigger state to prompt display lists to draw from Context
				// 	return base.triggerState();
				// });
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
