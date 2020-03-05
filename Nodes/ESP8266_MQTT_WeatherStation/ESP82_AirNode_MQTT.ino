#include<ESP8266WiFi.h>
#include <PubSubClient.h>
#include<DHT.h>
#include<WiFiClient.h>
#include<ArduinoJson.h>
#include<Adafruit_Sensor.h>
#include<Adafruit_ADS1015.h>
#include<time.h>
//=====================
//     PINS
#define dhtPin D3 //5v
#define dhtType DHT11 
#define valvePin D5 //motorPin  5//5v
//=====================

//===========================
//      MQTT stuff

//===========================
int nodeId =1;//CHANGE THIS FOR EACH NODE!
//===========================

const char* ssid = "WIFI_NAME";
const char* passw =  "WIFI_PASSWORD";
const char* mqtt_server = "MQTT_IP";

char* topicOut="nodePlant/air";
char* topicIn="nodePlant/commands";
long lastMsg = 0;
WiFiClient espClient;
PubSubClient client(espClient);
//===========================

String jsonData;
int idIn,opValve,sleep = 0;
const int capacity = JSON_OBJECT_SIZE(4);
StaticJsonDocument<capacity> jb;
StaticJsonDocument<200> root;

//============================
//    Sensor stuff
Adafruit_ADS1115 exAnalog;
DHT dht(dhtPin,dhtType);
int rainGuage=0;
float humid=0;
float temp =0;
//int isFood=0;
int16_t adc0,adc1,adc2,adc3;
int airQual,exLight,exBat;

//===========================


void setup() {

  dht.begin();//start up the DHT
  exAnalog.setGain(GAIN_ONE);// 1x gain  DO NOT EXCEED: +/- 4.096V  1 bit = 0.125mV
  
  //start reading from ADC
  exAnalog.begin();
  
  //set up pin 5 to open valve
  pinMode(valvePin,OUTPUT);
  digitalWrite(valvePin,LOW);//make sure valve is closed...
  Serial.begin(115200);
  
  //===========================
  // CHANGE TO AP_STA for mesh network
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid,passw);
  //===========================

  // connect to wifi
  while (WiFi.status() != WL_CONNECTED) 
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.print("Connected to: ");
  Serial.println(ssid);
  Serial.println(WiFi.localIP());
  //set up MQTT
  client.setServer(mqtt_server, 1883);//default port, change it...
  client.setCallback(callback);
  
  configTime(0, 0,"pool.ntp.org");//connect to time server
  setenv("TZ","CST6CDT,M3.2.0,M11.1.0" ,0);//CENTRAL STANDARD (USA)

  while(!time(nullptr))
  {
    Serial.print(">");
    delay(100);   
  }
}

void loop() {


  time_t RTnow = time(nullptr);
  //Serial.println(String(ctime(&RTnow)));
  
  
  struct tm* p_tm = localtime(&RTnow);
  int hour =p_tm->tm_hour;
  int minute=p_tm->tm_min;
  int year = p_tm->tm_year;//years since 1900
  year = year +1900;
  
  if(year != 1970)
  {

  
  Serial.print(hour);
  Serial.print(" : "); 
  Serial.print(minute);
  Serial.println("\n");
  char* currentTime = ctime(&RTnow);
  

  
 /* if(hour >= 20 || hour < 7)
  {
    //sleep for 3 hours or so
   // sleepTime();  
  }
*/

//always check sensors before sending any data
checkSensors();
jsonData=makeJson(currentTime);

  if (!client.connected())
  {
    reconnect();
  }
  client.loop();
  
  //add a timer here, no need to flood the network every few miliseconds
  long now = millis();
  if (now - lastMsg > 2000)
  {
    lastMsg = now;
    Serial.println(jsonData.c_str());
    client.publish(topicOut, jsonData.c_str() );//dataOut);
    
    if(hour > 20)
    {
       delay(1000);
       sleepTime(); 
    }//end check for sleep
    else if (hour < 8)
    {
      delay(1000);
      sleepTime(); 
    }
    
    delay(1000);
  }//end send MQTT message
 }//end year check

}//end Loop

