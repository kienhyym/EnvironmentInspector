define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/kehoachthanhtra/tpl/model.html'),
		schema = require('json!schema/KeHoachThanhTraSchema.json');
	var ThanhVienThanhTraItemView = require('app/kehoachthanhtra/thanhvienthanhtra/ThanhVienThanhTraItem');
	var danhMucDoanhNghiepSelectView = require('app/danhmucdoanhnghiep/view/SelectView');
	var DonViSelectView = require('app/danhmuclinhvuc/js/SelectView');
	var TemplateHelper = require('app/base/view/TemplateHelper');
	return Gonrin.ModelView.extend({
		template: template,
		urlPrefix: "/api/v1/",
		modelSchema: schema,
		collectionName: "kehoachthanhtra",
		itemIDKeHoachNamSau: null,
		itemDonViKeHoachNamSau: null,
		itemTenDonViKeHoachNamSau: null,
		itemLinhVucKeHoachNamSau: null,
		tools: [
			{
				name: "defaultgr",
				type: "group",
				groupClass: "toolbar-group",
				buttons: [
					{
						name: "back",
						type: "button",
						buttonClass: "btn-default btn-sm",
						label: "TRANSLATE:BACK",
						command: function () {
							var self = this;

							Backbone.history.history.back();
						},
						visible: function () {
							return this.getApp().currentUser.hasRole("Admin") || this.getApp().currentUser.hasRole("CoSoKCB");
						}
					},
					{
						name: "delete",
						type: "button",
						buttonClass: "btn-danger btn-sm",
						label: "TRANSLATE:DELETE",
						visible: function () {

							return this.getApp().currentUser.hasRole("Admin");
						},
						command: function () {
							var self = this;
							self.model.destroy({
								success: function (model, response) {
									self.getApp().notify('Xoá dữ liệu thành công');
									self.getApp().getRouter().navigate(self.collectionName + "/collection");
								},
								error: function (model, xhr, options) {
									self.getApp().notify('Xoá dữ liệu không thành công!');

								}
							});
						}
					},
				],
			}],
		uiControl: {
			fields: [

				{
					field: "danhmucdoanhnghiep",
					uicontrol: "ref",
					textField: "name",
					foreignRemoteField: "id",
					foreignField: "danhmucdoanhnghiep_id",
					dataSource: danhMucDoanhNghiepSelectView
				},
				{
					field: "ngaysoanthao",
					uicontrol: "datetimepicker",
					textFormat: "DD/MM/YYYY",
					extraFormats: ["DDMMYYYY"],
					parseInputDate: function (val) {
						return moment.unix(val)
					},
					parseOutputDate: function (date) {
						return date.unix()
					}
				},
				{
					field: "ngaypheduyet",
					uicontrol: "datetimepicker",
					textFormat: "DD/MM/YYYY",
					extraFormats: ["DDMMYYYY"],
					parseInputDate: function (val) {
						return moment.unix(val)
					},
					parseOutputDate: function (date) {
						return date.unix()
					}
				},
				{
					field: "ngay_quyetdinh_thanhtra",
					uicontrol: "datetimepicker",
					textFormat: "DD/MM/YYYY",
					extraFormats: ["DDMMYYYY"],
					parseInputDate: function (val) {
						return moment.unix(val)
					},
					parseOutputDate: function (date) {
						return date.unix()
					}
				},
				{
					field: "danhmuclinhvuc",
					uicontrol: "ref",
					textField: "tenlinhvuc",
					foreignRemoteField: "id",
					foreignField: "danhmuclinhvuc_id",
					dataSource: DonViSelectView
				},
				// {
				// 	field: "ngayketthuc",
				// 	uicontrol: "datetimepicker",
				// 	textFormat: "DD/MM/YYYY",
				// 	extraFormats: ["DDMMYYYY"],
				// 	parseInputDate: function (val) {
				// 		return moment.unix(val)
				// 	},
				// 	parseOutputDate: function (date) {
				// 		return date.unix()
				// 	}
				// },
				{
					field: "ngay_quyetdinh_trungcau_giamdinh",
					uicontrol: "datetimepicker",
					textFormat: "DD/MM/YYYY",
					extraFormats: ["DDMMYYYY"],
					parseInputDate: function (val) {
						return moment.unix(val)
					},
					parseOutputDate: function (date) {
						return date.unix()
					}
				},
				{
					field: "trangthai",
					label: "Trạng thái",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					cssClass: "form-control",
					dataSource: [
						{ value: "new", text: "Tạo mới" },
						{ value: "send_review_truongphong", text: "Chờ cấp phòng duyệt" },
						{ value: "cancel_reviewed_truongphong", text: "Phòng từ chối" },
						{ value: "send_review_pct", text: "Chờ PCT duyệt" },
						{ value: "cancel_reviewed_pct", text: "PCT từ chối" },
						{ value: "send_approved", text: "Chờ CT duyệt" },
						{ value: "cancel_approved", text: "CT từ chối" },
						{ value: "approved", text: "CT đã duyệt quyết định" },
						{ value: "checked", text: "Đã kiểm tra" },
						{ value: "result_checked", text: "Đã có kết luận" },
						{ value: "completed", text: "Hoàn thành" },
						{ value: "end_checked", text: "Đã kết thúc thanh tra" }

					],
				},
			]
		},

		initialize: function () {
			this.itemIDKeHoachNamSau = localStorage.getItem("idItem");
			this.itemDonViKeHoachNamSau = localStorage.getItem("idDonVi");
			this.itemTenDonViKeHoachNamSau = localStorage.getItem("tenDonVi");
			this.itemLinhVucKeHoachNamSau = localStorage.getItem("dsLinhVuc");
			localStorage.clear();
		},
		render: function () {
			var self = this;
			self.getApp().currentUser.roles.forEach(function (item, index) {
				if (item.role_name == 'VanPhongCuc' || item.role_name == 'ThanhVienDoanThanhTra') {
					self.$el.find('.dsnut,.btn-add-member').hide();
				}
			})

			self.chonLinhVuc();
			self.getDoanhNghiep();
			self.bindEventSelect();
			self.updateUIPermission();
			self.inputFileOnChange();
			self.bindEventGD();
			self.lyDoTuChoi();

			var id = this.getApp().getRouter().getParam("id");

			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {

						self.inputFileOnChange();
						self.renderAttachment();
						self.bindEventGD();
						self.lyDoTuChoi();
						self.$el.find("#form-content").find("input").prop("disabled", true);
						self.$el.find("#trangthai").removeClass("hidden");
						var danhsachfile = self.model.get("tailieulienquan");
						if (danhsachfile === null) {
							danhsachfile = [];
						}
						self.$el.find(".list_file").html("");
						if (danhsachfile.length > 0) {

							self.$el.find(".highlight").removeClass('d-none');
						}
						self.applyBindings();
						self.chonLinhVuc();
						self.hienThiLinhVuc();
						self.$el.find("#multiselect_donvidoanhnghiep").selectpicker('val', self.model.get("madoanhnghiep"));
						self.updateUITimeline(self.model.toJSON());
						self.updateUIPermission();
						// self.renderUpload();
						// Hiển thị danh sách nngười
						self.GetNguoiGiamSat();
						self.$el.find('#select_nguoigiamsat').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
							var data_ck = self.$el.find('#select_nguoigiamsat option:selected').attr('data-ck');
							if (data_ck !== undefined && data_ck !== null) {
								var my_object = JSON.parse(decodeURIComponent(data_ck));
								if (my_object !== null) {
									self.model.set("manguoigiamsat", my_object.id);
									self.model.set("tennguoigiamsat", my_object.hoten);
								}
							}
						});

						// lấy danh sách thành viên
						var danhsach_thanhvien = self.model.get("danhsach_thanhvien");
						if (danhsach_thanhvien === null) {
							self.model.set("danhsach_thanhvien", []);
						}
						$.each(danhsach_thanhvien, function (idx, value) {

							self.renderMember_GD1(value);
						});

					},
					error: function (xhr, status, error) {
						try {
							if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
								self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
								self.getApp().getRouter().navigate("login");
							} else {
								self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
							}
						}
						catch (err) {
							self.getApp().notify({ message: "Không tìm thấy dữ liệu" }, { type: "danger", delay: 1000 });
						}
					},
					complete: function () {
						self.bindEventGD1();
					}
				});

			} else {
				self.model.set("trangthai", "new");
				self.$el.find("#trangthai").hide();
				self.$el.find("#timeline").hide();
				self.$el.find("#btn_review").hide();
				self.$el.find("#btn_approve").hide();
				self.$el.find("#btn_cancel").hide();
				self.applyBindings();
				// self.renderUpload();
				self.bindEventGD1();
				self.model.set('danhmucdoanhnghiep_id', self.itemDonViKeHoachNamSau)
				self.$el.find('.tendoanhnghiep div span').text(self.itemTenDonViKeHoachNamSau)

			}

		},
		lyDoTuChoi: function () {
			var self = this;
			self.$el.find('#lydotuchoi').hide();
			if (self.model.get('trangthai') == 'cancel_approved' ||
				self.model.get('trangthai') == 'cancel_reviewed_pct' ||
				self.model.get('trangthai') == 'cancel_reviewed_truongphong') {
				self.$el.find('#lydotuchoi').show();
			}
			self.$el.find('#btn_send').unbind('click').bind('click', function () {
				self.saveModel();
			})
		},
		hienThiLinhVuc: function () {
			var self = this;
			var linhVuc = [];
			console.log(JSON.parse(self.itemLinhVucKeHoachNamSau))


			self.model.get('danhsachlinhvuc_field').forEach(function (item, index) {
				linhVuc.push(item.id)
			})

			self.$el.find('.chonlinhvuc select').selectpicker('val', linhVuc);

		},
		chonLinhVuc: function () {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhmuclinhvuc",
				method: "GET",
				data: { "q": JSON.stringify({ "order_by": [{ "field": "grouplinhvuc", "direction": "desc" }], "page": 1, "results_per_page": 10000 }) },
				contentType: "application/json",
				success: function (data) {
					var grouplinhvuc = "";
					var classMaLinhVuc = "";
					data.objects.forEach(function (item, index) {
						if (grouplinhvuc !== item.grouplinhvuc) {
							classMaLinhVuc = item.malinhvuc;
							self.$el.find('.chonlinhvuc select').append(`
							<optgroup label="${item.grouplinhvuc}" class ="optgroup${classMaLinhVuc} pt-0 pb-0 " >
							<option value="${item.id}">${item.tenlinhvuc}</option>
							</optgroup>
							`)
							grouplinhvuc = item.grouplinhvuc
						} else {
							self.$el.find('.optgroup' + classMaLinhVuc).append(`
								<option value="${item.id}" >${item.tenlinhvuc}</option>
							`)
						}
					})
					self.$el.find('.chonlinhvuc select').selectpicker({
						'actionsBox': 'true'
					});
					if (JSON.parse(self.itemLinhVucKeHoachNamSau) != null) {
						self.$el.find('.chonlinhvuc select').selectpicker('val', JSON.parse(self.itemLinhVucKeHoachNamSau));

					}
				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});


		},


		bindEventGD: function (files) {
			var self = this;
			self.$el.find("#btn_save").unbind('click').bind('click', function () {
				if (self.$el.find('.chonlinhvuc select').selectpicker('val').length != 0) {
					var giatriloc_LinhVuc = self.$el.find('.chonlinhvuc select').selectpicker('val');
					var filters = {
						filters: {
							"$and": [
								{ "id": { "$in": giatriloc_LinhVuc } }
							]
						},
						order_by: [{ "field": "created_at", "direction": "asc" }]
					}
					$.ajax({
						type: "GET",
						url: self.getApp().serviceURL + "/api/v1/danhmuclinhvuc?results_per_page=100000&max_results_per_page=1000000",
						data: { "q": JSON.stringify(filters) },
						contentType: "application/json",
						success: function (response) {
							self.model.set('danhsachlinhvuc_field', response.objects)
							self.model.save(null, {
								success: function (model, respose, options) {
									if (self.itemIDKeHoachNamSau != null) {
										$.ajax({
											url: self.getApp().serviceURL + "/api/v1/danhsachdonvikehoachnamsau/" + self.itemIDKeHoachNamSau,
											method: "PUT",
											data: JSON.stringify({
												"kehoachthanhtra_id": respose.id,
											}),
											contentType: "application/json",
											success: function (data) {
											},
											error: function (xhr, status, error) {
												self.getApp().notify({ message: "Có lỗi xảy ra" }, { type: "danger", delay: 1000 });
											}
										});
									}


									if (String(typeof files) == "object") {
										files.forEach(function (item, index) {
											self.saveAttachment(item.arrAttachment, item.data_attr);
										})
									}
									else {
										self.saveModel();
									}

									self.$el.find("#header_del_member").removeClass("d-none");
									var memberView = new ThanhVienThanhTraItemView();
									if (!!response) {
										memberView.model.set(JSON.parse(JSON.stringify(response)));
									}

									memberView.render();
									self.$el.find("#danhsach_thanhvien").append(memberView.$el);
									memberView.on("change", function (event) {
										var ds_member = self.model.get("danhsach_thanhvien");
										if (ds_member === null) {
											ds_member = [];
											ds_member.push(event.response)
										}
										for (var i = 0; i < ds_member.length; i++) {
											if (ds_member[i].id === event.oldData.id) {
												ds_member[i] = event.response;
												break;
											}
										}
										self.model.set("danhsach_thanhvien", ds_member);
										self.applyBinding("danhsach_thanhvien");
									});
									memberView.$el.find("#del_member").unbind("click").bind("click", function () {
										var ds_member = self.model.get("danhsach_thanhvien");
										for (var i = 0; i < ds_member.length; i++) {
											if (ds_member[i].id === memberView.model.get("id")) {

												ds_member.splice(i, 1);
											}
										}
										self.model.set("danhsach_thanhvien", ds_member);
										self.applyBinding("danhsach_thanhvien");
										memberView.destroy();
										memberView.remove();
									});

									self.getApp().getRouter().navigate(self.collectionName + "/collection");

								},
								error: function (xhr, status, error) {
									try {
										if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
											self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
											self.getApp().getRouter().navigate("login");
										} else {
											self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
										}
									}
									catch (err) {
										self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
									}
								}
							});
						}
					});
				}

				// self.model.save(null, {
				// 	success: function (model, response, options) {

				// 	},
				// 	error: function (xhr, status, error) {
				// 		try {
				// 			if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
				// 				self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
				// 				self.getApp().getRouter().navigate("login");
				// 			} else {
				// 				self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
				// 			}
				// 		}
				// 		catch (err) {
				// 			self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
				// 		}
				// 	}
				// });

			});
		},
		renderAttachment: function () {
			var self = this;
			self.$el.find('.link-taive-view div').each(function (indexhtml, itemhtml) {
				if (self.model.get($(itemhtml).attr('data-field')) != null) {

					$(self.$el.find('.custom-file-view')[indexhtml]).hide();
					self.model.get($(itemhtml).attr('data-field')).forEach(function (itemfield, indexfield) {
						self.$el.find(".taive-" + $(itemhtml).attr('data-field')).append(`
						<label>&nbsp;&nbsp;&nbsp;&nbsp;${itemfield.slice(16)}</label><a href="${itemfield}"> Tải về </a><br>
						`)
					})
				}
			})
		},

		inputFileOnChange: function () {
			var self = this;
			var arrInputFile = [];
			self.$el.find(".upload_files").change(function () {

				const promise = new Promise((resolve, reject) => {
					var arrAttachment = [];

					var data_attr = $(this).attr("data-attr");
					self.$el.find(".tenfile-" + data_attr).append(`
						<label class = 'mt-2'>Danh sách tài liệu</label><br>
					`)
					self.$el.find(".tenfile-" + data_attr).find('label,br').remove()
					for (var i = 0; i < $(this).get(0).files.length; ++i) {
						self.$el.find(".tenfile-" + data_attr).append(`
						<label>&nbsp;&nbsp;&nbsp;&nbsp;${$(this).get(0).files[i].name}</label><br>
					`)
						arrAttachment.push($(this).get(0).files[i]);
					}
					self.$el.find('.label_list_files-' + data_attr).text("Bạn vừa chọn " + arrAttachment.length + " tài liệu")
					arrInputFile.push({ arrAttachment, data_attr })
					return resolve(arrInputFile)
				})
				promise.then((arr) => {
					self.bindEventGD(arr)
				});
			});
		},

		saveAttachment: function (arrAttachment, data_attr) {
			var self = this;
			var arrLinkAttachment = [];
			arrAttachment.forEach(function (item, index) {
				var http = new XMLHttpRequest();
				var fd = new FormData();
				fd.append('file', item);
				http.open('POST', '/api/v1/upload/file');
				http.upload.addEventListener('progress', function (evt) {
					if (evt.lengthComputable) {
						var percent = evt.loaded / evt.total;
						percent = parseInt(percent * 100);
					}
				}, false);
				http.addEventListener('error', function () {
				}, false);
				http.onreadystatechange = function () {
					if (http.status === 200) {
						if (http.readyState === 4) {
							var data_file = JSON.parse(http.responseText), link, p, t;
							arrLinkAttachment.push(String(data_file.link))
							if (arrAttachment.length == index + 1) {
								self.model.set(data_attr, arrLinkAttachment)
								self.model.save(null, {
									success: function (model, response, options) {
										self.getApp().router.refresh();
									},
									error: function (xhr, status, error) {
										try {
											if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
												self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
												self.getApp().getRouter().navigate("login");
											} else {
												self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
											}
										}
										catch (err) {
											self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
										}
									}
								});

							}
						}
					} else {
						self.getApp().notify("Không thể tải tệp tin lên máy chủ");
					}
				};
				http.send(fd);
			})

		},
		saveModel: function (files) {
			var self = this;
			var kiemTraKetThucThanhTra = self.model.get("trangthai");
			if (kiemTraKetThucThanhTra != "end_checked") {
				self.model.save(null, {
					success: function (model, response, options) {
						self.getApp().notify("Lưu thông tin thành công");
						self.getApp().router.refresh();
					},
					error: function (xhr, status, error) {
						try {
							if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
								self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
								self.getApp().getRouter().navigate("login");
							} else {
								self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
							}
						}
						catch (err) {
							self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
						}
					}
				});
			}
			else {
				self.getApp().notify({ message: "Đã kết thúc thanh tra" }, { type: "danger", delay: 1000 });
			}
		},


		GetNguoiGiamSat: function () {
			var self = this;
			var dsThanhVienThanhTra = self.model.get("danhsach_thanhvien");
			if (dsThanhVienThanhTra !== null && dsThanhVienThanhTra !== []) {
				for (var i = 0; i < dsThanhVienThanhTra.length; i++) {
					var item = dsThanhVienThanhTra[i];
					var data_str = encodeURIComponent(JSON.stringify(item));
					var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.hoten)
					self.$el.find("#select_nguoigiamsat").append(option_elm);
				}
			}
			var maNguoiGiamSat = self.model.get("manguoigiamsat");
			self.$el.find("#select_nguoigiamsat").selectpicker('val', maNguoiGiamSat);
		},

		renderMember_GD1: function (data) {
			var self = this;
			self.$el.find("#header_del_member").removeClass("d-none");
			var memberView = new ThanhVienThanhTraItemView();
			if (!!data) {
				memberView.model.set(JSON.parse(JSON.stringify(data)));
			}

			memberView.render();
			self.$el.find("#danhsach_thanhvien").append(memberView.$el);
			memberView.on("change", function (event) {
				var ds_member = self.model.get("danhsach_thanhvien");
				if (ds_member === null) {
					ds_member = [];
					ds_member.push(event.data)
				}
				for (var i = 0; i < ds_member.length; i++) {
					if (ds_member[i].id === event.oldData.id) {
						ds_member[i] = event.data;
						break;
					}
				}
				self.model.set("danhsach_thanhvien", ds_member);
				self.applyBinding("danhsach_thanhvien");
			});
			memberView.$el.find("#del_member").unbind("click").bind("click", function () {
				var ds_member = self.model.get("danhsach_thanhvien");
				for (var i = 0; i < ds_member.length; i++) {
					if (ds_member[i].id === memberView.model.get("id")) {

						ds_member.splice(i, 1);
					}
				}
				self.model.set("danhsach_thanhvien", ds_member);
				self.applyBinding("danhsach_thanhvien");
				memberView.destroy();
				memberView.remove();
			});


		},
		bindEventGD1: function () {
			var self = this;
			self.$el.find(".btn-add-member").unbind('click').bind('click', function () {

				var data_default = { "id": gonrin.uuid(), "id_hoten": "", "hoten": "", "donvicongtac": null, "vaitro": null };
				var danhsach_thanhvien = self.model.get("danhsach_thanhvien");
				if (danhsach_thanhvien === null || danhsach_thanhvien.length === 0) {
					danhsach_thanhvien = [];
				}
				danhsach_thanhvien.push(data_default);
				self.model.set("danhsach_thanhvien", danhsach_thanhvien);
				self.applyBinding("danhsach_thanhvien");
				self.renderMember_GD1(data_default);
			});
		},
		// chonLinhVuc: function () {
		// 	var self = this;
		// 	$.ajax({
		// 		url: self.getApp().serviceURL + "/api/v1/danhmuclinhvuc?results_per_page=100000&max_results_per_page=1000000",
		// 		method: "GET",
		// 		contentType: "application/json",
		// 		success: function (data) {
		// 			data.objects.forEach(function (item, index) {
		// 				self.$el.find('.chonlinhvuc select').append(`
		// 				<option data-id="${item.id}">${item.tenlinhvuc}</option>
		// 			`)
		// 			})
		// 			self.$el.find('.chonlinhvuc select').selectpicker();
		// 			self.$el.find('.chonlinhvuc select').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
		// 				var arr = [];
		// 				self.$el.find(".chonlinhvuc div div div ul li").each(function (index, item) {
		// 					if ($(item).attr('class') == "selected") {
		// 						arr.push(data.objects[index])
		// 					}
		// 				})
		// 				self.model.set('danhsachlinhvuc_field', arr)
		// 			})
		// 		},
		// 		error: function (xhr, status, error) {
		// 			self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
		// 		},
		// 	});

		// },
		// hienThiLinhVucDaChon: function () {
		// 	var self = this;

		// 	const promise = new Promise((resolve, reject) => {
		// 		var arr = [];
		// 		self.model.get('danhsachlinhvuc_field').forEach(function (item, index) {
		// 			arr.push(item.tenlinhvuc)
		// 		})
		// 		return resolve(arr)
		// 	})
		// 	promise.then((data) => {
		// 		self.$el.find('.chonlinhvuc select').selectpicker('val', data)
		// 	});
		// 	self.model.set('danhsachlinhvuc_field', self.model.get('danhsachlinhvuc_field'))
		// },
		renderUpload() {
			var self = this;

			var keys = ["quyetdinh_thanhtra_attachment", "quyetdinh_trungcau_giamdinh_attachment"];
			$.each(keys, function (i, key) {
				var attr_value = self.model.get(key);
				var linkDownload = self.$el.find(".linkDownload");

				if (!!attr_value) {
					linkDownload[i].href = attr_value;
					self.$el.find("#upload-" + key).hide();
					self.$el.find("#download-" + key).show();
				} else {
					self.$el.find("#upload-" + key).show();
					self.$el.find("#download-" + key).hide();
				}
			})
		},
		updateUIPermission: function () {
			var self = this;
			var currentUser = self.getApp().currentUser;
			var trangthai = self.model.get("trangthai");
			if (currentUser.hasRole('ChuyenVien')) {
				self.$el.find('.card-header').show();
				if (trangthai !== null &&
					(trangthai === "new" || trangthai === "send_review_truongphong" ||
						trangthai === "cancel_reviewed_truongphong")) {
					self.$el.find("#btn_save").show();
					self.$el.find("#btn_review").show();
				} else {
					self.$el.find("#btn_save").hide();
					self.$el.find("#btn_review").hide();
				}
				if (trangthai === null || self.model.get("id") === null) {
					self.$el.find("#btn_save").show();
					self.$el.find("#btn_review").show();
				}

				self.$el.find("#btn_approve").hide();
				self.$el.find("#btn_cancel").hide();


			}
			if (currentUser.hasRole('TruongPhong')) {
				self.$el.find('.card-header').hide();
				self.$el.find("#btn_approve").hide();

				if (trangthai === "send_review_truongphong") {
					self.$el.find("#btn_review").show();
					self.$el.find("#btn_cancel").show();
					self.$el.find("#btn_save").show();

				} else if (trangthai === "cancel_reviewed_pct") {
					self.$el.find("#btn_review").show();
					self.$el.find("#btn_cancel").show();
					self.$el.find("#btn_save").show();
				} else if (trangthai === "send_review_pct") {
					self.$el.find("#btn_save").show();
					self.$el.find("#btn_cancel").hide();
					self.$el.find("#btn_review").hide();
				} else {
					self.$el.find("#btn_save").hide();
					self.$el.find("#btn_cancel").hide();
					self.$el.find("#btn_review").hide();
				}


			}
			if (currentUser.hasRole('PhoCucTruong')) {
				self.$el.find('.card-header').hide();
				self.$el.find("#btn_approve").hide();
				if (trangthai === "send_review_pct") {
					self.$el.find("#btn_review").show();
					self.$el.find("#btn_cancel").show();
					self.$el.find("#btn_save").show();

				} else if (trangthai === "cancel_approved") {
					self.$el.find("#btn_review").show();
					self.$el.find("#btn_cancel").show();
					self.$el.find("#btn_save").show();
				} else if (trangthai === "send_approved") {
					self.$el.find("#btn_save").show();
					self.$el.find("#btn_cancel").hide();
					self.$el.find("#btn_review").hide();
				} else {
					self.$el.find("#btn_save").hide();
					self.$el.find("#btn_cancel").hide();
					self.$el.find("#btn_review").hide();
				}





			}
			if (currentUser.hasRole('CucTruong')) {
				self.$el.find('.card-header').hide();
				if (trangthai === "send_approved") {
					self.$el.find("#btn_approve").show();
					self.$el.find("#btn_review").hide();
					self.$el.find("#btn_cancel").show();
					self.$el.find("#btn_save").show();

				} else if (trangthai === "approved") {
					self.$el.find("#btn_approve").hide();
					self.$el.find("#btn_review").hide();
					self.$el.find("#btn_cancel").hide();
					self.$el.find("#btn_save").show();
				} else {
					self.$el.find("#btn_approve").hide();
					self.$el.find("#btn_save").hide();
					self.$el.find("#btn_cancel").hide();
					self.$el.find("#btn_review").hide();
				}
			}

			if (trangthai !== null) {
				if (trangthai === "result_checked" ||
					trangthai === "checked" ||
					trangthai === "approved") {
					self.$el.find("#btn_approve").hide();
					self.$el.find("#btn_review").hide();
					self.$el.find("#btn_cancel").hide();
					self.$el.find("#btn_save").show();
				} else if (trangthai === "completed") {
					self.$el.find("#btn_save").hide();
					self.$el.find("#btn_approve").hide();
					self.$el.find("#btn_review").hide();
					self.$el.find("#btn_cancel").hide();

				}
			}

		},
		getDoanhNghiep: function () {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep",
				method: "GET",
				data: { "data": JSON.stringify({ "order_by": [{ "field": "name", "direction": "desc" }], "page": 1, "results_per_page": 10000 }) },
				contentType: "application/json",
				success: function (data) {
					self.$el.find("#multiselect_donvidoanhnghiep").html("");
					for (var i = 0; i < data.objects.length; i++) {
						var item = data.objects[i];
						var data_str = encodeURIComponent(JSON.stringify(item));
						var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.name)
						self.$el.find("#multiselect_donvidoanhnghiep").append(option_elm);
					}
					var madoanhnghiep = self.model.get("madoanhnghiep");
					self.$el.find("#multiselect_donvidoanhnghiep").selectpicker('val', madoanhnghiep);

				},
				error: function (xhr, status, error) {
					try {
						if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
							self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
							self.getApp().getRouter().navigate("login");
						} else {
							self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
						}
					} catch (err) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					}
				}
			});
		},
		bindEventSelect: function () {
			var self = this;
			self.$el.find(".upload_files").on("change", function () {
				var mdel = self.model.get("taokehoach_attachment");
				self.$el.find(".hienthilink").html(mdel);
				var http = new XMLHttpRequest();
				var fd = new FormData();

				var data_attr = $(this).attr("data-attr");
				fd.append('file', this.files[0]);
				http.open('POST', '/api/v1/upload/file');
				http.upload.addEventListener('progress', function (evt) {
					if (evt.lengthComputable) {
						var percent = evt.loaded / evt.total;
						percent = parseInt(percent * 100);

					}
				}, false);
				http.addEventListener('error', function () {
				}, false);

				http.onreadystatechange = function () {
					if (http.status === 200) {
						if (http.readyState === 4) {
							var data_file = JSON.parse(http.responseText), link, p, t;
							self.getApp().notify("Tải file thành công");

							self.model.set(data_attr, data_file.link);
							var mdel = self.model.get("taokehoach_attachment");
							self.$el.find(".upload-taokehoach_attachment").hide();

							self.$el.find(".hienthilink").html(mdel);

						}
					} else {
						self.getApp().notify("Không thể tải tệp tin lên máy chủ");
					}
				};
				http.send(fd);
			});

			self.$el.find('#multiselect_donvidoanhnghiep').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
				var data_ck = self.$el.find('#multiselect_donvidoanhnghiep option:selected').attr('data-ck');

				if (data_ck !== undefined && data_ck !== null) {
					var my_object = JSON.parse(decodeURIComponent(data_ck));
					if (my_object !== null) {
						self.model.set("danhmucdoanhnghiep_id", my_object.id);
					}
				}
			});
			self.$el.find("#btn_save").unbind("click").bind("click", function () {

				self.model.save(null, {
					success: function (model, response, options) {
						self.updateUITimeline(self.model.toJSON());
						self.updateUIPermission();
						self.getApp().notify("Lưu thông tin thành công");

					},
					error: function (xhr, status, error) {
						try {
							if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
								self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
								self.getApp().getRouter().navigate("login");
							} else {
								self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
							}
						}
						catch (err) {
							// self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
						}
					}
				});

			});
			self.$el.find("#btn_review").unbind("click").bind("click", function () {
				self.model.set('lydotuchoi', null);
				self.confirm_kehoach();
				self.getApp().getRouter().refresh();
			});
			self.$el.find("#btn_approve").unbind("click").bind("click", function () {
				var d = new Date();
				var param = {
					"solanthanhtra"  : self.model.get('danhmucdoanhnghiep').solanthanhtra+1 ,
					"namchuathanhtraganday" : d.getFullYear()
				};
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep/" + self.model.get('danhmucdoanhnghiep_id'),
					type: 'PUT',
					data: JSON.stringify(param),
					headers: {
						'content-type': 'application/json'
					},
					dataType: 'json',
					success: function (data) {
					},
					error: function (request, textStatus, errorThrown) {
					}
				})
				self.model.set('lydotuchoi', null);
				self.confirm_kehoach();
				self.getApp().getRouter().refresh();
			});
			self.$el.find("#btn_cancel").unbind("click").bind("click", function () {
				self.cancel_kehoach();
				self.getApp().getRouter().refresh();
			});


		},
		saveModel: function () {
			var self = this;

			self.model.save(null, {
				success: function (model, response, options) {
					self.getApp().notify("Lưu thông tin thành công");
					self.getApp().router.refresh();
				},
				error: function (xhr, status, error) {
					try {
						if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
							self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
							self.getApp().getRouter().navigate("login");
						} else {
							self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
						}
					}
					catch (err) {
						// self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
					}
				}
			});
		},
		render_list_file: function (data_file, self) {
			var li_el = $('<li>').attr({ "id": data_file.id }).html(data_file.filename_organization + data_file.extname);
			self.$el.find(".list_file").append(li_el);
			var span_el = $('<span>').attr({ "class": "close" }).html("X");
			li_el.append(span_el);
			span_el.unbind('click').bind('click', { "data": data_file.id }, function (e) {
				var id = e.data.data;
				var tailieulienquan = self.model.get("tailieulienquan");
				if (tailieulienquan === null) {
					tailieulienquan = [];
				}
				for (var i = 0; i < tailieulienquan.length; i++) {
					if (tailieulienquan[i].id === id) {
						tailieulienquan.splice(i, 1);
						break;
					}
				}
				self.$el.find("#" + id).hide();
				self.model.set("tailieulienquan", tailieulienquan);
			});
		},
		confirm_kehoach: function () {
			var self = this;
			var id = self.model.get("id");
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra/confirm",
				method: "POST",
				data: JSON.stringify({ "id": id }),
				contentType: "application/json",
				success: function (data) {
					if (data !== null) {
						self.model.set(data);
						self.updateUITimeline(data);
						self.getApp().notify("Xác nhận thành công!");
						return;
					}
				},
				error: function (xhr, status, error) {
					try {
						if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
							self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
							self.getApp().getRouter().navigate("login");
						} else {
							self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
						}
					} catch (err) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					}
				}
			});
		},
		cancel_kehoach: function () {
			var self = this;
			var id = self.model.get("id");
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra/cancel",
				method: "POST",
				data: JSON.stringify({ "id": id }),
				contentType: "application/json",
				success: function (data) {
					if (data !== null) {
						self.model.set(data);
						self.updateUITimeline(data);
						self.getApp().notify("Từ chối xét duyệt thành công!");
						return;
					}
				},
				error: function (xhr, status, error) {
					try {
						if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
							self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
							self.getApp().getRouter().navigate("login");
						} else {
							self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
						}
					} catch (err) {
						self.getApp().notify({ message: "Có lỗi xảy ra, vui lòng thử lại sau" }, { type: "danger", delay: 1000 });
					}
				}
			});


		},
		updateUITimeline: function (data) {
			var self = this;
			var el_status_new = self.$el.find("#timeline .kehoach_new");
			el_status_new.addClass("complete");
			el_status_new.find('.author').html(data.username_nguoisoanthao || "&nbsp;");
			var template_helper = new TemplateHelper();
			var ngaysoanthao = template_helper.datetimeFormat(data.ngaysoanthao, "DD/MM/YYYY");
			el_status_new.find('.date').html(ngaysoanthao || "&nbsp;");
			var arr_timeline_capphong = ["send_review_pct", "cancel_reviewed_pct", "send_approved", "approved", "cancel_approved", "checked"]
			if (data.trangthai != "new" && data.trangthai != "send_review_truongphong" &&
				data.trangthai != "cancel_reviewed_truongphong") {
				var el_status_capphong = self.$el.find("#timeline .kehoach_send_review_capphong");
				el_status_capphong.addClass("complete");
				el_status_capphong.find('.author').html(data.username_phongduyet || "&nbsp;");
				var template_helper = new TemplateHelper();
				var ngaypheduyet_phong = template_helper.datetimeFormat(data.ngaypheduyet_phong, "DD/MM/YYYY");
				el_status_capphong.find('.date').html(ngaypheduyet_phong || "&nbsp;");
			}
			var arr_timeline_PhoCucTruong = ["completed", "result_checked", "checked", "cancel_approved", "approved", "send_approved"]
			if (arr_timeline_PhoCucTruong.indexOf(data.trangthai) >= 0) {
				var el_status_PhoCucTruong = self.$el.find("#timeline .kehoach_send_review_pct");
				el_status_PhoCucTruong.addClass("complete");
				el_status_PhoCucTruong.find('.author').html(data.username_pctduyet || "&nbsp;");
				var template_helper = new TemplateHelper();
				var ngaypheduyet_PhoCucTruong = template_helper.datetimeFormat(data.ngaypheduyet_pct, "DD/MM/YYYY");
				el_status_PhoCucTruong.find('.date').html(ngaypheduyet_PhoCucTruong || "&nbsp;");
				self.$el.find(".ngayketthuc").removeClass("d-none");
			}
			var arr_timeline_cuctruong = ["completed", "result_checked", "checked", "approved"]
			if (arr_timeline_cuctruong.indexOf(data.trangthai) >= 0) {
				var el_status_cuctruong = self.$el.find("#timeline .kechoach_approved");
				el_status_cuctruong.addClass("complete");
				el_status_cuctruong.find('.author').html(data.username_quyetdinh || "&nbsp;");
				var template_helper = new TemplateHelper();
				var ngaypheduyet_quyetdinh = template_helper.datetimeFormat(data.ngaypheduyet_quyetdinh, "DD/MM/YYYY");
				el_status_cuctruong.find('.date').html(ngaypheduyet_quyetdinh || "&nbsp;");
				self.$el.find(".ngayketthuc").removeClass("d-none");
			}
			var arr_timeline_checked = ["completed", "result_checked", "checked"]
			if (arr_timeline_checked.indexOf(data.trangthai) >= 0) {
				var el_status_checked = self.$el.find("#timeline .kechoach_checked");
				el_status_checked.addClass("complete");
				el_status_checked.find('.author').html('&nbsp;');
				var template_helper = new TemplateHelper();
				var ngaythanhtra = template_helper.datetimeFormat(data.ngaythanhtra, "DD/MM/YYYY");
				el_status_checked.find('.date').html(ngaythanhtra || "&nbsp;");
				self.$el.find(".ngayketthuc").removeClass("d-none");
			}
			var arr_timeline_completed = ["completed", "result_checked"]
			if (arr_timeline_completed.indexOf(data.trangthai) >= 0) {
				var el_status_completed = self.$el.find("#timeline .kechoach_completed");
				el_status_completed.addClass("complete");
				el_status_completed.find('.author').html('&nbsp;');
				var template_helper = new TemplateHelper();
				var ngayketthuc = template_helper.datetimeFormat(data.ngayketthuc, "DD/MM/YYYY");
				el_status_completed.find('.date').html(ngayketthuc || "&nbsp;");
				self.$el.find(".ngayketthuc").removeClass("d-none");
			}
			var arr_timeline_completed = ["end_checked", "result_checked"]
			if (arr_timeline_completed.indexOf(data.trangthai) >= 0) {
				var el_status_completed = self.$el.find("#timeline .kechoach_completed");
				self.$el.find("#timeline .kechoach_approved").addClass("complete");
				self.$el.find("#timeline .kechoach_checked").addClass("complete");
				self.$el.find("#timeline .kehoach_send_review_pct").addClass("complete");

				el_status_completed.addClass("theend text-danger");
				el_status_completed.find('.author').html('&nbsp;');
				var template_helper = new TemplateHelper();
				var ngayketthuc = template_helper.datetimeFormat(data.ngayketthuc, "DD/MM/YYYY");
				el_status_completed.find('.date').html(ngayketthuc || "&nbsp;");
				self.$el.find(".ngayketthuc").removeClass("d-none");
			}
		},
		validatePhone: function (inputPhone) {
			if (inputPhone == null || inputPhone == undefined) {
				return false;
			}
			var phoneno = /^0([1-9]{1})([0-9]{8})$/;
			const result = inputPhone.match(phoneno);
			if (result !== null && result.indexOf(inputPhone) >= 0) {
				return true;
			} else {
				return false;
			}
		}
	});

});