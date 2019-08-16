define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/danhmuclinhvuc/tpl/collection.html'),
		schema = require('json!schema/DanhMucLinhVucSchema.json');

    return Gonrin.CollectionView.extend({
        template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "danhmuclinhvuc",
        uiControl:{
            fields: [

                {
                    field: "malinhvuc", label: "mã ", width: 250, readonly: true,
                },
                {
                    field: "tenlinhvuc", label: "Lĩnh vực", width: 250, readonly: true,
                },
                

            ],
            onRowClick: function (event) {
                if (event.rowId) {
                    var path =  this.collectionName + '/model?id=' + event.rowId;
                    this.getApp().getRouter().navigate(path);
                }
            }
        },
        render: function () {
            
            this.applyBindings();   
            console.log(this);
            return this;
        },
        
    });

});