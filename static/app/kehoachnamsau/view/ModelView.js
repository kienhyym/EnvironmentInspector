define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/kehoachnamsau/tpl/model.html'),
		schema = require('json!schema/KeHoachNamSauSchema.json');
	var DanhSachDonViKeHoachNamSauItemView = require('app/kehoachnamsau/view/DanhSachDonViKeHoachNamSauView');


	return Gonrin.ModelView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "kehoachnamsau",
		tools: [
			{
				name: "defaultgr",
				type: "group",
				groupClass: "toolbar-group",
				buttons: [
					{
						name: "back",
						type: "button",
						buttonClass: "btn-default btn-sm",
						label: "TRANSLATE:BACK",
						command: function () {
							var self = this;
							if (self.getApp().currentUser.hasRole("CucTruong")) {
								self.getApp().getRouter().navigate(self.collectionName + "/collection");
							}
						},
						// visible: function () {
						// 	return this.getApp().currentUser.hasRole("CucTruong");
						// }
					},
					{
						name: "save",
						type: "button",
						buttonClass: "btn-success btn-sm",
						label: "TRANSLATE:SAVE",
						// visible: function () {
						// return this.getApp().currentUser.hasRole("CucTruong");
						// },
						command: function () {
							var self = this;
							self.model.save(null, {
								success: function (model, respose, options) {
									self.getApp().notify("Lưu thông tin thành công");
									self.getApp().getRouter().navigate(self.collectionName + "/collection");

								},
								error: function (xhr, status, error) {
									try {
										if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
											self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
											self.getApp().getRouter().navigate("login");
										} else {
											self.getApp().notify({ messtext: $.parseJSON(error.xhr.responseText).error_messtext }, { type: "danger", delay: 1000 });
										}
									}
									catch (err) {
										self.getApp().notify({ messtext: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
									}
								}
							});
						}
					},
					{
						name: "delete",
						type: "button",
						buttonClass: "btn-danger btn-sm",
						label: "TRANSLATE:DELETE",
						// visible: function () {
						// 	return (this.getApp().currentUser.hasRole("CucTruong") && this.getApp().getRouter().getParam("id") !== null);
						// },
						command: function () {
							var self = this;
							self.model.destroy({
								success: function (model, response) {
									self.getApp().notify('Xoá dữ liệu thành công');
									self.getApp().getRouter().navigate(self.collectionName + "/collection");
								},
								error: function (xhr, status, error) {
									try {
										if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
											self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
											self.getApp().getRouter().navigate("login");
										} else {
											self.getApp().notify({ messtext: $.parseJSON(error.xhr.responseText).error_messtext }, { type: "danger", delay: 1000 });
										}
									}
									catch (err) {
										self.getApp().notify({ messtext: "Xóa dữ liệu không thành công" }, { type: "danger", delay: 1000 });
									}
								}
							});
						}
					},
				],
			}],
		render: function () {
			var self = this;
			self.getApp().currentUser.roles.forEach(function (item, index) {
				if (item.role_name == 'VanPhongCuc') {
					self.$el.find('.toolbar').hide();
				}
			})
			var id = this.getApp().getRouter().getParam("id");
			var arr = [];
			self.getApp().currentUser.roles.forEach(function (item, index) {
				if (item.role_name == "ChuyenVien") {
					arr = [
						{ text: "Chuyên viên đã hoàn thành", value: "chuyenviendahoanthanh" },
					]
				}
				if (item.role_name == "CucTruong") {
					arr = [
						{ text: "Cục trưởng đã duyệt", value: "cuctruongdaduyet" },
						{ text: "Cục trưởng yêu cầu sửa lại", value: "cuctruongyeucausua" },

					]
				}
				if (item.role_name == "PhoCucTruong") {
					arr = [
						{ text: "Phó cục trưởng đã duyệt", value: "phocuctruongdaduyet" },
						{ text: "Phó cục trưởng yêu cầu sửa lại", value: "phocuctruongyeucausua" },

					]
				}
				if (item.role_name == "TruongPhong") {
					arr = [
						{ text: "Trưởng phòng đã duyệt", value: "truongphongdaduyet" },
						{ text: "Trưởng phòng yêu cầu sửa lại", value: "truongphongyeucausua" },

					]
				}
			})
			self.$el.find('#trangthai').combobox({
				textField: "text",
				valueField: "value",
				allowTextInput: true,
				enableSearch: true,
				dataSource: arr,
			});
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						self.$el.find('.body_grid').show()
						var text = 'Trạng thái';
						if (self.model.get('trangthai') == "truongphongyeucausua") {
							text = "Trưởng phòng yêu cầu sửa lại";

						}
						if (self.model.get('trangthai') == "truongphongdaduyet") {
							text = "Trưởng phòng đã duyệt";
							self.$el.find('.chophepsua').hide();

						}
						if (self.model.get('trangthai') == "cuctruongdaduyet") {
							self.$el.find('.toolbar .btn-success').hide()
							self.$el.find('.toolbar .btn-danger').hide()
							text = "Cục trưởng đã duyệt";
							self.$el.find('.chophepsua').hide();
							
						}
						if (self.model.get('trangthai') == "cuctruongyeucausua") {
							text = "Cục trưởng yêu cầu sửa lại";
						}
						if (self.model.get('trangthai') == "phocuctruongdaduyet") {
							text = "Phó cục trưởng đã duyệt";
							self.$el.find('.chophepsua').hide();

						}
						if (self.model.get('trangthai') == "phocuctruongyeucausua") {
							text = "Phó cục trưởng yêu cầu sửa lại";
						}
						if (self.model.get('trangthai') == "chuyenviendahoanthanh") {
							text = "Chuyên viên đã hoàn thành";
							self.$el.find('.chophepsua').hide();

						}
						self.$el.find('.trangthai2 div div input').attr('placeholder', text)
						self.applyBindings();
						self.danhSachDonViThanhTra();
						self.locNoiDung();
					},
					error: function () {
						self.getApp().notify("Get data Eror");
					},

				});
			} else {
				self.applyBindings();

			}

		},
		danhSachDonViThanhTra: function () {
			var self = this;
			var filters = {
				filters: {
					"$and": [
						{ "nam": { "$eq": self.model.get('nam') } }
					]
				},
				order_by: [{ "field": "noidungkehoachnamsau_id", "direction": "desc" }]
			}

			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/danhsachdonvikehoachnamsau?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				data: "q=" + JSON.stringify(filters),
				contentType: "application/json",
				success: function (data) {
					data.objects.forEach(function (item, index) {
						item.stt = index + 1;
						// self.$el.find('#space_danhsachdonvikehoachnamsau').append(`
						// 		<tr>
						// 			<td class = "p-1">${index + 1}</td>
						// 			<td class = "p-1">${item.danhmucdoanhnghiep.name}</td>
						// 			<td class = "p-1" >
						// 			<textarea rows= "5" class="noidungkehoach border-0 pl-1 pr-1 pt-0 pb-0 form-control text-dark" style="overflow-x: hidden; width:100px;font-size: 14px;">${item.noidungkehoachnamsau.noidungkehoach}</textarea>
						// 			</td>
						// 			<td class="phamvithanhtra p-1" >
						// 			Từ ngày
						// 			<div class="border border-0">
						// 				<input class="phamvithanhtratu text-center" type="text" style="width:100px">
						// 				</div>
						// 			đến ngày
						// 			<div class="border border-0">
						// 				<input class="phamvithanhtraden text-center" type="text" style="width:100px">
						// 				</div>
						// 			</td>
						// 			<td class = "p-1">	
						// 				<div class="border border-0 mt-5  ">
						// 				<input class="thoigiantienhanh text-center" type="text" style="width:100px">
						// 				</div>
						// 			</td>
						// 			<td class="donvichutri p-1" >
						// 				<div class="form-group required border rounded donvichutri_id">
						// 					<select class="selectpicker  col-md-12 m-0 p-0" data-live-search="true" data-header="Bỏ chọn">
						// 					</select>
						// 				</div>
						// 			</td>
						// 			<td class="donviphoihop p-1" >
						// 				<div class="form-group required border rounded donviphoihop_id">
						// 					<select class="selectpicker  col-md-12 m-0 p-0" data-live-search="true" data-header="Bỏ chọn">
						// 					</select>
						// 				</div>
						// 			</td>
						// 			<td class="diachi p-1" >${item.danhmucdoanhnghiep.diachi}, ${item.danhmucdoanhnghiep.tenxaphuong}, ${item.danhmucdoanhnghiep.tenquanhuyen}, ${item.danhmucdoanhnghiep.tentinhthanh}</td>
						// 			<td class="p-1" style="position: relative;">
						// 				<button class="btn btn-primary p-1 mt-4 btn-taokehoach" data-id="${item.id}" style="width:46px">Tạo kế hoạch</button>
						// 				<button class="btn btn-outline-danger p-1 btn_xoakehoach" style="position: absolute;top: 0px;right: 0px;" >x</button>
						// 			</td>

						// 		</tr>
						// 	`)


						//Gọi các hàm thay đổi nội dung, thời gian, đơn vị
						// self.noiDungThanhTra(item.noidungkehoachnamsau_id, index);
						// self.chonDonViPhoiHop_ChuTri(item.id, item.donvichutri_id, item.donviphoihop_id, index);
						// self.luaChonThoiGian(item.id, item.phamvithanhtratu, item.phamvithanhtraden, item.thoigiantienhanh, index);
						// self.taoKeHoachThanhTra(item.noidungkehoachnamsau_id, index, item.kehoachthanhtra_id, item.kehoachthanhtra, item.donvi_id, item.danhmucdoanhnghiep.name, item.linhvucloc);
						// self.xoaKhoiKeHoach(item.id, index)
					})
					self.render_grid2(data.objects)


				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});


		},
		tenDonViPhoiHop_ChuTri: function () {
			var self = this;

			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/donvi?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				contentType: "application/json",
				success: function (data) {
					var arr_donvi = [
						"tendonvichutri",
						"tendonviphoihop",
					]
					arr_donvi.forEach(function (item, index) {
						self.$el.find('.' + item).each(function (index_html, item_html) {
							data.objects.forEach(function (itemdata, indexdata) {
								if ($(item_html).attr('iddonvi') == itemdata.id) {
									$(item_html).text(itemdata.ten)
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

		chonDonViPhoiHop_ChuTri: function () {
			var self = this;
			var arr_donvi = [
				"donvichutri_id",
				"donviphoihop_id",
			]
			arr_donvi.forEach(function (item, index) {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi?results_per_page=100000&max_results_per_page=1000000",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						self.$el.find('.' + item + ' select').each(function (index_html, item_html) {
							data.objects.forEach(function (item_donvi, index_donvi) {
								$(item_html).append(`
								<option value="${item_donvi.id}" >${item_donvi.ten}</option>
							`)
								$(item_html).selectpicker({ 'width': '100px', });
								if ($(item_html).attr('valueid') != undefined) {
									$(item_html).selectpicker('val', $(item_html).attr('valueid'));
								}
								else {
									$(item_html).selectpicker('val', 'deselectAllText');
								}


							})
							if ($(item_html).attr('valueid') != undefined) {
								$(item_html).before(`
								<div class="text-center">
									${$(item_html).find("*[value='" + $(item_html).attr('valueid') + "']").text().trim()}
								</div>
								`)
							}
							$(item_html).on('shown.bs.select', function (e, clickedIndex, isSelected, previousValue) {
								self.$el.find('.popover-header .close').css('line-height', '10px')
								self.$el.find('.popover-header .close').unbind('click').bind('click', function () {
									$(item_html).selectpicker('val', 'deselectAllText');
								})
							})
							$(item_html).on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
								$(this).attr('valueid', $(this).selectpicker('val'))
								$(this).prev('div').remove()
								$(this).before(`
								<div class="text-center">
									${$(this).find("*[value='" + $(this).attr('valueid') + "']").text().trim()}
								</div>
								`)
								var field = {}
								if ($(this).attr('valueid') == undefined) {
									field[item] = null;
								} else {
									field[item] = $(this).attr('valueid');
								}

								$.ajax({
									url: self.getApp().serviceURL + "/api/v1/danhsachdonvikehoachnamsau/" + $(this).attr('idThanhTraDoanhNghiep'),
									type: 'PUT',
									data: JSON.stringify(field),
									headers: {
										'content-type': 'application/json'
									},
									dataType: 'json',
									success: function (data) {
										self.getApp().notify("Lưu đơn vị thành công");
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
			})

		},
		luaChonThoiGian: function () {
			var self = this;
			var loaiThoiGian = [
				"phamvithanhtratu",
				"phamvithanhtraden",
				"thoigiantienhanh"
			];
			$.fn.datepicker.dates['vie'] = {
				days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
				daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				daysMin: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
				months: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],
				monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				today: "Today",
				clear: "Clear",
				format: "dd/mm/yyyy",
				titleFormat: "MM yyyy",
				weekStart: 0
			};
			loaiThoiGian.forEach(function (item, index) {
				self.$el.find('.' + item).datepicker({
					format: "dd/mm/yyyy",
					language: "vie"
				}).on("changeDate", function (e) {
					var idThanhTraDoanhNghiep = $(this).attr('idThanhTraDoanhNghiep')
					var thoigGianThayDoi = {}
					thoigGianThayDoi[item] = Number(moment(e.date).tz('Asia/Ho_Chi_Minh').format("X"));

					$.ajax({
						url: self.getApp().serviceURL + "/api/v1/danhsachdonvikehoachnamsau/" + idThanhTraDoanhNghiep,
						type: 'PUT',
						data: JSON.stringify(thoigGianThayDoi),
						headers: {
							'content-type': 'application/json'
						},
						dataType: 'json',
						success: function (data) {
							self.getApp().notify("Lưu thời gian thành công");
						},
						error: function (request, textStatus, errorThrown) {
						}
					})
				});
			});
		},
		noiDungThanhTra: function () {
			var self = this;
			self.$el.find('.noidungkehoach').change(function () {
				var textThayDoi = $(this).val();
				var idNoiDung = $(this).attr('idnoidung');
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/noidungkehoachnamsau/" + idNoiDung,
					type: 'PUT',
					data: JSON.stringify({ "noidungkehoach": textThayDoi }),
					headers: {
						'content-type': 'application/json'
					},
					dataType: 'json',
					success: function (data) {
						self.getApp().notify("Lưu nội dung thành công");
						self.$el.find('.noidungkehoach').each(function (index, item) {
							if ($(item).attr('idnoidung') == idNoiDung) {
								$(item).val(textThayDoi)
							}

						})
					},
					error: function (request, textStatus, errorThrown) {
					}
				})
			})
		},
		chonNoiDungThanhTra: function () {
			var self = this;
			var d = new Date();
			var filters = {
				filters: {
					"$and": [
						{ "nam": { "$eq": d.getFullYear() + 1 } }
					]
				},
				order_by: [{ "field": "created_at", "direction": "desc" }]
			}

			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/noidungkehoachnamsau?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				data: JSON.stringify(filters),
				contentType: "application/json",
				success: function (data) {
					self.$el.find('.noidungkehoachnamsau_id select').each(function (index_html, item_html) {
						data.objects.forEach(function (item_donvi, index_donvi) {
							$(item_html).append(`
								<option value="${item_donvi.id}" >${item_donvi.noidungkehoach}</option>
							`)
							$(item_html).selectpicker({ 'width': '100px', });
							if ($(item_html).attr('valueid') != undefined) {
								$(item_html).selectpicker('val', $(item_html).attr('valueid'));
							}
							else {
								$(item_html).selectpicker('val', 'deselectAllText');
							}


						})
						$(item_html).on('shown.bs.select', function (e, clickedIndex, isSelected, previousValue) {
							self.$el.find('.popover-header .close').css('line-height', '10px')
							self.$el.find('.popover-header .close').unbind('click').bind('click', function () {
								$(item_html).selectpicker('val', 'deselectAllText');
							})
						})
						$(item_html).on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {

							$(this).attr('valueid', $(this).selectpicker('val'))
							var field = {}
							if ($(this).attr('valueid') == undefined) {
								field["noidungkehoachnamsau_id"] = null;
							} else {
								field["noidungkehoachnamsau_id"] = $(this).attr('valueid');
							}
							var idnoidung = $(this).attr('valueid')
							var textThayDoi = $(this).find("*[value='" + $(this).attr('valueid') + "']").text().trim()
							$(self.$el.find('.noidungkehoach')[index_html]).val(textThayDoi)
							console.log($(this).next('div'))
							$.ajax({
								url: self.getApp().serviceURL + "/api/v1/danhsachdonvikehoachnamsau/" + $(this).attr('idThanhTraDoanhNghiep'),
								type: 'PUT',
								data: JSON.stringify(field),
								headers: {
									'content-type': 'application/json'
								},
								dataType: 'json',
								success: function (data) {
									self.getApp().notify("Lưu đơn vị thành công");

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
			})

		},
		taoKeHoachThanhTra: function () {
			var self = this;
			// var trangThai = null;
			// if (kehoachthanhtra_id != null) {
			// 	var foreignValues = [
			// 		{ value: "new", text: "Tạo mới" },
			// 		{ value: "send_review_truongphong", text: "Chờ cấp phòng duyệt" },
			// 		{ value: "cancel_reviewed_truongphong", text: "Phòng từ chối" },
			// 		{ value: "send_review_pct", text: "Chờ PCT duyệt" },
			// 		{ value: "cancel_reviewed_pct", text: "PCT từ chối" },
			// 		{ value: "send_approved", text: "Chờ CT duyệt" },
			// 		{ value: "cancel_approved", text: "CT từ chối" },
			// 		{ value: "approved", text: "CT đã duyệt quyết định" },
			// 		{ value: "checked", text: "Đã kiểm tra" },
			// 		{ value: "result_checked", text: "Đã có kết luận" },
			// 		{ value: "completed", text: "Hoàn thành" },
			// 		{ value: "end_checked", text: "Đã kết thúc thanh tra" }
			// 	]
			// 	foreignValues.forEach(function (item) {
			// 		if (item.value == trangthai.trangthai) {
			// 			trangThai = item.text;
			// 		}
			// 	})

			// 	$(self.$el.find('.btn-taokehoach')[idx]).text(trangThai)
			// 	$(self.$el.find('.btn-taokehoach')[idx]).removeClass('btn-primary')
			// 	$(self.$el.find('.btn-taokehoach')[idx]).addClass('btn-success')
			// 	$(self.$el.find('.btn-taokehoach')[idx]).unbind('click').bind('click', function () {
			// 		self.getApp().getRouter().navigate("kehoachthanhtra/model?id=" + kehoachthanhtra_id);
			// 		localStorage.setItem('idItem', $(self.$el.find('.btn-taokehoach')[idx]).attr('data-id'))
			// 	})

			// }
			// else {
			// 	self.$el.find('.btn-taokehoach').unbind('click').bind('click', function () {

			// 		self.getApp().getRouter().navigate("kehoachthanhtra/model");
			// 		localStorage.setItem('idItem', $(self.$el.find('.btn-taokehoach')[idx]).attr('data-id'))
			// 		localStorage.setItem('idDonVi', donvi_id)
			// 		localStorage.setItem('tenDonVi', ten_donVi)
			// 		localStorage.setItem('dsLinhVuc', JSON.stringify(dslinhvuc))




			// 	})
			// }
			self.$el.find('.btn-taokehoach').unbind('click').bind('click', function () {
				if ($(this).attr('kehoachthanhtra_id') != null) {
					self.getApp().getRouter().navigate("kehoachthanhtra/model?id=" + $(this).attr('kehoachthanhtra_id'));
				}
				else {
					self.getApp().getRouter().navigate("kehoachthanhtra/model");
					localStorage.setItem('idItem', $(this).attr('data-id'))
					localStorage.setItem('idDonVi', $(this).attr('danhmucdoanhnghiep_id'))
					localStorage.setItem('tenDonVi', $(this).attr('tendanhmucdoanhnghiep'))
					localStorage.setItem('dsLinhVuc', JSON.stringify($(this).attr('linhvucloc')))
				}





			})

		},
		xoaKhoiKeHoach: function (id, idx) {
			var self = this;
			if (self.model.get('trangthai') == "cuctruongdaduyet") {
				self.$el.find('.btn_xoakehoach').hide()
			}
			
			self.$el.find('.btn_xoakehoach').unbind('click').bind('click', function () {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/danhsachdonvikehoachnamsau/" + $(this).attr('data-id'),
					type: 'DELETE',
					headers: {
						'content-type': 'application/json'
					},
					dataType: 'json',
					success: function (data) {
						self.getApp().notify("Xóa doanh nghiệp khỏi kế hoạch thành công");
						self.getApp().getRouter().refresh();
					},
					error: function (request, textStatus, errorThrown) {
					}
				})
			})
		},
		render_grid2: function (dataSource) {
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
					{
						label: "STT",
						width: 25,
						field: "stt"
					},
					{
						label: "Đối tượng thanh tra",
						width: 150,

						template: function (rowData) {
							if (!!rowData) {
								return rowData.danhmucdoanhnghiep.name
							}
							return "";
						}
					},
					{
						label: "Nội dung kế hoạch",
						width: 100,

						template: function (rowData) {
							if (!!rowData.noidungkehoachnamsau_id) {
								return `
								<div class="hienThiTitle">${rowData.noidungkehoachnamsau.noidungkehoach}</div>
								<div class="suaTitle" style="display:none" style="display:none" >
									<div class="form-group  noidungkehoachnamsau_id">
										<select idThanhTraDoanhNghiep="${rowData.id}" valueid="${rowData.noidungkehoachnamsau_id}"  class="selectpicker  col-md-12 m-0 p-0" data-live-search="true" data-header="Bỏ chọn">
										</select>
									</div>
								<div class="suaTitle" style="display:none" style="display:none">
									<textarea  rows= "6" idnoidung="${rowData.noidungkehoachnamsau_id}" class="noidungkehoach w-100 pl-1 pr-1 pt-0 pb-0 form-control text-dark" style="overflow-x: hidden;overflow-y: hidden; width:100px;font-size: 14px;">${rowData.noidungkehoachnamsau.noidungkehoach}</textarea>
								</div>
								`
							}
							return `
							<div class="suaTitle" style="display:none" style="display:none" >
									<div class="form-group  noidungkehoachnamsau_id">
										<select idThanhTraDoanhNghiep="${rowData.id}" valueid="${rowData.noidungkehoachnamsau_id}"  class="selectpicker  col-md-12 m-0 p-0" data-live-search="true" data-header="Bỏ chọn">
										</select>
									</div>
								<div class="suaTitle" style="display:none" style="display:none">
									<textarea rows= "6" idnoidung="${rowData.noidungkehoachnamsau_id}" class="noidungkehoach  w-100 pl-1 pr-1 pt-0 pb-0 form-control text-dark" style="overflow-x: hidden;overflow-y: hidden;  width:100px;font-size: 14px;">${rowData.noidungkehoachnamsau.noidungkehoach}</textarea>
								</div>`;
						}
					},
					{
						label: "Phạm vi thanh tra",
						width: 50,
						template: function (rowData) {
							if (!!rowData && rowData.phamvithanhtratu && rowData.phamvithanhtraden) {
								var utcTolocal = function (times, format) {
									return moment(times * 1000).local().format(format);
								}
								return `   
								<div class="hienThiTitle"> 
									<div class="text-center">Từ</div>
									<div class="text-center">${utcTolocal(rowData.phamvithanhtratu, "DD/MM/YYYY")}</div>
									<div class="text-center">-</div>
									<div class="text-center">Đến</div>
									<div  class="text-center">${utcTolocal(rowData.phamvithanhtraden, "DD/MM/YYYY")}</div>
								</div>
								<div class="suaTitle" style="display:none" style="display:none"> 
									<div class="text-center">Từ ngày</div>
										<input idThanhTraDoanhNghiep="${rowData.id}" class="phamvithanhtratu text-center" value="${utcTolocal(rowData.phamvithanhtratu, "DD/MM/YYYY")}" type="text" style="width:100px">
										<div class="text-center">-</div>
										<div class="text-center">Đến ngày</div>
										<input idThanhTraDoanhNghiep="${rowData.id}" class="phamvithanhtraden text-center" value="${utcTolocal(rowData.phamvithanhtraden, "DD/MM/YYYY")}" type="text" style="width:100px">
									</div>
								</div>
                                `;
							}
							return `
								<div class="suaTitle" style="display:none" style="display:none"> 
									<div class="text-center">Từ ngày</div>
										<input idThanhTraDoanhNghiep="${rowData.id}" class="phamvithanhtratu text-center" type="text" style="width:100px">
										<div class="text-center">-</div>
										<div class="text-center">Đến ngày</div>
										<input idThanhTraDoanhNghiep="${rowData.id}" class="phamvithanhtraden text-center" type="text" style="width:100px">
									</div>
								</div>`;

						}
					},
					{
						label: "Thời gian tiến hành",
						width: 50,
						template: function (rowData) {
							if (!!rowData && rowData.thoigiantienhanh) {
								var utcTolocal = function (times, format) {
									return moment(times * 1000).local().format(format);
								}
								return ` 
									<div class="hienThiTitle"> 
										<div class="text-center">Ngày</div>
										<div  class="text-center">${utcTolocal(rowData.thoigiantienhanh, "DD/MM/YYYY")}</div>
									</div>
									
									<div class="suaTitle" style="display:none" style="display:none"> 
										<div class="text-center">Ngày</div>
										<input idThanhTraDoanhNghiep="${rowData.id}" value="${utcTolocal(rowData.thoigiantienhanh, "DD/MM/YYYY")}"  class="thoigiantienhanh text-center" type="text" style="width:100px">
									</div>
                                `;
							}
							return `
								<div class="suaTitle" style="display:none" style="display:none"> 
									<div class="text-center">Ngày</div>
									<input idThanhTraDoanhNghiep="${rowData.id}" class="thoigiantienhanh text-center" type="text" style="width:100px">
								</div>
								
								`;
						}
					},
					{
						label: "Đơn vị chủ trì",
						width: 100,
						template: function (rowData) {
							if (!!rowData && rowData.donvichutri_id) {
								return `  
								<div class="hienThiTitle"> 
									<div class="tendonvichutri " iddonvi = "${rowData.donvichutri_id}">${rowData.donvichutri_id}</div>
								</div>
								<div class="suaTitle" style="display:none" style="display:none"> 
									<div class="form-group donvichutri_id">
										<select idThanhTraDoanhNghiep="${rowData.id}" valueid="${rowData.donvichutri_id}" class="selectpicker   col-md-12 m-0 p-0" data-live-search="true" data-header="Bỏ chọn">
										</select>
									</div>
								</div>`;
							}
							return `
								<div class="suaTitle" style="display:none" style="display:none"> 
									<div class="form-group donvichutri_id">
										<select  idThanhTraDoanhNghiep="${rowData.id}"  class="selectpicker  col-md-12 m-0 p-0" data-live-search="true" data-header="Bỏ chọn">
										</select>
									</div>
								</div>`;
						}
					},
					{
						label: "Đơn vị phối hợp",
						width: 100,
						template: function (rowData) {
							if (!!rowData && rowData.donviphoihop_id) {
								return ` 
								<div class="hienThiTitle"> 						  
									<div class="tendonviphoihop" iddonvi = "${rowData.donviphoihop_id}">${rowData.donviphoihop_id}</div>
								</div>
								<div class="suaTitle" style="display:none" style="display:none" >
									<div class="form-group  donviphoihop_id">
										<select idThanhTraDoanhNghiep="${rowData.id}" valueid="${rowData.donviphoihop_id}"  class="selectpicker  col-md-12 m-0 p-0" data-live-search="true" data-header="Bỏ chọn">
										</select>
									</div>
								</div>
                                `;
							}
							return `
								<div class="suaTitle" style="display:none" style="display:none" >
									<div class="form-group donviphoihop_id">
										<select idThanhTraDoanhNghiep="${rowData.id}" class="selectpicker  col-md-12 m-0 p-0" data-live-search="true" data-header="Bỏ chọn">
										</select>
									</div>
								</div>`;
						}
					},
					{
						label: "Địa chỉ",
						width: 100,
						template: function (rowData) {
							if (!!rowData && rowData.donviphoihop_id) {
								return `   
									<div>${rowData.danhmucdoanhnghiep.diachi}, ${rowData.danhmucdoanhnghiep.tenxaphuong}, ${rowData.danhmucdoanhnghiep.tenquanhuyen}, ${rowData.danhmucdoanhnghiep.tentinhthanh}</div>
                                `;
							}
							return "";
						}
					},
					{
						label: "Trạng thái",
						width: 30,
						template: function (rowData) {
							if (!!rowData && !!rowData.kehoachthanhtra_id) {
								// var foreignValues = [
								// 	{ value: "new", text: "Tạo mới" },
								// 	{ value: "send_review_truongphong", text: "Chờ cấp phòng duyệt" },
								// 	{ value: "cancel_reviewed_truongphong", text: "Phòng từ chối" },
								// 	{ value: "send_review_pct", text: "Chờ PCT duyệt" },
								// 	{ value: "cancel_reviewed_pct", text: "PCT từ chối" },
								// 	{ value: "send_approved", text: "Chờ CT duyệt" },
								// 	{ value: "cancel_approved", text: "CT từ chối" },
								// 	{ value: "approved", text: "CT đã duyệt quyết định" },
								// 	{ value: "checked", text: "Đã kiểm tra" },
								// 	{ value: "result_checked", text: "Đã có kết luận" },
								// 	{ value: "completed", text: "Hoàn thành" },
								// 	{ value: "end_checked", text: "Đã kết thúc thanh tra" }
								// ]
								// foreignValues.forEach(function (item, index) {
								if (rowData.kehoachthanhtra.trangthai === "new") {
									return `
											<div class="p-1" style="position: relative;">
											<button class="btn btn-primary p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">Tạo mới</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach" data-id="${rowData.id}" style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								}
								if (rowData.kehoachthanhtra.trangthai === "send_review_truongphong") {
									return `
											<div class="p-1" style="position: relative;">
											<button class="btn btn-info p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">Chờ cấp phòng duyệt</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach"  data-id="${rowData.id}"  style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								}
								if (rowData.kehoachthanhtra.trangthai == "cancel_reviewed_truongphong") {
									return `
											<div class="p-1" style="position: relative;">
											<button class="btn btn-warning p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">Phòng từ chối</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach"  data-id="${rowData.id}" style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								}
								if (rowData.kehoachthanhtra.trangthai == "send_review_pct") {
									return `
											<div class="p-1" style="position: relative;">
											<button class="btn btn-info p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">Chờ PCT duyệt</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach"  data-id="${rowData.id}" style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								} if (rowData.kehoachthanhtra.trangthai == "cancel_reviewed_pct") {
									return `	
											<div class="p-1" style="position: relative;">
											<button class="btn btn-warning p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">PCT từ chối</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach"  data-id="${rowData.id}"  style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								} if (rowData.kehoachthanhtra.trangthai == "send_approved") {
									return `
											<div class="p-1" style="position: relative;">
											<button class="btn btn-info p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">Chờ CT duyệt</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach"  data-id="${rowData.id}"  style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								} if (rowData.kehoachthanhtra.trangthai == "cancel_approved") {
									return `
											<div class="p-1" style="position: relative;">
											<button class="btn btn-warning p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">CT từ chối</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach"  data-id="${rowData.id}"  style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								}
								if (rowData.kehoachthanhtra.trangthai === "approved") {
									return `
											<div class="p-1" style="position: relative;">
											<button class="btn btn-success p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">CT đã duyệt quyết định</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach"  data-id="${rowData.id}"  style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								}
								if (rowData.kehoachthanhtra.trangthai === "checked") {
									return `
											<div class="p-1" style="position: relative;">	
											<button class="btn btn-success p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">Đã kiểm tra</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach"  data-id="${rowData.id}"  style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								} if (rowData.kehoachthanhtra.trangthai === "result_checked") {
									return `
											<div class="p-1" style="position: relative;">
											<button class="btn btn-success p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">Đã có kết luận</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach"  data-id="${rowData.id}"  style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								} if (rowData.kehoachthanhtra.trangthai === "completed") {
									return `
											<div class="p-1" style="position: relative;">
											<button class="btn btn-success p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">Hoàn thành</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach"  data-id="${rowData.id}"  style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								} if (rowData.kehoachthanhtra.trangthai === "end_checked") {
									return `
											<div class="p-1" style="position: relative;">
											<button class="btn btn-danger p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  kehoachthanhtra_id="${rowData.kehoachthanhtra_id}" kehoachthanhtratranghtai="${rowData.kehoachthanhtra.trangthai}" data-id="${rowData.id}" style="width:46px">Đã kết thúc thanh tra</button>
											<button class="btn btn-outline-danger p-1 btn_xoakehoach"  data-id="${rowData.id}"  style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
											</div>`
								}


							} else {
								return `
									<div class="p-1" style="position: relative;">
									<button class="btn btn-secondary p-1 mt-4 btn-taokehoach" danhmucdoanhnghiep_id = "${rowData.donvi_id}" tendanhmucdoanhnghiep="${rowData.danhmucdoanhnghiep.name}" linhvucloc="${rowData.linhvucloc}"  data-id="${rowData.id}" style="width:46px">Tạo kế hoạch</button>
									<button class="btn btn-outline-danger p-1 btn_xoakehoach" data-id="${rowData.id}"  style="position: absolute;top: 0px;right: 0px;height:17px">x</button>
									</div>`
							}
						}
					},




				],
				dataSource: dataSource,
				primaryField: "id",
				selectionMode: false,
				refresh: true,

				pagination: {
					page: 1,
					pageSize: 50
				},
				events: {
					"rowclick": function (e) {

						localStorage.setItem('id_TrongKeHoachNamSau', e.rowId)
						localStorage.setItem('donvichutri_id_TrongKeHoachNamSau', e.rowId)
						localStorage.setItem('donviphoihop_id_TrongKeHoachNamSau', e.rowId)
						localStorage.setItem('iphamvithanhtratu_TrongKeHoachNamSau', e.rowId)
						localStorage.setItem('phamvithanhtraden_TrongKeHoachNamSau', e.rowId)
						localStorage.setItem('noidungkehoachnamsau_id_TrongKeHoachNamSau', e.rowId)
						localStorage.setItem('phamvithanhtraden_TrongKeHoachNamSau', e.rowId)

						// self.getApp().getRouter().navigate("danhmucdoanhnghiep/model?id=" + e.rowId);
					},
				},
				rowClass: function (data) {

				},
			});
			// self.$el.find('.suaTitle').hide()
			self.$el.find('.chophepsua').unbind('click').bind('click', function () {
				self.$el.find('.suaTitle').show()
				self.$el.find('.quaylaixem').show()
				self.$el.find('.hienThiTitle').hide()
				self.$el.find('.chophepsua').hide()
				self.luaChonThoiGian();
				self.chonDonViPhoiHop_ChuTri();
			})
			self.$el.find('.quaylaixem').unbind('click').bind('click', function () {
				self.getApp().getRouter().refresh();
			})
			self.noiDungThanhTra();
			self.tenDonViPhoiHop_ChuTri();
			self.chonNoiDungThanhTra();
			self.taoKeHoachThanhTra();
			self.xoaKhoiKeHoach()

		},
		locNoiDung: function () {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/noidungkehoachnamsau?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				contentType: "application/json",
				success: function (data) {
					data.objects.forEach(function (item, index) {
						self.$el.find('.locnoidung select').append(`
						<option value="${item.id}">${item.noidungkehoach}</option>
					`)
					})
					self.$el.find('.locnoidung select').selectpicker('val', 'deselectAllText');
					self.$el.find('.locnoidung select').on('shown.bs.select', function (e, clickedIndex, isSelected, previousValue) {
						self.$el.find('.popover-header .close').css('line-height', '10px')
						self.$el.find('.popover-header .close').unbind('click').bind('click', function () {
							self.getApp().getRouter().refresh();
						})
					})
					self.$el.find('.locnoidung select').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
						var filters = {
							filters: {
								"$and": [
									{ "noidungkehoachnamsau_id": { "$eq": self.$el.find('.locnoidung select').selectpicker('val') } }
								]
							},
							order_by: [{ "field": "thoigiantienhanh", "direction": "desc" }]
						}
						$.ajax({
							url: self.getApp().serviceURL + "/api/v1/danhsachdonvikehoachnamsau?results_per_page=100000&max_results_per_page=1000000",
							method: "GET",
							data: "q=" + JSON.stringify(filters),
							contentType: "application/json",
							success: function (data) {
								data.objects.forEach(function (item, index) {
									item.stt = index + 1;
								})
								self.render_grid2(data.objects)


							},
							error: function (xhr, status, error) {
								self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
							},
						});
					})

				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});
		},
	});

});