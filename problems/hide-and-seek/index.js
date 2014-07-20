var fs = require('fs');
var path = require('path');

var solutionFile = path.join(__dirname, 'dir/baz/zzz/hidden.txt');

exports.problem = fs.readFileSync(__dirname + '/problem.txt', 'utf8')
    .replace(/\$DIR/g, solutionFile)
;
exports.solution = fs.createReadStream(__dirname + '/solution.txt');

exports.verify = function (args, cb) {
    var files = {};
    if (args.length === 0) {
        console.error('Pass in the hidden.txt file as an argument.');
        return cb(false);
    }
    
    fs.readFile(solutionFile, 'utf8', function (err, src) {
        if (err) {
            console.error(err + '');
            return cb(false);
        }
        files.solution = src;
        done();
    });
    fs.readFile(args[0], 'utf8', function (err, src) {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error('File not found: ' + args[0] + '\n');
                console.error('Make sure to navigate to a directory'
                    + ' where that file exists!\n'
                );
            }
            else console.error(err + '');
            return cb(false);
        }
        files.input = src;
        done();
    });
    var pending = 2;
    function done () {
        if (--pending !== 0) return;
        if (files.solution === files.input) {
            cb(true);
        }
        else {
            console.error("That file isn't the same as the solution file.");
            cb(false);
        }
    }
};
