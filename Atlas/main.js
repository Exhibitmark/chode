const electron = require('electron');
const {app, ipcMain, dialog} = electron;
const path = require('path');
const request = require('request');
const Cryptr = require('cryptr');
const url = require('url');
const Window = require('./Window')
const Match = require('./Match')
const fs = require("fs");
const createURL = "<CREATION API URL>"
const removeURL = "<REMOVAL API URL>"
const matchlistURL = "<MATCHLIST API URL>"
const headers = {'User-Agent':'Atlas/'+app.getVersion()}
const disallowPubs = true;
let main, setup, user, settings, mlurl, refreshInterval,gamePath
let runFlags = ['-lobbyid',''] //Order is spectatorstream, capturevp2, lobbyID
let deeplinkingUrl

const userDataPath = (electron.app || electron.remote.app).getPath('userData');

// Force Single Instance Application
const gotTheLock = app.requestSingleInstanceLock()
if (gotTheLock) {
  app.on('second-instance', (e, argv) => {
    // Someone tried to run a second instance, we should focus our window.
    // Protocol handler for win32
    // argv: An array of the second instance’s (command line / deep linked) arguments
    if (process.platform == 'win32') {
      // Keep only command line / deep linked arguments
      deeplinkingUrl = argv.slice(1)
    }
    if (main) {
      if (main.isMinimized()) main.restore()
      main.focus()
    deeplinkJoin();
    }

  })
} else {
  app.quit()
  return
}

// Protocol handler for win32
if (process.platform == 'win32') {
  // Keep only command line / deep linked arguments
  deeplinkingUrl = process.argv.slice(1)
}

// Listen for app to be ready
app.on('ready', () => {
  readFile(atlasSetup)
});

function atlasSetup(settingsFile){
  try{
    settings = JSON.parse(settingsFile)
    setUUID();
    if (settings.key !== undefined || settings.key.length == 0){
      decrypt(settings.key);
      messaging(main,'user', user)
      console.log("Decrypted username is: "+user)
    }
  }
  catch(err){
  }
  createWindows();
}

//CREATE WINDOWS
function createWindows() {
  if(settings == undefined){ 
    // Setup ATLAS window
    setup = new Window({
      file: path.join('./setup.html'),
      width: 600,
      height: 400,
    })
    setup.webContents.on('did-finish-load',()=>{
      let defaultDir = 'C:\\Program Files\\Oculus Apps\\Software\\ready-at-dawn-echo-arena\\bin\\win7'
      let check = setupSend(defaultDir)
      if(check == 'success'){
        messaging(setup,'defaultDirectory',defaultDir)
      } else {
        //registry()
        return
      }
    })
  } else {
    // Main ATLAS window
    main = new Window({
      file: path.join('./index.html'),
      x: settings.x,
      y: settings.y,
      width: 505,
      height: 850,
      minWidth: 505,
      minHeight: 850,
      maxHeight: 1200,
      maxWidth: 1000
    })

    main.webContents.on('new-window', function(e, url) {
      e.preventDefault();
      require('electron').shell.openExternal(url);
    });
    main.webContents.on('did-finish-load', () => {
      if(settings.captureFlag == "-capturevp2"){
        messaging(main,'captureFlag', true, '')
      }
      messaging(main,'user', user)
      mlurl = matchlistURL+user 
      postRequest(createMatches,mlurl, true)
      deeplinkJoin();
    });

    //STORES LAST WINDOW POSITION
    main.on('close', () => { 
      let bounds = main.getBounds();
      settings.x = bounds.x
      settings.y = bounds.y
      writeFile(settings)
    })
    checkAtlasVersion()
  }
  return
}

function checkAtlasVersion() {
 let v = app.getVersion();
 let address = "<VERSIONING API URL>"+v;
 postRequest(atlasCheckUp, address, {'v':v})
 refreshLoop();
}

function atlasCheckUp(json){
  console.log("Version Check");

  //console.log(json);
  if('status' in json && json.status==true) {
    const options ={
      type:'info',
      buttons: ['OK'],
      message: 'Update',
      detail: 'ATLAS will close and restart when finished updating\nPress OK to start update.'
    }
    let alert = dialog.showMessageBox(null, options);
    const { spawn } = require('child_process');
    let updater = spawn('updater.exe', [], {detached: true});
    updater.stderr.on('data', (data) => {
      console.log(`stderr: ${data}`);
    });
    app.quit();

  } else {
    console.log(json.msg);
    return
  }
}

function deeplinkJoin(){
  if(deeplinkingUrl && deeplinkingUrl != ""){

    const deepurl = new URL(deeplinkingUrl);
    
    deepMatch = deepurl.pathname.substring(1);

    if(deepurl.hostname == 'spectate'){
      if(settings.captureFlag) {
        runFlags.unshift(settings.captureFlag); 
      }
      runFlags.unshift('-spectatorstream');
      runGame('join', deepMatch);
    } else if(deepurl.hostname == 'join'){
      runGame('join', deepMatch);
    } else if(deepurl.hostname == 'pubs'){
      runGame('autopubs', '');
    } else {
      runGame('startGame', deepMatch)
    }
  }
}

