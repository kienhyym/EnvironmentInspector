define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/danhmucdoanhnghiep/tpl/model.html'),
		schema = require('json!schema/DanhMucDoanhNghiepSchema.json');
	var XaPhuongSelectView = require('app/DanhMuc/XaPhuong/view/SelectView');
	var QuanHuyenSelectView = require('app/DanhMuc/QuanHuyen/view/SelectView');
	var TinhThanhSelectView = require('app/DanhMuc/TinhThanh/view/SelectView');

	var XaPhuongDialogView = require('app/DanhMuc/XaPhuong/view/DialogView');
	var QuanHuyenDialogView = require('app/DanhMuc/QuanHuyen/view/DialogView');
	var TinhThanhDialogView = require('app/DanhMuc/TinhThanh/view/DialogView');
	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "danhmucdoanhnghiep",
		selectTinhThanh: null,
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
							if (self.getApp().currentUser.hasRole("CucTruong")) {
								self.getApp().getRouter().navigate(self.collectionName + "/collection");
							}
						},
						visible: function () {
							return this.getApp().currentUser.hasRole("CucTruong");
						}
					},
					{
						name: "save",
						type: "button",
						buttonClass: "btn-success btn-sm",
						label: "TRANSLATE:SAVE",
						visible: function () {
							return this.getApp().currentUser.hasRole("CucTruong");
						},
						command: function () {
							var self = this;
							if (self.$el.find('.chonlinhvuc select').selectpicker('val').length == 0) {
								self.getApp().notify({ message: "Bạn chưa chọn lĩnh vực" }, { type: "danger", delay: 1000 });
								return false
							}
							if (self.model.get('name') == null) {
								self.getApp().notify({ message: "Bạn chưa chọn viết tên doanh nghiệp" }, { type: "danger", delay: 1000 });
								return false
							}
							if (self.model.get('tinhthanh_id') == null) {
								self.getApp().notify({ message: "Bạn chưa chọn tỉnh thành" }, { type: "danger", delay: 1000 });
								return false
							}
							if (self.model.get('quanhuyen_id') == null) {
								self.getApp().notify({ message: "Bạn chưa chọn quận huyện" }, { type: "danger", delay: 1000 });
								return false
							}
							if (self.model.get('xaphuong_id') == null) {
								self.getApp().notify({ message: "Bạn chưa chọn xã phường" }, { type: "danger", delay: 1000 });
								return false
							}
							if (self.model.get('diachi') == null) {
								self.getApp().notify({ message: "Bạn chưa viết địa chỉ" }, { type: "danger", delay: 1000 });
								return false
							}
							// Chọn lĩnh vực trước khi lưu
							var keHoachThanhTraForeign = self.model.get('kehoachthanhtra_foreign');

							keHoachThanhTraForeign.forEach(function (item, index) {
								if (item.trangthai == "approved" || item.trangthai == "end_checked" || item.trangthai == "completed") {
									delete item.stt;
								}
							})
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
										self.model.set('danhmuclinhvuc_foreign', response.objects)
										self.model.save(null, {
											success: function (model, respose, options) {
												self.model.set('tentinhthanh', respose.tinhthanh.ten)
												self.model.set('tenquanhuyen', respose.quanhuyen.ten)
												self.model.set('tenxaphuong', respose.xaphuong.ten)
												self.model.save(null, {
													success: function (model, respose, options) {
														self.getApp().notify("Lưu thông tin thành công");
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
						}
					},
					{
						name: "delete",
						type: "button",
						buttonClass: "btn-danger btn-sm",
						label: "TRANSLATE:DELETE",
						visible: function () {
							return (this.getApp().currentUser.hasRole("CucTruong") && this.getApp().getRouter().getParam("id") !== null);
						},
						command: function () {
							var self = this;
							self.model.destroy({
								success: function (model, response) {
									self.getApp().notify('Xoá dữ liệu thành công');
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
										self.getApp().notify({ message: "Xóa dữ liệu không thành công" }, { type: "danger", delay: 1000 });
									}
								}
							});
						}
					},
				],
			}],
		uiControl: {
			fields: [
				{
					field: "xaphuong",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "xaphuong_id",
					dataSource: XaPhuongSelectView
				},
				{
					field: "quanhuyen",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "quanhuyen_id",
					dataSource: QuanHuyenSelectView
				},
				{
					field: "tinhthanh",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "tinhthanh_id",
					dataSource: TinhThanhSelectView
				},
				{
					field: "chisotuanthuphapluat",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					dataSource: [
						{ "value": "baocaodaydu", "text": "Báo cáo đầy đủ" },
						{ "value": "baocaokhongdaydu", "text": "Báo cáo không đầy đủ" },
						{ "value": "khongbaocao", "text": "Không báo cáo" },
						{ "value": "viphamhanhchinh", "text": "Vi phạm hành chính" },
					],


				},
				{
					field: "quymodonvi",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					dataSource: [
						{ "value": 1, "text": "Trên 1000m3" },
						{ "value": 2, "text": "Dưới 1000m3" },


					],
				},
			]
		},
		render: function () {
			var self = this;
			var id = this.getApp().getRouter().getParam("id");
			self.chonLinhVuc();
			self.themChiNhanh();
			self.checkLinhVuc1();
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						self.lichSuThucHienThanhTra();
						self.applyBindings();
						self.chonLinhVuc();
						self.hienThiLinhVuc();
						self.danhSachChiNhanh();
						self.themChiNhanh();
						self.themVaoKeHoachNamSau();
						self.checkLinhVuc2();
						self.model.on("change:tinhthanh_id", function () {
							self.getFieldElement("quanhuyen").data("gonrin").setFilters({ "tinhthanh_id": { "$eq": self.model.get("tinhthanh_id") } });
						});
						self.model.on("change:quanhuyen_id", function () {
							self.getFieldElement("xaphuong").data("gonrin").setFilters({ "quanhuyen_id": { "$eq": self.model.get("quanhuyen_id") } });
						});


						var x, y, z;
						if (self.model.get('xaphuong') == null) {
							y = "";
						}
						else {
							y = self.model.get('xaphuong').ten;
						}
						if (self.model.get('quanhuyen') == null) {
							z = "";
						}
						else {
							z = self.model.get('quanhuyen').ten;
						}
						if (self.model.get('diachi') == null) {
							x = "";
						}
						else {
							x = self.model.get('diachi');
						}
						self.$el.find("#diachitrusochinh").val(x + ' ' + y + ' ' + z);

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
			} else {
				self.applyBindings();
				self.$el.find('.bangdanhsachchinhanh').hide()
				self.$el.find('.banglichsuthanhtra').hide()
				self.model.on("change:tinhthanh_id", function () {
					self.getFieldElement("quanhuyen").data("gonrin").setFilters({ "tinhthanh_id": { "$eq": self.model.get("tinhthanh_id") } });
				});
				self.model.on("change:quanhuyen_id", function () {
					self.getFieldElement("xaphuong").data("gonrin").setFilters({ "quanhuyen_id": { "$eq": self.model.get("quanhuyen_id") } });
				});
			}

		},

		validateEmail: function (email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(String(email).toLowerCase());
		},
		validatePhone: function (inputPhone) {
			if (inputPhone == null || inputPhone == undefined) {
				return false;
			}
			var phoneno = /(09|08|07|05|03)+[0-9]{8}/g;
			const result = inputPhone.match(phoneno);
			if (result && result == inputPhone) {
				return true;
			} else {
				return false;
			}
		},
		checkLinhVuc1: function () {
			var self = this;
			self.$el.find('.chonlinhvuc select').on('change.bs.select', function (e, clickedIndex, isSelected, previousValue) {
				var filters = {
					filters: {
						"$and": [
							{ "id": { "$in": self.$el.find('.chonlinhvuc select').selectpicker('val') } }
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
						var dem = 0;
						response.objects.forEach(function (item, index) {
							if (item.grouplinhvuc === "Nước sạch") {
								dem++;
							}
						})
						if (dem > 0) {
							self.$el.find(".quymodonvi").show();
						}
						else {
							self.$el.find(".quymodonvi").hide();
							self.model.set("quymodonvi", null)
						}
					}
				});
			});
		},
		checkLinhVuc2: function () {
			var self = this;

			var dem = 0;
			self.model.get('danhmuclinhvuc_foreign').forEach(function (item, index) {
				if (item.grouplinhvuc === "Nước sạch") {
					dem++;
				}
			})
			if (dem > 0) {
				self.$el.find(".quymodonvi").show();
			}
			else {
				self.$el.find(".quymodonvi").hide();
				self.model.set("quymodonvi", null)
			}


		},
		hienThiLinhVuc: function () {
			var self = this;
			var linhVuc = [];
			self.model.get('danhmuclinhvuc_foreign').forEach(function (item, index) {
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
				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});


		},

		danhSachChiNhanh: function () {
			var self = this;
			self.$el.find('#diachitrusochinh').text(
				self.model.get('diachi') + ', ' +
				self.model.get('xaphuong').ten + ', ' +
				self.model.get('quanhuyen').ten + ', ' +
				self.model.get('tinhthanh').ten);
			var filters = {
				filters: {
					"$and": [
						{ "danhmucdoanhnghiep_id": { "$eq": self.model.get('id') } }
					]
				},
				order_by: [{ "field": "created_at", "direction": "asc" }]
			}
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhsachchinhanhdonvi?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				data: "q=" + JSON.stringify(filters),
				contentType: "application/json",
				success: function (data) {
					data.objects.forEach(function (item, index) {
						self.$el.find('.bangdanhsachchinhanh').append(`
						<tr>
							<td  class = "text-center">${index + 2} </td>
							<td>${item.tenchinhanh}</td>
							<td>${item.diachichinhanh}, ${item.xaphuong.ten}, ${item.quanhuyen.ten}, ${item.tinhthanh.ten}</td>
							<td>
							<button class = "btn btn-warning p-1 mr-1 suaChiNhanh" data-id ="${item.id}">sửa</bunton>
							<button class = "btn btn-danger p-1 mr-1 xoaChiNhanh" data-id ="${item.id}" >xóa</bunton>
							</td>
						</tr>`
						)
					})

					self.xoaChiNhanh();
					self.suaChiNhanh();

				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});

		},
		xoaChiNhanh: function () {
			var self = this;
			self.$el.find('.xoaChiNhanh').each(function (index, item) {
				$(item).unbind('click').bind('click', function () {
					$.ajax({
						url: self.getApp().serviceURL + "/api/v1/danhsachchinhanhdonvi/" + $(item).attr('data-id'),
						type: 'DELETE',
						headers: {
							'content-type': 'application/json'
						},
						success: function (data) {
							self.getApp().notify("Xóa chi nhánh thành công");
							self.getApp().getRouter().refresh();
						},
						error: function (request, textStatus, errorThrown) {
						}
					})
				})
			})
		},
		suaChiNhanh: function () {
			var self = this;
			self.$el.find('.suaChiNhanh').each(function (index, item) {
				$(item).unbind('click').bind('click', function () {
					self.$el.find('.btn-luu').hide();
					self.$el.find('.btn-sua').show();

					self.$el.find(".formthemchinhanh").toggle();
					self.$el.find(".content-main").css('opacity', '0.1');
					self.$el.find("#them").hide();
					var filters = {
						filters: {
							"$and": [
								{ "id": { "$eq": $(item).attr('data-id') } }
							]
						},
						order_by: [{ "field": "created_at", "direction": "asc" }]
					}
					$.ajax({
						url: self.getApp().serviceURL + "/api/v1/danhsachchinhanhdonvi?results_per_page=100000&max_results_per_page=1000000",
						method: "GET",
						data: "q=" + JSON.stringify(filters),
						contentType: "application/json",
						success: function (data) {
							data.objects.forEach(function (item, index) {
								self.$el.find("#tenchinhanh").val(item.tenchinhanh);
								self.$el.find("#tentinhthanh").val(item.tinhthanh.ten);
								self.$el.find("#tenquanhuyen").val(item.quanhuyen.ten);
								self.$el.find("#tenxaphuong").val(item.xaphuong.ten);
								self.$el.find("#diachichinhanh").val(item.diachichinhanh);
								self.themChiNhanh(item);
							})
						},
						error: function (xhr, status, error) {
							self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
						},
					});
				})
			})
		},
		themChiNhanh: function (item) {
			var self = this;
			var tinhThanhDialogView = new TinhThanhDialogView();
			var idXaPhuong = null;
			var XaPhuong = null;
			var idQuanHuyen = null;
			var QuanHuyen = null;
			var idTinhThanh = null;
			var TinhThanh = null;

			if (item !== undefined) {
				idXaPhuong = item.xaphuong_id;
				XaPhuong = item.xaphuong;
				idQuanHuyen = item.quanhuyen_id;
				QuanHuyen = item.quanhuyen;
				idTinhThanh = item.tinhthanh_id;
				TinhThanh = item.tinhthanh;
			}

			self.$el.find('#them').unbind('click').bind('click', function () {
				self.$el.find(".formthemchinhanh").toggle();
				self.$el.find(".content-main").css('opacity', '0.1');
				self.$el.find("#them").hide();
				self.$el.find('.btn-sua').hide();
				self.$el.find('.btn-luu').show();
				self.$el.find("#tenchinhanh").val(null);
				self.$el.find("#tentinhthanh").val(null);
				self.$el.find("#tenquanhuyen").val(null);
				self.$el.find("#tenxaphuong").val(null);
				self.$el.find("#diachichinhanh").val(null);
			});

			self.$el.find('.close').unbind('click').bind('click', function () {
				self.$el.find(".content-main").css('opacity', '1');
				self.$el.find(".formthemchinhanh").toggle();
				self.$el.find("#them").show();
			});


			self.$el.find('#selectXaPhuong').unbind('click').bind('click', function () {
				var xaPhuongDialogView = new XaPhuongDialogView({
					viewData: {
						"selectQuanHuyen": self.selectQuanHuyen
					}
				});
				xaPhuongDialogView.dialog();
				xaPhuongDialogView.on('seleted', (data) => {
					self.$el.find('#tenxaphuong').val(data.ten)
					idXaPhuong = data.id;
					XaPhuong = data;
					self.$el.find('#tenxaphuong').css('border', '1px solid green');
				});
			})

			self.$el.find('#selectQuanHuyen').unbind('click').bind('click', function () {
				var quanHuyenDialogView = new QuanHuyenDialogView({
					viewData: {
						"selectTinhThanh": self.selectTinhThanh
					}
				});

				quanHuyenDialogView.dialog();
				quanHuyenDialogView.on('seleted', (data) => {
					self.$el.find('#tenquanhuyen').val(data.ten)
					idQuanHuyen = data.id;
					QuanHuyen = data;
					self.$el.find('#tenquanhuyen').css('border', '1px solid green');
					self.selectQuanHuyen = data;

				});
			});


			self.$el.find('#selectTinhThanh').unbind('click').bind('click', function () {
				tinhThanhDialogView.dialog();
				tinhThanhDialogView.on('seleted', (data) => {
					self.$el.find('#tentinhthanh').val(data.ten)
					idTinhThanh = data.id;
					TinhThanh = data;
					self.$el.find('#tentinhthanh').css('border', '1px solid green');
					self.selectTinhThanh = data;
				});
			})

			//kiểm tra có bỏ trống thông tin không thì đổi màu ô input
			self.$el.find('.form-thongtinchinhanh').each(function (index, item) {
				$(item).keyup(function () {
					if ($(item).val() == null || $(item).val() == "") {
						$(item).css('border', '1px solid red');
					} else {
						$(item).css('border', '1px solid green');
					}
				});
			})
			//Thêm chi nhánh mới
			self.$el.find('.btn-luu').unbind('click').bind('click', function () {
				if (self.kiemTraCanCo() == true) {
					if (self.model.get('id') == null) {
						self.model.save(null, {
							success: function (model, respose, options) {
								self.getApp().notify("Lưu thông tin thành công");
								var param = {
									id: gonrin.uuid(),
									tenchinhanh: self.$el.find('#tenchinhanh').val(),
									diachichinhanh: self.$el.find('#diachichinhanh').val(),
									tinhthanh_id: idTinhThanh,
									tinhthanh: TinhThanh,
									quanhuyen_id: idQuanHuyen,
									quanhuyen: QuanHuyen,
									xaphuong_id: idXaPhuong,
									xaphuong: XaPhuong,
									danhmucdoanhnghiep_id: self.model.get('id')
								};
								$.ajax({
									url: self.getApp().serviceURL + "/api/v1/danhsachchinhanhdonvi",
									type: 'POST',
									data: JSON.stringify(param),
									headers: {
										'content-type': 'application/json'
									},
									dataType: 'json',
									success: function (data) {
										self.getApp().notify("Thêm chi nhánh thành công");
										window.location = self.getApp().serviceURL + "#danhmucdoanhnghiep/model?id=" + respose.id;
									},
									error: function (request, textStatus, errorThrown) {
									}
								})
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
					var param = {
						id: gonrin.uuid(),
						tenchinhanh: self.$el.find('#tenchinhanh').val(),
						diachichinhanh: self.$el.find('#diachichinhanh').val(),
						tinhthanh_id: idTinhThanh,
						tinhthanh: TinhThanh,
						quanhuyen_id: idQuanHuyen,
						quanhuyen: QuanHuyen,
						xaphuong_id: idXaPhuong,
						xaphuong: XaPhuong,
						danhmucdoanhnghiep_id: self.model.get('id')
					};
					$.ajax({
						url: self.getApp().serviceURL + "/api/v1/danhsachchinhanhdonvi",
						type: 'POST',
						data: JSON.stringify(param),
						headers: {
							'content-type': 'application/json'
						},
						dataType: 'json',
						success: function (data) {
							self.$el.find(".content-main").css('opacity', '1');
							self.$el.find(".formthemchinhanh").toggle();
							self.$el.find("#them").show();
							self.getApp().notify("Thêm chi nhánh thành công");
							self.getApp().getRouter().refresh();
						},
						error: function (request, textStatus, errorThrown) {
						}
					})
				}

			})
			//sửa thông tin chi nhánh
			self.$el.find('.btn-sua').unbind('click').bind('click', function () {
				if(self.$el.find('#tenchinhanh').val() == null || self.$el.find('#tenchinhanh').val() == ""){
					self.getApp().notify({ message: "Tên chi nhánh không được để trống" }, { type: "danger", delay: 1000 });
					return false;
				}
				if(self.$el.find('#diachichinhanh').val() == null || self.$el.find('#diachichinhanh').val() == ""){
					self.getApp().notify({ message: "Địa chỉ chi nhánh không được để trống" }, { type: "danger", delay: 1000 });
					return false;
				}
				var param = {
					tenchinhanh: self.$el.find('#tenchinhanh').val(),
					diachichinhanh: self.$el.find('#diachichinhanh').val(),
					tinhthanh_id: idTinhThanh,
					tinhthanh: TinhThanh,
					quanhuyen_id: idQuanHuyen,
					quanhuyen: QuanHuyen,
					xaphuong_id: idXaPhuong,
					xaphuong: XaPhuong,
				};
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/danhsachchinhanhdonvi/" + item.id,
					type: 'PUT',
					data: JSON.stringify(param),
					headers: {
						'content-type': 'application/json'
					},
					dataType: 'json',
					success: function (data) {
						self.$el.find(".content-main").css('opacity', '1');
						self.$el.find(".formthemchinhanh").toggle();
						self.$el.find("#them").show();
						self.getApp().notify(" Sửa thông tin chi nhánh thành công");
						self.getApp().getRouter().refresh();
					},
					error: function (request, textStatus, errorThrown) {
					}
				})
			})

		},
		//kiểm tra xem có để trống ô thông tin chi nhánh nào không? Không thì trả về true/ có thì trả về false
		kiemTraCanCo: function () {
			var self = this;
			var dem = 0;
			self.$el.find('.form-thongtinchinhanh').each(function (index, item) {
				if ($(item).val() === null || $(item).val() === "") {
					$(item).css('border', '1px solid red')
				} else {
					$(item).css('border', '1px solid green');
					dem++;
				}
			})
			if (dem == 5) {
				return true
			}
			else {
				self.getApp().notify({ message: "Các trường không được bỏ trống, yêu cầu nhập đầy đủ các trường có dấu (*)  hay các ô bị viền đỏ" }, { type: "danger", delay: 1000 });
				return false
			}
		},

		lichSuThucHienThanhTra: function () {
			var self = this;
			var keHoachThanhTraForeign = self.model.get('kehoachthanhtra_foreign');
			var arrayLichSu = [];
			keHoachThanhTraForeign.forEach(function (item, index) {
				if (item.trangthai == "approved" || item.trangthai == "end_checked" || item.trangthai == "completed") {
					item.stt = index + 1;
					arrayLichSu.push(item)
				}
			})
			self.$el.find('#grid').grid({
				orderByMode: "client",
				language: {
					no_records_found: "Chưa có dữ liệu"
				},
				noResultsClass: "alert alert-default no-records-found",
				fields: [
					{ field: "stt", label: "STT" },
					{
						field: "ngaythanhtra", label: "Ngày thanh tra",
						template: function (rowData) {
							if (!!rowData && rowData.ngaythanhtra) {
								var utcTolocal = function (times, format) {
									return moment(times * 1000).local().format(format);
								}
								return utcTolocal(rowData.ngaythanhtra, "DD/MM/YYYY");
							}
							return "";
						},
					},
					{
						field: "trangthai",
						label: "Trạng thái",
						template: function (rowData) {
							if (rowData.trangthai == "approved") {
								return "Đang được thanh tra";
							}
							if (rowData.trangthai == "end_checked") {
								return "Thanh tra đã kết thúc";
							}
							if (rowData.trangthai == "completed") {
								return "Đã hoàn thành thanh tra";
							}
							return "";
						}
					},
					{ label: "Chi tiết", template: "<div class='badge badge-primary text-center'>xem</div>" },
				],
				dataSource: arrayLichSu,
				primaryField: "id",
				selectionMode: false,
				pagination: {
					page: 1,
					pageSize: 10
				},
				events: {
					"rowclick": function (e) {
						self.getApp().getRouter().navigate("kehoachthanhtra/model?id=" + e.rowId);
					},
				},
			});
			self.$el.find('#grid #tbl_container_grid #tbl_grid').removeClass('table-striped')
			self.$el.find('#grid #tbl_container_grid #tbl_grid').addClass('text-center')
		},
		themVaoKeHoachNamSau: function () {
			var self = this;
			self.$el.find("#themvaonamsau").unbind("click").on("click", function () {
				var d = new Date();
				var year = d.getFullYear();
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/kehoachnamsau",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						var dem = 0;
						data.objects.forEach(function (item) {
							if (item.nam == year + 1) {
								dem++;
							}
						})

						var param = {
							id: gonrin.uuid(),
							nam: year + 1
						};
						if (dem == 0) {
							self.$el.find("#namsau").text(year + 1)
							self.$el.find("#namsau").css("font-weight", "bold")
							self.$el.find(".notify-taokehoachnamsau").css({ "display": "block", "position": "fixed", "top": "150px", "left": "350px", "z-index": "999999" });
							self.$el.find("#yes-taongay").unbind("click").on("click", function () {
								$.ajax({
									url: self.getApp().serviceURL + "/api/v1/kehoachnamsau",
									type: 'POST',
									data: JSON.stringify(param),
									headers: {
										'content-type': 'application/json'
									},
									dataType: 'json',
									success: function (data) {
										self.getApp().notify("Giờ bạn có thể thêm đơn vị vào kế hoạch năm sau");
										self.$el.find(".notify-taokehoachnamsau").css({ "display": "none", "position": "fixed", "top": "150px", "left": "350px", "z-index": "999999" });


									},
									error: function (request, textStatus, errorThrown) {
									}
								})
							})
							self.$el.find("#no-khongtao").unbind("click").on("click", function () {
								self.$el.find(".notify-taokehoachnamsau").css({ "display": "none", "position": "fixed", "top": "150px", "left": "350px", "z-index": "999999" });
							})
						}

					},
					error: function (xhr, status, error) {
					},
				});





				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/kehoachnamsau",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						data.objects.forEach(function (item) {


							if (item.nam == year + 1) {


								var param = {
									id: gonrin.uuid(),
									tendonvi: self.model.get("name"),
									donvi_id: self.model.get("id"),
									kehoachnamsau_id: item.id,
								};
								$.ajax({
									url: self.getApp().serviceURL + "/api/v1/danhsachdonvikehoachnamsau",
									type: 'POST',
									data: JSON.stringify(param),
									headers: {
										'content-type': 'application/json'
									},
									dataType: 'json',
									success: function (data) {
										self.getApp().notify("Đã thêm vào năm sau thành công");

										tienSuBenhTatBanThanItemView.$el.find("#itemRemove").unbind("click").bind("click", function () {

											var dataTienSuBenhTatBanThan = self.model.get("tiensubenhtatbanthan");
											for (var i = 0; i < dataTienSuBenhTatBanThan.length; i++) {
												if (dataTienSuBenhTatBanThan[i].id === tienSuBenhTatBanThanItemView.model.get("id")) {
													dataTienSuBenhTatBanThan.splice(i, 1);
												}
											}
											self.model.set("tiensubenhtatbanthan", dataTienSuBenhTatBanThan);
											self.applyBinding("tiensubenhtatbanthan");
											tienSuBenhTatBanThanItemView.destroy();
											tienSuBenhTatBanThanItemView.remove();
										});
									},
									error: function (request, textStatus, errorThrown) {
									}
								})





							}
						})
					},
					error: function (xhr, status, error) {
					},
				});

			})


		}




	});

});