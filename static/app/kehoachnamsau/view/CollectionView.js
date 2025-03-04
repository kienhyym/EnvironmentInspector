define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/kehoachnamsau/tpl/collection.html'),
        schema = require('json!schema/KeHoachNamSauSchema.json');

    return Gonrin.CollectionView.extend({
        template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "kehoachnamsau",
        uiControl: {
            fields: [


                {
                    field: "nam", label: "Năm", width: 250, readonly: true,
                },


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
            self.getApp().currentUser.roles.forEach(function (item, index) {
                if (item.role_name == 'VanPhongCuc') {
                    self.$el.find('.toolbar').hide();
                }
            })
            self.applyBindings();
            return self;
        },

    });

});