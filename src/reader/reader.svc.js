angular.module('file')
  // TODO: Expose configuration (read / store) through provider
  .factory('file:reader', ['$window', '$rootScope', function($window, $rootScope) {
    var progress = { state: FileReader.EMPTY };
    var tracker;

    // TODO: Allow asynchronous reading of all files (optional)
    var loadFiles = function(files) {
      if (progress.state === FileReader.LOADING)
        return false; // Disallow simultaneous loads

      progress = {
        state: FileReader.LOADING,
        progress: null,
        loaded: {
          size: null,
          files: null,
          erred: null
        },
        total: {
          size: null,
          files: null
        }
      };
      tracker = { _files: [] };

      progress.loaded.size =
        progress.loaded.files = progress.loaded.erred = 0;
      progress.total.files = files.length;

      files.forEach(function(file) {
        var name = file.name;
        tracker._files.push(file.name);
        tracker[name] = { loaded: 0, total: file.size };
        progress.total.size += file.size;

        load(file);
      });

      return progress;
    };

    return {
      load:     loadFiles
    };

    function track(name, loaded) {
      var complete = false;
      var total    = progress.total.size;
      var fraction = 0;
      progress.loaded.size = 0;

      tracker[name].loaded = loaded;
      if (loaded === false) {
        progress.loaded.erred++;
      } else if (loaded === true)
        progress.loaded.files++;

      tracker._files.forEach(function(name) {
        var loaded = tracker[name][
          typeof tracker[name].loaded === 'number' ?
          'loaded' : 'total'];

        fraction += loaded / total;
        progress.loaded.size += loaded;
      });

      progress.loaded.progress = fraction;
      console.log(fraction);

      if (progress.loaded.files + progress.loaded.erred === progress.total.files) {
        progress.state = FileReader.DONE;
        $rootScope.$emit('file:reader:complete');
      }
    }

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
      track(name, false);
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
      track(name, false);
    };}
    function onloadstart(name) { return function(e) {/* noop */};}
    function onprogress(name) { return function(e) {
      if (!e.lengthComputable)
        return;

      track(name, e.loaded);
    };}
    function onload(name, file) { return function(e) {
      $rootScope.$emit('file:reader:received', e.target.result, name, file);
      track(name, true);
    };}
  }])
;
