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

	var DanhSachChiNhanhDonViItemView = require('app/danhmucdoanhnghiep/view/DanhSachChiNhanhDonViView');
	var LichSuThanhTraItemView = require('app/danhmucdoanhnghiep/view/LichSuThanhTraView');

	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "danhmucdoanhnghiep",
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
								self.getApp().getRouter().navigate(self.collectionName + "/collection" +
									"?id=null" +
									"&tinhthanh_ID=" + self.getApp().getRouter().getParam("tinhthanh_ID") +
									"&chisotuanthu=" + self.getApp().getRouter().getParam("chisotuanthu") +
									"&linhvuc_ID=" + self.getApp().getRouter().getParam("linhvuc_ID") +
									"&sonamchuathanhtra=" + self.getApp().getRouter().getParam("sonamchuathanhtra") +
									"&solanthanhtra=" + self.getApp().getRouter().getParam("solanthanhtra")

								);
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
							var danhmuclinhvuc_foreign = [];
							self.$el.find("#multiselect_linhvuc option:selected").each(function () {
								var data_ck = $(this).attr('data-ck');
								var my_object = JSON.parse(decodeURIComponent(data_ck));
								if (my_object !== null) {
									danhmuclinhvuc_foreign.push(my_object);
								}
							});
							self.model.set("danhmuclinhvuc_foreign", danhmuclinhvuc_foreign);
							self.model.set("solanthanhtra", (self.model.get("lichsuthanhtra_field").length));
							var mangNam = [];
							self.model.get("lichsuthanhtra_field").forEach(function (item, index) {
								mangNam.push(item.nam)
							})
							if (self.model.get("namchuathanhtraganday") == null) {
								self.model.set("namchuathanhtraganday", 0);

							}
							if (self.model.get("solanthanhtra") == null) {
								self.model.set("solanthanhtra", 0);

							}
							else {
								var year = new Date();
								var namhientai = year.getFullYear();

								self.model.set("namchuathanhtraganday", namhientai - Math.max.apply(Math, mangNam));
							}

							self.model.save(null, {
								success: function (model, respose, options) {
									self.getApp().notify("Lưu thông tin thành công");
									self.getApp().getRouter().navigate(self.collectionName + "/collection");
									// self.getApp().getRouter().refresh();

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
					field: "tuanthuphapluat_chiso",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					dataSource: [
						{ "value": 1, "text": "Báo cáo đầy đủ" },
						{ "value": 2, "text": "Báo cáo không đầy đủ" },
						{ "value": 3, "text": "Không báo cáo" },
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
				{
					field: "danhsachchinhanhdonvi_field",
					uicontrol: false,
					itemView: DanhSachChiNhanhDonViItemView,
					tools: [{
						name: "create",
						type: "button",
						buttonClass: "btn btn-outline-secondary btn-fw btn-sm create-item",
						label: "<span class='fa fa-plus'></span>",
						command: "create"
					}],
					toolEl: "#add_row"
				},
			]
		},
		render: function () {
			var self = this;
			var id = this.getApp().getRouter().getParam("id");
			self.$el.find(".filter-option-inner-inner").selectpicker("810810af-c49e-4e37-b9e5-c66fb986bbf5")


			self.getLinhvucs();
			self.checkLinhVuc();
			// self.lichSuThanhTra();

			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {

						self.applyBindings();

						self.checkLinhVuc();
						self.lichSuThanhTra();
						self.themVaoKeHoachNamSau();

						self.model.on("change:tinhthanh_id", function () {
							console.log("change tinh thanhxxxxxxxxxxxxxxxxxx");
							self.getFieldElement("quanhuyen").data("gonrin").setFilters({ "tinhthanh_id": { "$eq": self.model.get("tinhthanh_id") } });
						});
						self.model.on("change:quanhuyen_id", function () {
							self.getFieldElement("xaphuong").data("gonrin").setFilters({ "quanhuyen_id": { "$eq": self.model.get("quanhuyen_id") } });
						});

						var danhmuclinhvuc_foreign = self.model.get("danhmuclinhvuc_foreign");
						var val_danhmuclinhvuc_foreign = [];
						if (val_danhmuclinhvuc_foreign !== null) {
							for (var i = 0; i < danhmuclinhvuc_foreign.length; i++) {
								val_danhmuclinhvuc_foreign.push(danhmuclinhvuc_foreign[i].id);
							}
						}
						self.$el.find("#multiselect_linhvuc").selectpicker('val', val_danhmuclinhvuc_foreign);
						var x;
						var y;
						var z;
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

						var arr = self.$el.find("tr td #stt")
						arr.each(function (item, index) {
							index.value = item + 1;
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
						} catch (err) {
							self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
						}
					}
				});
			} else {
				self.applyBindings();
				self.model.on("change:tinhthanh_id", function () {
					console.log("change tinh thanh", self.model.get("tinhthanh_id"));
					self.getFieldElement("quanhuyen").data("gonrin").setFilters({ "tinhthanh_id": { "$eq": self.model.get("tinhthanh_id") } });
				});
				self.model.on("change:quanhuyen_id", function () {
					self.getFieldElement("xaphuong").data("gonrin").setFilters({ "quanhuyen_id": { "$eq": self.model.get("quanhuyen_id") } });
					console.log("change quanhuyen", self.model.get("quanhuyen_id"));
				});
			}

		},
		getLinhvucs: function () {
			var self = this;
			var url = self.getApp().serviceURL + "/api/v1/danhmuclinhvuc";
			$.ajax({
				url: url,
				method: "GET",
				contentType: "application/json",
				success: function (data) {

					self.$el.find("#multiselect_linhvuc").html("");
					for (var i = 0; i < data.objects.length; i++) {
						var item = data.objects[i];
						var data_str = encodeURIComponent(JSON.stringify(item));
						var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.tenlinhvuc)
						self.$el.find("#multiselect_linhvuc").append(option_elm);
					}
					$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
					var danhmuclinhvuc_foreign = self.model.get("danhmuclinhvuc_foreign");
					var val_danhmuclinhvuc_foreign = [];
					if (val_danhmuclinhvuc_foreign !== null) {
						for (var i = 0; i < danhmuclinhvuc_foreign.length; i++) {
							val_danhmuclinhvuc_foreign.push(danhmuclinhvuc_foreign[i].id);
						}
					} -
						self.$el.find("#multiselect_linhvuc").selectpicker('val', val_danhmuclinhvuc_foreign);
				},
				error: function (xhr, status, error) {
					console.log("Không lấy được dữ liệu linh vuc");
				},
			});




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
		checkLinhVuc: function () {
			var self = this;
			var linhvuc = self.$el.find("#multiselect_linhvuc");
			var linhVucID = self.model.get("danhmuclinhvuc_foreign");
			var dem = 0;
			linhVucID.forEach(function (item) {
				if (item.malinhvuc == "NS") {
					dem++;
				}
				if (dem > 0) {
					self.$el.find(".quymodonvi").show();
				}
				else {
					self.$el.find(".quymodonvi").hide();
					self.model.set("quymodonvi", null)
				}
			})
			var url = self.getApp().serviceURL + "/api/v1/danhmuclinhvuc";
			$.ajax({
				url: url,
				method: "GET",
				contentType: "application/json",
				success: function (data) {
					data.objects.forEach(function (item, index) {
						if (item.malinhvuc == "NS") {

							linhvuc.on("change", function () {
								var linhVucID2 = linhvuc.val();
								var dem2 = 0;
								linhVucID2.forEach(function (item2, index) {
									if (item.id == item2) {
										dem2++;
									}
									if (dem2 > 0) {
										self.$el.find(".quymodonvi").show();
									}
									else {
										self.$el.find(".quymodonvi").hide();
										self.model.set("quymodonvi", null)

									}
								});
							});




						}
					})
				},
				error: function (xhr, status, error) {
					console.log("Không lấy được dữ liệu linh vuc");
				},
			});


		},
		lichSuThanhTra: function () {
			var self = this;
			var dvHienTai = self.model.get("code");
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra",
				method: "GET",
				contentType: "application/json",
				success: function (data) {
					data.objects.forEach(function (item, index) {
						if (item.doanhnghiep.code === dvHienTai) {

							var demsll = 0;
							$.ajax({
								url: self.getApp().serviceURL + "/api/v1/lichsuthanhtra",
								method: "GET",
								contentType: "application/json",
								success: function (data) {
									data.objects.forEach(function (itemLSTT, index) {

										if (parseInt(itemLSTT.nam) == moment(item.ngaythanhtra * 1000).year() && itemLSTT.danhmucdoanhnghiep_id == self.model.get("id")) {
											demsll++;
										}

									})
									if (demsll == 0) {
										var param = {
											id: gonrin.uuid(),
											nam: moment(item.ngaythanhtra * 1000).year(),
											kehoachthanhtra_id: item.id,
											danhmucdoanhnghiep_id: self.model.get("id")
										};
										$.ajax({
											url: self.getApp().serviceURL + "/api/v1/lichsuthanhtra",
											type: 'POST',
											data: JSON.stringify(param),
											headers: {
												'content-type': 'application/json'
											},
											dataType: 'json',
											success: function (data) {

											},
											error: function (request, textStatus, errorThrown) {
												console.log(request);
											}
										})
									}
								},
								error: function (xhr, status, error) {
									console.log("Không lấy được dữ liệu");
								},
							});




						}
					})
				},
				error: function (xhr, status, error) {
					console.log("Không lấy được dữ liệu");
				},
			});





			var ds_lichSuThanhTra = self.model.get("lichsuthanhtra_field");
			if (!ds_lichSuThanhTra) {
				ds_lichSuThanhTra = [];
			}
			var containerEl = self.$el.find("#space_lichsuthanhtra");
			containerEl.empty();

			// var dataSource = lodash.orderBy(ds_lichSuThanhTra, ['created_at'], ['asc']);
			ds_lichSuThanhTra.forEach((item, index) => {

				var view = new LichSuThanhTraItemView();
				view.$el.find("#itemRemove").on("click", function () {
					var arr = [];
					self.model.get("lichsuthanhtra_field").forEach(function (item2, index2) {
						if (item2.id != item.id) {
							arr.push(item2)
						}
					})
					self.model.set("lichsuthanhtra_field", arr)
					self.model.set("solanthanhtra", (self.model.get("lichsuthanhtra_field").length));
					$(view.el).hide()
				})

				view.model.set(item);
				view.render();
				$(view.el).hide().appendTo(containerEl).fadeIn();
				view.on("change", (data) => {
					var ds_lichSuThanhTra = self.model.get("lichsuthanhtra_field");
					ds_lichSuThanhTra.forEach((item, index) => {
						if (item.id == data.id) {

							ds_lichSuThanhTra[index] = data;
						}
					});
					self.model.set("lichsuthanhtra_field", ds_lichSuThanhTra);
				});
			});


			self.$el.find("#btn_add_lichsuthanhtra_field").on("click", (eventClick) => {
				var view = new LichSuThanhTraItemView();


				view.model.save(null, {
					success: function (model, respose, options) {
						view.model.set(respose);
						view.render();
						$(view.el).hide().appendTo(containerEl).fadeIn();

						// PUSH THE CHILD TO LIST
						var ds_lichSuThanhTra = self.model.get("lichsuthanhtra_field");
						if (!ds_lichSuThanhTra) {
							ds_lichSuThanhTra = [];
						}
						ds_lichSuThanhTra.push(view.model.toJSON());
						self.model.set("lichsuthanhtra_field", ds_lichSuThanhTra);
						self.model.save(null, {
							success: function (model, respose, options) {
								// NOTIFY TO GRANPARENT
								self.trigger("change", self.model.toJSON());
							},
							error: function (xhr, status, error) {
							}
						});

						view.on("change", (data) => {
							var ds_lichSuThanhTra = self.model.get("lichsuthanhtra_field");
							if (!ds_lichSuThanhTra) {
								ds_lichSuThanhTra = [];
							}
							ds_lichSuThanhTra.forEach((item, index) => {
								if (item.id == data.id) {
									ds_lichSuThanhTra[index] = data;
								}
							});

							self.model.set("lichsuthanhtra_field", ds_lichSuThanhTra);
							self.model.save(null, {
								success: function (model, respose, options) {
									// NOTIFY TO GRANPARENT
									self.trigger("change", self.model.toJSON());
								},
								error: function (xhr, status, error) {
								}
							});
						});
					},
					error: function (xhr, status, error) {
						// HANDLE ERROR
					}
				});
			});


			// var viewLichSu = new LichSuThanhTraItemView();
			// self.$el.find("tr td #itemRemove").each(function (item,index) {  
			// 	self.$el.find("#"+index.id).on("click",function () {
			// 		console.log("xxxx",item)
			// 	})
			// 					
			// })


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
							console.log(year + 1)
							console.log(item.nam)

							if (item.nam == year + 1) {
								dem++;
							}
						})

						console.log(dem)
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