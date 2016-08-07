module.exports = {
  normalizeEntityName: function() {
  },

  afterInstall: function() {
    return this.addBowerPackageToProject('flatpickr', 'flatpickr-calendar#1.9.1');
  }
};
