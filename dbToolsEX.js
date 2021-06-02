var dbTools = module.exports;
var r = require('rethinkdb');
//var conf = require('../config');
//


/* 
 * 1 Database: pc_farmDB
 * 2 tables, Air / Ground
 */
var dbName = "pc_farmDB";
var AIR_TABLE="Air";
var GND_TABLE = "Ground"

//var hostOptions={host:'localhost',port: 28015};
//module.exports =
	
var config= {
  database: {
   	 db: process.env.RDB_DB || "pc_farmDB",
    	 host: process.env.RDB_HOST || "localhost",
    	 port: process.env.RDB_PORT || 28015
    	    },

  	 port: process.env.APP_PORT || 3000
	}

dbTools.setupAir= function(callback)
	{
	  console.log("connecting to DB (Air table) ");
	  
	  r.connect(config.database).then(function(conn){
	  	
	  r.dbCreate(config.database.db).run(conn).then(function(result){
	  	console.log("DB CREATED!, what?");
	  	  }).error(function(error){console.log("DB already there, phew..");
		
		}).finally(function(){
			//is table there?
	r.table(AIR_TABLE).limit(1).run(conn,function(error,cursor){
			var promise;
			if(error) 
			  {
			    console.log("table no there, i make it now")
			    promise = r.tableCreate(AIR_TABLE).run(conn);
			  }
			else
			  {
			    promise = cursor.toArray();
		 	  }
			//table is there, lest setup the update listener
			promise.then(function(result){
				console.log("setting update listener");
	r.table(AIR_TABLE).changes().run(conn).then(function(cursor){
		cursor.each(function(error,row){
					callback(row);
				});
				});
			}).error(function(error){throw error;});	
		});
	  
	    });
	  }).error(function(error){throw error;});

	}//end setup (for air)

dbTools.getAirData = function(callback){
  r.connect(config.database).then(function(conn){
	 r.table(AIR_TABLE).run(conn).then(function(cursor){
		 cursor.toArray(function(error,res){
		 	if (error) throw error;
			callback(res);
		 });
	 }).error(function(error){throw error;});
  	}).error(function(error){throw error;})
}//end getAirData

dbTools.getGroundData = function(callback){
  r.connect(config.database).then(function(conn){
         r.table(GND_TABLE).run(conn).then(function(cursor){
                 cursor.toArray(function(error,res){
                        if (error) throw error;
                        callback(res);
                 });
         }).error(function(error){throw error;});
        }).error(function(error){throw error;})
}//end getGroundData


dbTools.saveAirData = function(data, callback){
  r.connect(config.database).then(function(conn){
	  r.table(AIR_TABLE).insert(data).run(conn).then(function(results){
		  callback(true,results);
	  }).error(function(error){callback(false,error);});
  }).error(function(error){callback(false,error);});
}//end saveAirData


dbTools.saveGroundData = function(data, callback){
  r.connect(config.database).then(function(conn){
          r.table(GND_TABLE).insert(data).run(conn).then(function(results){
                  callback(true,results);
          }).error(function(error){callback(false,error);});
  }).error(function(error){callback(false,error);});
}//end saveGroundData





