var n = require("./analysis");

var admin = "/Users/prayanisingh/Documents/DevOpsProj/CheckBox/checkbox.io/server-side/site/routes/admin.js";
var create = "/Users/prayanisingh/Documents/DevOpsProj/CheckBox/checkbox.io/server-side/site/routes/create.js"

var fileNameArr = [admin,create];
console.log(`shds ${fileNameArr[0]}`)
function callAnalysis()
{
    var i;
    console.log(`shds ${fileNameArr[0]}`)
    for(var i =0; i<fileNameArr.length; i++){
        console.log(`fileNameArr[i] ${fileNameArr[i]}`);
        n.main(fileNameArr[i]);
        
    }
}
callAnalysis();
console.log(`Going to next file: `);