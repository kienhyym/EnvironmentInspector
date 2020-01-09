define(function (require) {
    "use strict";
    var $                   = require('jquery'),
        _                   = require('underscore'),
        Gonrin				= require('gonrin');
    
    var template 			= require('text!app/bookingpartner/tpl/model.html'),
    	schema 				= require('json!schema/UserSchema.json');
    var XaPhuongSelectView = require('app/DanhMuc/XaPhuong/view/SelectView');
	var QuanHuyenSelectView = require('app/DanhMuc/QuanHuyen/view/SelectView');
	var TinhThanhSelectView = require('app/DanhMuc/TinhThanh/view/SelectView');
    var RoleSelectView = require('app/view/HeThong/role/view/SelectView');


	var currentDate = new Date();
    return Gonrin.ModelView.extend({
    	template : template,
    	urlPrefix: "/api/v1/",
    	modelSchema	: schema,
    	collectionName: "bookingpartner",
    	bindings:"data-hoso-bind",
    	tools : [
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
						command: function(){
							var self = this;
							
							Backbone.history.history.back();
						},
					},
					{
		    	    	name: "delete",
		    	    	type: "button",
		    	    	buttonClass: "btn-danger btn-sm",
		    	    	label: "TRANSLATE:DELETE",
		    	    	visible: function(){
		    	    		return this.getApp().currentUser.hasRole("Admin");
		    	    	},
		    	    	command: function(){
		    	    		var self = this;
		                    self.model.destroy({
		                        success: function(model, response) {
		                        	self.getApp().notify('Xoá dữ liệu thành công');
		                            self.getApp().getRouter().navigate(self.collectionName + "/collection");
		                        },
		                        error: function (model, xhr, options) {
		                            self.getApp().notify('Xoá dữ liệu không thành công!');
		                            
		                        }
		                    });
		    	    	}
		    	    },
    	    	],
    	    }],
    	uiControl: {
            fields: [
        		{
               	    field: "type", 
               	    label: "Thuộc nhóm",
	               	uicontrol: "combobox",
        			textField: "text",
        			valueField: "value",
	               	dataSource: [
		            	 { value: "viettel", text: "Viettel" },
	                     { value: "ytecoso", text: "Y Tế Cơ Sở" },
	                     { value: "benhvien", text: "Bệnh Viện" },
	                     { value: "phongkham", text: "Phòng khám" },
	                     { value: "trungtam_tiemchung", text: "Trung tâm tiêm chủng" },
	                     { value: "khac", text: "Loại khác" }
		           	 ],
	            },
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
    	render:function(){
    		var self = this;
			
			self.$el.find("#create_partner").unbind('click').bind('click', function(){
				//validate
				var check_validate = true;
        		var forms = document.getElementsByClassName('needs-validation');
        		// Loop over them and prevent submission
        		var validation = Array.prototype.filter.call(forms, function(form) {
    	    		if (form.checkValidity() === false) {
    	    			event.preventDefault();
    	    			event.stopPropagation();
    	    			if(check_validate === true){
    	    				check_validate = false;
    	    			}
    	    			
    	    		}
    	    		form.classList.add('was-validated');
        		});
            	if(check_validate === false){
            		return;
            	}
            	//end validate
            	
				var tinhthanh_id = self.model.get("tinhthanh_id");
				var quanhuyen_id = self.model.get("quanhuyen_id");
				var xaphuong_id = self.model.get("xaphuong_id");
				if (tinhthanh_id === null || tinhthanh_id ===""||
						quanhuyen_id === null || quanhuyen_id ===""||
						xaphuong_id === null || xaphuong_id ===""){
					self.getApp().notify({ message: 'Vui lòng nhập đầy đủ thông tin' }, { type: "danger", delay: 1000 });
					return;
				}
				
				self.model.save(null,{
		            success: function (model, respose, options) {
		                self.getApp().notify("Lưu dữ liệu thành công");
		                
		            },
		            error: function (xhr, status, error) {
						try {
							if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED"){
								self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
								self.getApp().getRouter().navigate("login");
							} else {
								self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
							}
						}
						catch (err) {
						  self.getApp().notify({ message: "Lưu dữ liệu không thành công"}, { type: "danger", delay: 1000 });
						}
					}
		        });
				
			});
			
			var id = this.getApp().getRouter().getParam("id");
			var currentUser = self.getApp().currentUser;
			if (currentUser && currentUser.hasRole('Admin') ){
				self.$el.find("#password").show();
			}else{
				self.$el.find("#password").hide();
			}
			if (currentUser.hasRole('BookingPartner')){
				id = currentUser.id;
			}
    		if(id){
    			this.model.set('id',id);
        		this.model.fetch({
        			success: function(data){
        				self.applyBindings();
        				self.model.on("change:tinhthanh", function(){
        					self.getFieldElement("quanhuyen").data("gonrin").setFilters({"tinhthanh_id": { "$eq": self.model.get("tinhthanh_id")}});
        				});
        	    		self.model.on("change:quanhuyen", function(){
        	    			self.getFieldElement("xaphuong").data("gonrin").setFilters({"quanhuyen_id": { "$eq": self.model.get("quanhuyen_id")}});
        				});
        	    		
        			},
        			error: function (xhr, status, error) {
						try {
							if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED"){
								self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
								self.getApp().getRouter().navigate("login");
							} else {
								self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
							}
						}
						catch (err) {
						  self.getApp().notify({ message: "Không tìm thấy dữ liệu"}, { type: "danger", delay: 1000 });
						}
					},
        		});
    		}else{
    			self.applyBindings();
    			self.model.on("change:tinhthanh", function(){
    				self.getFieldElement("quanhuyen").data("gonrin").setFilters({"tinhthanh_id": { "$eq": self.model.get("tinhthanh_id")}});
    			});
        		self.model.on("change:quanhuyen", function(){
        			self.getFieldElement("xaphuong").data("gonrin").setFilters({"quanhuyen_id": { "$eq": self.model.get("quanhuyen_id")}});

    			});
    		}
    		
			
    	},
    	
    });

});if (item.role_name == "CucTruong") {
	arr = [
		{ text: "Cục trưởng đã duyệt", value: "cuctruongdaduyet" },
	]
}