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
					var noiDungKeHoach = null;
					var viTriLucNay = 0;
					var vitri = 0;
					var mangTD = [
						"noidungkehoach",
						"phamvithanhtra",
						"thoigiantienhanh",
						"donvichutri",
						"donviphoihop",
						"diachi",
					];
					data.objects.forEach(function (item, index) {
						console.log(item.danhmucdoanhnghiep.name, item.noidungkehoachnamsau_id)

						if (noiDungKeHoach != item.noidungkehoachnamsau.id) {
							self.$el.find('#space_danhsachdonvikehoachnamsau').append(`
								<tr>
									<td>${index + 1}</td>
									<td>${item.danhmucdoanhnghiep.name}</td>
									<td class="noidungkehoach" >${item.noidungkehoachnamsau.noidungkehoach}</td>
									<td class="phamvithanhtra" >${item.noidungkehoachnamsau.phamvithanhtratu} -${item.noidungkehoachnamsau.phamvithanhtraden} </td>
									<td class="thoigiantienhanh" >${item.noidungkehoachnamsau.thoigiantienhanh}</td>
									<td class="donvichutri" >${item.noidungkehoachnamsau.donvichutri}</td>
									<td class="donviphoihop" >${item.noidungkehoachnamsau.donviphoihop}</td>
									<td class="diachi" >${item.noidungkehoachnamsau.diachi}</td>
								</tr>
							`)

							var viTriBanDau = viTriLucNay;
							var viTrisauDo = index - viTriBanDau;


							noiDungKeHoach = item.noidungkehoachnamsau.id
							mangTD.forEach(function (itemTD) {
								$(self.$el.find('#space_danhsachdonvikehoachnamsau tr')[viTriBanDau]).css("border-top", "2px solid rgb(228, 228, 228)")
								$(self.$el.find('#space_danhsachdonvikehoachnamsau tr')[viTriBanDau]).find('.' + itemTD).attr("rowspan", viTrisauDo)
							})

							viTriLucNay = index;
							vitri = viTriBanDau;


							console.log('viTriBanDau', viTriBanDau)
							console.log('viTrisauDo', viTrisauDo)
							console.log('viTriLucNay', viTriLucNay)
							console.log('vitri', vitri)
						}
						else {
							self.$el.find('#space_danhsachdonvikehoachnamsau').append(`
								<tr>
									<td>${index + 1}</td>
									<td>${item.danhmucdoanhnghiep.name}</td>
								</tr>
							`)
						}
						if (index === data.objects.length - 1) {
							mangTD.forEach(function (itemTD) {
								console.log('vitrinay', vitri)
								if (data.objects.length - 1 - vitri != 1) {
									$(self.$el.find('#space_danhsachdonvikehoachnamsau tr')[vitri + 1]).find('#' + itemTD).remove();
									$(self.$el.find('#space_danhsachdonvikehoachnamsau tr')[vitri + 1]).css("border-top", "2px solid rgb(228, 228, 228)")
								}
								$(self.$el.find('#space_danhsachdonvikehoachnamsau tr')[vitri + 1]).find('.' + itemTD).attr("rowspan", data.objects.length - 1 - vitri)
							})
						}
					})
				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});


		},
	});

});