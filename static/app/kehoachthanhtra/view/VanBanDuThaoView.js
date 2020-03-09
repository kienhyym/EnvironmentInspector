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
                {
                    field: "ngayduyetvanban",
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
            self.$el.find(".btn-luu").unbind("click").bind("click", function () {
                var so_vanban_duthao = self.model.get("so_vanban_duthao");
                if (so_vanban_duthao === null || so_vanban_duthao === "") {
                    self.getApp().notify({ message: "Vui lòng nhập số văn bản dự thảo" }, { type: "danger", delay: 1000 });
                    return;
                }
                var ngay_duthao_vanban = self.model.get("ngay_duthao_vanban");
                if (ngay_duthao_vanban === null || ngay_duthao_vanban === "") {
                    self.getApp().notify({ message: "Vui lòng nhập ngày văn bản dự thảo"}, { type: "danger", delay: 1000 });
                    return;
                }

                var tenfile_vanban_duthao_duthao_attachment = self.$el.find(".tenfile-vanban_duthao_duthao_attachment label");
                var taive_vanban_duthao_duthao_attachment = self.$el.find(".taive-vanban_duthao_duthao_attachment label");

                if (tenfile_vanban_duthao_duthao_attachment.length == 0) {
                    if (taive_vanban_duthao_duthao_attachment.length == 0) {
                        self.getApp().notify({ message: "Vui lòng tải tài liệu dự thảo lên" }, { type: "danger", delay: 1000 });
                        return;
                    }
                }
                self.saveModel();
            })

            self.$el.find(".trangthai_vanban").on('change.gonrin', function (e) {
                if (self.$el.find(".trangthai_vanban").data('gonrin').getValue() == 1) {
                    $(".nguoiduyet").show()
                }else{
                    $(".nguoiduyet").hide()
                }
            });
            self.$el.find(".btn_congvangiaitrinh").unbind("click").bind("click", function () {
                self.$el.find(".congvangiaitrinh").toggle();
            });
            self.$el.find(".btn_thamkhao").unbind("click").bind("click", function () {
                self.$el.find(".thamkhao").toggle();
            });
            if(self.model.attributes.ngay_vanban_thamkhao_ykien != null && 
                self.model.attributes.so_vanban_thamkhao_ykien != "" &&
                self.model.attributes.so_vanban_thamkhao_ykien != null &&
                self.model.attributes.tham_khao_y_kien_attachment != null ){
                    self.$el.find(".thamkhao").show();
                }
                if(self.model.attributes.ngay_gui_congvan_giaitrinh != null && 
                    self.model.attributes.so_congvan_giaitrinh != "" &&
                    self.model.attributes.so_congvan_giaitrinh != null &&
                    self.model.attributes.congvan_giaitrinh_cua_doituong_thanhtra_attachment != null ){
                        self.$el.find(".congvangiaitrinh").show();
                    }
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
                "vanban_duthao_duthao_attachment",
                "congvan_giaitrinh_cua_doituong_thanhtra_attachment",
                "tham_khao_y_kien_attachment"

            ];
            $.each(keys, function (i, key) {
                var attr_value = self.model.get(key);
                var linkDownload = self.$el.find(".linkDownloadVanBanDuThao");

                if (!!attr_value) {
                    linkDownload[i].href = attr_value;
                    self.$el.find("#upload-" + key).hide();
                    self.$el.find("#download-" + key).show();

                } else {
                    self.$el.find("#upload-" + key).show();
                    self.$el.find("#download-" + key).hide();

                }

            })
            self.$el.find(".textDownloadVanBanDuThao").each(function (index, item) {
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
                var so_vanban_duthao = self.model.get("so_vanban_duthao");
                if (so_vanban_duthao === null || so_vanban_duthao === "") {
                    self.getApp().notify({ message: "Vui lòng nhập số văn bản dự thảo" }, { type: "danger", delay: 1000 });
                    return;
                }
                var ngay_duthao_vanban = self.model.get("ngay_duthao_vanban");
                if (ngay_duthao_vanban === null || ngay_duthao_vanban === "") {
                    self.getApp().notify({ message: "Vui lòng nhập ngày văn bản dự thảo"}, { type: "danger", delay: 1000 });
                    return;
                }

                var tenfile_vanban_duthao_duthao_attachment = self.$el.find(".tenfile-vanban_duthao_duthao_attachment label");
                var taive_vanban_duthao_duthao_attachment = self.$el.find(".taive-vanban_duthao_duthao_attachment label");

                if (tenfile_vanban_duthao_duthao_attachment.length == 0) {
                    if (taive_vanban_duthao_duthao_attachment.length == 0) {
                        self.getApp().notify({ message: "Vui lòng tải tài liệu dự thảo lên" }, { type: "danger", delay: 1000 });
                        return;
                    }
                }
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
            self.$el.find('.link-taive-vanbanduthao div').each(function (indexhtml, itemhtml) {
                if (self.model.get($(itemhtml).attr('data-field')) != null) {
                    $(self.$el.find('.custom-file-vanbanduthao')[indexhtml]).hide();
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
            self.$el.find(".upload_files").change(function () {
                var arrInputFile = [];
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
                            if (arrAttachment.length == arrLinkAttachment.length) {
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