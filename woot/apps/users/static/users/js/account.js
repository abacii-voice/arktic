// 0. Open websocket connection
// really use only for transcription / moderation / settings change, but not file upload.
// don't have to use for loading context either. Ajax is fine for that.

// 1. Load Context
Context.setFn(ajax('user_context', {}, function (data) {
	Context.store = data;

	if (Context.get('one_client')) {
		if (Context.get('one_role')) {
			UI.changeState('control-state');
		} else {
			UI.changeState('role-state');
		}
	}
}));

Context.update(); // load data

// 2. Define global states
UI.createGlobalStates('client-state', [
	'role-state',

	// control panel
	'control-state',

	// work interface states
	'interface-state',
	'upload-state',
	'upload-state-audio',
	'upload-date-state',
	'upload-relfile-drop-state',
	'upload-audio-drop-state',

	// interfaces
	'message-state',
	'billing-state',
	'stats-state',
	'rules-state',
	'user-stats-state',
	'search-state',
	'user-management-state',
	'project-state',
]);

// 3. Define component tree
// (id, { // <- args variable
// 	root: '',
// 	template: UI.templates.*,
// 	appearance: {
// 		html: '',
// 		classes: [],
// 		style: {},
// 	},
// 	state: {
// 		states: [],
// 		svtiches: [],
// 		stateMap: {},
// 	},
// 	registry: {
// 		path: [],
// 		fn: function () {},
// 	},
// 	properties: {},
// 	bindings: [
// 		{
// 			name: 'click',
// 			fn: function () {},
// 		}
// 	],
// 	children: [],
// })

