// TODO: Shared configuration
var fileConfig = function($provide, picker, reader, dragger) { void 0; };
fileConfig.$inject = ['$provide']; //.concat(internalsProvider);

var fileProvider = function() {
  this.$get = function($rootScope, $q, picker) {
    return { pick: pick };

    function pick() {
      var files = $q.defer();
      var deregister = {};

      var fileCancel = function() {
        files.reject();
        deregister.cancel();
      };
      var fileReceive = function(e, fileList) {
        files.resolve(fileList);
        deregister.receive();
      };


      picker.pick();
      // TODO: Emit this event
      deregister.cancel = $rootScope.$on('file:picker:canceled', fileCancel);
      deregister.receive = $rootScope.$on('file:reader:received', fileReceive);

      return files.promise;
    }
  };
  this.$get.$inject = ['$rootScope', '$q', 'file:picker'];
};

angular.module('file')
  .config(fileConfig)
  .provider('file', fileProvider)
;
