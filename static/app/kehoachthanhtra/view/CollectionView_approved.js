define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');


	var template = require('text!app/kehoachthanhtra/tpl/collection_approved.html'),
		schema = require('json!schema/KeHoachThanhTraSchema.json');
	var TemplateHelper = require('app/base/view/TemplateHelper');
	var CustomFilterView = require('app/base/view/CustomFilterView');

	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "kehoachthanhtra",
		render: function () {

			var self = this;
			



			var currentUser = self.getApp().currentUser;
			self.bindEvent();
			if (!currentUser) {
				self.getApp().notify("Phiên làm việc hết hạn, vui lòng đăng nhập lại!");
				self.getApp().getRouter().navigate("login");
				return;
			}

			return this;
		},
		bindEvent: function () {
			var self = this;
			var currentUser = self.getApp().currentUser;
			var filters_common = {
						"$or": [
							{ "trangthai": { "$eq": "approved" } },
							{ "trangthai": { "$eq": "checked" } },
							{ "trangthai": { "$eq": "end_checked" }},
							{ "trangthai": { "$eq": "completed" }},
							{ "trangthai": { "$eq": "result_checked" } }]
					};
			self.getDataSource(2, filters_common, 1, 100);
		},
		getDataSource: function (status, filters, page, results_per_page) {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra",
				method: "GET",
				data: { "q": JSON.stringify({ "filters": filters, "order_by": [{ "field": "updated_at", "direction": "desc" }], "page": page, "results_per_page": results_per_page }) },
				contentType: "application/json",
				success: function (data) {
					self.render_grid(status, data.objects);

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
			var element = self.$el.find("#grid_approve");

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
						field: "tenkehoach",
						label: "Tên kế hoạch",
					},
					{
						field: "ngaythanhtra", label: "Ngày thanh tra",
						template: function (rowData) {
							if (!!rowData && rowData.ngaythanhtra) {
								var template_helper = new TemplateHelper();
								var utcTolocal = function (times, format) {
									return moment(times * 1000).local().format(format);
								}
								// return template_helper.datetimeFormat(rowData.ngaythanhtra, "DD/MM/YYYY");
								return utcTolocal(rowData.ngaythanhtra, "DD/MM/YYYY");
							}
							return "";
						},
					},
					{
						field: "truongdoanthanhtra",
						label: "Trưởng đoàn"
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
				dataSource: dataSource,
				primaryField: "id",
				selectionMode: false,
				pagination: {
					page: 1,
					pageSize: 100
				},
				events: {
					"rowclick": function (e) {
						console.log("rowclick", e.rowId);
						self.getApp().getRouter().navigate("kehoachthanhtra/model_step_plan?id=" + e.rowId);


					},
				},
			});
		},


	});

});