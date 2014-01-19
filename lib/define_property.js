(function() {
  Function.prototype.property = function(property, description) {
    return Object.defineProperty(this.prototype, property, description);
  };

}).call(this);
