const notemap = require("../notemap");
const {promisify} = require('util')
const render = promisify(require("ejs").renderFile);
const fs = require("fs");

const templateFile = "notemap.ejs";
const data = notemap.make(JSON.parse(fs.readFileSync("../mapdb/11009501.json")));

render(templateFile, data, {rmWhitespace: true}).then(res => {
    fs.writeFileSync("test.html",
        '<meta charset="utf-8">' +
        '<link type="text/css" rel="stylesheet" href="../vendor/materialize.min.css" media="screen,projection"/>' +
        '<link type="text/css" rel="stylesheet" href="../css/style.css" media="screen,projection"/>' +
        '<link type="text/css" rel="stylesheet" href="../css/songdb.css" media="screen,projection"/>' + res);
}).catch(e => {
    console.log(e.message);
    console.log(e.stack);
});