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
			"text": "Danh sách doanh nghiệp",
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
			"type": "view",
			"collectionName": "danhmucdoanhnghiep",
			"route": "danhmucdoanhnghiep/model(/:id)",
			"$ref": "app/danhmucdoanhnghiep/js/ModelView",
			"visible": function () {
				return false;
			}
		},

		{
			"text": "Danh sách đơn vị quản lý",
			"icon": "fa fa-home",
			"type": "view",
			"collectionName": "donvi",
			"route": "donvi/collection",
			"$ref": "app/donvi/js/CollectionView",
			"visible": function () {
				return true;
			}
		},
		{
			"type": "view",
			"collectionName": "donvi",
			"route": "donvi/model(/:id)",
			"$ref": "app/donvi/js/ModelView",
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
			"text": "Danh sách người dùng",
			"icon": "fa fa-book",
			"type": "view",
			"collectionName": "user",
			"route": "user/collection",
			"$ref": "app/user/view/CollectionView",
			"visible": function () {
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
			"text": "Tạo kế hoạch thanh tra",
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
		{
			"text": "Danh sách kế hoạch năm",
			"icon": "fa fa-book",
			"type": "view",
			"collectionName": "kehoachnamsau",
			"route": "kehoachnamsau/collection",
			"$ref": "app/kehoachnamsau/view/CollectionView",
			"visible": function () {
				return true;
			}
		},
		{
			"type": "view",
			"collectionName": "kehoachnamsau",
			"route": "kehoachnamsau/model",
			"$ref": "app/kehoachnamsau/view/ModelView",
			"visible": function () {
				return false;
			}
		},

	];

});


