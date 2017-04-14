# packandextract
npm pack and then extract chosen files to directory, creating where necessary

var packandextract=require('packandextract');

packAndExtract(packArg, relativeDirectory,callback, filter, deleteGzippedTarball)

filter defaults to no filtering, deleteGzippedTarball defaults to true.
