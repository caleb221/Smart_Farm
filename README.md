# Smart_Farm
This is a smart farming implementation I made for a small scale farm in Texas

# IN PROGRESS..
  This project is in progress, please wait for more updates as they become available
# System Overview
<img src ="https://github.com/caleb221/Smart_Farm/blob/master/img/pcc_smartFarm.png" height="350" width="450">
The system is implemented using a server, database, various data loggers, and water control through multiple communication methods. 

# Hardware
  The hardware is seperated into nodes, each containing their own implementation and schematics.
  
  
  A Raspberry Pi 0w is used for the database and server<br>
  
  A Heltec ESP32-LoRa controls the LoRaWan Gateway<br>
  
  The NodeMCU ESP8266 handles the Air quality and weather status node.<br>
  
  An Arduino Nano with an AI-Thinker RA-02 (SX1278 433Mhz communication module) is used for field soil monitoring, and automated irrigation as well as handling its own solar module implementation.<br>
  
  A Router is used to handle MQTT messaging as well as clients.<br>
  
 # Stack
 
 
 Server:
 
    Node.js
    mqtt
    express
    sockets.io
    ejs
    jquery
    
 Database:
 
    RethinkDB
 
 Communication layer:
    
    MQTT (802.11)
    LoRa (433Mhz)

# Images
# Farm progression
 A ~.02 acre plot of land with a fence was prepared by first cutting down any vegetation, tilling, and creating rows for the crop. 
<br> A Drip irrigation system was added so the system can water only where necessary, conserving water and energy.
<br> A Corn seedling can be seen emerging from the soil with its respective dripper

  <img src = "https://github.com/caleb221/Smart_Farm/blob/master/img/breakGnd.jpg" 
    height = "220" width = "250">
    <img src = "https://github.com/caleb221/Smart_Farm/blob/master/img/rows1.jpg"
     height = "220" width = "250">
     
   <img src = "https://github.com/caleb221/Smart_Farm/blob/master/img/irrigationHalf.jpg"
   height = "220" width = "250"> 
      <img src = "https://github.com/caleb221/Smart_Farm/blob/master/img/bbCorn1.jpg" 
      height = "220" width = "250">




# Schematics

<img src ="https://github.com/caleb221/Smart_Farm/blob/master/img/Schematic_arduinoSolarController1_Sheet_1_20200305051545.png" height="350" width="450">


<img src ="https://github.com/caleb221/Smart_Farm/blob/master/img/Schematic_NodeAirSensor_Sheet_1_20200219034421.png" height="350" width="450">

<img src = "https://github.com/caleb221/Smart_Farm/blob/master/img/PCB_design.png" 
  height = "220" width = "250">
  <img src = "https://github.com/caleb221/Smart_Farm/blob/master/img/pcbReal1.jpg" 
  height = "220" width = "250">


# References

https://www.pluralsight.com/guides/a-practical-introduction-to-rethinkdb


http://www.bristolwatch.com/solar1.htm


http://www.martyncurrey.com/controlling-a-solenoid-valve-from-an-arduino/

