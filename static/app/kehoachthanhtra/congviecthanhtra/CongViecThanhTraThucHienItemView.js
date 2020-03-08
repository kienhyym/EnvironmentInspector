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
            self.getApp().currentUser.roles.forEach(function (item, index) {
				if (item.role_name == 'VanPhongCuc') {
					self.$el.find(".btn-luu").hide();
				}
			})
            // self.bindEventSelect();
            self.applyBindings();
            // self.$el.find('.upload_files_B8').attr("aria-label",self.model.attributes.hangmuccongviec)
            self.inputFileOnChange();
            self.renderAttachment();
            // self.renderUpload();
            if (self.model.get("id") == null) {
                self.model.set("id", gonrin.uuid());
            }
            self.$el.find(".btn-luu").unbind('click').bind("click", function () {
                var filters = {
                    filters: {
                        "$and": [
                            { "id": { "$eq": window.location.hash.slice(36) } }
                        ]
                    },
                    order_by: [{ "field": "created_at", "direction": "asc" }]
                }
                $.ajax({
                    url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra?results_per_page=100000&max_results_per_page=1000000",
                    method: "GET",
                    data: "q=" + JSON.stringify(filters),
                    contentType: "application/json",
                    success: function (data) {

                        const promise = new Promise((resolve, reject) => {
                            data.objects[0].danhsach_congviec_thanhtra.forEach(function (item, index) {

                                if (item.id == self.model.attributes.id) {
                                    item.thoigianhoanthanh = self.model.attributes.thoigianhoanthanh;
                                }
                            })

                            return resolve(data.objects[0].danhsach_congviec_thanhtra)
                        });



                        promise.then((data) => {
                            $.ajax({
                                url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra/" + window.location.hash.slice(36),
                                method: "PUT",
                                data: JSON.stringify({ "danhsach_congviec_thanhtra": data }),
                                contentType: "application/json",
                                success: function (data) {
                                    self.getApp().getRouter().refresh();


                                },
                                error: function (xhr, status, error) {
                                    self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
                                },
                            });
                        });



                    },
                    error: function (xhr, status, error) {
                        self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
                    },
                });
            })

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
            self.$el.find(".textDownloadTinhHinhThanhTra").each(function (index, item) {
                item.textContent = item.textContent
            })
        },
        saveModel: function () {
            var self = this;
            // console.log("tai lieuiữ", self.model.get("tailieu"))

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
            self.$el.find(".btn-luu").unbind('click').bind("click", function () {
                if (files != undefined) {
                    files.forEach(function (item, index) {
                        self.saveAttachment(item.arrAttachment, item.data_attr);

                    })
                }
                else {
                    self.saveModel();
                }
            })
        },
        renderAttachment: function () {
            var self = this;
            self.$el.find('.taive-tailieu-B8').attr("data-id", self.model.attributes.id)

        },
        inputFileOnChange: function () {
            var self = this;
            var arrInputFile = [];
            self.$el.find(".upload_files_B8").change(function () {
                const promise = new Promise((resolve, reject) => {
                    
                    var arrAttachment = [];
                    
                    var data_attr = $(this).attr("data-attrx");
                    
                    // self.$el.find(".tenfile_B8-" + data_attr).append(`
					// 	<label class = 'mt-2'>Danh sách tài liệu</label><br>
                    // `)
                    self.$el.find(".tenfile_B8-tailieu label,br").remove()
                    for (var i = 0; i < $(this).get(0).files.length; ++i) {
                        self.$el.find(".tenfile_B8-" + data_attr).append(`
						<label>&nbsp;&nbsp;&nbsp;&nbsp;${$(this).get(0).files[i].name}</label><br>
					`)
                        arrAttachment.push($(this).get(0).files[i]);
                    }
                    

                    self.$el.find('.label_list_files_B8-' + data_attr).text("Bạn vừa chọn " + arrAttachment.length + " tài liệu")
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
                                var filters = {
                                    filters: {
                                        "$and": [
                                            { "id": { "$eq": window.location.hash.slice(36) } }
                                        ]
                                    },
                                    order_by: [{ "field": "created_at", "direction": "asc" }]
                                }
                                $.ajax({
                                    url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra?results_per_page=100000&max_results_per_page=1000000",
                                    method: "GET",
                                    data: "q=" + JSON.stringify(filters),
                                    contentType: "application/json",
                                    success: function (data) {

                                        const promise = new Promise((resolve, reject) => {
                                            data.objects[0].danhsach_congviec_thanhtra.forEach(function (item, index) {

                                                if (item.id == self.model.attributes.id) {
                                                    item.tailieu = arrLinkAttachment;
                                                    item.thoigianhoanthanh = self.model.attributes.thoigianhoanthanh;
                                                }
                                            })

                                            return resolve(data.objects[0].danhsach_congviec_thanhtra)
                                        });



                                        promise.then((data) => {
                                            $.ajax({
                                                url: self.getApp().serviceURL + "/api/v1/kehoachthanhtra/" + window.location.hash.slice(36),
                                                method: "PUT",
                                                data: JSON.stringify({ "danhsach_congviec_thanhtra": data }),
                                                contentType: "application/json",
                                                success: function (data) {
                                                    self.getApp().getRouter().refresh();


                                                },
                                                error: function (xhr, status, error) {
                                                    self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
                                                },
                                            });
                                        });



                                    },
                                    error: function (xhr, status, error) {
                                        self.getApp().notify({ message: "Không lấy được dữ liệu" }, { type: "danger", delay: 1000 });
                                    },
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