define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');
    var itemTemplate = require('text!app/kehoachthanhtra/tpl/vanbanduthao.html'),
        itemSchema = require('json!schema/VanBanDuThaoSchema.json');

    return Gonrin.ItemView.extend({
        bindings: "vanbanduthao-bind",
        template: itemTemplate,
        tagName: 'div',
        modelSchema: itemSchema,
        urlPrefix: "/api/v1/",
        collectionName: "vanbanduthao",
        foreignRemoteField: "id",
        foreignField: "kehoachthanhtra_id",
        uiControl: {
            fields: [
                {
					field: "trangthai_vanban",
					uicontrol: "combobox",
					textField: "text",
					valueField: "value",
					cssClass: "form-control",
					dataSource: [
						{ value: 1, text: "Duyệt" },
						{ value: 2, text: "Không duyệt" },

					],
				},

                {
                    field: "ngay_duthao_vanban",
                    uicontrol: "datetimepicker",
                    textFormat: "DD/MM/YYYY",
                    extraFormats: ["DDMMYYYY"],
                    parseInputDate: function (val) {
                        return moment.unix(val)
                    },
                    parseOutputDate: function (date) {
                        return date.unix()
                    }
                },
                {
                    field: "ngay_gui_congvan_giaitrinh",
                    uicontrol: "datetimepicker",
                    textFormat: "DD/MM/YYYY",
                    extraFormats: ["DDMMYYYY"],
                    parseInputDate: function (val) {
                        return moment.unix(val)
                    },
                    parseOutputDate: function (date) {
                        return date.unix()
                    }
                },
                {
                    field: "ngay_vanban_thamkhao_ykien",
                    uicontrol: "datetimepicker",
                    textFormat: "DD/MM/YYYY",
                    extraFormats: ["DDMMYYYY"],
                    parseInputDate: function (val) {
                        return moment.unix(val)
                    },
                    parseOutputDate: function (date) {
                        return date.unix()
                    }
                },

            ]
        },

        render: function () {
            var self = this;
           

           
            if (!self.model.get("id")) {
                self.model.set("id", gonrin.uuid())
            }
            self.bindEventSelect();
            self.applyBindings();
            self.renderUpload();
            self.$el.find(".btn-luu").bind("click",function(){
                self.saveModel();
            })
            self.$el.find(".btn-xoa").unbind("click").bind("click", function () {
                self.remove(true);
            });
        },
        renderUpload() {
            var self = this;
            var keys = [
                "vanban_duthao_duthao_attachment",
                "congvan_giaitrinh_cua_doituong_thanhtra_attachment",
                "tham_khao_y_kien_attachment"

            ];
            $.each(keys, function (i, key) {
                var attr_value = self.model.get(key);
                var linkDownload = self.$el.find(".linkDownload");

                if (!!attr_value) {
                    linkDownload[i].href = attr_value;
                    self.$el.find("#upload-" + key).hide();
                    self.$el.find("#download-" + key).show();

                } else {
                    self.$el.find("#upload-" + key).show();
                    self.$el.find("#download-" + key).hide();

                }

            })
        },
        saveModel: function () {
            var self = this;


            self.model.save(null, {
                success: function (model, response, options) {
                    self.getApp().notify("Lưu thông tin thành công");
                    self.getApp().router.refresh();
                },
                error: function (xhr, status, error) {
                    try {
                        if (($.parseJSON(error.xhr.responseText).error_code) === "SESSION_EXPIRED") {
                            self.getApp().notify("Hết phiên làm việc, vui lòng đăng nhập lại!");
                            self.getApp().getRouter().navigate("login");
                        } else {
                            self.getApp().notify({ message: $.parseJSON(error.xhr.responseText).error_message }, { type: "danger", delay: 1000 });
                        }
                    }
                    catch (err) {
                        self.getApp().notify({ message: "Lưu thông tin không thành công" }, { type: "danger", delay: 1000 });
                    }
                }
            });

        },
        bindEventSelect: function () {
            var self = this;
            self.$el.find(".upload_files").on("change", function () {
                var http = new XMLHttpRequest();
                var fd = new FormData();

                var data_attr = $(this).attr("data-attr");
                fd.append('file', this.files[0]);

                http.open('POST', '/api/v1/upload/file');

                http.upload.addEventListener('progress', function (evt) {
                    if (evt.lengthComputable) {
                        var percent = evt.loaded / evt.total;
                        percent = parseInt(percent * 100);

                    }
                }, false);
                http.addEventListener('error', function () {
                }, false);

                http.onreadystatechange = function () {
                    if (http.status === 200) {
                        if (http.readyState === 4) {
                            var data_file = JSON.parse(http.responseText), link, p, t;
                            self.getApp().notify("Tải file thành công");
                            self.model.set(data_attr, data_file.link);
                            self.saveModel();
                        }
                    } else {
                        self.getApp().notify("Không thể tải tệp tin lên máy chủ");
                    }
                };
                http.send(fd);
            });
        },
    });
});