var n = require("./analysis");

var admin = "routes/admin.js";
var create = "routes/create.js"
var csv = "routes/csv.js";
var designer = "routes/designer.js";
var live = "routes/live.js";
var study = "routes/study.js";
var studyModel = "routes/studyModel.js";
var upload = "routes/upload.js";

var fileNameArr = [admin,create,csv,designer,live,study,studyModel,upload];

function callAnalysis()
{
    var i;
    for(var i =0; i<fileNameArr.length; i++){
        n.main(fileNameArr[i]);
        
    }
}
callAnalysis();