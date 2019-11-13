const express = require('express')
const routes = express.Router();

const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, '../assets');

let allFiles = checkFiles()

routes.get('/randomBG', async (req, res) => {
    res.send({ok:true,amount:allFiles.length})
})

function checkFiles() {
    let array = []
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            array.push(file)
        });
    });   
    return array
}

fs.watch("assets", (eventType, filename) => {
    console.log("Regenerated assets")
    allFiles = checkFiles()
  });


module.exports = routes;