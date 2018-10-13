function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Weather Forecast")
    .addItem("Update", "weatherForecast")
    .addToUi();
}

function weatherForecast(){
  var NOTATIONS = {
    CITY: "B1",
    WEATHER: "B2",
    TEMP: "B3",
    TEMP_MIN: "B4",
    TEMP_MAX: "B5",
    HUMI: "B6"
  };
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName("Weather");
  var apiKey = "c9e1e7816ecc0e8eaeda584109d342bf"; // Or you can try my key
  
  var cityName = sheet.getRange(NOTATIONS.CITY).getValue();
  var apiCall = "api.openweathermap.org/data/2.5/forecast/daily?q=" + cityName +"&units=metric&cnt=1&appid=" + apiKey;
  
  var response = UrlFetchApp.fetch(apiCall);
  var data = JSON.parse(response.getContentText());
  
  if (data.cod === "404") { // City not found
    return;
  }
  
  var today = data["list"][0];
  
  var weather = today["weather"][0]; // It's an array
  var tempObj = today["temp"];
  var country = data["city"]["country"];
  var weatherDesc = weather["main"];
  var temp = tempObj["day"];
  var minTemp = tempObj["min"];
  var maxTemp = tempObj["max"];
  var humidity = today["humidity"];
  
  sheet.getRange(NOTATIONS.WEATHER).setValue(weatherDesc);
  sheet.getRange(NOTATIONS.TEMP).setValue(Math.round(temp));
  sheet.getRange(NOTATIONS.TEMP_MIN).setValue(Math.round(minTemp));
  sheet.getRange(NOTATIONS.TEMP_MAX).setValue(Math.round(maxTemp));
  sheet.getRange(NOTATIONS.HUMI).setValue(humidity);
  
  // WeatherApp
  sheet = ss.getSheetByName("WeatherApp");
  sheet.getRange("S5").setValue(data["city"]["name"] + ", " + data["city"]["country"]);
  sheet.getRange("W8").setValue("=IMAGE(\"http://openweathermap.org/img/w/" + weather["icon"] + ".png\")");
  sheet.getRange("W12").setValue(weatherDesc);
  sheet.getRange("U15").setValue(Math.round(temp));
  sheet.getRange("AA15").setValue(Math.round(minTemp) + "°C");
  sheet.getRange("AA17").setValue(Math.round(maxTemp) + "°C");
}
