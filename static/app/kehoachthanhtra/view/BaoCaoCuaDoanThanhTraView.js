define(function (require) {
    "use strict";
    var $ = require('jquery'),
        _ = require('underscore'),
        Gonrin = require('gonrin');
    var itemTemplate = require('text!app/kehoachthanhtra/tpl/baocaocuadoanthanhtra.html'),
        itemSchema = require('json!schema/BaoCaoCuaDoanThanhTraSchema.json');

    return Gonrin.ItemView.extend({
        bindings: "baocaocuadoanthanhtra-bind",
        template: itemTemplate,
        tagName: 'div',
        modelSchema: itemSchema,
        urlPrefix: "/api/v1/",
        collectionName: "baocaocuadoanthanhtra",
        foreignRemoteField: "id",
        foreignField: "kehoachthanhtra_id",
        uiControl: {
            fields: [

                {
                    field: "ngayguibaocaogiaitrinh",
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
                    field: "ngayguibaocaocuadoanthanhtra",
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
            
            // self.bindEventSelect();
            self.applyBindings();
            // self.renderUpload();
            self.inputFileOnChange();
            self.renderAttachment();
            self.$el.find(".btn-xoa").unbind("click").bind("click", function () {
                self.remove(true);
            });

        },
        renderUpload() {
            var self = this;
            var keys = [
                "vanbangiaitrinh_attachment",
                "baocaotonghopcuadoanthanhtra_attachment",

            ];
            $.each(keys, function (i, key) {
                var attr_value = self.model.get(key);
                var linkDownload = self.$el.find(".linkDownloadBaocaoCuaThanhTra");

                if (!!attr_value) {
                    linkDownload[i].href = attr_value;
                    self.$el.find("#upload-" + key).hide();
                    self.$el.find("#download-" + key).show();

                } else {
                    self.$el.find("#upload-" + key).show();
                    self.$el.find("#download-" + key).hide();

                }

            })
            self.$el.find(".textDownloadBaocaoCuaThanhTra").each(function (index, item) {
                item.textContent = item.textContent
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
        bindEventGD1: function (files) {
            var self = this;
            self.$el.find(".btn-luu").bind("click", function () {
                if (files != undefined) {
                    files.forEach(function (item, index) {
                        self.saveAttachment(item.arrAttachment, item.data_attr);
                    })
                }
                else {
                    self.saveModel();
                }
                // self.saveModel();
            })
        },
        renderAttachment: function () {
            var self = this;
            self.$el.find('.link-taive-baocaodoanthanhtra div').each(function (indexhtml, itemhtml) {
                if (self.model.get($(itemhtml).attr('data-field')) != null) {
                    $(self.$el.find('.custom-file-baocaodoanthanhtra')[indexhtml]).hide();
                    // $(itemhtml).append(`
					// 	<label class = 'mt-2'>Danh sách tài liệu</label><br>
					// `)
                    self.model.get($(itemhtml).attr('data-field')).forEach(function (itemfield, indexfield) {
                        self.$el.find(".taive-" + $(itemhtml).attr('data-field')).append(`
						<label>&nbsp;&nbsp;&nbsp;&nbsp;${itemfield.slice(16)}</label><a href="${itemfield}"> Tải về </a><br>
						`)
                    })
                }
            })
        },
        inputFileOnChange: function () {
            var self = this;
            var arrInputFile = [];
            self.$el.find(".upload_files").change(function () {

                const promise = new Promise((resolve, reject) => {
                    var arrAttachment = [];

                    var data_attr = $(this).attr("data-attr");
                    // self.$el.find(".tenfile-" + data_attr).append(`
					// 	<label class = 'mt-2'>Danh sách tài liệu</label><br>
                    // `)
                    self.$el.find(".tenfile-" + data_attr).find('label,br').remove()
                    for (var i = 0; i < $(this).get(0).files.length; ++i) {
                    //     self.$el.find(".tenfile-" + data_attr).append(`
					// 	<label>&nbsp;&nbsp;&nbsp;&nbsp;${$(this).get(0).files[i].name}</label><br>
					// `)
                        arrAttachment.push($(this).get(0).files[i]);
                    }
                    self.$el.find('.label_list_files-' + data_attr).text("Bạn vừa chọn " + arrAttachment.length + " tài liệu")
                    arrInputFile.push({ arrAttachment, data_attr })
                    return resolve(arrInputFile)
                })
                promise.then((arr) => {
                    self.bindEventGD1(arr)
                });
            });
        },
        saveAttachment: function (arrAttachment, data_attr) {
            var self = this;
            var arrLinkAttachment = [];

            arrAttachment.forEach(function (item, index) {
                var http = new XMLHttpRequest();
                var fd = new FormData();
                fd.append('file', item);
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
                            arrLinkAttachment.push(String(data_file.link))
                            if (arrAttachment.length == index + 1) {
                                self.model.set(data_attr, arrLinkAttachment)
                                self.model.save(null, {
                                    success: function (model, response, options) {
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

                            }
                        }
                    } else {
                        self.getApp().notify("Không thể tải tệp tin lên máy chủ");
                    }
                };
                http.send(fd);
            })

        },
    });
});