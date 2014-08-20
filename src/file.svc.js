// TODO: Shared configuration
var fileConfig = function($provide, picker, reader, dragger) { void 0; };
fileConfig.$inject = ['$provide']; //.concat(internalsProvider);

var fileProvider = function() {
  this.$get = function($rootScope, $q, picker) {
    return { pick: pick };

    function pick() {
      var files = $q.defer();
      var fileCancel = function() {
        files.reject();
        $rootScope.$off('file:picker:canceled', fileCancel);  
      };
      var fileReceive = function(e, files) {
        files.resolve(files);
        $rootScope.$off('file:reader:received', fileReceive);
      };


      picker.pick();
      // TODO: Emit this event
      $rootScope.$on('file:picker:canceled', fileCancel);
      $rootScope.$on('file:reader:received', fileReceive);

      return files.promise;
    }
  };
  this.$get.$inject = ['$rootScope', '$q', 'file:picker'];
};

angular.module('file')
  .config(fileConfig)
  .provider('file', fileProvider)
;
