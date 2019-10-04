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
			self.filterDataTinhThanh();

			self.khoitao();
			self.$el.find("#soLanThanhTra").unbind("click").bind("click", function () {
				self.soLanThanhTra();
				self.chuaThanhTraGanDay();

			});
			
		},

		khoitao: function () {
			var self = this;

			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep",
				method: "GET",
				data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
				contentType: "application/json",
				success: function (data) {
					var x = data.objects
					self.render_grid2(status, x);
				},
			})
		},
		bindEvent2: function () {
			var self = this;

			self.getDataLinhVuc_combobox();
			self.getDataTinhThanh_combobox();
			self.getInputDataSoLanThanhTra();
			self.getInputDataChưaThanhTraGanDay();
		},

	


		filterDataTinhThanh: function () {
			const self = this;
			
			let filters = {
				"filters": {
					"$and": []
				}
			}

			// GET DATA TINH THANH
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/tinhthanh",
				method: "GET",
				success: function (data) {
					self.$el.find('#tinhthanh_combobox').combobox({
						textField: "ten",
						valueField: "id",
						dataSource: data.objects,
					});

					self.$el.find('#tinhthanh_combobox').on('change.gonrin', function (e) {
						var filters_common = $('#tinhthanh_combobox').data('gonrin').getValue();
						if ( typeof(Storage) !== 'undefined') {
							// Khởi tạo sesionStorage
							sessionStorage.setItem('tinhthanh_ID',filters_common );
							// get sessionStorage
							// sessionStorage.getItem('name');
							// // lấy ra số lượng session đã lưu trữ
							// sessionStorage.length;
							// // xóa 1 item localStorage
							// sessionStorage.removeItem('name');
							// // xóa tất cả item trong sessionStorage
							// sessionStorage.clear();
						} else {
							alert('Trình duyệt của bạn không hỗ trợ!');
						}
						filters['filters']['$and'].push({
							tinhthanh_id: { "$eq": filters_common }
						});
					});
				},
				error: function (xhr, status, error) { }
			});




			// GET DATA LINH VUC
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhmuclinhvuc",
				method: "GET",
				success: function (data) {
					self.$el.find('#linhvuc_combobox').combobox({
						textField: "tenlinhvuc",
						valueField: "id",
						dataSource: data.objects,
					});

					var loc;
					self.$el.find('#linhvuc_combobox').on('change.gonrin', function (e) {
						var filter = $('#linhvuc_combobox').data('gonrin').getValue();
						loc = filter;
						if ( typeof(Storage) !== 'undefined') {
							// Khởi tạo sesionStorage
							sessionStorage.setItem('linhvuc_ID',loc );
							// get sessionStorage
							// sessionStorage.getItem('name');
							// // lấy ra số lượng session đã lưu trữ
							// sessionStorage.length;
							// // xóa 1 item localStorage
							// sessionStorage.removeItem('name');
							// // xóa tất cả item trong sessionStorage
							// sessionStorage.clear();
						} else {
							alert('Trình duyệt của bạn không hỗ trợ!');
						}
						// filters['filters']['$and'].push({
						// 	linhvuc_id: { "$eq": filters_common }
						// });
					});
					
					self.$el.find("#loc").unbind("click").bind("click", function () {


						self.getApp().getRouter().refresh();
						var mangNew = [];
						$.ajax({
							url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep",
							method: "GET",
							data: "q=" + JSON.stringify(filters),
							success: function (data) {
								console.log('loc', loc)
								for (var i = 0; i < data.objects.length; i++) {
									var dem = 0;
									for (var j = 0; j < data.objects[i].danhmuclinhvuc_foreign.length; j++) {
										if (data.objects[i].danhmuclinhvuc_foreign[j].id == loc) {
											dem++;
										}
									}
									console.log(i,dem)
									if(dem!=0){
										mangNew.push(data.objects[i])
									}

								}
								console.log(mangNew)
								if(mangNew!=0){
									self.render_grid2(0,mangNew);

								}
								else{
									self.render_grid2(0,data.objects);

								}
								filters = {
									"filters": {
										"$and": []
									}
								}
							},
						});
					});
				},
				error: function (xhr, status, error) { }
			});


			self.$el.find('#soLanThanhTra_combobox').on('change.gonrin', function (e) {
				var filters_common = self.$el.find('#soLanThanhTra_combobox').val();

				
				filters['filters']['$and'].push({
					solanthanhtra: { "$eq": filters_common }
				});
			})
		
			self.$el.find('#chuathanhtraganday_combobox').on('change.gonrin', function (e) {
				var filters_common = self.$el.find('#chuathanhtraganday_combobox').val();
				if ( typeof(Storage) !== 'undefined') {
					// Khởi tạo sesionStorage
					sessionStorage.setItem('solannamchuathanhtra',filters_common );
					// get sessionStorage
					// sessionStorage.getItem('name');
					// // lấy ra số lượng session đã lưu trữ
					// sessionStorage.length;
					// // xóa 1 item localStorage
					// sessionStorage.removeItem('name');
					// // xóa tất cả item trong sessionStorage
					// sessionStorage.clear();
				} else {
					alert('Trình duyệt của bạn không hỗ trợ!');
				}
				filters['filters']['$and'].push({
					namchuathanhtraganday: { "$eq": filters_common }
				});
			})




		},

		soLanThanhTra: function () {
			var self = this;

			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra",
				method: "GET",
				success: function (data) {
					var arr = [];
					(data.objects).forEach(function (item, index) {
						if (item.trangthai == "end_checked")
							arr.push(item.madoanhnghiep);
					});
					let ans = deduplicate(arr);

					function deduplicate(arr) {
						let isExist = (arr, x) => {
							for (let i = 0; i < arr.length; i++) {
								if (arr[i] === x) return true;
							}
							return false;
						}

						let ans = [];
						arr.forEach(element => {
							if (!isExist(ans, element)) ans.push(element);
						});
						return ans;
					}

					for (var i = 0; i < ans.length; i++) {
						var dem = 0;
						for (var j = 0; j < arr.length; j++) {
							if (ans[i] == arr[j]) {
								dem++;
							}
						}
						var param = {
							solanthanhtra: dem
						}
						$.ajax({
							url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep/" + ans[i],
							type: 'PUT',
							data: JSON.stringify(param),
							headers: {
								'content-type': 'application/json'
							},
							dataType: 'json',
							success: function (data) {

							},
							error: function (request, textStatus, errorThrown) {
								console.log(request);
							}
						})
					}
				},
			})
		},
		chuaThanhTraGanDay: function () {
			var self = this;

			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra",
				method: "GET",
				success: function (data) {
					var arr = [];
					(data.objects).forEach(function (item, index) {
						if (item.trangthai == "end_checked")
							arr.push({
								"ma": item.madoanhnghiep,
								"namsoanthao": moment(item.ngaythanhtra * 1000).year()
							});
					});
					var mangNamGanNhat = [];

					for (var i = 0; i < arr.length; i++) {
						var mangMax = arr[i];
						for (var j = 0; j < arr.length; j++) {
							if (arr[i].ma == arr[j].ma && arr[i].namsoanthao < arr[j].namsoanthao) {
								mangMax = arr[j];
							}
						}
						mangNamGanNhat.push(mangMax);
					}
					let ans = deduplicate(mangNamGanNhat);

					function deduplicate(arr) {
						let isExist = (arr, x) => {
							for (let i = 0; i < arr.length; i++) {
								if (arr[i] === x) return true;
							}
							return false;
						}

						let ans = [];
						arr.forEach(element => {
							if (!isExist(ans, element)) ans.push(element);
						});
						return ans;
					}
					var year = new Date();
					var namhientai = year.getFullYear();

					ans.forEach(function (item) {
						var param = {
							namchuathanhtraganday: namhientai - item.namsoanthao
						}
						$.ajax({
							url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep/" + item.ma,
							type: 'PUT',
							data: JSON.stringify(param),
							headers: {
								'content-type': 'application/json'
							},
							dataType: 'json',
							success: function (data) {

							},
							error: function (request, textStatus, errorThrown) {
								console.log(request);
							}
						})
					})

				}

			})
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
					// { field: "code", label: "Mã" },
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