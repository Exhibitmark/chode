$(function() {
  const electron = require('electron');
  const remote = require('electron').remote;
  const ipc = electron.ipcRenderer;
  var directory
  var response

  //Set Directory Click
  $("#setDir").click(function() {
    inputCheck($('#appInput').val());
  });

  $("#setUser").click(function() {
    let pop= alert("Echo will run and shut down after a few seconds");
    response = ipc.sendSync('messaging','setupUser')
  });

  function directorySuccess(msg){
    $('#appInput').parent().css('border-color', '#52D33B');
    $('#appInput').attr('value', msg)
  }

  function inputCheck(app){
    if(app.endsWith('ready-at-dawn-echo-arena\\bin\\win7')) {
      directory = app.replace(/\\/g, "\\") + '\\echovr.exe';
    } else if (app.endsWith('\\echovr.exe')){
      directory = app.replace(/\\/g, "\\")
    } else if(app.includes('/')) {
        if (app.endsWith('echovr.exe')){
          directory = app.replace(/\//g, "\\")
        } else {
          directory = app.replace(/\//g, "\\") + '\\echovr.exe'
        }
    } else if(app.length < 10) {
      $('#appInput').attr('placeholder', "Please enter your Echo VR directory to use ATLAS").val('').parent().css('border-color', '#FF4864');
    }

    if(app.length > 10){
      response = ipc.sendSync('messaging','setupsend', directory)
      if(response == 'success'){
        directorySuccess(directory)
      } else {
        $('#appInput').attr('placeholder', "ATLAS couldn't find echovr.exe in that directory").val('').parent().css('border-color', '#FF4864');
      }
    }
  }

  function close(){
    let pop = alert("Setup complete. Press ok to start ATLAS");
    close = ipc.sendSync('messaging','start')
    if (close == 1){
      var window = remote.getCurrentWindow();
      window.close();
    }
  }

  ipc.on('master', (e, type, msg,arg) => {
    try{
      switch (type) {
        case 'userSet': 
        if (msg == true){
          close();
        } else {
          console.log("Didn't get username")
        }
        ;break
        case 'defaultDirectory': directorySuccess(msg); break
      }
    }
    catch (e) {
      console.log(e)
    }
  });

  //Minimize App
  $("#minimize").click(function(){
    var window = remote.getCurrentWindow();
    window.minimize();
  });
  
  //Close App
  $("#close").click(function(){
    var window = remote.getCurrentWindow();
    window.close();
  });

});