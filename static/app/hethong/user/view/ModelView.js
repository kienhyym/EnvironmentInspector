define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/hethong/user/tpl/model.html'),
		schema = require('json!schema/UserSchema.json');
	var XaPhuongSelectView = require('app/DanhMuc/XaPhuong/view/SelectView');
	var QuanHuyenSelectView = require('app/DanhMuc/QuanHuyen/view/SelectView');
	var TinhThanhSelectView = require('app/DanhMuc/TinhThanh/view/SelectView');


	var currentDate = new Date();
	return Gonrin.ModelView.extend({
		template: template,
		urlPrefix: "/api/v1/",
		modelSchema: schema,
		collectionName: "user",
		bindings: "data-hoso-bind",
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

							Backbone.history.history.back();
						},
					},
					{
						name: "delete",
						type: "button",
						buttonClass: "btn-danger btn-sm",
						label: "TRANSLATE:DELETE",
						visible: function () {
							return (this.getApp().currentUser.hasRole("CucTruong") && this.getApp().getRouter().getParam("id") !== null);
						},
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
											self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
										}
									}
									catch (err) {
										self.getApp().notify({ message: "Xóa dữ liệu không thành công" }, { type: "danger", delay: 1000 });
									}
								}
							});
						}
					},
				],
			}],
		uiControl: {
			fields: [
				{
					field: "xaphuong",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "xaphuong_id",
					dataSource: XaPhuongSelectView
				},
				{
					field: "quanhuyen",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "quanhuyen_id",
					dataSource: QuanHuyenSelectView
				},
				{
					field: "tinhthanh",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "tinhthanh_id",
					dataSource: TinhThanhSelectView
				},
			]
		},
		render: function () {
			var self = this;
			self.getRoles();
			self.$el.find("#create_partner").unbind('click').bind('click', function () {
				//validate
				var check_validate = true;
				var forms = document.getElementsByClassName('needs-validation');
				// Loop over them and prevent submission
				var validation = Array.prototype.filter.call(forms, function (form) {
					if (form.checkValidity() === false) {
						event.preventDefault();
						event.stopPropagation();
						if (check_validate === true) {
							check_validate = false;
						}

					}
					form.classList.add('was-validated');
				});
				if (check_validate === false) {
					return;
				}
				var roles = [];
				self.$el.find("#multiselect_roles option:selected").each(function () {
					var data_ck = $(this).attr('data-ck');
					var my_object = JSON.parse(decodeURIComponent(data_ck));
					if (my_object !== null) {
						roles.push(my_object);
					}
				});
				
				self.model.set("roles", roles);
				console.log('self.model.set("roles", roles)',self.model.set("roles", roles))
				self.model.save(null, {
					success: function (model, respose, options) {
						self.getApp().notify("Lưu dữ liệu thành công");
						self.getApp().getRouter().navigate(self.collectionName + "/collection");

					},
					error: function (xhr, status, error) {
						try {
							if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
								self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
								self.getApp().getRouter().navigate("login");
							} else {
								self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
							}
						}
						catch (err) {
							self.getApp().notify({ message: "Lưu dữ liệu không thành công" }, { type: "danger", delay: 1000 });
						}
					}
				});

			});

			var id = this.getApp().getRouter().getParam("id");
			var currentUser = self.getApp().currentUser;
			console.log("currentUser===", currentUser.hasRole('CucTruong'));

			console.log("currentUser===", currentUser);
			console.log("currentUser.hasRole('CucTruong')==", currentUser.hasRole('CucTruong'));
			if (currentUser && currentUser.hasRole('CucTruong')) {
				self.$el.find("#password").show();
			} else {
				self.$el.find("#password").hide();
			}
			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						self.applyBindings();
						var roles = self.model.get("roles");
						var val_roles = [];
						if (val_roles !== null) {
							for (var i = 0; i < roles.length; i++) {
								val_roles.push(roles[i].id);
							}
						}

						self.$el.find("#multiselect_roles").selectpicker('val', val_roles);

					},
					error: function (xhr, status, error) {
						try {
							if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
								self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
								self.getApp().getRouter().navigate("login");
							} else {
								self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
							}
						}
						catch (err) {
							self.getApp().notify({ message: "Không tìm thấy dữ liệu" }, { type: "danger", delay: 1000 });
						}
					},
				});
			} else {
				self.applyBindings();
				
			}


		},
		getRoles: function () {
			var self = this;
			var url = self.getApp().serviceURL + "/api/v1/role";
			$.ajax({
				url: url,
				method: "GET",
				contentType: "application/json",
				success: function (data) {
					self.$el.find("#multiselect_roles").html("");
					for (var i = 0; i < data.objects.length; i++) {
						var item = data.objects[i];
						var data_str = encodeURIComponent(JSON.stringify(item));
						var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.description)
						self.$el.find("#multiselect_roles").append(option_elm);
					}
					$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
					var roles = self.model.get("roles");
					var val_roles = [];
					if (val_roles !== null) {
						for (var i = 0; i < roles.length; i++) {
							val_roles.push(roles[i].id);
						}
					}
					

					self.$el.find("#multiselect_roles").selectpicker('val', val_roles);
					
				},
				error: function (xhr, status, error) {
					console.log("Không lấy được dữ liệu role");
				},
			});

		}

	});

});