// TODO: Shared configuration
var fileConfig = function($provide, picker, reader, dragger) { void 0; };
fileConfig.$inject = ['$provide']; //.concat(internalsProvider);

var fileProvider = function() {
  this.$get = function($rootScope, $q, picker) {
    return { pick: pick };

    function pick(options) {
      var files = $q.defer();
      var deregister = {};

      var fileCancel = function(e) {
        files.reject();
        deregister.cancel();
        deregister.receive();
        deregister.complete();
      };
      var fileReceive = function(e, data, name, file) {
        files.notify({
          data: data,
          name: name,
          file: file
        });
      };
      var fileComplete = function(e, log) {
        files.resolve(log);
        deregister.cancel();
        deregister.receive();
        deregister.complete();
      };


      picker.pick(options);
      // TODO: Emit this event
      deregister.cancel = $rootScope.$on('file:picker:canceled', fileCancel);
      deregister.receive = $rootScope.$on('file:reader:received', fileReceive);
      deregister.complete = $rootScope.$on('file:reader:complete', fileComplete);

      return files.promise;
    }
  };
  this.$get.$inject = ['$rootScope', '$q', 'file:picker'];
};

angular.module('file')
  .config(fileConfig)
  .provider('file', fileProvider)
;
