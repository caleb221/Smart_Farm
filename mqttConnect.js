var mqtt = require('mqtt');

//var myServer = "mqtt://10.0.0.8"
var client = mqtt.connect("mqtt://10.0.0.9",{clientID:"MyID"});


var topic="test/esp"

client.on("connect",function(){

client.subscribe(topic,function(err){
	if(!err)
	{
	  console.log("connected!");
	 // client.publish(topic+"/out","1");
	}
	else
	{
	  console.log("error: "+err);
	}
	
	})
})

client.on("message",function(topic,message){
        console.log(message.toString())
        //add JSON processing here, also send to database
        //client.end()
})

//incase any random error occurs
client.on("error",function(error){
console.log("connection err: "+error);
process.exit(1);
});

