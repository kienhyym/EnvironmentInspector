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
							var danhmuclinhvuc_foreign = [];
							self.$el.find("#multiselect_linhvuc option:selected").each(function () {
								var data_ck = $(this).attr('data-ck');
								var my_object = JSON.parse(decodeURIComponent(data_ck));
								if (my_object !== null) {
									danhmuclinhvuc_foreign.push(my_object);
								}
							});
							self.model.set("danhmuclinhvuc_foreign", danhmuclinhvuc_foreign);
							console.log('self.model.set("danhmuclinhvuc_foreign", danhmuclinhvuc_foreign)', self.model.set("danhmuclinhvuc_foreign", danhmuclinhvuc_foreign))

							self.model.save(null, {
								success: function (model, respose, options) {
									self.getApp().notify("Lưu thông tin thành công");
									// self.getApp().getRouter().navigate(self.collectionName + "/collection");
									self.getApp().getRouter().refresh();

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
						{ "value": 1, "text": "1 sao" },
						{ "value": 2, "text": "2 sao" },
						{ "value": 3, "text": "3 sao" },
						{ "value": 4, "text": "4 sao" },
						{ "value": 5, "text": "5 sao" },
					],


				},
				{
					field: "quymodonvi",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					dataSource: [
						{ "value": 1, "text": "dưới 50 lao động" },
						{ "value": 2, "text": "từ 51 đến 200 lao động" },
						{ "value": 3, "text": "trên 200 lao động" },

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

			self.getLinhvucs();

			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
					
						
						self.applyBindings();


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
						if(self.model.get('xaphuong')== null){
							y = "";
						}
						else{
							y = self.model.get('xaphuong').ten;
						}
						if(self.model.get('quanhuyen')== null){
							z = "";
						}
						else{
							z = self.model.get('quanhuyen').ten;
						}
						if(self.model.get('diachi')== null){
							x = "";
						}
						else{
							x = self.model.get('diachi');
						}					
						self.$el.find("#diachitrusochinh").val(x+' '+y+' '+z );
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
					}
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


	});

});