/**
  * ATTRIBUTE | ALLOWED VALUE        | DEFAULT | BEHAVIOR
  * --- BEHAVIOR OPTIONS ---
  * dialogue  | boolean              | true    | Dialogued file selection
  * drop      | boolean              | true    | Drag'n'drop file selection
  * multiple  | boolean              | false   | -
  * mime      | comma-separated list | all     | Allowed mime types
  * aspect    | width:height (string)| none    | Defaults mime to image
  * limit     | bytes (number)       | none    | Maximum file size
  * modal     | boolean              | false   | -
  * --- DISPLAY OPTIONS ---
  * title     | string               | none    | -
  * logo      | uri (string)         | none    | -
  * progress  | boolean              | false   | Display progress bar
  * --- INTEGRATION OPTIONS ---
  * // TODO
  *
  * // TODO: CSS
  * USE THIS AS A GUIDE FOR CUSTOM STYLING OF THE FILE-PICKER
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
var filePickerDirective = function(reader) {
  var scope = {
    dialogue     : '@?',
    drop         : '@?',
    multiple     : '@?',
    mime         : '@?',
    // TODO: aspect checking
    aspect       : '@?',
    // TODO: limit checking
    limit        : '@?',
    modal        : '@?',
    title        : '@?',
    logo         : '@?',
    progress     : '@?',
    integrations : '=?'
  };

  return {
    transclude: false,
    restrict: 'E',
    scope: scope,
    template/* (compile) */: template,
    controllerAs: 'filePicker',
    controller: ['$rootScope', '$scope', '$window', controller],
    link: link
  };

  function template(el, attrs) {
    var classes = el[0].className.split(' ');
    classes.push('file-picker');
    ['drop', 'modal', 'branded', 'integrated'].forEach(function(c) {
      if (attrs.hasOwnProperty(c) && attrs[c] !== 'false')
        classes.push(c);
    });

    // Enforce image types if aspect is specified
    attrs.mime = attrs.mime || '';
    if (attrs.aspect && (!attrs.mime || ~attrs.mime.indexOf('image')))
      attrs.mime = 'image/*';

    var multiple = attrs.multiple !== 'false' ? 'multiple' : '';

    var root = ['<div class="', classes.join(' '), '">'];
    var cRoot = ['</div>'];
    var title = attrs.title ?
      ['<div class="file-title">', attrs.title, '</div>'] :
      [];
    var input = ['<div><span>'];
    if (attrs.drop !== 'false')
      input.push(['<file-drop',
        'area="' + attrs.drop + '"',
        'accept="' + attrs.mime + '"',
        multiple,
        '></file-drop>'].join(' '));
    if (attrs.logo)
      input.push('<img class="file-logo" src="' + attrs.logo + '">');
    if (attrs.dialogue !== 'false')
      input.push(['<file-input',
        'accept="' + attrs.mime + '"',
        multiple,
        '></file-input>'].join(' '));
    /* TODO: if (attrs.integrations)
      input.push('<file-integrations include="' + attrs.integrations + '">'); */
    input.push('</span></div>');
    var progress = attrs.hasOwnProperty(progress) ?
      ['<file-progress progress="progress"></file-progress>'] :
      [];

    return [root, title, input, cRoot].map(function(el) {
      return el.join('');
    }).join('');
  }
  function controller($rootScope, $scope, $window) {
    var that = this;
    var el;

    // Associate to element
    this.link = function(element) {
      el = element;
    };

    // Expose $window to element
    this.window = $window;

    // Set up dialogue/drop
    this.select = function(e, files) { process(e, files); };

    // Set up modality
    this.close = function() { el.remove(); };
    var deregister = {};
    deregister.cancel   = $rootScope.$on('file:picker:canceled', close);
    deregister.complete = $rootScope.$on('file:reader:complete', close);

    function process(e, fileList) {
      e.stopPropagation(); e.preventDefault();
      var files = [];

      Array.prototype.forEach.call(fileList, function(file) {
        files.push(file);
      });

      $scope.progress = reader.load(files);
      return true;
    }

    function close() {
      that.close();
      deregister.cancel();
      deregister.complete();
    }
  }
  function link(scope, el, attrs, ctrl) { ctrl.link(el); }
};
filePickerDirective.$inject = [reader];

angular.module('file')
  .directive('filePicker', filePickerDirective)
;
