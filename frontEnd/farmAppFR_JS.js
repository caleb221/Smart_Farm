    
var head = document.querySelector("#topic");
var plots = document.querySelector("#plot");
var weatherDiv = document.querySelector("#weatherAPI");
var weatherData;    
    
    function getWeather(index)
    {

       head.innerHTML="Local Weather";
       plots.style.display="none"; 
       weatherDiv.style.display="block";
       var box = document.querySelector("#descBox"); 
       var weatherPic = document.querySelector("#weatherPic");
       //https://openweathermap.org/current
        
       // pics http://openweathermap.org/img/wn/10d@2x.png
       // http://openweathermap.org/img/wn/ICON.png
        
        var key = "b3bb7c65adf507ea0df9cff43281b380";
        var iconUrl="http://openweathermap.org/img/wn/";//.png"
        var cityID=["4672171","4704940","4675373","4726206","4674023"]; 
        
        var forcWeather ="weather";
        //var 5day=false;
        
       // if(5day == true)
        //    var forcWeather ="forecast";
        
        var currentReq = "https://api.openweathermap.org/data/2.5/"+forcWeather+"?id="+cityID[index]+"&units=imperial&appid="+key;
     
        //api.openweathermap.org/data/2.5/forecast?q=London,us&mode=xml
        
        var data1=getAPIData(currentReq);
        data1.then(data => setData(data));
        var ico = weatherData.weather[0].icon;
        var KtoF=weatherData.main.temp;
        var hiT=weatherData.main.temp_max;
        var lowT=weatherData.main.temp_min;
        var humidLev=weatherData.main.humidity;
        var windSpeed=weatherData.wind.speed;
        
        weatherPic.src=iconUrl+ico+".png";
        box.innerHTML= "<p id = \"cityName\">\"City: "+weatherData.name+"</p>"+
            "<p id=\"descript\">"+weatherData.weather[0].description+"</p>"+
            "<p id=\"tempOut\">Temperature: "+KtoF.toFixed(0)+"<br>"+
            lowT.toFixed(0)+"  - "+hiT.toFixed(0)+"</p>"+
            "<p id=\"humidOut\">Humidity: "+humidLev+"%</p>"+                
            "<p id=\"wind\">Wind: "+windSpeed+"</p>";   
    }
    
    function setData(input)
    {
        weatherData=input;
    }
    
    async function getAPIData(req)
    {   
        //https://openweathermap.org/current
       //console.log(req);
       let response = await fetch(req);
       let  data =  await response.json();
       return data;
    }
/*    
    var trace1 = {
  x: [1, 2, 3, 4],
  y: [10, 15, 13, 17],
  type: 'scatter'
};

///var trace2 = {
//  x: [1, 2, 3, 4],
//  y: [16, 5, 11, 9],
//  type: 'scatter'
//};

var data = [trace1];

Plotly.newPlot('plot', data);
*/