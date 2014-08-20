angular.module('file')
  .service('file:reader', ['$rootScope', function($rootScope) {
    this.cache = function(files) {
      $rootScope.$emit('file:reader:received', files);
    };
  }])
;
