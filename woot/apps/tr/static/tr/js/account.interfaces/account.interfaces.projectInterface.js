var AccountInterfaces = (AccountInterfaces || {});
AccountInterfaces.projectInterface = function () {
	var id = 'project-interface';
	return UI.createComponent(id, {
		name: 'projectInterface',
		template: UI.template('div', 'ie abstract hidden'),
		appearance: {
			style: {
				'height': '100%',
				'left': '0px',
				'top': '0px',
			},
		},
		children: [
			// 1. client sidebar
			Components.sidebar('{id}-client-sidebar'.format({id: id}), {
				name: 'clientSidebar',
				position: {
					main: {
						on: '50px',
						off: '40px',
					},
					back: {
						on: '-200px',
						off: '-200px',
					},
				},
				fade: true,
				state: {
					primary: ['project-state', '-project-state-project'],
					secondary: [],
					deactivate: ['-project-state-focus'],
				},
				children: [
					Components.searchableList('{id}-cs-client-list'.format({id: id}), {
						name: 'clientList',
						appearance: {
							style: {
								'top': '2px',
							},
						}
					}),

				],
			}),

			// 2. project sidebar
			Components.sidebar('{id}-project-sidebar'.format({id: id}), {
				name: 'projectSidebar',
				position: {
					main: {
						on: '260px',
						off: '250px',
					},
					back: {
						on: '0px',
						off: '-50px',
					},
				},
				fade: true,
				state: {
					primary: '-project-state-project',
					secondary: ['-project-state-focus'],
					deactivate: ['project-state', 'control-state'],
				},
				children: [
					Components.searchableList('{id}-ps-project-list'.format({id: id}), {
						name: 'projectList',
						appearance: {
							style: {
								'top': '2px',
							},
						}
					}),

				],
			}),

			// 3. focus sidebar: viewing a single project
			Components.sidebar('{id}-focus-sidebar'.format({id: id}), {
				name: 'focusSidebar',
				position: {
					main: {
						on: '50px',
						off: '-300px',
					},
					back: {
						on: '-200px',
						off: '-200px',
					},
				},
				fade: false,
				state: {
					primary: '-project-state-focus',
					secondary: [],
					deactivate: ['project-state', '-project-state-project'],
				},
				children: [
					UI.createComponent('{id}-fs-title'.format({id: id}), {
						name: 'title',
						template: UI.template('h4', 'ie'),
						appearance: {
							style: {
								'width': '100%',
								'height': '32px',
								'font-size': '18px',
								'padding-top': '12px',
								'padding-left': '0px',
							},
							html: '',
						},
					}),
					UI.createComponent('{id}-fs-subtitle'.format({id: id}), {
						name: 'subtitle',
						template: UI.template('h4', 'ie'),
						appearance: {
							style: {
								'height': '40px',
								'font-size': '14px',
								'padding-top': '5px',
								'padding-left': '0px',
								'float': 'left',
								'color': Color.grey.light,
							},
							html: '',
						},
					}),
					UI.createComponent('{id}-fs-status'.format({id: id}), {
						name: 'status',
						template: UI.template('h4', 'ie'),
						appearance: {
							style: {
								'height': '40px',
								'font-size': '14px',
								'padding-top': '5px',
								'padding-left': '8px',
								'float': 'left',
								'color': Color.red.normal,
							},
							html: 'incomplete',
						},
					}),
					UI.createComponent('{id}-fs-transcription-button'.format({id: id}), {
						name: 'transcriptionButton',
						template: UI.template('div', 'ie border border-radius menu-button'),
						appearance: {
							style: {
								'width': '100%',
								'height': '70px',
								'margin-bottom': '10px',
							},
						},
						children: [
							UI.createComponent('{id}-fs-tb-title'.format({id: id}), {
								name: 'title',
								template: UI.template('h1', 'ie'),
								appearance: {
									style: {
										'font-size': '15px',
										'padding-top': '10px',
										'padding-left': '12px',
										'float': 'left',
										'display': 'inline-block',
									},
									html: 'Transcription',
								},
							}),
							UI.createComponent('{id}-fs-tb-transcriber-number'.format({id: id}), {
								name: 'transcriberNumber',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'font-size': '15px',
										'padding-top': '10px',
										'padding-left': '12px',
										'float': 'left',
										'clear': 'left',
										'display': 'inline-block',
										'color': Color.grey.normal,
									},
									html: '4 Transcribers',
								},
							}),
							UI.createComponent('{id}-fs-tb-percentage-completion'.format({id: id}), {
								name: 'percentageCompletion',
								template: UI.template('span', 'ie abs'),
								appearance: {
									style: {
										'right': '0px',
										'font-size': '15px',
										'padding-top': '10px',
										'padding-right': '12px',
										'display': 'inline-block',
										'color': Color.green.normal,
									},
									html: '34%',
								},
							}),
							UI.createComponent('{id}-fs-tb-count-remaining'.format({id: id}), {
								name: 'countRemaining',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'font-size': '15px',
										'padding-top': '10px',
										'padding-right': '12px',
										'float': 'right',
										'clear': 'right',
										'display': 'inline-block',
										'color': Color.red.normal,
									},
									html: '6600',
								},
							}),
						],
					}),
					UI.createComponent('{id}-fs-export-button'.format({id: id}), {
						name: 'exportButton',
						template: UI.template('div', 'ie border border-radius menu-button'),
						appearance: {
							style: {
								'width': '100%',
								'height': '40px',
								'margin-bottom': '10px',
							},
						},
						children: [
							UI.createComponent('{id}-fs-eb-title'.format({id: id}), {
								name: 'title',
								template: UI.template('h1', 'ie'),
								appearance: {
									style: {
										'font-size': '15px',
										'padding-top': '10px',
										'padding-left': '12px',
										'float': 'left',
										'display': 'inline-block',
									},
									html: 'Export',
								},
							}),
							UI.createComponent('{id}-fs-eb-completed'.format({id: id}), {
								name: 'completed',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'font-size': '15px',
										'padding-top': '10px',
										'padding-right': '12px',
										'float': 'right',
										'display': 'inline-block',
										'color': Color.green.normal,
									},
									html: '3400',
								},
							}),
						],
					}),
					UI.createComponent('{id}-fs-upload-button'.format({id: id}), {
						name: 'uploadButton',
						template: UI.template('div', 'ie'),
						appearance: {
							style: {
								'width': '100%',
								'height': '200px',
							},
						},
						children: [
							Components.dropzone('{id}-fs-ub-dropzone'.format({id: id}), {name: 'dropzone'}),
						],
					}),
				],
			}),

			// 4. transcription panel
			UI.createComponent('{id}-transcription-panel'.format({id: id}), {
				name: 'transcriptionPanel',
				template: UI.template('div', 'ie abs centred-vertically border'),
				appearance: {
					style: {
						'height': '100%',
						'width': '714px',
						'left': '310px',
					},
				},
				children: [
					UI.createComponent('{id}-tp-title'.format({id: id}), {
						name: 'title',
					}),
					UI.createComponent('{id}-tp-statistics'.format({id: id}), {
						name: 'statistics',
					}),
					UI.createComponent('{id}-tp-progress'.format({id: id}), {
						name: 'progress',
					}),
					UI.createComponent('{id}-tp-user-lists'.format({id: id}), {
						name: 'userLists',
						children: [
							UI.createComponent('{id}-tp-ul-title'.format({id: id}), {
								name: 'title',
							}),
							Components.searchableList('{id}-tp-ul-assigned-list'.format({id: id}), {
								name: 'assigned',
							}),
							Components.searchableList('{id}-tp-ul-all-list'.format({id: id}), {
								name: 'all',
							}),
						],
					}),
				],
			}),

			// 5. export panel
			UI.createComponent('{id}-export-panel'.format({id: id}), {
				name: 'exportPanel',
				template: UI.template('div', 'ie abs centred-vertically border hidden'),
				appearance: {
					style: {
						'height': '100%',
						'width': '714px',
						'left': '310px',
					},
				},
			}),

			// 6. upload panel
			UI.createComponent('{id}-upload-panel'.format({id: id}), {
				name: 'uploadPanel',
				template: UI.template('div', 'ie abs centred-vertically hidden'),
				appearance: {
					style: {
						'height': '100%',
						'width': '714px',
						'left': '310px',
					},
				},
				children: [
					UI.createComponent('{id}-up-upload-check'.format({id: id}), {
						name: 'uploadCheck',
						template: UI.template('div', 'ie'),
						appearance: {
							style: {
								'height': '100%',
								'width': '100%',
							},
						},
						children: [
							UI.createComponent('{id}-up-uc-relfile-display-container'.format({id: id}), {
								name: 'relfileDisplayContainer',
								template: UI.template('div', 'ie'),
								appearance: {
									style: {
										'height': '45px', // 45, 60, 250
										'width': '500px',
										'margin-top': '20px',
									},
								},
								children: [
									UI.createComponent('{id}-up-uc-rdc-relfile-display'.format({id: id}), {
										name: 'relfileDisplay',
										template: UI.template('div', 'ie border border-radius'),
										appearance: {
											style: {
												'height': '100%',
												'width': '50%',
												'float': 'left',
											},
										},
										children: [
											UI.createComponent('{id}-up-uc-rdc-rd-title'.format({id: id}), {
												name: 'title',
												template: UI.template('h3', 'ie'),
												appearance: {
													style: {
														'font-size': '18px',
														'margin-top': '10px',
														'margin-left': '10px',
													},
													html: 'No relfile',
												},
											}),
											UI.createComponent('{id}-up-uc-rdc-rd-entries'.format({id: id}), {
												name: 'entries',
												template: UI.template('span', 'ie'),
												appearance: {
													style: {
														'margin-left': '10px',
													},
												},
											}),
											Components.searchableList('{id}-up-uc-rdc-rd-duplicates'.format({id: id}), {
												name: 'duplicates',
												appearance: {
													style: {
														'width': 'calc(100% - 20px)',
														'height': '200px',
														'left': '10px',
													},
												},
											}),
										],
									}),
									UI.createComponent('{id}-up-uc-rdc-relfile-error-container'.format({id: id}), {
										name: 'relfileErrorContainer',
										template: UI.template('div', 'ie'),
										appearance: {
											style: {
												'height': '100%',
												'width': 'calc(50% - 10px)',
												'margin-left': '10px',
												'float': 'left',
											},
										},
										children: [
											UI.createComponent('{id}-up-uc-rdc-rec-no-relfile-error'.format({id: id}), {
												name: 'noRelfileError',
												template: UI.template('div', 'ie hidden'),
												appearance: {
													style: {
														'height': '30px',
													},
												},
												children: [
													UI.createComponent('{id}-up-uc-rdc-rec-nre-text'.format({id: id}), {
														name: 'text',
														template: UI.template('div', 'ie border border-radius'),
														appearance: {
															style: {
																'height': '100%',
																'width': '110px',
																'color': Color.red.dark,
																'border-color': Color.red.dark,
																'float': 'left',
																'text-align': 'center',
																'font-size': '15px',
																'padding-top': '6px',
																'border-bottom-right-radius': '0px',
																'border-top-right-radius': '0px',
															},
															html: 'No relfile',
														},
													}),
													UI.createComponent('{id}-up-uc-rdc-rec-nre-ignore-button'.format({id: id}), {
														template: UI.template('div', 'ie border border-radius button no'),
														appearance: {
															style: {
																'height': '30px',
																'width': '80px',
																'float': 'left',
																'padding-top': '6px',
																'border-left': '0px',
																'border-bottom-left-radius': '0px',
																'border-top-left-radius': '0px',
															},
															html: 'Ignore',
														},
													}),
												],
											}),
											UI.createComponent('{id}-up-uc-rdc-rec-duplicates-error'.format({id: id}), {
												name: 'duplicatesError',
												template: UI.template('div', 'ie border border-radius hidden'),
												appearance: {
													style: {
														'height': '30px',
														'width': '110px',
														'color': Color.red.dark,
														'border-color': Color.red.dark,
														'float': 'left',
														'text-align': 'center',
														'font-size': '15px',
														'padding-top': '6px',
													},
													html: 'Duplicates',
												},
											}),
										],
									}),
								],
							}),
							UI.createComponent('{id}-up-uc-audio-display-container'.format({id: id}), {
								name: 'audioDisplayContainer',
								template: UI.template('div', 'ie'),
								appearance: {
									style: {
										'height': '45px',
										'width': '500px',
										'margin-top': '10px',
									},
								},
								children: [
									UI.createComponent('{id}-up-uc-adc-audio-display'.format({id: id}), {
										name: 'audioDisplay',
										template: UI.template('div', 'ie border border-radius'),
										appearance: {
											style: {
												'height': '100%',
												'width': '50%',
												'float': 'left',
											},
										},
										children: [
											UI.createComponent('{id}-up-uc-adc-ad-title'.format({id: id}), {
												name: 'title',
												template: UI.template('h3', 'ie'),
												appearance: {
													style: {
														'font-size': '18px',
														'margin-top': '10px',
														'margin-left': '10px',
													},
													html: 'No audio',
												},
											}),
											UI.createComponent('{id}-up-uc-adc-ad-entries'.format({id: id}), {
												name: 'entries',
												template: UI.template('span', 'ie'),
												appearance: {
													style: {
														'margin-left': '10px',
													},
												},
											}),
											Components.searchableList('{id}-up-uc-adc-ad-no-caption-list'.format({id: id}), {
												name: 'noCaptionList',
												appearance: {
													style: {
														'width': 'calc(100% - 20px)',
														'height': '200px',
														'left': '10px',
													},
												},
											}),
										],
									}),
									UI.createComponent('{id}-up-uc-adc-audio-error-container'.format({id: id}), {
										name: 'audioErrorContainer',
										template: UI.template('div', 'ie'),
										appearance: {
											style: {
												'height': '100%',
												'width': 'calc(50% - 10px)',
												'margin-left': '10px',
												'float': 'left',
											},
										},
										children: [
											UI.createComponent('{id}-up-uc-adc-aec-no-caption'.format({id: id}), {
												name: 'noCaption',
												template: UI.template('div', 'ie hidden'),
												appearance: {
													style: {
														'height': '30px',
													},
												},
												children: [
													UI.createComponent('{id}-up-uc-adc-aec-nc-text'.format({id: id}), {
														name: 'text',
														template: UI.template('div', 'ie border border-radius'),
														appearance: {
															style: {
																'height': '100%',
																'width': '110px',
																'color': Color.red.dark,
																'border-color': Color.red.dark,
																'float': 'left',
																'text-align': 'center',
																'font-size': '15px',
																'padding-top': '6px',
																'border-bottom-right-radius': '0px',
																'border-top-right-radius': '0px',
															},
															html: 'No caption',
														},
													}),
													UI.createComponent('{id}-up-uc-adc-aec-nc-ingore-button'.format({id: id}), {
														name: 'ignoreButton',
														template: UI.template('div', 'ie border border-radius button no'),
														appearance: {
															style: {
																'height': '30px',
																'width': '80px',
																'float': 'left',
																'padding-top': '6px',
																'border-left': '0px',
																'border-bottom-left-radius': '0px',
																'border-top-left-radius': '0px',
															},
															html: 'Ignore',
														},
													}),
												],
											}),
										],
									}),
								],
							}),
							UI.createComponent('{id}-up-uc-button-panel'.format({id: id}), {
								name: 'buttonPanel',
								template: UI.template('div', 'ie'),
								appearance: {
									style: {
										'height': '45px',
										'width': '250px',
										'margin-top': '10px',
									},
								},
								children: [
									UI.createComponent('{id}-up-uc-bp-cancel-button'.format({id: id}), {
										name: 'cancelButton',
										template: UI.template('div', 'ie border border-radius button no'),
										appearance: {
											style: {
												'height': '45px',
												'width': '80px',
												'margin-right': '10px',
												'float': 'left',
											},
											html: 'Cancel',
										},
									}),
									UI.createComponent('{id}-up-uc-bp-confirm-upload-button'.format({id: id}), {
										name: 'confirmUploadButton',
										template: UI.template('div', 'ie border border-radius button yes'),
										appearance: {
											style: {
												'height': '45px',
												'width': 'calc(100% - 90px)',
												'float': 'left',
											},
											html: 'Upload',
										},
									}),
								],
							}),
						],
					}),
					UI.createComponent('{id}-up-previous-uploads'.format({id: id}), {
						name: 'previousUploads',
						template: UI.template('div', 'ie hidden'),
						appearance: {
							style: {
								'height': '100%',
								'width': '100%',
							},
						},
					}),
				],
			}),

			// upload controller
			AccountComponents.uploadController('uploadController'),
		],
	}).then(function (base) {

		// unpack components
		var clientList = base.cc.clientSidebar.cc.main.cc.clientList;
		var projectList = base.cc.projectSidebar.cc.main.cc.projectList;
		var focusSidebar = base.cc.focusSidebar;
		var relfileDisplayContainer = base.cc.uploadPanel.cc.uploadCheck.cc.relfileDisplayContainer;
		var rdTitle = relfileDisplayContainer.cc.relfileDisplay.cc.title;
		var rdDuplicates = relfileDisplayContainer.cc.relfileDisplay.cc.duplicates;
		var audioDisplayContainer = base.cc.uploadPanel.cc.uploadCheck.cc.audioDisplayContainer;
		var adTitle = audioDisplayContainer.cc.audioDisplay.cc.title;
		var adNoCaptionList = audioDisplayContainer.cc.audioDisplay.cc.noCaptionList;
		var uploadController = base.cc.uploadController;

		// client sidebar
		clientList.autocomplete = false;
		clientList.targets = [
			{
				name: 'clients',
				path: function () {
					return Active.get('client').then(function (client) {
						return Util.ep('clients.{client}.contract_clients'.format({client: client}));
					});
				},
				process: function (data) {
					return new Promise(function(resolve, reject) {
						var results = Object.keys(data).map(function (key) {
							var client = data[key];
							return {
								id: key,
								main: client.name,
								rule: 'clients',
							}
						});

						resolve(results);
					});
				},
				filterRequest: function () {
					return {};
				},
			},
		]
		clientList.sort = Util.sort.alpha('main');
		clientList.unit = function (datum, query, index) {
			query = (query || '');
			var base = clientList.data.idgen(index);
			return UI.createComponent(base, {
				name: 'unit{index}'.format({index: index}),
				template: UI.template('div', 'ie button base'),
				appearance: {
					classes: [datum.rule],
				},
				state: {
					stateMap: '-project-state-project',
				},
				children: [
					// main wrapper
					UI.createComponent('{base}-main-wrapper'.format({base: base}), {
						name: 'mainWrapper',
						template: UI.template('div', 'ie centred-vertically'),
						appearance: {
							style: {
								'display': 'inline-block',
							},
						},
						children: [
							// main
							UI.createComponent('{base}-mw-head'.format({base: base}), {
								name: 'head',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'color': Color.grey.normal,
										'display': 'inline-block',
										'position': 'absolute',
									},
									html: datum.main.substring(0, query.length),
								},
							}),
							UI.createComponent('{base}-mw-tail'.format({base: base}), {
								name: 'tail',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'display': 'inline-block',
									},
									html: datum.main,
								},
							}),
						],
					}),
				],
			}).then(function (unitBase) {

				unitBase.activate = function () {
					return unitBase.setAppearance({classes: {add: ['active']}});
				}
				unitBase.deactivate = function () {
					return unitBase.setAppearance({classes: {remove: ['active']}});
				}
				unitBase.hide = function () {
					unitBase.isHidden = true;
					return unitBase.setAppearance({classes: {add: 'hidden'}});
				}
				unitBase.show = function () {
					unitBase.isHidden = false;
					return unitBase.setAppearance({classes: {remove: 'hidden'}});
				}
				unitBase.updateMetadata = function (ndatum, query) {
					// if there are changes, do stuff.
					return ((!unitBase.datum || ndatum.id !== unitBase.datum.id) ? unitBase.updateDatum : Util.ep)(ndatum).then(function () {
						return (query !== unitBase.query ? unitBase.updateQuery : Util.ep)(query);
					}).then(function () {
						return (unitBase.isHidden ? unitBase.show : Util.ep)();
					});
				}
				unitBase.updateDatum = function (ndatum) {
					return unitBase.setAppearance({classes: {add: ndatum.rule, remove: (unitBase.datum || datum).rule}}).then(function () {
						unitBase.datum = ndatum;
						return Util.ep();
					});
				}
				unitBase.updateQuery = function (query) {
					unitBase.query = query;
					return Promise.all([
						unitBase.cc.mainWrapper.cc.head.setAppearance({html: (unitBase.datum || datum).main.substring(0, query.length)}),
						unitBase.cc.mainWrapper.cc.tail.setAppearance({html: (unitBase.datum || datum).main}),
					]);
				}

				// complete promises.
				return Promise.all([
					unitBase.setBindings({
						'click': function (_this) {
							return Active.set('contract_client.id', datum.id).then(function () {
								return _this.triggerState();
							})
						},
					}),
				]).then(function () {
					return unitBase;
				});
			});
		}

		// project sidebar
		projectList.autocomplete = false;
		projectList.targets = [
			{
				name: 'clients',
				path: function () {
					return Promise.all([
						Active.get('client'),
						Active.get('contract_client.id'),
					]).then(function (results) {
						var [client, contract_client] = results;
						return Util.ep('clients.{client}.contract_clients.{contract_client}.projects'.format({client: client, contract_client: contract_client}));
					});
				},
				process: function (data) {
					return new Promise(function(resolve, reject) {
						var results = Object.keys(data).map(function (key) {
							var project = data[key];
							return {
								id: key,
								main: project.name,
								rule: 'projects',
							}
						});

						resolve(results);
					});
				},
				filterRequest: function () {
					return {};
				},
			},
		]
		projectList.sort = Util.sort.alpha('main');
		projectList.unit = function (datum, query, index) {
			query = (query || '');
			var base = projectList.data.idgen(index);
			return UI.createComponent(base, {
				name: 'unit{index}'.format({index: index}),
				template: UI.template('div', 'ie button base'),
				appearance: {
					classes: [datum.rule],
				},
				state: {
					stateMap: '-project-state-focus',
				},
				children: [
					// main wrapper
					UI.createComponent('{base}-main-wrapper'.format({base: base}), {
						name: 'mainWrapper',
						template: UI.template('div', 'ie centred-vertically'),
						appearance: {
							style: {
								'display': 'inline-block',
							},
						},
						children: [
							// main
							UI.createComponent('{base}-mw-head'.format({base: base}), {
								name: 'head',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'color': Color.grey.normal,
										'display': 'inline-block',
										'position': 'absolute',
									},
									html: datum.main.substring(0, query.length),
								},
							}),
							UI.createComponent('{base}-mw-tail'.format({base: base}), {
								name: 'tail',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'display': 'inline-block',
									},
									html: datum.main,
								},
							}),
						],
					}),
				],
			}).then(function (unitBase) {

				unitBase.activate = function () {
					return unitBase.setAppearance({classes: {add: ['active']}});
				}
				unitBase.deactivate = function () {
					return unitBase.setAppearance({classes: {remove: ['active']}});
				}
				unitBase.hide = function () {
					unitBase.isHidden = true;
					return unitBase.setAppearance({classes: {add: 'hidden'}});
				}
				unitBase.show = function () {
					unitBase.isHidden = false;
					return unitBase.setAppearance({classes: {remove: 'hidden'}});
				}
				unitBase.updateMetadata = function (ndatum, query) {
					// if there are changes, do stuff.
					return ((!unitBase.datum || ndatum.id !== unitBase.datum.id) ? unitBase.updateDatum : Util.ep)(ndatum).then(function () {
						return (query !== unitBase.query ? unitBase.updateQuery : Util.ep)(query);
					}).then(function () {
						return (unitBase.isHidden ? unitBase.show : Util.ep)();
					});
				}
				unitBase.updateDatum = function (ndatum) {
					return unitBase.setAppearance({classes: {add: ndatum.rule, remove: (unitBase.datum || datum).rule}}).then(function () {
						unitBase.datum = ndatum;
						return Util.ep();
					});
				}
				unitBase.updateQuery = function (query) {
					unitBase.query = query;
					return Promise.all([
						unitBase.cc.mainWrapper.cc.head.setAppearance({html: (unitBase.datum || datum).main.substring(0, query.length)}),
						unitBase.cc.mainWrapper.cc.tail.setAppearance({html: (unitBase.datum || datum).main}),
					]);
				}

				// complete promises.
				return Promise.all([
					unitBase.setBindings({
						'click': function (_this) {
							return Active.set('contract_client.project', datum.id).then(function () {
								return _this.triggerState();
							})
						},
					}),
				]).then(function () {
					return unitBase;
				});
			});
		}

		// focus sidebar
		jss.set('#{id} .menu-button:hover'.format({id: id}), {
			'border-color': Color.grey.light,
			'cursor': 'pointer',
		})

		// relfile duplicates
		rdDuplicates.data.load.source = function (path, options) {
			return Util.ep(uploadController.upload.buffer.relfile.entries);
		}
		rdDuplicates.autocomplete = false;
		rdDuplicates.targets = [
			{
				name: 'duplicates',
				path: function () {
					return Util.ep();
				},
				process: function (data) {
					var results = Object.keys(data).filter(function (key) {
						return data[key].isDuplicate;
					}).map(function (key) {
						var entry = data[key];
						return {
							id: key,
							main: key,
							rule: 'duplicates',
						}
					});
					return Util.ep(results);
				},
			}
		]
		rdDuplicates.unit = function (datum, query, index) {
			query = (query || '');
			var base = rdDuplicates.data.idgen(index);
			return UI.createComponent(base, {
				name: 'unit{index}'.format({index: index}),
				template: UI.template('div', 'ie button base'),
				appearance: {
					classes: [datum.rule],
				},
				children: [
					// main wrapper
					UI.createComponent('{base}-main-wrapper'.format({base: base}), {
						name: 'mainWrapper',
						template: UI.template('div', 'ie centred-vertically'),
						appearance: {
							style: {
								'display': 'inline-block',
							},
						},
						children: [
							// main
							UI.createComponent('{base}-mw-head'.format({base: base}), {
								name: 'head',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'color': Color.grey.normal,
										'display': 'inline-block',
										'position': 'absolute',
									},
									html: datum.main.substring(0, query.length),
								},
							}),
							UI.createComponent('{base}-mw-tail'.format({base: base}), {
								name: 'tail',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'display': 'inline-block',
									},
									html: datum.main,
								},
							}),
						],
					}),
				],
			}).then(function (unitBase) {

				unitBase.activate = function () {
					return unitBase.setAppearance({classes: {add: ['active']}});
				}
				unitBase.deactivate = function () {
					return unitBase.setAppearance({classes: {remove: ['active']}});
				}
				unitBase.hide = function () {
					unitBase.isHidden = true;
					return unitBase.setAppearance({classes: {add: 'hidden'}});
				}
				unitBase.show = function () {
					unitBase.isHidden = false;
					return unitBase.setAppearance({classes: {remove: 'hidden'}});
				}
				unitBase.updateMetadata = function (ndatum, query) {
					// if there are changes, do stuff.
					return ((!unitBase.datum || ndatum.id !== unitBase.datum.id) ? unitBase.updateDatum : Util.ep)(ndatum).then(function () {
						return (query !== unitBase.query ? unitBase.updateQuery : Util.ep)(query);
					}).then(function () {
						return (unitBase.isHidden ? unitBase.show : Util.ep)();
					});
				}
				unitBase.updateDatum = function (ndatum) {
					return unitBase.setAppearance({classes: {add: ndatum.rule, remove: (unitBase.datum || datum).rule}}).then(function () {
						unitBase.datum = ndatum;
						return Util.ep();
					});
				}
				unitBase.updateQuery = function (query) {
					unitBase.query = query;
					return Promise.all([
						unitBase.cc.mainWrapper.cc.head.setAppearance({html: (unitBase.datum || datum).main.substring(0, query.length)}),
						unitBase.cc.mainWrapper.cc.tail.setAppearance({html: (unitBase.datum || datum).main}),
					]);
				}

				// complete promises.
				return Promise.all([

				]).then(function () {
					return unitBase;
				});
			});
		}

		// audio captions
		adNoCaptionList.data.load.source = function (path, options) {
			return Util.ep(uploadController.upload.buffer.audio);
		}
		adNoCaptionList.autocomplete = false;
		adNoCaptionList.targets = [
			{
				name: 'noCaption',
				path: function () {
					return Util.ep();
				},
				process: function (data) {
					var results = Object.keys(data).filter(function (key) {
						return !(key in uploadController.upload.buffer.relfile.entries);
					}).map(function (key) {
						return {
							id: key,
							main: key,
							rule: 'noCaption',
						}
					});
					return Util.ep(results);
				},
			}
		]
		adNoCaptionList.unit = function (datum, query, index) {
			query = (query || '');
			var base = adNoCaptionList.data.idgen(index);
			return UI.createComponent(base, {
				name: 'unit{index}'.format({index: index}),
				template: UI.template('div', 'ie button base'),
				appearance: {
					classes: [datum.rule],
				},
				children: [
					// main wrapper
					UI.createComponent('{base}-main-wrapper'.format({base: base}), {
						name: 'mainWrapper',
						template: UI.template('div', 'ie centred-vertically'),
						appearance: {
							style: {
								'display': 'inline-block',
							},
						},
						children: [
							// main
							UI.createComponent('{base}-mw-head'.format({base: base}), {
								name: 'head',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'color': Color.grey.normal,
										'display': 'inline-block',
										'position': 'absolute',
									},
									html: datum.main.substring(0, query.length),
								},
							}),
							UI.createComponent('{base}-mw-tail'.format({base: base}), {
								name: 'tail',
								template: UI.template('span', 'ie'),
								appearance: {
									style: {
										'display': 'inline-block',
									},
									html: datum.main,
								},
							}),
						],
					}),
				],
			}).then(function (unitBase) {

				unitBase.activate = function () {
					return unitBase.setAppearance({classes: {add: ['active']}});
				}
				unitBase.deactivate = function () {
					return unitBase.setAppearance({classes: {remove: ['active']}});
				}
				unitBase.hide = function () {
					unitBase.isHidden = true;
					return unitBase.setAppearance({classes: {add: 'hidden'}});
				}
				unitBase.show = function () {
					unitBase.isHidden = false;
					return unitBase.setAppearance({classes: {remove: 'hidden'}});
				}
				unitBase.updateMetadata = function (ndatum, query) {
					// if there are changes, do stuff.
					return ((!unitBase.datum || ndatum.id !== unitBase.datum.id) ? unitBase.updateDatum : Util.ep)(ndatum).then(function () {
						return (query !== unitBase.query ? unitBase.updateQuery : Util.ep)(query);
					}).then(function () {
						return (unitBase.isHidden ? unitBase.show : Util.ep)();
					});
				}
				unitBase.updateDatum = function (ndatum) {
					return unitBase.setAppearance({classes: {add: ndatum.rule, remove: (unitBase.datum || datum).rule}}).then(function () {
						unitBase.datum = ndatum;
						return Util.ep();
					});
				}
				unitBase.updateQuery = function (query) {
					unitBase.query = query;
					return Promise.all([
						unitBase.cc.mainWrapper.cc.head.setAppearance({html: (unitBase.datum || datum).main.substring(0, query.length)}),
						unitBase.cc.mainWrapper.cc.tail.setAppearance({html: (unitBase.datum || datum).main}),
					]);
				}

				// complete promises.
				return Promise.all([

				]).then(function () {
					return unitBase;
				});
			});
		}

		// upload panel buttons
		jss.set('#{id} .button.yes'.format({id: id}), {
			'border-color': Color.green.normal,
			'color': Color.green.normal,
			'text-align': 'center',
			'padding-top': '14px',
		});
		jss.set('#{id} .button.yes:hover'.format({id: id}),{
			'border-color': Color.green.light,
			'color': Color.green.light,
		});
		jss.set('#{id} .button.no'.format({id: id}), {
			'border-color': Color.red.dark,
			'color': Color.red.dark,
			'text-align': 'center',
			'padding-top': '14px',
		});
		jss.set('#{id} .button.no:hover'.format({id: id}), {
			'border-color': Color.red.normal,
			'color': Color.red.normal,
		});

		// upload controller
		uploadController.triggerState = function () {
			return UI.changeState('-project-state-upload-check');
		}

		return Promise.all([

			// base
			base.setState({
				defaultState: {preFn: UI.functions.hide()},
				states: {
					'project-state': {
						preFn: function (_this) {
							// keybindings
							return Util.ep();
						},
						fn: UI.functions.show(),
					},
					'control-state': 'default',
				},
			}),

			// CLIENT SIDEBAR
			clientList.unitStyle.apply(),
			clientList.search.setAppearance({
				style: {
					'left': '0px',
					'width': '100%',
					'height': '30px',
					'padding-top': '8px',
					'border': '0px',
				},
			}),
			clientList.cc.title.setAppearance({
				style: {
					'width': '100%',
					'height': '32px',
					'font-size': '18px',
					'padding-top': '10px',
					'padding-left': '10px',
				},
			}),
			clientList.setState({
				states: {
					'project-state': {
						preFn: function (_this) {
							return _this.control.setup.main();
						},
					},
				},
			}),
			clientList.setTitle({text: 'Clients', center: false}),
			clientList.setSearch({mode: 'on', placeholder: 'Search clients...'}),
			base.cc.clientSidebar.cc.main.addStates({
				'-project-state-focus': {
					style: {
						'left': '40px',
						'opacity': '0.0',
					},
					fn: UI.functions.hide(),
				},
			}),

			// PROJECT SIDEBAR
			projectList.unitStyle.apply(),
			projectList.search.setAppearance({
				style: {
					'left': '0px',
					'width': '100%',
					'height': '30px',
					'padding-top': '8px',
					'border': '0px',
				},
			}),
			projectList.cc.title.setAppearance({
				style: {
					'width': '100%',
					'height': '32px',
					'font-size': '18px',
					'padding-top': '10px',
					'padding-left': '10px',
				},
			}),
			projectList.setState({
				states: {
					'-project-state-project': {
						preFn: function (_this) {
							return _this.control.setup.main();
						},
					},
				},
			}),
			projectList.setTitle({text: 'Projects', center: false}),
			projectList.setSearch({mode: 'on', placeholder: 'Search projects...'}),
			base.cc.projectSidebar.cc.main.addStates({
				'-project-state-focus': {
					style: {
						'left': '250px',
						'opacity': '0.0',
					},
					fn: UI.functions.hide(),
				},
			}),

			// 3. FOCUS SIDEBAR
			focusSidebar.cc.main.setAppearance({
				style: {
					'width': '250px',
					'height': '100%',
				},
			}),
			focusSidebar.cc.main.addState('-project-state-focus', {
				preFn: function (_this) {
					return Promise.all([
						// Active
						Active.get('client'),
						Active.get('contract_client'),
					]).then(function (results) {
						var [client_id, contract_client] = results;
						// Context
						return Context.get('clients.{client_id}.contract_clients.{contract_client_id}'.format({client_id: client_id, contract_client_id: contract_client.id})).then(function (contract_client_data) {
							var project = contract_client_data.projects[contract_client.project];
							return Promise.all([
								focusSidebar.cc.main.cc.title.setAppearance({html: '{contract_client}'.format({contract_client: contract_client_data.name})}),
								focusSidebar.cc.main.cc.subtitle.setAppearance({html: '{contract_client_project}'.format({contract_client_project: project.name})}),
								focusSidebar.cc.main.cc.status.setAppearance({
									html: (project.is_transcription_complete ? 'complete' : 'incomplete'),
									style: {
										'color': (project.is_transcription_complete ? Color.green.normal : Color.red.normal),
									},
								}),
								focusSidebar.cc.main.cc.transcriptionButton.cc.transcriberNumber.setAppearance({html: '{transcribers} Transcribers'.format({transcribers: project.workers_assigned})}),
								focusSidebar.cc.main.cc.transcriptionButton.cc.percentageCompletion.setAppearance({html: '{completion}%'.format({completion: project.completion_percentage})}),
								focusSidebar.cc.main.cc.transcriptionButton.cc.countRemaining.setAppearance({html: '{remaining}'.format({remaining: project.transcriptions_remaining})}),
								focusSidebar.cc.main.cc.exportButton.cc.completed.setAppearance({html: '{done}'.format({done: project.transcriptions_completed})}),
							]);
						});
					});
				},
			}),

			// 3.3
			focusSidebar.cc.main.cc.transcriptionButton.setState({
				stateMap: '-project-state-transcription',
			}),
			focusSidebar.cc.main.cc.transcriptionButton.setBindings({
				'click': function (_this) {
					return _this.triggerState();
				},
			}),

			// 3.4
			focusSidebar.cc.main.cc.exportButton.setState({
				stateMap: '-project-state-export',
			}),
			focusSidebar.cc.main.cc.exportButton.setBindings({
				'click': function (_this) {
					return _this.triggerState();
				},
			}),

			// 3.5
			focusSidebar.cc.main.cc.uploadButton.cc.dropzone.setBindings({
				'drop': function (_this, event) {
					event.preventDefault();
					event.stopPropagation();
					var length = event.originalEvent.dataTransfer.items.length;
					for (var i = 0; i < length; i++) {
						var item = event.originalEvent.dataTransfer.items[i];
						var entry = item.webkitGetAsEntry();
						if (entry.isFile) {
							console.log(entry, item.getAsFile());
						} else if (entry.isDirectory) {
							console.log(entry);
						}
					}
				},
				'dragover': function (_this, event) {
					event.preventDefault();
					event.stopPropagation();
				},
				'dragleave': function (_this, event) {
					event.preventDefault();
					event.stopPropagation();
				},
			}),

			// 4. TRANSCRIPTION PANEL
			base.cc.transcriptionPanel.setState({
				defaultState: {
					preFn: UI.functions.hide(),
				},
				states: {
					'project-state': 'default',
					'-project-state-project': 'default',
					'-project-state-transcription': {
						preFn: function (_this) {
							// load data
							return Util.ep();
						},
						fn: UI.functions.show(),
					},
					'-project-state-export': 'default',
					'-project-state-upload-check': 'default',
					'-project-state-upload': 'default',
				},
			}),

			// 5. EXPORT PANEL
			base.cc.exportPanel.setState({
				defaultState: {
					preFn: UI.functions.hide(),
				},
				states: {
					'project-state': 'default',
					'-project-state-project': 'default',
					'-project-state-transcription': 'default',
					'-project-state-export': {
						preFn: function (_this) {
							// load data
							return Util.ep();
						},
						fn: UI.functions.show(),
					},
					'-project-state-upload-check': 'default',
					'-project-state-upload': 'default',
				},
			}),

			// 6. UPLOAD PANEL
			base.cc.uploadPanel.setState({
				defaultState: {
					preFn: UI.functions.hide(),
				},
				states: {
					'project-state': 'default',
					'-project-state-project': 'default',
					'-project-state-transcription': 'default',
					'-project-state-export': 'default',
					'-project-state-upload-check': {
						preFn: function (_this) {
							// load data
							return Util.ep();
						},
						fn: UI.functions.show(),
					},
					'-project-state-upload': 'default',
				},
			}),

			// CONVERT TO FUNCTION CALLS ON THE RELEVANT OBJECTS SET ABOVE
			base.cc.uploadPanel.cc.uploadCheck.setState({
				defaultState: {
					preFn: UI.functions.hide(),
					fn: function (_this) {
						// return uploadPanelUploadCheck.reset();
						return Util.ep();
					},
				},
				states: {
					'-project-state-upload-check': {
						fn: function (_this) {
							// load data
							return Promise.all([

								// adjust relfile display container
								Util.ep(Object.keys(uploadController.upload.buffer.relfile.entries).length).then(function (numberOfEntries) {
									if (uploadController.upload.addingRelfile) {
										uploadController.upload.addingRelfile = false;
										if (numberOfEntries) {
											return Promise.all([
												rdTitle.setAppearance({html: 'Relfile'}),
												uploadPanelUploadCheckRelfileDisplayEntries.setAppearance({html: '{entries} entries'.format({entries: numberOfEntries})}),
											]).then(function () {
												var numberOfDuplicates = Object.keys(uploadController.upload.buffer.relfile.entries).filter(function (key) {
													return uploadController.upload.buffer.relfile.entries[key].isDuplicate;
												}).length;
												if (numberOfDuplicates) {
													return Promise.all([
														rdDuplicates.setTitle({text: '{duplicates} duplicates'.format({duplicates: numberOfDuplicates}), center: false}),
														relfileDisplayContainer.setAppearance({style: {'height': '250px'}}),
													]);
												} else {
													return relfileDisplayContainer.setAppearance({style: {'height': '60px'}});
												}
											});
										} else {
											return Promise.all([
												rdTitle.setAppearance({html: 'No relfile'}),
												relfileDisplayContainer.setAppearance({style: {'height': '45px'}}),
											]);
										}
									}
								}),

								// adjust audio display container
								Util.ep(Object.keys(uploadController.upload.buffer.audio).length).then(function (numberOfEntries) {
									if (uploadController.upload.addingAudio) {
										uploadController.upload.addingAudio = false;
										if (numberOfEntries) {
											return Promise.all([
												adTitle.setAppearance({html: 'Audio'}),
												uploadPanelUploadCheckAudioDisplayEntries.setAppearance({html: '{entries} entries'.format({entries: numberOfEntries})}),
											]).then(function () {
												var numberOfNoCaption = Object.keys(uploadController.upload.buffer.audio).filter(function (key) {
													return !(key in uploadController.upload.buffer.relfile.entries);
												}).length;
												if (numberOfNoCaption) {
													return adNoCaptionList.setTitle({text: '{nocaption} without captions'.format({nocaption: numberOfNoCaption}), center: false}).then(function () {
														if (uploadController.upload.addingAudioTarget !== 1) {
															uploadController.upload.addingAudioTarget = 1;
															return audioDisplayContainer.setAppearance({style: {'height': '250px'}}).then(function () {
																uploadController.upload.addingAudioTarget = 0;
															});
														}
													});
												} else {
													if (uploadController.upload.addingAudioTarget !== 2) {
														uploadController.upload.addingAudioTarget = 2;
														return audioDisplayContainer.setAppearance({style: {'height': '60px'}}).then(function () {
															uploadController.upload.addingAudioTarget = 0;
														});
													}
												}
											});
										} else {
											return adTitle.setAppearance({html: 'No audio'}).then(function () {
												if (uploadController.upload.addingAudioTarget !== 3) {
													uploadController.upload.addingAudioTarget = 3;
													return audioDisplayContainer.setAppearance({style: {'height': '45px'}}).then(function () {
														uploadController.upload.addingAudioTarget = 0;
													});
												}
											});
										}
									}
								}),
							]).then(function () {
								return Promise.all([
									// display audio no caption
									adNoCaptionList.control.setup.main(),

									// display relfile duplicates
									rdDuplicates.control.setup.main(),
								]);
							});
						},
						preFn: UI.functions.show(),
					},
					'-project-state-upload': 'default',
				},
			}),

			// relfile display
			rdDuplicates.setTitle({text: 'Duplicates', center: false, style: {'font-size': '14px', 'margin-bottom': '0px'}}),
			rdDuplicates.setSearch({mode: 'off', placeholder: ''}),
			rdDuplicates.cc.list.setAppearance({
				style: {
					'height': '158px',
				},
			}),

			// relfile errors


			// audio display
			adNoCaptionList.setTitle({text: 'Without captions', center: false, style: {'font-size': '14px', 'margin-bottom': '0px'}}),
			adNoCaptionList.setSearch({mode: 'off', placeholder: ''}),
			adNoCaptionList.cc.list.setAppearance({
				style: {
					'height': '158px',
				},
			}),

			// audio errors


			// button panel

		]).then(function () {
			return base;
		});
	});
}
