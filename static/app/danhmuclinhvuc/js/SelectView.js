define(function (require) {
	"use strict";
	var $ = require('jquery'),
		_ = require('underscore'),
		Gonrin = require('gonrin');

	var template = require('text!app/danhmuclinhvuc/tpl/select.html'),
		schema = require('json!schema/DanhMucLinhVucSchema.json');
	var CustomFilterView = require('app/base/view/CustomFilterView');

	return Gonrin.CollectionDialogView.extend({
		template: template,
		modelSchema: schema,
		urlPrefix: "/api/v1/",
		collectionName: "danhmuclinhvuc",
		bindings: "data-bind",
		textField: "tenlinhvuc",
		valueField: "id",
		tools: [
			{
				name: "defaultgr",
				type: "group",
				groupClass: "toolbar-group",
				buttons: [
					{
						name: "select",
						type: "button",
						buttonClass: "btn-success btn-sm",
						label: "TRANSLATE:SELECT",
						command: function () {
							var self = this;
							self.trigger("onSelected");
							self.close();
						}
					},
				]
			},
		],
		uiControl: {
			fields: [
				{ field: "tenlinhvuc", label: "Tên", width: 250 },
			],
			onRowClick: function (event) {
				this.uiControl.selectedItems = event.selectedItems;
			},
		},

		// render: function () {
		// 	var self = this;
		// 	self.applyBindings();
		// },
		render: function () {
			var self = this;
			self.uiControl.orderBy = [{ "field": "tenlinhvuc", "direction": "desc" }];
			var filter = new CustomFilterView({
				el: self.$el.find("#grid_search"),
				sessionKey: self.collectionName + "_filter"
			});
			filter.render();

			if (!filter.isEmptyFilter()) {
				var text = !!filter.model.get("text") ? filter.model.get("text").trim() : "";
				var query = {
					"$or": [
						{ "tenlinhvuc": { "$like": text } },
					]
				};

				var filters = query;
				if (self.uiControl.filters !== null) {
					filters = {
						"$and": [
							self.uiControl.filters,
							query
						]
					};
				}
				self.uiControl.filters = filters;
			}
			self.applyBindings();

			filter.on('filterChanged', function (evt) {
				var $col = self.getCollectionElement();
				var text = !!evt.data.text ? evt.data.text.trim() : "";
				if ($col) {
					if (text !== null) {
						var query = {
							"$or": [
								{ "tenlinhvuc": { "$like": text } },
							]
						};
						var filters = query;
						if (self.uiControl.filters !== null) {
							filters = {
								"$and": [
									self.uiControl.filters,
									query
								]
							};
						}
						$col.data('gonrin').filter(filters);
						//self.uiControl.filters = filters;
					} else {
						self.uiControl.filters = null;
					}
				}
				self.applyBindings();
			});
			return this;
		},
	});

});