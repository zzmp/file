angular.module('file')
  .directive('fileInput', [function($window) {
    return {
      require: '^filePicker',
      restrict: 'E',
      scope: {
        'accept': '&',
        'multiple': '&?'
      },
      template: function(el, attrs) {
        return ['<a class="file-input">Choose File</a>',
          '<input style="display: none" type="file" accept="',
          attrs.accept,
          '" ',
          attrs.multiple,
          '>'].join('');
      },
      link: function(scope, el, attrs, ctrl) {
        var input = el.find('input');

        el.find('a').on('click', function(e) {
          e.stopPropagation(); e.preventDefault();

          input[0].click();
        });

        input.on('change', function(e) {
          e.stopPropagation(); e.preventDefault();

          ctrl.select(e, e.target.files);
        });
      }
    };
  }])
;

