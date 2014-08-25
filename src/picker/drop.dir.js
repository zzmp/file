angular.module('file')
  .directive('fileDrop', ['$window', function($window) {
    return {
      require: '^filePicker',
      restrict: 'E',
      scope: {
        area: '&',
        accept: '&',
        multiple: '&?'
      },
      template: function(el, attrs) {
        if (attrs.area === 'window') {
          return '<div class="file-drop-window">Drag files to the window to upload...</div>';
        } else
          return '<div class="file-drop-div">Drag files here...</div>';
      },
      link: function(scope, el, attrs, ctrl) {
        var area = attrs.area === 'window' ? ctrl.window : el.children();

        area.on('dragover', dragOver);
        area.on('drop', function(e) {
          e.stopPropagation(); e.preventDefault();

          // Check for multiple files
          if (!attrs.hasOwnProperty('multiple') &&
              e.dataTransfer.files.length > 1)
            return;

          // Check for mime types
          var mimecheck = attrs.accept === '' ? /.*/ :
            new RegExp(
              attrs
                .accept
                .replace(/\/\*/g, '')
                .split(' ')
                .map(function(mime) { return '(' + mime + ')'; })
                .join('|'));
          var error =
            'Only ' +
            attrs.accept.split(' ').map(function(type) {
              return type.split('/')[0];
            }).join(', ') +
            ' files may be uploaded.';
          var erred = false;
          Array.prototype.forEach.call(e.dataTransfer.files, function(file) {
            if (!erred && !file.type.match(mimecheck)) {
              erred = true;
              ctrl.window.alert(error);
            }
          });
          if (erred)
            return;

          ctrl.select(e, e.dataTransfer.files);
        });

        function dragOver(e) {
          e.stopPropagation(); e.preventDefault();

          // Check for multiple files
          if (!attrs.hasOwnProperty('multiple') &&
              e.dataTransfer.items.length > 1)
            return;

          e.dataTransfer.dropEffect = 'copy';
        }
      }
    };
  }])
;

