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
				// {
				// 	field:"quyetdinh_thanhtra_attachment",
				// 	uicontrol: "imagelink",
				// 	service: {
				// 		url: "/api/v1/upload/file",
				// 	}
				// },

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

				{
					field: "danhsach_congviec_thanhtra",
					uicontrol: false,
					itemView: CongViecThanhTraItemView,
					tools: [
						{
							name: "create",
							type: "button",
							buttonClass: "btn btn-primary",
							label: "Thêm hạng mục",
							command: "create"
						},
					],
					toolEl: "#btn-add-task-gd3"
				},
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
			self.updateStepStatus();


			var id = this.getApp().getRouter().getParam("id");

			if (id) {

				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
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
							danhsach_thanhvien = [];
						}
						$.each(danhsach_thanhvien, function (idx, value) {
							self.renderMember_GD1(value);
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

						//$.each(danhsach_congviec_thanhtra,function(idx, value){
						//self.renderDanhSachCongViec(value);
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

						//});


						self.applyBindings();


						self.LapBienBan();
						self.ketthuc_thanhtra();
						self.updateStepStatus();
						self.hoso_luutru();
						self.renderUpload();
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


		renderUpload() {
			var self = this;
			var keys = [
				"quyetdinh_thanhtra_attachment",
				"quyetdinh_trungcau_giamdinh_attachment",
				"vanban_kehoach_attachment",
				"congvan_yeucau_doituong_baocao_attachment",
				"vanban_doituong_baocao_attachment",
				"vanban_duthao_duthao_lan1_attachment",
				"congvan_giaitrinh_cua_doituong_thanhtra_attachment",
				"tham_khao_y_kien_attachment",
				"vanban_duthao_duthao_lan2_attachment",
				"bienban_hanhchinh_attachment",
				"quyetdinh_xuphat_attachment",
				"ketluan_thanhtra_attachment",
				"bienban_hanhchinh_attachment",
				"quyetdinh_xuphat_attachment",
				"bienban_congbo_ketluan_attachment",
				"congkhai_ketluan_image_attachment",
				"bienban_hanhchinh_attachment",
				"quyetdinh_xuphat_attachment",
				"baocao_doituong_thuchien_attachment",
			];
			$.each(keys, function (i, key) {
				var attr_value = self.model.get(key);
				var linkDownload = self.$el.find(".linkDownload");

				if (!!attr_value) {
					linkDownload[i].href = attr_value;
					self.$el.find("#upload-" + key).hide();
					self.$el.find("#download-" + key).show();

				} else {
					// console.log(key, attr_value);
					self.$el.find("#upload-" + key).show();
					self.$el.find("#download-" + key).hide();

				}

			})

			var linkDownload = self.$el.find(".linkDownload");
			var textDownload = self.$el.find(".textDownload");
			var link = self.$el.find(".linkdownload_and_button");
			var hoso = self.$el.find(".danhsachhoso_bangiao");
			var arr = [];

			for (var i = 0; i < linkDownload.length; i++) {
				if (linkDownload[i].href === '') {
					linkDownload[i].style.display = "none";
				}
				else {
					arr.push(linkDownload[i].href)
				}

			}
		
			let ans = deduplicate(arr);
			
			function deduplicate(arr) {
				let isExist = (arr, x) => {
					for (let i = 0; i < arr.length; i++) {
						if (arr[i] === x) return true;
					}
					return false;
				}

				let ans = [];
				arr.forEach(element => {
					if (!isExist(ans, element)) ans.push(element);
				});
				return ans;
			}

			for(var i = 0;i<ans.length ; i++){
				hoso.after("<span>&nbsp;&nbsp;"+ans[i].slice(35)+"</span><a href='"+ans[i]+"'>download</a><br>")
			
			}

		},

		LapBienBan: function () {
			var self = this;
			var lapBienBanXuPhat = self.$el.find(".lap_bien_ban_xuphat")
			var quyetDinhXuPhat = self.$el.find(".QuyetDinhXuPhat")

			lapBienBanXuPhat[0].onclick = clickk;
			function clickk() {
				self.model.set("vitriannutxuphat", 0)
				self.saveModel();


			}
			lapBienBanXuPhat[1].onclick = clickk2;
			function clickk2() {
				self.model.set("vitriannutxuphat", 1)
				self.saveModel();
			}

			lapBienBanXuPhat[2].onclick = clickk3;
			function clickk3() {
				self.model.set("vitriannutxuphat", 2)
				self.saveModel();
			}

			function hidexuphat() {
				lapBienBanXuPhat.each(function (key, value) {
					lapBienBanXuPhat.attr("style", "display:none");
				})
			}
			function hidemucxuphat(x) {
				for (var i = 0; i < quyetDinhXuPhat.length; i++) {
					if (i != x) {
						quyetDinhXuPhat[i].style.display = 'none';
						console.log(i);
					}
				}
			}

			var x = self.model.get("vitriannutxuphat");
			if (x == 0) {
				hidexuphat();
				hidemucxuphat(x);

			}
			if (x == 1) {
				;
				hidexuphat();
				hidemucxuphat(x);
			}
			if (x == 2) {
				hidexuphat();
				hidemucxuphat(x);
			}
		},




		// ######   ####     ##  ####### 
		// ##       ## ###   ##  ##   ###  
		// ######   ##   ######  ##    ###
		// ##       ##     ####  ##   ##
		// ######   ##       ##  #####
		ketthuc_thanhtra: function () {
			var self = this;
			var btnSave = self.$el.find(".btn-save")

			var btnYesKetThuc = self.$el.find("#yes-ketthuc")
			var btnNoKetThuc = self.$el.find("#no-ketthuc")
			var thongbaoketthuc = self.$el.find(".notify-ketthuc-thanhtra")
			self.$el.find(".btn-end-exit").unbind('click').bind('click', function () {
				self.$el.find(".content_14step").css("opacity", "0.33333")
				thongbaoketthuc.show();
				btnYesKetThuc.unbind('click').bind('click', function () {
					thongbaoketthuc.hide();
					self.$el.find(".content_14step").css("opacity", "1")
					self.model.set("ketthucthanhtra", 1)
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
					// self.getApp().router.refresh();
					Backbone.history.history.back();
					// console.log('xxxxxxxxxxxxxxxxxxxxx',location.href)

					// self.getApp().getRouter().navigate(location.href)

					// console.log('xxxxxxxxxxxxxxxxxxxxx',location.href)
				})

			})
			var ketThucThanhTraTrangThai = self.model.get("ketthucthanhtra");
			if (ketThucThanhTraTrangThai != null) {
				btnSave.each(function () {
					btnSave.hide();
				})
				self.$el.find(".notify-end").attr("style", "display:block");
			}

		},


		hoso_luutru: function () {
			var self = this

			self.$el.find("#danhsach_hoso_luutru").append("")
		},

































































































		bindEventGD1: function () {
			var self = this;
			self.$el.find(".btn-add-member").unbind('click').bind('click', function () {
				var memberView = new ThanhVienThanhTraItemView();

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


			self.$el.find(".btn-save-gd1").unbind('click').bind('click', function () {
				var soquyetdinh = self.model.get("soquyetdinh");
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
				self.saveModel();
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
				self.saveModel();
			});


			self.$el.find(".btn-save-gd3").unbind('click').bind('click', function () {
				var danhsach_congviec_thanhtra = self.model.get("danhsach_congviec_thanhtra");
				if (danhsach_congviec_thanhtra === null || danhsach_congviec_thanhtra === "") {
					self.getApp().notify("Vui lòng nhập danh sách công việc");
					return;
				}
				self.saveModel();
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
				self.saveModel();
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
				self.saveModel();
			});


			//6
			self.$el.find(".btn-save-gd6").unbind('click').bind('click', function () {

				self.saveModel();
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
				self.saveModel();
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
				self.saveModel();
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
				self.saveModel();
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
				self.saveModel();
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
				self.saveModel();
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
				self.saveModel();
			});
		},
		saveModel: function () {
			var self = this;
			var kiemTraKetThucThanhTra = self.model.get("ketthucthanhtra");
			if (kiemTraKetThucThanhTra != 1) {
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
			// console.log("memberView====", memberView.$el);
			self.$el.find("#gd1-danhsachthanhvien").append(memberView.$el);
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
		updateStepStatus: function (step, ) {
			var self = this;
			var currentUser = self.getApp().currentUser;
			var trangthai = self.model.get("trangthai");

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
			//self.$el.find(".gd" + step +" .badge-pill").removeClass("bg-light border");
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

			if (self.model.get("danhsach_thanhvien") !== null
				&& self.model.get("soquyetdinh") !== null
				&& self.model.get("ngayquyetdinh") !== null) {
				return "success"
			}
			return "light";
		},
		check_gd2_sucees: function () {
			var self = this;
			if (self.model.get("sokehoach") !== null
				&& self.model.get("ngaylenkehoach") !== null) {
				return "success"
			}
			return "light";
		},

		check_gd3_sucees: function () {
			var self = this;
			if (self.model.get("danhsach_congviec_thanhtra") !== null
				&& self.model.get("danhsach_congviec_thanhtra") !== null
				&& self.model.get("danhsach_congviec_thanhtra").length > 0) {
				return "success"
			}
			return "light";
		},

		check_gd4_sucees: function () {
			var self = this;
			if (self.model.get("socongvan_yeucau") !== null
				&& self.model.get("ngayguicongvan_yeucau") !== null) {
				return "success"
			}
			return "light";
		},
		check_gd5_sucees: function () {
			var self = this;
			if (self.model.get("sovanban_thongbao_doituong_thanhtra") !== null
				&& self.model.get("ngay_vanban_thongbao_doituong_thanhtra") !== null) {
				return "success"
			}
			return "light";
		},
		check_gd6_sucees: function () {
			var self = this;
			self.$el.find(".gd6 .danger-reason").html("");
			var ngay_vanban_congbo_quyetdinh = self.model.get("ngay_vanban_congbo_quyetdinh");
			var ngayguicongvan_yeucau = self.model.get("ngayguicongvan_yeucau");
			var ngayquyetdinh = self.model.get("ngayquyetdinh");
			var danger = false;
			var danger_html = "";

			if (!!ngayguicongvan_yeucau && !!ngay_vanban_congbo_quyetdinh) {
				if ((ngay_vanban_congbo_quyetdinh - ngayguicongvan_yeucau) < 5 * 24 * 60 * 60) {
					danger_html = danger_html + "Công bố quyết định thanh tra quá sớm";
					danger = true;
				}
				if ((ngay_vanban_congbo_quyetdinh - ngayguicongvan_yeucau) > 15 * 24 * 60 * 60) {
					danger_html = danger_html + "Công bố quyết định thanh tra muộn hơn 15 ngày";
					danger = true;
				}

			}
			if (danger) {
				self.$el.find(".gd6 .danger-reason").html(danger_html);
				return "danger";
			}

			if (self.model.get("sovanban_congbo_quyetdinh") !== null
				&& self.model.get("ngay_vanban_congbo_quyetdinh") !== null) {
				return "success"
			}

			return "light";
		},
		check_gd7_sucees: function () {
			var self = this;
			if (self.model.get("so_thongbao_ketthuc_thanhtra") !== null
				&& self.model.get("ngay_thongbao_ketthuc_thanhtra") !== null) {
				return "success"
			}
			return "light";
		},
		check_gd8_sucees: function () {
			var self = this;
			var ngay_vanban_congbo_quyetdinh = self.model.get("ngay_vanban_congbo_quyetdinh");
			var ngay_vanban_doituong_giaitrinh = self.model.get("ngay_vanban_doituong_giaitrinh");

			if (!!ngay_vanban_congbo_quyetdinh) {
				var checkngay = moment().unix();
				if (!!ngay_vanban_doituong_giaitrinh) {
					checkngay = ngay_vanban_doituong_giaitrinh;
				}

				if ((checkngay - ngay_vanban_congbo_quyetdinh) > 45 * 24 * 60 * 60) {
					self.$el.find(".gd8 .danger-reason").html("Quá 45 ngày kể từ ngày gửi quyết định thanh tra");
					return "danger"
				}
			}
			return "light";
		},
		check_gd9_sucees: function () {
			var self = this;
			if (self.model.get("sovanban_giaitrinh") !== null
				&& self.model.get("ngay_vanban_doituong_giaitrinh") !== null);
		},
		check_gd10_sucees: function () {
			var self = this;
			if (self.model.get("so_quyetdinh_ketluanthanhtra") !== null
				&& self.model.get("ngay_quyetdinh_ketluanthanhtra") !== null);
		},
		check_gd11_sucees: function () {
			var self = this;
			if (self.model.get("ngay_congkhai_doituong_ketluanthanhtra") !== null);
		},
		check_gd12_sucees: function () {
			var self = this;
			if (self.model.get("ngay_bangiao_luutru") !== null);
		},
		check_gd13_sucees: function () {
			var self = this;
			if (self.model.get("ngay_bangiao_luutru") !== null);
		},
		check_gd14_sucees: function () {
			var self = this;
			if (self.model.get("ngay_bangiao_luutru") !== null);
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
						self.model.set("doanhnghiep", my_object);
						self.model.set("madoanhnghiep", my_object.id);
						self.model.set("tendoanhnghiep", my_object.name);
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


			self.$el.find(".upload_files").on("change", function () {
				var http = new XMLHttpRequest();
				var fd = new FormData();

				var data_attr = $(this).attr("data-attr");
				fd.append('file', this.files[0]);

				//fd.append('file', self.$el.find("#upload_files")[0].files[0]);

				http.open('POST', '/api/v1/upload/file');

				http.upload.addEventListener('progress', function (evt) {
					if (evt.lengthComputable) {
						var percent = evt.loaded / evt.total;
						percent = parseInt(percent * 100);

					}
				}, false);
				http.addEventListener('error', function () {
					// console.log("Upload error!");
				}, false);

				http.onreadystatechange = function () {
					if (http.status === 200) {
						if (http.readyState === 4) {
							var data_file = JSON.parse(http.responseText), link, p, t;
							self.getApp().notify("Tải file thành công");

							self.model.set(data_attr, data_file.link);
							self.saveModel();




							// var tailieu = self.model.get("tailieulienquan");
							// if(tailieu === null){
							// 	tailieu = [];
							// }
							// tailieu.push(data_file);
							// self.$el.find(".highlight").removeClass('d-none');
							// self.model.set("tailieulienquan",tailieu);
							// self.render_list_file(data_file, self);






							//	                        plink.html('');
							//	                        plink.html(link);
							//	                        status.show();
							//	                        progess.hide();
							//	                        totalupload=totalupload+1;
							//	                        txt_uploaded.val(totalupload+" file uploaded");

						}
					} else {
						self.getApp().notify("Không thể tải tệp tin lên máy chủ");
					}
				};
				http.send(fd);
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
				// console.log("timeline truong phong");
				var el_status_capphong = self.$el.find("#timeline .kehoach_send_review_capphong");
				el_status_capphong.addClass("complete");
				el_status_capphong.find('.author').html(data.username_phongduyet || "&nbsp;");
				var template_helper = new TemplateHelper();
				var ngaypheduyet_phong = template_helper.datetimeFormat(data.ngaypheduyet_phong, "DD/MM/YYYY");
				el_status_capphong.find('.date').html(ngaypheduyet_phong || "&nbsp;");
			}
			var arr_timeline_cucpho = ["completed", "result_checked", "checked", "cancel_approved", "approved", "send_approved"]
			if (arr_timeline_cucpho.indexOf(data.trangthai) >= 0) {
				var el_status_cucpho = self.$el.find("#timeline .kehoach_send_review_pct");
				el_status_cucpho.addClass("complete");
				el_status_cucpho.find('.author').html(data.username_pctduyet || "&nbsp;");
				var template_helper = new TemplateHelper();
				var ngaypheduyet_cucpho = template_helper.datetimeFormat(data.ngaypheduyet_pct, "DD/MM/YYYY");
				el_status_cucpho.find('.date').html(ngaypheduyet_cucpho || "&nbsp;");
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


	});

});