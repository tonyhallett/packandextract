# packandextract
npm pack and then extract chosen files to directory, creating where necessary

var packandextract=require('packandextract');

packAndExtract(packArg, relativeDirectory, filter, deleteGzippedTarball)

packAndExtract(packArg, relativeDirectory); //will extract all and delete
packAndExtract(packArg, relativeDirectory,filter); //will extract filtered and delete
