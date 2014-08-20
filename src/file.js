angular.module('file', []);

var picker            = 'file:picker',
    reader            = 'file:reader',
    dragger           = 'file:dragger',
    internals         = [picker, reader, dragger],
    internalsProvider = internals.map(function(service) { return service + 'Provider'; });
