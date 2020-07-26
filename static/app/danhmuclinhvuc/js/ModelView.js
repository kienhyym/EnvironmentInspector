define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/danhmuclinhvuc/tpl/model.html'),
		schema = require('json!schema/DanhMucLinhVucSchema.json');


	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "danhmuclinhvuc",
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
							if (self.model.get('malinhvuc') == null) {
								self.getApp().notify({ message: "Mã lĩnh vực không được bỏ trống" }, { type: "danger", delay: 1000 });
								return false
							}
							if (self.model.get('tenlinhvuc') == null) {
								self.getApp().notify({ message: "Tên lĩnh vực không được bỏ trống" }, { type: "danger", delay: 1000 });
								return false
							}
							if (self.model.get('grouplinhvuc') == null) {
								self.getApp().notify({ message: "Nhóm lĩnh vực không được bỏ trống" }, { type: "danger", delay: 1000 });
								return false
							}

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
										self.getApp().notify({ message: "Mã lĩnh vực đã được sử dụng" }, { type: "danger", delay: 1000 });
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
					field: "grouplinhvuc",
					label: "Nhóm lĩnh vực",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					dataSource: [
						{ value: "Hóa chất", text: "Hóa chất" },
						{ value: "Nước sạch", text: "Nước sạch" },
						{ value: "Chất thải y tế", text: "Chất thải y tế" },
						{ value: "Môi trường y tế", text: "Môi trường y tế" },
					],
				},
			]
		},
		render: function () {
			var self = this;
			var id = this.getApp().getRouter().getParam("id");
			if (id) {
				//progresbar quay quay
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {

						self.applyBindings();
					},
					error: function () {
						self.getApp().notify("Get data Eror");
					},
				});
			} else {
				self.applyBindings();
			}

		},

	});

});