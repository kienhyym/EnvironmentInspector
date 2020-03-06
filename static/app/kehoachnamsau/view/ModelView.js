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
						var text = 'Trạng thái';
						if (self.model.get('trangthai') == "truongphongyeucausua") {
							text = "Trưởng phòng yêu cầu sửa lại";
						}
						if (self.model.get('trangthai') == "truongphongdaduyet") {
							text = "Trưởng phòng đã duyệt";
						}
						if (self.model.get('trangthai') == "cuctruongdaduyet") {
							self.$el.find('.toolbar .btn-success').hide()
							self.$el.find('.toolbar .btn-danger').hide()
							text = "Cục trưởng đã duyệt";
						}
						if (self.model.get('trangthai') == "cuctruongyeucausua") {
							text = "Cục trưởng yêu cầu sửa lại";
						}
						if (self.model.get('trangthai') == "phocuctruongdaduyet") {
							text = "Phó cục trưởng đã duyệt";
						}
						if (self.model.get('trangthai') == "phocuctruongyeucausua") {
							text = "Phó cục trưởng yêu cầu sửa lại";
						}
						if (self.model.get('trangthai') == "chuyenviendahoanthanh") {
							text = "Chuyên viên đã hoàn thành";
						}
						self.$el.find('.trangthai2 div div input').attr('placeholder', text)
						self.applyBindings();
						self.danhSachDonViThanhTra();

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
						self.$el.find('#space_danhsachdonvikehoachnamsau').append(`
								<tr>
									<td class = "p-1">${index + 1}</td>
									<td class = "p-1">${item.danhmucdoanhnghiep.name}</td>
									<td class = "p-1" >
									<textarea class="noidungkehoach border-0 pl-1 pr-1 pt-0 pb-0 form-control text-dark" style="overflow-x: hidden; width:100px;font-size: 14px;">${item.noidungkehoachnamsau.noidungkehoach}</textarea>
									</td>
									<td class="phamvithanhtra p-1" >
									Từ ngày
									<div class="border border-0">
										<input class="phamvithanhtratu text-center" type="text" style="width:100px">
										</div>
									đến ngày
									<div class="border border-0">
										<input class="phamvithanhtraden text-center" type="text" style="width:100px">
										</div>
									</td>
									<td class = "p-1">	
										<div class="border border-0 mt-5  ">
										<input class="thoigiantienhanh text-center" type="text" style="width:100px">
										</div>
									</td>
									<td class="donvichutri p-1" >
										<div class="form-group required border rounded donvichutri_id">
											<select class="selectpicker  col-md-12 m-0 p-0" data-live-search="true" data-header="Bỏ chọn">
											</select>
										</div>
									</td>
									<td class="donviphoihop p-1" >
										<div class="form-group required border rounded donviphoihop_id">
											<select class="selectpicker  col-md-12 m-0 p-0" data-live-search="true" data-header="Bỏ chọn">
											</select>
										</div>
									</td>
									<td class="diachi p-1" >${item.danhmucdoanhnghiep.diachi}, ${item.danhmucdoanhnghiep.tenxaphuong}, ${item.danhmucdoanhnghiep.tenquanhuyen}, ${item.danhmucdoanhnghiep.tentinhthanh}</td>
									<td class="p-1" style="position: relative;">
										<button class="btn btn-primary p-1 mt-4 btn-taokehoach" data-id="${item.id}" style="width:46px">Tạo kế hoạch</button>
										<button class="btn btn-outline-danger p-1 btn_xoakehoach" style="position: absolute;top: 0px;right: 0px;" >x</button>
									</td>

								</tr>
							`)


						//Gọi các hàm thay đổi nội dung, thời gian, đơn vị
						self.noiDungThanhTra(item.noidungkehoachnamsau_id, index);
						self.chonDonViPhoiHop_ChuTri(item.id, item.donvichutri_id, item.donviphoihop_id, index);
						self.luaChonThoiGian(item.id, item.phamvithanhtratu, item.phamvithanhtraden, item.thoigiantienhanh, index);
						self.taoKeHoachThanhTra(item.noidungkehoachnamsau_id, index, item.kehoachthanhtra_id, item.kehoachthanhtra);
						self.xoaKhoiKeHoach(item.id, index)
					})

				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});


		},
		chonDonViPhoiHop_ChuTri: function (id, donvichutri_id, donviphoihop_id, idx) {
			var self = this;
			var arr_donvi = [
				{ "text": "donvichutri_id", "value": donvichutri_id },
				{ "text": "donviphoihop_id", "value": donviphoihop_id },
			]
			arr_donvi.forEach(function (item, index) {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/donvi?results_per_page=100000&max_results_per_page=1000000",
					method: "GET",
					contentType: "application/json",
					success: function (data) {
						data.objects.forEach(function (item_donvi, index_donvi) {
							$(self.$el.find('.' + item.text + ' select')[idx]).append(`
							<option value="${item_donvi.id}" >${item_donvi.ten}</option>
						`)
						})
						$(self.$el.find('.' + item.text + ' select')[idx]).selectpicker({ 'width': '100px', });
						$(self.$el.find('.' + item.text + ' select')[idx]).selectpicker('val', item.value);
						$(self.$el.find('.' + item.text)[idx]).append('<span class="' + item.text + '_on_off"><br><br>' + $(self.$el.find('.' + item.text)[idx]).find(' div button').attr('title') + '</span>')
						$(self.$el.find('.' + item.text + ' select')[idx]).on('shown.bs.select', function (e, clickedIndex, isSelected, previousValue) {
							$(self.$el.find('.popover-header .close')[idx]).css('line-height', '10px')
							$(self.$el.find('.popover-header .close')[idx]).unbind('click').bind('click', function () {
								$(self.$el.find('.' + item.text + ' select')[idx]).selectpicker('val', 'deselectAllText');
							})
						})
						$(self.$el.find('.' + item.text + ' select')[idx]).on('change.bs.select', function (e, clickedIndex, isSelected, previousValue) {
							$(self.$el.find('.' + item.text + '_on_off')[idx]).remove();
							$(self.$el.find('.' + item.text)[idx]).append('<span class="' + item.text + '_on_off"><br><br>' + $(self.$el.find('.' + item.text)[idx]).find(' div button').attr('title') + '</span>')

							var field = {}
							field[item['text']] = $(self.$el.find('.' + item.text + ' select')[idx]).selectpicker('val');
							$.ajax({
								url: self.getApp().serviceURL + "/api/v1/danhsachdonvikehoachnamsau/" + id,
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

					},
					error: function (xhr, status, error) {
						self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
					},
				});
			})

		},
		luaChonThoiGian: function (id, phamvithanhtratu, phamvithanhtraden, thoigiantienhanh, idx) {
			var self = this;
			var loaiThoiGian = [
				{ "text": "phamvithanhtratu", "value": phamvithanhtratu },
				{ "text": "phamvithanhtraden", "value": phamvithanhtraden },
				{ "text": "thoigiantienhanh", "value": thoigiantienhanh },
			];
			loaiThoiGian.forEach(function (item, index) {
				if (item.value != null) {
					$(self.$el.find('.' + item.text)[idx]).val(moment(item.value * 1000).format("DD-MM-YYYY"))
				}
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
				$(self.$el.find('.' + item.text)[idx]).datepicker({
					format: "dd/mm/yyyy",
					language: "vie"
				}).on("changeDate", function (e) {
					var field = {}
					field[item['text']] = Number(moment(e.date).tz('Asia/Ho_Chi_Minh').format("X"));
					$.ajax({
						url: self.getApp().serviceURL + "/api/v1/danhsachdonvikehoachnamsau/" + id,
						type: 'PUT',
						data: JSON.stringify(field),
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
			})


		},
		noiDungThanhTra: function (id, idx) {
			var self = this;
			$(self.$el.find('.noidungkehoach')[idx]).change(function () {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/noidungkehoachnamsau/" + id,
					type: 'PUT',
					data: JSON.stringify({ "noidungkehoach": $(self.$el.find('.noidungkehoach')[idx]).val() }),
					headers: {
						'content-type': 'application/json'
					},
					dataType: 'json',
					success: function (data) {
						self.getApp().notify("Lưu nội dung thành công");
					},
					error: function (request, textStatus, errorThrown) {
					}
				})
			})

			// Chỉnh chiều cao nội dung kế hoạch
			var chieuCao_px = $(self.$el.find(".noidungkehoach")[idx])[0].scrollHeight;
			$(self.$el.find(".noidungkehoach")[idx])[0].style.height = chieuCao_px + 5 + 'px';

		},
		taoKeHoachThanhTra: function (id, idx, kehoachthanhtra_id, trangthai) {
			var self = this;
			var trangThai = null;
			if (kehoachthanhtra_id != null) {
				var foreignValues = [
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
				]
				foreignValues.forEach(function (item) {
					if (item.value == trangthai.trangthai) {
						trangThai = item.text;
					}
				})

				$(self.$el.find('.btn-taokehoach')[idx]).text(trangThai)
				$(self.$el.find('.btn-taokehoach')[idx]).removeClass('btn-primary')
				$(self.$el.find('.btn-taokehoach')[idx]).addClass('btn-success')
				$(self.$el.find('.btn-taokehoach')[idx]).unbind('click').bind('click', function () {
					self.getApp().getRouter().navigate("kehoachthanhtra/model?id=" + kehoachthanhtra_id);
					localStorage.setItem('idItem', $(self.$el.find('.btn-taokehoach')[idx]).attr('data-id'))
				})

			}
			else {
				$(self.$el.find('.btn-taokehoach')[idx]).unbind('click').bind('click', function () {
					self.getApp().getRouter().navigate("kehoachthanhtra/model");
					localStorage.setItem('idItem', $(self.$el.find('.btn-taokehoach')[idx]).attr('data-id'))
				})
			}

		},
		xoaKhoiKeHoach: function (id, idx) {
			var self = this;
			$(self.$el.find('.btn_xoakehoach')[idx]).unbind('click').bind('click', function () {
				$.ajax({
					url: self.getApp().serviceURL + "/api/v1/danhsachdonvikehoachnamsau/" + id,
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
	});

});