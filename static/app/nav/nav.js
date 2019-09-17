define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');
	return [
		{
			"text": "Lịch thanh tra",
			"icon": "fa fa-user",
			"type": "view",
			"collectionName": "lichthanhtra",
			"route": "lichthanhtra/model",
			"$ref": "app/lichthanhtra/view/ModelView",
			"visible": function () {
				return true;
			}
		},

		{
			"text": "Danh sách đơn vị",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "danhmucdoanhnghiep",
			"route": "danhmucdoanhnghiep/collection",
			"$ref": "app/danhmucdoanhnghiep/js/CollectionView",
			"visible": function () {
				return true;
			}
		},
		{
			"text": "Chi tiết đơn vị",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "danhmucdoanhnghiep",
			"route": "danhmucdoanhnghiep/model(/:id)",
			"$ref": "app/danhmucdoanhnghiep/js/ModelView",
			"visible": function () {
				return false;
			}
		},
		{
			"text": "Danh sách lĩnh vực",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "danhmuclinhvuc",
			"route": "danhmuclinhvuc/collection",
			"$ref": "app/danhmuclinhvuc/js/CollectionView",
			"visible": function () {
				return true;
			}
		},
		{
			"text": "Chi tiết lĩnh vực",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "danhmuclinhvuc",
			"route": "danhmuclinhvuc/model(/:id)",
			"$ref": "app/danhmuclinhvuc/js/ModelView",
			"visible": function () {
				return false;
			}
		},


		{
			"text": "Xây dựng kế hoạch ",
			"icon": "fa fa-book",
			"type": "view",
			"collectionName": "kehoachthanhtra",
			"route": "kehoachthanhtra/collection",
			"$ref": "app/kehoachthanhtra/view/CollectionView",
			"visible": function () {
				return true;
			}
		},
		{
			"text": "Thông tin kế hoạch",
			"icon": "fa fa-book",
			"type": "view",
			"collectionName": "kehoachthanhtra",
			"route": "kehoachthanhtra/model",
			"$ref": "app/kehoachthanhtra/view/ModelView",
			"visible": function () {
				return false;
			}
		},
		{
			"text": "Danh sách người dùng",
			"icon": "fa fa-book",
			"type": "view",
			"collectionName": "user",
			"route": "user/collection",
			"$ref": "app/user/view/CollectionView",
			"visible": function () {
				console.log('xxxxxxxxxxx',this.userHasRole("CucTruong"))

				return this.userHasRole("CucTruong");
			}
		},
		{
			"text": "Thông tin người dùng",
			"icon": "fa fa-book",
			"type": "view",
			"collectionName": "user",
			"route": "user/model",
			"$ref": "app/user/view/ModelView",
			"visible": function () {
				return false;
			}
		},
		{
			"text": "Triển khai cuộc thanh tra",
			"icon": "fa fa-book",
			"type": "view",
			"collectionName": "kehoachthanhtra",
			"route": "kehoachthanhtra/collection_approved",
			"$ref": "app/kehoachthanhtra/view/CollectionView_planning",
			"visible": function () {
				return true;
			}
		},
		{
			"text": "Thông tin kế hoạch",
			"icon": "fa fa-book",
			"type": "view",
			"collectionName": "kehoachthanhtra",
			"route": "kehoachthanhtra/model_approved",
			"$ref": "app/kehoachthanhtra/view/ModelView_12step_plan",
			"visible": function () {
				return false;
			}
		},

	];

});


