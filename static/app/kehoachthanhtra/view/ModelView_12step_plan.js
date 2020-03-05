define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/kehoachthanhtra/tpl/model12step.html'),
		schema = require('json!schema/KeHoachThanhTraSchema.json');
	var TinhThanhSelectView = require('app/DanhMuc/TinhThanh/view/SelectView');
	var TemplateHelper = require('app/base/view/TemplateHelper');
	var ThanhVienThanhTraItemView = require('app/kehoachthanhtra/thanhvienthanhtra/ThanhVienThanhTraItem');
	var CongViecThanhTraItemView = require('app/kehoachthanhtra/congviecthanhtra/CongViecThanhTraItemView');
	var CongViecThanhTraThucHienItemView = require('app/kehoachthanhtra/congviecthanhtra/CongViecThanhTraThucHienItemView');
	var BaoCaoCuaDoanThanhTraItemView = require('app/kehoachthanhtra/view/BaoCaoCuaDoanThanhTraView');
	var VanBanDuThaoItemView = require('app/kehoachthanhtra/view/VanBanDuThaoView');
	var CongVanBaoCaoItemView = require('app/kehoachthanhtra/view/CongVanBaoCaoView');


	return Gonrin.ModelView.extend({
		template: template,
		urlPrefix: "/api/v1/",
		modelSchema: schema,
		collectionName: "kehoachthanhtra",
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
							var currentUser = this.getApp().currentUser;
							if (currentUser === null) {
								return false;
							}
							return this.getApp().currentUser.hasRole("Admin") || this.getApp().currentUser.hasRole("CoSoKCB");
						}
					},
					{
						name: "delete",
						type: "button",
						buttonClass: "btn-danger btn-sm",
						label: "TRANSLATE:DELETE",
						visible: function () {
							var currentUser = this.getApp().currentUser;
							if (currentUser === null) {
								return false;
							}
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
					field: "ngaythanhtra",
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
					field: "codauhieu_hinhsu",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					cssClass: "form-control",
					dataSource: [
						{ value: "co", text: "Có" },
						{ value: "khong", text: "Không" },
					],
				},
				{
					field: "duyet",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					cssClass: "form-control",
					dataSource: [
						{ value: "co", text: "Có" },
						{ value: "khong", text: "Không" },
					],
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
					field: "ngayduyetvanban",
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
					field: "ngay_vanban_kehoach",
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
					field: "ngay_congvan_yeucau_doituong_baocao",
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
					field: "ngay_vanban_doituong_baocao",
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
					field: "ngay_congvan_ketthuc_thanhtra",
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
					field: "ngay_ketluan_thanhtra",
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
					field: "ngay_bienban_congbo_ketluan",
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
					field: "ngay_congkhai_ketluan_tai_doituong",
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
					field: "ngay_congkhai_ketluan_internet",
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
					field: "ngay_lapbienban_hanhchinh",
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
					field: "ngay_bienban_xuphat",
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
					field: "ngay_thongbao_ketthuc_thanhtra",
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
					field: "ngay_vanban_doituong_giaitrinh",
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
					field: "ngay_vanban_thongbao_doituong_thanhtra",
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
					field: "ngay_vanban_thongbao_doituong_thanhtra",
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
					field: "ngay_gui_congvan_giaitrinh",
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
					field: "ngay_vanban_congbo_quyetdinh",
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
					field: "ngay_duthao_vanban_lan1",
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
					field: "ngay_duthao_vanban_lan2",
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
					field: "ngay_vanban_thamkhao_ykien",
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
					field: "ngay_lapbienban_xuphat",
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
					field: "ngay_quyetdinh_ketluanthanhtra",
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
					field: "ngay_congkhai_link_ketluanthanhtra",
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
					field: "ngay_congkhai_doituong_ketluanthanhtra",
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
					field: "ngay_bangiao_luutru",
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
					field: "ngay_congvan_yeucau_baocao_thuchien",
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
					field: "ngay_ketqua_trungcau_ykien",
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
					field: "ngay_baocao_doituong_thuchien",
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

				// {
				// 	field: "danhsach_congviec_thanhtra",
				// 	uicontrol: false,
				// 	itemView: CongViecThanhTraItemView,
				// 	tools: [
				// 		{
				// 			name: "create",
				// 			type: "button",
				// 			buttonClass: "btn btn-primary",
				// 			label: "Thêm hạng mục",
				// 			command: "create"
				// 		},
				// 	],
				// 	toolEl: "#btn-add-task-gd3"
				// },
				// {
				// 	field: "danhsach_thanhvien",
				// 	uicontrol: false,
				// 	itemView: ThanhVienThanhTraItemView,
				// 	tools: [
				// 		{
				// 			name: "create",
				// 			type: "button",
				// 			buttonClass: "btn btn-primary",
				// 			label: "Thêm hạng mục",
				// 			command: "create"
				// 		},
				// 	],
				// 	toolEl: "#btn-add-member"
				// },
				{
					field: "danhsach_congviec_thuchien",
					uicontrol: false,
					itemView: CongViecThanhTraThucHienItemView,


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
						{ value: "completed", text: "Hoàn thành" }
					],
				},
			]
		},
		render: function () {
			var self = this;

			self.getDoanhNghiep();
			self.bindEventSelect();


			var id = this.getApp().getRouter().getParam("id");
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						self.$el.find('#tendoanhnghiep').val(self.model.get('danhmucdoanhnghiep').name)
						self.baoCaoCuaDoanThanhTra();
						self.vanBanDuThao();
						self.congVanBaoCaoCao();
						var duyetHayKhong = self.model.get("vanbanduthaofield")
						var demduyet = 0;

						duyetHayKhong.forEach(function (item, index) {
							if (item.trangthai_vanban == 1) {
								demduyet++;
							}
						})
						if (demduyet == 0) {
							self.$el.find(".nguoiduyet").hide();
							self.$el.find("#btn_add_vanbanduthaofield").show();


						}
						else {
							self.$el.find(".nguoiduyet").show();
							self.$el.find("#btn_add_vanbanduthaofield").hide();

						}

						var arr1 = self.$el.find(".solan")
						arr1.each(function (item, index) {
							index.append(item + 1);
						})
						var arr3 = self.$el.find(".solanx")
						arr3.each(function (item, index) {
							index.append(item + 1);
						})
						var arr2 = self.$el.find(".solann")
						arr2.each(function (item, index) {
							index.append(item + 1);
						})
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
						for (var i = 0; i < danhsachfile.length; i++) {
							self.render_list_file(danhsachfile[i], self);
						}
						var danhsach_thanhvien = self.model.get("danhsach_thanhvien");
						if (danhsach_thanhvien === null) {
							self.model.set("danhsach_thanhvien", []);
						}
						$.each(danhsach_thanhvien, function (idx, value) {

							self.renderMember_GD1(value);
						});


						var danhsach_congviec_thanhtra = self.model.get("danhsach_congviec_thanhtra");
						if (danhsach_congviec_thanhtra === null) {
							self.model.set("danhsach_congviec_thanhtra", []);
						}
						$.each(danhsach_congviec_thanhtra, function (idx, value) {

							self.renderCongViec_GD3(value);
						});

						//danh sach conviec theo doi
						if (self.model.get("danhsach_congviec_thuchien") === null) {
							self.model.set("danhsach_congviec_thuchien", []);
						}

						if (self.model.get("danhsach_congviec_thanhtra") === null) {
							self.model.set("danhsach_congviec_thanhtra", []);
						}
						var danhsach_congviec_thanhtra = self.model.get("danhsach_congviec_thanhtra");
						var danhsach_congviec_thuchien = self.model.get("danhsach_congviec_thuchien");
						for (var i = 0; i < danhsach_congviec_thanhtra.length; i++) {
							var found = false;
							for (var j = 0; j < danhsach_congviec_thuchien.length; j++) {
								found = true;
								if (danhsach_congviec_thanhtra[i].id === danhsach_congviec_thuchien[j].id) {
									danhsach_congviec_thuchien[j].hangmuccongviec = danhsach_congviec_thanhtra[i].hangmuccongviec;
									danhsach_congviec_thuchien[j].nguoiduocphancong = danhsach_congviec_thanhtra[i].nguoiduocphancong;
									break;
								}
							};
							if (!found) {
								danhsach_congviec_thuchien.push($.parseJSON(JSON.stringify(danhsach_congviec_thanhtra[i])));
							}
						};

						self.model.set("danhsach_congviec_thuchien", danhsach_congviec_thanhtra);

						self.danhkhoitao();
						self.inputFileOnChange();
						self.applyBindings();
						self.LapBienBan();
						self.ketthuc_thanhtra();
						self.thanhtra_trolai();
						self.updateStepStatus();
						self.GetNguoiGiamSat();
						self.GetNguoiSoanThao();
						self.GetNguoiXemXet();
						self.GetNguoiPheDuyet();
						self.checkAllSucees();
						self.coDauHieuHinhSu();
						self.checkHinhSuDeAnHien();
						self.renderAttachmentBuoc8();
						self.danhSachTaiLieu14Buoc();
						self.renderAttachment();
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

				self.applyBindings();
				self.bindEventGD1();
			}


		},
		renderAttachmentBuoc8: function () {
			var self = this;


			var filters = {
				filters: {
					"$and": [
						{ "id": { "$eq": window.location.hash.slice(36) } }
					]
				},
				order_by: [{ "field": "created_at", "direction": "asc" }]
			}
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				data: "q=" + JSON.stringify(filters),
				contentType: "application/json",
				success: function (data) {
					if (data.objects[0].danhsach_congviec_thanhtra != null) {
						if (data.objects[0].danhsach_congviec_thanhtra.length != 0) {

							self.$el.find('.taive-tailieu-B8').each(function (index, item) {
								data.objects[0].danhsach_congviec_thanhtra.forEach(function (itemfield, indexfield) {
									if ($(item).attr('data-id') == itemfield.id && itemfield.tailieu != null) {
										$(self.$el.find('.custom-file-congviec')[index]).hide();
										// $(item).append(`
										// 	<label class = 'mt-2'>Danh sách tài liệu</label><br>
										// `)
										itemfield.tailieu.forEach(function (itemtailieu, indextailieu) {
											$(item).append(`
										<div  class = "row ">
										<label class = "col-md-9" >&nbsp;&nbsp;&nbsp;&nbsp;${itemtailieu.slice(16)}</label>
										<div  class = "col-md-3">
										<a href="${itemtailieu}"> Tải về </a>
										</div>
										</div>
									`)
										})
									}
								});
							})
						}
					}

				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});
		},
		checkHinhSuDeAnHien: function () {
			var self = this;
			self.model.on('change:codauhieu_hinhsu', function () {
				if (self.model.get('codauhieu_hinhsu') == "co") {
					self.$el.find('.showbienbanhinhsu').show();
				}
				else {
					self.$el.find('.showbienbanhinhsu').hide();
				}
			})
			if (self.model.get('codauhieu_hinhsu') == "co") {
				self.$el.find('.showbienbanhinhsu').show();
			}
		},

		checkAllSucees: function () {
			var self = this;
			var dem = 0;
			if (self.check_gd1_sucees() === "success") {
				dem++;
			}
			if (self.check_gd2_sucees() === "success") {
				dem++;
			}
			if (self.check_gd3_sucees() === "success") {
				dem++;
			}
			if (self.check_gd4_sucees() === "success") {
				dem++;
			}
			if (self.check_gd5_sucees() === "success") {
				dem++;
			}
			if (self.check_gd6_sucees() === "success") {
				dem++;
			}
			if (self.check_gd7_sucees() === "success") {
				dem++;
			}
			if (self.check_gd8_sucees() === "success") {
				dem++;
			} if (self.check_gd9_sucees() === "success") {
				dem++;
			}

			if (self.check_gd10_sucees() === "success") {
				dem++;
			}
			if (self.check_gd11_sucees() === "success") {
				dem++;
			}
			if (self.check_gd12_sucees() === "success") {
				dem++;
			}
			if (self.check_gd13_sucees() === "success") {
				dem++;
			}
			// if (self.check_gd14_sucees() === "success") {
			// 	dem++;
			// }

			if (dem == 13) {
				self.$el.find(".btn-save-gd14").unbind("click").bind("click", function () {
					self.model.set("trangthai", "completed")
					self.model.save(null, {
						success: function (model, response, options) {
							self.getApp().notify("Đã hoàn thành thanh tra");
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
								self.getApp().notify({ message: "kêt thúc thanh tra không thành công" }, { type: "danger", delay: 1000 });
							}
						}
					});
				})

			}
			var x = self.model.get('trangthai');
			if (x == "completed") {
				self.$el.find('.btn-save').hide();
				self.$el.find('.btn-end-exit').hide();

				self.$el.find('.upload_files').hide();
				self.$el.find('.notify-sucssec').show();
			}

		},
		// New Get người giám sát
		GetNguoiGiamSat: function () {
			var self = this;
			var dsThanhVienThanhTra = self.model.get("danhsach_thanhvien");
			for (var i = 0; i < dsThanhVienThanhTra.length; i++) {
				var item = dsThanhVienThanhTra[i];
				var data_str = encodeURIComponent(JSON.stringify(item));
				var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.hoten)
				self.$el.find("#select_nguoigiamsat").append(option_elm);
			}
			var maNguoiGiamSat = self.model.get("manguoigiamsat");
			self.$el.find("#select_nguoigiamsat").selectpicker('val', maNguoiGiamSat);
		},
		// END New Get người giám sát


		// New Get người soạn thảo
		GetNguoiSoanThao: function () {
			var self = this;
			var dsThanhVienThanhTra = self.model.get("danhsach_thanhvien");
			for (var i = 0; i < dsThanhVienThanhTra.length; i++) {
				var item = dsThanhVienThanhTra[i];
				var data_str = encodeURIComponent(JSON.stringify(item));
				var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.hoten)
				self.$el.find("#select_nguoisoanthao").append(option_elm);
			}
			var maNguoiSoanThao = self.model.get("manguoisoanthao");
			self.$el.find("#select_nguoisoanthao").selectpicker('val', maNguoiSoanThao);
			// self.$el.find("#vaitro_nguoisoanthao").val(vaitronguoisoanthao);
		},
		// END New  Get người soạn thảo


		// New Get người xem xet
		GetNguoiXemXet: function () {
			var self = this;
			var dsThanhVienThanhTra = self.model.get("danhsach_thanhvien");
			for (var i = 0; i < dsThanhVienThanhTra.length; i++) {
				var item = dsThanhVienThanhTra[i];
				var data_str = encodeURIComponent(JSON.stringify(item));
				var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.hoten)
				self.$el.find("#select_nguoixemxet").append(option_elm);
			}
			var maNguoiXemXet = self.model.get("manguoixemxet");
			self.$el.find("#select_nguoixemxet").selectpicker('val', maNguoiXemXet);
		},
		// END New  Get người xem xet






		// New Get người phê duyêt
		GetNguoiPheDuyet: function () {
			var self = this;
			var dsThanhVienThanhTra = self.model.get("danhsach_thanhvien");
			for (var i = 0; i < dsThanhVienThanhTra.length; i++) {
				var item = dsThanhVienThanhTra[i];
				var data_str = encodeURIComponent(JSON.stringify(item));
				var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.hoten)
				self.$el.find("#select_nguoipheduyet").append(option_elm);
			}
			var maNguoiPheDuyet = self.model.get("manguoipheduyet");
			self.$el.find("#select_nguoipheduyet").selectpicker('val', maNguoiPheDuyet);
		},


		LapBienBan: function () {
			var self = this;

			self.$el.find(".lap_bien_ban_xuphat").each(function (index, item) {
				$(item).unbind('click').bind('click', function (param) {
					self.model.set("vitriannutxuphat", index)
					$(self.$el.find(".QuyetDinhXuPhat")[index]).toggle();
				})
			})
			if (self.model.get('vitriannutxuphat') != null) {
				self.$el.find(".lap_bien_ban_xuphat").each(function (index, item) {
					$(item).hide();
				})
				self.$el.find(".QuyetDinhXuPhat").each(function (index, item) {
					if (index != self.model.get('vitriannutxuphat')) {
						$(item).remove();
					} else {
						$(item).show();
					}
				})
			}
		},
		ketthuc_thanhtra: function () {
			var self = this;
			var btnSave = self.$el.find(".btn-save")
			var btnYesKetThuc = self.$el.find("#yes-ketthuc")
			var btnNoKetThuc = self.$el.find("#no-ketthuc")
			var thongbaoketthuc = self.$el.find(".notify-ketthuc-thanhtra")


			self.$el.find(".btn-end-exit").unbind('click').bind('click', function () {
				var kiemTraKetThucThanhTra = self.model.get("trangthai");
				if (kiemTraKetThucThanhTra != "end_checked") {
					self.$el.find(".content_14step").css("opacity", "0.33333")
					thongbaoketthuc.show();
					btnYesKetThuc.unbind('click').bind('click', function () {
						thongbaoketthuc.hide();
						self.$el.find(".content_14step").css("opacity", "1")
						self.model.set("trangthai", "end_checked")
						self.model.save(null, {
							success: function (model, response, options) {
								self.getApp().notify("Đã kết thúc thanh tra");
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
									self.getApp().notify({ message: "kêt thúc thanh tra không thành công" }, { type: "danger", delay: 1000 });
								}
							}
						});
						Backbone.history.history.back();
					});
					btnNoKetThuc.unbind('click').bind('click', function () {
						thongbaoketthuc.hide();
						self.$el.find(".content_14step").css("opacity", "1");

					})
				}

				else {
					self.getApp().notify("Đã kết thúc thanh tra");
					self.getApp().router.refresh();

				}
			})

			var ketThucThanhTraTrangThai = self.model.get("trangthai");

			if (ketThucThanhTraTrangThai === "end_checked" || ketThucThanhTraTrangThai === "completed") {
				self.$el.find(".btn_ketthuchoanthanh").hide();
				self.$el.find(".btn-them").hide();
				btnSave.each(function () {
					btnSave.hide();


				})
			}
			if (ketThucThanhTraTrangThai === "end_checked") {
				self.$el.find(".notify-end").attr("style", "display:block");
			}
		},
		thanhtra_trolai: function () {
			var self = this;
			var currentUser = self.getApp().currentUser;
			var ketThucThanhTraTrangThai = self.model.get("trangthai");
			if (ketThucThanhTraTrangThai !== "end_checked") {
				self.$el.find(".btn-back-continued").hide();
			}

			if (!!currentUser && currentUser.hasRole("ChuyenVien")) {
				self.$el.find(".btn-back-continued").hide();

			}
			if (!!currentUser && currentUser.hasRole("TruongPhong")) {
				self.$el.find(".btn-back-continued").hide();
			}

			if (!!currentUser && currentUser.hasRole("CucTruong")) {
				self.$el.find(".btn-back-continued").unbind('click').bind('click', function () {
					self.model.set("trangthai", "approved")
					self.model.save(null, {
						success: function (model, response, options) {
							self.getApp().notify("Thanh tra trở lại");
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

				});
			}
			if (!!currentUser && currentUser.hasRole("PhoCucTruong")) {
				self.$el.find(".btn-back-continued").unbind('click').bind('click', function () {
					self.model.set("trangthai", "approved")
					self.model.save(null, {
						success: function (model, response, options) {
							self.getApp().notify("Thanh tra trở lại");
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
				});
			}



		},

		coDauHieuHinhSu: function () {
			self = this;
			var coDauHieuHinhSu = self.model.get("codauhieu_hinhsu");
			var kiemTraKetThucThanhTra = self.model.get("trangthai");
			if (kiemTraKetThucThanhTra != "end_checked" && coDauHieuHinhSu === "co") {

				self.$el.find(".btn-end-exit").click();
			}
		},



		bindEventGD1: function (files) {
			var self = this;
			self.$el.find(".btn-add-member").unbind('click').bind('click', function () {

				var data_default = { "id": gonrin.uuid(), "hoten": "", "donvicongtac": null, "vaitro": null };
				var danhsach_thanhvien = self.model.get("danhsach_thanhvien");
				if (danhsach_thanhvien === null || danhsach_thanhvien.length === 0) {
					danhsach_thanhvien = [];
				}
				danhsach_thanhvien.push(data_default);
				self.model.set("danhsach_thanhvien", danhsach_thanhvien);
				self.applyBinding("danhsach_thanhvien");
				self.renderMember_GD1(data_default);
			});

			// BUTTON ADD GD3
			var self = this;
			self.$el.find("#btn-add-gd3").unbind('click').bind('click', function () {
				var data_default = { "id": gonrin.uuid(), "hangmuccongviec": null, "nguoiduocphancong": null };
				var danhsach_congviec_thanhtra = self.model.get("danhsach_congviec_thanhtra");
				if (danhsach_congviec_thanhtra === null || danhsach_congviec_thanhtra.length === 0) {
					danhsach_congviec_thanhtra = [];
				}
				danhsach_congviec_thanhtra.push(data_default);
				self.model.set("danhsach_congviec_thanhtra", danhsach_congviec_thanhtra);
				self.applyBinding("danhsach_congviec_thanhtra");
				self.renderCongViec_GD3(data_default);
			});


			self.$el.find(".btn-save-gd1").unbind('click').bind('click', function () {
				var soquyetdinh = self.model.get("so_quyetdinh_thanhtra");
				if (soquyetdinh === null || soquyetdinh === "") {
					self.getApp().notify("Vui lòng nhập số quyết định thanh tra");
					return;
				}

				var ngayquyetdinh = self.model.get("ngayquyetdinh");
				if (ngayquyetdinh === null || ngayquyetdinh === "") {
					self.getApp().notify("Vui lòng nhập ngày quyết định thanh tra");
					return;
				}
				// var danhsach_thanhvien = self.model.get("danhsach_thanhvien");
				// if (danhsach_thanhvien === null || danhsach_thanhvien === "" || danhsach_thanhvien.length == 0) {
				// 	self.getApp().notify("Vui lòng nhập danh sách đoàn thanh tra");
				// 	return;
				// }
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}

			});


			self.$el.find(".btn-save-gd2").unbind('click').bind('click', function () {
				var sokehoach = self.model.get("sokehoach");
				if (sokehoach === null || sokehoach === "") {
					self.getApp().notify("Vui lòng nhập số kế hoạch thanh tra");
					return;
				}

				var ngaylenkehoach = self.model.get("ngaylenkehoach");
				if (ngaylenkehoach === null || ngaylenkehoach === "") {
					self.getApp().notify("Vui lòng nhập ngày lên kế hoạch thanh tra");
					return;
				}
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}

			});


			self.$el.find(".btn-save-gd3").unbind('click').bind('click', function () {
				var danhsach_congviec_thanhtra = self.model.get("danhsach_congviec_thanhtra");
				if (danhsach_congviec_thanhtra === null || danhsach_congviec_thanhtra === "") {
					self.getApp().notify("Vui lòng nhập danh sách công việc");
					return;
				}
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}
			});

			self.$el.find(".btn-save-gd4").unbind('click').bind('click', function () {
				//    			var sokehoach = self.model.get("sokehoach");
				//    			if(sokehoach === null || sokehoach===""){
				//    				self.getApp().notify("Vui lòng nhập số kế hoạch thanh tra");
				//    				return;
				//    			}
				//    			
				//    			var ngaylenkehoach = self.model.get("ngaylenkehoach");
				//    			if(ngaylenkehoach === null || ngaylenkehoach===""){
				//    				self.getApp().notify("Vui lòng nhập ngày lên kế hoạch thanh tra");
				//    				return;
				//    			}
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}
			});


			//5
			self.$el.find(".btn-save-gd5").unbind('click').bind('click', function () {
				var sovanban_thongbao_doituong_thanhtra = self.model.get("sovanban_thongbao_doituong_thanhtra");
				if (sovanban_thongbao_doituong_thanhtra === null || sovanban_thongbao_doituong_thanhtra === "") {
					self.getApp().notify("Vui lòng nhập số văn bản thông báo");
					return;
				}

				var ngay_vanban_thongbao_doituong_thanhtra = self.model.get("ngay_vanban_thongbao_doituong_thanhtra");
				if (ngay_vanban_thongbao_doituong_thanhtra === null || ngay_vanban_thongbao_doituong_thanhtra === "") {
					self.getApp().notify("Vui lòng nhập ngày thông báo");
					return;
				}
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}
			});


			//6
			self.$el.find(".btn-save-gd6").unbind('click').bind('click', function () {

				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}
			});

			//7
			self.$el.find(".btn-save-gd7").unbind('click').bind('click', function () {
				//    			var sokehoach = self.model.get("sokehoach");
				//    			if(sokehoach === null || sokehoach===""){
				//    				self.getApp().notify("Vui lòng nhập số kế hoạch thanh tra");
				//    				return;
				//    			}
				//    			
				//    			var ngaylenkehoach = self.model.get("ngaylenkehoach");
				//    			if(ngaylenkehoach === null || ngaylenkehoach===""){
				//    				self.getApp().notify("Vui lòng nhập ngày lên kế hoạch thanh tra");
				//    				return;
				//    			}
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}
			});

			//8
			self.$el.find(".btn-save-gd8").unbind('click').bind('click', function () {

				//    			var sokehoach = self.model.get("sokehoach");
				//    			if(sokehoach === null || sokehoach===""){
				//    				self.getApp().notify("Vui lòng nhập số kế hoạch thanh tra");
				//    				return;
				//    			}
				//    			
				//    			var ngaylenkehoach = self.model.get("ngaylenkehoach");
				//    			if(ngaylenkehoach === null || ngaylenkehoach===""){
				//    				self.getApp().notify("Vui lòng nhập ngày lên kế hoạch thanh tra");
				//    				return;
				//    			}
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}
			});


			//9
			self.$el.find(".btn-save-gd9").unbind('click').bind('click', function () {
				//    			var sokehoach = self.model.get("sokehoach");
				//    			if(sokehoach === null || sokehoach===""){
				//    				self.getApp().notify("Vui lòng nhập số kế hoạch thanh tra");
				//    				return;
				//    			}
				//    			
				//    			var ngaylenkehoach = self.model.get("ngaylenkehoach");
				//    			if(ngaylenkehoach === null || ngaylenkehoach===""){
				//    				self.getApp().notify("Vui lòng nhập ngày lên kế hoạch thanh tra");
				//    				return;
				//    			}
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}
			});


			//10
			self.$el.find(".btn-save-gd10").unbind('click').bind('click', function () {
				//    			var sokehoach = self.model.get("sokehoach");
				//    			if(sokehoach === null || sokehoach===""){
				//    				self.getApp().notify("Vui lòng nhập số kế hoạch thanh tra");
				//    				return;
				//    			}
				//    			
				//    			var ngaylenkehoach = self.model.get("ngaylenkehoach");
				//    			if(ngaylenkehoach === null || ngaylenkehoach===""){
				//    				self.getApp().notify("Vui lòng nhập ngày lên kế hoạch thanh tra");
				//    				return;
				//    			}
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}
			});

			//11
			self.$el.find(".btn-save-gd11").unbind('click').bind('click', function () {
				//    			var sokehoach = self.model.get("sokehoach");
				//    			if(sokehoach === null || sokehoach===""){
				//    				self.getApp().notify("Vui lòng nhập số kế hoạch thanh tra");
				//    				return;
				//    			}
				//    			
				//    			var ngaylenkehoach = self.model.get("ngaylenkehoach");
				//    			if(ngaylenkehoach === null || ngaylenkehoach===""){
				//    				self.getApp().notify("Vui lòng nhập ngày lên kế hoạch thanh tra");
				//    				return;
				//    			}
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}
			});


			//12
			self.$el.find(".btn-save-gd12").unbind('click').bind('click', function () {
				//    			var sokehoach = self.model.get("sokehoach");
				//    			if(sokehoach === null || sokehoach===""){
				//    				self.getApp().notify("Vui lòng nhập số kế hoạch thanh tra");
				//    				return;
				//    			}
				//    			
				//    			var ngaylenkehoach = self.model.get("ngaylenkehoach");
				//    			if(ngaylenkehoach === null || ngaylenkehoach===""){
				//    				self.getApp().notify("Vui lòng nhập ngày lên kế hoạch thanh tra");
				//    				return;
				//    			}
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}
			});
			//13
			self.$el.find(".btn-save-gd13").unbind('click').bind('click', function () {
				//    			var sokehoach = self.model.get("sokehoach");
				//    			if(sokehoach === null || sokehoach===""){
				//    				self.getApp().notify("Vui lòng nhập số kế hoạch thanh tra");
				//    				return;
				//    			}
				//    			
				//    			var ngaylenkehoach = self.model.get("ngaylenkehoach");
				//    			if(ngaylenkehoach === null || ngaylenkehoach===""){
				//    				self.getApp().notify("Vui lòng nhập ngày lên kế hoạch thanh tra");
				//    				return;
				//    			}
				if (files != undefined) {
					files.forEach(function (item, index) {
						self.saveAttachment(item.arrAttachment, item.data_attr);
					})
				}
				else {
					self.saveModel();
				}
			});
			//14
			// self.$el.find(".btn-save-gd14").unbind('click').bind('click', function () {
			// 	//    			var sokehoach = self.model.get("sokehoach");
			// 	//    			if(sokehoach === null || sokehoach===""){
			// 	//    				self.getApp().notify("Vui lòng nhập số kế hoạch thanh tra");
			// 	//    				return;
			// 	//    			}
			// 	//    			
			// 	//    			var ngaylenkehoach = self.model.get("ngaylenkehoach");
			// 	//    			if(ngaylenkehoach === null || ngaylenkehoach===""){
			// 	//    				self.getApp().notify("Vui lòng nhập ngày lên kế hoạch thanh tra");
			// 	//    				return;
			// 	//    			}
			// 	self.saveModel();
			// });
		},
		renderAttachment: function () {
			var self = this;
			self.$el.find('.link-taive-view div').each(function (indexhtml, itemhtml) {

				if (self.model.get($(itemhtml).attr('data-field')) != null) {

					$(self.$el.find('.custom-file-view')[indexhtml]).hide();
					// $(itemhtml).append(`
					// 	<label class = 'mt-2'>Danh sách tài liệu</label><br>
					// `)
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
					self.bindEventGD1(arr)
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
		renderMember_GD1: function (data) {
			var self = this;
			self.$el.find("#header_del_member").removeClass("d-none");
			//    		gd1-danhsachthanhvien

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
		renderCongViec_GD3: function (data) {
			var self = this;
			// self.$el.find("#header_del_member").removeClass("d-none");
			//    		gd1-danhsachthanhvien
			var dsThanhVienThanhTra = self.model.get("danhsach_thanhvien");
			var CongViecView = new CongViecThanhTraItemView({
				viewData: {
					danhsachthanhvien: dsThanhVienThanhTra
				}
			});
			if (!!data) {
				CongViecView.model.set(JSON.parse(JSON.stringify(data)));
			}

			CongViecView.render();
			self.$el.find("#danhsachphancongviec_grid").append(CongViecView.$el);
			CongViecView.on("change", function (event) {
				var ds_CongViec = self.model.get("danhsach_congviec_thanhtra");
				if (ds_CongViec === null) {
					ds_CongViec = [];
					ds_CongViec.push(event.data)
				}
				for (var i = 0; i < ds_CongViec.length; i++) {
					if (ds_CongViec[i].id === event.oldData.id) {
						ds_CongViec[i] = event.data;
						break;
					}
				}
				self.model.set("danhsach_congviec_thanhtra", ds_CongViec);
				self.applyBinding("danhsach_congviec_thanhtra");
			});
			CongViecView.$el.find("#itemRemove").unbind("click").bind("click", function () {
				var ds_CongViec = self.model.get("danhsach_congviec_thanhtra");
				for (var i = 0; i < ds_CongViec.length; i++) {
					if (ds_CongViec[i].id === CongViecView.model.get("id")) {
						ds_CongViec.splice(i, 1);
					}
				}
				self.model.set("danhsach_congviec_thanhtra", ds_CongViec);
				self.applyBinding("danhsach_congviec_thanhtra");
				CongViecView.destroy();
				CongViecView.remove();
			});



		},
		updateStepStatus: function () {
			var self = this;
			// var currentUser = self.getApp().currentUser;
			// var trangthai = self.model.get("trangthai");
			console.log("self.check_gd1_sucees())", self.check_gd1_sucees());
			self.updateStepUI(1, self.check_gd1_sucees());
			self.updateStepUI(2, self.check_gd2_sucees());
			self.updateStepUI(3, self.check_gd3_sucees());
			self.updateStepUI(4, self.check_gd4_sucees());
			self.updateStepUI(5, self.check_gd5_sucees());
			self.updateStepUI(6, self.check_gd6_sucees());
			self.updateStepUI(7, self.check_gd7_sucees());
			self.updateStepUI(8, self.check_gd8_sucees());
			self.updateStepUI(9, self.check_gd9_sucees());
			self.updateStepUI(10, self.check_gd10_sucees());
			self.updateStepUI(11, self.check_gd11_sucees());
			self.updateStepUI(12, self.check_gd12_sucees());
			self.updateStepUI(13, self.check_gd13_sucees());
			self.updateStepUI(14, self.check_gd14_sucees());
		},


		updateStepUI: function (step, status) {
			var self = this;
			self.$el.find(".gd" + step + " .badge-pill").addClass("bg-light border");
			self.$el.find(".gd" + step + " .card-title").removeClass("text-success");
			self.$el.find(".gd" + step + " .card-title").removeClass("text-danger");
			self.$el.find(".gd" + step + " .card").removeClass("border-success shadow");
			self.$el.find(".gd" + step + " .card").removeClass("border-danger shadow");

			if (status) {
				self.$el.find(".gd" + step + " .card").addClass("border-" + status + " shadow");
				self.$el.find(".gd" + step + " .card-title").addClass("text-" + status);
				self.$el.find(".gd" + step + " .badge-pill").removeClass("bg-light border");
				self.$el.find(".gd" + step + " .badge-pill").addClass("bg-" + status + " border");
			}


			//    		self.$el.find(".gd" + step +" .card").addClass("border-success shadow");
			//    		self.$el.find(".gd" + step +" .card-title").addClass("text-success");
			//    		//self.$el.find(".gd" + step +" .badge-pill").removeClass("bg-light border");
			//    		self.$el.find(".gd" + step +" .badge-pill").addClass("bg-success");

			//    		if (status == "default"){
			//    			self.$el.find(".gd" + step +" .badge-pill").addClass("bg-light border");
			//    		}else{
			//    			self.$el.find(".gd" + step +" .badge-pill").removeClass("bg-light border");
			//    		}

			//    		self.$el.find(".gd" + step +" .card").removeClass("border-success shadow");
			//    		self.$el.find(".gd" + step +" .card-title").removeClass("text-success");
			//    		self.$el.find(".gd" + step +" .badge-pill").addClass("bg-light border");
			//    		self.$el.find(".gd" + step +" .badge-pill").removeClass("bg-success");

		},



		//check gd status
		check_gd1_sucees: function () {
			var self = this;

			if (
				self.model.get("so_quyetdinh_thanhtra") !== null
				&& self.model.get("ngay_quyetdinh_thanhtra") !== null) {
				self.$el.find(".buoc2").removeClass("buoc2");
				return "success"
			}
			return "light";
		},

		check_gd2_sucees: function () {
			var self = this;
			if (self.model.get("so_vanban_kehoach") !== null
				&& self.model.get("ngay_vanban_kehoach") !== null) {
				self.$el.find(".buoc3").removeClass("buoc3");

				return "success"
			}
			return "light";
		},

		check_gd3_sucees: function () {
			var self = this;
			if (self.model.get("danhsach_congviec_thanhtra") !== null
				&& self.model.get("danhsach_congviec_thanhtra") !== null
				&& self.model.get("danhsach_congviec_thanhtra").length > 0) {
				self.$el.find(".buoc4").removeClass("buoc4");

				return "success"
			}
			return "light";
		},

		check_gd4_sucees: function () {
			var self = this;
			if (self.model.get("so_congvan_yeucau_doituong_baocao") !== null
				&& self.model.get("ngay_congvan_yeucau_doituong_baocao") !== null) {
				self.$el.find(".buoc5").removeClass("buoc5");

				return "success"
			}
			return "light";
		},
		check_gd5_sucees: function () {
			var self = this;
			if (self.model.get("sovanban_thongbao_doituong_thanhtra") !== null
				&& self.model.get("ngay_vanban_thongbao_doituong_thanhtra") !== null) {
				self.$el.find(".buoc6").removeClass("buoc6");

				return "success"
			}
			return "light";
		},
		check_gd6_sucees: function () {
			var self = this;
			self.$el.find(".gd6 .danger-reason").html("");
			var ngay_vanban_congbo_quyetdinh = self.model.get("ngay_vanban_congbo_quyetdinh");
			var ngayquyetdinh = self.model.get("ngay_quyetdinh_thanhtra");
			var danger = false;
			var danger_html = "";

			if (!!ngayquyetdinh && !!ngay_vanban_congbo_quyetdinh) {
				if ((ngay_vanban_congbo_quyetdinh - ngayquyetdinh) < 5 * 24 * 60 * 60) {

					danger_html = danger_html + "Công bố quyết định thanh tra quá sớm";
					self.$el.find(".danger-reason").addClass('text-warning')
					danger = true;
				}
				if ((ngay_vanban_congbo_quyetdinh - ngayquyetdinh) > 15 * 24 * 60 * 60) {
					danger_html = danger_html + "Công bố quyết định thanh tra muộn hơn 15 ngày";
					self.$el.find(".danger-reason").addClass('text-danger')
					danger = true;
				}
			}
			if (danger) {
				self.$el.find(".gd6 .danger-reason").html(danger_html);
				if (self.model.get("so_vanban_congbo_quyetdinh") !== null
					&& self.model.get("ngay_vanban_congbo_quyetdinh") !== null) {
					self.$el.find(".buoc7").removeClass("buoc7");
				}
				return "danger";
			}

			if (self.model.get("so_vanban_congbo_quyetdinh") !== null
				&& self.model.get("ngay_vanban_congbo_quyetdinh") !== null) {
				self.$el.find(".buoc7").removeClass("buoc7");
				return "success"
			}
			return "light";
		},
		check_gd7_sucees: function () {
			var self = this;
			if (self.model.get("codauhieu_hinhsu") !== null) {
				self.$el.find(".buoc8").removeClass("buoc8");
				return "success"
			}
			return "light";
		},
		check_gd8_sucees: function () {
			var self = this;
			var dem = 0;
			if (self.model.get('danhsach_congviec_thuchien') != null) {
				self.model.get('danhsach_congviec_thuchien').forEach(function (item, index) {
					if (self.model.get('ngay_ketqua_trungcau_ykien') < moment(item.thoigianhoanthanh).format("X")) {
						dem++;
					}
				})
				if (dem > 0) {
					self.$el.find(".gd8 .danger-reason").html("Ngày hoàn thành không được trước ngày nhận kết quả trưng cầu");
					return "danger"
				} else {
					if (self.model.get('so_ketqua_trungcau_ykien') != null &&
						self.model.get('ngay_ketqua_trungcau_ykien') != null &&
						self.model.get('ketqua_trungcau_ykien_attachment') != null) {
						self.$el.find(".buoc9").removeClass("buoc9");
						return "success"
					}
				}
			}
			return "light";
		},
		check_gd9_sucees: function () {
			var self = this;
			if (self.model.get("baocaocuadoanthanhtrafield").length !== 0 && self.model.get("baocaocuadoanthanhtrafield").length !== null) {
				var baocao = lodash.orderBy(self.model.get('baocaocuadoanthanhtrafield'), ['created_at'], ['desc']);
				var baocaocuoicung = baocao.slice(0, 1);

				if (baocaocuoicung[0].duyet == "duyet" &&
					baocaocuoicung[0].vanbangiaitrinh_attachment != null &&
					baocaocuoicung[0].ngayguibaocaogiaitrinh != null) {
					self.$el.find(".buoc10").removeClass("buoc10");
				}
				if ((baocaocuoicung[0].ngayguibaocaogiaitrinh - Number(self.model.get("ngay_quyetdinh_thanhtra"))) >= 30 * 24 * 60 * 60) {
					self.$el.find(".gd9 .danger-reason").html("Ngày gửi bảo cáo giải trình quá 30 ngày kể từ ngày gửi quyết định thanh tra");
					return "danger"
				}
				return "success";
			}
			return "light";
		},


		check_gd10_sucees: function () {
			var self = this;
			if (self.model.get("baocaocuadoanthanhtrafield").length !== 0 && self.model.get('vanbanduthaofield').length != 0) {
				var baocao = lodash.orderBy(self.model.get('baocaocuadoanthanhtrafield'), ['created_at'], ['desc']);
				var vanban = lodash.orderBy(self.model.get('vanbanduthaofield'), ['created_at'], ['desc']);
				var baocaocuoicung = baocao.slice(0, 1);
				var vanbancuoicung = vanban.slice(0, 1);
				if (vanbancuoicung[0].trangthai_vanban == 1 &&
					vanbancuoicung[0].so_vanban_duthao != null &&
					vanbancuoicung[0].ngay_duthao_vanban != null &&
					vanbancuoicung[0].vanban_duthao_duthao_attachment != null) {
					self.$el.find(".buoc11").removeClass("buoc11");
				}
				if ((vanbancuoicung[0].ngay_gui_congvan_giaitrinh - baocaocuoicung[0].ngayguibaocaogiaitrinh) >= 15 * 24 * 60 * 60) {
					self.$el.find(".gd10 .danger-reason").html("Ngày gửi công văn giải trình quá 15 ngày kể từ ngày gửi báo cáo giải trình");
					return "danger"
				}
				return "success";
			}
			return "light";
		},
		check_gd11_sucees: function () {
			var self = this;
			if (self.model.get("so_ketluan_thanhtra") !== null
				&& self.model.get("ngay_ketluan_thanhtra") !== null
				&& self.model.get("ketluan_thanhtra_attachment") != null) {
				self.$el.find(".buoc12").removeClass("buoc12");
				return "success"
			}
			return "light";
		},

		check_gd12_sucees: function () {
			var self = this;
			if (self.model.get("ngay_bienban_congbo_ketluan") !== null) {
				self.$el.find(".buoc13").removeClass("buoc13");
				if ((self.model.get("ngay_bienban_congbo_ketluan") - self.model.get("ngay_ketluan_thanhtra")) >= 10 * 24 * 60 * 60) {
					self.$el.find(".gd12 .danger-reason").html("Ngày công bố kết luận muộn qúa 10 ngày kể từ ngày kết luận thanh tra");
					return "danger"
				}
				return "success";
			}
			return "light";
		},
		check_gd13_sucees: function () {
			var self = this;
			if (self.model.get("congvanbaocaofield").length !== 0 && self.model.get('congvanbaocaofield') != null) {
				var congvan = lodash.orderBy(self.model.get('congvanbaocaofield'), ['created_at'], ['desc']);
				var congvancuoicung = congvan.slice(0, 1);
				if (congvancuoicung[0].duyet == 'duyet' &&
					congvancuoicung[0].congvan_yeucau_baocao_thuchien_attachment != null &&
					congvancuoicung[0].ngay_congvan_yeucau_baocao_thuchien != null &&
					congvancuoicung[0].so_congvan_yeucau_baocao_thuchien != null
				) {
					self.$el.find(".buoc14").removeClass("buoc14");
				}
				if ((congvancuoicung[0].ngay_congvan_yeucau_baocao_thuchien - self.model.get("ngay_ketluan_thanhtra")) >= 55 * 24 * 60 * 60) {
					self.$el.find(".gd13 .danger-reason").html("Ngày công văn yêu cầu báo cáo thực hiện kết luận thanh tra muộn qúa 55 ngày kể từ ngày kết luận thanh tra");
					return "danger"
				}
				return "success";
			}
			return "light";
		},
		check_gd14_sucees: function () {
			var self = this;
			if (self.model.get("ngay_bangiao_luutru") !== null) {
				return "success"
			}
			return "light";
		},


		getDoanhNghiep: function () {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep",
				method: "GET",
				data: { "q": JSON.stringify({ "order_by": [{ "field": "name", "direction": "desc" }], "page": 1, "results_per_page": 10000 }) },
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
							self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
						}
					},
					complete: function () {
						self.updateStepStatus();

					}
				});

			});
			self.$el.find("#btn_review").unbind("click").bind("click", function () {
				self.confirm_kehoach();
			});
			self.$el.find("#btn_approve").unbind("click").bind("click", function () {
				self.confirm_kehoach();
			});
			self.$el.find("#btn_cancel").unbind("click").bind("click", function () {
				self.cancel_kehoach();
			});

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

			self.$el.find('#select_nguoisoanthao').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
				var data_ck = self.$el.find('#select_nguoisoanthao option:selected').attr('data-ck');
				if (data_ck !== undefined && data_ck !== null) {
					var my_object = JSON.parse(decodeURIComponent(data_ck));
					if (my_object !== null) {
						self.model.set("manguoisoanthao", my_object.id);
						self.model.set("tennguoisoanthao", my_object.hoten);
						self.model.set("vaitronguoisoanthao", my_object.vaitro);

					}
				}
			});

			self.$el.find('#select_nguoixemxet').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
				var data_ck = self.$el.find('#select_nguoixemxet option:selected').attr('data-ck');
				if (data_ck !== undefined && data_ck !== null) {
					var my_object = JSON.parse(decodeURIComponent(data_ck));
					if (my_object !== null) {
						self.model.set("manguoixemxet", my_object.id);
						self.model.set("tennguoixemxet", my_object.hoten);
						self.model.set("vaitronguoixemxet", my_object.vaitro);

					}
				}
			});

			self.$el.find('#select_nguoipheduyet').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
				var data_ck = self.$el.find('#select_nguoipheduyet option:selected').attr('data-ck');
				if (data_ck !== undefined && data_ck !== null) {
					var my_object = JSON.parse(decodeURIComponent(data_ck));
					if (my_object !== null) {
						self.model.set("manguoipheduyet", my_object.id);
						self.model.set("tennguoipheduyet", my_object.hoten);
						self.model.set("vaitronguoipheduyet", my_object.vaitro);

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
						self.updateStepStatusTimeline(data);
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
						self.updateStepStatusTimeline(data);
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
		updateStepStatusTimeline: function (data) {
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
		},
		baoCaoCuaDoanThanhTra: function () {
			var self = this;

			var ds_baoCaoCuaDoanThanhTra = self.model.get("baocaocuadoanthanhtrafield");
			if (!ds_baoCaoCuaDoanThanhTra) {
				ds_baoCaoCuaDoanThanhTra = [];
			}

			var containerEl = self.$el.find("#space_baocaocuadoanthanhtrafield");
			containerEl.empty();


			var dataSource = lodash.orderBy(ds_baoCaoCuaDoanThanhTra, ['created_at'], ['asc']);
			dataSource.forEach((item, index) => {

				var view = new BaoCaoCuaDoanThanhTraItemView();
				view.model.set(item);
				view.render();
				$(view.el).hide().appendTo(containerEl).fadeIn();
				view.on("change", (data) => {
					var ds_baoCaoCuaDoanThanhTra = self.model.get("baocaocuadoanthanhtrafield");
					ds_baoCaoCuaDoanThanhTra.forEach((item, index) => {
						if (item.id == data.id) {
							ds_baoCaoCuaDoanThanhTra[index] = data;
						}
					});
					self.model.set("baocaocuadoanthanhtrafield", ds_baoCaoCuaDoanThanhTra);

				});
			});

			self.$el.find("#btn_add_baocaocuadoanthanhtrafield").on("click", (eventClick) => {
				var view = new BaoCaoCuaDoanThanhTraItemView();
				view.model.save(null, {
					success: function (model, respose, options) {
						view.model.set(respose);
						view.render();
						$(view.el).hide().appendTo(containerEl).fadeIn();

						// PUSH THE CHILD TO LIST
						var ds_baoCaoCuaDoanThanhTra = self.model.get("baocaocuadoanthanhtrafield");
						if (!ds_baoCaoCuaDoanThanhTra) {
							ds_baoCaoCuaDoanThanhTra = [];
						}
						ds_baoCaoCuaDoanThanhTra.push(view.model.toJSON());
						self.model.set("baocaocuadoanthanhtrafield", ds_baoCaoCuaDoanThanhTra);
						self.model.save(null, {
							success: function (model, respose, options) {
								// NOTIFY TO GRANPARENT
								self.trigger("change", self.model.toJSON());
							},
							error: function (xhr, status, error) {
							}
						});

						view.on("change", (data) => {
							var ds_baoCaoCuaDoanThanhTra = self.model.get("baocaocuadoanthanhtrafield");
							if (!ds_baoCaoCuaDoanThanhTra) {
								ds_baoCaoCuaDoanThanhTra = [];
							}
							ds_baoCaoCuaDoanThanhTra.forEach((item, index) => {
								if (item.id == data.id) {
									ds_baoCaoCuaDoanThanhTra[index] = data;
								}
							});
							var containerEl = self.$el.find("#space_vanbanduthaofield");

							self.model.set("baocaocuadoanthanhtrafield", ds_baoCaoCuaDoanThanhTra);
							self.model.save(null, {
								success: function (model, respose, options) {
									// NOTIFY TO GRANPARENT
									self.trigger("change", self.model.toJSON());
								},
								error: function (xhr, status, error) {
								}
							});
						});
						self.getApp().router.refresh();

					},
					error: function (xhr, status, error) {
						// HANDLE ERROR
					}
				});
			});
		},
		vanBanDuThao: function () {
			var self = this;

			var ds_VanBanDuThao = self.model.get("vanbanduthaofield");
			if (!ds_VanBanDuThao) {
				ds_VanBanDuThao = [];
			}
			var containerEl = self.$el.find("#space_vanbanduthaofield");
			containerEl.empty();
			var dataSource = lodash.orderBy(ds_VanBanDuThao, ['created_at'], ['asc']);
			dataSource.forEach((item, index) => {
				var view = new VanBanDuThaoItemView();
				view.model.set(item);
				view.render();
				$(view.el).hide().appendTo(containerEl).fadeIn();
				view.on("change", (data) => {
					var ds_VanBanDuThao = self.model.get("vanbanduthaofield");
					ds_VanBanDuThao.forEach((item, index) => {
						if (item.id == data.id) {
							ds_VanBanDuThao[index] = data;
						}
					});
					self.model.set("vanbanduthaofield", ds_VanBanDuThao);

				});
			});
			self.$el.find("#btn_add_vanbanduthaofield").on("click", (eventClick) => {
				var view = new VanBanDuThaoItemView();
				view.model.save(null, {
					success: function (model, respose, options) {
						view.model.set(respose);
						view.render();
						$(view.el).hide().appendTo(containerEl).fadeIn();

						// PUSH THE CHILD TO LIST
						var ds_VanBanDuThao = self.model.get("vanbanduthaofield");
						if (!ds_VanBanDuThao) {
							ds_VanBanDuThao = [];
						}
						ds_VanBanDuThao.push(view.model.toJSON());
						self.model.set("vanbanduthaofield", ds_VanBanDuThao);
						self.model.save(null, {
							success: function (model, respose, options) {
								// NOTIFY TO GRANPARENT
								self.trigger("change", self.model.toJSON());
							},
							error: function (xhr, status, error) {
							}
						});

						view.on("change", (data) => {
							var ds_VanBanDuThao = self.model.get("vanbanduthaofield");
							if (!ds_VanBanDuThao) {
								ds_VanBanDuThao = [];
							}
							ds_VanBanDuThao.forEach((item, index) => {
								if (item.id == data.id) {
									ds_VanBanDuThao[index] = data;
								}
							});

							self.model.set("vanbanduthaofield", ds_VanBanDuThao);
							self.model.save(null, {
								success: function (model, respose, options) {
									// NOTIFY TO GRANPARENT
									self.trigger("change", self.model.toJSON());
								},
								error: function (xhr, status, error) {
								}
							});
						});
						self.getApp().router.refresh();

					},
					error: function (xhr, status, error) {
						// HANDLE ERROR
					}
				});
			});
		},
		congVanBaoCaoCao: function () {
			var self = this;

			var ds_congVanBaoCaoCao = self.model.get("congvanbaocaofield");
			if (!ds_congVanBaoCaoCao) {
				ds_congVanBaoCaoCao = [];
			}

			var containerEl = self.$el.find("#space_congvanbaocaofield");
			containerEl.empty();


			var dataSource = lodash.orderBy(ds_congVanBaoCaoCao, ['created_at'], ['asc']);
			dataSource.forEach((item, index) => {

				var view = new CongVanBaoCaoItemView();
				view.model.set(item);
				view.render();
				$(view.el).hide().appendTo(containerEl).fadeIn();
				view.on("change", (data) => {
					var ds_congVanBaoCaoCao = self.model.get("congvanbaocaofield");
					ds_congVanBaoCaoCao.forEach((item, index) => {
						if (item.id == data.id) {
							ds_congVanBaoCaoCao[index] = data;
						}
					});
					self.model.set("congvanbaocaofield", ds_congVanBaoCaoCao);

				});
			});

			self.$el.find("#btn_add_congvanbaocaofield").on("click", (eventClick) => {
				var view = new CongVanBaoCaoItemView();
				view.model.save(null, {
					success: function (model, respose, options) {
						view.model.set(respose);
						view.render();
						$(view.el).hide().appendTo(containerEl).fadeIn();

						// PUSH THE CHILD TO LIST
						var ds_congVanBaoCaoCao = self.model.get("congvanbaocaofield");
						if (!ds_congVanBaoCaoCao) {
							ds_congVanBaoCaoCao = [];
						}
						ds_congVanBaoCaoCao.push(view.model.toJSON());
						self.model.set("congvanbaocaofield", ds_congVanBaoCaoCao);
						self.model.save(null, {
							success: function (model, respose, options) {
								// NOTIFY TO GRANPARENT
								self.trigger("change", self.model.toJSON());
							},
							error: function (xhr, status, error) {
							}
						});

						view.on("change", (data) => {
							var ds_congVanBaoCaoCao = self.model.get("congvanbaocaofield");
							if (!ds_congVanBaoCaoCao) {
								ds_congVanBaoCaoCao = [];
							}
							ds_congVanBaoCaoCao.forEach((item, index) => {
								if (item.id == data.id) {
									ds_congVanBaoCaoCao[index] = data;
								}
							});
							var containerEl = self.$el.find("#space_congvanbaocaofield");

							self.model.set("congvanbaocaofield", ds_congVanBaoCaoCao);
							self.model.save(null, {
								success: function (model, respose, options) {
									// NOTIFY TO GRANPARENT
									self.trigger("change", self.model.toJSON());
								},
								error: function (xhr, status, error) {
								}
							});
						});
						self.getApp().router.refresh();

					},
					error: function (xhr, status, error) {
						// HANDLE ERROR
					}
				});
			});
		},
		danhSachTaiLieu14Buoc: function () {
			var self = this;
			self.danhSachTaiLieuBuoc8();
			self.danhSachTaiLieuBuocItemView();
			var attachmentBuoc = [
				"attachmentBuoc1",
				"attachmentBuoc2",
				"attachmentBuoc3",
				"attachmentBuoc4",
				"attachmentBuoc5",
				"attachmentBuoc6",
				"attachmentBuoc7",
				"attachmentBuoc8",
				"attachmentBuoc9",
				"attachmentBuoc10",
				"attachmentBuoc11",
				"attachmentBuoc12",
				"attachmentBuoc13"
			]
			attachmentBuoc.forEach(function (item, index) {
				if (self.$el.find('.' + item).attr('data-attr') != undefined) {
					var tenClass = item;
					var arrClass = self.$el.find("." + tenClass)
					arrClass.each(function (indexAttr, itemAttr) {
						var element = $(itemAttr).attr('data-attr');
						if (self.model.get(element) != null) {
							self.$el.find('.danhsachhoso_bangiao_buoc' + (index + 1)).append(`
										<tr>
											<td colspan = "3">${$(itemAttr).attr('aria-label')}</td>
										</tr>
										`)
							self.model.get(element).forEach(function (itemAttachment, indexAttachment) {
								self.$el.find('.danhsachhoso_bangiao_buoc' + (index + 1)).append(`
										<tr>
											<td>${indexAttachment}</td>
											<td>${itemAttachment.slice(16)}</td>
											<td><a href="${itemAttachment}">Tải về</a></td>
										</tr>
										`)
							})
						}
					})
				}
			})
		},
		danhSachTaiLieuBuoc8: function () {
			var self = this;
			self.model.get('danhsach_congviec_thanhtra').forEach(function (item) {
				if (item.tailieu != null) {
					self.$el.find('.danhsachhoso_bangiao_buoc8').append(`
										<tr>
											<td colspan = "3">Công viêc:${item.hangmuccongviec}</td>
										</tr>
										`)
					item.tailieu.forEach(function (itemTaiLieu, indexTaiLieu) {
						self.$el.find('.danhsachhoso_bangiao_buoc8').append(`
										<tr>
											<td>${indexTaiLieu}</td>
											<td>${itemTaiLieu.slice(16)}</td>
											<td><a href="${itemTaiLieu}">Tải về</a></td>
										</tr>
										`)
					})
				}
			})
		},
		danhSachTaiLieuBuocItemView: function () {
			var self = this;
			var mangFiled = [
				{
					"field": "baocaocuadoanthanhtrafield",
					"attachment": [{ "value": "vanbangiaitrinh_attachment", "text": "Bảo cáo giải trình" },
					{ "value": "baocaotonghopcuadoanthanhtra_attachment", "text": "Bảo cáo tổng hợp của đoàn thanh tra" }]
				},
				{
					"field": "vanbanduthaofield",
					"attachment": [{ "value": "vanban_duthao_duthao_attachment", "text": "Dự thảo kết luận thanh tra" },
					{ "value": "congvan_giaitrinh_cua_doituong_thanhtra_attachment", "text": "Công văn giải trình kết luận của đối tượng thanh tra" },
					{ "value": "tham_khao_y_kien_attachment", "text": "Tham khảo y kiến" },]
				},
				{
					"field": "congvanbaocaofield",
					"attachment": [{ "value": "congvan_yeucau_baocao_thuchien_attachment", "text": "Công văn yêu cầu báo cáo thực hiện kết luận thanh tra" },
					{ "value": "baocao_doituong_thuchien_attachment", "text": "Báo cáo thực hiện của đối tượng thanh tra" }]
				}

			]
			mangFiled.forEach(function (item, index) {
				if (self.model.get(item.field) != null && self.model.get(item.field) != undefined) {
					var mangFiledSort = lodash.orderBy(self.model.get(item.field), ['created_at'], ['desc']);
					var mangFiledFilter = mangFiledSort.slice(0, 1)[0];
					if (mangFiledFilter !== undefined && mangFiledFilter !== null) {
						item.attachment.forEach(function (item_attachment, index_attachment) {
							if (mangFiledFilter[item_attachment.value] != null) {
								self.$el.find('.ds_' + item.field).append(`
										<tr>
											<td colspan = "3">${item_attachment.text}</td>
											</tr>
										`)
								mangFiledFilter[item_attachment.value].forEach(function (item_value, index_value) {
									self.$el.find('.ds_' + item.field).append(`
										<tr>
											<td>${index_value + 1}</td>
												<td>${item_value.slice(16)}</td>
											<td><a href="${item_value}">Tải về</a></td>
										</tr>
									`)
								})
							}
						})
					}
				}
			})
		},
		danhkhoitao: function () {
			var self = this;

			var mangField = [
				{ "field": "vanbanduthaofield", "itemview": new VanBanDuThaoItemView() },
				{ "field": "baocaocuadoanthanhtrafield", "itemview": new BaoCaoCuaDoanThanhTraItemView() },
				{ "field": "congvanbaocaofield", "itemview": new CongVanBaoCaoItemView() },
			]
			mangField.forEach(function (item, index) {
				if (self.model.get(item.field).length == 0) {
					var view = item.itemview;
					view.model.save(null, {
						success: function (model, respose, options) {
							view.model.set(respose);
							view.render();
							$(view.el).hide().appendTo(self.$el.find("#space_" + item.field)).fadeIn();
							// PUSH THE CHILD TO LIST
							var ds_item = self.model.get(item.field);
							if (!ds_item) {
								ds_item = [];
							}
							ds_item.push(view.model.toJSON());
							self.model.set(item.field, ds_item);
							self.model.save(null, {
								success: function (model, respose, options) {
									// NOTIFY TO GRANPARENT
									self.trigger("change", self.model.toJSON());
								},
								error: function (xhr, status, error) {
								}
							});
							// self.getApp().router.refresh();			
						},
						error: function (xhr, status, error) {
						}
					});
				}
			})
		},


	});

});