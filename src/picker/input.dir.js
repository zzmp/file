angular.module('file')
  .directive('file-input', [function($window) {
    return {
      require: '^file-picker',
      restrict: 'E',
      scope: {
        'accept': '='
      },
      template: function(el, attrs) {
        return ['<input type="file" accept="', attrs.accept, '">'].join('');
      },
      link: function(scope, el, attrs, ctrl) {
        el.on('change', ctrl.select);
      }
    };
  }])
;

