define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/hethong/user/tpl/model.html'),
		schema = require('json!schema/UserSchema.json');
	var DonViSelectView = require('app/donvi/view/SelectView');

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
						name: "save",
						type: "button",
						buttonClass: "btn-success btn-sm",
						label: "TRANSLATE:SAVE",
						visible: function () {
							return this.getApp().currentUser.hasRole("CucTruong");
						},
						command: function () {
							var self = this;
							//validate
							var check_validate = true;
							var forms = document.getElementsByClassName('needs-validation');
							// Loop over them and prevent submission
							Array.prototype.filter.call(forms, function (form) {
								if (form.checkValidity() === false) {
									event.preventDefault();
									event.stopPropagation();
									if (check_validate === true) {
										check_validate = false;
									}
								}
								form.classList.add('was-validated');
							});
							if (self.$el.find('.chonvaitro select').selectpicker('val').length == 0 &&
								self.model.get('donvi_id') == null) {
								self.$el.find('.roles_rounded div button').css({
									"border": "1px #c4183c solid",
									"box-shadow": "0 5px 11.5px rgba(196,24,60,.1)"
								})
								self.$el.find('.roles_rounded').css({ "box-shadow": "0 5px 11.5px rgba(196,24,60,.1)" })
								self.$el.find('.roles_validate').show()
								self.$el.find('.donvi_id_rounded').css({
									"border": "1px #c4183c solid",
									"box-shadow": "0 5px 11.5px rgba(196,24,60,.1)"
								})
								self.$el.find('.donvi_id_validate').show()
								return false;

							}

							if (self.$el.find('.chonvaitro select').selectpicker('val').length == 0) {
								self.$el.find('.roles_rounded div button').css({
									"border": "1px #c4183c solid",
									"box-shadow": "0 5px 11.5px rgba(196,24,60,.1)"
								})
								self.$el.find('.roles_rounded').css({ "box-shadow": "0 5px 11.5px rgba(196,24,60,.1)" })
								self.$el.find('.roles_validate').show()
								return false;
							}
							else {
								self.$el.find('.roles_rounded').css({ "border": "1px #17c671 solid" })
							}

							if (self.model.get('donvi_id') == null) {
								self.$el.find('.donvi_id_rounded').css({
									"border": "1px #c4183c solid",
									"box-shadow": "0 5px 11.5px rgba(196,24,60,.1)"
								})
								self.$el.find('.donvi_id_validate').show()
								return false;
							} else {
								self.$el.find('.donvi_id_rounded').css({
									"border": "1px #17c671 solid",
								})
							}

							if (check_validate === false) {
								return;
							}

							
							console.log(self.model.set)
							self.model.save(null, {
								success: function (model, respose, options) {
									self.getApp().notify('Lưu dữ liệu thành công');
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
										self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
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
					field: "donvi",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "donvi_id",
					dataSource: DonViSelectView
				},
			]
		},
		render: function () {
			var self = this;
			self.chonVaiTro();
			var id = this.getApp().getRouter().getParam("id");
			var currentUser = self.getApp().currentUser;

			self.$el.find('.chonvaitro select').on('changed.bs.select', function () {
				if (self.$el.find('.chonvaitro select').selectpicker('val').length != 0) {
					console.log('xxx')
					self.$el.find('.roles_rounded').removeAttr("style");
					self.$el.find('.roles_rounded div button').css({ "border": "1px  #17c671  solid" })
					self.$el.find('.roles_validate').hide()
				}

			});
			self.model.on('change:donvi_id', function () {
				if (self.model.get('donvi_id') != null) {
					self.$el.find('.donvi_id_rounded').removeAttr("style");
					self.$el.find('.donvi_id_rounded').css({ "border": "1px #17c671 solid" })
					self.$el.find('.donvi_id_validate').hide()
				}
			})


			if (id) {
				this.model.set('id', id);
				this.model.fetch({
					success: function (data) {
						// self.$el.find("#password").remove();
						self.applyBindings();
						self.hienVaiTro();

					},
				});
			} else {
				self.applyBindings();



			}
		},
		hienVaiTro: function () {
			var self = this;
			var vaiTro = [];
			self.model.get('roles').forEach(function (item, index) {
				vaiTro.push(item.id)
			})
			self.$el.find('.chonvaitro select').selectpicker('val', vaiTro);

		},
		chonVaiTro: function () {
			var self = this;
			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/role?results_per_page=100000&max_results_per_page=1000000",
				method: "GET",
				contentType: "application/json",
				success: function (data) {
					data.objects.forEach(function (item, index) {
						self.$el.find('.chonvaitro select').append(`
						<option value="${item.id}" data-id="${item.id}">${item.description}</option>
					`)
					})
					self.$el.find('.chonvaitro select').selectpicker('val', 'deselectAllText');
					self.$el.find('.chonvaitro select').on('shown.bs.select', function (e, clickedIndex, isSelected, previousValue) {
						self.$el.find('.popover-header .close').css('line-height', '10px')
						self.$el.find('.popover-header .close').unbind('click').bind('click', function () {
							self.$el.find('.chonvaitro select').selectpicker('val', 'deselectAllText');
						})
					})
					var arr_roles = [];
					self.$el.find('.chonvaitro select').selectpicker('val').forEach(function (id_role) {
						data.objects.forEach(function (item_role) {
							if (id_role == item_role.id) {
								arr_roles.push(item_role);
							}
						});
					});
					self.model.set('roles', arr_roles)
					self.$el.find('.chonvaitro select').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
						var arr_roles = [];
						self.$el.find('.chonvaitro select').selectpicker('val').forEach(function (id_role) {
							data.objects.forEach(function (item_role) {
								if (id_role == item_role.id) {
									arr_roles.push(item_role);
								}
							});
						});
						self.model.set('roles', arr_roles)
					});
				},
				error: function (xhr, status, error) {
					self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
				},
			});
		},
	});

});