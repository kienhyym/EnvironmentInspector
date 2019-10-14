define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');
    var itemTemplate = require('text!app/kehoachnamsau/tpl/danhsachdonvikehoachnamsau.html'),
        itemSchema = require('json!schema/DanhSachDonViKeHoachNamSauSchema.json');

    return Gonrin.ItemView.extend({
        bindings: "danhsachdonvikehoachnamsau-bind",
        template: itemTemplate,
        tagName: 'tr',
        modelSchema: itemSchema,
        urlPrefix: "/api/v1/",
        collectionName: "danhsachdonvikehoachnamsau",
        foreignRemoteField: "id",
        foreignField: "kehoachnamsau_id",

        
        render: function () {
            var self = this;   
                
            self.applyBindings();
            self.registerEvent();
        
        },
        registerEvent: function () {
            const self = this;
            console.log("self.model",self.model)
            if(self.model.get("donvi_id")!= null){
            self.$el.find("#detail").attr("href", self.getApp().serviceURL+"/?#danhmucdoanhnghiep/model?id="+self.model.get("donvi_id"))
            }

            self.$el.find("#taokehoach").attr("href", self.getApp().serviceURL+"/?#kehoachthanhtra/model?"+self.model.get("donvi_id"));
            self.model.on("change", () => {
                self.trigger("change", self.model.toJSON());
            });     
            // self.$el.find("#itemRemove").unbind("click").bind("click", function () {
            //     self.remove(true);
            // });
           
        }
    });
});