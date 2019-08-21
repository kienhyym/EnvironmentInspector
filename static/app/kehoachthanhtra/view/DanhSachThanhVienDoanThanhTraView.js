define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');
    var itemTemplate = require('text!app/kehoachthanhtra/tpl/danhsachthanhviendoanthanhtra.html'),
        itemSchema = require('json!schema/DanhSachThanhVienDoanThanhTraSchema.json');

    return Gonrin.ItemView.extend({
        bindings: "danhsachthanhviendoanthanhtra-bind",
        template: itemTemplate,
        tagName: 'tr',
        modelSchema: itemSchema,
        urlPrefix: "/api/v1/",
        collectionName: "danhsachthanhviendoanthanhtra",
        foreignRemoteField: "id",
        foreignField: "kehoachthanhtra_id",

        render: function () {
            var self = this;
            self.applyBindings();
            // self.getRoles();
            self.registerEvent();
            console.log(self.model.get("ten"))
            
            // self.$el.find("#multiselect_roles").on("change", function () {
            //     var roles = [];
			// 	self.$el.find("#multiselect_roles option:selected").each(function () {
			// 		var data_ck = $(this).attr('data-ck');
			// 		var my_object = JSON.parse(decodeURIComponent(data_ck));
			// 		if (my_object !== null) {
			// 			roles.push(my_object);
			// 		}
			// 	});
				
			// 	self.model.set("roles", roles);
			// 	console.log('self.model.set("roles", roles)',self.model.set("roles", roles))
			// 	self.model.save(null, {
			// 		success: function (model, respose, options) {
			// 			self.getApp().notify("Lưu dữ liệu thành công");

			// 		},
			// 		error: function (xhr, status, error) {
			// 			try {
			// 				if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
			// 					self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
			// 					self.getApp().getRouter().navigate("login");
			// 				} else {
			// 					self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
			// 				}
			// 			}
			// 			catch (err) {
			// 				self.getApp().notify({ message: "Lưu dữ liệu không thành công" }, { type: "danger", delay: 1000 });
			// 			}
			// 		}
			// 	});
            // })


            // var id = this.getApp().getRouter().getParam("id");
			// var currentUser = self.getApp().currentUser;
			// if (id) {
            //     this.model.set('id', id);
            //     console.log('id',id)
			// 	this.model.fetch({
			// 		success: function (data) {
			// 			self.applyBindings();
			// 			var roles = self.model.get("roles");
			// 			var val_roles = [];
			// 			if (val_roles !== null) {
			// 				for (var i = 0; i < roles.length; i++) {
			// 					val_roles.push(roles[i].id);
			// 				}
			// 			}

			// 			self.$el.find("#multiselect_roles").selectpicker('val', val_roles);

			// 		},
			// 		error: function (xhr, status, error) {
			// 		console.log(error)
			// 		},
			// 	});
			// } else {
			// 	self.applyBindings();
				
			// }
        },
        registerEvent: function () {
        
            const self = this;
            
            self.$el.find("#itemRemove").unbind("click").bind("click", function () {
                self.remove(true);
            });
        },


        // getRoles: function () {
		// 	var self = this;
		// 	var url = self.getApp().serviceURL + "/api/v1/role";
		// 	$.ajax({
		// 		url: url,
		// 		method: "GET",
		// 		contentType: "application/json",
		// 		success: function (data) {
		// 			self.$el.find("#multiselect_roles").html("");
		// 			for (var i = 0; i < data.objects.length; i++) {
		// 				var item = data.objects[i];
		// 				var data_str = encodeURIComponent(JSON.stringify(item));
		// 				var option_elm = $('<option>').attr({ 'value': item.id, 'data-ck': data_str }).html(item.name)
		// 				self.$el.find("#multiselect_roles").append(option_elm);
		// 			}
		// 			$.fn.selectpicker.Constructor.DEFAULTS.multipleSeparator = ' | ';
		// 			var roles = self.model.get("roles");
		// 			var val_roles = [];
		// 			if (val_roles !== null) {
		// 				for (var i = 0; i < roles.length; i++) {
		// 					val_roles.push(roles[i].id);
		// 				}
		// 			}
					

		// 			self.$el.find("#multiselect_roles").selectpicker('val', val_roles);
					
		// 		},
		// 		error: function (xhr, status, error) {
		// 			console.log("Không lấy được dữ liệu role");
		// 		},
		// 	});
        // },
    });
});