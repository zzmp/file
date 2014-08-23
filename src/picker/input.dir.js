angular.module('file')
  .directive('fileInput', [function($window) {
    return {
      require: '^filePicker',
      restrict: 'E',
      scope: {
        'accept': '='
      },
      template: function(el, attrs) {
        return ['<input type="file" accept="', attrs.accept, '">'].join('');
      },
      link: function(scope, el, attrs, ctrl) {
        el.on('change', function(e) { ctrl.select(e, e.target.files); });
      }
    };
  }])
;

