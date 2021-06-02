var dbTool = require('../models/dbTools');

var updateData = function(req,res,action){
	
var dataID = {id:req.params.id};
dbTools.updateData(dataID,action,function(sucess,res){
	if(success) res.json({status:'OK'});
	else res.json({status:'Error'});
	});
}//end updateData



module.exports = function(app){
	app.get('/', function(req,res){
		res.render('index',{movies:result});
	});

	app.post('/Mpath',function(req,res){
		var data = {
			title:req.body.title,
			likes:0,
			unlikes:0
		};

		dbTools.saveAirData(movie,function(success,result)
		{
		  if(sucess) res.json({status:'OK'});
		  else res.json ({status:'Error'});

		});
	});

	app.put('/data/folder/:id',function(req,res){
	 updateData(req,res,'field');
	});


	app.put('/data/folder1/:id',function(req,res){
		updateData(req,res,'field');
	});
	//put all data to application here
	//

};


