const path = require('path');
var Trianglify = require('trianglify');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'assets');

var large = -1

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        var test = parseInt(file.substr(7,file.indexOf(".")-7))
        if (test > large) {
            large = test
        }
    });
    generate()
});


function generate() {
    console.log("Starting from: ",large)
    for (var i = 0; i < 5; i++) {
        var pngURI = Trianglify({
            width: 3840,
            height: 2160,
            cell_size: Math.random()*200 + 20 + i*2,
            x_colors: 'random',
            y_colors: (Math.random() > 0.75) ? "random" : "match_x",
            variance: Math.random(),
        }).png();
        
        var data = pngURI.substr(pngURI.indexOf('base64') + 7);
        var buffer = new Buffer.from(data, 'base64');
        var name = "lowpoly"+(large+1+i)
        fs.writeFileSync(directoryPath+"/"+name+".png", buffer);
    }
}