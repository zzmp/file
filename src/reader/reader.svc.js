angular.module('file')
  // TODO: Expose configuration (read / store) through provider
  .factory('file:reader', ['$window', '$rootScope', function($window, $rootScope) {
    var progress = {
      state: FileReader.EMPTY,
      progress: null,
      loaded: null,
      total: null
    };

    // TODO: Allow asynchronous reading of all files (optional)
    var loadFiles = function(files) {
      // TODO: Track progress
      files.forEach(load);
    };

    return {
      progress: progress,
      load:     loadFiles
    };

    function load(file) {
      var reader = new FileReader();
      var name = file.name;

      reader.onabort = onabort(name);
      reader.onerror = onerror(name);
      reader.onloadstart = onloadstart(name);
      reader.onprogress = onprogress(name);
      reader.onload = onload(name, file);

      // TODO: Configurable read methods
      reader.readAsDataURL(file);
    }

    function onabort(name) { return function(e) {
      $window.alert('Read canceled for file ' + name);
    };}
    function onerror(name) { return function(e) {
      var error = 'An error occured while reading file ' + name;

      switch (e.target.error.code) {
        case (e.target.error.NOT_FOUND_ERR):
          error += ': file not found';
          break;
        case (e.target.error.NOT_READABLE_ERR):
          error += ': file not readable';
          break;
        case (e.target.error.ABORT_ERR):
          return/* noop */;
      }

      $window.alert(error);
    };}
    function onloadstart(name) { return function(e) {
      
    };}
    function onprogress(name) { return function(e) {
    
    };}
    function onload(name, file) { return function(e) {
      $rootScope.$emit('file:reader:received', e.target.result, name, file);
    };}
  }])
;