void callback(char* topic, byte* payload, unsigned int length) {
  char input[length];
//===========================
  //ADD JSON PROCESSING HERE 
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++) 
  {
      input[i]=(char)payload[i];
  }
    /* EXAMPLE WORKING INPUT
     "{"id":1,"sleep":1,"open":0}"
    */
       JsonObject obj;
       deserializeJson(jb,input);
       //= jb.parseObject(input);
       int idIn = obj["id"];
       int opValve = obj["open"];
       int goSleep = obj["sleep"];

      //using the memory for 4 objects, can add another if needed
       
       jb.clear();//clear memory
    
       if(idIn == nodeId)
       {
        //message is for me
        
        if(goSleep == 1)
        {
          sleepTime();
        }
       }
}

void sleepTime()
{
      ESP.deepSleep(90000e9); //set for 10 seconds, lets make it 2.5hours after testing  
      //it will restart automatically after the timer is up
      //45 minutes: 2.7E+09
      //2.5 hours: 9.0000E+9
}



float readADC(int adPin)
{
  int accuracy =10;
  
  float dataArr[accuracy];
  float avgOut=0;
  for(int i=0;i<accuracy;i++)
  {
   dataArr[i] =exAnalog.readADC_SingleEnded(adPin);
   avgOut = avgOut+ dataArr[i];
   delay(100);  
  }  
  avgOut = avgOut /accuracy;
  return avgOut;
}

void checkSensors()
{
//GET ANALOG/DIGITAL INPUT, and do some conversions (need tuning)
  temp=dht.readTemperature();
  humid=dht.readHumidity();

  temp = temp * 1.8 + 32;//to Farenheight (USA)
  
//Co2 PPM calc thanks to  www.youtube.com/c/learnelectronics

float co2Raw=0;
float co2Norm=0;
float co2ppm=0;

//average themm out
co2Raw = readADC(1);

co2Norm = co2Raw-55;//co2Zero (NEEDS CALIBRATION)
//Serial.println(co2Raw);

co2ppm=map(co2Norm,0,26000/*MAX ADC*/,400,5000);//max atmospheric levels

  adc0=readADC(0);//exAnalog.readADC_SingleEnded(0);//light
  adc2=readADC(2);//exAnalog.readADC_SingleEnded(2);//RAIN (soil, whatever)
  adc3=readADC(3);//exAnalog.readADC_SingleEnded(3);//voltage divider (battery power)
  
if(isnan(temp) || isnan(humid))
{
  temp=404;
  humid=404; 
}
/*
  Serial.println("temp");
  Serial.print(temp);
  Serial.println("\nHumid:");
  Serial.print(humid);
  Serial.println("\nWater:");
*/
  airQual=co2ppm;
  exLight= map(adc0,26000,1000,0,1000);// fix this for more accuracy
  
  rainGuage=map(adc2,26300,11300,0,1000);//,1024,350,0,100);//values for 10bit accuracy
  exBat= map(adc3,4000,21700,0,1000);
  //Serial.print("ADC1:");Serial.println(adc1);
 //Serial.print("ADC2:");Serial.println(adc2);

/*
  Serial.println("\n\n");
   Serial.print("ADC1:");Serial.println(adc1);
  Serial.print("HYDRO 1:");
  Serial.print(airQual);
  Serial.print("\n");
  
  Serial.print("LIGHT:");
  Serial.print(exLight);
  Serial.print("\n");
  
  Serial.print("BATT:");
  Serial.print(exBat);
  Serial.print("\n");
  //3600 is 0 volts applied
  //21700 is 100%
  
  //Serial.print(rainGuage);
  //Serial.print("\n");
  */
  delay(50);
 }

String makeJson(char* cTime)
{
  String buff;
 
   root["Id"]=nodeId;
   root["temp"]=temp;
   root["humidity"]=humid;
   root["airQuality"]=airQual;
   root["lightLevel"]=exLight;
   root["rainGuage"]=rainGuage;
   root["batteryLevel"]=exBat;
   root["timeStamp"]=cTime;
  
   /* EX output
    * {"Id":49,
    * "temp":404,
    * "humidity":404,
    * "soilWater":1753,
    * "lightLevel":1040,
    * "batteryLevel":-226}
    */
   serializeJson(root,buff);
   //jBuffer.clear();// no need for copies....
   return buff;  
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    
    String clientId = ": "+nodeId;    
    // Attempt to connect
    if (client.connect(clientId.c_str())) 
    {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish(topicOut, "hello");
      // ... and resubscribe
      client.subscribe(topicIn);
    } 
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