//Refreshes matchlist every N-seconds
function refreshLoop(){
  refreshInterval = setInterval(function(){ 
    mlurl = matchlistURL+user;
    postRequest(createMatches,mlurl, true)
  }, 45000);
}

//CREATE AND SET UUID
function setUUID(uuid){
  if (uuid == undefined) {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    uuid = s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    settings.uuid = uuid
  } else {
  }
}

//Simple encrypt
function encrypt(user){
  const cryptr = new Cryptr('QPAH6Ng15V67RWmxvxGhajbjntbzrkci');
  console.log('encrypted')
  settings.key = cryptr.encrypt(user)
  writeFile(settings)
  return
}

//Simple decrypt
function decrypt(arg){ 
  try{
    const cryptr = new Cryptr('QPAH6Ng15V67RWmxvxGhajbjntbzrkci');
    user = cryptr.decrypt(arg)
    return
  }
  catch(err){
    return
  }
}

//PATH VERIFICATION
function fileVerify(path) {
  try {
    let pathCheck = fs.lstatSync(path);
    if (pathCheck.isFile() == true) {
      return true
    }
  }
  catch(e){
    return 'False'
  }
}

//DIRECTORY SETTING
function setDirectory(arg) {
  let directory
  if(arg.substr(arg.length-33) == "ready-at-dawn-echo-arena\\bin\\win7") {
    directory = arg.replace(/\\/g, "\\")+'\\echovr.exe';
  } else if(arg.substr(arg.length-11) == "\\echovr.exe") {
    directory = arg.replace(/\\/g, "\\");
  } else if(arg.substr(arg.length-33) == "ready-at-dawn-echo-arena/bin/win7") {
    return "fSlash"
  }

  let check = fileVerify(directory)
  if(check != 'False') {
    settings.directory = directory
    writeFile(settings)
    return directory
  } else {
    return 'Fail'
  }
}

//Get Username 1st Method
function userGet(data) {
  data = data.split("Logged in user name: ").pop();
  data = data.substr(0, data.indexOf('\n'));
  data = data.substr(0, data.indexOf('\r'));
  console.log('Got username on startup')
  console.log(data)
  if(data !== undefined){
    encrypt(data);
    messaging(setup,'userSet', true, '')
  } else {
    messaging(setup,'userSet', false, '')
  }
  return
}

//Delete From API
function removeFromAPI(cb,u,matchid){
  request.post(removeURL, {headers: headers, json: {"username":u, "matchid":matchid} }, (err, reg, body) => {
    try {
      cb(body)
    }
    catch(err) {
      console.log("Exhibit fucked up reading the json")
      errorHandler(arguments.callee.name, err)
    }
  })
}

//Send to match API
function createMatchAPI(match){
  console.log('createMatchAPI')
  postRequest(hostMatchReturn, createURL, match);
}

function hostMatchReturn(json){
  //Updates the host UI after posting a match
  console.log('host match return')
  messaging(main,'hostMatch', json, user)
}

function postRequest(cb, address, message){
  request.post(address, {headers: headers, json: message }, (err, reg, body) => {
    try {
      cb(body)
    }
    catch(err) {
      console.log("Exhibit fucked up a post request")
      errorHandler(arguments.callee.name, err)
    }
  })
}

//Add & Send Matchlist
function createMatches(json) {
  try{
    console.log("Matches Refresh")
    messaging(main,'newMatch', json, user)
  }
  catch(e){
    console.log(e)
  }
}

function removeFromMatchlist(){
  mlurl = matchlistURL+user;
  postRequest(createMatches,mlurl, true)
}

//Create Match
function createMatch(json,matchSettings){
  let match
  try {
    match = new Match(json, matchSettings);
    encrypt(json.client_name)
    if(disallowPubs==true && match.private_match == false){
      let errType = "HOST ERROR";
      let errMsg = "You can't host a pub.\n";
      messaging(main,'error', errType, errMsg)
    } else {
      createMatchAPI(match)
      mlurl = matchlistURL+user;
      postRequest(createMatches,mlurl, true)   
    }
  }
  catch {
    let errType = "REQUEST ERROR";
    let errMsg = "You can't host unless you're in a private match.";        
    messaging(main,'error', errType, errMsg)
  }
}

//API Request
function apiRequest(cb,matchSettings){
  request('http://127.0.0.1/session', { json: true }, (err, reg, body) => {
    try {
      cb(body,matchSettings)
    }
    catch(err) {
      if(typeof body != 'object'){
        let errType = "REQUEST ERROR";
        let errMsg = "You can't host unless you're in a private match.";
        messaging(main,'error', errType, errMsg)
      } 
      console.log("Exhibit fucked up reading the json")
      errorHandler(arguments.callee.name, err)
    }
  })
}

