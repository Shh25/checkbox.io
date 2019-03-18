var esprima =  require("esprima");
var options = {tokens:true, tolerant: true, loc: true, range: true };
var fs = require("fs");
var path = require( "path" );

function main(fileNameArr)
{
	
	var filePath = fileNameArr;
	complexity(filePath);

	// Report
	for( var node in builders )
	{
		var builder = builders[node];
		builder.report();
	}

}

 var builders = {};
 var MaxFunctionLength = 0;

 function FunctionBuilder()
{
	this.StartLine = 0;
	this.FunctionName = "";
	// The number of parameters for functions
	this.ParameterCount  = 0,
	// Number of if statements/loops + 1
	this.SimpleCyclomaticComplexity = 0;
	// The max depth of scopes (nested ifs, loops, etc)
	this.MaxNestingDepth    = 0;
	// The max number of conditions if one decision statement.
	this.NumConditions = 0;
	this.MaxConditions  = 0;
    this.FunctionLength = 0;

	this.report = function()
	{
		console.log(
		   (
		   	"{0}(): {1}\n" +
		   	"============\n" +
			   "SimpleCyclomaticComplexity: {2}\t" +
				"MaxConditions: {3}\t" +
                "Parameters: {4}\n\n"+
                "FunctionLength: {5}"
			)
			.format(this.FunctionName, this.StartLine,
				     this.SimpleCyclomaticComplexity, this.MaxConditions, this.ParameterCount, this.FunctionLength)
		);
	}
};

// A builder for storing file level information.
function FileBuilder()
{
	this.FileName = "";
	// Number of strings in a file.
	this.Strings = 0;
	// Number of imports in a file.
	this.ImportCount = 0;
	this.MaxFunctionLength = 0;
	this.MaxLineLength = 0;

	this.report = function()
	{
		console.log (
			( "{0}\n" +
			  "~~~~~~~~~~~~\n"+
			  "ImportCount {1}\t" +
			  "MaxFunctionLength {2}\n"
			).format( this.FileName, this.ImportCount, this.MaxFunctionLength));
	}
}

function traverseWithParents(object, visitor)
{
    var key, child;

    visitor.call(null, object); 

    for (key in object) {
        if (object.hasOwnProperty(key)) {
            child = object[key];
            //console.log(`child is : ${child}`)
            if (typeof child === 'object' && child !== null && key != 'parent') 
            {
            	child.parent = object;
					traverseWithParents(child, visitor);
            }
        }
    }
}

function getMaxCondition(child, isIfStatement) {
	// console.log('in')
	res = 0;
    if(child == null){
		console.log(`returning child null`);
		res = 0;
    } else if( child.type == 'IfStatement' || child.type == 'ForStatement' || child.type == 'WhileStatement' ||
	child.type == 'ForInStatement' || child.type == 'DoWhileStatement') {
		if(child.type == 'IfStatement') {
			isIfStatement = true;
		}
		if(child.test) {
			res += getMaxCondition(child.test, isIfStatement);
		}
		if(child.consequent) {
			res += getMaxCondition(child.consequent, isIfStatement);
		}
		if(child.body){
			for(var i = 0; i < child.body.length; i++) {
				if(child.body[i].type === 'IfStatement') {
					res += getMaxCondition(child.body[i], isIfStatement);
				}
			}
		}
	} else if(isIfStatement && child.type=="LogicalExpression"){
		res += getMaxCondition(child.left, isIfStatement) + getMaxCondition(child.right, isIfStatement);
	} else if(isIfStatement && (child.type=="BinaryExpression" || child.type=='UnaryExpression')){
		res += 1;
	}
	return res;
}


function complexity(filePath)
{
	var buf = fs.readFileSync(filePath, "utf8");
	var ast = esprima.parse(buf, options);

	var i = 0;

	// A file level-builder:
	var fileBuilder = new FileBuilder();
	fileBuilder.FileName = filePath;
    fileBuilder.ImportCount = 0;
    fileBuilder.MaxFunctionLength = 0;
	fileBuilder.MaxLineLength = 0;

	builders[filePath] = fileBuilder;

	// Tranverse program with a function visitor.
	traverseWithParents(ast, function (node) 
	{
		if (node.type === 'FunctionDeclaration' || node.type == 'FunctionExpression') 
		{
            var builder = new FunctionBuilder();
			//count of function length
            builder.FunctionLength = 0;
            builder.FunctionName = functionName(node);
			builder.StartLine    = node.loc.start.line;
			//count of parameters
			builder.ParameterCount = node.params.length;
            builder.MaxConditions = 0;
			builder.NumConditions = 0;

            //method length to calculate long method
			builder.FunctionLength = node.loc.end.line - node.loc.start.line + 1;
			
			if(builder.FunctionLength > 100){
				console.log(`Long method! ${builder.FunctionName}`);
			}
			//New code, we can also check isIfCondition() if truee, then wil calculate for other loops like while also
			traverseWithParents(node, function(child)
			{
				if( child.type == 'IfStatement' || child.type == 'ForStatement' || child.type == 'WhileStatement' ||
				child.type == 'ForInStatement' || child.type == 'DoWhileStatement')
				{
                    builder.SimpleCyclomaticComplexity++;
					builder.NumConditions += getMaxCondition(child);

				}
				if(builder.NumConditions > builder.MaxConditions){
					builder.MaxConditions = builder.NumConditions;
				}
			});

		builder.SimpleCyclomaticComplexity++;
        
        if(builder.FunctionLength > fileBuilder.MaxFunctionLength)
		fileBuilder.MaxFunctionLength = builder.FunctionLength;
       		builders[builder.FunctionName] = builder;
        }
        
		//new code String count
		if(node.type=="Literal" && typeof(node.value)=='string'){

			//console.log("Count of strings: ");
			fileBuilder.Strings++;
		}
		
	});
}

// // Helper function for checking if a node is a "decision type node"
// function isIfCondition(node)
// {
// 	if( node.type == 'IfStatement')
// 	{
// 		return true;
// 	}
// 	return false;
// }

// Helper function for printing out function name.
function functionName( node )
{
	if( node.id )
	{
		return node.id.name;
	}
	return "anon function @" + node.loc.start.line;
}


// Helper function for allowing parameterized formatting of strings.
if (!String.prototype.format) {
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
          ? args[number]
          : match
        ;
      });
    };
  }

module.exports = {main:main};