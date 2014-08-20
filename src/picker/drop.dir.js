angular.module('file')
  .directive('fileDrop', ['$window', function($window) {
    return {
      require: '^filePicker',
      restrict: 'E',
      scope: {
        area: '&'
      },
      template: function(el, attrs) {
        if (attrs.area === 'window') {
          return '<div class="file-drop-window">Drag files to the window to upload...</div>';
        } else
          return '<div class="file-drop-div">Drag files here...</div>';
      },
      link: function(scope, el, attrs, ctrl) {
        var area = scope.area === 'window' ? $window : el;

        area.on('dragover', dragOver);
        area.on('drop', ctrl.select);

        scope.$on('$destroy', function() {
          area.off('dragover', dragOver);
          area.off('drop', ctrl.select);
        });

        function dragOver(e) {
          e.stopPropagation(); e.preventDefault();

          e.dataTransfer.dropEffect = 'copy';
        }
      }
    };
  }])
;

