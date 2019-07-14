define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/kehoachthanhtra/thanhvienthanhtra/tpl/ThanhVienthanhTraItem.html'),
		schema = require('json!app/kehoachthanhtra/thanhvienthanhtra/ThanhVienThanhTraSchema.json');
	
	return Gonrin.ItemView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		tagName: 'tr',
		bindings:"data-member-bind",
		collectionName: "thanhvienthanhtra",
		uiControl:{
    		fields:[
				{
					field:"thoigian",
					textFormat:"DD/MM/YYYY",
					extraFormats:["DDMMYYYY"],
					parseInputDate: function(val){
                		return moment.unix(val)
                	},
                	parseOutputDate: function(date){
                		return date.unix()
                	}
				},
    			{
					field:"vaitro",
					label:"Vai Trò",
   					uicontrol:"combobox",
   					textField: "text",
                    valueField: "value",
                    cssClass:"form-control",
   					dataSource: [
   						{ value: "truongdoan", text: "Trưởng đoàn" },
                        { value: "phodoan", text: "Phó đoàn" },
                        { value: "thuky", text: "Thư ký" },
                        { value: "thanhvien", text: "Thành viên" },
                        { value: "congtacvien", text: "Cộng tác viên" },
                    ],
   				},
        	]
    	},
		render: function () {
			var self = this;
			
//			self.$el.find("#xoa_thongso_khongdat").unbind("click").bind("click", function () {
//				self.remove(true);
//			});
//			
			self.model.on("change", function () {
				
				self.trigger("change", {
					"oldData": self.model.previousAttributes(),
					"data": self.model.toJSON()
				});
			});
			self.applyBindings();
		},
	});

});