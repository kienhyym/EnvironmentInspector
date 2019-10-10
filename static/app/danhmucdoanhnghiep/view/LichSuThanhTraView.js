define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');
    var itemTemplate = require('text!app/danhmucdoanhnghiep/tpl/lichsuthanhtra.html'),
        itemSchema = require('json!schema/LichSuThanhTraSchema.json');

    return Gonrin.ItemView.extend({
        bindings: "lichsuthanhtra-bind",
        template: itemTemplate,
        tagName: 'tr',
        modelSchema: itemSchema,
        urlPrefix: "/api/v1/",
        collectionName: "lichsuthanhtra",
        foreignRemoteField: "id",
        foreignField: "danhmucdoanhnghiep_id",

        
        render: function () {
            var self = this;   
                
            self.applyBindings();
            self.registerEvent();
        
        },
        registerEvent: function () {
            const self = this;
            console.log("self.model",self.model)
            if(self.model.get("kehoachthanhtra_id")!= null){
            self.$el.find("#detail").attr("href", self.getApp().serviceURL+"/?#kehoachthanhtra/model_step_plan?id="+self.model.get("kehoachthanhtra_id"))
            }
            self.model.on("change", () => {
                self.trigger("change", self.model.toJSON());
            });     
            // self.$el.find("#itemRemove").unbind("click").bind("click", function () {
            //     self.remove(true);
            // });
           
        }
    });
});