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

		render: function () {
			var self = this;
			// self.bindEvent();
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep",
				method: "GET",
				data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
				contentType: "application/json",
				success: function (data) {

					var x = data.objects
					self.render_grid2(status, x);
				},

			});
			self.bindEvent2();
			// self.$el.find("#btn-all").click();
			return this;
		},
		// bindEvent: function () {
		// 	var self = this;
		// 	self.$el.find("#btn-all").unbind('click').bind('click', function () {
		// 		var filters_common = "";
		// 		self.getDataSource(0, filters_common, 1, 100);

		// 	});

		// 	self.$el.find("#btn-nuocsach").unbind('click').bind('click', function () {
		// 		var filters_common = "NS";
		// 		self.getDataSource(1, filters_common, 1, 100);

		// 	});

		// 	self.$el.find("#btn-hoachat").unbind('click').bind('click', function () {
		// 		var filters_common = "HC";
		// 		self.getDataSource(2, filters_common, 1, 100);
		// 	});

		// 	self.$el.find("#btn-chatthaiyte").unbind('click').bind('click', function () {
		// 		var filters_common = "CTYT";
		// 		self.getDataSource(3, filters_common, 1, 100);

		// 	});
		// },
		// getDataSource: function (status, filters, page, results_per_page) {
		// 	var self = this;




		// 	$.ajax({
		// 		url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep",
		// 		method: "GET",
		// 		data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }], "page": page, "results_per_page": results_per_page }) },
		// 		contentType: "application/json",
		// 		success: function (data) {
		// 			if(filters != ""){
		// 				var x = data.objects
		// 				var arr = [];
		// 				for (var i = 0; i < x.length; i++) {
		// 					var dem = 0;
		// 					for (var j = 0; j < x[i].danhmuclinhvuc_foreign.length; j++) {
		// 						if (x[i].danhmuclinhvuc_foreign[j].malinhvuc === filters)
		// 							dem++;
		// 					}
		// 					if (dem > 0) {
		// 						arr.push(x[i])
		// 						console.log(arr)
		// 					}
		// 				}
		// 				console.log('status',status)
		// 				self.render_grid(status, arr);
		// 			}else{
		// 				self.render_grid(status, data.objects);

		// 			}

		// 		},
		// 		error: function (xhr, status, error) {

		// 			try {
		// 				if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
		// 					self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
		// 					self.getApp().getRouter().navigate("login");
		// 				} else {
		// 					self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
		// 				}
		// 			} catch (err) {
		// 				self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
		// 			}
		// 			self.render_grid(status, []);
		// 		}
		// 	});
		// },
		// render_grid: function (status, dataSource) {
		// 	var self = this;
		// 	var element = null;
		// 	if (status === 0) {
		// 		element = self.$el.find("#grid_all");
		// 	}
		// 	else if (status === 1) {
		// 		element = self.$el.find("#grid_nuocsach");
		// 	}else if (status === 2) {
		// 		element = self.$el.find("#grid_hoachat");
		// 	}else if (status === 3) {
		// 		element = self.$el.find("#grid_chatthaiyte");
		// 	}
		// 	element.grid({
		// 		showSortingIndicator: true,
		// 		orderByMode: "client",
		// 		language: {
		// 			no_records_found: "Chưa có dữ liệu"
		// 		},
		// 		noResultsClass: "alert alert-default no-records-found",
		// 		fields: [
		// 			{
		// 				field: "stt",
		// 				label: "STT",
		// 				width: "30px"
		// 			},
		// 			{ field: "code", label: "Mã" },
		// 			{ field: "name", label: "Tên" },
		// 			{
		// 				field: "tinhthanh_id",
		// 				label: "Tỉnh thành",
		// 				foreign: "tinhthanh",
		// 				foreignValueField: "id",
		// 				foreignTextField: "ten",
		// 			},
		// 			{
		// 				field: "quanhuyen_id",
		// 				label: "Quận/Huyện",
		// 				foreign: "quanhuyen",
		// 				foreignValueField: "id",
		// 				foreignTextField: "ten",
		// 			},
		// 			{
		// 				field: "xaphuong_id",
		// 				label: "Xã/Phường/Thị trấn",
		// 				foreign: "xaphuong",
		// 				foreignValueField: "id",
		// 				foreignTextField: "ten",
		// 			},
		// 		],
		// 		dataSource: dataSource,
		// 		primaryField: "id",
		// 		selectionMode: false,
		// 		pagination: {
		// 			page: 1,
		// 			pageSize: 100
		// 		},
		// 		events: {
		// 			"rowclick": function (e) {
		// 				self.getApp().getRouter().navigate("danhmucdoanhnghiep/model?id=" + e.rowId);



		// 			},
		// 		},
		// 	});
		// },
		bindEvent2: function () {
			var self = this;
			// self.$el.find("#btn-all").unbind('click').bind('click', function () {
			// 	var filters_common = "";
			// 	self.getDataSource(0, filters_common, 1, 100);

			// });

			var arr = [];
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhmuclinhvuc",
				method: "GET",
				data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
				contentType: "application/json",
				success: function (data) {
					for (var i = 0; i < data.objects.length; i++) {
						arr.push(data.objects[i])

					}
					$('#combobox').combobox({
						textField: "tenlinhvuc",
						valueField: "id",
						allowTextInput: true,
						enableSearch: true,
						dataSource: arr,						
					});

					$('#combobox').on('change.gonrin', function (e) {
						var filters_common = $('#combobox').data('gonrin').getValue();

						var xxx = $('#combobox').data('gonrin').getText();
						self.getApp().getRouter().refresh();

						self.getDataSource2(xxx, filters_common, 1, 100);

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
					} catch (err) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					}
				}
			});



		},
		getDataSource2: function (status, filters, page, results_per_page) {
			var self = this;

			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep",
				method: "GET",
				data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }], "page": page, "results_per_page": results_per_page }) },
				contentType: "application/json",
				success: function (data) {

					var x = data.objects
					var arr = [];
					for (var i = 0; i < x.length; i++) {
						var dem = 0;
						for (var j = 0; j < x[i].danhmuclinhvuc_foreign.length; j++) {
							if (x[i].danhmuclinhvuc_foreign[j].id === filters)
								dem++;
						}
						if (dem > 0) {
							arr.push(x[i])
							// console.log(arr)
						}
					}
					self.render_grid2(status, arr);
					self.$el.find("#value_select").val(status);



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
					self.render_grid2(status, []);
				}
			});
		},
		render_grid2: function (xxx, dataSource) {
			var self = this;
			var element = self.$el.find("#grid_all");

			element.grid({
				// showSortingIndicator: true,
				orderByMode: "client",
				language: {
					no_records_found: "Chưa có dữ liệu"
				},
				noResultsClass: "alert alert-default no-records-found",
				fields: [
					// {
					// 	field: "stt",
					// 	label: "STT",
					// 	width: "30px",
					// },
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
				dataSource: dataSource,
				primaryField: "id",
				selectionMode: false,
				pagination: {
					page: 1,
					pageSize: 100
				},
				events: {
					"rowclick": function (e) {
						self.getApp().getRouter().navigate("danhmucdoanhnghiep/model?id=" + e.rowId);



					},
				},
			});
		},


	});

});