define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');
    var template = require('text!app/danhmucdoanhnghiep/tpl/select.html'),
        schema = require('json!schema/DanhMucLinhVucSchema.json');
    return Gonrin.CollectionDialogView.extend({
        template: template,
        modelSchema: schema,
        urlPrefix: "/api/v1/",
        collectionName: "danhmuclinhvuc",
        // textField: "display_name",
        tools: [
            {
                name: "select",
                type: "button",
                buttonClass: "btn btn-info btn-sm font-weight-bold margin-left-5",
                label: "TRANSLATE:SELECT",
                command: function () {
                    this.trigger("onSelected");
                    this.close();
                }
            }
        ],
        uiControl: {
            fields: [
                { field: "tenlinhvuc", label: "Tên lĩnh vực" },
            ],
            onRowClick: function (event) {
                this.uiControl.selectedItems = event.selectedItems;
            },
        },
        render: function () {
            this.applyBindings();
        }
    });
});