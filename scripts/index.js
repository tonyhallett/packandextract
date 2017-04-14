var fs = require('file-system');
var del = require('delete')
var npm = require('./npm');
var gunzip = require('gunzip-maybe')
var tar = require('tar-stream')
let path = require('path');

var noFilter = () => true;

module.exports =function packAndExtract(packArg, relativeDirectory, filter, deleteGzippedTarball) {
    if (!filter) {
        filter = noFilter;
    }
    if (deleteGzippedTarball == null) {
        deleteGzippedTarball = true;
    }
    npm.pack(packArg, (err, file) => {
        if (err) {
            console.log(err.message);
        } else {
            var extract = tar.extract()
            extract.on('entry', function (header, stream, next) {
                // call next when you are done with this entry
                var filePath = header.name.substring(8);
                if (filter(filePath)) {
                    var writePath = relativeDirectory + filePath;
                    var dirPath = path.dirname(writePath);
                    if (!fs.existsSync(dirPath)) {
                        fs.mkdirSync(dirPath);
                    }
                    var writeStream = fs.createWriteStream(writePath, { flags: 'w' });
                    writeStream.on('error', (error) => {
                        console.log(error);
                        next();
                    });
                    writeStream.on('open', () => {
                        stream.pipe(writeStream);
                        stream.resume();
                    });
                    stream.on('end', function () {
                        next() // ready for next entry
                    })

                } else {
                    next();
                }
            })

            extract.on('finish', function () {
                // all entries read
                if (deleteGzippedTarball) {
                    del(file, function (err) {
                        if (err) {
                            console.log("error deleting the pack");
                        }
                    })
                }

            })
            var gzippedTarballStream = fs.createReadStream(file);
            gzippedTarballStream.on('open', () => {
                gzippedTarballStream.pipe(gunzip()).pipe(extract);
            })
        }
    });
}


