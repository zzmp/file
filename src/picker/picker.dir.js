var filePickerDirective = function(reader) {
  return {
    transclude: false,
    restrict: 'E',
    scope: {               // ALLOWED VALUES                        | DEFAULT
      title        : '@?', // string                                | ''
      dialogue     : '@?', // boolean                               | true
      drop         : '@?', // '' (div only) or window               | false
      // TODO
      progress     : '@?', // boolean                               | false
      // TODO: mime checking for dropped files
      mime         : '@?', // comma-separated list of allowed types | all
      // TODO: aspect checking
      aspect       : '@?', // (image only) width:height             | none; if included, mime will default to image
      // TODO: limit checking
      limit        : '@?', // maximum file size in bytes            | none
      modal        : '@?', // boolean                               | false
      logo         : '@?', // branding                              | none
      integrations : '=?'  // integrations to include (ex. facebook)| none
    },
    template/* compile */: function(el, attrs) {
      var classes = ["file-picker"];
      if (typeof attrs.drop === 'string')
        classes.push('drop');
      if (typeof attrs.modal === 'string')
        classes.push('modal');
      if (attrs.logo)
        classes.push('branded');
      if (attrs.integrations)
        classes.push('integrated');

      angular.forEach(el[0].className.split(' '), function(c) { classes.push(c); });

      // Enforce image types if aspect is specified
      if (attrs.aspect && (!attrs.mime || ~attrs.mime.indexOf('image')))
        attrs.mime = 'image/*';

      var div   = ['<div class="', classes.join(' '), '">'];
      if (attrs.title)
        div.push(['<div class="file-title">', attrs.title, '</div'].join(''));
      var drop  = typeof attrs.drop === 'string' ? ['<file-drop area="', attrs.drop, '"></file-drop>'] : [];
      var input = ['<div><span>'];
      if (attrs.logo)
        input.push('<img class="file-logo" src="' + attrs.logo + '">');
      if (attrs.dialogue !== 'false')
        input.push(['<file-input accept="', attrs.mime, '"></file-input>'].join(''));
      /* TODO: if (attrs.integrations)
        input.push('<file-integrations include="' + attrs.integrations + '">'); */
      input.push('</span></div>');
      var progress = typeof attrs.progress === 'string' ? '<div><file-progress></file-progress></div>' : '';

      return [div.join(''), drop.join(''), input.join(''), progress, '</div>'].join('\n');

      // TODO: CSS
      /* USE THIS AS A GUIDE FOR CUSTOM STYLING OF THE FILE-PICKER
       * <div class="file-picker [drop modal branded integrated ...]">
       *   [<div class="file-title">...</div>]
       *   [<file-drop area="[window]" />]
       *   <div>
       *     <span>
       *       <img class="file-logo" src="...">
       *       [<file-input />]
       *       [<file-integrations include="...">]
       *     </span>
       *   </div>
       *   <div><file-progress /></div>
       * </div>                                                     */
    },
    controllerAs: 'filePicker',
    controller: function($scope) {
      var that = this;
      var el;

      // Associate to element
      this.link = function(element) {
        el = element;
      };

      // Set up dialogue
      this.select = function(e, files) {
        if (process(e, files) && $scope.modal)
          that.close();
      };
      // Set up drop
      this.drop = function(e) {
        if (process(e, e.dataTransfer.files) && $scope.modal)
          that.close();
      };
      // Set up modality
      this.close = function() { el.remove(); };

      function process(e, fileList) {
        e.stopPropagation(); e.preventDefault();
        var files = [];

        Array.prototype.forEach.call(fileList, function(file) {
          files.push(file);
        });

        reader.cache(files);
        // TODO: Enforce configuration
        return true;
      }
    },
    link: function(scope, el, attrs, ctrl) { ctrl.link(el); }
  };
};
filePickerDirective.$inject = [reader];

angular.module('file')
  .directive('filePicker', filePickerDirective)
;

