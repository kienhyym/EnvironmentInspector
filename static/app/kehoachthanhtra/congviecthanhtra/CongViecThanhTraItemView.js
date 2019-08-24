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

			]
		},
		render: function () {
			var self = this;
			console.log('model', self.model)
			
			self.$el.find('#select_nguoiduocphancong').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
				var data_ck = self.$el.find('#select_nguoiduocphancong option:selected').attr('data-ck');
				if (data_ck !== undefined && data_ck !== null) {
					var my_object = JSON.parse(decodeURIComponent(data_ck));
					if (my_object !== null) {
						self.model.set("id", my_object.id);
						self.model.set("nguoiduocphancong", my_object.hoten);

					}
				}
			});

			if (self.model.get("id") == null) {
				self.model.set("id", gonrin.uuid());
			}
			this.applyBindings();
			self.GetNguoiDuocPhanCong();
			self.$el.find("#itemRemove").unbind("click").bind("click", function () {
				self.remove(true);
			});
		},
		GetNguoiDuocPhanCong: function () {
			var self =this;
			var id = this.getApp().getRouter().getParam("id");
			console.log("id", id)
			
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra",
				method: "GET",
				data: { "data": JSON.stringify({ "order_by": [{ "field": "danhsach_thanhvien", "direction": "desc" }], "page": 1, "results_per_page": 10000 }) },
				contentType: "application/json",
				success: function (data) {

					for (var i = 0; i < data.objects.length; i++) {
						if (data.objects[i].id == id) {
							var x = data.objects[i].danhsach_thanhvien.length;
							console.log(x)
							self.$el.find("#select_nguoiduocphancong").html("");
							for (var j = 0; j < x; j++) {
								var item = data.objects[i].danhsach_thanhvien[j];
								var data_str = encodeURIComponent(JSON.stringify(item));
								var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.hoten)

								self.$el.find("#select_nguoiduocphancong").append(option_elm);
							}
							var maNguoiDuocPhanCong = self.model.get("id");
							self.$el.find("#select_nguoiduocphancong").selectpicker('val', maNguoiDuocPhanCong);




						}
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

		}
	});

});