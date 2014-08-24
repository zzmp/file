angular.module('file')
  .directive('fileProgress', function() {
    return {
      require: '^filePicker',
      restrict: 'E',
      scope: {
        'progress': '='
      },
      // TODO: UX
      template: '<div>{{ progress.progress }} {{ progress.loaded.files }}/{{ progress.total.files }}</div>'
    };
  })
;

