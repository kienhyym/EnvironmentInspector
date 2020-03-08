define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	var template = require('text!app/kehoachthanhtra/congviecthanhtra/tpl/item.html'),
		schema = require('json!app/kehoachthanhtra/congviecthanhtra/Schema.json');

	return Gonrin.ItemView.extend({
		template: template,
		tagName: 'tr',
		bindings: "data-task-bind",
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "kehoachthanhtra_congviec",
		foreignRemoteField: "id",
		foreignField: "kehoach_id",
		uiControl: {
			fields: [
				{
					field: "trangthai",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					cssClass: "form-control",
					dataSource: [
						{ value: 1, text: "Hoàn thành" },
						{ value: 2, text: "Chưa hoàn thành" },
					],
				},
				{
					field: "nguoiduocphancong",
					uicontrol: "combobox",
					textField: "hoten",
					valueField: "id",
					cssClass: "form-control",
					dataSource: []
				},
			]
		},
		render: function () {
			var self = this;
            self.getApp().currentUser.roles.forEach(function (item, index) {
				if (item.role_name == 'VanPhongCuc') {
					self.$el.find("#del_member").hide();
				}
			})
			for (var i = 0; i < self.uiControl.fields.length; i++){
				if (self.uiControl.fields[i].field == "nguoiduocphancong"){
					self.uiControl.fields[i].dataSource = self.viewData.danhsachthanhvien;
					break;
				}
			}
			if (self.model.get("id") == null) {
				self.model.set("id", gonrin.uuid());
			}
			
			self.applyBindings();
			self.model.on("change", function () {
				self.trigger("change", {
					"oldData": self.model.previousAttributes(),
					"data": self.model.toJSON()
				});
			});
			
			self.$el.find("#itemRemove").unbind("click").bind("click", function () {
				self.remove(true);
			});
			//console.log(self.getFieldElement("nguoiduocphancong"));
			// self.getFieldElement("nguoiduocphancong").data("gonrin").setDataSource(self.viewData.danhsachthanhvien);
		},
	});
});