var n = require("./analysis");

var admin = "/Users/prayanisingh/Documents/DevOpsProj/CheckBox/checkbox.io/server-side/site/routes/admin.js";
var create = "/Users/prayanisingh/Documents/DevOpsProj/CheckBox/checkbox.io/server-side/site/routes/create.js"
var csv = "/Users/prayanisingh/Documents/DevOpsProj/CheckBox/checkbox.io/server-side/site/routes/csv.js";
var designer = "/Users/prayanisingh/Documents/DevOpsProj/CheckBox/checkbox.io/server-side/site/routes/designer.js";
var live = "/Users/prayanisingh/Documents/DevOpsProj/CheckBox/checkbox.io/server-side/site/routes/live.js";
var study = "/Users/prayanisingh/Documents/DevOpsProj/CheckBox/checkbox.io/server-side/site/routes/study.js";
var studyModel = "/Users/prayanisingh/Documents/DevOpsProj/CheckBox/checkbox.io/server-side/site/routes/studyModel.js";
var upload = "/Users/prayanisingh/Documents/DevOpsProj/CheckBox/checkbox.io/server-side/site/routes/upload.js";
var fileNameArr = [admin,create,csv,designer,live,study,studyModel,upload];

function callAnalysis()
{
    var i;
    for(var i =0; i<fileNameArr.length; i++){
        n.main(fileNameArr[i]);
        
    }
}
callAnalysis();