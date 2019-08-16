define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/danhmucdoanhnghiep/tpl/collection.html'),
		schema = require('json!schema/DanhMucDoanhNghiepSchema.json');
	var TemplateHelper = require('app/base/view/TemplateHelper');

	return Gonrin.CollectionView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "danhmucdoanhnghiep",
		uiControl: {
			fields: [
				{ field: "code", label: "Mã" },
				{ field: "name", label: "Tên" },
				{
					field: "tinhthanh_id",
					label: "Tỉnh thành",
					foreign: "tinhthanh",
					foreignValueField: "id",
					foreignTextField: "ten",
				},
				{
					field: "quanhuyen_id",
					label: "Quận/Huyện",
					foreign: "quanhuyen",
					foreignValueField: "id",
					foreignTextField: "ten",
				},
				{
					field: "xaphuong_id",
					label: "Xã/Phường/Thị trấn",
					foreign: "xaphuong",
					foreignValueField: "id",
					foreignTextField: "ten",
				},

			],
			pagination: {
				page: 1,
				pageSize: 15
			},
			noResultsClass: "alert alert-default no-records-found",
			onRowClick: function (event) {
				if (event.rowId) {
					var path = this.collectionName + '/model?id=' + event.rowId;
					this.getApp().getRouter().navigate(path);
				}
			},
			// onRendered: function (e) {
			// 	var self = this;
			// 	if (this.uiControl.dataSource == null || this.uiControl.dataSource.length<=0){
			// 		self.$el.find("#grid").hide();
			// 		self.getApp().getRouter().navigate(this.collectionName + '/model');
			// 	}
			// }
		},
		render: function () {
			var self = this;
			if (self.getApp().currentUser.hasRole("CoSoKCB") === true) {
				self.getApp().getRouter().navigate(this.collectionName + '/model');
				return;
			}
			var url = self.getApp().serviceURL + "/api/v1/danhmuclinhvuc";
			$.ajax({
				url: url,
				method: "GET",
				contentType: "application/json",
				success: function (data) {
					var arr = [];
					var select = self.$el.find("#selecteder");

					data.objects.forEach(item => {
						arr.push(item);
					});

					self.$el.find('#combobox').combobox({
						textField: "tenlinhvuc",
						valueField: "id",
						allowTextInput: true,
						enableSearch: true,
						dataSource: arr,
					});


				},
				error: function (xhr, status, error) {
					console.log("Không lấy được dữ liệu linh vuc");
				},
			});

			self.uiControl.orderBy = [{ "field": "name", "direction": "asc" }];
			this.applyBindings();
			return this;
		},

	});

});