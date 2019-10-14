define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');

    var template = require('text!app/kehoachthanhtra/congviecthanhtra/tpl/thuchienitem.html'),
        CongViecView = require('app/kehoachthanhtra/congviecthanhtra/CongViecThanhTraItemView');




    return CongViecView.extend({
        template: template,
        render: function () {
            var self = this;
            self.bindEventSelect();
            self.applyBindings();
            self.renderUpload();
            if (self.model.get("id") == null) {
                self.model.set("id", gonrin.uuid());
            }
            console.log(self.model)


            self.$el.find("#itemRemove").unbind("click").bind("click", function () {
                self.remove(true);
            });
        },
        renderUpload() {
            var self = this;
            var keys = [
                "tailieu"
            ];
            $.each(keys, function (i, key) {
                var attr_value = self.model.get(key);
                var linkDownload = self.$el.find(".linkDownloadTinhHinhThanhTra");

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
            console.log("tai lieuiữ", self.model.get("tailieu"))

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
                            // self.getApp().notify("Tải file thành công");
                            self.model.set(data_attr, data_file.link);
                            var mdel = self.model.get("tailieu");

				self.$el.find(".hienthilink").html(mdel);
                            // self.saveModel();
                        }
                    } else {
                        // self.getApp().notify("Không thể tải tệp tin lên máy chủ");
                    }
                };
                http.send(fd);
            });
        },

    });

});