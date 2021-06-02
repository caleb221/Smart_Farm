var mqtt = require('mqtt');
var serverUrl= "mqtt://10.0.0.9";

var airTopic = "nodePlant/air";// air node (sub only)
var soilTopic="nodePlant/soil";// soil node (sub)
//var mCtrlTopic="nodePlant/motor";//topic for controlling motor

var client=mqtt.connect(serverUrl, {clientID:"myPi"});
var airMsg="";
var soilMsg="";
	
client.on("connect",function(){		
	client.subscribe(airTopic,function(err){
		if (err) throw err;
	});
	
	client.subscribe(soilTopic,function(err){
		if(err) throw err;
	});
	
});

client.on("message",function(airTopic,message){
	//console.log(message);
	airMsg = message;
});

client.on("message",function(soilTopic,message){
	soilMsg=message;
});

//export variables
module.exports={
  
  /*
  sendCommad: function (var command)
  { 
      client.publish(mCtrlTopic,command);
      client.end();
  }

  getSoilData: function()
  {
    return soilMsg;
  }

  getAirData: function()
  {
    return airMsg;
  }
  
  */
   
};

client.on("error",function(err){
        throw err;
	process.exit(1);
});





