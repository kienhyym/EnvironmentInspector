define(function (require) {

	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin'),
		//        storejs				= require('vendor/store'),
		tpl = require('text!app/login/tpl/login.html');
	var template = gonrin.template(tpl)({});

	return Gonrin.View.extend({
		render: function () {
			var self = this;
			this.$el.html(template);

			$("#login_accountkit").bind('click', function () {
				AccountKit.login(
					'PHONE',
					{ countryCode: "+84", phoneNumber: "" }, // will use default values if not specified
					self.getApp().loginCallback
				);
			});

			$("#forgot_password").unbind('click').bind('click', function () {
				self.getApp().getRouter().navigate("forgot");
			});

			this.$el.find("#login-form").unbind("submit").bind("submit", function () {
				var check_validate = true;
				// Fetch all the forms we want to apply custom Bootstrap validation styles to
				var forms = document.getElementsByClassName('needs-validation');
				// Loop over them and prevent submission
				var validation = Array.prototype.filter.call(forms, function (form) {
					if (form.checkValidity() === false) {
						event.preventDefault();
						event.stopPropagation();
						check_validate = false;
					}
					form.classList.add('was-validated');
				});
				if (check_validate === true) {
					self.processLogin();
				}

				return false;
			});
			return this;
		},
		processLogin: function () {
			var self = this;

			var user = this.$('[name=data_user]').val();
			var password = this.$('[name=password]').val();


			var data = JSON.stringify({
				data: user,
				password: password
			});

			$.ajax({
				url: self.getApp().serviceURL + "/api/v1/login",
				type: 'post',
				data: data,
				headers: {
					'content-type': 'application/json'
				},
				beforeSend: function () {
					$("#loading").removeClass("hidden");
				},
				complete: function () {
					$("#loading").addClass("hidden");
				},
				dataType: 'json',
				success: function (data) {

					self.getApp().postLogin(data);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					self.getApp().notify({ message: "Sai tài khoản hoặc mật khẩu" }, { type: "danger", delay: 1000 });

				}
			});
		},

	});

});