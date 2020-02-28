define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/kehoachthanhtra/thanhvienthanhtra/tpl/ThanhVienthanhTraItem.html'),
		schema = require('json!app/kehoachthanhtra/thanhvienthanhtra/ThanhVienThanhTraSchema.json');

	return Gonrin.ItemView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		tagName: 'tr',
		bindings: "data-member-bind",
		collectionName: "thanhvienthanhtra",
		foreignRemoteField: "id",
	    foreignField: "kehoach_id",
		uiControl: {
			fields: [
				{
					field: "vaitro",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					cssClass: "form-control",
					dataSource: [
						{ value: "truongdoan", text: "Trưởng đoàn" },
						{ value: "phodoan", text: "Phó đoàn" },
						{ value: "thuky", text: "Thư ký" },
						{ value: "thanhvien", text: "Thành viên" },
						{ value: "congtacvien", text: "Cộng tác viên" },
						{ value: "giamsat", text: "Người giám sát" },
					],
				},
			]
		},
	
		render: function () {
			var self = this;

			if (self.model.get("id") == null){
				self.model.set("id", gonrin.uuid());
			}
						
			self.model.on("change", function () {

				self.trigger("change", {
					"oldData": self.model.previousAttributes(),
					"data": self.model.toJSON()
				});
			});
			self.applyBindings();
		},
	});

});