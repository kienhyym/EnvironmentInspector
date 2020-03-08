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
			self.getApp().currentUser.roles.forEach(function (item, index) {
				if (item.role_name == 'VanPhongCuc') {
					self.$el.find("#del_member").hide();
				}
			})

			if (self.model.get("id") == null) {
				self.model.set("id", gonrin.uuid());
			}

			self.model.on("change", function () {
				self.trigger("change", {
					"oldData": self.model.previousAttributes(),
					"data": self.model.toJSON()
				});
			});
			self.chonThanhVienThanhTra();

			self.applyBindings();
			self.$el.find('.chonthanhvienthanhtra select').on('change.bs.select', function (e, clickedIndex, isSelected, previousValue) {
				var filters = {
					filters: {
						"$and": [
							{ "id": { "$eq": self.$el.find('.chonthanhvienthanhtra select').selectpicker('val') } }
						]
					},
					order_by: [{ "field": "created_at", "direction": "asc" }]
				}
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
					method: "GET",
					data: "q=" + JSON.stringify(filters),
					contentType: "application/json",
					success: function (data) {
						self.model.set('donvicongtac',data.objects[0].donvi.ten);
						self.model.set('id_hoten',self.$el.find('.chonthanhvienthanhtra select').selectpicker('val'));
						self.model.set('hoten', self.$el.find('.chonthanhvienthanhtra div button').attr('title'));
						

						console.log(self.model.toJSON())
						self.trigger("change", {
							"oldData": self.model.previousAttributes(),
							"data": self.model.toJSON()
						});
					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					},
				});
			});
		},
		chonThanhVienThanhTra: function () {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/user?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				contentType: "application/json",
				success: function (data) {

					data.objects.forEach(function (item, index) {
						self.$el.find('.chonthanhvienthanhtra select').append(`
						<option value="${item.id}" data-id="${item.id}">${item.name}</option>
					`)
					})
					self.$el.find('.chonthanhvienthanhtra select').selectpicker('val', 'deselectAllText');

					if (self.model.toJSON() != undefined && self.model.toJSON() != null) {
						if (self.model.toJSON().id_hoten != undefined && self.model.toJSON().id_hoten != null) {
							var x = self.model.toJSON().id_hoten;
							self.$el.find('.chonthanhvienthanhtra select').selectpicker('val', x);
						}
					}
					
					self.$el.find('.chonthanhvienthanhtra select').on('shown.bs.select', function (e, clickedIndex, isSelected, previousValue) {
						self.$el.find('.popover-header .close').css('line-height', '10px')
						self.$el.find('.popover-header .close').unbind('click').bind('click', function () {
							self.$el.find('.chonthanhvienthanhtra select').selectpicker('val', 'deselectAllText');
						})
					})
				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});
		},

	});

});