define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');
    var itemTemplate = require('text!app/danhmucdoanhnghiep/tpl/danhsachchinhanhdonvi.html'),
        itemSchema = require('json!schema/DanhSachChiNhanhDonViSchema.json');
        var TinhThanhSelectView = require('app/DanhMuc/TinhThanh/view/SelectView');
        var QuanHuyenSelectView = require('app/DanhMuc/QuanHuyen/view/SelectView');
        var XaPhuongSelectView = require('app/DanhMuc/XaPhuong/view/SelectView');

    return Gonrin.ItemView.extend({
        bindings: "danhsachchinhanhdonvi-bind",
        template: itemTemplate,
        tagName: 'div',
        modelSchema: itemSchema,
        urlPrefix: "/api/v1/",
        collectionName: "danhsachchinhanhdonvi",
        foreignRemoteField: "id",
        foreignField: "danhmucdoanhnghiep_id",
        uiControl: {
			fields: [
				
				
			
				{
					field: "tinhthanh",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "tinhthanh_id",
					dataSource: TinhThanhSelectView
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
					field: "xaphuong",
					uicontrol: "ref",
					textField: "ten",
					foreignRemoteField: "id",
					foreignField: "xaphuong_id",
					dataSource: XaPhuongSelectView
				},
				
				
			]
		},
        render: function () {
            var self = this;
            
            self.applyBindings();
            self.model.on("change:tinhthanh_id", function () {
                console.log("change tinh thanh", self.model.get("tinhthanh_id"));
                self.getFieldElement("quanhuyen").data("gonrin").setFilters({ "tinhthanh_id": { "$eq": self.model.get("tinhthanh_id") } });
            });
            self.model.on("change:quanhuyen_id", function () {
                self.getFieldElement("xaphuong").data("gonrin").setFilters({ "quanhuyen_id": { "$eq": self.model.get("quanhuyen_id") } });
                console.log("change quanhuyen", self.model.get("quanhuyen_id"));
            });
            self.registerEvent();
            if(!self.model.get("id")){
                self.model.set("id", gonrin.uuid())
            }
            // console.log("item", self.model.toJSON());
        
        },
        registerEvent: function () {
            const self = this;
            self.$el.find("#itemRemove").unbind("click").bind("click", function () {
                self.remove(true);
            });
        }
    });
});