angular.module('file')
  // Open a modal picker
  .service('file:picker', ['$rootScope', '$compile', '$document',
      function($rootScope, $compile, $document) {
    this.pick = function(options) {
      options = options || {};
      options.modal = true;
      if (!options.dialogue)
        options.dialogue = true;
      if (!options.drop)
        options.drop = '';

      var tEl = ['<file-picker'];
      var el;

      angular.forEach(options, function(val, key) {
        // TODO: Special case for integrations
        var attr = [key, '="', val, '"'].join('');

        tEl.push(attr);
      });

      tEl.push('></file-picker>');

      el = $compile(tEl.join(' '))($rootScope);
      $document.find('body').append(el);
    };
  }])
;
