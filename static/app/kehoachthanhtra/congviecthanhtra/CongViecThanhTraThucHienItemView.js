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

      if (self.model.get("id") == null) {
        self.model.set("id", gonrin.uuid());
      }
      this.applyBindings();

      self.$el.find("#itemRemove").unbind("click").bind("click", function () {
        self.remove(true);
      });
    }

  });

});