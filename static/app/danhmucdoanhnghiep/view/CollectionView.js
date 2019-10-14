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
			var linhvuc_ID =  self.getApp().getRouter().getParam("linhvuc_ID");
			var tinhthanh_ID= self.getApp().getRouter().getParam("tinhthanh_ID");
			var chisotuanthu= self.getApp().getRouter().getParam("chisotuanthu");
			var solanthanhtra= self.getApp().getRouter().getParam("solanthanhtra");
			var sonamchuathanhtra= self.getApp().getRouter().getParam("sonamchuathanhtra");
			if((linhvuc_ID == null || linhvuc_ID === "undefined")
				&&  (tinhthanh_ID == null || tinhthanh_ID === "undefined")
				&& (chisotuanthu ==null || chisotuanthu === "undefined")
				&& (solanthanhtra==null || solanthanhtra === "undefined")
				&& (sonamchuathanhtra ==null || sonamchuathanhtra === "undefined")
				 ){
				self.khoitao();

			}
			else{
				let filters = {
					"filters": {
						"$and": []
					}
				}
				var loc = linhvuc_ID;
				if(tinhthanh_ID != "null" && tinhthanh_ID !=="undefined"){
					filters['filters']['$and'].push({
						tinhthanh_id: { "$eq": tinhthanh_ID }
					});
				}
				if(chisotuanthu != "null" && chisotuanthu !=="undefined" ){
					filters['filters']['$and'].push({
						tuanthuphapluat_chiso: { "$eq": chisotuanthu }
					});
				}
				if(solanthanhtra!= "null" && solanthanhtra !=="undefined"){
					filters['filters']['$and'].push({
						solanthanhtra: { "$eq": solanthanhtra }
					});
				}
				if(sonamchuathanhtra!="null" && sonamchuathanhtra !=="undefined"){
					filters['filters']['$and'].push({
						namchuathanhtraganday: { "$eq": sonamchuathanhtra }
					});
				}
				


				var mangNew = [];
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep",
					method: "GET",
					data: "q=" + JSON.stringify(filters),
					success: function (data) {
						for (var i = 0; i < data.objects.length; i++) {
							var dem = 0;
							for (var j = 0; j < data.objects[i].danhmuclinhvuc_foreign.length; j++) {
								if (data.objects[i].danhmuclinhvuc_foreign[j].id == loc) {
									dem++;
								}
							}
							if(dem!=0){
								mangNew.push(data.objects[i])
							}

						}
						if(loc === "undefined" || loc ==null ){
							self.render_grid2(0,data.objects);

						}
						else{
							self.render_grid2(0,mangNew);

						}
						filters = {
							"filters": {
								"$and": []
							}
						}
					},
				});


			}






			
			
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
			var locChiSo;
			var loctinhhthanh;
			var locsolanbaocao;
			var locsonamchuabaocao;
			var loclinhvuc;
			//GET DATA CHI SO TUAN THU PHAP LUAT 
			self.$el.find('#rate_chiso').combobox({
				textField: "text",
				valueField: "id",
				dataSource: [
					{ text: "Báo cáo đầy đủ", id: 1 },
					{ text: "Báo cáo không đầy đủ", id: 2 },
					{ text: "Không báo cáo", id: 3 },
					
				],
			});
			self.$el.find('#rate_chiso').on('change.gonrin', function (e) {
				var filters_common = $('#rate_chiso').data('gonrin').getValue();
				locChiSo = filters_common
				filters['filters']['$and'].push({
					tuanthuphapluat_chiso: { "$eq": filters_common }
				});
			});

			// GET DATA TINH THANH
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/tinhthanh?results_per_page=100&max_results_per_page=100",
				method: "GET",
				success: function (data) {
					var tinhthanh_timkiem =[];
				
					
					self.$el.find("#input_gia").keyup(function () {

						data.objects.forEach(function(item,index){
							// console.log(self.$el.find("#input_gia").val());

							// console.log((item.ten).indexOf(self.$el.find("#input_gia").val()));
							if ((item.ten).indexOf(self.$el.find("#input_gia").val()) !== -1) {
								tinhthanh_timkiem.push(item)
							}
						});	
						

						self.$el.find('#tinhthanh_combobox').combobox({
							textField: "ten",
							valueField: "id",
							dataSource: tinhthanh_timkiem,
							refresh:true

						});
						
						self.$el.find("#tinhthanh_selecter div div .dropdown-menu").css("display", "block")
						tinhthanh_timkiem = [];
		
					})
					
					

					self.$el.find('#tinhthanh_combobox').on('change.gonrin', function (e) {
						var filters_common = $('#tinhthanh_combobox').data('gonrin').getValue();
						self.$el.find("#input_gia").val($('#tinhthanh_combobox').data('gonrin').getText());
						loctinhhthanh = filters_common;
						filters['filters']['$and'].push({
							tinhthanh_id: { "$eq": filters_common }
						});
						self.$el.find("#input_gia").focusout(function(){
							self.$el.find("#tinhthanh_selecter div div .dropdown-menu").css("display", "none")
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
						loclinhvuc = loc;
						
					});
					
					self.$el.find("#loc").unbind("click").bind("click", function () {
						sessionStorage.clear();
						self.getApp().getRouter().refresh();
						sessionStorage.setItem('chisotuanthu',locChiSo );
						sessionStorage.setItem('tinhthanh_ID',loctinhhthanh );
						sessionStorage.setItem('solanthanhtra',locsolanbaocao );
						sessionStorage.setItem('sonamchuathanhtra',locsonamchuabaocao );
						sessionStorage.setItem('linhvuc_ID',loclinhvuc );
						var mangNew = [];
						$.ajax({
							url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep",
							method: "GET",
							data: "q=" + JSON.stringify(filters),
							success: function (data) {
								for (var i = 0; i < data.objects.length; i++) {
									var dem = 0;
									for (var j = 0; j < data.objects[i].danhmuclinhvuc_foreign.length; j++) {
										if (data.objects[i].danhmuclinhvuc_foreign[j].id == loc) {
											dem++;
										}
									}
									if(dem!=0){
										mangNew.push(data.objects[i])
									}

								}
								if(loc == undefined){
									self.render_grid2(0,data.objects);

								}
								else{
									self.render_grid2(0,mangNew);

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
				
				locsolanbaocao =filters_common;
				filters['filters']['$and'].push({
					solanthanhtra: { "$eq": filters_common }
				});
			})
		
			self.$el.find('#chuathanhtraganday_combobox').on('change.gonrin', function (e) {
				var filters_common = self.$el.find('#chuathanhtraganday_combobox').val();
				
				locsonamchuabaocao = filters_common;
				filters['filters']['$and'].push({
					namchuathanhtraganday: { "$eq": filters_common }
				});
			})




		},

		// soLanThanhTra: function () {
		// 	var self = this;
		// 	$.ajax({
		// 		url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep",
		// 		method: "GET",
		// 		success: function (data) {
		// 			var arr = [];
		// 			(data.objects).forEach(function (item, index) { 
		// 				console.log(item)
		// 				if (item.trangthai == "end_checked" || item.trangthai == "completed")
		// 					arr.push(item.madoanhnghiep);
		// 			});

		// 			let ans = deduplicate(arr);

		// 			function deduplicate(arr) {
		// 				let isExist = (arr, x) => {
		// 					for (let i = 0; i < arr.length; i++) {
		// 						if (arr[i] === x) return true;
		// 					}
		// 					return false;
		// 				}

		// 				let ans = [];
		// 				arr.forEach(element => {
		// 					if (!isExist(ans, element)) ans.push(element);
		// 				});
		// 				return ans;
		// 			}

		// 			for (var i = 0; i < ans.length; i++) {
		// 				var dem = 0;
		// 				for (var j = 0; j < arr.length; j++) {
		// 					if (ans[i] == arr[j]) {
		// 						dem++;
		// 					}
		// 				}
		// 				var param = {
		// 					solanthanhtra: dem
		// 				}
		// 				$.ajax({
		// 					url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep/" + ans[i],
		// 					type: 'PUT',
		// 					data: JSON.stringify(param),
		// 					headers: {
		// 						'content-type': 'application/json'
		// 					},
		// 					dataType: 'json',
		// 					success: function (data) {

		// 					},
		// 					error: function (request, textStatus, errorThrown) {
		// 						console.log(request)
		// 					}
		// 				})
		// 			}
		// 		},
		// 	})
		// },
		// chuaThanhTraGanDay: function () {
		// 	var self = this;

		// 	$.ajax({
		// 		url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra",
		// 		method: "GET",
		// 		success: function (data) {
		// 			var arr = [];
		// 			(data.objects).forEach(function (item, index) {
		// 				if (item.trangthai == "end_checked"|| item.trangthai == "completed"  )
		// 					arr.push({
		// 						"ma": item.madoanhnghiep,
		// 						"namsoanthao": moment(item.ngaythanhtra * 1000).year()
		// 					});
		// 			});
		// 			var mangNamGanNhat = [];

		// 			for (var i = 0; i < arr.length; i++) {
		// 				var mangMax = arr[i];
		// 				for (var j = 0; j < arr.length; j++) {
		// 					if (arr[i].ma == arr[j].ma && arr[i].namsoanthao < arr[j].namsoanthao) {
		// 						mangMax = arr[j];
		// 					}
		// 				}
		// 				mangNamGanNhat.push(mangMax);
		// 			}
		// 			let ans = deduplicate(mangNamGanNhat);

		// 			function deduplicate(arr) {
		// 				let isExist = (arr, x) => {
		// 					for (let i = 0; i < arr.length; i++) {
		// 						if (arr[i] === x) return true;
		// 					}
		// 					return false;
		// 				}

		// 				let ans = [];
		// 				arr.forEach(element => {
		// 					if (!isExist(ans, element)) ans.push(element);
		// 				});
		// 				return ans;
		// 			}
		// 			var year = new Date();
		// 			var namhientai = year.getFullYear();

		// 			ans.forEach(function (item) {
		// 				var param = {
		// 					namchuathanhtraganday: namhientai - item.namsoanthao
		// 				}
		// 				$.ajax({
		// 					url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep/" + item.ma,
		// 					type: 'PUT',
		// 					data: JSON.stringify(param),
		// 					headers: {
		// 						'content-type': 'application/json'
		// 					},
		// 					dataType: 'json',
		// 					success: function (data) {

		// 					},
		// 					error: function (request, textStatus, errorThrown) {
		// 					}
		// 				})
		// 			})

		// 		}

		// 	})
		// },







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
						self.getApp().getRouter().navigate("danhmucdoanhnghiep/model?id=" + e.rowId+
						"&tinhthanh_ID="+sessionStorage.getItem('tinhthanh_ID')+
						"&chisotuanthu="+sessionStorage.getItem('chisotuanthu')+
						"&linhvuc_ID="+sessionStorage.getItem('linhvuc_ID')+
						"&sonamchuathanhtra="+sessionStorage.getItem('sonamchuathanhtra')+
						"&solanthanhtra="+sessionStorage.getItem('solanthanhtra')
						);
					},
				},
			});
		},



	});

});