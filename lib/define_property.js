(function() {
  Function.prototype.property = function(property, description) {
    return Object.defineProperty(this.prototype, property, description);
  };

}).call(this);

//# sourceMappingURL=../maps/define_property.js.map
