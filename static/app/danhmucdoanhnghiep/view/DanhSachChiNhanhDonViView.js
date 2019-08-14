define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');
    var itemTemplate = require('text!app/danhmucdoanhnghiep/tpl/danhsachchinhanhdonvi.html'),
        itemSchema = require('json!schema/DanhSachChiNhanhDonViSchema.json');
        var TinhThanhSelectView = require('app/DanhMuc/TinhThanh/view/SelectView');

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
				
			]
		},
        render: function () {
            var self = this;
            self.applyBindings();
            self.registerEvent();
            if(!self.model.get("id")){
                self.model.set("id", gonrin.uuid())
            }
            // 

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