UI.createApp('hook', [
	// breadcrumbs
	UI.createComponent('breadcrumbs', {
		template: UI.templates.div,
		appearance: {
			style: {
				'position': 'absolute',
				'top': '40px',
				'left': '16px',
			},
		},
		state: {
			states: [
				{name: 'client-state', args: {
					fn: function (_this) {
						// 1. remove current children
						_this.children.map(function (child) {
							UI.removeComponent(child.id);
						});

						_this.children = [];
					}
				}},
				{name: 'role-state', args: {
					fn: function (_this) {
						// 1. remove current children
						_this.children.map(function (child) {
							UI.removeComponent(child.id);
						});

						_this.children = [];

						// 2. Add client name child
						var clientNameBreadcrumb = UI.createComponent('bc-client', {
							root: _this.id,
							template: UI.templates.a,
							appearance: {
								html: Context.get('current_client'),
							},
							state: {
								stateMap: 'role-state',
							},
							bindings: [
								{name: 'click', fn: function (_this) {
									_this.triggerState();
								}},
							],
						});

						_this.children.push(clientNameBreadcrumb);
						clientNameBreadcrumb.render();
					}
				}},
				{name: 'control-state', args: {
					fn: function (_this) {
						// 1. remove current children
						_this.children.map(function (child) {
							UI.removeComponent(child.id);
						});

						_this.children = [];

						// 2. Add client name child
						var clientNameBreadcrumb = UI.createComponent('bc-client', {
							root: _this.id,
							template: UI.templates.a,
							appearance: {
								html: Context.get('current_client'),
							},
							state: {
								stateMap: 'role-state',
							},
							bindings: [
								{name: 'click', fn: function (_this) {
									_this.triggerState();
								}},
							],
						});

						_this.children.push(clientNameBreadcrumb);
						clientNameBreadcrumb.render();

						// 3. add carrot
						var carrot = UI.createComponent('bc-carrot', {
							root: _this.id,
							template: UI.templates.span,
							appearance: {
								html: ' > '
							},
						});

						_this.children.push(carrot);
						carrot.render();

						// 4. add role name child
						var roleNameBreadcrumb = UI.createComponent('bc-role', {
							root: _this.id,
							template: UI.templates.a,
							appearance: {
								html: Context.get('role_display', Context.get('current_role')),
							},
							state: {
								stateMap: 'control-state',
							},
							bindings: [
								{name: 'click', fn: function (_this) {
									_this.triggerState();
								}},
							],
						});

						_this.children.push(roleNameBreadcrumb);
						roleNameBreadcrumb.render();
					}
				}},
			],
		},
	}),

	// interfaces
	UI.createComponent('upload-panel', {
		template: UI.templates.contentPanel,
		appearance: {
			classes: ['panel-large'],
		},
		state: {
			defaultState: {
				style: {
					'opacity': '0.0',
				},
				fn: function (_this) {
					_this.model().css({'display': 'none'});
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'interface-state', args: 'default'},
				{name: 'upload-state', args: {
					preFn: function (_this) {
						_this.model().css({'display': 'block'});
					},
					style: {
						'opacity': '1.0',
					},
				}},
				{name: 'message-state', args: 'default'},
				{name: 'billing-state', args: 'default'},
				{name: 'stats-state', args: 'default'},
				{name: 'rules-state', args: 'default'},
				{name: 'user-stats-state', args: 'default'},
				{name: 'search-state', args: 'default'},
				{name: 'project-state', args: 'default'},
				{name: 'user-management-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('upload-title', {
				template: `<h2 style='{style}'>New Project</h2>`,
				appearance: {
					style: {
						'position': 'absolute',
						'top': '-24px',
						'color': '#ccc',
						'font-size': '20px',
					},
				},
			}),
			UI.createComponent('project-creation-dialog', {
				children: [
					UI.createComponent('pcd-project-name', {
						template: `
							<input type='text' class='{classes}' style='{style}' placeholder='Project name'>
						`,
						appearance: {
							classes: ['custom-input'],
							style: {
								'top': '27px',
							},
						},
					}),
					UI.createComponent('pcd-deadline', {

					}),
					UI.createComponent('pcd-description', {
						template: `
							<textarea class='{classes}' placeholder='Project description' rows='5' style='{style}' />
						`,
						appearance: {
							classes: ['custom-text-area'],
							style: {
								'top': '78px',
							},
						}
					}),
				],
			}),
			UI.createComponent('rel-file-panel', {
				children: [
					UI.createComponent('rel-file-title', {
						template: `<h2 class='{classes}' style='{style}'>Project RelFile</h2>`,
						appearance: {
							style: {
								'position': 'absolute',
								'top': '185px',
								'color': '#ccc',
								'font-size': '20px',
							},
						},
					}),
					UI.createComponent('rel-file-dropzone', {
						template: `<div class='dz-wrapper' id='{id}'>{html}</div>`,
						appearance: {
							html: `
								<p style='top: 40px;' class='dropzone-demo-title'>Drag and drop or click to upload</p>
								<p style='top: 58px;' class='dropzone-demo-title'>.csv file of the form:</p>
								<table class='dropzone-demo-table'>
									<tr>
										<th>filename</th>
										<th>utterance</th>
									</tr>
									<tr>
										<td>demo-file_1.wav</td>
										<td>i'd like to speak...</td>
									</tr>
									<tr>
										<td>demo-file_2.wav</td>
										<td>advisor</td>
									</tr>
								</table>
							`,
						},
						state: {
							states: [
								{name: 'upload-state', args: {
									preFn: function (_this) {
										// make visible
										_this.model().css({'display': 'block'});

										// create dropzone
										_this.model().dropzone({
											url: '/upload-relfile',
											maxFiles: 1,
											acceptedFiles: '.csv',
											paramName: 'relfile-input',
											createImageThumbnails: false,
											accept: function (file, done) {
												// try reading file
												var reader = new FileReader();
												reader.onload = function(e) {
													var contents = e.target.result;
													// contents is a string. I can do what I want.
													// 1. trigger rel-file-drop-state
													_this.triggerState();

													// 2. parse contents of file and display in rel-file-filelist
													var lines = contents.split('\n');
													var headerLine = lines.shift();

													// add lines to Context
													var relfileLineObjects = lines.map(function (line) {
														var keys = line.split(',');
														return {filename: basename(keys[0]), utterance: keys[1]}
													});
													Context.set('current_relfile_lines', relfileLineObjects.filter(function (relfileLineObject) {
														return relfileLineObject.filename !== '';
													}));

													// truncate lines
													var trunc = 6;
													var numberOfLines = lines.length - trunc;
													lines = lines.slice(0, trunc);

													// get filelist object
													var filelist = UI.getComponent('rel-file-filelist');

													// header
													var headerKeys = headerLine.split(',');
													var headerRow = UI.createComponent('relfile-header-row', {
														root: filelist.id,
														template: `<tr style='{style}' class='{classes}'>{html}</tr>`,
														appearance: {
															style: {

															},
															html: headerKeys.map(function (key) {
																return '<th>{key}</th>'.format({key: key});
															}).join(''),
														},
													});
													filelist.children.push(headerRow);
													headerRow.render();

													// rest of lines
													lines.map(function (line, index) { // map to table rows
														if (line !== '') {
															var values = line.split(',');
															var row = UI.createComponent('relfile-header-row-{index}'.format({index: index}), {
																root: filelist.id,
																template: `<tr style='{style}' class='{classes}'>{html}</tr>`,
																appearance: {
																	html: values.map(function (value) {
																		return `<td title='{title}'>{value}</td>`.format({value: basename(value).trunc(20), title: value});
																	}).join(''),
																},
															});
															filelist.children.push(row);
															row.render();
														}
													});

													// footer
													var footer = UI.createComponent('relfile-footer-row', {
														root: filelist.id,
														template: `<tr style='{style}' class='{classes}'>{html}</tr>`,
														appearance: {
															html: '<td>{total} total, {number} more files...</td><td></td>'.format({number: numberOfLines - 1, total: numberOfLines + trunc - 1}),
														}
													});
													filelist.children.push(footer);
													footer.render();

												};
 												reader.readAsText(file);
											},
										});
									},
									style: {
										'opacity': '1.0',
									},
								}},
								{name: 'upload-relfile-drop-state', args: {
									style: {
										'opacity': '0.0',
									},
									fn: function (_this) {
										_this.model().css({'display': 'block'});
									}
								}},
							],
							stateMap: 'upload-relfile-drop-state',
						},
					}),
					UI.createComponent('rel-file-filelist', {
						template: `<table id='{id}' style='{style}' class='{classes}'></table>`,
						state: {
							states: [
								{name: 'upload-state', args: {
									style: {
										'opacity': '0.0',
									},
									fn: function (_this) {
										_this.model().css({'display': 'none'});
									},
								}},
								{name: 'upload-relfile-drop-state', args: {
									preFn: function (_this) {
										_this.model().css({'display': 'block'});
									},
									style: {
										'opacity': '1.0',
									},
								}},
							],
						}
					}),
				],
			}),
			UI.createComponent('audio-file-panel', {
				children: [
					UI.createComponent('audio-file-title', {
						template: `<h2 style='{style}'>Project Audio Archive</h2>`,
						appearance: {
							style: {
								'position': 'absolute',
								'top': '-24px',
								'left': '410px',
								'color': '#ccc',
								'font-size': '20px',
							},
						},
					}),
					UI.createComponent('audio-file-dropzone', {
						template: `<div class='dz-wrapper' style='{style}' id='{id}'>{html}</div>`,
						appearance: {
							html: `
								<p style='top: 40px;' class='dropzone-demo-title'>Drag and drop or click to upload</p>
								<p style='top: 58px;' class='dropzone-demo-title'>.zip file of the form:</p>
								<img style='width: 120px; height: 160px; position:absolute; top: 100px; left: 20%; pointer-events: none;' src='/static/img/folder-icon-comp.png' %} />
								<p style='color: #ccc; position: absolute; top: 160px; left: 140px; pointer-events: none;'>demo-file_1.wav</p>
								<p style='color: #ccc; position: absolute; top: 192px; left: 140px; pointer-events: none;'>demo-file_2.wav</p>
							`,
							style: {
								'top': '28px',
								'left': '410px',
								'height': '507px',
							},
						},
						state: {
							states: [
								{name: 'upload-state', args: {
									preFn: function (_this) {
										// make visible
										_this.model().css({'display': 'block'});

										// create dropzone
										_this.model().dropzone({
											url: '/upload-audio',
											maxFiles: 1,
											acceptedFiles: '.zip',
											paramName: 'audio-input',
											createImageThumbnails: false,
											accept: function (file, done) {
												// try reading file
												var reader = new FileReader();
												var zip = new JSZip();
												reader.onload = function(e) {
													var contents = e.target.result;
													zip.load(contents);

													// extract list of files and cut off directory name
													var filenames = [];
													Object.keys(zip.files).map(function (key) {
														if (!zip.files[key].dir) {
															filenames.push(basename(key));
														}
													});

													// check list of filenames against relfile in storage
													var filenamesMatch = true;
													Context.get('current_relfile_lines').map(function (relfilePrototypeLine) {
														filenamesMatch = filenamesMatch & filenames.indexOf(relfilePrototypeLine.filename)!=-1;
													});

													if (filenamesMatch) {
														// ready to upload
														Context.set('current_zip_file', file);
														_this.triggerState();
													}

												}

												reader.readAsBinaryString(file);
											},
										});
									},
									style: {
										'opacity': '1.0',
									},
								}},
								{name: 'upload-audio-drop-state', args: {
									style: {
										'opacity': '0.0',
									},
									fn: function (_this) {
										_this.model().css({'display': 'none'});
									}
								}},
							],
							stateMap: 'upload-audio-drop-state',
						},
					}),
					UI.createComponent('audio-file-confirm-panel', {
						template: UI.templates.div,
						appearance: {
							html: ``,
						},
						state: {
							states: [
								{name: 'upload-state', args: {
									style: {
										'opacity': '0.0',
									},
									fn: function (_this) {
										_this.model().css({'display': 'none'});
									}
								}},
								{name: 'upload-audio-drop-state', args: {
									preFn: function (_this) {
										_this.model().css('display', 'block');
									},
									style: {
										'opacity': '1.0',
									},
								}},
							],
						},
					}),
					UI.createComponent('audio-file-confirm-button', {
						template: UI.templates.button,
						appearance: {
							html: `Confirm and upload`,
						},
						state: {
							states: [
								{name: 'upload-state', args: {
									style: {
										'opacity': '0.0',
									},
									fn: function (_this) {
										_this.model().css({'display': 'none'});
									}
								}},
								{name: 'upload-audio-drop-state', args: {
									preFn: function (_this) {
										_this.model().css('display', 'block');
									},
									style: {
										'opacity': '1.0',
									},
								}},
							],
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								// upload audio zip file along with metadata
								var data = new FormData();

								// 1. get project name and description metadata
								var projectName = UI.getComponent('pcd-project-name').model().val();
								var projectDescription = UI.getComponent('pcd-project-description').model().val();
								data.append('project_name', projectName);
								data.append('project_description', projectDescription);

								// 2. get relfile
								var relfile = Context.get('current_relfile_lines');
								data.append('relfile', relfile);

								// 3. get audio archive
								var archive = Context.get('current_zip_file');
								data.append('archive', archive);

								$.ajax({
									url: '/commands/audio_upload/',
									type: 'post',
									data: data,
									dataType: 'json',
									processData: false,
									success: function (data, textStatus, jqXHR) {
										console.log(data);
									}
								});
							}}
						],
					}),
				],
			}),
		],
	}),
	UI.createComponent('interface-panel', {
		template: UI.templates.contentPanel,
		appearance: {
			classes: ['panel-large'],
		},
		state: {
			defaultState: {
				style: {
					'opacity': '0.0',
				},
				fn: function (_this) {
					_this.model().css({'display': 'none'});
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'interface-state', args: {
					preFn: function (_this) {
						_this.model().css({'display': 'block'});
					},
					style: {
						'opacity': '1.0',
					},
				}},
				{name: 'upload-state', args: 'default'},
				{name: 'message-state', args: 'default'},
				{name: 'billing-state', args: 'default'},
				{name: 'stats-state', args: 'default'},
				{name: 'rules-state', args: 'default'},
				{name: 'user-stats-state', args: 'default'},
				{name: 'search-state', args: 'default'},
				{name: 'project-state', args: 'default'},
				{name: 'user-management-state', args: 'default'},
			],
		}
	}),

	// panels
	UI.createComponent('message-panel', {
		template: UI.templates.contentPanel,
		state: {
			defaultState: {
				style: {
					'opacity': '0.0',
				},
				fn: function (_this) {
					_this.model().css({'display': 'none'});
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'interface-state', args: 'default'},
				{name: 'upload-state', args: 'default'},
				{name: 'message-state', args: {
					preFn: function (_this) {
						_this.model().css({'display': 'block'});
					},
					style: {
						'opacity': '1.0',
					},
				}},
				{name: 'billing-state', args: 'default'},
				{name: 'stats-state', args: 'default'},
				{name: 'rules-state', args: 'default'},
				{name: 'user-stats-state', args: 'default'},
				{name: 'search-state', args: 'default'},
				{name: 'project-state', args: 'default'},
				{name: 'user-management-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('mp-title', {
				template: UI.templates.div,
				appearance: {
					classes: ['panel-title'],
					html: 'Messages',
				}
			}),
		],
	}),
	UI.createComponent('billing-panel', {
		template: UI.templates.contentPanel,
		state: {
			defaultState: {
				style: {
					'left': '220px',
					'opacity': '0.0',
				},
				fn: function (_this) {
					_this.model().css({'display': 'none'});
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'interface-state', args: 'default'},
				{name: 'upload-state', args: 'default'},
				{name: 'message-state', args: 'default'},
				{name: 'billing-state', args: {
					preFn: function (_this) {
						_this.model().css({'display': 'block'});
					},
					style: {
						'opacity': '1.0',
					},
				}},
				{name: 'stats-state', args: 'default'},
				{name: 'rules-state', args: 'default'},
				{name: 'user-stats-state', args: 'default'},
				{name: 'search-state', args: 'default'},
				{name: 'project-state', args: 'default'},
				{name: 'user-management-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('bp-title', {
				template: UI.templates.div,
				appearance: {
					classes: ['panel-title'],
					html: 'Billing',
				}
			}),
		],
	}),
	UI.createComponent('stats-panel', {
		template: UI.templates.contentPanel,
		state: {
			defaultState: {
				style: {
					'opacity': '0.0',
				},
				fn: function (_this) {
					_this.model().css({'display': 'none'});
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'interface-state', args: 'default'},
				{name: 'upload-state', args: 'default'},
				{name: 'message-state', args: 'default'},
				{name: 'billing-state', args: 'default'},
				{name: 'stats-state', args: {
					preFn: function (_this) {
						_this.model().css({'display': 'block'});
					},
					style: {
						'opacity': '1.0',
					},
				}},
				{name: 'rules-state', args: 'default'},
				{name: 'user-stats-state', args: 'default'},
				{name: 'search-state', args: 'default'},
				{name: 'project-state', args: 'default'},
				{name: 'user-management-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('sp-title', {
				template: UI.templates.div,
				appearance: {
					classes: ['panel-title'],
					html: 'Stats',
				}
			}),
		],
	}),
	UI.createComponent('user-stats-panel', {
		template: UI.templates.contentPanel,
		state: {
			defaultState: {
				style: {
					'opacity': '0.0',
				},
				fn: function (_this) {
					_this.model().css({'display': 'none'});
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'interface-state', args: 'default'},
				{name: 'upload-state', args: 'default'},
				{name: 'message-state', args: 'default'},
				{name: 'billing-state', args: 'default'},
				{name: 'stats-state', args: 'default'},
				{name: 'rules-state', args: 'default'},
				{name: 'user-stats-state', args: {
					preFn: function (_this) {
						_this.model().css({'display': 'block'});
					},
					style: {
						'opacity': '1.0',
					},
				}},
				{name: 'search-state', args: 'default'},
				{name: 'project-state', args: 'default'},
				{name: 'user-management-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('usp-title', {
				template: UI.templates.div,
				appearance: {
					classes: ['panel-title'],
					html: 'User stats',
				}
			}),
		],
	}),
	UI.createComponent('user-management-panel', {
		template: UI.templates.contentPanel,
		state: {
			defaultState: {
				style: {
					'opacity': '0.0',
				},
				fn: function (_this) {
					_this.model().css({'display': 'none'});
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'interface-state', args: 'default'},
				{name: 'upload-state', args: 'default'},
				{name: 'message-state', args: 'default'},
				{name: 'billing-state', args: 'default'},
				{name: 'stats-state', args: 'default'},
				{name: 'rules-state', args: 'default'},
				{name: 'user-stats-state', args: 'default'},
				{name: 'search-state', args: 'default'},
				{name: 'project-state', args: 'default'},
				{name: 'user-management-state', args: {
					preFn: function (_this) {
						_this.model().css({'display': 'block'});
					},
					style: {
						'opacity': '1.0',
					},
				}},
			],
		},
		children: [
			UI.createComponent('ump-title', {
				template: UI.templates.div,
				appearance: {
					classes: ['panel-title'],
					html: 'User management',
				}
			}),
		],
	}),
	UI.createComponent('project-panel', {
		template: UI.templates.contentPanel,
		state: {
			defaultState: {
				style: {
					'opacity': '0.0',
				},
				fn: function (_this) {
					_this.model().css({'display': 'none'});
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'interface-state', args: 'default'},
				{name: 'upload-state', args: 'default'},
				{name: 'message-state', args: 'default'},
				{name: 'billing-state', args: 'default'},
				{name: 'stats-state', args: 'default'},
				{name: 'rules-state', args: 'default'},
				{name: 'user-stats-state', args: 'default'},
				{name: 'search-state', args: 'default'},
				{name: 'project-state', args: {
					preFn: function (_this) {
						_this.model().css({'display': 'block'});
					},
					style: {
						'opacity': '1.0',
					},
				}},
				{name: 'user-management-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('pp-title', {
				template: UI.templates.div,
				appearance: {
					classes: ['panel-title'],
					html: 'Projects',
				}
			}),
		],
	}),
	UI.createComponent('rules-panel', {
		template: UI.templates.contentPanel,
		state: {
			defaultState: {
				style: {
					'opacity': '0.0',
				},
				fn: function (_this) {
					_this.model().css({'display': 'none'});
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'interface-state', args: 'default'},
				{name: 'upload-state', args: 'default'},
				{name: 'message-state', args: 'default'},
				{name: 'billing-state', args: 'default'},
				{name: 'stats-state', args: 'default'},
				{name: 'rules-state', args: {
					preFn: function (_this) {
						_this.model().css({'display': 'block'});
					},
					style: {
						'opacity': '1.0',
					},
				}},
				{name: 'user-stats-state', args: 'default'},
				{name: 'search-state', args: 'default'},
				{name: 'project-state', args: 'default'},
				{name: 'user-management-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('rp-title', {
				template: UI.templates.div,
				appearance: {
					classes: ['panel-title'],
					html: 'Rules',
				}
			}),
		],
	}),
	UI.createComponent('search-panel', {
		template: UI.templates.contentPanel,
		state: {
			defaultState: {
				style: {
					'opacity': '0.0',
				},
				fn: function (_this) {
					_this.model().css({'display': 'none'});
				},
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: 'default'},
				{name: 'interface-state', args: 'default'},
				{name: 'upload-state', args: 'default'},
				{name: 'message-state', args: 'default'},
				{name: 'billing-state', args: 'default'},
				{name: 'stats-state', args: 'default'},
				{name: 'rules-state', args: 'default'},
				{name: 'user-stats-state', args: 'default'},
				{name: 'search-state', args: {
					preFn: function (_this) {
						_this.model().css({'display': 'block'});
					},
					style: {
						'opacity': '1.0',
					},
				}},
				{name: 'project-state', args: 'default'},
				{name: 'user-management-state', args: 'default'},
			],
		},
		children: [
			UI.createComponent('sep-title', {
				template: UI.templates.div,
				appearance: {
					classes: ['panel-title'],
					html: 'Search',
				}
			}),
		],
	}),

	// sidebars
	UI.createComponent('control-sidebar', {
		template: UI.templates.sidebar,
		appearance: {
			style: {
				'width': '160px',
				'border-right': '0px solid #fff',
			},
		},
		state: {
			defaultState: {
				style: {
					'left': '60px',
					'opacity': '0.0',
				}
			},
			states: [
				{name: 'client-state', args: 'default'},
				{name: 'role-state', args: 'default'},
				{name: 'control-state', args: {
					preFn: function (_this) {
						_this.model().css({'display': 'block'});
					},
					style: {
						'left': '50px',
						'opacity': '1.0',
					},
				}},
				{name: 'interface-state', args: {
					style: {
						'left': '50px',
						'opacity': '0.0',
					},
					fn: function (_this) {
						_this.model().css({'display': 'none'});
					},
				}},
				{name: 'upload-state', args: {
					style: {
						'left': '50px',
						'opacity': '0.0',
					},
					fn: function (_this) {
						_this.model().css({'display': 'none'});
					},
				}},
			],
		},
		children: [
			UI.createComponent('cns-start-button', {
				template: UI.templates.button,
				appearance: {
					html: 'Start',
					classes: ['menu-button', 'start-button'],
				},
				state: {
					states: [
						{name: 'control-state', args: {
							fn: function (_this) {
								var role = Context.get('current_role');
								if (role === 'worker' || role === 'moderator') {
									_this.model().css('display', 'block');
								} else {
									_this.model().css('display', 'none');
								}
							},
						}},
					],
					stateMap: 'interface-state',
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}},
				],
			}),
			UI.createComponent('cns-upload-button', {
				template: UI.templates.button,
				appearance: {
					html: 'Upload',
					classes: ['menu-button', 'start-button'],
				},
				state: {
					states: [
						{name: 'control-state', args: {
							fn: function (_this) {
								var role = Context.get('current_role');
								if (role === 'contractadmin') {
									_this.model().css('display', 'block');
								} else {
									_this.model().css('display', 'none');
								}
							},
						}},
					],
					stateMap: 'upload-state',
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}},
				],
			}),
			UI.createComponent('cns-messages-button', {
				template: UI.templates.button,
				appearance: {
					html: 'Messages',
					classes: ['menu-button'],
					style: {
						'display': 'block',
					}
				},
				state: {
					stateMap: 'message-state',
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}},
				],
			}),
			UI.createComponent('cns-stats-button', {
				template: UI.templates.button,
				appearance: {
					html: 'Personal stats',
					classes: ['menu-button'],
				},
				state: {
					states: [
						{name: 'control-state', args: {
							fn: function (_this) {
								var role = Context.get('current_role');
								if (role === 'worker' || role === 'moderator') {
									_this.model().css('display', 'block');
								} else {
									_this.model().css('display', 'none');
								}
							},
						}},
					],
					stateMap: 'stats-state',
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}},
				],
			}),
			UI.createComponent('cns-project-button', {
				template: UI.templates.button,
				appearance: {
					html: 'Projects',
					classes: ['menu-button'],
				},
				state: {
					states: [
						{name: 'control-state', args: {
							fn: function (_this) {
								var role = Context.get('current_role');
								if (role === 'contractadmin' || role === 'productionadmin') {
									_this.model().css('display', 'block');
								} else {
									_this.model().css('display', 'none');
								}
							},
						}},
					],
					stateMap: 'project-state',
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}},
				],
			}),
			UI.createComponent('cns-user-stats-button', {
				template: UI.templates.button,
				appearance: {
					html: 'User stats',
					classes: ['menu-button'],
				},
				state: {
					states: [
						{name: 'control-state', args: {
							fn: function (_this) {
								var role = Context.get('current_role');
								if (role === 'moderator' || role === 'productionadmin' || role === 'contractadmin') {
									_this.model().css('display', 'block');
								} else {
									_this.model().css('display', 'none');
								}
							},
						}},
					],
					stateMap: 'user-stats-state',
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}},
				],
			}),
			UI.createComponent('cns-user-management-button', {
				template: UI.templates.button,
				appearance: {
					html: 'User management',
					classes: ['menu-button'],
				},
				state: {
					states: [
						{name: 'control-state', args: {
							fn: function (_this) {
								var role = Context.get('current_role');
								if (role === 'productionadmin') {
									_this.model().css('display', 'block');
								} else {
									_this.model().css('display', 'none');
								}
							},
						}},
					],
					stateMap: 'user-management-state',
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}},
				],
			}),
			UI.createComponent('cns-rules-button', {
				template: UI.templates.button,
				appearance: {
					html: 'Rules',
					classes: ['menu-button'],
				},
				state: {
					states: [
						{name: 'control-state', args: {
							fn: function (_this) {
								var role = Context.get('current_role');
								if (role === 'worker' || role === 'moderator' || role === 'productionadmin') {
									_this.model().css('display', 'block');
								}
							},
						}},
					],
					stateMap: 'rules-state',
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}},
				],
			}),
			UI.createComponent('cns-billing-button', {
				template: UI.templates.button,
				appearance: {
					html: 'Billing',
					classes: ['menu-button'],
					style: {
						'display': 'block',
					}
				},
				state: {
					stateMap: 'billing-state',
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}},
				],
			}),
			UI.createComponent('cns-search-button', {
				template: UI.templates.button,
				appearance: {
					html: `<span class='glyphicon glyphicon-search'></span> Search`,
					classes: ['menu-button'],
					style: {
						'display': 'block',
					},
				},
				state: {
					stateMap: 'search-state',
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}},
				],
			}),
		],
	}),
	UI.createComponent('client-sidebar', {
		template: UI.templates.sidebar,
		state: {
			states: [
				{name: 'client-state', args: {
					style: {
						'left': '0px',
					},
				}},
				{name: 'role-state', args: {
					style: {
						'left': '-300px',
					}
				}},
				{name: 'control-state', args: {
					style: {
						'left': '-300px',
					},
				}},
			],
		},
		registry: {
			path: function () {
				return ['clients']
			},
			fn: function (_this, data) {
				// create buttons from Context and remove loading icon
				// 'data' is a list of client names

				// remove loading button
				var loadingIcon = UI.getComponent('cs-loading-icon');
				loadingIcon.model().fadeOut();

				// map data to new buttons
				data.map(function (clientName) {
					var child = UI.createComponent('cs-{name}-button'.format({name: clientName}), {
						root: _this.id,
						template: UI.templates.button,
						appearance: {
							style: {
								'opacity': '0.0',
							},
							html: '{name}'.format({name: clientName}),
						},
						state: {
							svitches: [
								{stateName: 'role-state', fn: function (_this) {
									Context.store['current_client'] = clientName;
								}},
							],
							stateMap: {
								'client-state': 'role-state',
							},
						},
						bindings: [
							{name: 'click', fn: function (_this) {
								_this.triggerState();
							}}
						],
					});

					_this.children.push(child);
					child.render();

					// make buttons visible
					child.model().animate({'opacity': '1.0'});
				});
			}
		},
		children: [
			UI.createComponent('cs-loading-icon', {
				template: UI.templates.loadingIcon,
			}),
		],
	}),
	UI.createComponent('role-sidebar', {
		template: UI.templates.sidebar,
		state: {
			states: [
				{name: 'client-state', args: {
					style: {
						'left': '-300px',
					},
				}},
				{name: 'role-state', args: {
					preFn: function (_this) {
						// 1. remove current children
						_this.children.map(function (child) {
							UI.removeComponent(child.id);
						});

						_this.children = [];

						// 2. map data from context to new children and render
						var data = Context.get('roles', 'clients', Context.get('current_client'), 'roles');
						data.map(function (roleName) {
							var child = UI.createComponent('rs-{name}-button'.format({name: roleName}), {
								root: _this.id,
								template: UI.templates.button,
								appearance: {
									style: {
										'opacity': '0.0',
									},
									html: Context.get('role_display', roleName),
								},
								state: {
									svitches: [
										{stateName: 'control-state', fn: function (_this) {
											Context.set('current_role', roleName);
										}}
									],
									stateMap: {
										'role-state': 'control-state'.format({role: roleName}),
									}
								},
								bindings: [
									{name: 'click', fn: function (_this) {
										_this.triggerState();
									}}
								],
							});

							_this.children.push(child);
							child.render();

							// make buttons visible
							child.model().css({'opacity': '1.0'});
						});
					},
					style: {
						'left': '50px',
					},
				}},
				{name: 'control-state', args: {
					style: {
						'left': '-300px',
					},
				}},
			],
		},
	}),
	UI.createComponent('back-sidebar', {
		template: UI.templates.sidebar,
		appearance: {
			classes: ['mini'],
		},
		state: {
			states: [
				{name: 'client-state', args: {
					style: {
						'left': '-50px',
					},
				}},
				{name: 'role-state', args: {
					style: {
						'left': '0px',
					},
					fn: function (_this) {
						// _this.model().animate({'left': '0px'}, 200);
					}
				}},
				{name: 'control-state', args: {
					style: {
						'left': '-0px',
					},
					fn: function (_this) {
						// _this.model().animate({'left': '0px'}, 200);
					},
				}},
			],
		},
		children: [
			UI.createComponent('bs-back-button', {
				template: UI.templates.button,
				appearance: {
					html: `<span class='glyphicon glyphicon-chevron-left'></span>`
				},
				state: {
					stateMap: {
						'role-state': 'client-state',
						'control-state': 'role-state',
						'interface-state': 'control-state',
						'upload-state': 'control-state',
						'message-state': 'role-state',
						'billing-state': 'role-state',
						'stats-state': 'role-state',
						'rules-state': 'role-state',
						'project-state': 'role-state',
						'user-stats-state': 'role-state',
						'search-state': 'role-state',
						'user-management-state': 'role-state',
					}
				},
				bindings: [
					{name: 'click', fn: function (_this) {
						_this.triggerState();
					}},
				],
			}),
		],
	}),
]);

// 4. Render app
UI.renderApp();
