//adapted from
//https://github.com/eh3rrera/rethinkdb-example/blob/master/models/movies.js


var db = module.exports;// use this to call db functions from elsewhere

var r = require('rethinkdb');
var connection = null;

/* 
 * 1 Database: pc_farmDB
 * 4 tables, Air / Ground / historical / wateringHistory
 */
var dbName = "pc_farmDB";
var tName ="ERROR_ON_WRONG_TABLE";
var query=null;
var hostOptions={host:'localhost',port: 28015};

//==================================================
// DB input
// 	throw a json object data into the table
function insert_DB( tableName, data )
{
	tName=tableName;	

r.connect( hostOptions, function(err, conn) {
        if (err) throw err;
        connection = conn;
	
	//insert the data
	r.table(tName).insert([data]).run(connection,function(err,res){
		if(err) throw err;
		console.log("INSERT SUCCESS");
	});
connection.close(function(err) { if (err) throw err; })
 
 )};
}

//==================================================
// DB output all
//   return all  JSON objects on request
function getAllData_DB( tableName)
{
	var output=null;

r.connect( hostOptions, function(err, conn) {
        if (err) throw err;
        connection = conn;

        r.table(tableName).run(connection,function(err,res){
                if(err) throw err;
		res.toArray(function(err,out){
 			  if (err) throw err;
			  output=out;
			});
        });
connection.close(function(err) { if (err) throw err; })
 )};
  return output;
}
//==================================================
// DB output query
//   return JSON objects from row on equal
//   SELECT * FROM TABLE WHERE COND ==TRUE

function queryData(tableName, rw, eql)
{
var output = null;
	
r.connect( hostOptions, function(err, conn) {
        if (err) throw err;
        connection = conn;

        r.table(tableName).filter(r.row(rw).eq(eql)).run(connection,function(err,res){
                if(err) throw err;
                res.toArray(function(err,out){
                          if (err) throw err;
                          output=out;
                        });
	});
connection.close(function(err) { if (err) throw err; })
 )};

return output;
}


//==================================================
// DB output query
//   return JSON objects from row on equal
//SELECT data1,data2 FROM table
//
function getFields(tableName,data1  ){


 
return ouput
}
