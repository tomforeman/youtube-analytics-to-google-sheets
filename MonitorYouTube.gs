/*    GS YouTube Stats Monitoring Script     */
/*    ===================================    */
/*    By Tom Foreman @tomforeman 2015        */

// Fill key values with your own then choose Run -> Start

YOUTUBE_V3_API_KEY    = "";
YOUTUBE_VIDEO_ID      = "z1WLgWMLgSE";

function Start_Monitoring()
{
  
  var props = PropertiesService.getScriptProperties();
  
  props.setProperties({
    API_KEY: YOUTUBE_V3_API_KEY,
    VIDEO_ID: YOUTUBE_VIDEO_ID
  });
  
  
  // Delete exiting triggers, if any...
  
  Stop_Monitoring();
  
  // Setup trigger to read YouTube API every thirty minutes
  
  ScriptApp.newTrigger("run_Monitoring")
  .timeBased()
  .everyMinutes(30)
  .create();
}


function Stop_Monitoring() {
  
  var triggers = ScriptApp.getProjectTriggers();
  
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
}


function run_Monitoring() {
  
 var props = PropertiesService.getScriptProperties();
  
  try {
    var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id='+ props.getProperty("VIDEO_ID") +'&key='+ props.getProperty("API_KEY");
    var response = UrlFetchApp.fetch(url);
    
    //UNCOMMENT TO DEBUG RESPONSE
    //Logger.log(response);
    
    var json = response.getContentText();
    var data = JSON.parse(json);
    //Logger.log(data.items[0].statistics);
    addData(data.items[0].statistics,response);
  }
  catch (f) {
    Logger.log("Error: " + f.toString());
  }

}


function addData(statistics,rawData) {
  var props = PropertiesService.getScriptProperties();
  var time = new Date();
  time = Utilities.formatDate(time, "GMT", "dd-MM-yyyy HH:mm:ss");
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  sheet.appendRow([time, props.getProperty("VIDEO_ID"), statistics.viewCount, statistics.likeCount, statistics.dislikeCount, statistics.favoriteCount, statistics.commentCount,rawData]);
  
}
