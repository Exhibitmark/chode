const electron = require('electron');

const {app, BrowserWindow} = electron;
const ipc = electron.ipcMain
const url = require('url');
const path = require('path');
const request = require('request');

//Widget Window Names
let main
//Vars
let loop
let scoreState = 0
let data = {
  "players":[[],[]],
  "teamNames":["",""], //Structure is [Blue Team, Orange Team]
  "scoreArr": [] //Structure is [Blue Team, Orange Team]
}

function createWindows() {
  //Create Browser Windows
  main = new BrowserWindow({frame: false, x:0, y:0,width: 1920, height: 900, webPreferences: {devTools: true}, transparent: true})
  map = new BrowserWindow({frame: false, width: 550, height: 200, webPreferences: {devTools: true}, transparent: true})
  settings = new BrowserWindow({frame: false, x:450, y:600, width: 600, height: 400, webPreferences: {devTools: true}, transparent: true})

  //Load Main Widget
  main.loadURL(url.format({pathname: path.join(__dirname, 'index.html'), protocol:'file:', slashes: true}))

  //Load Map Widget
  map.loadURL(url.format({pathname: path.join(__dirname, 'map.html'), protocol:'file:', slashes: true}))
  
  //Load Stream Widget 
  settings.loadURL(url.format({pathname: path.join(__dirname, 'settings.html'), protocol:'file:', slashes: true})) 
}

app.on('ready', () => {
  createWindows();
  main.maximize()

  //Receives messages from windows
  ipc.on('message', (e, type, message, id) => {
    switch (type) {
      case 'stat' : apiRequest(statTest); break
      case 'teams' : teamChange(message, id); break
      case 'round' : messaging(main,'round',message); break
      case 'resetScore' : resetScore(); break
      case 'resetAll' : resetAll(); break
      case 'pointsUpdate' : setScore(message,id); break
    } 
  })

  function statTest(json){
    messaging(main,'stats',json)
  }

  function init(json) {
    //Sends current score to main window
    apiRequest(getScore)
    //Starts loop to check if match is going
    checkMatchStart(json)
  }

  //Updates score in main window
  function getScore(json) {
    try {
      data.scoreArr[0] = json.blue_points 
      data.scoreArr[1] = json.orange_points;
      messaging(main,'score',data.scoreArr)
    }
    catch(err){
      errorHandler(arguments.callee.name, err)
    }
  }

  //Puts player names into arrays
  function storePlayers(json){
    for (i = 0; i < json.length; i++) {
      try{
        json[i].players.forEach(function(entry) {
          data.players[i].push(entry.name)
        });
      }
      catch(err){
        return
        errorHandler(arguments.callee.name, err)
      }
    }
  }

  function setScore(amount,id) {
    try {
      data.scoreArr[id] = Number(amount)
      messaging(main,'score',data.scoreArr, id)
    }
    catch(err){
      errorHandler(arguments.callee.name, err)
    }
  }
  
  function teamChange(message, id) {
    try{
      data.teamNames[id] = message
      messaging(main,'teams',data.teamNames, id)
    }
    catch(err){
      errorHandler(arguments.callee.name, err)
    }
  }

  //Reset Functions Region
  //#region
  function resetScore() {
    data.scoreArr.forEach(function(value, i){
      setScore(0,i)
    });
  }

  function resetTeams() {
    var defaultTeams = ["Blue", "Orange"]
    data.teamNames.forEach(function(value, i){
      teamChange(defaultTeams[i],i)
    });
  }
  
  function resetAll() {
    resetTeams()
    resetScore()
    messaging(main,'teams',data.teamNames)
    apiRequest(init)
  }
  //#endregion

  function startLoop(time, cb){
    loop = setInterval(function() {
      apiRequest(cb)
    },time);
  }

  function checkMatchStart(json){
    if(json.game_status == 'round_start' || 'playing') {
      storePlayers(json.teams)
      clearInterval(loop)
      startLoop(100,mainLoop)
    } 
    else {
      startLoop(9000,checkMatchStart)
    }
  }

  //Updates possession indicator in main window
  function updatePossession(json){
    json.forEach(function(value, i){
      if(value.possession == true) messaging(main,'possession',i)
    });
  }

  function score(json) {
    scoreState = 1
    json.team === 'blue' ? data.scoreArr[0]=json.blue_points : data.scoreArr[1]=json.orange_points
    messaging(main,'score',data.scoreArr)
  } 

  function mainLoop(json) { 
    updatePossession(json.teams)
    messaging(main,'time',json.game_clock_display)
    if(json.game_status =='playing'){
      scoreState = 0
    }
    //On Score Routine
    if(json.game_status =='score' && scoreState == 0) {
      score(json)
      goalObject = goalObjectBuild(json.last_score)
      messaging(main,'goal',goalObject)
      messaging(main,'stats',json)
    } 

    if(json.game_status == 'post_match') {
      messaging(main,'stats',json)
      clearInterval(loop)
      apiRequest(checkMatchStart) 
    }

  }

  //API Request
  function apiRequest(cb,arg){
    request('http://127.0.0.1/session', { json: true }, (err, reg, body) => {
      try {
        cb(body,arg)
      }
      catch(err) {
        if(typeof body != 'object'){
          resetAll()
        } else {
          console.log("You fucked up reading the json")
          errorHandler(arguments.callee.name, err)
        }
      }
    })
  }

  main.webContents.on('did-finish-load', () => {
    main.on('closed', () => {
      appQuit()
    })
    
    map.on('closed', () => {
      appQuit()
    })   
    
    settings.on('closed', () => {
      appQuit()
    })
    resetTeams()
    messaging(main,'teams',data.teamNames)
    apiRequest(init)
  })

  function goalObjectBuild(json){
    var temp = []
    temp.push(json.point_amount+'-Pointer')
    temp.push(json.person_scored)
    temp.push(json.team === 'blue' ? data.teamNames[0] : data.teamNames[1])
    temp.push(json.assist_scored === '[INVALID]' ? "None" : json.assist_scored)
    temp.push(Math.round(json.disc_speed * 10 ) / 10 + " m/s")
    temp.push(Math.round(json.distance_thrown * 10 ) / 10 + " m")
    return temp
  }

  //Sends messages to windows
  function messaging(window,type,message, id){
    window.webContents.send('messaging', type, message,id)
  }

  //Error Handler
  function errorHandler(errorFunction, nodeError){
    console.log("ERROR from function "+errorFunction+":\n\n"+"FULL NODE ERROR OUTPUT BELOW\n"+"------------------------------------------------\n")
    console.log(nodeError)
  }

  function appQuit(){
     app.quit();
  }
})


//Kills process if app is closed
app.on('window-all-closed', () =>{
  if(process.platform !== 'darwin'){
    app.quit();
  }
});

//Catches all errors to //console
process.on('uncaughtException', function (err) {
  str = err.toString();
  console.log(str)
});   