define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');


	var template = require('text!app/nguoisudung/tpl/collection.html'),
		schema = require('json!schema/UserSchema.json');
	var TemplateHelper = require('app/base/view/TemplateHelper');
	return Gonrin.CollectionView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "user",
		tools: [
			{
				name: "defaultgr",
				type: "group",
				groupClass: "toolbar-group",
				buttons: [
					{
						name: "create",
						type: "button",
						buttonClass: "btn-success btn-sm",
						label: "TRANSLATE:CREATE",
						command: function () {
							var self = this;
							self.getApp().getRouter().navigate('user/model');
						}
					},
				]
			},
		],
		uiControl: {
			fields: [
				{
					field: "name",
					label: "Họ tên",
				},
				{ field: "email", label: "Email" },
				{ field: "phone_number", label: "Điện thoại" },
				{ field: "roles", label: "Vai trò", textField: "name" },
				//	           	{
				//	            	 field: "tinhthanh_id", 
				//	            	 label: "Tỉnh thành",
				//	            	 foreign: "tinhthanh",
				//	            	 foreignValueField: "id",
				//					 foreignTextField: "ten",
				//	           	 },
				//	           	{
				//	            	 field: "quanhuyen_id", 
				//	            	 label: "Quận/Huyện",
				//	            	 foreign: "quanhuyen",
				//	            	 foreignValueField: "id",
				//					 foreignTextField: "ten",
				//	           	 },
				//	           	{
				//	            	 field: "xaphuong_id", 
				//	            	 label: "Xã/Phường/Thị trấn",
				//	            	 foreign: "xaphuong",
				//	            	 foreignValueField: "id",
				//					 foreignTextField: "ten",
				//	           	 },
			],
			onRowClick: function (event) {
				if (event.rowId) {
					var path = this.collectionName + '/model?id=' + event.rowId;
					this.getApp().getRouter().navigate(path);
				}
			}
		},

		render: function () {
			var self = this;
			//	    	 var currentUser = self.getApp().currentUser;
			//	    	 if (!currentUser && currentUser.hasRole("Admin")){
			//	    		 self.getApp().getRouter().navigate("login");
			//	    	 }

			this.applyBindings();
			return this;
		}
	});

});