//Run EchoVR
function runGame(type, id) {
  console.log('running game')
  const spawn = require('child_process').spawn;
  let child;
  runFlags[runFlags.length-1] = id

  print('Starting game using these settings:\n\n'+'type: '+ type +'\n'+'id: '+ id+'\n'+'runflags: '+ runFlags)
  try {
    switch (type) {
      case 'join' : child = spawn(settings.directory, runFlags, {detached: true, stdio: 'ignore'}); break
      case 'startGame' : child = spawn(settings.directory, {detached: true, stdio: 'ignore'}); break
      case 'autopubs' : 
        var pubflags = ['-spectatorstream'];
        if(settings.captureFlag) {pubflags.push(settings.captureFlag)}
        child = spawn(settings.directory, pubflags, {detached: true, stdio: 'ignore'}); 
        break
      case 'firstTime' : child = spawn(settings.directory,['-spectatorstream'], {detached: true}); break 
    }
  }
  catch (e) {
    let errType = "DIRECTORY ERROR\n\n";
    let errMsg = "Provided Directory is invalid\n"
    console.log(errMsg)
    messaging(main,'error', errType, errMsg)
  } 

  if (type == 'firstTime') {
    console.log('runnig first time')
    child.stdout.on('data', function(data){
      if(data.toString().includes("Logged in user name: ")){
        print('Found username')
        userGet(data.toString());
        child.kill()
      }
    })
    child.stderr.on('data', function(data) {
      console.log('stderr: ' + data);
    });

  }
  
  child.unref();
}

ipcMain.on('messaging', (e,type,msg,arg) => {
  try{
    switch (type) {
      //ATLAS SETUP MESSAGES
      case 'start': e.returnValue = 1; readFile(atlasSetup); break
      case 'setupsend': e.returnValue = setupSend(msg); break;
      case 'setupUser': e.returnValue =1; runGame('firstTime'); break;
      //ATLAS MAIN WINDOW
      case 'getSettings' : e.returnValue = settings; break
      case 'setCaptureFlag' : e.returnValue = 1; setCapture(msg); break
      case 'getVersion' : e.returnValue = app.getVersion(); break
      case 'setDirectory' : e.returnValue = setDirectory(msg); break
      case 'createMatch' : e.returnValue = 1; apiRequest(createMatch,msg); break 
      case 'join' : e.returnValue = 1; runGame(type, msg); break
      case 'spectate' : 
        e.returnValue = 1;
        if(settings.captureFlag) {
          runFlags.unshift(settings.captureFlag); 
        }
        runFlags.unshift('-spectatorstream'); 
        runGame('join', msg); 
        break
      case 'startGame' :e.returnValue = 1; runGame(type, msg); break
      case 'autopubs' : e.returnValue = 1; runGame(type, msg); break
      case 'refresh' :e.returnValue = 1; mlurl = matchlistURL+user; postRequest(createMatches,mlurl, true); break
      case 'removeMatch' : e.returnValue = 1;removeFromAPI(removeFromMatchlist,msg,arg); break
    }
  }
  catch (e) {
    print(e)
    let errType = "DIRECTORY ERROR\n\n";
    let errMsg = "Provided Directory is invalid\n"
    messaging(main,'error', errType, errMsg)
  }
});

if (!app.isDefaultProtocolClient('atlas')) {
  // Define custom protocol handler. Deep linking works on packaged versions of the application!
  app.setAsDefaultProtocolClient('atlas')
}

function setCapture(val){
  if(val == "1"){
    settings.captureFlag = "-capturevp2"
  } else {
    settings.captureFlag = "";
  }
  writeFile(settings);
}

function setupSend(data){ 
  try {
    let appCheck = fileVerify(data)
    if (appCheck == 'False') {
      return 'failed';
    }
    let bounds = setup.getBounds();
    settings = {"directory":data, "x":bounds.x, "y":bounds.y, "key":'', "uuid": '',"captureFlag":""}
    writeFile(settings)
    return 'success';
  }
  catch(err){
    console.log(err)
    return 'failed';
  }
}

function writeFile(data){
  fs.writeFile(path.join(userDataPath,'config'), JSON.stringify(data), (err) => {
    if (err) throw err;
  });
}

function readFile(cb){
  try{
    fs.readFile(path.join(userDataPath,'config'), (err, data) => {
      cb(data)
    });
  }
  catch(err){
    cb()
  }
}

function messaging(window,type,message, arg1){
  window.webContents.send('master', type, message,arg1)
}

//Error Handler
function errorHandler(errorFunction, nodeError){
  console.log("ERROR from function "+errorFunction+":\n\n"+"FULL ERROR OUTPUT BELOW\n"+"------------------------------------------------\n")
  console.log(nodeError)
}

//Helpers
function print(arg){
  console.log(arg)
}

process.on('uncaughtException', function (err) {
});

app.on('window-all-closed', () =>{
  if(process.platform !== 'darwin'){
    app.quit();
  }
});
