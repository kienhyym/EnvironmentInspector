define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');


	var template = require('text!app/kehoachthanhtra/tpl/collection.html'),
		schema = require('json!schema/KeHoachThanhTraSchema.json');
	var TemplateHelper = require('app/base/view/TemplateHelper');
	var CustomFilterView = require('app/base/view/CustomFilterView');

	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "kehoachthanhtra",
		tools: [
			{
				name: "defaultgr",
				type: "group",
				groupClass: "toolbar-group",
				buttons: [
					{
						name: "create",
						type: "button",
						buttonClass: "btn-success btn-sm",
						label: "TRANSLATE:CREATE",
						command: function () {
							var self = this;
							self.getApp().getRouter().navigate(this.collectionName + '/model');
						},
						visible: function () {
							return this.getApp().currentUser.hasRole("ChuyenVien") || this.getApp().currentUser.hasRole("TruongPhong");
						}
					},
				]
			},
		],
		render: function () {
			var self = this;

			var currentUser = self.getApp().currentUser;
			self.bindEvent();
			if (!!currentUser && (currentUser.hasRole("CucTruong") ||
				currentUser.hasRole("PhoCucTruong") ||
				currentUser.hasRole("VanPhongCuc") ||
				currentUser.hasRole("ThanhVienDoanThanhTra") ||
				currentUser.hasRole("TruongPhong"))) {
				self.$el.find("#kehoach-new-tab").parent('li').hide();
				self.$el.find("#kehoach-review-tab").click();
			} else if (!!currentUser && currentUser.hasRole("ChuyenVien")) {
				self.$el.find("#kehoach-new-tab").parent('li').show();
				self.$el.find("#kehoach-new-tab").click();
			} else {
				self.getApp().notify("Phiên làm việc hết hạn, vui lòng đăng nhập lại!");
				self.getApp().getRouter().navigate("login");
				return;
			}
			//	    	self.getDataSource(0,filter_new,1,100);

			return this;
		},
		bindEvent: function () {
			var self = this;

			var currentUser = self.getApp().currentUser;
			self.$el.find("#kehoach-new-tab").unbind('click').bind('click', function () {
				var filters_common = "";
				if (!!currentUser && currentUser.hasRole("ChuyenVien")) {
					filters_common = {
						"$or": [
							{ "trangthai": { "$eq": "new" } },
						]
					};
					self.getDataSource(0, filters_common, 1, 100);
				};
			});

			self.$el.find("#kehoach-review-tab").unbind('click').bind('click', function () {
				var filters_common = "";
				if (!!currentUser && currentUser.hasRole("CucTruong")) {
					filters_common = {
						"$or": [
							{ "trangthai": { "$eq": "send_approved" } },
							{ "trangthai": { "$eq": "cancel_approved" } }]
					};
				} else if (!!currentUser && currentUser.hasRole("PhoCucTruong")) {
					filters_common = {
						"$or": [
							{ "trangthai": { "$eq": "send_review_pct" } },
							{ "trangthai": { "$eq": "cancel_reviewed_pct" } },
							{ "trangthai": { "$eq": "cancel_approved" } }]
					};
				} else if (!!currentUser && currentUser.hasRole("TruongPhong")) {
					filters_common = {
						"$or": [
							{ "trangthai": { "$eq": "send_review_truongphong" } },
							{ "trangthai": { "$eq": "cancel_reviewed_truongphong" } },
							{ "trangthai": { "$eq": "cancel_reviewed_pct" } },
							{ "trangthai": { "$eq": "cancel_approved" } }]
					};
				} else if (!!currentUser && currentUser.hasRole("ChuyenVien")) {
					filters_common = {
						"$and": [{
							"$or": [
								{ "trangthai": { "$eq": "send_review_truongphong" } },
								{ "trangthai": { "$eq": "cancel_reviewed_truongphong" } },
								{ "trangthai": { "$eq": "send_review_pct" } },
								{ "trangthai": { "$eq": "send_approved" } }]
						},
						]
					};
				}
				else if (!!currentUser && currentUser.hasRole("ThanhVienDoanThanhTra")) {

					// filters_common = {
					// 	"$and": [{
					// 		"$or": [
					// 			{ "trangthai": { "$eq": "send_review_truongphong" } },
					// 			{ "trangthai": { "$eq": "cancel_reviewed_truongphong" } },
					// 			{ "trangthai": { "$eq": "send_review_pct" } },
					// 			{ "trangthai": { "$eq": "send_approved" } }]
					// 	},
					// 	]
					// };
				}
				else if (!!currentUser && currentUser.hasRole("VanPhongCuc")) {

					// filters_common = {
					// 	"$and": [{
					// 		"$or": [
					// 			{ "trangthai": { "$eq": "send_review_truongphong" } },
					// 			{ "trangthai": { "$eq": "cancel_reviewed_truongphong" } },
					// 			{ "trangthai": { "$eq": "send_review_pct" } },
					// 			{ "trangthai": { "$eq": "send_approved" } }]
					// 	},
					// 	]
					// };
				}
				else {
					self.getApp().notify("Phiên làm việc hết hạn, vui lòng đăng nhập lại!");
					self.getApp().getRouter().navigate("login");
					return;
				}
				self.getDataSource(1, filters_common, 1, 100);
			});
			self.$el.find("#kehoach-approved-tab").unbind('click').bind('click', function () {
				var filters_common = "";
				if (!!currentUser && currentUser.hasRole("CucTruong")) {
					filters_common = {
						"$or": [{ "trangthai": { "$eq": "approved" } },
						{ "trangthai": { "$eq": "checked" } },
						// { "trangthai": { "$eq": "end_checked" }},
						{ "trangthai": { "$eq": "result_checked" } }]
					};
				} else if (!!currentUser && currentUser.hasRole("PhoCucTruong")) {
					filters_common = {
						"$or": [
							{ "trangthai": { "$eq": "approved" } },
							{ "trangthai": { "$eq": "checked" } },
							// { "trangthai": { "$eq": "end_checked" }},
							{ "trangthai": { "$eq": "result_checked" } }]
					};
				} else if (!!currentUser && currentUser.hasRole("TruongPhong")) {
					filters_common = {
						"$or": [
							{ "trangthai": { "$eq": "approved" } },
							{ "trangthai": { "$eq": "checked" } },
							// { "trangthai": { "$eq": "end_checked" }},
							{ "trangthai": { "$eq": "result_checked" } }]
					};
				} else if (!!currentUser && currentUser.hasRole("ChuyenVien")) {
					filters_common = {
						"$and": [{
							"$or": [
								{ "trangthai": { "$eq": "approved" } },
								{ "trangthai": { "$eq": "checked" } },
								// { "trangthai": { "$eq": "end_checked" }},
								{ "trangthai": { "$eq": "result_checked" } }
							]
						},
						]
					};
				}
				self.getDataSource(2, filters_common, 1, 100);
			});
			self.$el.find("#kehoach-finish-tab").unbind('click').bind('click', function () {
				// var filter_finish = { "trangthai": { "$eq": "completed" } };
				var filter_finish = {
					"$or": [
						{ "trangthai": { "$eq": "end_checked" } },
						{ "trangthai": { "$eq": "completed" } }]
				};
				self.getDataSource(3, filter_finish, 1, 100);
			});
		},
		getDataSource: function (status, filters, page, results_per_page) {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra",
				method: "GET",
				data: { "q": JSON.stringify({ "filters": filters, "order_by": [{ "field": "updated_at", "direction": "desc" }], "page": page, "results_per_page": results_per_page }) },
				contentType: "application/json",
				success: function (data) {
					var x = data.objects
					var arr = [];
					var dataSource = lodash.orderBy(x, ['created_at'], ['asc']);
					self.getApp().currentUser.roles.forEach(function (item, index) {
						if (item.role_name == 'ThanhVienDoanThanhTra') {
							dataSource.forEach(function (item, index) {
								if (item.danhsach_thanhvien.length != 0) {
									item.danhsach_thanhvien.forEach(function (itemtv, indextv) {
										if (itemtv.id_hoten == self.getApp().currentUser.id) {
											arr.push(item)
										}
									})
								}
							})
							self.render_grid(status, arr);

						}
						else{
							self.render_grid(status, dataSource);
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
					} catch (err) {
						self.getApp().notify({ message: "Lỗi không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					}
					self.render_grid(status, []);
				}
			});
		},
		render_grid: function (status, dataSource) {
			var self = this;
			var element = null;
			if (status == 0) {
				element = self.$el.find("#grid_new");
			} else if (status === 1) {
				element = self.$el.find("#grid_review");
			} else if (status === 2) {
				element = self.$el.find("#grid_approve");
			} else if (status === 3) {
				element = self.$el.find("#grid_finish");
			}
			element.grid({
				showSortingIndicator: true,
				orderByMode: "client",
				language: {
					no_records_found: "Chưa có dữ liệu"
				},
				noResultsClass: "alert alert-default no-records-found",
				fields: [
					{
						field: "stt",
						label: "STT",
						width: "30px"
					},
					{
						field: "ngay_quyetdinh_thanhtra", label: "Ngày thanh tra",
						template: function (rowData) {
							if (!!rowData && rowData.ngay_quyetdinh_thanhtra) {
								var utcTolocal = function (times, format) {
									return moment(times * 1000).local().format(format);
								}
								return utcTolocal(rowData.ngay_quyetdinh_thanhtra, "DD/MM/YYYY");
							}
							return "";
						},
					},
					{
						field: "tendoanhnghiep",
						label: "Đối tượng thanh tra",
						template: function (rowData) {
							if (!!rowData && rowData.danhmucdoanhnghiep != null) {
								return rowData.danhmucdoanhnghiep.name;
							}
							return "";
						},
					},
					{
						field: "trangthai",
						label: "Trạng thái",
						foreignValueField: "value",
						foreignTextField: "text",
						foreignValues: [
							{ value: "new", text: "Tạo mới" },
							{ value: "send_review_truongphong", text: "Chờ cấp phòng duyệt" },
							{ value: "cancel_reviewed_truongphong", text: "Phòng từ chối" },
							{ value: "send_review_pct", text: "Chờ PCT duyệt" },
							{ value: "cancel_reviewed_pct", text: "PCT từ chối" },
							{ value: "send_approved", text: "Chờ CT duyệt" },
							{ value: "cancel_approved", text: "CT từ chối" },
							{ value: "approved", text: "CT đã duyệt quyết định" },
							{ value: "checked", text: "Đã kiểm tra" },
							{ value: "result_checked", text: "Đã có kết luận" },
							{ value: "completed", text: "Hoàn thành" },
							{ value: "end_checked", text: "Đã kết thúc thanh tra" }
						],
					},
				],
				dataSource: lodash.orderBy(dataSource, ['stt'], ['asc']),
				primaryField: "id",
				selectionMode: false,
				pagination: {
					page: 1,
					pageSize: 100
				},
				events: {
					"rowclick": function (e) {
						self.getApp().getRouter().navigate("kehoachthanhtra/model?id=" + e.rowId);


					},
				},
			});
		},


	});

});