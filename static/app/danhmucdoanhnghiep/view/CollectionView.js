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
			self.applyBindings()

			//Tạo tiêu đề cho cái nút thêm vào kế hoạch năm sau
			var d = new Date();
			self.$el.find('.tieuDeNamSau').text(d.getFullYear() + 1);

			//Đăng ký function
			self.khoiTaoDuLieu();
			self.anHienCacNut();
			self.chonLinhVuc();
			self.chonTinhThanh();
			self.chonChiSo();
			self.chonSoLanThanhTra();
			self.chonSoNamChuaThanhTra();
			self.locDuLieu();
			self.xoaLoc();
		},
		chonLinhVuc: function () {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhmuclinhvuc",
				method: "GET",
				data: { "q": JSON.stringify({ "order_by": [{ "field": "grouplinhvuc", "direction": "desc" }], "page": 1, "results_per_page": 10000 }) },
				contentType: "application/json",
				success: function (data) {
					var grouplinhvuc = "";
					var classMaLinhVuc = "";
					data.objects.forEach(function (item, index) {
						if (grouplinhvuc !== item.grouplinhvuc) {
							classMaLinhVuc = item.malinhvuc;
							self.$el.find('.chonlinhvuc select').append(`
							<optgroup label="${item.grouplinhvuc}" class ="optgroup${classMaLinhVuc} pt-0 pb-0 " >
							<option value="${item.id}">${item.tenlinhvuc}</option>
							</optgroup>
							`)
							grouplinhvuc = item.grouplinhvuc
						} else {
							self.$el.find('.optgroup' + classMaLinhVuc).append(`
								<option value="${item.id}" >${item.tenlinhvuc}</option>
							`)
						}
					})
					self.$el.find('.chonlinhvuc select').selectpicker({
						'actionsBox': 'true'
					});
				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});

		},
		chonTinhThanh: function () {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/tinhthanh?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				contentType: "application/json",
				success: function (data) {
					data.objects.forEach(function (item, index) {
						self.$el.find('.chontinhthanh select').append(`
						<option value="${item.id}" data-id="${item.id}">${item.ten}</option>
					`)
					})
					self.$el.find('.chontinhthanh select').selectpicker('val', 'deselectAllText');
					self.$el.find('.chontinhthanh select').on('shown.bs.select', function (e, clickedIndex, isSelected, previousValue) {
						self.$el.find('.popover-header .close').css('line-height', '10px')
						self.$el.find('.popover-header .close').unbind('click').bind('click', function () {
							self.$el.find('.chontinhthanh select').selectpicker('val', 'deselectAllText');
						})
					})
				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});
		},
		chonChiSo: function () {
			var self = this;
			self.$el.find('.chonchiso select').selectpicker('val', 'deselectAllText');
			self.$el.find('.chonchiso select').on('shown.bs.select', function (e, clickedIndex, isSelected, previousValue) {
				self.$el.find('.popover-header .close').css('line-height', '10px')
				self.$el.find('.popover-header .close').unbind('click').bind('click', function () {
					self.$el.find('.chonchiso select').selectpicker('val', 'deselectAllText');
				})
			})
		},
		chonSoLanThanhTra: function () {
			var self = this;
			self.$el.find('.chonsolanthanhtra select').selectpicker('val', 'deselectAllText');
			self.$el.find('.chonsolanthanhtra select').on('shown.bs.select', function (e, clickedIndex, isSelected, previousValue) {
				self.$el.find('.popover-header .close').css('line-height', '10px')
				self.$el.find('.popover-header .close').unbind('click').bind('click', function () {
					self.$el.find('.chonsolanthanhtra select').selectpicker('val', 'deselectAllText');
				})
			})
		},
		chonSoNamChuaThanhTra: function () {
			var self = this;
			self.$el.find('.chonsonamchuathanhtra select').selectpicker('val', 'deselectAllText');
			self.$el.find('.chonsonamchuathanhtra select').on('shown.bs.select', function (e, clickedIndex, isSelected, previousValue) {
				self.$el.find('.popover-header .close').css('line-height', '10px')
				self.$el.find('.popover-header .close').unbind('click').bind('click', function () {
					self.$el.find('.chonsonamchuathanhtra select').selectpicker('val', 'deselectAllText');
				})
			})
		},
		locDuLieu: function () {
			var self = this;
			self.$el.find('.boloc').unbind('click').bind('click', function () {

				var giatriloc_SoNamChuaThanhTra = self.$el.find('.chonsonamchuathanhtra select').selectpicker('val');
				var giatriloc_SoLanThanhTra = self.$el.find('.chonsolanthanhtra select').selectpicker('val');
				var giatriloc_ChiSo = self.$el.find('.chonchiso select').selectpicker('val');
				var giatriloc_TinhThanh = self.$el.find('.chontinhthanh select').selectpicker('val');
				var giatriloc_LinhVuc = null;
				if (self.$el.find('.chonlinhvuc select').selectpicker('val').length != 0) {
					giatriloc_LinhVuc = self.$el.find('.chonlinhvuc select').selectpicker('val');
				}



				var mangBoLoc = [
					{
						"giatri": giatriloc_SoNamChuaThanhTra,
						"tieude": "namchuathanhtraganday",
					},
					{
						"giatri": giatriloc_SoLanThanhTra,
						"tieude": "solanthanhtra",
					},
					{
						"giatri": giatriloc_ChiSo,
						"tieude": "chisotuanthuphapluat"
					},
					{
						"giatri": giatriloc_TinhThanh,
						"tieude": "tinhthanh_id"
					},

				]
				const promise = new Promise((resolve, reject) => {
					var mangBoLocSauKiemTraNull = [];

					mangBoLoc.forEach(function (item, index) {
						var tieuDe = {};
						if (item.giatri !== null) {
							tieuDe[item.tieude] = { "$eq": item.giatri };
							mangBoLocSauKiemTraNull.push(tieuDe)
						}
					})
					return resolve(mangBoLocSauKiemTraNull)
				})
				promise.then((data) => {
					var filter = "data";
					const isEmpty = v => {
						return Object.keys(v).length === 0;
					};
					if (isEmpty(data) == false) {
						var filters = {
							filters: {
								"$and":
									data

							},
							order_by: [{ "field": "created_at", "direction": "asc" }]
						}
						filter = JSON.stringify(filters);
					}
					$.ajax({
						url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep?results_per_page=100000&max_results_per_page=1000000",
						method: "GET",
						data: "q=" + filter,
						contentType: "application/json",
						success: function (data) {
							var mangSauLocLinhVuc = data.objects;
							if (giatriloc_LinhVuc != null) {
								mangSauLocLinhVuc = [];
								data.objects.forEach(function (itemdoanhnghiep, indexdoanhnghiep) {
									var dem = 0;
									itemdoanhnghiep.danhmuclinhvuc_foreign.forEach(function (itemlinhvuc, indexlinhvuc) {
										giatriloc_LinhVuc.forEach(function (itemloc, indexloc) {
											if (itemloc == itemlinhvuc.id) {
												dem++;
											}
										});
									});
									if (dem == giatriloc_LinhVuc.length) {
										mangSauLocLinhVuc.push(itemdoanhnghiep)
									}

								});
							}
							self.btnLuuTaoKeHoachMoi(mangSauLocLinhVuc);
							self.btnLuuKeHoachDaCo(mangSauLocLinhVuc);
							self.render_grid2(0, mangSauLocLinhVuc);

						},
						error: function (xhr, status, error) {
							self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
						},
					});

				});
			})
		},
		xoaLoc: function () {
			var self = this;
			self.$el.find('.xoaloc').unbind('click').bind('click', function () {
				self.getApp().getRouter().refresh();
			})
		},
		anHienCacNut: function () {
			var self = this;
			self.$el.find('.btn-taokehoachmoi').unbind('click').bind('click', function () {
				self.$el.find('.content-kehoach').show();
				self.$el.find('.btn-taokehoachmoi, .btn-chonkehoachdaco').hide();
				self.$el.find('.btn-trolai').show();
				self.$el.find('.taoKeHoachMoi').show();
				self.$el.find('.chonKeHoachDaCo').hide();
			})
			self.$el.find('.btn-chonkehoachdaco').unbind('click').bind('click', function () {
				self.$el.find('.content-kehoach').show();
				self.$el.find('.btn-taokehoachmoi, .btn-chonkehoachdaco').hide();
				self.$el.find('.btn-trolai').show();
				self.$el.find('.chonKeHoachDaCo').show();
				self.$el.find('.taoKeHoachMoi').hide();
			})
			self.$el.find('.btn-trolai').unbind('click').bind('click', function () {
				self.$el.find('.content-kehoach').hide();
				self.$el.find('.btn-taokehoachmoi, .btn-chonkehoachdaco').show();
				self.$el.find('.btn-trolai .troLai').hide();
			})
			self.$el.find('.btn-close').unbind('click').bind('click', function () {
				self.$el.find('.noidungcuocthanhtra').hide()
				self.$el.find(".noidungtrang").css('opacity', '1');

			});
			self.$el.find('#themVaoKeHoachNamSau').unbind('click').bind('click', function () {
				self.$el.find('.noidungcuocthanhtra').show();
				self.$el.find(".noidungtrang").css('opacity', '0.1');

			});
		},
		btnLuuTaoKeHoachMoi: function (arr) {
			var self = this;
			self.$el.find('.btn-luu-taokehoachmoi').unbind('click').bind('click', function () {
				var d = new Date();
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/noidungkehoachnamsau",
					type: 'POST',
					data: JSON.stringify({
						'noidungkehoach': self.$el.find('#noidungkehoach').val(),
						'phamvithanhtratu': self.$el.find('#phamvithanhtratu').val(),
						'phamvithanhtraden': self.$el.find('#phamvithanhtraden').val(),
						'thoigiantienhanh': self.$el.find('#thoigiantienhanh').val(),
						'donvichutri': self.$el.find('#donvichutri').val(),
						'donviphoihop': self.$el.find('#donviphoihop').val(),
						'diachi': self.$el.find('#diachi').val(),
						'nam': d.getFullYear() + 1,
					}
					),
					headers: {
						'content-type': 'application/json'
					},
					dataType: 'json',
					success: function (datanoidungkehoach) {
						$.ajax({
							url: self.getApp().serviceURL + "/api/v1/themvaokehoachnamsau",
							type: 'POST',
							data: JSON.stringify({
								'daTaDonVi': arr,
								'idNoiDungKeHoach': datanoidungkehoach.id,
								'nam': d.getFullYear() + 1,
							}
							),
							headers: {
								'content-type': 'application/json'
							},
							dataType: 'json',
							success: function (data) {
								self.getApp().notify("Thêm kế hoạch thành công");

							},
							error: function (request, textStatus, errorThrown) {
							}
						})
					},
					error: function (request, textStatus, errorThrown) {
					}
				})
			})
		},
		btnLuuKeHoachDaCo: function (arr) {
			var self = this;
			var d = new Date();
			var filters = {
				filters: {
					"$and": [
						{ "nam": { "$eq": d.getFullYear() + 1 } }
					]
				},
				order_by: [{ "field": "created_at", "direction": "asc" }]
			}
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/noidungkehoachnamsau?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				data: "q=" + JSON.stringify(filters),
				contentType: "application/json",
				success: function (data) {
					data.objects.forEach(function (item, index) {
						self.$el.find('.selectpicker').append(`
						<option data-id="${item.id}">${item.noidungkehoach}</option>
					`)
					})
					self.$el.find('select').selectpicker();
					self.$el.find('select').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
						self.$el.find('#noidungkehoach').val(data.objects[clickedIndex].noidungkehoach);
						self.$el.find('#phamvithanhtratu').val(data.objects[clickedIndex].phamvithanhtratu);
						self.$el.find('#phamvithanhtraden').val(data.objects[clickedIndex].phamvithanhtraden);
						self.$el.find('#thoigiantienhanh').val(data.objects[clickedIndex].thoigiantienhanh);
						self.$el.find('#donvichutri').val(data.objects[clickedIndex].donvichutri);
						self.$el.find('#donviphoihop').val(data.objects[clickedIndex].donviphoihop);
						self.$el.find('#diachi').val(data.objects[clickedIndex].diachi);

						self.$el.find('.btn-luu-kehoachdaco').unbind('click').bind('click', function () {
							var d = new Date();
							$.ajax({
								url: self.getApp().serviceURL + "/api/v1/themvaokehoachnamsau",
								type: 'POST',
								data: JSON.stringify({
									'daTaDonVi': arr,
									'idNoiDungKeHoach': data.objects[clickedIndex].id,
									'nam': d.getFullYear() + 1,
								}
								),
								headers: {
									'content-type': 'application/json'
								},
								dataType: 'json',
								success: function (data) {
									self.getApp().notify("Thêm kế hoạch thành công");
								},
								error: function (request, textStatus, errorThrown) {
								}
							})
						})
					})
				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});
		},
		khoiTaoDuLieu: function () {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhmucdoanhnghiep",
				method: "GET",
				data: { "q": JSON.stringify({ "order_by": [{ "field": "updated_at", "direction": "desc" }] }) },
				contentType: "application/json",
				success: function (data) {
					var x = data.objects
					self.render_grid2(0, x);
				},
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
				refresh: true,

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