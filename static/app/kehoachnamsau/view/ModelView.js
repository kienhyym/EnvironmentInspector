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
			var dem = 0;
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
				//progresbar quay quay
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						var text = 'Trạng thái';
						if(self.model.get('trangthai') == "truongphongyeucausua"){
							text = "Trưởng phòng yêu cầu sửa lại";
						}
						if(self.model.get('trangthai') == "truongphongdaduyet"){
							text = "Trưởng phòng đã duyệt";
						}

						
						if(self.model.get('trangthai') == "cuctruongdaduyet"){
							self.$el.find('.toolbar').hide()
							text = "Cục trưởng đã duyệt";
						}
						if(self.model.get('trangthai') == "cuctruongyeucausua"){
							text = "Cục trưởng yêu cầu sửa lại";
						}


						if(self.model.get('trangthai') == "phocuctruongdaduyet"){
							text = "Phó cục trưởng đã duyệt";
						}
						if(self.model.get('trangthai') == "phocuctruongyeucausua"){
							text = "Phó cục trưởng yêu cầu sửa lại";
						}
						if(self.model.get('trangthai') == "chuyenviendahoanthanh"){
							text = "Chuyên viên đã hoàn thành";
						}
						self.danhSachDonViKeHoachNamSau();
						self.$el.find('.trangthai2 div div input').attr('placeholder',text)
						self.applyBindings();
						var arr = self.$el.find("tr td #stt")
						arr.each(function (item, index) {
							index.value = item + 1;
						})

					},
					error: function () {
						self.getApp().notify("Get data Eror");
					},

				});
			} else {
				self.applyBindings();

			}

		},
		danhSachDonViKeHoachNamSau: function () {
			var self = this;
			// var dvHienTai = self.model.get("code");
			// 	$.ajax({
			// 		url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra",
			// 		method: "GET",
			// 		contentType: "application/json",
			// 		success: function (data) {
			// 			data.objects.forEach(function (item, index) {
			// 				if(item.doanhnghiep.code === dvHienTai){

			// 					var demsll = 0;
			// 					$.ajax({
			// 						url: self.getApp().serviceURL + "/api/v1/lichsuthanhtra",
			// 						method: "GET",
			// 						contentType: "application/json",
			// 						success: function (data) {
			// 							data.objects.forEach(function (itemLSTT, index) {

			// 								if(parseInt(itemLSTT.nam) == moment(item.ngaythanhtra*1000).year() && itemLSTT.danhmucdoanhnghiep_id ==self.model.get("id")){
			// 									demsll++;	
			// 								}

			// 							})
			// 							if(demsll==0){
			// 								var param = {
			// 									id:gonrin.uuid(),
			// 									nam: moment(item.ngaythanhtra*1000).year(),
			// 									kehoachthanhtra_id:item.id,
			// 									danhmucdoanhnghiep_id : self.model.get("id")
			// 								};
			// 								console.log(param)
			// 								$.ajax({
			// 									url: self.getApp().serviceURL + "/api/v1/lichsuthanhtra",
			// 									type: 'POST',
			// 									data: JSON.stringify(param),
			// 									headers: {
			// 										'content-type': 'application/json'
			// 									},
			// 									dataType: 'json',
			// 									success: function (data) {

			// 									},
			// 									error: function (request, textStatus, errorThrown) {
			// 										console.log(request);
			// 									}
			// 								})										
			// 								}
			// 						},
			// 						error: function (xhr, status, error) {
			// 							console.log("Không lấy được dữ liệu");
			// 						},
			// 					});




			// 				}
			// 			})
			// 		},
			// 		error: function (xhr, status, error) {
			// 			console.log("Không lấy được dữ liệu");
			// 		},
			// 	});





			var ds_donvithanhtranamsau = self.model.get("danhsachdonvikehoachnamsau_field");
			if (!ds_donvithanhtranamsau) {
				ds_donvithanhtranamsau = [];
			}
			var containerEl = self.$el.find("#space_danhsachdonvikehoachnamsau");
			containerEl.empty();

			// var dataSource = lodash.orderBy(ds_donvithanhtranamsau, ['created_at'], ['asc']);
			ds_donvithanhtranamsau.forEach((item, index) => {
				var view = new DanhSachDonViKeHoachNamSauItemView();

				view.$el.find("#itemRemove").on("click", function () {
					var arr = [];
					self.model.get("danhsachdonvikehoachnamsau_field").forEach(function (item2, index2) {
						if (item2.id != item.id) {
							arr.push(item2)
						}
					})
					self.model.set("danhsachdonvikehoachnamsau_field", arr)
					$(view.el).hide()
				})


				view.model.set(item);
				view.render();
				$(view.el).hide().appendTo(containerEl).fadeIn();
				view.on("change", (data) => {
					var ds_donvithanhtranamsau = self.model.get("danhsachdonvikehoachnamsau_field");
					ds_donvithanhtranamsau.forEach((item, index) => {
						if (item.id == data.id) {
							ds_donvithanhtranamsau[index] = data;
						}
					});
					self.model.set("danhsachdonvikehoachnamsau_field", ds_donvithanhtranamsau);
				});
			});
			self.$el.find("#btn_add_danhsachdonvikehoachnamsau_field").on("click", (eventClick) => {
				var view = new DanhSachDonViKeHoachNamSauItemView();


				view.model.save(null, {
					success: function (model, respose, options) {
						console.log('tai nguyen2', respose)
						view.model.set(respose);
						view.render();
						$(view.el).hide().appendTo(containerEl).fadeIn();

						// PUSH THE CHILD TO LIST
						var ds_donvithanhtranamsau = self.model.get("danhsachdonvikehoachnamsau_field");
						if (!ds_donvithanhtranamsau) {
							ds_donvithanhtranamsau = [];
						}
						ds_donvithanhtranamsau.push(view.model.toJSON());
						self.model.set("danhsachdonvikehoachnamsau_field", ds_donvithanhtranamsau);
						self.model.save(null, {
							success: function (model, respose, options) {
								// NOTIFY TO GRANPARENT
								self.trigger("change", self.model.toJSON());
							},
							error: function (xhr, status, error) {
							}
						});

						view.on("change", (data) => {
							var ds_donvithanhtranamsau = self.model.get("danhsachdonvikehoachnamsau_field");
							if (!ds_donvithanhtranamsau) {
								ds_donvithanhtranamsau = [];
							}
							ds_donvithanhtranamsau.forEach((item, index) => {
								if (item.id == data.id) {
									ds_donvithanhtranamsau[index] = data;
								}
							});

							self.model.set("danhsachdonvikehoachnamsau_field", ds_donvithanhtranamsau);
							self.model.save(null, {
								success: function (model, respose, options) {
									// NOTIFY TO GRANPARENT
									self.trigger("change", self.model.toJSON());
								},
								error: function (xhr, status, error) {
								}
							});
						});
					},
					error: function (xhr, status, error) {
						// HANDLE ERROR
					}
				});
			});
		},

	});

});